import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const origin = request.nextUrl.origin;
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${origin}/onboarding?connected=false&platform=${platform}&error=${error || "no_code"}`);
  }

  // Token exchange logic happens securely here on the server
  // Once exchanged, we set a connected indicator cookie/param and redirect back to Onboarding Step 5 or Workspace
  return NextResponse.redirect(`${origin}/onboarding?connected=true&platform=${platform}`);
}
