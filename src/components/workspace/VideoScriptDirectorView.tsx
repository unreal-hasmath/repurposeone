"use client";

import { useState } from "react";
import {
  Video,
  FileText,
  Copy,
  Check,
  Sparkles,
  Clapperboard,
  ListOrdered,
  Tag,
  Sliders
} from "lucide-react";

interface VideoScriptDirectorViewProps {
  platformName: string;
  formatName: string;
  title: string;
  hook?: string;
  scriptBreakdown?: string;
  caption: string;
  hashtags: string[];
  description?: string;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function VideoScriptDirectorView({
  platformName,
  formatName,
  title,
  hook,
  scriptBreakdown,
  caption,
  hashtags,
  description,
  onRegenerate,
  isRegenerating = false,
}: VideoScriptDirectorViewProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionKey: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedSection(sectionKey);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  const fullPromptText = `[PROMPT & VIDEO PRODUCTION SPECIFICATION]
PLATFORM: ${platformName.toUpperCase()}
FORMAT: ${formatName}
TITLE: ${title}

--- HOOK & RETENTION MECHANIC ---
${hook || "Attention grabbing hook"}

--- FULL PRODUCTION SCRIPT & DIRECTOR BREAKDOWN ---
${scriptBreakdown || "Script breakdown"}

--- CAPTION FOR AUDIENCE ---
${caption}

--- HASHTAGS ---
${hashtags.join(" ")}
${description ? `\n--- DESCRIPTION / METADATA ---\n${description}` : ""}`;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Clapperboard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#1a1d2d] text-white uppercase tracking-wider">
                {platformName}
              </span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                {formatName}
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#1a1d2d] mt-0.5">
              {title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleCopy(fullPromptText, "all")}
            className="px-4 py-2 rounded-xl bg-[#1a1d2d] text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            {copiedSection === "all" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Entire Script & Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Script Sections Grid: Full Width Clean View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Production Steps & Full Director Script Breakdown */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Director Scene-by-Scene Prompt & Script */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-[#7c84b8]" />
                <h4 className="font-heading font-bold text-sm text-[#1a1d2d]">
                  Complete Video Production Script & Prompt
                </h4>
              </div>
              <button
                onClick={() => handleCopy(scriptBreakdown || "", "script")}
                className="text-xs font-mono font-bold text-[#434968] hover:text-[#1a1d2d] flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === "script" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === "script" ? "Copied" : "Copy Breakdown"}</span>
              </button>
            </div>

            {/* Formatted Script Body */}
            <div className="prose prose-sm max-w-none text-slate-800 font-mono text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap bg-slate-50/80 p-4 sm:p-5 rounded-xl border border-slate-200/60 font-sans">
              {scriptBreakdown || "No script details provided."}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Video Caption & Hashtag Panel */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Caption Card */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1a1d2d] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#7c84b8]" />
                Video Caption
              </span>
              <button
                onClick={() => handleCopy(caption, "caption")}
                className="text-[11px] font-mono font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                {copiedSection === "caption" ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-sans bg-slate-50/70 p-3 rounded-xl border border-slate-100">
              {caption}
            </p>
          </div>

          {/* Hashtags Card */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1a1d2d] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#7c84b8]" />
                Targeted Hashtags
              </span>
              <button
                onClick={() => handleCopy(hashtags.join(" "), "hashtags")}
                className="text-[11px] font-mono font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                {copiedSection === "hashtags" ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {hashtags.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 font-mono text-xs font-semibold">
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>

          {/* Description Card */}
          {description && (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1a1d2d]">Description / Notes</span>
                <button onClick={() => handleCopy(description, "desc")} className="text-[11px] font-mono font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
                  {copiedSection === "desc" ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed font-sans bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoScriptDirectorView;