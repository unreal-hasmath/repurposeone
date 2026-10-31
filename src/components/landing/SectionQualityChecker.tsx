"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Award } from "lucide-react";

const SCORES = [
  {
    platform: "LinkedIn Carousel",
    score: 94,
    rating: "Excellent Fit",
    color: "from-[#1a1d2d] to-[#434968]",
    detail: "High readability, optimal slide count (10-12), strong first slide hook."
  },
  {
    platform: "X Thread",
    score: 89,
    rating: "Great Retention",
    color: "from-[#434968] to-[#7c84b8]",
    detail: "Hook triggers high open rate; thread breaks occur at logical cliffhangers."
  },
  {
    platform: "Instagram Post",
    score: 96,
    rating: "Optimal Visual",
    color: "from-[#1a1d2d] to-[#7c84b8]",
    detail: "Square aspect alignment, contrast ratios pass mobile scannability benchmarks."
  }
];

export default function SectionQualityChecker() {
  return (
    <section className="py-24 sm:py-32 relative bg-[#f8f9fd]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d8d4ff]/40 border border-[#7c84b8]/30 text-[#434968] font-mono text-xs uppercase tracking-widest font-semibold mb-4">
            <Award className="w-3.5 h-3.5 text-[#7c84b8]" />
            Confidence Metrics
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1a1d2d] mb-6">
            Don't Just Generate. <span className="bg-gradient-to-r from-[#1a1d2d] via-[#434968] to-[#7c84b8] bg-clip-text text-transparent">Generate With Confidence.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#7c829e] font-normal leading-relaxed">
            Understand how well your content fits each platform before you share it.
          </p>
        </div>

        {/* Quality Cards Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {SCORES.map((item, idx) => (
            <motion.div
              key={item.platform}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/40 hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-heading font-bold text-lg text-[#1a1d2d]">
                    {item.platform}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-100 text-[#434968] border border-slate-200">
                    {item.rating}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 my-6">
                  <span className="font-heading text-6xl font-black text-[#1a1d2d] tracking-tight">
                    {item.score}
                  </span>
                  <span className="text-[#7c829e] font-mono text-lg font-bold">/100</span>
                </div>

                {/* Progress Bar in Corridor Theme */}
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden mb-6">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                  />
                </div>

                <p className="text-xs text-[#7c829e] leading-relaxed">
                  {item.detail}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-[#434968]">
                <CheckCircle2 className="w-4 h-4 text-[#7c84b8]" />
                <span>Audience Fit Verified</span>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-[#7c829e] font-mono mt-10">
          Illustrative scores only. Actual scores should come from your AI evaluation.
        </p>
      </div>
    </section>
  );
}
