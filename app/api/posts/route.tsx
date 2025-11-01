import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.id) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 401 }
      );
    }

    // ✅ Now also accepting coverImage
    const { title, content, excerpt, coverImage } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Create unique slug
    let slug = createSlug(title);
    let slugExists = await Post.findOne({ slug });
    let counter = 1;

    while (slugExists) {
      slug = `${createSlug(title)}-${counter}`;
      slugExists = await Post.findOne({ slug });
      counter++;
    }

    // ✅ Include coverImage in post data
    const postData = {
      title,
      slug,
      content,
      excerpt: excerpt || '',
      coverImage: coverImage || '', // ✅ Add cover image
      author: session.user.id,
    };

    const post = await Post.create(postData);

    return NextResponse.json(
      { message: "Post created", post },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}