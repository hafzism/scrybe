import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

interface PostType {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  createdAt: string;
  views?: number;
  author: {
    name: string;
    image?: string;
  };
}

async function getPosts() {
  await connectDB();
  const posts = await Post.find()
    .populate('author', 'name image')
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();
  
  return JSON.parse(JSON.stringify(posts));
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const posts: PostType[] = await getPosts();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-purple-500/10 via-transparent to-transparent"></div>
        <div className="max-w-6xl mx-auto px-4 py-20 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Welcome to SCRYBE!  
            </h1>
            <p className="text-xl text-slate-400 mb-8">
              Discover amazing stories, tutorials, and insights from our community of writers ✨
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {session ? (
                <>
                  <Link
                    href="/dashboard/new"
                    className="px-8 py-3 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create New Post</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-8 py-3 bg-slate-800/50 backdrop-blur-sm text-slate-300 rounded-lg font-semibold hover:bg-slate-700 transition-all duration-200 border border-slate-700/50"
                  >
                    My Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="px-8 py-3 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <span>Start Writing</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="#posts"
                    className="px-8 py-3 bg-slate-800/50 backdrop-blur-sm text-slate-300 rounded-lg font-semibold hover:bg-slate-700 transition-all duration-200 border border-slate-700/50"
                  >
                    Explore Posts
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Posts Section */}
        <div id="posts" className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Latest Posts</h2>
              <p className="text-slate-400">Fresh content from our community</p>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">No posts yet</h3>
              <p className="text-slate-500 mb-6 text-center max-w-md">
                Be the first to share your story with the world!
              </p>
              {session ? (
                <Link
                  href="/dashboard/new"
                  className="px-6 py-3 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-purple-500/20 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Post
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="px-6 py-3 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-purple-500/20 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Sign Up to Write
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
                >
                  {/* Cover Image */}
                  {post.coverImage ? (
                    <div className="relative h-48 overflow-hidden bg-slate-900">
                      <Image 
                        src={post.coverImage} 
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="relative h-48 bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <svg className="w-16 h-16 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    {post.excerpt && (
                      <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Author & Date */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
                      <div className="relative w-8 h-8 shrink-0">
                        <Image 
                          src={post.author.image || '/default-avatar.jpg'} 
                          alt={post.author.name}
                          fill
                          className="rounded-full ring-2 ring-purple-500/30 object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-300 truncate">
                          {post.author.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      {post.views !== undefined && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{post.views || 0}</span>
                        </div>
                      )}
                    </div>

                    {/* Read More */}
                    <div className="mt-4 flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors text-sm font-medium">
                      <span>Read more</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        {!session && (
          <div className="bg-linear-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-12 text-center border border-purple-500/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Share Your Story?
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Join our community of writers and start publishing your ideas today. It&apos;s free and takes less than a minute!
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5"
            >
              <span>Get Started Now</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}