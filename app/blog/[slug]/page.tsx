import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { notFound } from "next/navigation";
import Link from "next/link";

async function getPost(slug: string) {
  await connectDB();
  const post = await Post.findOne({ slug })
    .populate("author", "name image bio")
    .lean();

  if (!post) return null;

  return JSON.parse(JSON.stringify(post));
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params; 
  const post = await getPost(slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Cover Image Hero */}
      {post.coverImage && (
        <div className="relative h-96 w-full overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-slate-950/20"></div>
        </div>
      )}

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Title Section */}
        <article className={post.coverImage ? "-mt-32 relative z-10" : "pt-12"}>
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Author Card */}
            <div className="flex items-center gap-4 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
              <img 
                src={post.author.image || '/default-avatar.jpg'} 
                alt={post.author.name}
                className="w-16 h-16 rounded-full ring-4 ring-purple-500/30"
              />
              <div className="flex-1">
                <Link 
                  href={`/profile/${post.author._id}`}
                  className="font-semibold text-lg text-white hover:text-purple-400 transition-colors"
                >
                  {post.author.name}
                </Link>
                {post.author.bio && (
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {post.author.bio}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {post.views !== undefined && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{post.views || 0} views</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8 md:p-12 mb-12">
            <div className="prose prose-invert prose-lg max-w-none">
              <div 
                className="text-slate-300 leading-relaxed whitespace-pre-wrap"
                style={{ 
                  fontSize: '1.125rem',
                  lineHeight: '1.75rem'
                }}
              >
                {post.content}
              </div>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="flex justify-center mb-12">
            <Link
              href="/"
              className="group flex items-center gap-2 px-6 py-3 bg-slate-800/50 backdrop-blur-sm text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-all duration-200 border border-slate-700/50"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>

          {post.author.bio && (
            <div className="bg-linear-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-purple-500/20 mb-12">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                About the Author
              </h3>
              <div className="flex items-start gap-4">
                <img 
                  src={post.author.image || '/default-avatar.jpg'} 
                  alt={post.author.name}
                  className="w-20 h-20 rounded-full ring-4 ring-purple-500/30"
                />
                <div>
                  <Link 
                    href={`/profile/${post.author._id}`}
                    className="text-lg font-semibold text-white hover:text-purple-400 transition-colors"
                  >
                    {post.author.name}
                  </Link>
                  <p className="text-slate-400 mt-2 leading-relaxed">
                    {post.author.bio}
                  </p>
                  <Link
                    href={`/profile/${post.author._id}`}
                    className="inline-flex items-center gap-2 mt-3 text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium"
                  >
                    <span>View Profile</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}