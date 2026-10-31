"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Clock,
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  Send,
  Bot,
  User,
  Share2,
  Trash2
} from "lucide-react";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
}

const INITIAL_CONVERSATION: ChatMessage[] = [
  {
    id: "1",
    sender: "user",
    text: "Can you transform my 15-minute video on 'The 2026 Content Creation Playbook' into an Instagram carousel and an X thread?",
    time: "10:14 AM"
  },
  {
    id: "2",
    sender: "ai",
    text: "Analyzing video audio transcript... I extracted 5 high-impact frameworks. Here is the structure:\n\n1. Instagram Carousel (7 Slides): Visual hooks highlighting the distribution bottleneck and framework breakdown.\n2. X Thread (8 Connected Posts): Fast-paced cascade with viral quote highlights and engagement questions.\n\nReady to export or refine any slide!",
    time: "10:15 AM"
  },
  {
    id: "3",
    sender: "user",
    text: "Make the Instagram slide 1 hook more provocative for B2B founders.",
    time: "10:17 AM"
  },
  {
    id: "4",
    sender: "ai",
    text: "Updated Slide 1 Hook:\n\n\"90% of B2B founders burn 8 hours a week rewriting content manually. Here's the 60-second system that replaced our marketing agency.\" 🚀",
    time: "10:18 AM"
  }
];

export default function ArchivesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CONVERSATION);
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText,
      time: "Just now"
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    // Simulated AI response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `Transformed request: "${userMsg.text}". I've generated platform-specific formats with high algorithmic suitability scores.`,
        time: "Just now"
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 700);
  };

  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  return (
    <MagneticCursor
      cursorSize={26}
      cursorColor="#ffffff"
      blendMode="difference"
      contrastBoost={1.6}
      speedMultiplier={0.02}
    >
      <div className="min-h-screen bg-[#f8f9fd] text-[#1a1d2d] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
        
        {/* Background lavender glow matching spatial corridor */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(216,212,255,0.45)_0%,rgba(235,238,255,0.2)_35%,rgba(248,249,253,1)_70%)] pointer-events-none" />

        {/* Ambient Vignette around screen */}
        <div className="fixed inset-0 pointer-events-none z-30 shadow-[inset_0_0_120px_rgba(20,24,40,0.18)]" />

      {/* Top Navigation */}
      <header className="relative z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/workspace"
              className="p-2 rounded-xl border border-slate-200 text-[#434968] hover:bg-slate-50 flex items-center gap-1.5 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Workspace</span>
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <Link
              href="/"
              className="flex items-center hover:opacity-85 transition-opacity"
            >
              <img src="/logo.png" alt="RepurposeOne" className="h-8 w-auto object-contain" />
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#7c84b8]" />
              <span className="font-heading font-bold text-sm text-[#1a1d2d]">
                Session History & AI Chat Archives
              </span>
            </div>
          </div>

          <div className="text-xs font-mono text-[#7c829e] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Auto-saved</span>
          </div>
        </div>
      </header>

      {/* Chat Messages Log */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col justify-between">
        <div className="space-y-5 mb-8">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1a1d2d] to-[#434968] flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                    <Bot className="w-5 h-5 text-[#d8d4ff]" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-5 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${
                    isUser
                      ? "bg-[#1a1d2d] text-white rounded-tr-none"
                      : "bg-white border border-slate-200/90 text-[#1a1d2d] rounded-tl-none shadow-indigo-950/5"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-2 font-mono opacity-60">
                    <span>{isUser ? "You" : "RepurposeOne AI"}</span>
                    <span>{msg.time}</span>
                  </div>

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-[#7c84b8] hover:text-[#1a1d2d] transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy output</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-[#1a1d2d] shrink-0 shadow-sm mt-1">
                    <User className="w-5 h-5 text-[#434968]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xl shadow-indigo-950/10 p-2.5 flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            placeholder="Ask AI to refine, expand or reformat your content..."
            className="w-full bg-transparent text-sm text-[#1a1d2d] placeholder-[#8c92b0] focus:outline-none px-3"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              inputText.trim()
                ? "bg-[#1a1d2d] text-white hover:bg-[#434968]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>

    </div>
    </MagneticCursor>
  );
}
