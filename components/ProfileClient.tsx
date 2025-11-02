'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useUploadThing } from '@/lib/uploadthing';

interface ProfileClientProps {
  user: {
    _id: string;
    name: string;
    image?: string;
    bio?: string;
  };
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    image: user.image || '/default-avatar.jpg',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(user.image || '/default-avatar.jpg');

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
    setImagePreview('/default-avatar.jpg');
    setFormData({ ...formData, image: '/default-avatar.jpg' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profileImageUrl = formData.image;

      if (imageFile) {
        setUploading(true);
        console.log("📤 Starting upload...");
        
        try {
          const uploadResult = await startUpload([imageFile]);
          console.log("✅ Upload result:", uploadResult);

          if (uploadResult && uploadResult[0]) {
            profileImageUrl = uploadResult[0].url;
            console.log("🖼️ Image URL:", profileImageUrl);
            console.log("🔑 UFS URL:", uploadResult[0].ufsUrl);
          } else {
            throw new Error("Upload failed - no URL returned");
          }
        } catch (uploadError) {
          const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown error';
          console.error("❌ Upload error:", uploadError);
          toast.error("Image upload failed: " + errorMessage);
          setLoading(false);
          setUploading(false);
          return;
        }
        
        setUploading(false);
      }

      console.log("📝 Updating profile with data:", {
        name: formData.name,
        image: profileImageUrl,
      });

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          image: profileImageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success('Profile updated successfully! ✨');
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("❌ Submit error:", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Edit Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-5 py-2.5 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Edit Profile
      </button>

      {/* Modal - Fixed with scrollable container and proper viewport height */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-slate-800 rounded-2xl max-w-md w-full p-8 shadow-2xl border border-slate-700 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Edit Profile
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3 text-center">
                  Profile Picture
                </label>
                <div className="flex justify-center">
                  {imagePreview && imagePreview !== '/default-avatar.jpg' ? (
                    <div className="relative group">
                      <div className="relative w-32 h-32">
                        <Image
                          src={imagePreview}
                          alt="Profile preview"
                          fill
                          className="rounded-full object-cover ring-4 ring-purple-500/30"
                        />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="edit-profile-image"
                          />
                          <label
                            htmlFor="edit-profile-image"
                            className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 cursor-pointer shadow-lg"
                          >
                            Change
                          </label>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-red-600 shadow-lg"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-5xl font-bold text-white ring-4 ring-purple-500/30">
                        {formData.name.charAt(0).toUpperCase()}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="edit-profile-image"
                      />
                      <label
                        htmlFor="edit-profile-image"
                        className="absolute bottom-0 right-0 bg-purple-500 text-white p-2.5 rounded-full cursor-pointer hover:bg-purple-600 shadow-lg ring-4 ring-slate-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-200 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-white placeholder-slate-500"
                  placeholder="Your name"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Uploading...
                    </span>
                  ) : loading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}