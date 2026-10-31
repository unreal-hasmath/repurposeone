"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#141726] text-[#7c829e] py-16 sm:py-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          
          {/* Brand info */}
          <div className="col-span-2">
            <Link href="/" className="font-heading font-extrabold text-xl tracking-tight text-white inline-block mb-4">
              RepurposeOne
            </Link>
            <p className="text-sm text-[#7c829e] max-w-sm mb-6 leading-relaxed">
              Every platform. One creative workflow. Turn your videos, blogs, and audio memos into high-performing social content with AI.
            </p>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#brand-voice" className="hover:text-white transition-colors">Brand Voice AI</a></li>
              <li><Link href="/auth" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#faq" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
            </ul>
          </div>

          {/* Column 3: Company & Social */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn · X · YouTube</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7c829e] font-mono gap-4">
          <p>© 2026 RepurposeOne. All rights reserved.</p>
          <p>Built for creators, founders, and modern growth teams.</p>
        </div>

      </div>
    </footer>
  );
}
