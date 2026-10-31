import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("your-project")
);

// Client instance for browser and server usage
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface ProjectHistoryRecord {
  id: string;
  user_id?: string;
  title: string;
  url: string;
  platforms: string[];
  scraped_source: any;
  generated_results: any;
  created_at: string;
}

/**
 * Save project generation session to Supabase and fallback to localStorage
 */
export async function saveProjectSession(session: {
  id: string;
  title: string;
  url: string;
  platforms?: string[];
  platform?: string;
  scrapedSource?: any;
  generatedResults?: any;
}) {
  if (typeof window !== "undefined") {
    // 1. Always persist to localStorage for instant local access
    const existing = localStorage.getItem("repurpose_chats");
    let list = existing ? JSON.parse(existing) : [];
    // Deduplicate and push to front
    list = [session, ...list.filter((x: any) => x.id !== session.id)];
    localStorage.setItem("repurpose_chats", JSON.stringify(list));
  }

  // 2. Persist to Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("projects").upsert({
        id: session.id,
        title: session.title,
        url: session.url,
        platforms: session.platforms,
        scraped_source: session.scrapedSource,
        generated_results: session.generatedResults,
        created_at: new Date().toISOString()
      });
      if (error) {
        console.warn("[Supabase] Upsert error:", error.message);
      }
    } catch (e: any) {
      console.warn("[Supabase] Failed to save session:", e?.message || e);
    }
  }
}

/**
 * Fetch project history list from Supabase or localStorage fallback
 */
export async function getProjectSessions(): Promise<any[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          title: row.title,
          url: row.url,
          platforms: row.platforms || [],
          scrapedSource: row.scraped_source,
          generatedResults: row.generated_results,
          time: new Date(row.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }));
      }
    } catch (e) {
      console.warn("[Supabase] Fetch projects failed, falling back to local storage");
    }
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    const existing = localStorage.getItem("repurpose_chats");
    if (existing) {
      try {
        return JSON.parse(existing);
      } catch (e) {
        return [];
      }
    }
  }

  return [];
}
