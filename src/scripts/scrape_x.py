import sys
import json
import asyncio
from twikit import Client

async def scrape_tweet(tweet_id):
    try:
        client = Client('en-US')
        # Twikit get_tweet_by_id fetches public tweet payload
        tweet = await client.get_tweet_by_id(tweet_id)
        
        photos = []
        video_url = None
        thumbnail_url = None

        if tweet.media:
            for m in tweet.media:
                if getattr(m, 'type', None) == 'photo' or getattr(m, 'type', None) == 'image':
                    photos.append(m.media_url_https)
                elif getattr(m, 'type', None) == 'video':
                    thumbnail_url = m.media_url_https
                    if hasattr(m, 'video_info') and m.video_info:
                        variants = m.video_info.get('variants', [])
                        mp4s = [v for v in variants if v.get('content_type') == 'video/mp4']
                        if mp4s:
                            mp4s.sort(key=lambda x: x.get('bitrate', 0), reverse=True)
                            video_url = mp4s[0].get('url')

        data = {
            "success": True,
            "id": tweet.id,
            "text": tweet.text,
            "title": f"{tweet.user.name}: \"{tweet.text[:70]}...\"",
            "author": f"{tweet.user.name} (@{tweet.user.screen_name})",
            "likes": tweet.favorite_count,
            "retweets": tweet.retweet_count,
            "is_video": bool(video_url or getattr(tweet, 'is_video', False)),
            "video_url": video_url,
            "thumbnail_url": thumbnail_url or (photos[0] if photos else tweet.user.profile_image_url_https),
            "photos": photos,
            "media_count": len(photos) if photos else (1 if video_url else 0)
        }
        print(json.dumps(data))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        asyncio.run(scrape_tweet(sys.argv[1]))
    else:
        print(json.dumps({"success": False, "error": "No tweet ID provided"}))
