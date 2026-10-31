"use client";

import { motion } from "framer-motion";
import { Linkedin, Twitter, Instagram, Youtube, Layers, ArrowUpRight } from "lucide-react";

const PLATFORMS = [
  {
    name: "LinkedIn Carousel",
    tagline: "Transform ideas into professional swipeable slides.",
    format: "Carousel",
    icon: Linkedin,
    color: "#434968",
    badge: "bg-[#7c84b8]/15 text-[#1a1d2d] border-[#7c84b8]/30",
    stat: "4.8x Higher B2B Dwell Time"
  },
  {
    name: "X (Twitter) Thread",
    tagline: "Turn long content into engaging connected posts.",
    format: "Thread",
    icon: Twitter,
    color: "#1a1d2d",
    badge: "bg-slate-200/60 text-slate-900 border-slate-300",
    stat: "High-Viral Retweet Loop"
  },
  {
    name: "Instagram Reel",
    tagline: "Generate hooks, scripts and captions for Reels.",
    format: "Reel",
    icon: Instagram,
    color: "#4f46e5",
    badge: "bg-indigo-50 text-indigo-900 border-indigo-200",
    stat: "9:16 Optimized Hook Pacing"
  },
  {
    name: "Instagram Post",
    tagline: "Convert your ideas into creative social posts.",
    format: "Post",
    icon: Instagram,
    color: "#6366f1",
    badge: "bg-blue-50 text-blue-900 border-blue-200",
    stat: "High-Saves Single Visual"
  },
  {
    name: "YouTube Shorts",
    tagline: "Create short-form video scripts, hooks and captions from your original content.",
    format: "Shorts",
    icon: Youtube,
    color: "#312e81",
    badge: "bg-slate-100 text-slate-800 border-slate-200",
    stat: "85%+ Completion Rate"
  }
];

export default function SectionEcosystem() {
  return (
    <section id="ecosystem" className="py-24 sm:py-32 relative bg-[#f8f9fd] overflow-hidden">
      {/* Soft lavender ambient glow matching uploaded photo 1 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(216,212,255,0.45)_0%,rgba(248,249,253,1)_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Header matching exact photo 1 palette */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d8d4ff]/40 border border-[#7c84b8]/30 text-[#434968] font-mono text-xs uppercase tracking-widest font-semibold mb-4">
            <Layers className="w-3.5 h-3.5 text-[#7c84b8]" />
            Social Media Ecosystem
          </div>
          
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1a1d2d] mb-6">
            Every Platform. <span className="bg-gradient-to-r from-[#1a1d2d] via-[#434968] to-[#7c84b8] bg-clip-text text-transparent">One Creative Workflow.</span>
          </h2>
          
          <p className="text-base sm:text-lg text-[#7c829e] font-normal leading-relaxed">
            One original piece of content can become multiple formats, each designed for the way people consume content on their favourite platforms.
          </p>
        </div>

        {/* 5 Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PLATFORMS.map((platform, idx) => {
            const Icon = platform.icon;
            return (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative p-8 rounded-2xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/50 hover:shadow-xl hover:border-[#7c84b8]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-[#1a1d2d]" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${platform.badge}`}>
                      {platform.format}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-[#1a1d2d] mb-2 group-hover:text-[#434968] transition-colors">
                    {platform.name}
                  </h3>
                  <p className="text-[#7c829e] text-sm leading-relaxed mb-6 font-normal">
                    {platform.tagline}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span className="font-mono text-[#434968]">
                    {platform.stat}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#1a1d2d] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
