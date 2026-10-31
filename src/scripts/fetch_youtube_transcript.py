#!/usr/bin/env python3
"""
Fetch YouTube transcript using youtube-transcript-api v1.x (instance-based API).
Handles SSL verification issues common on Windows Python 3.14.
"""
import sys
import json
import re
import ssl
import urllib.request


def clean_text(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text)
    text = text.replace("&#39;", "'").replace("&amp;", "&")
    text = text.replace("&quot;", '"').replace("&lt;", "<").replace("&gt;", ">")
    text = text.replace("\n", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def is_noise(text: str) -> bool:
    noise = {"[music]", "[applause]", "[laughter]", "[inaudible]", "[silence]"}
    return text.lower() in noise


def fetch_video_title(video_id: str, session) -> str:
    """Try to get the real video title from YouTube oEmbed (SSL-disabled)."""
    try:
        resp = session.get(
            f"https://noembed.com/embed?url=https://www.youtube.com/watch?v={video_id}",
            timeout=8
        )
        data = resp.json()
        if data.get("title"):
            return data["title"]
    except Exception:
        pass
    try:
        resp = session.get(
            f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json",
            timeout=8
        )
        data = resp.json()
        if data.get("title"):
            return data["title"]
    except Exception:
        pass
    return ""


def fetch_transcript(video_id: str):
    try:
        import requests
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError as e:
        print(json.dumps({"success": False, "error": f"Import error: {e}"}))
        return

    # Build a requests.Session that disables SSL verification (needed on Windows Python 3.14)
    session = requests.Session()
    session.verify = False

    # Suppress the InsecureRequestWarning
    try:
        import urllib3
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    except Exception:
        pass

    # Try to get the real video title
    video_title = fetch_video_title(video_id, session)

    try:
        api = YouTubeTranscriptApi(http_client=session)

        transcript_data = None
        language_used = "unknown"

        # 1) Try to list transcripts and pick the best one
        try:
            transcript_list_obj = api.list(video_id)

            # Prefer manually created English
            for lang in ["en", "en-US", "en-GB"]:
                try:
                    t = transcript_list_obj.find_manually_created_transcript([lang])
                    transcript_data = t.fetch()
                    language_used = t.language_code
                    break
                except Exception:
                    pass

            # Auto-generated English
            if not transcript_data:
                for lang in ["en", "en-US", "en-GB"]:
                    try:
                        t = transcript_list_obj.find_generated_transcript([lang])
                        transcript_data = t.fetch()
                        language_used = t.language_code
                        break
                    except Exception:
                        pass

            # Any available transcript
            if not transcript_data:
                for t in transcript_list_obj:
                    try:
                        transcript_data = t.fetch()
                        language_used = t.language_code
                        break
                    except Exception:
                        continue

        except Exception:
            # Direct fetch fallback
            try:
                transcript_data = api.fetch(video_id)
                language_used = "en"
            except Exception as e2:
                print(json.dumps({"success": False, "error": str(e2)}))
                return

        if not transcript_data:
            print(json.dumps({"success": False, "error": "No transcript found for this video"}))
            return

        # Clean and join segments
        texts = []
        seen = set()
        for item in transcript_data:
            # v1.x returns FetchedTranscriptSnippet objects — extract .text attribute
            if hasattr(item, "text"):
                raw = item.text
            elif isinstance(item, dict):
                raw = item.get("text", "")
            else:
                # Fallback: parse from repr string
                raw = str(item)
                m = re.search(r"text='([^']*)'", raw)
                raw = m.group(1) if m else ""

            text = clean_text(raw)
            if text and not is_noise(text) and text not in seen:
                texts.append(text)
                seen.add(text)

        full_transcript = " ".join(texts)
        word_count = len(full_transcript.split())

        print(json.dumps({
            "success": True,
            "transcript": full_transcript,
            "word_count": word_count,
            "segment_count": len(list(transcript_data)) if hasattr(transcript_data, "__len__") else len(texts),
            "language": language_used,
            "title": video_title
        }))

    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Usage: python fetch_youtube_transcript.py <video_id>"}))
        sys.exit(1)
    fetch_transcript(sys.argv[1])
