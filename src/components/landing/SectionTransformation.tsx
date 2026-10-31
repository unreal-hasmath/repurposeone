"use client";

import { motion } from "framer-motion";
import { Cpu, ArrowRight, Sparkles, FileText, Video, Lightbulb, Share2 } from "lucide-react";

const OUTPUT_ITEMS = [
  { name: "LinkedIn Carousel", tag: "12 Slides PDF", color: "border-[#434968] bg-[#f8f9fd] text-[#1a1d2d]" },
  { name: "X Thread", tag: "8 Connected Posts", color: "border-slate-800 bg-[#f8f9fd] text-[#1a1d2d]" },
  { name: "Instagram Reel", tag: "Hook + 60s Script", color: "border-[#7c84b8] bg-[#f8f9fd] text-[#1a1d2d]" },
  { name: "Instagram Post", tag: "Square Micro-Graphic", color: "border-[#6366f1] bg-[#f8f9fd] text-[#1a1d2d]" },
  { name: "YouTube Shorts", tag: "High-Retention Blueprint", color: "border-[#312e81] bg-[#f8f9fd] text-[#1a1d2d]" },
];

export default function SectionTransformation() {
  return (
    <section className="py-24 sm:py-32 relative bg-[#f8f9fd] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d8d4ff]/40 border border-[#7c84b8]/30 text-[#434968] font-mono text-xs uppercase tracking-widest font-semibold mb-4">
            <Share2 className="w-3.5 h-3.5 text-[#7c84b8]" />
            Visual Storytelling
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1a1d2d] mb-6">
            One Piece of Content. <span className="bg-gradient-to-r from-[#1a1d2d] via-[#434968] to-[#7c84b8] bg-clip-text text-transparent">Five New Possibilities.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#7c829e] font-normal leading-relaxed">
            Stop letting great ideas stay in one format. Give your content the ability to travel across platforms.
          </p>
        </div>

        {/* Visual Transformation Node Architecture */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/90 shadow-xl shadow-indigo-950/5">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,212,255,0.3)_0%,transparent_70%)] pointer-events-none rounded-3xl" />

          {/* Left: Input Card (Original Content) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 p-6 sm:p-8 rounded-2xl bg-[#f8f9fd] border border-slate-200 shadow-sm relative"
          >
            <div className="inline-block px-3 py-1 rounded-md bg-[#1a1d2d] text-white text-xs font-mono font-bold tracking-wider mb-4">
              YOUR ORIGINAL CONTENT
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#1a1d2d] mb-2">
              One blog, video or idea
            </h3>
            <p className="text-sm text-[#7c829e] mb-6">
              Your starting point. Drop a YouTube URL, paste a podcast transcript or draft notes.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-sm">
                <FileText className="w-5 h-5 text-[#434968]" />
                <span className="text-xs font-medium text-slate-800">Long-Form Article (2,400 words)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-sm">
                <Video className="w-5 h-5 text-[#434968]" />
                <span className="text-xs font-medium text-slate-800">YouTube Video Link or MP4</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-sm">
                <Lightbulb className="w-5 h-5 text-[#434968]" />
                <span className="text-xs font-medium text-slate-800">Rough Voice Memo / Bullet Points</span>
              </div>
            </div>
          </motion.div>

          {/* Middle: AI Engine Core */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 flex flex-col items-center justify-center text-center py-6 relative"
          >
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#1a1d2d] via-[#434968] to-[#7c84b8] flex items-center justify-center shadow-xl shadow-slate-950/20">
                <Cpu className="w-11 h-11 text-white" />
              </div>
              <div className="absolute -inset-3 rounded-full border-2 border-dashed border-[#7c84b8]/50 animate-spin" style={{ animationDuration: '24s' }} />
            </div>

            <h4 className="font-heading text-xl font-bold text-[#1a1d2d] mb-1">
              RepurposeOne AI
            </h4>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#434968] bg-[#d8d4ff]/40 px-3 py-1 rounded-full border border-[#7c84b8]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#7c84b8]" />
              Analyze · Transform · Generate
            </div>

            <p className="text-xs text-[#7c829e] mt-3 max-w-xs">
              Context-aware natural language models dissect core hooks and audience psychology.
            </p>
          </motion.div>

          {/* Right: Output Formats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-3"
          >
            {OUTPUT_ITEMS.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className={`p-3.5 rounded-xl border-l-4 border shadow-sm flex items-center justify-between ${item.color} transition-all`}
              >
                <div>
                  <div className="font-heading font-bold text-sm text-[#1a1d2d]">{item.name}</div>
                  <div className="text-[11px] text-[#7c829e] font-mono">{item.tag}</div>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-200/60 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-[#1a1d2d]" />
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
