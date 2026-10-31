"use client";

import Navbar from "@/components/landing/Navbar";
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";
import SectionEcosystem from "@/components/landing/SectionEcosystem";
import SectionTransformation from "@/components/landing/SectionTransformation";
import SectionHowItWorks from "@/components/landing/SectionHowItWorks";
import SectionBentoFeatures from "@/components/landing/SectionBentoFeatures";
import SectionBrandVoice from "@/components/landing/SectionBrandVoice";
import SectionQualityChecker from "@/components/landing/SectionQualityChecker";
import SectionWhoIsItFor from "@/components/landing/SectionWhoIsItFor";
import SectionFAQ from "@/components/landing/SectionFAQ";
import SectionCustomerReviews from "@/components/landing/SectionCustomerReviews";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f9fd] text-[#1c2033] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Floating Navigation */}
      <Navbar />

      {/* 3D Spatial Corridor Hero */}
      <section className="relative w-full">
        <PerspectiveTunnelHero />
      </section>

      {/* Section 01 — Social media ecosystem */}
      <SectionEcosystem />

      {/* Section 02 — The transformation experience */}
      <SectionTransformation />

      {/* Section 03 — How it works */}
      <SectionHowItWorks />

      {/* Section 04 — Features showcase (Bento grid) */}
      <SectionBentoFeatures />

      {/* Section 05 — Brand Voice showcase */}
      <SectionBrandVoice />

      {/* Section 06 — Content quality checker */}
      <SectionQualityChecker />

      {/* Section 07 — Who is it for? */}
      <SectionWhoIsItFor />

      {/* Section 08 — FAQ */}
      <SectionFAQ />

      {/* Section 09 — Customer Reviews Carousel */}
      <SectionCustomerReviews />

      {/* Footer */}
      <Footer />
    </div>
  );
}
