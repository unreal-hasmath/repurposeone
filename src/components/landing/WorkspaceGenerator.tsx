"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link as LinkIcon,
  Send,
  Youtube,
  Instagram,
  Linkedin,
  Twitter,
  Sparkles,
  CheckCircle2,
  Copy,
  Check
} from "lucide-react";

interface TransformedFormat {
  platform: string;
  badge: string;
  icon: any;
  title: string;
  preview: string;
}

export default function WorkspaceGenerator() {
  const [url, setUrl] = useState("");
  const [activePlatform, setActivePlatform] = useState<string>("youtube");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<Record<string, TransformedFormat> | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const isUrlEntered = url.trim().length > 3;

  const handleSend = () => {
    if (!isUrlEntered) return;
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedResults({
        youtube: {
          platform: "YouTube Shorts",
          badge: "9:16 VERTICAL SCRIPT",
          icon: Youtube,
          title: "High-Retention Hook & Fast Cut Script",
          preview: `[0:00 - 0:03 HOOK] "Most creators spend 8 hours writing social posts. Here's how to turn 1 video into 5 formats in 60 seconds."\n\n[0:03 - 0:15 SETUP] Break down the core insight from: "${url}"\n\n[0:15 - 0:45 PAYOFF] 1. Extract transcript keywords\n2. Reframe for LinkedIn PDF\n3. Cascade into an X Thread\n\n[0:45 - 0:60 CTA] "Save this video and start repurposing your library today!"`
        },
        instagram: {
          platform: "Instagram Carousel",
          badge: "SWIPEABLE SLIDE DECK",
          icon: Instagram,
          title: "5 Frameworks Extracted for Carousel",
          preview: `Slide 1 (Cover): The 60-Second Content Multiplier 🚀\nSlide 2: The Blank Page Trap (Why rewriting from scratch fails)\nSlide 3: Source Pillar Architecture (Derived from ${url})\nSlide 4: Platform Native Formatting Rules\nSlide 5: Actionable Checklist & Caption: "Double tap if you're repurposing your next video!"`
        },
        linkedin: {
          platform: "LinkedIn Carousel & Post",
          badge: "B2B THOUGHT LEADERSHIP",
          icon: Linkedin,
          title: "Executive Strategic Playbook",
          preview: `Why high-performing marketing teams don't create more content—they distribute deeper.\n\nAnalyzing the primary takeaways from this breakdown:\n\n→ Dwell time increased by 4.8x on swipeable documents\n→ Single-source ideation reduces creative fatigue\n→ Automated synthesis preserves authentic tone\n\nFull analysis and slides attached. What is your multi-channel workflow?`
        },
        x: {
          platform: "X (Twitter) Thread",
          badge: "8-POST CASCADE",
          icon: Twitter,
          title: "High-Velocity Connected Cascade",
          preview: `1/8 How we turned 1 long-form piece of content into 100K impressions across social 👇\n\n2/8 The biggest bottleneck isn't having ideas—it's formatting them for each platform algorithm.\n\n3/8 Here is the breakdown from ${url} broken into digestible takeaways... 🧵`
        }
      });
    }, 650);
  };

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <section id="workspace" className="py-20 sm:py-28 relative bg-[#f8f9fd] overflow-hidden">
      
      {/* Background lavender glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(216,212,255,0.45)_0%,rgba(235,238,255,0.2)_35%,rgba(248,249,253,1)_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d8d4ff]/40 border border-[#7c84b8]/30 text-[#434968] font-mono text-xs uppercase tracking-widest font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#7c84b8]" />
            AI Content Workspace
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1a1d2d] mb-3">
            Paste Content. <span className="bg-gradient-to-r from-[#1a1d2d] via-[#434968] to-[#7c84b8] bg-clip-text text-transparent">Generate Everywhere.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#7c829e]">
            Paste your YouTube URL, blog link, or transcript and select any platform below.
          </p>
        </div>

        {/* Central URL Paste Section with Integrated Send Button */}
        <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-indigo-950/10 p-2.5 sm:p-3 flex items-center gap-3 mb-6 transition-all focus-within:border-[#434968] focus-within:ring-2 focus-within:ring-[#7c84b8]/30">
          <div className="pl-3 text-[#7c84b8]">
            <LinkIcon className="w-5 h-5" />
          </div>
          
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            placeholder="Paste YouTube video link, podcast transcript URL, or blog post link here..."
            className="w-full bg-transparent text-sm sm:text-base text-[#1a1d2d] placeholder-[#8c92b0] focus:outline-none py-2"
          />

          <button
            onClick={handleSend}
            disabled={!isUrlEntered || isGenerating}
            className={`px-5 sm:px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 shrink-0 ${
              isUrlEntered
                ? "bg-[#1a1d2d] text-white shadow-md hover:bg-[#434968] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            }`}
          >
            <span>{isGenerating ? "Analyzing..." : "Send"}</span>
            <Send className={`w-3.5 h-3.5 ${isGenerating ? "animate-pulse" : ""}`} />
          </button>
        </div>

        {/* 4 Sleeping-Line Platform Buttons directly below the URL paste box */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          
          {/* YouTube button */}
          <button
            onClick={() => setActivePlatform("youtube")}
            disabled={!isUrlEntered}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all duration-300 ${
              !isUrlEntered
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                : activePlatform === "youtube"
                ? "bg-[#1a1d2d] text-white border-[#1a1d2d] shadow-md shadow-slate-950/20 scale-105"
                : "bg-white text-[#434968] border-slate-200 hover:bg-slate-50 cursor-pointer"
            }`}
          >
            <Youtube className="w-4 h-4" />
            <span>YouTube Shorts</span>
          </button>

          {/* Instagram button */}
          <button
            onClick={() => setActivePlatform("instagram")}
            disabled={!isUrlEntered}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all duration-300 ${
              !isUrlEntered
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                : activePlatform === "instagram"
                ? "bg-[#1a1d2d] text-white border-[#1a1d2d] shadow-md shadow-slate-950/20 scale-105"
                : "bg-white text-[#434968] border-slate-200 hover:bg-slate-50 cursor-pointer"
            }`}
          >
            <Instagram className="w-4 h-4" />
            <span>Instagram</span>
          </button>

          {/* LinkedIn button */}
          <button
            onClick={() => setActivePlatform("linkedin")}
            disabled={!isUrlEntered}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all duration-300 ${
              !isUrlEntered
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                : activePlatform === "linkedin"
                ? "bg-[#1a1d2d] text-white border-[#1a1d2d] shadow-md shadow-slate-950/20 scale-105"
                : "bg-white text-[#434968] border-slate-200 hover:bg-slate-50 cursor-pointer"
            }`}
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </button>

          {/* X (Twitter) button */}
          <button
            onClick={() => setActivePlatform("x")}
            disabled={!isUrlEntered}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all duration-300 ${
              !isUrlEntered
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                : activePlatform === "x"
                ? "bg-[#1a1d2d] text-white border-[#1a1d2d] shadow-md shadow-slate-950/20 scale-105"
                : "bg-white text-[#434968] border-slate-200 hover:bg-slate-50 cursor-pointer"
            }`}
          >
            <Twitter className="w-4 h-4" />
            <span>X (Twitter)</span>
          </button>
        </div>

        {/* Dynamic Transformed Results Display Window */}
        <AnimatePresence mode="wait">
          {generatedResults && generatedResults[activePlatform] ? (
            <motion.div
              key={activePlatform}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-indigo-950/5 p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-[#d8d4ff]/40 text-[#434968] border border-[#7c84b8]/30">
                    {generatedResults[activePlatform].badge}
                  </span>
                  <span className="font-heading font-bold text-sm text-[#1a1d2d]">
                    {generatedResults[activePlatform].title}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(generatedResults[activePlatform].preview, activePlatform)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-medium text-[#434968] hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === activePlatform ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Format</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#f8f9fd] border border-slate-200/80 font-mono text-xs sm:text-sm text-[#1a1d2d] whitespace-pre-wrap leading-relaxed shadow-inner">
                {generatedResults[activePlatform].preview}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[#7c829e] font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Algorithm Fit: 98%
                </span>
                <span>Optimized via RepurposeOne Engine</span>
              </div>
            </motion.div>
          ) : isUrlEntered ? (
            <div className="text-center py-6 text-xs font-mono text-[#7c829e] bg-white/60 border border-slate-200/60 rounded-2xl">
              Click "Send" above to transform your link into platform-ready formats.
            </div>
          ) : null}
        </AnimatePresence>

      </div>
    </section>
  );
}
