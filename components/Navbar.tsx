'use client';
 import Link from 'next/link';
 import { useSession, signOut } from 'next-auth/react';
 export default function Navbar() {
 const { data: session } = useSession();
 return (
 <nav className="bg-white shadow-sm border-b">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex justify-between h-16 items-center">
 <Link href="/" className="text-2xl font-bold text-blue-600">
 BlogApp
 </Link>
 <div className="flex items-center gap-4">
 {session ? (
 <>
 <Link
 href="/dashboard"
 className="text-gray-700 hover:text-blue-600"
 >
 Dashboard
 </Link>
 <Link
 href={`/profile/${session.user.id}`}
 className="text-gray-700 hover:text-blue-600"
 >
 Profile
 </Link>
 <button
 onClick={() => signOut()}
 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
 >
 Logout
 </button>
 </>
 ) : (
 <>
 <Link
 href="/login"
 className="text-gray-700 hover:text-blue-600"
 >
 Login
 </Link>
 <Link
 href="/register"
 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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