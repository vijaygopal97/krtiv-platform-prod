# Hero background videos

Videos are **assigned automatically per page** in `src/config/heroVideos.ts`.

## Priority

1. **Local file** in `public/videos/` (checked in order per page — e.g. `heritage-hero.mp4`, then alternates).
2. **Themed royalty-free fallback** (unique Mixkit MP4 per page) when no local file is present.
3. **Poster / banner image** if the video fails to load in the browser.

## Upload your own (recommended for production)

Replace fallbacks by adding MP4s here (H.264 + faststart):

```bash
ffmpeg -i input.mov -c:v libx264 -an -movflags +faststart home-hero.mp4
```

| Page | Suggested filename |
|------|-------------------|
| Homepage | `home-hero.mp4` |
| Explore | `explore-hero.mp4` |
| Historical | `heritage-hero.mp4` |
| Spiritual | `spiritual-hero.mp4` |
| Adventure | `adventure-hero.mp4` |
| Culinary | `culinary-hero.mp4` |
| Weddings | `wedding-hero.mp4` |
| Art & Culture | `culture-hero.mp4` |
| Urban | `beaches-hero.mp4` or `urban-hero.mp4` |
| Places | `{slug}.mp4` e.g. `mumbai.mp4` |

See `HERO_VIDEO_CATALOG` in `heroVideos.ts` for the full theme → file mapping.
