"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Clock,
  ThumbsUp,
  MessageSquare,
  Share2,
  Search,
  Mic,
  ChevronRight,
  Bell
} from "lucide-react";

interface YouTubeEditorProps {
  initialTitle?: string;
  initialDescription?: string;
  initialScript?: string;
  initialHashtags?: string[];
  sourceTitle: string;
  authorName?: string;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export default function YouTubeShortsEditor({
  initialTitle = "",
  initialDescription = "",
  initialScript = "",
  initialHashtags = ["#shorts", "#creator"],
  sourceTitle,
  authorName = "Creator",
  onRegenerate,
  isRegenerating = false,
}: YouTubeEditorProps) {
  const [title, setTitle] = useState(initialTitle || `The 60-Second Breakdown: ${sourceTitle.slice(0, 50)}`);
  const [description, setDescription] = useState(
    initialDescription || `Key framework extracted from ${authorName}. Double tap and subscribe for daily breakdowns!`
  );
  const [script, setScript] = useState(
    initialScript ||
      `[0:00 - 0:03 HOOK] "Most creators miss this when scaling their content library..."\n\n[0:03 - 0:20 SETUP] Break down the framework from "${sourceTitle.slice(0, 40)}".\n\n[0:20 - 0:45 PAYOFF] 1. Extract transcript keywords\n2. Reframe for LinkedIn PDF\n3. Cascade into an X Thread\n\n[0:45 - 0:60 CTA] "Double tap & subscribe for daily creator breakdowns!"`
  );
  const [hashtags, setHashtags] = useState(initialHashtags.join(" "));
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const cleanName = authorName.replace(/[^a-zA-Z0-9\s]/g, "").trim() || "Creator";

  const titleLimit = 100;
  const descLimit = 5000;
  const isTitleOver = title.length > titleLimit;
  const isDescOver = description.length > descLimit;

  const handleCopy = () => {
    const full = `TITLE: ${title}\n\nDESCRIPTION:\n${description}\n\nSCRIPT:\n${script}\n\nHASHTAGS:\n${hashtags}`;
    navigator.clipboard.writeText(full);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      {/* LEFT: YouTube Shorts 9:16 Phone Mockup */}
      <div className="lg:col-span-5 flex flex-col items-center">
        {/* Phone frame */}
        <div className="relative w-full max-w-[280px]">
          {/* Phone bezel */}
          <div className="relative w-full aspect-[9/19.5] rounded-[40px] bg-slate-900 border-4 border-slate-800 shadow-2xl shadow-black/50 overflow-hidden">

            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20" />

            {/* Video BG */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-black">
              {/* Subtle grain texture */}
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[size:4px_4px]" />
            </div>

            {/* Top controls */}
            <div className="absolute top-8 left-0 right-0 flex items-center justify-between px-4 z-10">
              <button className="w-8 h-8 flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </button>
              <div className="flex items-center gap-1.5">
                <button className="px-3 py-1 rounded-full border-b-2 border-white text-white text-[11px] font-bold">For You</button>
                <button className="px-3 py-1 text-white/60 text-[11px] font-medium">Following</button>
              </div>
              <button className="w-8 h-8 flex items-center justify-center">
                <Mic className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Center play icon + title */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 z-10">
              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="font-heading font-bold text-[13px] text-white text-center drop-shadow-lg leading-snug line-clamp-4">
                {title}
              </p>
            </div>

            {/* Right floating actions */}
            <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 z-10">
              {/* Channel avatar */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {cleanName.charAt(0)}
                </div>
                <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-white flex items-center justify-center -mt-3 shadow">
                  <span className="text-white text-[8px] font-black">+</span>
                </div>
              </div>
              {/* Like */}
              <button onClick={() => setIsLiked(!isLiked)} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <ThumbsUp className={`w-5 h-5 ${isLiked ? "fill-white text-white" : "text-white"}`} />
                </div>
                <span className="text-[10px] text-white font-semibold">{isLiked ? "24K" : "23.9K"}</span>
              </button>
              {/* Comment */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-white font-semibold">482</span>
              </div>
              {/* Share */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-white font-semibold">Share</span>
              </div>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-12 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-bold text-[12px] text-white">@{cleanName.replace(/\s+/g, "").toLowerCase()}</span>
                <button className="px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold border border-white/20 flex items-center gap-1">
                  <Bell className="w-2.5 h-2.5" />Subscribe
                </button>
              </div>
              <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed">{description}</p>
              {/* Progress bar */}
              <div className="mt-2 w-full h-0.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: "35%" }} />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] text-white/60 font-mono">0:21</span>
                <span className="text-[9px] text-white/60 font-mono">1:00</span>
              </div>
            </div>

            {/* Shorts badge */}
            <div className="absolute top-9 right-4 z-20">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-600 shadow">
                <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                  <path d="M10 9.914L15.973 12 10 14.086V9.914zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
                <span className="text-white font-bold text-[9px] tracking-wider">SHORTS</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT: Editing Controls */}
      <div className="lg:col-span-7 space-y-4">

        {/* Video Title */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1a1d2d]">
              Shorts Title
            </label>
            <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${
              isTitleOver
                ? "bg-rose-50 text-rose-600 border border-rose-200"
                : "bg-emerald-50 text-emerald-600 border border-emerald-200"
            }`}>
              {title.length} / {titleLimit}
            </div>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-[13px] text-[#1a1d2d] focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/30 font-medium bg-slate-50/50"
            placeholder="Attention-grabbing Shorts title..."
          />
        </div>

        {/* Script Breakdown */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1a1d2d] block mb-3">
            9:16 Video Script (Hook · Scene · CTA)
          </label>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={8}
            className="w-full rounded-xl border border-slate-200 p-3 text-[12px] font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/30 resize-y bg-slate-50/50 text-[#1a1d2d]"
          />
        </div>

        {/* Description + Hashtags */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1a1d2d]">
              Description
            </label>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${
              isDescOver
                ? "bg-rose-50 text-rose-600 border border-rose-200"
                : "bg-slate-50 text-slate-500 border border-slate-200"
            }`}>
              {description.length} / {descLimit}
            </span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 p-3 text-[13px] text-[#1a1d2d] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/30 resize-y bg-slate-50/50 mb-3"
          />
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Hashtags / Tags
          </label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#shorts #contentcreation"
            className="w-full rounded-xl border border-slate-200 p-2.5 text-[13px] text-[#1a1d2d] font-mono focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/30 bg-slate-50/50"
          />
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          disabled={isTitleOver || isDescOver}
          className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
            isTitleOver || isDescOver
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-[#1a1d2d] text-white hover:bg-[#434968] hover:scale-[1.01]"
          }`}
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Script & Details Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy YouTube Shorts Script</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}
