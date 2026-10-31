"use client";

import { motion } from "framer-motion";
import { Sparkles, Rocket, Compass, Users } from "lucide-react";

const PERSONAS = [
  {
    title: "Content Creators",
    tagline: "Make every idea go further.",
    description: "Turn one long YouTube video or podcast episode into weeks of shorts, carousels, and viral threads.",
    icon: Sparkles,
  },
  {
    title: "Startups",
    tagline: "Build a consistent social presence.",
    description: "Scale organic founder-led marketing across multiple platforms with a lean team of one.",
    icon: Rocket,
  },
  {
    title: "Founders",
    tagline: "Share your vision across platforms.",
    description: "Establish industry thought leadership without spending hours manually editing posts every day.",
    icon: Compass,
  },
  {
    title: "Marketing Teams",
    tagline: "Simplify multi-platform content workflows.",
    description: "Standardize voice guidelines, expedite approvals, and expand content distribution 5x.",
    icon: Users,
  }
];

export default function SectionWhoIsItFor() {
  return (
    <section className="py-24 sm:py-32 relative bg-[#f8f9fd]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d8d4ff]/40 border border-[#7c84b8]/30 text-[#434968] font-mono text-xs uppercase tracking-widest font-semibold mb-4">
            Audience Focus
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1a1d2d] mb-6">
            Built for People With <span className="bg-gradient-to-r from-[#1a1d2d] via-[#434968] to-[#7c84b8] bg-clip-text text-transparent">Ideas to Share.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#7c829e] font-normal leading-relaxed">
            Whether you are a solo creator or an enterprise marketing team, RepurposeOne multiplies your creative output.
          </p>
        </div>

        {/* 4 Persona Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PERSONAS.map((persona, idx) => {
            const Icon = persona.icon;
            return (
              <motion.div
                key={persona.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a1d2d] to-[#434968] flex items-center justify-center text-white mb-6 shadow-sm">
                    <Icon className="w-6 h-6 text-[#d8d4ff]" />
                  </div>

                  <h3 className="font-heading text-xl font-bold text-[#1a1d2d] mb-2">
                    {persona.title}
                  </h3>
                  
                  <div className="text-xs font-mono font-bold text-[#434968] mb-4">
                    {persona.tagline}
                  </div>

                  <p className="text-xs text-[#7c829e] leading-relaxed">
                    {persona.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
