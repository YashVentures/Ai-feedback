'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {
  const { data: session } = useSession();
  const user : User = session?.user;

  return (
    <nav className="px-6 py-4 bg-white border-b border-[#e8ebe6] sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
        <Link href="/" className="flex items-center space-x-2 text-xl font-black text-[#0e0f0c] tracking-tight">
          <span className="w-3.5 h-3.5 rounded-full bg-[#9fe870] inline-block" />
          <span>True Feedback</span>
        </Link>
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-[#454745]">
              Welcome, <strong className="text-[#0e0f0c] font-semibold">{user.username || user.email}</strong>
            </span>
            <Button
              onClick={() => signOut()}
              className="bg-[#e8ebe6] text-[#0e0f0c] hover:bg-[#d5dad2] rounded-full font-semibold px-5 py-2 text-sm border-0 shadow-none transition-colors"
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link href="/sign-in">
              <Button className="bg-[#e8ebe6] text-[#0e0f0c] hover:bg-[#d5dad2] rounded-full font-semibold px-5 py-2 text-sm border-0 shadow-none transition-colors">
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-[#9fe870] text-[#0e0f0c] hover:bg-[#cdffad] rounded-full font-semibold px-5 py-2 text-sm border-0 shadow-none transition-colors">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;