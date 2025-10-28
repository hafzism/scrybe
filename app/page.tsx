'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">MyApp</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <div className="flex items-center gap-3">
                    <img 
                      src={session.user.image} 
                      alt={session.user.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {session.user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to MyApp
          </h1>
          
          {session ? (
            <div className="mt-8 bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🎉 You're logged in!
              </h2>
              <div className="text-left space-y-3">
                <p className="text-gray-700">
                  <span className="font-semibold">Name:</span> {session.user.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> {session.user.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">User ID:</span> {session.user.id}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <p className="text-lg text-gray-600 mb-6">
                Please login or create an account to continue
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/login"
                  className="px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 text-lg font-medium text-indigo-600 bg-white border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-200"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}