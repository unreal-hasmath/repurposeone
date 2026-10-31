"use client";

import { useState } from "react";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
  MoreHorizontal,
  Copy,
  Check,
  Globe,
  FileText,
  Repeat2,
  Heart,
  Lightbulb
} from "lucide-react";

interface LinkedInEditorProps {
  initialContent: string;
  initialHashtags: string[];
  sourceTitle: string;
  authorName?: string;
  formatType?: string;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export default function LinkedInPostEditor({
  initialContent,
  initialHashtags,
  sourceTitle,
  authorName = "Founder / Marketing Lead",
  formatType = "LinkedIn Post",
  onRegenerate,
  isRegenerating = false,
}: LinkedInEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [hashtags, setHashtags] = useState(initialHashtags.join(" "));
  const [isCopied, setIsCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  // Character limit validation (3,000 chars max)
  const fullPost = `${content}\n\n${hashtags}`.trim();
  const charCount = fullPost.length;
  const maxChars = 3000;
  const isOverLimit = charCount > maxChars;
  const isNearLimit = charCount > maxChars * 0.85;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPost);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const cleanName = authorName.replace(/[^a-zA-Z\s]/g, "").trim() || "Content Creator";

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      {/* LEFT: Realistic LinkedIn Feed Post */}
      <div className="lg:col-span-6 flex flex-col items-center">
        <div className="w-full max-w-[460px] bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-900/8 overflow-hidden font-sans">

          {/* LinkedIn Top Bar */}
          <div className="flex items-center justify-between px-4 pt-3 pb-1 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-[#0a66c2] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <span className="text-[10px] font-bold text-[#0a66c2] tracking-wide">LinkedIn</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Feed</span>
          </div>

          {/* Profile Header */}
          <div className="flex items-start justify-between px-4 pt-3 pb-2">
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a66c2] to-[#004182] text-white flex items-center justify-center font-bold text-base shadow">
                  {cleanName.charAt(0)}
                </div>
                {/* LinkedIn Premium badge */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-[7px] text-white font-black">IN</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-[13px] text-slate-900 leading-snug">{cleanName}</h4>
                  <span className="text-slate-400 text-[11px]">• 1st</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Thought Leader · Multi-Channel Distribution Specialist
                </p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                  <span>1h • Edited •</span>
                  <Globe className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-[11px] font-bold text-[#0a66c2] border border-[#0a66c2] px-2.5 py-1 rounded-full hover:bg-[#0a66c2]/5 transition-colors">Follow</button>
              <MoreHorizontal className="w-5 h-5 text-slate-500" />
            </div>
          </div>

          {/* Post Body */}
          <div className="px-4 pb-3">
            <div className="text-[13px] text-slate-800 whitespace-pre-wrap leading-relaxed">
              {content}
            </div>
            {hashtags && (
              <div className="text-[13px] text-[#0a66c2] font-medium mt-2 leading-relaxed">{hashtags}</div>
            )}
          </div>

          {/* Document Carousel Card */}
          <div className="mx-4 mb-3 rounded-lg border border-slate-200 bg-[#f3f2ef] p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0a66c2]/15 text-[#0a66c2] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="font-semibold text-[12px] text-slate-900 truncate">
                {(sourceTitle || "Document").slice(0, 50)}.pdf
              </h5>
              <span className="text-[10px] text-slate-500 font-mono">
                {formatType} · 7 swipeable slides
              </span>
            </div>
            <div className="shrink-0 w-7 h-7 rounded bg-[#0a66c2] flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">▶</span>
            </div>
          </div>

          {/* Reactions Bar */}
          <div className="px-4 pb-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1">
                <span className="text-base">👍</span>
                <span className="text-base">❤️</span>
                <span className="text-base">💡</span>
                <span>384 · 24 comments</span>
              </div>
              <span>12 reposts</span>
            </div>
          </div>

          {/* LinkedIn Action Row */}
          <div className="grid grid-cols-4 px-2 py-1">
            {[
              { icon: <ThumbsUp className="w-4 h-4" />, label: "Like", color: liked ? "text-[#0a66c2]" : "", action: () => setLiked(!liked) },
              { icon: <MessageSquare className="w-4 h-4" />, label: "Comment", color: "" },
              { icon: <Repeat2 className="w-4 h-4" />, label: "Repost", color: "" },
              { icon: <Send className="w-4 h-4" />, label: "Send", color: "" },
            ].map(({ icon, label, color, action }) => (
              <button key={label} onClick={action} className={`py-2 rounded-lg hover:bg-slate-100 flex items-center justify-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${color || "text-slate-600"}`}>
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: LinkedIn Editing Controls */}
      <div className="lg:col-span-6 space-y-4">

        {/* Post Content Editor */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1a1d2d]">
              Post Content
            </label>
            <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${
              isOverLimit
                ? "bg-rose-50 text-rose-600 border border-rose-200"
                : isNearLimit
                ? "bg-amber-50 text-amber-600 border border-amber-200"
                : "bg-emerald-50 text-emerald-600 border border-emerald-200"
            }`}>
              {charCount} / {maxChars}
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full rounded-xl border border-slate-200 p-3 text-[13px] text-[#1a1d2d] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/30 resize-y bg-slate-50/50"
            placeholder="Write your LinkedIn thought-leadership post..."
          />

          {isOverLimit && (
            <p className="mt-2 text-xs font-semibold text-rose-600">
              LinkedIn allows a maximum of 3,000 characters. Please shorten your post.
            </p>
          )}
        </div>

        {/* Hashtags Editor */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1a1d2d]">
              Professional Hashtags
            </label>
            <span className="text-[11px] font-mono text-slate-400">Max 5 recommended</span>
          </div>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-[13px] text-[#0a66c2] focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/30 font-medium bg-slate-50/50"
            placeholder="#leadership #marketing #strategy"
          />
        </div>

        {/* Copy Action */}
        <button
          onClick={handleCopy}
          disabled={isOverLimit}
          className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
            isOverLimit
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-[#0a66c2] text-white hover:bg-[#004182] hover:scale-[1.01]"
          }`}
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy LinkedIn Post</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}
