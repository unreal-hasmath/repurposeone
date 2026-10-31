export interface PlatformLimits {
  name: string;
  charLimit: number;
  recommendedMax?: number;
  hashtagLimit: number;
  videoDurationMaxSeconds?: number;
  weightUrlRule?: boolean;
}

export const PLATFORM_CONFIGS: Record<string, PlatformLimits> = {
  instagram: {
    name: "Instagram",
    charLimit: 2200,
    recommendedMax: 800,
    hashtagLimit: 5,
    videoDurationMaxSeconds: 90,
  },
  youtube: {
    name: "YouTube Shorts",
    charLimit: 100, // Title limit
    recommendedMax: 80,
    hashtagLimit: 15,
    videoDurationMaxSeconds: 180,
  },
  linkedin: {
    name: "LinkedIn",
    charLimit: 3000,
    recommendedMax: 1500,
    hashtagLimit: 5,
  },
  x: {
    name: "X (Twitter)",
    charLimit: 280,
    recommendedMax: 260,
    hashtagLimit: 2,
    weightUrlRule: true,
  },
};

/**
 * Calculates weighted character count for X (Twitter)
 * URLs count as 23 characters, emojis count as 2
 */
export function countWeightedCharacters(text: string, isX = false): number {
  if (!isX) return text.length;

  // Replace URLs with 23 characters equivalent
  const urlRegex = /https?:\/\/[^\s]+/g;
  let normalized = text.replace(urlRegex, "12345678901234567890123");

  // Count emojis as 2 chars
  let count = 0;
  for (const char of normalized) {
    count += char.codePointAt(0)! > 0xffff ? 2 : 1;
  }
  return count;
}
