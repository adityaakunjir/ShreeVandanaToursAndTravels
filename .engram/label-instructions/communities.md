# Community Labeling

Engram is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the community listing below
and write 2-5 word plain-language names for each.

## Language

Write every name in English (en). Do not switch languages.

## Communities

Community 0: nextConfig, main, 21530e6 Fix hydration mismatch and global scope error, 391d06b Initial commit from Create Next App, a499fb4 Update Next.js application, b53bd1b Fix image paths in globals.css, e1d390a Ported reference website design to Next.js, script.js, next.config.mjs
Community 1: geist, metadata, layout.tsx, RootLayout(, utils.ts
Community 2: 240b474 Initialize modern tech stack: TypeScript, Tailwind, , 7b58423 Add client_details folder for client assets and info, postcss.config.js, prisma.config.ts, tailwind.config.js
Community 3: Button(, buttonVariants, button.tsx
Community 4: page.tsx, Home(
Community 5: FeaturedTours.tsx, FeaturedTours(
Community 6: Features.tsx, Features(
Community 7: Footer.tsx, Footer(
Community 8: Hero.tsx, Hero(
Community 9: Navbar.tsx, Navbar(
Community 10: eslintConfig, eslint.config.mjs

## Instructions

Write a single JSON object mapping each community id (as a string) to its
2-5 word name to: D:\Vandana Travels\vandana-travels\.engram\label-instructions\communities.json

Example:
```json
{
  "0": "Authentication Flow",
  "1": "Authentication Flow",
  "2": "Authentication Flow"
}
```

Then re-run `engram update` (or `engram label`) to ingest the names.
