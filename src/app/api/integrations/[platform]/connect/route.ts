import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const origin = request.nextUrl.origin;

  let redirectUrl = "";

  switch (platform.toLowerCase()) {
    case "instagram": {
      const clientId = process.env.META_APP_ID;
      const redirectUri = process.env.META_REDIRECT_URI || `${origin}/api/integrations/instagram/callback`;
      if (!clientId) {
        // Return clear diagnostic guide if App ID is pending
        return NextResponse.redirect(`${origin}/onboarding?error=meta_app_id_missing&platform=instagram`);
      }
      const scope = encodeURIComponent("instagram_basic,instagram_content_publish,pages_show_list");
      redirectUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
      break;
    }

    case "linkedin": {
      const clientId = process.env.LINKEDIN_CLIENT_ID;
      const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${origin}/api/integrations/linkedin/callback`;
      if (!clientId) {
        return NextResponse.redirect(`${origin}/onboarding?error=linkedin_client_id_missing&platform=linkedin`);
      }
      const scope = encodeURIComponent("openid profile email w_member_social");
      redirectUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=repurpose_li_state`;
      break;
    }

    case "youtube": {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/integrations/youtube/callback`;
      if (!clientId) {
        return NextResponse.redirect(`${origin}/onboarding?error=google_client_id_missing&platform=youtube`);
      }
      const scope = encodeURIComponent("https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly");
      redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
      break;
    }

    case "x": {
      const clientId = process.env.X_CLIENT_ID;
      const redirectUri = process.env.X_REDIRECT_URI || `${origin}/api/integrations/x/callback`;
      if (!clientId) {
        return NextResponse.redirect(`${origin}/onboarding?error=x_client_id_missing&platform=x`);
      }
      const scope = encodeURIComponent("tweet.read tweet.write users.read offline.access");
      // PKCE code challenge
      redirectUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=repurpose_x_state&code_challenge=challenge&code_challenge_method=plain`;
      break;
    }

    default:
      return NextResponse.json({ error: "Unsupported platform" }, { status: 400 });
  }

  return NextResponse.redirect(redirectUrl);
}
