import sys
import json
import instaloader

def scrape_instagram_shortcode(shortcode):
    try:
        L = instaloader.Instaloader(
            download_pictures=False,
            download_videos=False,
            download_video_thumbnails=False,
            download_geotags=False,
            download_comments=False,
            save_metadata=False,
            compress_json=False,
            quiet=True
        )

        post = instaloader.Post.from_shortcode(L.context, shortcode)

        carousel_photos = []
        if post.typename == "GraphSidecar":
            for node in post.get_sidecar_nodes():
                carousel_photos.append(node.display_url)
        elif post.url:
            carousel_photos.append(post.url)

        data = {
            "success": True,
            "shortcode": shortcode,
            "title": post.caption[:90] if post.caption else f"Instagram Post by @{post.owner_username}",
            "author": f"@{post.owner_username}",
            "caption": post.caption or "",
            "likes": post.likes,
            "comments": post.comments,
            "date": post.date_utc.isoformat() if post.date_utc else "",
            "typename": post.typename,
            "is_video": post.is_video,
            "video_url": post.video_url if post.is_video else None,
            "thumbnail_url": post.url,
            "carousel_photos": carousel_photos,
            "media_count": len(carousel_photos) if carousel_photos else (1 if post.is_video else 0)
        }
        print(json.dumps(data))
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        scrape_instagram_shortcode(sys.argv[1])
    else:
        print(json.dumps({"success": False, "error": "No shortcode provided"}))
