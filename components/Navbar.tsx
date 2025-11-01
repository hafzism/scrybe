"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-slate-900 border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold bg-linear-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent hover:from-purple-300 hover:to-blue-400 transition-all duration-300"
          >
              SCRYBE
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href={`/profile/${session.user.id}`}
                  className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Profile
                </Link>
                
                {/* User Avatar & Name */}
                <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-800 rounded-lg">
                  <img 
                    src={session.user.image || '/default-avatar.jpg'} 
                    alt={session.user.name}
                    className="h-8 w-8 rounded-full ring-2 ring-purple-500/50"
                  />
                  <span className="text-sm font-medium text-slate-200 hidden sm:block">
                    {session.user.name}
                  </span>
                </div>

                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}