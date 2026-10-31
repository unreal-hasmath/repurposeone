"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, SlidersHorizontal } from "lucide-react";

const TONES = [
  {
    id: "professional",
    label: "Professional",
    description: "Authoritative, insightful, B2B-optimized tone.",
    example: "Discover a disciplined, high-leverage methodology for repurposing strategic thinking across diverse multi-channel ecosystems."
  },
  {
    id: "friendly",
    label: "Friendly",
    description: "Warm, engaging, approachable creator tone.",
    example: "Stop spending hours writing from scratch! Here's how you can turn your favorite blog post into fun, bite-sized social content today."
  },
  {
    id: "bold",
    label: "Bold",
    description: "Direct, high-conviction, contrarian tone.",
    example: "If you're still manually typing out LinkedIn posts after recording a video, you're lighting valuable hours on fire. Automate it now."
  }
];

export default function SectionBrandVoice() {
  const [activeTone, setActiveTone] = useState(TONES[0]);

  return (
    <section id="brand-voice" className="py-24 sm:py-32 relative bg-[#f8f9fd]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d8d4ff]/40 border border-[#7c84b8]/30 text-[#434968] font-mono text-xs uppercase tracking-widest font-semibold mb-4">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#7c84b8]" />
            Brand Voice Engine
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1a1d2d] mb-6">
            Sound Like Yourself. <span className="bg-gradient-to-r from-[#1a1d2d] via-[#434968] to-[#7c84b8] bg-clip-text text-transparent">Everywhere.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#7c829e] font-normal leading-relaxed">
            Your brand has a personality. Your content should reflect it on every platform.
          </p>
        </div>

        {/* Interactive Demo Showcase */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl shadow-indigo-950/5">
          
          <div className="text-center mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7c84b8] font-semibold">
              Choose your brand personality
            </span>
            
            {/* Tone Selector Buttons */}
            <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
              {TONES.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setActiveTone(tone)}
                  className={`px-6 py-2.5 rounded-full font-heading font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                    activeTone.id === tone.id
                      ? "bg-[#1a1d2d] text-white shadow-md shadow-slate-950/20 scale-105"
                      : "bg-slate-100 text-[#434968] hover:bg-slate-200"
                  }`}
                >
                  {activeTone.id === tone.id && <Check className="w-4 h-4 text-[#7c84b8]" />}
                  <span>{tone.label}</span>
                </button>
              ))}
            </div>
            
            <p className="text-xs text-[#7c829e] mt-3 font-medium">
              {activeTone.description}
            </p>
          </div>

          {/* AI Output Window */}
          <div className="relative p-8 rounded-2xl bg-[#f8f9fd] border border-slate-200 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#1a1d2d] text-white font-mono text-[11px] font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#7c84b8]" />
                AI-GENERATED EXAMPLE
              </div>
              <span className="text-xs font-mono text-[#7c829e]">Latency: 140ms</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-h-[90px] flex items-center"
              >
                <p className="font-heading text-lg sm:text-2xl font-bold text-[#1a1d2d] leading-relaxed">
                  "{activeTone.example}"
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-[#7c829e] font-mono">
              <span>An illustrative preview of the Brand Voice experience.</span>
              <span className="text-[#434968] font-bold">100% Brand Safe</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
