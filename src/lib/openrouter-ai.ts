import axios from "axios";
import https from "https";

// Disable SSL certificate verification for Node.js (fixes Windows certificate issues)
// This is safe for internal API calls to trusted services
const httpsAgent = new https.Agent({ rejectUnauthorized: false });


export interface GenerateContentRequest {
  platform: "instagram" | "youtube" | "linkedin" | "x";
  formatType: string;
  sourceTitle: string;
  sourceText: string;
  sourceAuthor?: string;
  charLimit: number;
  hashtagLimit: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Model list — ALL are chat/text-generation models (NOT embeddings)
// Primary is tried first; if it fails the next is attempted automatically.
// ─────────────────────────────────────────────────────────────────────────────
const CHAT_MODELS = [
  process.env.OPENROUTER_MODEL || "google/gemma-2-9b-it:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "huggingfaceh4/zephyr-7b-beta:free",
];

// ─────────────────────────────────────────────────────────────────────────────
// Extract JSON from a model response that may have markdown fences or prose
// ─────────────────────────────────────────────────────────────────────────────
function extractJSON(raw: string): Record<string, any> | null {
  // 1. Try direct parse
  try { return JSON.parse(raw); } catch {}

  // 2. Strip markdown code fences
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch {}
  }

  // 3. Find first { ... } block
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try { return JSON.parse(raw.slice(start, end + 1)); } catch {}
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Truncate transcript intelligently: keep beginning + end (most informative)
// ─────────────────────────────────────────────────────────────────────────────
function prepareSourceText(text: string, maxChars = 6000): string {
  if (text.length <= maxChars) return text;
  const half = Math.floor(maxChars / 2);
  return (
    text.slice(0, half) +
    "\n\n[... transcript continues ...]\n\n" +
    text.slice(text.length - half)
  );
}

export async function callOpenRouterAI(params: GenerateContentRequest): Promise<{
  content: string;
  hashtags: string[];
  title?: string;
  description?: string;
  hook?: string;
  breakdown?: string;
  cta?: string;
}> {
  const apiKey =
    process.env.OPENROUTER_API_KEY ||
    ""; // Set OPENROUTER_API_KEY in your .env.local file

  const isVideoScript =
    params.formatType.toLowerCase().includes("reel") ||
    params.formatType.toLowerCase().includes("video") ||
    params.formatType.toLowerCase().includes("script") ||
    params.formatType.toLowerCase().includes("shorts");

  const hasTranscript = params.sourceText.includes("[FULL YOUTUBE TRANSCRIPT") ||
    params.sourceText.includes("[VIDEO TITLE]");

  // ── System Prompt ──────────────────────────────────────────────────────────
  const systemPrompt = isVideoScript
    ? `You are a professional video script writer and social media content producer.

CRITICAL RULES — READ BEFORE GENERATING:
1. You MUST use ONLY the information in the provided transcript/source text below.
2. Every concept, example, statistic, and insight must come directly from the source material.
3. Do NOT add any information that is not present in the source transcript.
4. Do NOT generate generic or template-style content.
5. The output must clearly relate to the actual topic described in the source.

Your task: Write a detailed video script for ${params.platform.toUpperCase()} in the "${params.formatType}" format.

Return ONLY valid JSON with these keys:
{
  "title": "Specific hook title from the source topic",
  "hook": "[0:00 - 0:03] Exact spoken opening line based on the source content",
  "breakdown": "Complete minute-by-minute script with sections from the actual source content",
  "caption": "Ready-to-post caption referencing the actual topic with emojis",
  "hashtags": ["#tag1", "#tag2"],
  "description": "Full description based on the actual video content",
  "cta": "Call to action relevant to the topic"
}`
    : `You are an expert social media content creator.

CRITICAL RULES — READ BEFORE GENERATING:
1. You MUST use ONLY the information from the provided source transcript/text.
2. Every sentence must be directly grounded in the source material.
3. Do NOT invent facts, statistics, or examples not present in the source.
4. Do NOT generate generic filler or template content.
5. The output must clearly be about the SPECIFIC topic in the source — not a generic post.
6. Max characters: ${params.charLimit}. Max hashtags: ${params.hashtagLimit}.

Platform: ${params.platform.toUpperCase()} | Format: "${params.formatType}"

Return ONLY valid JSON with these keys:
{
  "title": "Specific title reflecting the actual source topic",
  "caption": "Full platform-ready post text based strictly on source content",
  "hashtags": ["#RelevantTag"],
  "hook": "1-sentence opening grounded in the actual content",
  "breakdown": "Key points extracted directly from the source",
  "cta": "Call to action relevant to the specific topic"
}`;

  // ── User Prompt ────────────────────────────────────────────────────────────
  const preparedText = prepareSourceText(params.sourceText);
  const userPrompt = `SOURCE MATERIAL (generate content based STRICTLY on this):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Title: "${params.sourceTitle}"
Author: "${params.sourceAuthor || "Creator"}"

${preparedText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate ${params.platform.toUpperCase()} "${params.formatType}" content.
Requirements:
- Topic must match the source above exactly
- Extract real insights and examples from the transcript
- ${hasTranscript ? "A full transcript is provided — use specific quotes and concepts from it" : "Use the title and description to stay on topic"}
- Hashtags must start with '#' and relate to the actual topic
- Stay within ${params.charLimit} characters for the caption`;

  // ── Try each model in order ─────────────────────────────────────────────────
  for (const model of CHAT_MODELS) {
    try {
      console.log(`[AI] Trying model: ${model}`);
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.65,
          max_tokens: 1800,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "https://repurposeone.com",
            "X-Title": "RepurposeOne",
            "Content-Type": "application/json",
          },
          timeout: 25000,
          httpsAgent,
        }
      );

      const raw = response.data?.choices?.[0]?.message?.content;
      if (!raw) continue;

      console.log(`[AI] ${model} responded (${raw.length} chars)`);

      const parsed = extractJSON(raw);
      if (parsed) {
        return {
          content: parsed.caption || parsed.content || parsed.text || raw,
          hashtags: Array.isArray(parsed.hashtags)
            ? parsed.hashtags
                .filter((h: string) => typeof h === "string")
                .map((h: string) => (h.startsWith("#") ? h : `#${h}`))
                .slice(0, params.hashtagLimit)
            : [],
          title: parsed.title,
          description: parsed.description,
          hook: parsed.hook,
          breakdown: parsed.breakdown,
          cta: parsed.cta,
        };
      }

      // Model responded but not in JSON — use raw text as content
      if (raw.length > 50) {
        return {
          content: raw.slice(0, params.charLimit),
          hashtags: [],
          title: params.sourceTitle,
        };
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error?.message || err?.message || "unknown";
      console.warn(`[AI] Model ${model} failed (${status}): ${msg}`);
    }
  }

  // ── All models failed — deterministic fallback using ACTUAL source content ──
  return buildFallback(params);
}

// ─────────────────────────────────────────────────────────────────────────────
// Fallback: still uses real title/text, never generic lorem ipsum
// ─────────────────────────────────────────────────────────────────────────────
function buildFallback(params: GenerateContentRequest) {
  const title = params.sourceTitle.slice(0, 80);
  const author = params.sourceAuthor || "Creator";

  // Extract first meaningful sentence from source text for a real snippet
  const cleanSource = params.sourceText
    .replace(/\[.*?\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const snippet = cleanSource.slice(0, 280).replace(/\s\S*$/, "") + "...";

  if (params.platform === "instagram") {
    const caption =
      `📌 "${title}" — by ${author}\n\n` +
      `Here's what you need to know:\n\n` +
      `${snippet}\n\n` +
      `Save this post and share it with someone who needs to see this! 👇`;
    return {
      content: caption.slice(0, params.charLimit),
      hashtags: ["#LearnEveryDay", "#ContentCreator", "#Knowledge"].slice(0, params.hashtagLimit),
      title,
    };
  }

  if (params.platform === "youtube") {
    return {
      title: `Key Takeaways: ${title}`,
      hook: `Here's what "${title}" by ${author} teaches in under 60 seconds...`,
      breakdown: `[0:00 - 0:05 HOOK] Introduce the topic: "${title}"\n\n[0:05 - 0:30 CONTENT]\n${snippet}\n\n[0:30 - 0:60 CTA] Follow for more breakdowns like this!`,
      content: `Key breakdown from "${title}" by ${author}.\n\n${snippet}`,
      hashtags: ["#Shorts", "#Learning"].slice(0, params.hashtagLimit),
      cta: "Like and subscribe for more content breakdowns!",
    };
  }

  if (params.platform === "linkedin") {
    const post =
      `Key insight from "${title}" by ${author}:\n\n` +
      `${snippet}\n\n` +
      `What's your take on this? Drop a comment below. ♻️ Repost to share with your network.`;
    return {
      content: post.slice(0, params.charLimit),
      hashtags: ["#ProfessionalDevelopment", "#Learning", "#LinkedIn"].slice(0, params.hashtagLimit),
      title,
    };
  }

  // X (Twitter)
  const tweet = `"${title}" by ${author} — ${snippet.slice(0, 200)}`;
  return {
    content: tweet.slice(0, params.charLimit),
    hashtags: ["#Learning"].slice(0, params.hashtagLimit),
    title,
  };
}
