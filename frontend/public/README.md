# Public assets

This folder is for static assets served by Next.js.

## Optional: animated login background video

If you want a glowing video background on the login page, add a video file here (recommended: `.webm` for performance) and set:

- `NEXT_PUBLIC_LOGIN_BG_VIDEO=/login-bg.webm`

You can also use `.mp4`:

- `NEXT_PUBLIC_LOGIN_BG_VIDEO=/login-bg.mp4`

Notes:
- Keep videos short/loopable (3–8s) and compressed.
- The UI will fall back to CSS "aurora" glow animation if this env var is not set.
