import { NextRequest, NextResponse } from "next/server";
import { callOpenRouterAI } from "@/lib/openrouter-ai";
import { PLATFORM_CONFIGS } from "@/lib/platform-config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      platform,
      targetPlatform,
      formatType,
      selectedSubFormats,
      sourceTitle,
      title,
      sourceText,
      scrapedText,
      sourceAuthor,
    } = body;

    const plat = (targetPlatform || platform || "instagram") as "instagram" | "youtube" | "linkedin" | "x";
    const postTitle = title || sourceTitle || "Repurposed Content";
    const text = scrapedText || sourceText || postTitle;
    const author = sourceAuthor || "Creator";

    const config = PLATFORM_CONFIGS[plat] || {
      charLimit: 2200,
      hashtagLimit: 5,
    };

    const subFormats: string[] = Array.isArray(selectedSubFormats) && selectedSubFormats.length > 0
      ? selectedSubFormats
      : [formatType || "Standard Post"];

    // Generate content for each selected format (e.g. Post, Carousel, Reel Script)
    const formatOutputs: Record<string, any> = {};

    for (const fmt of subFormats) {
      const isVideoOrReel = fmt.toLowerCase().includes("reel") || fmt.toLowerCase().includes("video") || fmt.toLowerCase().includes("shorts");
      
      const aiResult = await callOpenRouterAI({
        platform: plat,
        formatType: fmt,
        sourceTitle: postTitle,
        sourceText: text,
        sourceAuthor: author,
        charLimit: config.charLimit,
        hashtagLimit: config.hashtagLimit,
      });

      formatOutputs[fmt] = {
        formatType: fmt,
        isVideoOrReel,
        content: aiResult.content,
        caption: aiResult.content,
        hashtags: aiResult.hashtags,
        title: aiResult.title || postTitle,
        description: aiResult.description,
        hook: aiResult.hook,
        breakdown: aiResult.breakdown,
        cta: aiResult.cta,
      };
    }

    // Default primary output for backward compatibility
    const firstFmt = subFormats[0];
    const primary = formatOutputs[firstFmt];

    return NextResponse.json({
      success: true,
      platform: plat,
      results: {
        [plat]: {
          platform: plat,
          caption: primary.caption,
          hashtags: primary.hashtags,
          title: primary.title,
          description: primary.description,
          script: primary.content,
          post: primary.caption,
          formats: formatOutputs,
          selectedSubFormats: subFormats,
        }
      },
      formatOutputs,
      limits: config,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to generate AI content" },
      { status: 500 }
    );
  }
}
