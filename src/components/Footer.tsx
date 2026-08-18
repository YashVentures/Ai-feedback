import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0e0f0c] text-[#e8ebe6] py-12 px-6 border-t border-[#163300]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 rounded-full bg-[#9fe870] inline-block" />
          <span className="text-xl font-bold tracking-tight text-white">
            True Feedback
          </span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm text-[#868685]">
          <Link href="/" className="hover:text-[#9fe870] transition-colors">
            Home
          </Link>
          <Link href="/sign-in" className="hover:text-[#9fe870] transition-colors">
            Sign In
          </Link>
          <Link href="/sign-up" className="hover:text-[#9fe870] transition-colors">
            Get Started
          </Link>
        </div>

        <p className="text-xs text-[#868685]">
          © {new Date().getFullYear()} True Feedback. Honest, anonymous messaging.
        </p>
      </div>
    </footer>
  );
}
