# How to Edit the Portfolio

All visible portfolio content is stored in [`portfolio-data.json`](./portfolio-data.json). Most content changes should only require editing that file.

## Before editing

- Keep the JSON structure intact.
- Use double quotes for every key and text value.
- Separate list items with commas, but do not add a comma after the final item.
- Keep project titles unique where possible.
- Run the validation commands at the end of this guide after making changes.

## Profile

The `profile` object controls the hero and contact information:

```json
{
  "name": "JOÃO SANTOS",
  "tagline": ["Game Audio Designer", "Music Producer", "Mix & Master"],
  "bio": "Short professional introduction.",
  "email": "name@example.com",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/profile",
    "soundcloud": "https://soundcloud.com/profile",
    "youtube": "https://youtube.com/@channel"
  }
}
```

Use an empty string (`""`) to hide an optional social link.

## Categories

The `categories` list controls the five cards on the home page:

```json
{
  "id": "game",
  "label": "Game Audio",
  "icon": "🎮",
  "color": "#00FFB2",
  "image": "/images/categories/game-audio.webp"
}
```

Do not change an `id` unless the matching rendering logic in `App.jsx` is also updated. Category images belong in `public/images/categories` and should use optimized WebP files.

## Game Audio

Game Audio accepts complete YouTube or Dailymotion URLs through `youtubeUrl`.

### Commercial project

```json
{
  "title": "Project Name",
  "type": "Slot Game",
  "role": "Sound Designer & Composer",
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "description": "Description of the work.",
  "client": "The game and related assets are the property of Client Name.",
  "award": "Optional award text",
  "emoji": "🎮"
}
```

Remove the `award` line when a project has no award.

### Personal project

```json
{
  "title": "Project Name Redesign",
  "role": "Sound Designer",
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "description": "Description of the work.",
  "emoji": "🎯"
}
```

## Music

Music projects use SoundCloud API playlist URLs:

```json
{
  "title": "Playlist Name",
  "emoji": "🎼",
  "soundcloudUrl": "https://api.soundcloud.com/playlists/PLAYLIST_ID"
}
```

The `info` object controls the Genres and Tools cards.

## Mixing & Mastering

Mixing projects use only the YouTube video ID, not the complete URL:

```json
{
  "title": "Song Title",
  "role": "Vocal Editing, Mixing & Mastering",
  "description": "Released on streaming platforms.",
  "emoji": "💎",
  "youtubeId": "VIDEO_ID"
}
```

For `https://www.youtube.com/watch?v=6T3Xs13pDks`, the `youtubeId` is `6T3Xs13pDks`.

## Vocal Editing

Vocal projects can use YouTube or SoundCloud:

```json
{
  "title": "Project Name",
  "role": "Vocal Editor",
  "client": "The video and related assets are the property of Client Name.",
  "description": "Optional description.",
  "responsibilities": [
    "Voice cleanup and restoration",
    "Timing and pacing optimization"
  ],
  "emoji": "🎤",
  "youtubeId": "VIDEO_ID"
}
```

For an audio project, replace `youtubeId` with:

```json
"soundcloudUrl": "https://api.soundcloud.com/tracks/TRACK_ID"
```

## Visual Media

Visual Media projects also use YouTube video IDs:

```json
{
  "title": "Corporate Video",
  "role": "Sound Designer",
  "client": "The video and related assets are the property of Client Name.",
  "description": "Description of the work.",
  "emoji": "🏢",
  "youtubeId": "VIDEO_ID"
}
```

## Important: private SoundCloud track

One Vocal Editing project intentionally uses a SoundCloud URL containing a `secret_token`. It allows visitors to play an unlisted track through the portfolio.

**Do not remove, hide, regenerate, or modify that `secret_token` unless the portfolio owner explicitly requests it.**

## Add and order projects

Projects appear in the same order as their JSON list. To add a project:

1. Find the correct category and list.
2. Copy the closest existing project object.
3. Paste it in the desired position.
4. Update every field.
5. Check commas before saving.

## Validate changes

From the project directory, run:

```bash
pnpm lint
pnpm test
pnpm build
pnpm dev
```

Then open the local URL printed by Vite and inspect the affected category on desktop and mobile.
