import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ProfileClient from '@/components/ProfileClient';

interface UserType {
  _id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  createdAt: string;
}

interface PostType {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  createdAt: string;
  views?: number;
}

async function getUserWithPosts(userId: string) {
  await connectDB();
  
  const user = await User.findById(userId).select('-password').lean();
  if (!user) return null;

  const posts = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .lean();

  return {
    user: JSON.parse(JSON.stringify(user)),
    posts: JSON.parse(JSON.stringify(posts)),
  };
}

export default async function ProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const data = await getUserWithPosts(id);
  const session = await getServerSession(authOptions);

  if (!data) {
    notFound();
  }

  const { user, posts }: { user: UserType; posts: PostType[] } = data;
  const isOwnProfile = session?.user?.id === id;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden mb-8">
          {/* Cover Image / Banner */}
          <div className="h-48 bg-linear-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 relative">
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-800/50"></div>
          </div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            <div className="flex items-start gap-6 flex-col sm:flex-row -mt-16 relative z-10">
              {/* Profile Image */}
              <div className="relative group">
                {user.image && user.image !== '/default-avatar.jpg' ? (
                  <div className="relative w-32 h-32">
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      className="rounded-full object-cover ring-4 ring-slate-800 shadow-xl"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-5xl font-bold text-white shadow-xl ring-4 ring-slate-800">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="flex-1 mt-16 sm:mt-4">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                    <p className="text-slate-400 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      {user.email}
                    </p>
                    <p className="text-slate-500 text-sm flex items-center gap-2 mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                    {user.bio && (
                      <p className="text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                        {user.bio}
                      </p>
                    )}
                  </div>
                  
                  {isOwnProfile && (
                    <ProfileClient user={user} />
                  )}
                </div>

                {/* Stats */}

              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
            <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Posts by {user.name}
          </h2>

          {posts.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-slate-700/50">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-400 text-lg mb-4">No posts yet.</p>
              {isOwnProfile && (
                <Link
                  href="/dashboard/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg shadow-purple-500/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Write your first post
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <article 
                  key={post._id} 
                  className="group bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
                >
                  {/* Cover Image */}
                  {post.coverImage ? (
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative h-48 overflow-hidden bg-slate-900">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                      </div>
                    </Link>
                  ) : (
                    <div className="relative h-48 bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <svg className="w-16 h-16 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 mb-2 line-clamp-2 transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      {post.views !== undefined && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{post.views || 0}</span>
                        </div>
                      )}
                    </div>

                    {post.excerpt && (
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    )}

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors group/link text-sm"
                    >
                      <span>Read more</span>
                      <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}