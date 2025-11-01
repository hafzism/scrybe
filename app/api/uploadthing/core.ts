import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing({
  errorFormatter: (err) => {
    console.error("🔴 UPLOADTHING ERROR:", err);
    return {
      message: err.message,
      code: err.code,
      data: err.data,
    };
  },
});

console.log("=== UPLOADTHING CONFIG ===");
console.log("Secret exists:", !!process.env.UPLOADTHING_SECRET);
console.log(
  "Secret starts with sk_live_:",
  process.env.UPLOADTHING_SECRET?.startsWith("sk_live_")
);
console.log("App ID exists:", !!process.env.UPLOADTHING_APP_ID);
console.log("App ID length:", process.env.UPLOADTHING_APP_ID?.length);

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async (req) => {
      console.log("=== UPLOADTHING MIDDLEWARE ===");

      try {
        const session = await getServerSession(authOptions);
        console.log("Session exists:", !!session);
        console.log("User ID:", session?.user?.id);

        if (!session || !session.user?.id) {
          console.log("⚠️ No session - allowing for registration");
          return { userId: "registration-pending" };
        }

        console.log("✅ Middleware passed");
        return { userId: session.user.id };
      } catch (error) {
        console.error("❌ Middleware error:", error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("=== UPLOAD COMPLETE ===");
      console.log("User ID:", metadata.userId);
      console.log("File uploaded successfully!");
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
