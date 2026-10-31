"use client";

import { motion } from "framer-motion";
import { Link2, Sliders, Zap, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    step: "STEP 01",
    title: "Bring Your Content",
    description: "Paste a URL, YouTube transcript or original text into your workspace.",
    icon: Link2,
    preview: "https://yourblog.com/growth-playbook or YouTube video ID"
  },
  {
    step: "STEP 02",
    title: "Choose Your Formats",
    description: "Select LinkedIn, X, Instagram or YouTube formats that match your goals.",
    icon: Sliders,
    preview: "Selected: LinkedIn Carousel + X Thread + IG Reels"
  },
  {
    step: "STEP 03",
    title: "Generate & Refine",
    description: "Review your generated content, edit it, copy it and get it ready to publish.",
    icon: Zap,
    preview: "Ready to schedule · 1-Click Copy with Hashtags & Formatting"
  }
];

export default function SectionHowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative bg-[#f8f9fd]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d8d4ff]/40 border border-[#7c84b8]/30 text-[#434968] font-mono text-xs uppercase tracking-widest font-semibold mb-4">
            A Smarter Workflow
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1a1d2d] mb-6">
            Your Content. <span className="bg-gradient-to-r from-[#1a1d2d] via-[#434968] to-[#7c84b8] bg-clip-text text-transparent">A Smarter Workflow.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#7c829e] font-normal leading-relaxed">
            Three simple steps take you from an original idea to platform-ready content.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative rounded-3xl bg-white border border-slate-200/90 p-8 shadow-md shadow-slate-200/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-xs font-bold tracking-wider px-3 py-1 rounded-full bg-slate-100 text-[#434968] border border-slate-200">
                      {step.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a1d2d] to-[#434968] flex items-center justify-center text-white shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-[#1a1d2d] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#7c829e] text-sm leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-[#434968] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7c84b8] shrink-0" />
                  <span className="truncate">{step.preview}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
