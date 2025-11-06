"use client"
import { useSession } from "next-auth/react";
import Link from "next/link";

import React from "react";

export default function Footer() {
  const { data: session } = useSession();
  return (
    <footer className="border-t border-slate-800 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/logo.png" 
                alt="Scrybe Logo" 
                className="h-15 w-auto rounded-lg"
              />
              <h3 className="text-xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Scrybe
              </h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              A modern blogging platform built for writers who want to share
              their stories with the world.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 hover:text-purple-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              {session ? (
                <>
                  <li>
                    <Link
                      href="/dashboard"
                      className="text-slate-400 hover:text-purple-400 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/profile/${session.user.id}`}
                      className="text-slate-400 hover:text-purple-400 transition-colors"
                    >
                      Profile
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="text-slate-400 hover:text-purple-400 transition-colors"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="text-slate-400 hover:text-purple-400 transition-colors"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="text-slate-400 hover:text-purple-400 transition-colors cursor-pointer">
                  Twitter
                </a>
              </li>
              <li>
                <a className="text-slate-400 hover:text-purple-400 transition-colors cursor-pointer">
                  GitHub
                </a>
              </li>
              <li>
                <a className="text-slate-400 hover:text-purple-400 transition-colors cursor-pointer">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center space-y-2">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Scrybe. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Developed by <span className="font-medium text-violet-400">Mohammed Hafeez</span> - 
            <a 
              href="https://hafzism.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline hover:text-violet-400 ml-1"
            >
              hafzism.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}