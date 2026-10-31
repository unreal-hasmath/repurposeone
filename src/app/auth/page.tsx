"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [optOutEmails, setOptOutEmails] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userName = firstName ? `${firstName} ${lastName}`.trim() : email ? email.split("@")[0] : "";

    if (typeof window !== "undefined") {
      localStorage.setItem("repurpose_user", JSON.stringify({ name: userName, email: email }));
    }

    setTimeout(() => {
      router.push("/onboarding");
    }, 350);
  };

  const handleSocialAuth = (provider: string) => {
    setLoading(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("repurpose_user", JSON.stringify({ name: `${provider} Creator`, email: `creator@${provider.toLowerCase()}.com` }));
    }
    setTimeout(() => {
      router.push("/onboarding");
    }, 350);
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
        
        {/* Soft lavender background glow */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(216,212,255,0.45)_0%,rgba(235,238,255,0.2)_35%,rgba(248,249,253,1)_70%)] pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-5xl rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-indigo-950/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Form Column */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="w-8 h-8 rounded-xl border border-slate-200 text-[#434968] hover:bg-slate-50 flex items-center justify-center transition-colors shadow-xs"
                  title="Back to Home"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <Link href="/" className="flex items-center hover:opacity-85 transition-opacity">
                  <img src="/logo.png" alt="RepurposeOne" className="h-8 w-auto object-contain" />
                </Link>
              </div>
              <div className="text-xs text-[#7c829e] font-medium">
                {isSignUp ? (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(false)}
                      className="font-bold text-[#1a1d2d] underline hover:text-[#434968]"
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(true)}
                      className="font-bold text-[#1a1d2d] underline hover:text-[#434968]"
                    >
                      Sign Up
                    </button>
                  </span>
                )}
              </div>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1a1d2d] mb-6">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h1>

            {/* Social Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleSocialAuth("Google")}
                disabled={loading}
                className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 shadow-sm transition-all active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{isSignUp ? "Sign up with Google" : "Sign in with Google"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialAuth("Apple")}
                disabled={loading}
                className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 shadow-sm transition-all active:scale-[0.98]"
              >
                <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.76.99.08 2.03-.51 2.68-1.26z"/>
                </svg>
                <span>{isSignUp ? "Sign up with Apple" : "Sign in with Apple"}</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center my-6">
              <div className="w-full border-t border-slate-200"></div>
              <span className="bg-white px-3 text-[11px] font-mono uppercase text-[#7c829e] absolute">
                or
              </span>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#1a1d2d] mb-1.5">
                      First name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/40 focus:border-[#434968] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1a1d2d] mb-1.5">
                      Last name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/40 focus:border-[#434968] transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#1a1d2d] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/40 focus:border-[#434968] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1a1d2d] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7c84b8]/40 focus:border-[#434968] transition-all pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-2 pt-1 text-xs text-[#7c829e]">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={optOutEmails}
                      onChange={(e) => setOptOutEmails(e.target.checked)}
                      className="rounded border-slate-300 text-[#1a1d2d] focus:ring-0 mt-0.5"
                    />
                    <span>I don't want to receive emails about RepurposeOne feature updates and best practices.</span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="rounded border-slate-300 text-[#1a1d2d] focus:ring-0 mt-0.5"
                    />
                    <span>
                      By creating an account, you agree to our{" "}
                      <a href="#" className="underline text-[#1a1d2d]">Terms of Service</a> and{" "}
                      <a href="#" className="underline text-[#1a1d2d]">Privacy Policy</a>.
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#1a1d2d] hover:bg-[#434968] text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
              >
                <span>{loading ? "Preparing onboarding..." : isSignUp ? "Sign Up & Get Started" : "Sign In & Continue"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-[#7c829e] mt-6">
            <span>© 2026 RepurposeOne</span>
            <Link href="/" className="hover:text-[#1a1d2d] transition-colors font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Right Testimonial Column */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#181a24] via-[#141620] to-[#0f1118] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(255,255,255,0.08)_20px,rgba(255,255,255,0.08)_21px)]" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Charlotte"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-heading font-bold text-sm text-white">Charlotte</div>
              <div className="text-xs text-[#7c84b8] font-mono">Full-Time Creator & Podcaster</div>
            </div>
          </div>

          <div className="relative z-10 my-auto py-10">
            <blockquote className="font-heading text-2xl sm:text-3xl font-normal leading-snug text-slate-100">
              “One YouTube video used to take me all weekend to turn into posts. With RepurposeOne, I publish to LinkedIn, X, and Instagram in under 60 seconds.”
            </blockquote>
          </div>

          <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 text-xs text-[#7c84b8] font-mono">
            <span>CREATOR SUITE</span>
            <span>v2.4 READY</span>
          </div>
        </div>

      </div>

    </div>
    </MagneticCursor>
  );
}
