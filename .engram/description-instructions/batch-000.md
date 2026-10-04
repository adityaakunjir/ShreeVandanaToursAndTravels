# Node Description Batch 1 of 1

Engram is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the prompt below and write
your JSON answer to the answer file.

## Prompt

You are documenting nodes in a knowledge graph.
For each entry below, write ONE concise factual plain-language sentence
describing what it is or does. Use only the provided context.
For a code symbol (kind=code-symbol — a function, class, or constant),
describe what the function/symbol does based on its name, source location
and neighbors — e.g. "Resolves the configured ontology profile from graphify.yaml.".
For an entity node (any other kind — e.g. a person, place, event, object),
describe what the entity is and its role, grounded in its type, its
relations (neighbors) and the provided citations/evidence — e.g.
"Lady Carfax, a wealthy heiress who disappears en route to Lausanne.".
Ground entity descriptions in the citations/evidence when present; do not
speculate beyond the context, so a node with no supporting context may be
left out of the reply.
LANGUAGE: each entry has a `lang=` marker giving the language of its source.
Write that entry's description in EXACTLY that language. Do not translate to
a single common language — match each node's source language individually.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "commit:repo:github.com/adityaakunjir/ShreeVandanaToursAndTravels@240b474bee489f26eb5ae913193ff035becb45c8": "240b474 Initialize modern tech stack: TypeScript, Tailwind, Shadcn, Prisma" | kind=Commit | source=git | neighbors=[21530e6 Fix hydration mismatch and glob…, layout.tsx, page.tsx, main, 7b58423 Add client_details folder for c…, FeaturedTours.tsx] | lang=en
- "branch:repo:github.com/adityaakunjir/ShreeVandanaToursAndTravels#main": "main" | kind=Branch | source=git | neighbors=[21530e6 Fix hydration mismatch and glob…, 240b474 Initialize modern tech stack: T…, 391d06b Initial commit from Create Next…, 7b58423 Add client_details folder for c…, a499fb4 Update Next.js application, b53bd1b Fix image paths in globals.css] | lang=en
- "app_layout": "layout.tsx" | kind=code-symbol | source=src/app/layout.tsx:L1 | neighbors=[geist, metadata, RootLayout(), utils.ts, 240b474 Initialize modern tech stack: T…] | lang=en
- "commit:repo:github.com/adityaakunjir/ShreeVandanaToursAndTravels@21530e6b6dfe9739fbd8704d50da511743b7dc99": "21530e6 Fix hydration mismatch and global scope error" | kind=Commit | source=git | neighbors=[main, 240b474 Initialize modern tech stack: T…, script.js, b53bd1b Fix image paths in globals.css] | lang=en
- "commit:repo:github.com/adityaakunjir/ShreeVandanaToursAndTravels@391d06b3ab6575f2dc9ac407ecfb3f8bf5475c51": "391d06b Initial commit from Create Next App" | kind=Commit | source=git | neighbors=[main, a499fb4 Update Next.js application, eslint.config.mjs, next.config.mjs] | lang=en
- "commit:repo:github.com/adityaakunjir/ShreeVandanaToursAndTravels@e1d390a7c2e10bffdc1fddf8f70547ad3e9a2b8a": "e1d390a Ported reference website design to Next.js" | kind=Commit | source=git | neighbors=[a499fb4 Update Next.js application, main, b53bd1b Fix image paths in globals.css, script.js] | lang=en
- "commit:repo:github.com/adityaakunjir/ShreeVandanaToursAndTravels@a499fb4e8d6e7c1db2f688571497d1d4d5fe40cd": "a499fb4 Update Next.js application" | kind=Commit | source=git | neighbors=[391d06b Initial commit from Create Next…, main, e1d390a Ported reference website design…] | lang=pt
- "commit:repo:github.com/adityaakunjir/ShreeVandanaToursAndTravels@b53bd1b9cf210dec17ff7beaa181cca723ef169f": "b53bd1b Fix image paths in globals.css" | kind=Commit | source=git | neighbors=[main, 21530e6 Fix hydration mismatch and glob…, e1d390a Ported reference website design…] | lang=en
- "ui_button": "button.tsx" | kind=code-symbol | source=src/components/ui/button.tsx:L1 | neighbors=[240b474 Initialize modern tech stack: T…, Button(), buttonVariants] | lang=en
- "app_page": "page.tsx" | kind=code-symbol | source=src/app/page.tsx:L1 | neighbors=[Home(), 240b474 Initialize modern tech stack: T…] | lang=en
- "commit:repo:github.com/adityaakunjir/ShreeVandanaToursAndTravels@7b58423a9354a608b0963b9dea4072a7f55d2a10": "7b58423 Add client_details folder for client assets and info" | kind=Commit | source=git | neighbors=[240b474 Initialize modern tech stack: T…, main] | lang=en
- "components_featuredtours": "FeaturedTours.tsx" | kind=code-symbol | source=src/components/FeaturedTours.tsx:L1 | neighbors=[240b474 Initialize modern tech stack: T…, FeaturedTours()] | lang=en
- "components_features": "Features.tsx" | kind=code-symbol | source=src/components/Features.tsx:L1 | neighbors=[240b474 Initialize modern tech stack: T…, Features()] | lang=en
- "components_footer": "Footer.tsx" | kind=code-symbol | source=src/components/Footer.tsx:L1 | neighbors=[240b474 Initialize modern tech stack: T…, Footer()] | lang=en
- "components_hero": "Hero.tsx" | kind=code-symbol | source=src/components/Hero.tsx:L1 | neighbors=[240b474 Initialize modern tech stack: T…, Hero()] | lang=en
- "components_navbar": "Navbar.tsx" | kind=code-symbol | source=src/components/Navbar.tsx:L1 | neighbors=[240b474 Initialize modern tech stack: T…, Navbar()] | lang=en
- "eslint_config": "eslint.config.mjs" | kind=code-symbol | source=eslint.config.mjs:L1 | neighbors=[391d06b Initial commit from Create Next…, eslintConfig] | lang=en
- "js_script": "script.js" | kind=code-symbol | source=public/assets/js/script.js:L1 | neighbors=[21530e6 Fix hydration mismatch and glob…, e1d390a Ported reference website design…] | lang=en
- "lib_utils": "utils.ts" | kind=code-symbol | source=src/lib/utils.ts:L1 | neighbors=[layout.tsx, 240b474 Initialize modern tech stack: T…] | lang=en
- "next_config": "next.config.mjs" | kind=code-symbol | source=next.config.mjs:L1 | neighbors=[391d06b Initial commit from Create Next…, nextConfig] | lang=en
- "ui_button_button": "Button()" | kind=code-symbol | source=src/components/ui/button.tsx:L42 | neighbors=[button.tsx, buttonVariants] | lang=en
- "ui_button_buttonvariants": "buttonVariants" | kind=code-symbol | source=src/components/ui/button.tsx:L5 | neighbors=[button.tsx, Button()] | lang=en
- "app_layout_geist": "geist" | kind=code-symbol | source=src/app/layout.tsx:L5 | neighbors=[layout.tsx] | lang=en
- "app_layout_metadata": "metadata" | kind=code-symbol | source=src/app/layout.tsx:L7 | neighbors=[layout.tsx] | lang=en
- "app_layout_rootlayout": "RootLayout()" | kind=code-symbol | source=src/app/layout.tsx:L12 | neighbors=[layout.tsx] | lang=en
- "app_page_home": "Home()" | kind=code-symbol | source=src/app/page.tsx:L5 | neighbors=[page.tsx] | lang=en
- "components_featuredtours_featuredtours": "FeaturedTours()" | kind=code-symbol | source=src/components/FeaturedTours.tsx:L1 | neighbors=[FeaturedTours.tsx] | lang=en
- "components_features_features": "Features()" | kind=code-symbol | source=src/components/Features.tsx:L1 | neighbors=[Features.tsx] | lang=en
- "components_footer_footer": "Footer()" | kind=code-symbol | source=src/components/Footer.tsx:L3 | neighbors=[Footer.tsx] | lang=en
- "components_hero_hero": "Hero()" | kind=code-symbol | source=src/components/Hero.tsx:L1 | neighbors=[Hero.tsx] | lang=en
- "components_navbar_navbar": "Navbar()" | kind=code-symbol | source=src/components/Navbar.tsx:L5 | neighbors=[Navbar.tsx] | lang=en
- "eslint_config_eslintconfig": "eslintConfig" | kind=code-symbol | source=eslint.config.mjs:L4 | neighbors=[eslint.config.mjs] | lang=en
- "next_config_nextconfig": "nextConfig" | kind=code-symbol | source=next.config.mjs:L2 | neighbors=[next.config.mjs] | lang=en
- "postcss_config": "postcss.config.js" | kind=code-symbol | source=postcss.config.js:L1 | neighbors=[240b474 Initialize modern tech stack: T…] | lang=en
- "prisma_config": "prisma.config.ts" | kind=code-symbol | source=prisma.config.ts:L1 | neighbors=[240b474 Initialize modern tech stack: T…] | lang=en
- "tailwind_config": "tailwind.config.js" | kind=code-symbol | source=tailwind.config.js:L1 | neighbors=[240b474 Initialize modern tech stack: T…] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: D:\Vandana Travels\vandana-travels\.engram\description-instructions\batch-000.json

Keep each description factual and concise (one sentence). No markdown, no prose
outside the JSON object. It is acceptable to omit a node if context is
insufficient — but include every node you can ground confidently.

Example answer format:
```json
{
  "node_id_1": "Resolves the configured ontology profile from graphify.yaml.",
  "node_id_2": "Colonel James Barclay, an antagonist in The Crooked Man."
}
```
