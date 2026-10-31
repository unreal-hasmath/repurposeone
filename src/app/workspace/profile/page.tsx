"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Check,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  Facebook,
  LogOut,
  User,
  Sliders,
  Sparkles
} from "lucide-react";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";

interface UserProfile {
  name: string;
  role: string;
  platforms: string[];
  goals: string[];
  types: string[];
  language: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    role: "",
    platforms: [],
    goals: [],
    types: [],
    language: "English"
  });

  const [initialProfile, setInitialProfile] = useState<UserProfile | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load profile from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("repurpose_profile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile(parsed);
          setInitialProfile(parsed);
        } catch (e) {}
      } else {
        const user = localStorage.getItem("repurpose_user");
        if (user) {
          try {
            const u = JSON.parse(user);
            const initial = {
              name: u.name || "Creator",
              role: "Content Creator",
              platforms: ["Instagram", "YouTube"],
              goals: ["Grow my audience"],
              types: ["Educational"],
              language: "English"
            };
            setProfile(initial);
            setInitialProfile(initial);
          } catch (e) {}
        }
      }
    }
  }, []);

  // Detect unsaved changes to automatically display the bottom Save button
  useEffect(() => {
    if (initialProfile) {
      const changed = JSON.stringify(profile) !== JSON.stringify(initialProfile);
      setHasChanges(changed);
    }
  }, [profile, initialProfile]);

  const togglePlatform = (p: string) => {
    setProfile(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter(item => item !== p)
        : [...prev.platforms, p]
    }));
  };

  const toggleGoal = (g: string) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(g)
        ? prev.goals.filter(item => item !== g)
        : [...prev.goals, g]
    }));
  };

  const toggleType = (t: string) => {
    setProfile(prev => ({
      ...prev,
      types: prev.types.includes(t)
        ? prev.types.filter(item => item !== t)
        : [...prev.types, t]
    }));
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("repurpose_profile", JSON.stringify(profile));
      localStorage.setItem("repurpose_user", JSON.stringify({
        name: profile.name,
        email: "creator@repurposeone.com"
      }));
    }
    setInitialProfile(profile);
    setHasChanges(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("repurpose_user");
      localStorage.removeItem("repurpose_profile");
    }
    router.push("/auth");
  };

  return (
    <MagneticCursor
      cursorSize={26}
      cursorColor="#ffffff"
      blendMode="difference"
      contrastBoost={1.6}
      speedMultiplier={0.02}
    >
      <div className="min-h-screen bg-[#f8f9fd] text-[#1a1d2d] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-28">
        
        {/* Background lavender glow matching spatial corridor */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(216,212,255,0.45)_0%,rgba(235,238,255,0.2)_35%,rgba(248,249,253,1)_70%)] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 sm:px-10 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Left: Back arrow + Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/workspace"
              className="w-9 h-9 rounded-xl border border-slate-200 text-[#434968] hover:bg-slate-50 flex items-center justify-center transition-colors shadow-xs"
              title="Back to Workspace"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="flex items-center hover:opacity-85 transition-opacity"
            >
              <img src="/logo.png" alt="RepurposeOne" className="h-8 w-auto object-contain" />
            </Link>
          </div>

          <div className="font-heading font-extrabold text-lg text-[#1a1d2d]">
            Creator Profile &amp; Preferences
          </div>

          <div className="w-9" />
        </div>
      </header>

      {/* Main Profile Editor Container */}
      <main className="relative z-10 flex-1 max-w-3xl w-full mx-auto px-6 py-10">
        
        {/* Profile Card Header */}
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-indigo-950/5 p-6 sm:p-8 mb-8 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1a1d2d] to-[#434968] flex items-center justify-center text-white font-heading font-black text-2xl shadow-md shrink-0">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "C"}
          </div>
          <div className="flex-1">
            <h1 className="font-heading font-bold text-2xl text-[#1a1d2d]">
              {profile.name || "Creator"}
            </h1>
            <p className="text-xs font-mono text-[#7c84b8] font-semibold mt-0.5">
              {profile.role || "Content Creator"} · {profile.language}
            </p>
          </div>
        </div>

        {/* 1. Basic Profile (Name & Role) */}
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-indigo-950/5 p-6 sm:p-8 mb-6">
          <h2 className="font-heading font-bold text-lg text-[#1a1d2d] mb-4">
            1. Basic Profile
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1a1d2d] mb-1.5 uppercase tracking-wider">
                What should we call you?
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a1d2d] mb-1.5 uppercase tracking-wider">
                What's your role?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  "Content Creator",
                  "Business Owner",
                  "Founder / Entrepreneur",
                  "Digital Marketer",
                  "Social Media Manager",
                  "Student",
                  "Other"
                ].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setProfile({ ...profile, role: r })}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                      profile.role === r
                        ? "bg-[#1a1d2d] text-white border-[#1a1d2d]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Target Platforms */}
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-indigo-950/5 p-6 sm:p-8 mb-6">
          <h2 className="font-heading font-bold text-lg text-[#1a1d2d] mb-1">
            2. Social Media Platforms
          </h2>
          <p className="text-xs text-[#7c829e] mb-4">
            Select the platforms you regularly prioritize.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { name: "Instagram", icon: Instagram },
              { name: "LinkedIn", icon: Linkedin },
              { name: "YouTube", icon: Youtube },
              { name: "X (Twitter)", icon: Twitter },
              { name: "Facebook", icon: Facebook },
            ].map((p) => {
              const Icon = p.icon;
              const isSelected = profile.platforms.includes(p.name);
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => togglePlatform(p.name)}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-[#1a1d2d] text-white border-[#1a1d2d]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {p.name}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Content Goals */}
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-indigo-950/5 p-6 sm:p-8 mb-6">
          <h2 className="font-heading font-bold text-lg text-[#1a1d2d] mb-1">
            3. Content Goals
          </h2>
          <p className="text-xs text-[#7c829e] mb-4">
            What you mainly want to achieve with RepurposeOne.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Grow my audience",
              "Build my personal brand",
              "Promote my business",
              "Generate leads",
              "Create content consistently",
              "Save time on content creation"
            ].map((goal) => {
              const isSelected = profile.goals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-[#1a1d2d] text-white border-[#1a1d2d]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{goal}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Content Niches & Language */}
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-indigo-950/5 p-6 sm:p-8 mb-6">
          <h2 className="font-heading font-bold text-lg text-[#1a1d2d] mb-1">
            4. Content Niches & Language
          </h2>
          <p className="text-xs text-[#7c829e] mb-4">
            Customize your creative tone and output language.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            {[
              "Educational",
              "Business & Entrepreneurship",
              "Technology & AI",
              "Entertainment & Memes",
              "Personal Branding",
              "Marketing & Sales",
              "Lifestyle",
              "News & Updates"
            ].map((type) => {
              const isSelected = profile.types.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-[#1a1d2d] text-white border-[#1a1d2d]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1a1d2d] mb-2 uppercase tracking-wider">
              Language Preference:
            </label>
            <div className="flex items-center gap-2">
              {["English", "Tamil", "Hindi"].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setProfile({ ...profile, language: lang })}
                  className={`px-5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    profile.language === lang
                      ? "bg-[#1a1d2d] text-white border-[#1a1d2d]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sign Out Section placed at bottom of page content */}
        <div className="mt-8 pt-8 border-t border-slate-200/80 flex flex-col items-center justify-center text-center">
          <p className="text-xs text-slate-500 mb-3">
            Want to switch accounts or finish this session?
          </p>
          <button
            onClick={handleSignOut}
            className="px-6 py-2.5 rounded-xl border border-rose-200 bg-rose-50/60 text-rose-600 hover:bg-rose-100/80 hover:text-rose-700 text-xs font-bold flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <span>Sign Out of RepurposeOne</span>
          </button>
        </div>

      </main>

      {/* Floating Bottom Bar: Automatically appears as soon as anything is changed */}
      {(hasChanges || isSaved) && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#141726] text-white px-5 py-3.5 shadow-2xl border border-white/10 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">
              {isSaved ? "✓ Profile updated successfully!" : "You have unsaved changes"}
            </span>

            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-white text-slate-950 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}

    </div>
    </MagneticCursor>
  );
}
