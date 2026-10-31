"use client";

import { useState } from "react";
import {
  MessageCircle,
  Repeat2,
  Heart,
  Bookmark,
  Share,
  Copy,
  Check,
  RefreshCw,
  Upload,
  BarChart2,
  Upload as UploadIcon
} from "lucide-react";
import { countWeightedCharacters } from "@/lib/platform-config";

interface XPostEditorProps {
  initialContent: string;
  initialHashtags: string[];
  initialImage?: string;
  sourceTitle: string;
  authorName?: string;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

const STOCK_X_IMAGES = [
  "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&auto=format&fit=crop&q=80"
];

export default function XPostEditor({
  initialContent,
  initialHashtags,
  initialImage,
  sourceTitle,
  authorName = "Creator",
  onRegenerate,
  isRegenerating = false,
}: XPostEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [hashtags, setHashtags] = useState(initialHashtags.join(" "));
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // X weighted character counter (280 max)
  const fullTweet = `${content}\n\n${hashtags}`.trim();
  const weightedCount = countWeightedCharacters(fullTweet, true);
  const maxWeighted = 280;
  const isOverLimit = weightedCount > maxWeighted;
  const isNearLimit = weightedCount > 240;

  const cleanName = authorName.replace(/[^a-zA-Z0-9\s]/g, "").trim() || "Creator";
  const handle = `@${cleanName.replace(/\s+/g, "").toLowerCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullTweet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCycleImage = () => {
    setIsLoadingImage(true);
    setTimeout(() => {
      const next = (imageIndex + 1) % STOCK_X_IMAGES.length;
      setImageIndex(next);
      setAttachedImage(STOCK_X_IMAGES[next]);
      setIsLoadingImage(false);
    }, 400);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAttachedImage(url);
    }
  };

  // Remaining char ring
  const remaining = maxWeighted - weightedCount;
  const ringPercent = Math.max(0, Math.min(100, (weightedCount / maxWeighted) * 100));
  const ringColor = isOverLimit ? "#ef4444" : isNearLimit ? "#f59e0b" : "#1da1f2";

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      {/* LEFT: X (Twitter) Post Preview */}
      <div className="lg:col-span-6 flex flex-col items-center">
        <div className="w-full max-w-[460px] bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-900/8 overflow-hidden font-sans">

          {/* X Top Bar */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-slate-900">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.776-8.906L1.764 2.25H8.08l4.258 5.63 5.907-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="text-[10px] font-bold text-slate-700 tracking-wide">For You</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Following</span>
          </div>

          {/* Tweet Body */}
          <div className="flex items-start gap-3 px-4 py-3">
            {/* Avatar */}
            <div className="shrink-0 w-10 h-10 rounded-full bg-[#1a1d2d] text-white flex items-center justify-center font-bold text-sm">
              {cleanName.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              {/* Name Row */}
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-bold text-[13px] text-slate-900 truncate">{cleanName}</span>
                {/* Verified badge */}
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#1da1f2] shrink-0">
                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C1.88 9.33 1 10.57 1 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.26 3.91.81c.66 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.33-2.19c1.4.46 2.91.2 3.92-.81s1.26-2.52.8-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
                </svg>
                <span className="text-[12px] text-slate-400 truncate">{handle} · 2h</span>
              </div>

              {/* Tweet Content */}
              <p className="text-[13px] text-slate-900 whitespace-pre-wrap leading-relaxed mb-2">
                {content}
              </p>

              {/* Hashtags */}
              {hashtags && (
                <p className="text-[13px] text-[#1da1f2] font-medium mb-2">{hashtags}</p>
              )}

              {/* Attached Image */}
              {attachedImage && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-3 bg-black/5 border border-slate-200 group">
                  {isLoadingImage && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
                      <RefreshCw className="w-5 h-5 animate-spin text-white" />
                    </div>
                  )}
                  <img src={attachedImage} alt={sourceTitle} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setAttachedImage(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black/90 text-[11px] font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Engagement Row */}
              <div className="flex items-center gap-5 text-slate-500 pt-2 border-t border-slate-100 mt-1">
                <button className="flex items-center gap-1.5 text-[12px] hover:text-[#1da1f2] transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>34</span>
                </button>
                <button className="flex items-center gap-1.5 text-[12px] hover:text-emerald-500 transition-colors">
                  <Repeat2 className="w-4 h-4" />
                  <span>12</span>
                </button>
                <button onClick={() => setIsLiked(!isLiked)} className={`flex items-center gap-1.5 text-[12px] transition-colors ${isLiked ? "text-rose-500" : "hover:text-rose-500"}`}>
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
                  <span>{isLiked ? "190" : "189"}</span>
                </button>
                <button className="flex items-center gap-1.5 text-[12px] hover:text-[#1da1f2] transition-colors">
                  <BarChart2 className="w-4 h-4" />
                  <span>4.2K</span>
                </button>
                <button className="ml-auto hover:text-[#1da1f2] transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="hover:text-[#1da1f2] transition-colors">
                  <Share className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: X Post Composer */}
      <div className="lg:col-span-6 space-y-4">

        {/* Tweet Text Composer */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1a1d2d]">
              X Post (280 weighted chars)
            </label>
            {/* X-style ring counter */}
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 36 36" className="w-7 h-7 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="3"
                  strokeDasharray={`${ringPercent * 0.942} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`text-xs font-mono font-bold ${isOverLimit ? "text-rose-600" : isNearLimit ? "text-amber-600" : "text-slate-500"}`}>
                {remaining < 0 ? remaining : remaining}
              </span>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-slate-200 p-3 text-[13px] text-[#1a1d2d] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/30 resize-y bg-slate-50/50"
            placeholder="What's happening?"
          />
          {isOverLimit && (
            <p className="mt-2 text-xs font-semibold text-rose-600">
              X allows max 280 weighted characters. Please shorten your post.
            </p>
          )}
        </div>

        {/* Hashtags */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1a1d2d]">
              Hashtags
            </label>
            <span className="text-[11px] font-mono text-slate-400">Max 2 recommended on X</span>
          </div>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-[13px] text-[#1da1f2] font-medium focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/30 bg-slate-50/50"
            placeholder="#buildinpublic #ai"
          />
        </div>

        {/* Attach Image */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1a1d2d] block mb-3">
            Attach Image
          </label>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCycleImage}
              disabled={isLoadingImage}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-[#1a1d2d] hover:bg-slate-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingImage ? "animate-spin" : ""}`} />
              <span>Add Visual</span>
            </button>
            <label className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-[#1a1d2d] hover:bg-slate-50 flex items-center justify-center gap-2 transition-all cursor-pointer">
              <UploadIcon className="w-3.5 h-3.5" />
              <span>Upload Own</span>
              <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Copy */}
        <button
          onClick={handleCopy}
          className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer bg-black text-white hover:bg-slate-800 hover:scale-[1.01]"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy X Post</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}
