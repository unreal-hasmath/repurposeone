"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  highlight?: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "I'd be totally lost without RepurposeOne. The in-depth multi-format AI generation EASILY 100X'd my output.",
    author: "Fernando",
    role: "UX Designer at UserFirst",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "It's just the best. Period. Cleanest way to get LinkedIn slides from blog drafts.",
    author: "Andy",
    role: "DevOps Engineer at CloudMasters",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "I switched 5 years of manual rewriting to RepurposeOne and never looked back.",
    author: "Marina",
    role: "HR Manager at TalentForge",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "I've been searching for a solution like RepurposeOne for YEARS. So glad I finally found one!",
    author: "Pete",
    role: "Sales Director at RevenueRockets",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    highlight: true,
  },
  {
    quote: "RepurposeOne's customer workflow is unparalleled. They're always right there when we need them.",
    author: "Olivia",
    role: "Customer Success Manager at ClientCare",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "The efficiency gains since implementing RepurposeOne are off the charts! 5 formats in 60s is real.",
    author: "Raj",
    role: "Operations Manager at StreamlineSolutions",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "Turned our single weekly podcast episode into an unstoppable social distribution machine.",
    author: "Sarah",
    role: "Head of Growth at MetricPulse",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
  }
];

export default function SectionCustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(3); // Pete highlighted in center like uploaded photo

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="reviews" className="py-24 sm:py-32 relative bg-[#f8f9fd] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(216,212,255,0.45)_0%,rgba(248,249,253,1)_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#7c84b8] font-semibold mb-3">
            VERIFIED CREATOR STORIES
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Loved by Modern <span className="bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent">Content Teams.</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            See how creators, founders, and growth leaders scale their reach with RepurposeOne.
          </p>
        </div>

        {/* Carousel Deck Container matching uploaded image 2 */}
        <div className="relative min-h-[380px] sm:min-h-[420px] flex items-center justify-center overflow-visible py-8">
          <div className="relative w-full max-w-5xl h-[340px] flex items-center justify-center">
            {TESTIMONIALS.map((item, idx) => {
              // Calculate relative offset from active index
              const offset = (idx - activeIndex + TESTIMONIALS.length) % TESTIMONIALS.length;
              let normalizedOffset = offset;
              if (normalizedOffset > TESTIMONIALS.length / 2) {
                normalizedOffset -= TESTIMONIALS.length;
              }

              const isCenter = normalizedOffset === 0;
              const isVisible = Math.abs(normalizedOffset) <= 3;

              if (!isVisible) return null;

              // Card positions with slant/fan out matching uploaded image 2
              const xPos = normalizedOffset * 190;
              const rotation = normalizedOffset * 4;
              const scale = isCenter ? 1.08 : 0.92 - Math.abs(normalizedOffset) * 0.05;
              const zIndex = 20 - Math.abs(normalizedOffset);
              const opacity = Math.abs(normalizedOffset) === 3 ? 0.35 : 1 - Math.abs(normalizedOffset) * 0.18;

              return (
                <motion.div
                  key={item.author}
                  animate={{
                    x: xPos,
                    rotate: rotation,
                    scale: scale,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  onClick={() => setActiveIndex(idx)}
                  className={`absolute w-[260px] sm:w-[290px] p-6 sm:p-7 rounded-2xl cursor-pointer select-none transition-shadow duration-300 ${
                    isCenter
                      ? "bg-[#181a20] text-white shadow-2xl shadow-slate-950/40 border border-slate-700"
                      : "bg-white text-slate-900 shadow-xl shadow-indigo-950/10 border border-slate-200/90"
                  }`}
                  style={{
                    transformOrigin: "center bottom",
                  }}
                >
                  {/* Top user avatar */}
                  <div className="flex items-center justify-between mb-5">
                    <img
                      src={item.avatar}
                      alt={item.author}
                      className={`w-11 h-11 rounded-lg object-cover ring-2 ${
                        isCenter ? "ring-indigo-400" : "ring-slate-200"
                      }`}
                    />
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Quote Body */}
                  <p
                    className={`font-heading text-sm sm:text-base font-semibold leading-relaxed mb-6 ${
                      isCenter ? "text-white" : "text-slate-800"
                    }`}
                  >
                    "{item.quote}"
                  </p>

                  {/* Author Meta */}
                  <div className="pt-3 border-t border-slate-700/40">
                    <div
                      className={`font-heading text-xs font-bold ${
                        isCenter ? "text-slate-200" : "text-slate-900"
                      }`}
                    >
                      - {item.author}, {item.role}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Arrow Navigation Controls matching uploaded photo 2 bottom */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-slate-950 shadow-sm active:scale-95 transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-slate-950 shadow-sm active:scale-95 transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
