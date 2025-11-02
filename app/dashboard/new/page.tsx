'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";

export default function NewPostPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    coverImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const { startUpload } = useUploadThing("imageUploader");

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  console.log("📁 File selected:", file);
  
  if (file) {
    console.log("📋 File details:", {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    setImageFile(file);
    
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const result = reader.result as string;
      console.log("✅ FileReader complete, preview length:", result.length);
      console.log("🖼️ Setting preview...");
      setImagePreview(result);
    };
    
    reader.onerror = (error) => {
      console.error("❌ FileReader error:", error);
    };
    
    console.log("📖 Starting FileReader...");
    reader.readAsDataURL(file);
  } else {
    console.log("❌ No file selected");
  }
};

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, coverImage: "" });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    let coverImageUrl = "";

    if (imageFile) {
      setUploading(true);
      console.log("📤 Starting upload...");
      
      try {
        const uploadResult = await startUpload([imageFile]);
        console.log("✅ Upload result:", uploadResult);

        if (uploadResult && uploadResult[0]) {
          coverImageUrl = uploadResult[0].url;
          console.log("🖼️ Image URL:", coverImageUrl);
          console.log("🔑 UFS URL:", uploadResult[0].ufsUrl);
        } else {
          throw new Error("Upload failed - no URL returned");
        }
      } catch (uploadError: any) {
        console.error("❌ Upload error:", uploadError);
        toast.error("Image upload failed: " + uploadError.message);
        setLoading(false);
        setUploading(false);
        return; 
      }
      
      setUploading(false);
    }

    console.log("📝 Creating post with data:", {
      ...formData,
      coverImage: coverImageUrl
    });

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        coverImage: coverImageUrl,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    toast.success("Post created successfully! 🎉");
    router.push("/dashboard");
  } catch (error: any) {
    console.error("❌ Submit error:", error);
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 bg-linear-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ring-purple-500/30">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-slate-400">Please login to create a post</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors mb-4 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Create New Post
          </h1>
          <p className="text-slate-400 mt-2">Share your thoughts with the world ✨</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Upload */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50 animate-slide-up">
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              Cover Image (Optional)
            </label>

            {!imagePreview ? (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="cover-image"
                />
                <label
                  htmlFor="cover-image"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer bg-linear-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-700/50 hover:to-slate-800/50 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-12 h-12 mb-4 text-purple-400 group-hover:text-purple-300 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-slate-300 font-medium">
                      Click to upload cover image
                    </p>
                    <p className="text-xs text-slate-500">PNG, JPG up to 4MB</p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden group ring-2 ring-purple-500/30 h-64">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 shadow-lg transform hover:scale-105"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-lg text-white placeholder-slate-500"
              placeholder="Enter an engaging title..."
            />
          </div>

          {/* Short Description */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              Short Description (Optional)
            </label>
            <input
              type="text"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-white placeholder-slate-500"
              placeholder="A brief summary of your post..."
            />
            <p className="text-xs text-slate-500 mt-2">
              This will appear in previews and search results
            </p>
          </div>

          {/* Content */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              Content *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none text-white placeholder-slate-500"
              rows={16}
              placeholder="Write your story here... ✨"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-slate-500">
                {formData.content.length} characters
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-slate-700/50 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-all border border-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-8 py-3 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading Image...
                </>
              ) : loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Publish Post
                </>
              )}
            </button>
          </div>  
        </form>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out backwards;
        }
      `}</style>
    </div>
  );
}