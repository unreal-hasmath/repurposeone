"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Link as LinkIcon,
  Send,
  Youtube,
  Instagram,
  Linkedin,
  Twitter,
  Copy,
  Check,
  CheckCircle2,
  Folder,
  X,
  Plus,
  MessageSquare,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Loader2
} from "lucide-react";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";
import InstagramPostEditor from "@/components/workspace/InstagramPostEditor";
import YouTubeShortsEditor from "@/components/workspace/YouTubeShortsEditor";
import LinkedInPostEditor from "@/components/workspace/LinkedInPostEditor";
import XPostEditor from "@/components/workspace/XPostEditor";
import VideoScriptDirectorView from "@/components/workspace/VideoScriptDirectorView";
import AbstractCubeIsometricLoader from "@/components/ui/abstract-cube-isometric-loader";
import { saveProjectSession, getProjectSessions } from "@/lib/supabase";

interface UserProfile {
  name: string;
  role: string;
  platforms: string[];
  goals: string[];
  types: string[];
  language: string;
}

interface ChatSession {
  id: string;
  title: string;
  url: string;
  platform?: string;
  platforms?: string[];
  time: string;
  preview?: string;
  scrapedSource?: any;
  generatedResults?: any;
}

export default function WorkspacePage() {
  const router = useRouter();

  // User profile
  const [profile, setProfile] = useState<UserProfile>({
    name: "Creator",
    role: "Content Creator",
    platforms: ["Instagram", "LinkedIn", "YouTube", "X (Twitter)"],
    goals: ["Grow my audience", "Save time on content creation"],
    types: ["Educational", "Technology & AI"],
    language: "English"
  });

  // Sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Chat History / Saved Generations
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // URL & Generator state
  const [url, setUrl] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("instagram");
  const [openSubDropdown, setOpenSubDropdown] = useState<string | null>(null);
  const [isFormatConfigured, setIsFormatConfigured] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scrapedSource, setScrapedSource] = useState<any | null>(null);
  const [generatedResults, setGeneratedResults] = useState<Record<string, any> | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sub-selection format checkboxes for each platform
  const [selectedSubFormats, setSelectedSubFormats] = useState<{
    instagram: string[];
    linkedin: string[];
    x: string[];
    youtube: string[];
  }>({
    instagram: ["Instagram Post", "Instagram Carousel Post", "Instagram Reel Script"],
    linkedin: ["LinkedIn Post", "Text and Image", "Video Script", "Newsletter"],
    x: ["Text Post", "Image Post", "Video Script", "Threads"],
    youtube: ["YouTube Shorts Script", "YouTube Video Script"]
  });

  const togglePlatform = (p: string) => {
    if (selectedPlatforms.includes(p)) {
      if (openSubDropdown === p) {
        // Clicking when already open toggles the sub-format panel off
        setOpenSubDropdown(null);
      } else {
        // Clicking open again to customize
        setOpenSubDropdown(p);
      }
    } else {
      // Add platform and open its sub-format box
      setSelectedPlatforms(prev => [...prev, p]);
      setActiveTab(p);
      setOpenSubDropdown(p);
    }
  };

  const toggleSubFormat = (platform: "instagram" | "linkedin" | "x" | "youtube", format: string) => {
    setSelectedSubFormats(prev => {
      const current = prev[platform];
      const next = current.includes(format)
        ? current.filter(f => f !== format)
        : [...current, format];
      return { ...prev, [platform]: next };
    });
  };

  const removePlatform = (p: string) => {
    setSelectedPlatforms(prev => {
      const updated = prev.filter(x => x !== p);
      if (activeTab === p) {
        if (updated.length > 0) {
          setActiveTab(updated[0]);
        }
      }
      return updated;
    });
    // Unselect all sub-formats for this platform
    setSelectedSubFormats(prev => ({
      ...prev,
      [p]: []
    }));
    // Close the sub dropdown
    setOpenSubDropdown(null);
  };

  const isUrlEntered = url.trim().length > 3;

  // Check if at least one platform is selected and has configured sub-formats
  const hasSelectedFormats = selectedPlatforms.length > 0 && selectedPlatforms.some(
    p => (selectedSubFormats[p as keyof typeof selectedSubFormats] || []).length > 0
  );
  const isSendReady = isUrlEntered && hasSelectedFormats && !isGenerating;

  useEffect(() => {
    // Load user profile from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("repurpose_profile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile(parsed);
        } catch (e) {}
      } else {
        const user = localStorage.getItem("repurpose_user");
        if (user) {
          try {
            const u = JSON.parse(user);
            if (u.name) {
              setProfile(prev => ({ ...prev, name: u.name }));
            }
          } catch (e) {}
        }
      }

      // Load saved chats if available (from Supabase / localStorage)
      getProjectSessions().then((sessions) => {
        if (sessions && sessions.length > 0) {
          setChatHistory(sessions);
        }
      });
    }
  }, []);

  const handleSend = async () => {
    if (!isUrlEntered) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const data = await res.json();

      if (data.success) {
        setScrapedSource(data.scraped);
        
        // If user hasn't selected any platform manually, use detected platform
        let targetPlatforms = selectedPlatforms.length > 0 ? [...selectedPlatforms] : ["instagram"];
        if (selectedPlatforms.length === 0 && data.detected?.platform && ["youtube", "instagram", "linkedin", "x"].includes(data.detected.platform)) {
          targetPlatforms = [data.detected.platform];
          setSelectedPlatforms(targetPlatforms);
          setActiveTab(data.detected.platform);
        } else if (!targetPlatforms.includes(activeTab)) {
          setActiveTab(targetPlatforms[0]);
        }

        // Call AI generator route with the scraped text & selected formats for all chosen platforms
        let finalGeneratedResults = { ...data.generatedResults };
        try {
          const genPromises = targetPlatforms.map(async (plat) => {
            const genRes = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url,
                scrapedText: data.scraped.extractedText || data.scraped.description || data.scraped.title,
                title: data.scraped.title,
                sourcePlatform: data.detected?.platform,
                targetPlatform: plat,
                selectedSubFormats: selectedSubFormats[plat as keyof typeof selectedSubFormats] || []
              })
            });
            return genRes.json();
          });

          const resultsList = await Promise.all(genPromises);
          for (const item of resultsList) {
            if (item?.success && item?.results) {
              finalGeneratedResults = { ...finalGeneratedResults, ...item.results };
            }
          }
          setGeneratedResults(finalGeneratedResults);
        } catch (e) {
          setGeneratedResults(finalGeneratedResults);
        }

        const primaryPlat = targetPlatforms[0] || "instagram";
        const newChat: ChatSession = {
          id: Date.now().toString(),
          title: data.scraped.title || url.replace(/^https?:\/\/(www\.)?/, '').slice(0, 28) + "...",
          url: url,
          platform: primaryPlat,
          platforms: targetPlatforms,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          preview: data.generatedResults?.[primaryPlat]?.preview || "",
          scrapedSource: data.scraped,
          generatedResults: finalGeneratedResults
        };

        const updatedChats = [newChat, ...chatHistory.filter(c => c.id !== newChat.id)];
        setChatHistory(updatedChats);
        setSelectedChatId(newChat.id);
        saveProjectSession(newChat);
      } else {
        // Fallback to offline generation if network scraping error
        generateFallback();
      }
    } catch (e) {
      generateFallback();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallback = () => {
    const results = {
      youtube: {
        platform: "YouTube Shorts",
        badge: "9:16 VERTICAL SCRIPT",
        preview: `[0:00 - 0:03 HOOK] "Most creators spend 8 hours writing social posts. Here's how to turn 1 video into 5 formats in 60 seconds."\n\n[0:03 - 0:15 SETUP] Break down the core insight from: "${url}"\n\n[0:15 - 0:45 PAYOFF] 1. Extract transcript keywords\n2. Reframe for LinkedIn PDF\n3. Cascade into an X Thread\n\n[0:45 - 0:60 CTA] "Save this video and start repurposing your library today!"`
      },
      instagram: {
        platform: "Instagram Carousel",
        badge: "SWIPEABLE SLIDE DECK",
        preview: `Slide 1 (Cover): The 60-Second Content Multiplier 🚀\nSlide 2: The Blank Page Trap (Why rewriting from scratch fails)\nSlide 3: Source Pillar Architecture (Derived from ${url})\nSlide 4: Platform Native Formatting Rules\nSlide 5: Actionable Checklist & Caption: "Double tap if you're repurposing your next video!"`
      },
      linkedin: {
        platform: "LinkedIn Carousel & Post",
        badge: "B2B THOUGHT LEADERSHIP",
        preview: `Why high-performing marketing teams don't create more content—they distribute deeper.\n\nAnalyzing the primary takeaways from this breakdown:\n\n→ Dwell time increased by 4.8x on swipeable documents\n→ Single-source ideation reduces creative fatigue\n→ Automated synthesis preserves authentic tone\n\nFull analysis and slides attached. What is your multi-channel workflow?`
      },
      x: {
        platform: "X (Twitter) Thread",
        badge: "8-POST CASCADE",
        preview: `1/8 How we turned 1 long-form piece of content into 100K impressions across social 👇\n\n2/8 The biggest bottleneck isn't having ideas—it's formatting them for each platform algorithm.\n\n3/8 Here is the breakdown from ${url} broken into digestible takeaways... 🧵`
      }
    };
    setGeneratedResults(results);
  };

  const handleStartNewChat = () => {
    setUrl("");
    setScrapedSource(null);
    setGeneratedResults(null);
    setSelectedChatId(null);
  };

  const handleSelectChat = (chat: ChatSession) => {
    setSelectedChatId(chat.id);
    setUrl(chat.url);

    // Restore platforms
    const restoredPlatforms = chat.platforms && chat.platforms.length > 0
      ? chat.platforms
      : chat.platform
      ? [chat.platform]
      : ["instagram"];
    
    setSelectedPlatforms(restoredPlatforms);
    const active = restoredPlatforms[0] || "instagram";
    setActiveTab(active);
    setOpenSubDropdown(null);

    // Restore scraped source and generated results if stored in the session
    if (chat.scrapedSource) {
      setScrapedSource(chat.scrapedSource);
    } else {
      setScrapedSource({
        platform: active,
        title: chat.title,
        originalUrl: chat.url,
        normalizedUrl: chat.url,
        contentType: "Social Post",
        description: chat.preview || "Restored session from history",
        extractedText: chat.title
      });
    }

    if (chat.generatedResults) {
      setGeneratedResults(chat.generatedResults);
    } else {
      setGeneratedResults({
        youtube: {
          platform: "YouTube Shorts",
          badge: "9:16 VERTICAL SCRIPT",
          preview: `[0:00 - 0:03 HOOK] "Most creators spend 8 hours writing social posts. Here's how to turn 1 video into 5 formats in 60 seconds."\n\n[0:03 - 0:15 SETUP] Break down the core insight from: "${chat.url}"\n\n[0:15 - 0:45 PAYOFF] 1. Extract transcript keywords\n2. Reframe for LinkedIn PDF\n3. Cascade into an X Thread\n\n[0:45 - 0:60 CTA] "Save this video and start repurposing your library today!"`
        },
        instagram: {
          platform: "Instagram Carousel",
          badge: "SWIPEABLE SLIDE DECK",
          preview: `Slide 1 (Cover): The 60-Second Content Multiplier 🚀\nSlide 2: The Blank Page Trap (Why rewriting from scratch fails)\nSlide 3: Source Pillar Architecture (Derived from ${chat.url})\nSlide 4: Platform Native Formatting Rules\nSlide 5: Actionable Checklist & Caption: "Double tap if you're repurposing your next video!"`
        },
        linkedin: {
          platform: "LinkedIn Carousel & Post",
          badge: "B2B THOUGHT LEADERSHIP",
          preview: `Why high-performing marketing teams don't create more content—they distribute deeper.\n\nAnalyzing the primary takeaways from this breakdown:\n\n→ Dwell time increased by 4.8x on swipeable documents\n→ Single-source ideation reduces creative fatigue\n→ Automated synthesis preserves authentic tone\n\nFull analysis and slides attached. What is your multi-channel workflow?`
        },
        x: {
          platform: "X (Twitter) Thread",
          badge: "8-POST CASCADE",
          preview: `1/8 How we turned 1 long-form piece of content into 100K impressions across social 👇\n\n2/8 The biggest bottleneck isn't having ideas—it's formatting them for each platform algorithm.\n\n3/8 Here is the breakdown from ${chat.url} broken into digestible takeaways... 🧵`
        }
      });
    }
  };

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
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
      <div className="min-h-screen bg-[#f8f9fd] text-[#1a1d2d] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 relative">
        
        {/* Background radial lavender glow matching spatial corridor */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(216,212,255,0.45)_0%,rgba(235,238,255,0.2)_35%,rgba(248,249,253,1)_70%)] pointer-events-none" />

        {/* Top Header Bar */}
        <header className="relative z-30 border-b border-slate-200/80 bg-white/70 backdrop-blur-md px-4 sm:px-8 py-3.5">
          <div className="w-full flex items-center justify-between">
            
            {/* Left: Sidebar Toggle Button (matching user uploaded photo 2 icon) + RepurposeOne brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-9 h-9 rounded-xl border border-slate-200/90 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
                title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar / History"}
              >
                {/* SVG icon matching the exact split rectangle icon from user's uploaded photo 2 */}
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              </button>

              {/* Back arrow — goes to previous page in browser history */}
              <button
                onClick={() => router.back()}
                className="w-9 h-9 rounded-xl border border-slate-200/90 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
                title="Go Back"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <Link
                href="/"
                className="flex items-center hover:opacity-85 transition-opacity"
              >
                <img src="/logo.png" alt="RepurposeOne" className="h-8 w-auto object-contain" />
              </Link>
            </div>

            {/* Right Header: Round Profile Avatar directly to /workspace/profile */}
            <Link
              href="/workspace/profile"
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1a1d2d] to-[#434968] flex items-center justify-center text-white font-heading font-bold text-sm shadow-md hover:scale-105 transition-all ring-2 ring-[#7c84b8]/30"
              title="View Profile Details"
            >
              {profile.name.charAt(0).toUpperCase()}
            </Link>

          </div>
        </header>

        {/* Workspace Body Layout with Collapsible Left Sidebar */}
        <div className="relative z-10 flex flex-1 w-full overflow-hidden">
          
          {/* Collapsible Left Sidebar Drawer */}
          <aside
            className={`transition-all duration-300 ease-in-out border-r border-slate-200/80 bg-white/80 backdrop-blur-md flex flex-col z-20 shrink-0 ${
              isSidebarOpen ? "w-72 sm:w-80" : "w-0 overflow-hidden border-r-0"
            }`}
          >
            {isSidebarOpen && (
              <div className="p-4 flex flex-col h-full w-72 sm:w-80">
                {/* Sidebar Header with History Title & New Chat / Plus Icon */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#7c84b8]">
                    History
                  </span>
                  <button
                    onClick={handleStartNewChat}
                    className="p-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                    title="Start New Generation"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New</span>
                  </button>
                </div>

                {/* Chat History List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {chatHistory.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center text-center p-4 text-slate-400">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2 text-slate-400">
                        <Plus className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-medium text-slate-500">No chat history yet</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Submit a URL in the workspace to automatically create a new session here.
                      </p>
                    </div>
                  ) : (
                    chatHistory.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleSelectChat(chat)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedChatId === chat.id
                            ? "bg-[#1a1d2d] text-white border-[#1a1d2d] shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          {/* Platform Badges Batch */}
                          <div className="flex items-center gap-1 flex-wrap">
                            {chat.platforms && chat.platforms.length > 0 ? (
                              chat.platforms.map((p) => (
                                <span
                                  key={p}
                                  className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                    selectedChatId === chat.id
                                      ? "bg-white/20 text-white"
                                      : "bg-[#d8d4ff]/50 text-[#434968]"
                                  }`}
                                >
                                  {p}
                                </span>
                              ))
                            ) : (
                              <span
                                className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                  selectedChatId === chat.id
                                    ? "bg-white/20 text-white"
                                    : "bg-[#d8d4ff]/50 text-[#434968]"
                                }`}
                              >
                                {chat.platform || "REPURPOSE"}
                              </span>
                            )}
                          </div>
                          <span className={`text-[10px] font-mono shrink-0 ml-1 ${selectedChatId === chat.id ? "text-slate-300" : "text-slate-400"}`}>
                            {chat.time}
                          </span>
                        </div>
                        <h5 className="text-xs font-semibold truncate">
                          {chat.title}
                        </h5>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* Main Centered Workspace Canvas */}
          <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-10 sm:py-16 w-full max-w-4xl mx-auto my-auto">
            
            {/* Original Heading Text */}
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1a1d2d] mb-3 tracking-tight">
                Repurpose any link into viral content
              </h1>
              <p className="text-sm sm:text-base text-[#434968]">
                Paste your content link below and select target platforms to transform it instantly.
              </p>
            </div>

            {/* Central URL Paste Bar with Integrated Send Button */}
            <div className="w-full rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-indigo-950/5 p-3 flex items-center gap-3 mb-6 transition-all focus-within:border-[#434968] focus-within:ring-2 focus-within:ring-[#7c84b8]/30">
              <div className="pl-3 text-[#7c84b8]">
                <LinkIcon className="w-5 h-5" />
              </div>

              <input
                suppressHydrationWarning
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !isGenerating) handleSend(); }}
                disabled={isGenerating}
                placeholder="Paste YouTube video link, podcast transcript URL, or blog post link here..."
                className={`w-full bg-transparent text-sm sm:text-base text-[#1a1d2d] placeholder-[#8c92b0] focus:outline-none py-2 ${
                  isGenerating ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />

              <button
                onClick={handleSend}
                disabled={!isSendReady}
                title={!isUrlEntered ? "Paste a link first" : !hasSelectedFormats ? "Please select and customize at least one social format below" : "Send link to generate content"}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 ${
                  isGenerating
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                    : isSendReady
                    ? "bg-[#1a1d2d] text-white shadow-md hover:bg-[#434968] cursor-pointer hover:scale-[1.04] active:scale-[0.96]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Multi-Select Platform Pills with Direct Sub-Format Chooser */}
            <div className="w-full flex flex-col items-center mb-8">
              {/* 4 Sleeping-Line Platform Selection Buttons - Multi Select (select 1, 2, or more) */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {/* Instagram Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => togglePlatform("instagram")}
                    disabled={!isUrlEntered || isGenerating}
                    className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2.5 border transition-all duration-300 ${
                      !isUrlEntered || isGenerating
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                        : selectedPlatforms.includes("instagram")
                        ? "bg-[#1a1d2d] text-white border-[#1a1d2d] shadow-md shadow-slate-950/20 scale-105"
                        : "bg-white text-[#434968] border-slate-200 hover:bg-slate-50 cursor-pointer"
                    }`}
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                    {selectedPlatforms.includes("instagram") && (
                      <span className="w-6 h-6 rounded-full bg-[#40455d] text-white text-xs flex items-center justify-center font-bold shadow-xs">
                        {selectedSubFormats.instagram.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* LinkedIn Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => togglePlatform("linkedin")}
                    disabled={!isUrlEntered || isGenerating}
                    className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2.5 border transition-all duration-300 ${
                      !isUrlEntered || isGenerating
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                        : selectedPlatforms.includes("linkedin")
                        ? "bg-[#1a1d2d] text-white border-[#1a1d2d] shadow-md shadow-slate-950/20 scale-105"
                        : "bg-white text-[#434968] border-slate-200 hover:bg-slate-50 cursor-pointer"
                    }`}
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                    {selectedPlatforms.includes("linkedin") && (
                      <span className="w-6 h-6 rounded-full bg-[#40455d] text-white text-xs flex items-center justify-center font-bold shadow-xs">
                        {selectedSubFormats.linkedin.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* X (Twitter) Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => togglePlatform("x")}
                    disabled={!isUrlEntered || isGenerating}
                    className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2.5 border transition-all duration-300 ${
                      !isUrlEntered || isGenerating
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                        : selectedPlatforms.includes("x")
                        ? "bg-[#1a1d2d] text-white border-[#1a1d2d] shadow-md shadow-slate-950/20 scale-105"
                        : "bg-white text-[#434968] border-slate-200 hover:bg-slate-50 cursor-pointer"
                    }`}
                  >
                    <Twitter className="w-4 h-4" />
                    <span>X (Twitter)</span>
                    {selectedPlatforms.includes("x") && (
                      <span className="w-6 h-6 rounded-full bg-[#40455d] text-white text-xs flex items-center justify-center font-bold shadow-xs">
                        {selectedSubFormats.x.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* YouTube Shorts Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => togglePlatform("youtube")}
                    disabled={!isUrlEntered || isGenerating}
                    className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2.5 border transition-all duration-300 ${
                      !isUrlEntered || isGenerating
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                        : selectedPlatforms.includes("youtube")
                        ? "bg-[#1a1d2d] text-white border-[#1a1d2d] shadow-md shadow-slate-950/20 scale-105"
                        : "bg-white text-[#434968] border-slate-200 hover:bg-slate-50 cursor-pointer"
                    }`}
                  >
                    <Youtube className="w-4 h-4" />
                    <span>YouTube Shorts</span>
                    {selectedPlatforms.includes("youtube") && (
                      <span className="w-6 h-6 rounded-full bg-[#40455d] text-white text-xs flex items-center justify-center font-bold shadow-xs">
                        {selectedSubFormats.youtube.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Sub-Format Checkboxes directly below for the active selected platforms */}
              {isUrlEntered && selectedPlatforms.length > 0 && openSubDropdown && (
                <div className="w-full mt-4 bg-white/90 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm backdrop-blur-sm animate-in fade-in-50 duration-200">
                  {/* Tabs to switch which platform's format you are fine-tuning if multiple selected */}
                  {selectedPlatforms.length > 1 && (
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3 overflow-x-auto">
                      <span className="text-[11px] font-mono text-[#7c84b8] uppercase font-bold mr-1 shrink-0">
                        Customize Formats:
                      </span>
                      {selectedPlatforms.map(p => (
                        <div key={p} className="flex items-center">
                          <button
                            type="button"
                            onClick={() => setOpenSubDropdown(p)}
                            className={`px-3 py-1 rounded-l-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                              openSubDropdown === p
                                ? "bg-[#1a1d2d] text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                            }`}
                          >
                            {p === "x" ? "X (Twitter)" : p === "youtube" ? "YouTube" : p}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removePlatform(p);
                            }}
                            className={`px-1.5 py-1 rounded-r-lg border-l border-white/20 text-xs flex items-center justify-center transition-colors cursor-pointer ${
                              openSubDropdown === p
                                ? "bg-[#1a1d2d] text-slate-300 hover:text-white hover:bg-rose-600"
                                : "bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            }`}
                            title={`Remove ${p} format`}
                          >
                            <X className="w-3 h-3 stroke-[2.5]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Format Checkboxes for Active Platform */}
                  {(() => {
                    const currentPlat = (selectedPlatforms.includes(openSubDropdown || "") ? openSubDropdown : selectedPlatforms[0]) || "instagram";
                    return (
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-3">
                          <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#1a1d2d] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#7c84b8]" />
                            What type of {currentPlat === "x" ? "X" : currentPlat === "youtube" ? "YouTube" : currentPlat.charAt(0).toUpperCase() + currentPlat.slice(1)} content do you want?
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-mono text-[#7c84b8]">
                              Select one or more
                            </span>
                            {/* X button to remove this selected platform & unselect its formats */}
                            <button
                              type="button"
                              onClick={() => removePlatform(currentPlat)}
                              className="w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors shadow-xs"
                              title={`Remove ${currentPlat} and unselect all formats`}
                            >
                              <X className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                          {currentPlat === "instagram" && [
                            { id: "Instagram Post", label: "Instagram Post" },
                            { id: "Instagram Carousel Post", label: "Instagram Carousel" },
                            { id: "Instagram Reel Script", label: "Instagram Reel Script" }
                          ].map(item => {
                            const isChecked = selectedSubFormats.instagram.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleSubFormat("instagram", item.id)}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                                  isChecked
                                    ? "bg-indigo-50/70 border-indigo-200 text-indigo-950 font-semibold"
                                    : "bg-slate-50/60 border-slate-200 text-slate-500 hover:border-slate-300"
                                }`}
                              >
                                <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${
                                  isChecked ? "bg-[#1a1d2d] text-white" : "border border-slate-300 bg-white"
                                }`}>
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className="truncate">{item.label}</span>
                              </button>
                            );
                          })}

                          {currentPlat === "linkedin" && [
                            { id: "LinkedIn Post", label: "LinkedIn Post" },
                            { id: "Text and Image", label: "Text & Image" },
                            { id: "Video Script", label: "Video Script" },
                            { id: "Newsletter", label: "Newsletter" }
                          ].map(item => {
                            const isChecked = selectedSubFormats.linkedin.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleSubFormat("linkedin", item.id)}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                                  isChecked
                                    ? "bg-indigo-50/70 border-indigo-200 text-indigo-950 font-semibold"
                                    : "bg-slate-50/60 border-slate-200 text-slate-500 hover:border-slate-300"
                                }`}
                              >
                                <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${
                                  isChecked ? "bg-[#1a1d2d] text-white" : "border border-slate-300 bg-white"
                                }`}>
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className="truncate">{item.label}</span>
                              </button>
                            );
                          })}

                          {currentPlat === "x" && [
                            { id: "Text Post", label: "Text Post" },
                            { id: "Image Post", label: "Image Post" },
                            { id: "Video Script", label: "Video Script" },
                            { id: "Threads", label: "Thread Cascade" }
                          ].map(item => {
                            const isChecked = selectedSubFormats.x.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleSubFormat("x", item.id)}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                                  isChecked
                                    ? "bg-indigo-50/70 border-indigo-200 text-indigo-950 font-semibold"
                                    : "bg-slate-50/60 border-slate-200 text-slate-500 hover:border-slate-300"
                                }`}
                              >
                                <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${
                                  isChecked ? "bg-[#1a1d2d] text-white" : "border border-slate-300 bg-white"
                                }`}>
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className="truncate">{item.label}</span>
                              </button>
                            );
                          })}

                          {currentPlat === "youtube" && [
                            { id: "YouTube Shorts Script", label: "Shorts (9:16 Script)" },
                            { id: "YouTube Video Script", label: "Longform Video Script" }
                          ].map(item => {
                            const isChecked = selectedSubFormats.youtube.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleSubFormat("youtube", item.id)}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                                  isChecked
                                    ? "bg-indigo-50/70 border-indigo-200 text-indigo-950 font-semibold"
                                    : "bg-slate-50/60 border-slate-200 text-slate-500 hover:border-slate-300"
                                }`}
                              >
                                <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${
                                  isChecked ? "bg-[#1a1d2d] text-white" : "border border-slate-300 bg-white"
                                }`}>
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className="truncate">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-mono text-[#7c84b8]">
                      Selected Platforms: <span className="font-bold text-[#1a1d2d]">{selectedPlatforms.length > 0 ? selectedPlatforms.join(", ") : "None (click a platform above)"}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenSubDropdown(null);
                        setIsFormatConfigured(true);
                      }}
                      className="px-5 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 bg-[#1a1d2d] text-white hover:bg-[#434968] shadow-sm transition-all cursor-pointer hover:scale-[1.01]"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Format Selection</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Scraped Content Source Preview Card with Embedded Media (Video / Photo) - Displayed at the Top */}
            {scrapedSource && (
              <div className="w-full rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-indigo-950/5 p-5 sm:p-6 mb-8 transition-all overflow-hidden">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#1a1d2d] text-white uppercase tracking-wider">
                      {scrapedSource.platform?.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-[#434968]">
                      {scrapedSource.contentType}
                    </span>
                  </div>
                  {scrapedSource.author && (
                    <span className="text-xs text-[#7c84b8] font-mono">
                      By {scrapedSource.author}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* Embedded Media Preview: YouTube Video / Instagram Carousel or Embed / X Video or Photo / LinkedIn */}
                  <div className="md:col-span-5 w-full">
                    {scrapedSource.platform === "youtube" && scrapedSource.metadata?.videoId ? (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${scrapedSource.metadata.videoId}?rel=0`}
                          title={scrapedSource.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : scrapedSource.platform === "instagram" && scrapedSource.metadata?.shortcode ? (
                      <div className="relative w-full aspect-square max-h-[340px] rounded-2xl overflow-hidden shadow-md bg-white border border-slate-100 flex flex-col justify-center items-center">
                        {scrapedSource.carouselPhotos && scrapedSource.carouselPhotos.length > 0 ? (
                          <div className="w-full h-full relative group bg-black/5 flex items-center justify-center">
                            <img
                              src={scrapedSource.carouselPhotos[0]}
                              alt={scrapedSource.title}
                              className="w-full h-full object-contain"
                            />
                            {scrapedSource.carouselPhotos.length > 1 && (
                              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-mono font-bold text-white flex items-center gap-1.5 shadow-xl">
                                <span>1/{scrapedSource.carouselPhotos.length} CAROUSEL</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <iframe
                            src={`https://www.instagram.com/p/${scrapedSource.metadata.shortcode}/embed/`}
                            title={scrapedSource.title}
                            className="w-full h-full border-0 rounded-2xl"
                            scrolling="no"
                            allowTransparency
                          />
                        )}
                      </div>
                    ) : scrapedSource.platform === "x" && scrapedSource.metadata?.statusId && (!scrapedSource.mediaUrl || scrapedSource.mediaUrl.includes("Tweet.html")) ? (
                      <div className="relative w-full min-h-[320px] max-h-[380px] rounded-2xl overflow-hidden shadow-md bg-white border border-slate-100">
                        <iframe
                          src={`https://platform.twitter.com/embed/Tweet.html?id=${scrapedSource.metadata.statusId}`}
                          title="X Tweet Media"
                          className="w-full h-full border-0 min-h-[320px]"
                          allowFullScreen
                        />
                      </div>
                    ) : (scrapedSource.mediaUrl || scrapedSource.thumbnailUrl) ? (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-black flex items-center justify-center group">
                        <img
                          src={scrapedSource.thumbnailUrl || scrapedSource.mediaUrl}
                          alt={scrapedSource.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Video Play Button Overlay for Video Thumbnails */}
                        {scrapedSource.mediaType === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                            <div className="w-12 h-12 rounded-full bg-white/90 text-slate-900 shadow-xl flex items-center justify-center pl-1 backdrop-blur-sm group-hover:scale-110 transition-transform">
                              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white">
                          {scrapedSource.mediaType === "video" ? "VIDEO" : scrapedSource.carouselPhotos ? "CAROUSEL" : "PHOTO"}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Scraped Content Details */}
                  <div className="md:col-span-7 flex flex-col justify-center">
                    <h4 className="font-heading font-extrabold text-base sm:text-lg text-[#1a1d2d] mb-2 leading-snug">
                      {scrapedSource.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#434968] line-clamp-3 leading-relaxed mb-3">
                      {scrapedSource.description || scrapedSource.extractedText}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Content & Media Extracted Successfully</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Indicator Screen with AbstractCubeIsometricLoader (Light Theme) - Placed directly below Scraped Source */}
            {isGenerating && (
              <div className="w-full bg-white/95 border border-slate-200/90 rounded-3xl p-10 mb-8 text-center shadow-xl backdrop-blur-md flex flex-col items-center justify-center">
                <div className="mb-6 flex items-center justify-center">
                  <AbstractCubeIsometricLoader
                    dotSize={8}
                    gap={5}
                    speed={1.1}
                    color="#1a1d2d"
                    opacity={0.14}
                  />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-[#1a1d2d] mb-1 tracking-tight">
                  Scraping Media &amp; Synthesizing AI Formats
                </h3>
                <p className="text-xs text-[#7c84b8] max-w-md mx-auto mb-4 font-mono leading-relaxed">
                  Executing scrapers for selected platforms, normalizing content, enforcing native character &amp; hashtag rules...
                </p>
                <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-[#1a1d2d] animate-pulse rounded-full" />
                </div>
              </div>
            )}

            {/* Dedicated Platform-Specific Content Creation & Live Post Preview UI */}
            {generatedResults && selectedPlatforms.length > 0 ? (
              <div className="w-full mb-12">
                {/* When multiple platforms were generated, show a clean switcher bar on top of the live preview */}
                {selectedPlatforms.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mr-1">
                      Viewing Preview:
                    </span>
                    {selectedPlatforms.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setActiveTab(p)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                          activeTab === p
                            ? "bg-[#1a1d2d] text-white border-[#1a1d2d] shadow-sm scale-105"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {p === "instagram" && <Instagram className="w-3.5 h-3.5" />}
                        {p === "linkedin" && <Linkedin className="w-3.5 h-3.5" />}
                        {p === "x" && <Twitter className="w-3.5 h-3.5" />}
                        {p === "youtube" && <Youtube className="w-3.5 h-3.5" />}
                        <span className="capitalize">{p === "x" ? "X" : p === "youtube" ? "Shorts" : p}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Render ALL selected sub-formats for the active platform: */}
                {(() => {
                  const platData = generatedResults[activeTab];
                  const formatsMap = platData?.formats || {};
                  const userSubFormats = selectedSubFormats[activeTab as keyof typeof selectedSubFormats] || [];

                  // If user selected Reel Script or Video Script, render the comprehensive VideoScriptDirectorView (not phone mockup)
                  // If user selected Post / Carousel / Text & Image, render the realistic feed post preview
                  return (
                    <div className="flex flex-col gap-10">
                      {userSubFormats.map((fmtName) => {
                        const fmtData = formatsMap[fmtName] || platData || {};
                        const isVideoOrReel = fmtName.toLowerCase().includes("reel") ||
                          fmtName.toLowerCase().includes("video") ||
                          fmtName.toLowerCase().includes("script") ||
                          fmtName.toLowerCase().includes("shorts");

                        if (isVideoOrReel) {
                          return (
                            <VideoScriptDirectorView
                              key={fmtName}
                              platformName={activeTab.toUpperCase()}
                              formatName={fmtName}
                              title={fmtData.title || scrapedSource?.title || "Video Production Script"}
                              hook={fmtData.hook}
                              scriptBreakdown={fmtData.breakdown || fmtData.script || fmtData.content}
                              caption={fmtData.caption || fmtData.content || ""}
                              hashtags={fmtData.hashtags || ["#viral", "#repurpose"]}
                              description={fmtData.description}
                              onRegenerate={async () => {
                                if (!scrapedSource) return;
                                const genRes = await fetch("/api/generate", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    url,
                                    scrapedText: scrapedSource.extractedText || scrapedSource.description,
                                    title: scrapedSource.title,
                                    sourcePlatform: scrapedSource.platform,
                                    targetPlatform: activeTab,
                                    selectedSubFormats: [fmtName]
                                  })
                                });
                                const genData = await genRes.json();
                                if (genData.success && genData.results?.[activeTab]) {
                                  setGeneratedResults(prev => ({
                                    ...prev,
                                    [activeTab]: {
                                      ...prev?.[activeTab],
                                      formats: {
                                        ...(prev?.[activeTab]?.formats || {}),
                                        ...(genData.results[activeTab]?.formats || {})
                                      }
                                    }
                                  }));
                                }
                              }}
                            />
                          );
                        }

                        // Feed Post Mockup Views
                        if (activeTab === "instagram") {
                          return (
                            <InstagramPostEditor
                              key={fmtName}
                              initialCaption={fmtData.caption || fmtData.content || ""}
                              initialHashtags={fmtData.hashtags || ["#contentcreator", "#marketing", "#growth"]}
                              initialImage={
                                scrapedSource?.carouselPhotos && scrapedSource.carouselPhotos.length > 0
                                  ? scrapedSource.carouselPhotos[0]
                                  : scrapedSource?.mediaUrl || scrapedSource?.thumbnailUrl
                              }
                              sourceTitle={scrapedSource?.title || url}
                              authorName={profile.name || "repurposeone"}
                              formatType={fmtName}
                              onRegenerate={async () => {
                                if (!scrapedSource) return;
                                const genRes = await fetch("/api/generate", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    url,
                                    scrapedText: scrapedSource.extractedText || scrapedSource.description,
                                    title: scrapedSource.title,
                                    sourcePlatform: scrapedSource.platform,
                                    targetPlatform: "instagram",
                                    selectedSubFormats: [fmtName]
                                  })
                                });
                                const genData = await genRes.json();
                                if (genData.success && genData.results?.instagram) {
                                  setGeneratedResults(prev => ({ ...prev, instagram: genData.results.instagram }));
                                }
                              }}
                            />
                          );
                        }

                        if (activeTab === "linkedin") {
                          return (
                            <LinkedInPostEditor
                              key={fmtName}
                              initialContent={fmtData.post || fmtData.caption || fmtData.content || ""}
                              initialHashtags={fmtData.hashtags || ["#leadership", "#innovation", "#productivity"]}
                              sourceTitle={scrapedSource?.title || url}
                              authorName={profile.name || "Content Creator"}
                              formatType={fmtName}
                              onRegenerate={async () => {
                                if (!scrapedSource) return;
                                const genRes = await fetch("/api/generate", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    url,
                                    scrapedText: scrapedSource.extractedText || scrapedSource.description,
                                    title: scrapedSource.title,
                                    sourcePlatform: scrapedSource.platform,
                                    targetPlatform: "linkedin",
                                    selectedSubFormats: [fmtName]
                                  })
                                });
                                const genData = await genRes.json();
                                if (genData.success && genData.results?.linkedin) {
                                  setGeneratedResults(prev => ({ ...prev, linkedin: genData.results.linkedin }));
                                }
                              }}
                            />
                          );
                        }

                        if (activeTab === "x") {
                          return (
                            <XPostEditor
                              key={fmtName}
                              initialContent={fmtData.post || fmtData.caption || fmtData.content || ""}
                              initialHashtags={fmtData.hashtags || ["#buildinpublic", "#creator"]}
                              initialImage={scrapedSource?.mediaUrl || scrapedSource?.thumbnailUrl}
                              sourceTitle={scrapedSource?.title || url}
                              authorName={profile.name || "Creator"}
                              onRegenerate={async () => {
                                if (!scrapedSource) return;
                                const genRes = await fetch("/api/generate", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    url,
                                    scrapedText: scrapedSource.extractedText || scrapedSource.description,
                                    title: scrapedSource.title,
                                    sourcePlatform: scrapedSource.platform,
                                    targetPlatform: "x",
                                    selectedSubFormats: [fmtName]
                                  })
                                });
                                const genData = await genRes.json();
                                if (genData.success && genData.results?.x) {
                                  setGeneratedResults(prev => ({ ...prev, x: genData.results.x }));
                                }
                              }}
                            />
                          );
                        }

                        return (
                          <YouTubeShortsEditor
                            key={fmtName}
                            initialTitle={fmtData.title || scrapedSource?.title || "How to Repurpose Content in 60s"}
                            initialScript={fmtData.script || fmtData.content || ""}
                            initialDescription={fmtData.description || scrapedSource?.description || ""}
                            initialHashtags={fmtData.hashtags || ["#shorts", "#repurpose"]}
                            sourceTitle={scrapedSource?.title || url}
                            authorName={scrapedSource?.author || profile.name || "Creator"}
                            onRegenerate={async () => {
                              if (!scrapedSource) return;
                              const genRes = await fetch("/api/generate", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  url,
                                  scrapedText: scrapedSource.extractedText || scrapedSource.description,
                                  title: scrapedSource.title,
                                  sourcePlatform: scrapedSource.platform,
                                  targetPlatform: "youtube",
                                  selectedSubFormats: [fmtName]
                                })
                              });
                              const genData = await genRes.json();
                              if (genData.success && genData.results?.youtube) {
                                setGeneratedResults(prev => ({ ...prev, youtube: genData.results.youtube }));
                              }
                            }}
                          />
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            ) : null}

          </main>
        </div>

      </div>
    </MagneticCursor>
  );
}
