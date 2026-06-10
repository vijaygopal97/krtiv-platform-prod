# Hero Video

Place your hero video file here as `hero-video.mp4`.

## Setup

1. **Download** the video from Google Drive:
   - https://drive.usercontent.google.com/download?id=1m_B_bs0rHoST0PPm7MjvagUIcSiA6RNG
   - (Large files require manual confirmation in browser)

2. **Convert to MP4** (recommended for web streaming):
   ```bash
   ffmpeg -i "Film 01 Raj 30s English.mov" -c:v libx264 -c:a aac -movflags +faststart hero-video.mp4
   ```
   The `+faststart` flag moves metadata to the start so the browser can stream without downloading the full file.

3. **Generate thumbnail** (optional):
   ```bash
   ffmpeg -i hero-video.mp4 -ss 00:00:02 -vframes 1 hero-thumbnail.jpg
   ```
   Then set `thumbnailUrl: '/videos/hero-thumbnail.jpg'` in `src/config/video.ts`

4. **Place** the file: `frontend/public/videos/hero-video.mp4`

## Custom Thumbnail

To use a custom thumbnail URL, set `thumbnailUrl` in `src/config/video.ts`:
```ts
thumbnailUrl: 'https://your-cdn.com/thumbnail.jpg',
// or local: thumbnailUrl: '/videos/hero-thumbnail.jpg',
```
