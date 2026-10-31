"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex items-center justify-center px-4 pointer-events-none">
      {/* Floating Tourera-style Frosted Glass Capsule Bar */}
      <nav className="pointer-events-auto flex items-center justify-between gap-6 sm:gap-10 px-5 sm:px-7 py-2.5 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-2xl shadow-slate-950/30 text-white text-xs sm:text-sm font-medium transition-all duration-300 hover:border-white/30">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center pr-2 border-r border-white/15">
          <img src="/logo.png" alt="RepurposeOne" className="h-7 w-auto object-contain" />
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-6 text-slate-200 font-normal text-xs sm:text-sm">
          <a href="#ecosystem" className="hover:text-white transition-colors">Services</a>
          <a href="#features" className="hover:text-white transition-colors">Industries</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">Workflow</a>
          <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        {/* Right Action: Clean White Get Started Pill Button directly linking to /auth */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth"
            className="px-4 py-1.5 rounded-full bg-white text-slate-950 font-semibold text-xs hover:bg-slate-100 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-sm"
          >
            Get Started
          </Link>
        </div>

      </nav>
    </header>
  );
}
