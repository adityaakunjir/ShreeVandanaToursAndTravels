# Graph Report - .  (2026-10-04)

## Corpus Check
- 48 files · ~56,569 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 36 nodes · 44 edges · 5 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: MODIFIES: 16 · contains: 13 · ON_BRANCH: 7 · PARENT_OF: 6 · calls: 1 · imports_from: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 48 · Candidates: 59
- Excluded: 0 untracked · 165586 ignored · 0 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `7b58423`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `buttonVariants` - 2 edges
2. `Button()` - 2 edges
3. `eslintConfig` - 1 edges
4. `nextConfig` - 1 edges
5. `geist` - 1 edges
6. `metadata` - 1 edges

## Surprising Connections (you probably didn't know these)
- `21530e6 Fix hydration mismatch and global scope error` --PARENT_OF--> `240b474 Initialize modern tech stack: TypeScript, Tailwind, Shadcn, Prisma`  [EXTRACTED]
  git → git  _Bridges community 0 → community 2_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.36
Nodes (7): main, 21530e6 Fix hydration mismatch and global scope error, 391d06b Initial commit from Create Next App, a499fb4 Update Next.js application, b53bd1b Fix image paths in globals.css, e1d390a Ported reference website design to Next.js, nextConfig

### Community 1 - "Community 1"
Cohesion: 0.40
Nodes (2): geist, metadata

### Community 2 - "Community 2"
Cohesion: 0.40
Nodes (2): 240b474 Initialize modern tech stack: TypeScript, Tailwind, Shadcn, Prisma, 7b58423 Add client_details folder for client assets and info

### Community 3 - "Community 3"
Cohesion: 1.00
Nodes (2): Button(), buttonVariants

### Community 10 - "Community 10"
Cohesion: 1.00
Nodes (1): eslintConfig

## Knowledge Gaps
- **4 isolated node(s):** `eslintConfig`, `nextConfig`, `geist`, `metadata`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 1`** (2 nodes): `geist`, `metadata`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 2`** (2 nodes): `240b474 Initialize modern tech stack: TypeScript, Tailwind, Shadcn, Prisma`, `7b58423 Add client_details folder for client assets and info`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 3`** (2 nodes): `Button()`, `buttonVariants`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (1 nodes): `eslintConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `eslintConfig`, `nextConfig`, `geist` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._