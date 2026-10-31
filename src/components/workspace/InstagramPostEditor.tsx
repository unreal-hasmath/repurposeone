"use client";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Copy,
  Check,
  RefreshCw,
  Upload,
  ImageIcon,
  SmilePlus,
  MapPin
} from "lucide-react";

interface InstagramEditorProps {
  initialCaption: string;
  initialHashtags: string[];
  initialImage?: string;
  sourceTitle: string;
  authorName?: string;
  formatType?: string;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

const STOCK_CREATOR_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80"
];

export default function InstagramPostEditor({
  initialCaption,
  initialHashtags,
  initialImage,
  sourceTitle,
  authorName = "repurposeone",
  formatType = "Instagram Post",
  onRegenerate,
  isRegenerating = false,
}: InstagramEditorProps) {
  const [caption, setCaption] = useState(initialCaption);
  const [hashtags, setHashtags] = useState(initialHashtags.join(" "));
  const [activeImage, setActiveImage] = useState(initialImage || STOCK_CREATOR_IMAGES[0]);
  const [imageIndex, setImageIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const cleanName = authorName.replace("@", "").toLowerCase().replace(/\s+/g, "_");

  // Character limit validation (2,200 chars max)
  const fullContent = `${caption}\n\n${hashtags}`.trim();
  const charCount = fullContent.length;
  const maxChars = 2200;
  const isOverLimit = charCount > maxChars;
  const isNearLimit = charCount > maxChars * 0.85;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCycleImage = () => {
    setIsLoadingImage(true);
    setTimeout(() => {
      const next = (imageIndex + 1) % STOCK_CREATOR_IMAGES.length;
      setImageIndex(next);
      setActiveImage(STOCK_CREATOR_IMAGES[next]);
      setIsLoadingImage(false);
    }, 500);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setActiveImage(url);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      {/* LEFT: Pixel-perfect Instagram Feed Post */}
      <div className="lg:col-span-6 flex flex-col items-center">
        <div className="w-full max-w-[400px] bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/10 overflow-hidden font-sans">

          {/* IG Status Bar */}
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">Instagram</span>
            <span className="text-[10px] font-mono text-slate-400">◼ ◼ ◼</span>
          </div>

          {/* IG Header: Stories Ring + Username + Three-dots */}
          <div className="px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Story ring gradient */}
              <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600">
                <div className="w-full h-full rounded-full bg-white p-[2px]">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">
                    {cleanName.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-[12px] text-slate-900 leading-none mb-0.5">{cleanName}</h5>
                <p className="text-[10px] text-slate-400 leading-none">Original Audio</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-[11px] font-bold text-[#0095f6]">Follow</button>
              <MoreHorizontal className="w-5 h-5 text-slate-700" />
            </div>
          </div>

          {/* IG Image Area — exact square crop */}
          <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
            {isLoadingImage && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-white" />
                  <span className="text-xs text-white font-semibold">Refreshing...</span>
                </div>
              </div>
            )}
            <img
              src={activeImage}
              alt={sourceTitle}
              className="w-full h-full object-cover"
            />
            {/* Format overlay badge */}
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[9px] font-mono text-white uppercase tracking-wider">
              {formatType}
            </div>
            {/* Hover: swap image */}
            <button
              onClick={handleCycleImage}
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex items-end justify-end p-3"
            >
              <span className="px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-full text-white text-[11px] font-semibold flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3" /> Swap image
              </span>
            </button>
          </div>

          {/* IG Action Row */}
          <div className="px-3 pt-2.5 pb-1 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsLiked(!isLiked)}>
                <Heart className={`w-6 h-6 transition-all ${isLiked ? "fill-rose-500 text-rose-500 scale-110" : "text-slate-900"}`} />
              </button>
              <MessageCircle className="w-6 h-6 text-slate-900 cursor-pointer" />
              <Send className="w-[22px] h-[22px] text-slate-900 cursor-pointer -rotate-12" />
            </div>
            <button onClick={() => setIsSaved(!isSaved)}>
              <Bookmark className={`w-[22px] h-[22px] transition-all ${isSaved ? "fill-slate-900 text-slate-900" : "text-slate-900"}`} />
            </button>
          </div>

          {/* IG Like Count */}
          <div className="px-3 py-1">
            <span className="text-[12px] font-bold text-slate-900">{isLiked ? "1,421" : "1,420"} likes</span>
          </div>

          {/* IG Caption Preview — live updates */}
          <div className="px-3 pb-1">
            <p className="text-[12px] text-slate-900 leading-relaxed line-clamp-3">
              <span className="font-bold mr-1.5">{cleanName}</span>
              {caption}
            </p>
          </div>

          {/* Hashtags */}
          {hashtags && (
            <div className="px-3 pb-1">
              <p className="text-[12px] text-[#0095f6] leading-relaxed line-clamp-2">{hashtags}</p>
            </div>
          )}

          {/* Comments + Timestamp */}
          <div className="px-3 pb-3 pt-0.5">
            <p className="text-[11px] text-slate-400 cursor-pointer mb-0.5">View all 24 comments</p>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">Just Now · RepurposeOne</p>
          </div>

          {/* IG Bottom Composer Bar */}
          <div className="border-t border-slate-100 px-3 py-2.5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-600">
              {cleanName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 flex items-center bg-slate-50 rounded-full px-3 py-1.5 border border-slate-200">
              <span className="text-[11px] text-slate-400">Add a comment…</span>
            </div>
            <SmilePlus className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* RIGHT: Editing Controls */}
      <div className="lg:col-span-6 space-y-4">

        {/* Caption Editor */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1a1d2d]">
              Caption
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
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={6}
            className="w-full rounded-xl border border-slate-200 p-3 text-[13px] text-[#1a1d2d] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/30 resize-y bg-slate-50/50"
            placeholder="Write your Instagram caption here..."
          />

          {isOverLimit && (
            <p className="mt-2 text-xs font-semibold text-rose-600">
              Instagram allows max 2,200 characters. Please shorten your caption.
            </p>
          )}
        </div>

        {/* Hashtags Editor */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1a1d2d]">
              Hashtags
            </label>
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg ${
              hashtags.split(" ").filter(Boolean).length > 5
                ? "bg-amber-50 text-amber-600 border border-amber-200"
                : "bg-slate-50 text-slate-500 border border-slate-200"
            }`}>
              {hashtags.split(" ").filter(Boolean).length} / 5 safe limit
            </span>
          </div>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-[13px] text-[#0095f6] focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/30 font-medium bg-slate-50/50"
            placeholder="#creator #growth #strategy"
          />
          <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
            Max 5 recommended · separate with spaces
          </p>
        </div>

        {/* Image Controls */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1a1d2d] block mb-3">
            Post Image
          </label>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCycleImage}
              disabled={isLoadingImage}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-[#1a1d2d] hover:bg-slate-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingImage ? "animate-spin" : ""}`} />
              <span>Swap Visual</span>
            </button>
            <label className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-[#1a1d2d] hover:bg-slate-50 flex items-center justify-center gap-2 transition-all cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Own</span>
              <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          disabled={isOverLimit}
          className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
            isOverLimit
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-[#1a1d2d] text-white hover:bg-[#434968] hover:scale-[1.01]"
          }`}
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Instagram Caption + Hashtags</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}
