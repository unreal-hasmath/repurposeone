import { NextRequest, NextResponse } from "next/server";
import { scrapeSocialMediaContent, detectAndNormalizeSocialUrl } from "@/lib/social-scraper";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const detected = detectAndNormalizeSocialUrl(url);
    const scraped = await scrapeSocialMediaContent(url);

    // AI Repurposing Engine: generate platform-tailored content based on the scraped content
    const baseTitle = scraped.title || "Content Breakdown";
    const baseText = scraped.extractedText || scraped.description || "Core Insights";
    const author = scraped.author || "Creator";

    const generatedResults = {
      youtube: {
        platform: "YouTube Shorts",
        badge: "9:16 VERTICAL SCRIPT",
        preview: `[0:00 - 0:03 HOOK] "Most creators miss this when consuming ${scraped.contentType} from ${author}..."\n\n[0:03 - 0:18 BREAKDOWN]\n• Core Insight: "${baseTitle}"\n• The Shift: ${baseText.slice(0, 140)}...\n\n[0:18 - 0:45 PAYOFF]\n1. Why standard formats fail\n2. The 3-step multiplier derived from this link\n3. High-retention visual hook\n\n[0:45 - 0:60 CTA] "Double tap if you want the full breakdown and subscribe for daily creator breakdowns!"`,
      },
      instagram: {
        platform: "Instagram Carousel",
        badge: "SWIPEABLE SLIDE DECK (7 SLIDES)",
        preview: `Slide 1 (Cover): ${baseTitle} ⚡\nSlide 2 (The Problem): Why 90% miss the point of this breakdown.\nSlide 3 (Core Pillar): ${baseText.slice(0, 110)}...\nSlide 4 (Action Framework): Step 1 → Step 2 → Step 3\nSlide 5 (Platform Nuance): Adapting for short-attention feeds\nSlide 6 (Key Takeaway): Summary cheat-sheet\nSlide 7 (CTA & Caption): "Source: ${author} (${scraped.contentType}). Save this carousel for later reference!"`,
      },
      linkedin: {
        platform: "LinkedIn Carousel & Post",
        badge: "B2B THOUGHT LEADERSHIP POST",
        preview: `The biggest mistake founders make with ${scraped.platform.toUpperCase()} content:\n\nThey consume great insights like "${baseTitle}" but never operationalize them.\n\nHere are 3 frameworks extracted from this breakdown:\n\n1. Distribution Velocity: How ${author} captures retention.\n2. Key Data Point: "${baseText.slice(0, 160)}..."\n3. The Takeaway: Turn one piece of research into multi-touch collateral.\n\nRead the full PDF slides attached below. What's your distribution playbook this quarter?`,
      },
      x: {
        platform: "X (Twitter) Thread",
        badge: "8-POST CASCADE THREAD",
        preview: `1/8 How to turn "${baseTitle}" into 100K+ impressions across feeds 🧵👇\n\n2/8 The original insight from ${author}:\n"${baseText.slice(0, 140)}..."\n\n3/8 Why this is critical right now:\nAlgorithms prioritize dwell time over raw frequency.\n\n4/8 Step 1: Hook them in the first 2 seconds.\n5/8 Step 2: Deliver 3 actionable proofs.\n6/8 Step 3: Reframe for B2B and mobile feeds.\n\n7/8 Bookmark this thread so you don't lose the framework.\n8/8 Repost the first tweet if this brought you clarity! 🔁`,
      },
    };

    return NextResponse.json({
      success: true,
      detected,
      scraped,
      generatedResults
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to scrape social media content" },
      { status: 500 }
    );
  }
}
