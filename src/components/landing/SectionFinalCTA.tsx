"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function SectionFinalCTA() {
  return (
    <section id="cta" className="py-24 sm:py-32 relative bg-[#f8f9fc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Glow ambient */}
        <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-950 to-neutral-900 text-white p-10 sm:p-20 overflow-hidden shadow-2xl shadow-orange-950/20">
          
          {/* Sunlight golden beam overlay */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/25 via-orange-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-rose-500/20 via-amber-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300 font-mono text-xs uppercase tracking-widest font-semibold mb-8 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              Start Transforming Now
            </div>

            <h2 className="font-heading text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] mb-6">
              Your Ideas Deserve to <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">Travel Further.</span>
            </h2>

            <p className="text-base sm:text-xl text-slate-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
              Turn one original idea into content for every platform. Create more, rewrite less and make every idea count.
            </p>

            {/* CTA action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-950 font-bold text-base shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>Start Creating with RepurposeOne</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </a>
            </div>

            <p className="mt-4 text-xs font-mono text-slate-400">
              Your next great post starts here. No credit card required.
            </p>

            {/* Micro value badges */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                5 Formats in 60s
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Custom Brand Voice AI
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Pre-Publish Quality Check
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
