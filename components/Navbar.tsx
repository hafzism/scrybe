"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center"
            onClick={closeMobileMenu}
          >
            <img 
              src="/logo.png" 
              alt="Scrybe" 
              className="h-11 w-auto rounded-lg hover:opacity-80 transition-opacity duration-200"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
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
                  <span className="text-sm font-medium text-slate-200 hidden lg:block">
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-slate-300 hover:text-white transition-colors duration-200 p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-slate-800 mt-2">
            {session ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-800 rounded-lg">
                  <img 
                    src={session.user.image || '/default-avatar.jpg'} 
                    alt={session.user.name}
                    className="h-10 w-10 rounded-full ring-2 ring-purple-500/50"
                  />
                  <span className="text-sm font-medium text-slate-200">
                    {session.user.name}
                  </span>
                </div>

                <Link
                  href="/dashboard"
                  className="block text-slate-300 hover:text-white transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-slate-800"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Link
                  href={`/profile/${session.user.id}`}
                  className="block text-slate-300 hover:text-white transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-slate-800"
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>

                <button
                  onClick={() => {
                    signOut();
                    closeMobileMenu();
                  }}
                  className="w-full px-4 py-2 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg shadow-red-500/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-slate-300 hover:text-white transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-slate-800"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-5 py-2 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg shadow-purple-500/20 text-center"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}