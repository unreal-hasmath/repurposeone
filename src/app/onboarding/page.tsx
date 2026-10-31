"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  Facebook
} from "lucide-react";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Basic Profile (Blank by default)
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");

  // Step 2: Social Media Platforms (Blank by default)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // Step 3: Content Goals (Blank by default + Other button)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState("");

  // Step 4: Content Creation Preferences & Language (Only English, Tamil, Hindi)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [customType, setCustomType] = useState("");
  const [language, setLanguage] = useState("");

  // Check if existing user info is present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("repurpose_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name && parsed.name !== "Creator") {
            setName(parsed.name);
          }
        } catch (e) {}
      }
    }
  }, []);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const toggleGoal = (g: string) => {
    setSelectedGoals((prev) =>
      prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g]
    );
  };

  const toggleType = (t: string) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  // Validation
  const isStep1Valid = name.trim().length > 0 && (role.length > 0 && (role !== "Other" || customRole.trim().length > 0));
  const isStep2Valid = selectedPlatforms.length > 0;
  const isStep3Valid = selectedGoals.length > 0 && (!selectedGoals.includes("Other") || customGoal.trim().length > 0);
  const isStep4Valid = selectedTypes.length > 0 && language.length > 0 && (!selectedTypes.includes("Other") || customType.trim().length > 0);

  const canProceed = () => {
    if (currentStep === 1) return isStep1Valid;
    if (currentStep === 2) return isStep2Valid;
    if (currentStep === 3) return isStep3Valid;
    if (currentStep === 4) return isStep4Valid;
    return false;
  };

  const handleNext = () => {
    if (!canProceed()) return;

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save all inputted user profile preferences
      if (typeof window !== "undefined") {
        const finalRole = role === "Other" ? customRole : role;
        const finalGoals = selectedGoals.map(g => g === "Other" ? customGoal : g);
        const finalTypes = selectedTypes.map(t => t === "Other" ? customType : t);
        
        localStorage.setItem("repurpose_profile", JSON.stringify({
          name: name.trim(),
          role: finalRole,
          platforms: selectedPlatforms,
          goals: finalGoals,
          types: finalTypes,
          language: language,
        }));

        localStorage.setItem("repurpose_user", JSON.stringify({
          name: name.trim(),
          email: "creator@repurposeone.com"
        }));
      }

      router.push("/workspace");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
      <div className="min-h-screen w-full bg-[#f8f9fd] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        
        {/* Background lavender glow */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(216,212,255,0.45)_0%,rgba(235,238,255,0.2)_35%,rgba(248,249,253,1)_70%)] pointer-events-none" />

      {/* Main Container Card (4 Steps Total) */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-indigo-950/10 p-8 sm:p-12 overflow-hidden flex flex-col justify-between min-h-[580px]">
        
        <div>
          {/* Header & Step progress */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-8">
            <div className="flex items-center gap-3">
              <Link
                href="/auth"
                className="w-8 h-8 rounded-xl border border-slate-200 text-[#434968] hover:bg-slate-50 flex items-center justify-center transition-colors shadow-xs"
                title="Back to Sign In"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link href="/" className="flex items-center hover:opacity-85 transition-opacity">
                <img src="/logo.png" alt="RepurposeOne" className="h-8 w-auto object-contain" />
              </Link>
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-[#d8d4ff]/40 text-[#434968] font-mono text-xs font-bold border border-[#7c84b8]/30">
              STEP 0{currentStep} OF 04
            </div>
          </div>

          {/* STEP 1: Basic Profile */}
          {currentStep === 1 && (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#7c84b8] font-semibold mb-1">
                Your profile
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1a1d2d] mb-2">
                First, let's get to know you.
              </h2>
              <p className="text-sm text-[#7c829e] mb-6">
                A little about you helps us create a better content experience.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#1a1d2d] mb-1.5 uppercase tracking-wider">
                    What should we call you? *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200/90 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/40 focus:border-[#434968]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1a1d2d] mb-1.5 uppercase tracking-wider">
                    What's your role? *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                        onClick={() => setRole(r)}
                        className={`p-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                          role === r
                            ? "bg-[#1a1d2d] text-white border-[#1a1d2d] shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  {role === "Other" && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        placeholder="Please specify your role..."
                        autoFocus
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#7c84b8] bg-[#f8f9fd] text-xs font-medium text-slate-900 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Social Media Preferences */}
          {currentStep === 2 && (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#7c84b8] font-semibold mb-1">
                Your platforms
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1a1d2d] mb-2">
                Where do you create content?
              </h2>
              <p className="text-sm text-[#7c829e] mb-6">
                Select all the platforms you use regularly. We'll prioritize these in your workspace.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  { name: "Instagram", icon: Instagram },
                  { name: "LinkedIn", icon: Linkedin },
                  { name: "YouTube", icon: Youtube },
                  { name: "X (Twitter)", icon: Twitter },
                  { name: "Facebook", icon: Facebook },
                ].map((p) => {
                  const Icon = p.icon;
                  const isSelected = selectedPlatforms.includes(p.name);
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => togglePlatform(p.name)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "bg-[#1a1d2d] text-white border-[#1a1d2d] shadow-md"
                          : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-heading font-semibold text-sm">{p.name}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "border-white bg-[#434968]" : "border-slate-300"}`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-mono font-semibold text-[#7c84b8]">
                {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? "s" : ""} selected
              </div>
            </div>
          )}

          {/* STEP 3: Content Goals */}
          {currentStep === 3 && (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#7c84b8] font-semibold mb-1">
                Content Goals
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1a1d2d] mb-2">
                What do you mainly want to achieve with RepurposeOne?
              </h2>
              <p className="text-sm text-[#7c829e] mb-6">
                Allow multiple selections. Select at least one to continue.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                {[
                  "Grow my audience",
                  "Build my personal brand",
                  "Promote my business",
                  "Generate leads",
                  "Create content consistently",
                  "Save time on content creation",
                  "Other"
                ].map((goal) => {
                  const isSelected = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all text-xs font-semibold ${
                        isSelected
                          ? "bg-[#1a1d2d] text-white border-[#1a1d2d] shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>{goal}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#d8d4ff]" />}
                    </button>
                  );
                })}
              </div>

              {selectedGoals.includes("Other") && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="Specify your content goal..."
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#7c84b8] bg-[#f8f9fd] text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Content Creation Preferences & Language */}
          {currentStep === 4 && (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#7c84b8] font-semibold mb-1">
                Preferences
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1a1d2d] mb-2">
                What type of content do you usually create?
              </h2>
              <p className="text-sm text-[#7c829e] mb-4">
                Select your genres and preferred output language.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {[
                  "Educational",
                  "Business & Entrepreneurship",
                  "Technology & AI",
                  "Entertainment & Memes",
                  "Personal Branding",
                  "Marketing & Sales",
                  "Lifestyle",
                  "News & Updates",
                  "Other"
                ].map((type) => {
                  const isSelected = selectedTypes.includes(type);
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

              {selectedTypes.includes("Other") && (
                <div className="mb-4">
                  <input
                    type="text"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="Specify other content type..."
                    autoFocus
                    className="w-full px-3.5 py-2 rounded-xl border border-[#7c84b8] bg-[#f8f9fd] text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1a1d2d] mb-2 uppercase tracking-wider">
                  Language Preference: *
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {["English", "Tamil", "Hindi"].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        language === lang
                          ? "bg-[#1a1d2d] text-white border-[#1a1d2d] shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Actions Navigation */}
        <div className="pt-8 border-t border-slate-100 flex items-center justify-between mt-8">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#434968] hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              canProceed()
                ? "bg-[#1a1d2d] text-white shadow hover:bg-[#434968] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <span>{currentStep === 4 ? "Complete & Go to Workspace" : "Continue"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
    </MagneticCursor>
  );
}
