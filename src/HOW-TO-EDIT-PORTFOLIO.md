# How to Edit Your Portfolio

All your portfolio content is in the file: **`portfolio-data.json`** (in this same folder)

You can open it with any text editor (VS Code, Notepad++, or even regular Notepad).

---

## Quick Guide

### To add a new project, find the right category and copy an existing entry

For example, to add a new **Game Audio** commercial project:

1. Open `portfolio-data.json`
2. Find the `"game"` section inside `"projects"`
3. Find `"commercial": [...]`
4. Copy an existing project entry (everything between `{ }`)
5. Paste it after the last entry, add a comma before it
6. Edit the values

---

## What Each Field Means

### Profile Section (top of file)
```json
"profile": {
  "name": "JOÃO SANTOS",           // Your display name
  "tagline": ["Game Audio Designer", "Music Producer", "Mix & Master"],  // Titles under your name
  "bio": "Your bio text here...",  // Short description
  "email": "your@email.com",       // Contact email
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/yourprofile",
    "soundcloud": "https://soundcloud.com/yourprofile",
    "youtube": ""                  // Leave empty string "" if you don't have one
  }
}
```

### Categories (the 5 clickable cards)
```json
"categories": [
  { "id": "game", "label": "Game Audio", "icon": "🎮", "color": "#00FFB2" }
]
```
- `id`: Internal identifier (don't change unless you know what you're doing)
- `label`: What appears on the card
- `icon`: Any emoji
- `color`: Hex color code (use a color picker online)

---

## Project Types by Category

### 🎮 Game Audio (`projects.game`)
```json
{
  "title": "Project Name",
  "type": "Slot Game",              // or "Mobile Game", etc.
  "role": "Sound Designer & Composer",
  "description": "What you did...",
  "client": "Client Name",
  "award": "Optional award text",   // Remove this line if no award
  "emoji": "🍒"
}
```

### 🎵 Music (`projects.music`)
```json
{
  "title": "Playlist Name",
  "emoji": "🎼",
  "soundcloudUrl": "https://api.soundcloud.com/playlists/YOUR_PLAYLIST_ID"
}
```

### 🎚️ Mixing & Mastering (`projects.mixing`)
```json
{
  "title": "Song Title",
  "role": "Vocal Editing, Mixing & Mastering",
  "description": "Details...",
  "emoji": "💎",
  "youtubeId": "VIDEO_ID_HERE"      // Just the ID, not full URL (e.g., "6T3Xs13pDks")
}
```

### 🎙️ Vocal Editing (`projects.vocal`)
```json
{
  "title": "Project Name",
  "role": "Vocal Editor",
  "client": "Client Name",          // Optional
  "description": "Details...",      // Optional
  "responsibilities": ["Task 1", "Task 2"],
  "emoji": "🎤",
  "soundcloudUrl": "https://api.soundcloud.com/tracks/TRACK_ID",  // Optional - for audio
  "videoUrl": "https://example.com/video.mp4",                    // Optional - for video
  "videoThumbnail": "/assets/videos/thumbnail.jpg"                // Optional - preview image
}
```

### 📺 Visual Media (`projects.media`)
```json
{
  "title": "Project Name",
  "role": "Sound Designer",
  "client": "Client Name",
  "description": "Details...",
  "emoji": "🏢",
  "videoUrl": "https://example.com/video.mp4",       // URL to the video file
  "videoThumbnail": "/assets/videos/thumbnail.jpg"  // Local path to preview image
}
```

---

## Important Rules

1. **Always use double quotes** `"` for text, not single quotes `'`
2. **Add commas** between items in a list, but NOT after the last item
3. **Keep the structure** - don't remove the brackets `[ ]` or braces `{ }`
4. **Test after editing** - run `npm run dev` and check if the site loads

### Correct comma usage:
```json
"commercial": [
  { "title": "Project 1", "emoji": "🍒" },
  { "title": "Project 2", "emoji": "⚡" },
  { "title": "Project 3", "emoji": "🐱" }   // <-- NO comma on last item
]
```

---

## Finding SoundCloud/YouTube IDs

### SoundCloud Playlist ID:
1. Go to your playlist on SoundCloud
2. Click "Share" → "Embed"
3. In the embed code, find `api.soundcloud.com/playlists/NUMBERS`
4. Copy those numbers

### YouTube Video ID:
1. Go to the YouTube video
2. The URL looks like: `youtube.com/watch?v=ABC123xyz`
3. Copy just the part after `v=` (e.g., `ABC123xyz`)

---

## Need Help?

If the site stops working after an edit:
1. Undo your last change
2. Check for missing commas or quotes
3. Use a JSON validator: https://jsonlint.com/

Good luck! 🎵
