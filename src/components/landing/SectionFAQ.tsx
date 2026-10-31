"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "What is RepurposeOne?",
    a: "RepurposeOne is an AI-powered content transformation sequence platform that analyzes an original piece of content (like a YouTube video, blog post, or audio memo) and immediately crafts platform-native formats including LinkedIn Carousels, X Threads, Instagram Reels scripts, and YouTube Shorts."
  },
  {
    q: "Which social media platforms are supported?",
    a: "We natively support LinkedIn (Carousels and thought leadership posts), X / Twitter (multi-tweet threads and image visual posts), Instagram (Reels scripts with hooks and carousel slide decks), and YouTube (Shorts scripts and high-CTR thumbnail prompts)."
  },
  {
    q: "Can I repurpose YouTube videos?",
    a: "Yes! Simply paste any YouTube link into RepurposeOne. Our engine fetches the transcript, highlights key viral moments, and extracts punchy hooks and multi-slide decks ready to publish."
  },
  {
    q: "Can I customize my brand voice?",
    a: "Absolutely. You can choose from built-in personality presets (Professional, Friendly, Bold) or train the system on your past posts so every generated output sounds authentically like you."
  },
  {
    q: "Is there a free version?",
    a: "Yes. You can start completely free to repurpose your first 3 pieces of content across all platforms with zero credit card required."
  },
  {
    q: "How does the AI content quality checker work?",
    a: "The quality checker evaluates formatting, character pacing, emotional hook strength, and platform-specific algorithm guidelines to assign a suitability score before you publish."
  }
];

export default function SectionFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 sm:py-32 relative bg-[#f8f9fd]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d8d4ff]/40 border border-[#7c84b8]/30 text-[#434968] font-mono text-xs uppercase tracking-widest font-semibold mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#7c84b8]" />
            Frequently Asked
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1a1d2d] mb-6">
            Questions? <span className="bg-gradient-to-r from-[#1a1d2d] via-[#434968] to-[#7c84b8] bg-clip-text text-transparent">We've Got Answers.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#7c829e] font-normal leading-relaxed">
            Everything you need to know about transforming your content workflow.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-heading font-bold text-base sm:text-lg text-[#1a1d2d] hover:text-[#434968] transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#7c829e] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#1a1d2d]" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-[#7c829e] text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
