"use client";

import { motion } from "framer-motion";
import { Mic, CheckCircle, Copy, Calendar, ShieldCheck } from "lucide-react";

export default function SectionBentoFeatures() {
  return (
    <section id="features" className="py-24 sm:py-32 relative bg-[#f8f9fd]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d8d4ff]/40 border border-[#7c84b8]/30 text-[#434968] font-mono text-xs uppercase tracking-widest font-semibold mb-4">
            Feature Showcase
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1a1d2d] mb-6">
            Everything Your <span className="bg-gradient-to-r from-[#1a1d2d] via-[#434968] to-[#7c84b8] bg-clip-text text-transparent">Content Workflow Needs.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#7c829e] font-normal leading-relaxed">
            A comprehensive suite crafted specifically for modern multi-channel distribution.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Item 1: Large Hero Bento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="md:col-span-8 rounded-3xl p-8 sm:p-10 bg-white border border-slate-200/90 shadow-lg shadow-indigo-950/5 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#d8d4ff]/25 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="inline-block px-3 py-1 rounded-md bg-[#1a1d2d] text-white text-xs font-mono font-bold tracking-wider mb-4">
                01 // CORE ENGINE
              </div>
              <h3 className="font-heading text-3xl font-bold text-[#1a1d2d] mb-3">
                AI-Powered Repurposing
              </h3>
              <p className="text-[#7c829e] text-base max-w-lg mb-8">
                Transform your source content into multiple social media formats with AI. Never start from a blank page again.
              </p>
            </div>

            {/* Platform pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#f8f9fd] border border-slate-200 shadow-sm text-center">
                <div className="text-xs font-mono font-bold text-[#7c84b8]">INPUT</div>
                <div className="text-sm font-semibold text-slate-800 mt-1">1 Video</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f8f9fd] border border-slate-200 shadow-sm text-center">
                <div className="text-xs font-mono font-bold text-[#434968]">LINKEDIN</div>
                <div className="text-sm font-semibold text-slate-800 mt-1">Carousel + Post</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f8f9fd] border border-slate-200 shadow-sm text-center">
                <div className="text-xs font-mono font-bold text-[#434968]">INSTAGRAM</div>
                <div className="text-sm font-semibold text-slate-800 mt-1">Reels + Post</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f8f9fd] border border-slate-200 shadow-sm text-center">
                <div className="text-xs font-mono font-bold text-[#434968]">YOUTUBE</div>
                <div className="text-sm font-semibold text-slate-800 mt-1">Shorts Script</div>
              </div>
            </div>
          </motion.div>

          {/* Bento Item 2: Brand Voice AI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="md:col-span-4 rounded-3xl p-8 bg-white border border-slate-200 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#d8d4ff]/40 flex items-center justify-center text-[#1a1d2d] mb-6">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#1a1d2d] mb-2">
                Brand Voice AI
              </h3>
              <p className="text-[#7c829e] text-sm leading-relaxed mb-6">
                Keep your tone and writing style consistent across every social channel.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-[#434968] flex items-center justify-between">
              <span>Tone Match Confidence</span>
              <span className="font-bold">99.4%</span>
            </div>
          </motion.div>

          {/* Bento Item 3: Quality Checker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="md:col-span-4 rounded-3xl p-8 bg-white border border-slate-200 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#d8d4ff]/40 flex items-center justify-center text-[#1a1d2d] mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#1a1d2d] mb-2">
                Quality Checker
              </h3>
              <p className="text-[#7c829e] text-sm leading-relaxed mb-6">
                Evaluate platform suitability with AI scores before pushing live.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#434968] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <CheckCircle className="w-4 h-4 text-[#7c84b8]" />
              <span>Algorithmic Fit: 96/100</span>
            </div>
          </motion.div>

          {/* Bento Item 4: One-Click Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="md:col-span-4 rounded-3xl p-8 bg-white border border-slate-200 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#d8d4ff]/40 flex items-center justify-center text-[#1a1d2d] mb-6">
                <Copy className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#1a1d2d] mb-2">
                One-Click Copy
              </h3>
              <p className="text-[#7c829e] text-sm leading-relaxed mb-6">
                Copy generated content instantly with slide pagination and formatting preserved.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-[#434968] flex items-center justify-between">
              <span>Ready for Clipboard</span>
              <span className="font-bold">⌘ + C</span>
            </div>
          </motion.div>

          {/* Bento Item 5: Content Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -4 }}
            className="md:col-span-4 rounded-3xl p-8 bg-white border border-slate-200 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#d8d4ff]/40 flex items-center justify-center text-[#1a1d2d] mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#1a1d2d] mb-2">
                Content Calendar
              </h3>
              <p className="text-[#7c829e] text-sm leading-relaxed mb-6">
                Organize and schedule your content across weekdays to maintain consistent cadence.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-[#434968] flex items-center justify-between">
              <span>Weekly Cadence</span>
              <span className="font-bold">5 Days Active</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
