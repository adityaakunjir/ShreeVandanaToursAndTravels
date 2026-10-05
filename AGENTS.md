<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project skills

The following project-provided skills are available under `.agents/skills/`.
Read the applicable skill before working on its subject; apply its rules only
within its stated scope.

- [Prisma Composer core concepts](.agents/skills/prisma-composer-core-concepts/SKILL.md):
  service declarations, modules, dependency wiring, composed-service testing,
  and Composer development/deployment.
- [Prisma platform core concepts](.agents/skills/prisma-platform-core-concepts/SKILL.md):
  Prisma Cloud projects, branches, Compute, Postgres, Storage, and platform operations.

These same skills are mirrored in `.claude/skills/`, `.cursor/skills/`, and
`.devin/skills/`. They are copies, not additional distinct skills.
`CLAUDE.md` delegates project rules to this file.

`prisma.config.ts` configures skill synchronization for the existing agent
directories. Use `npx prisma skills sync` when installed Prisma packages change;
the package postinstall script already invokes it.

The Prisma skills reference `prisma-orm-core-concepts` and
`prisma-orm-migrations`, but those skills are not currently present in this
project. Do not invent their instructions or add ORM/Composer dependencies
solely to obtain skills. When ORM work requires them, locate the skills for
the installed package version and read them before making that change.

This application currently runs directly with Next.js (`npm run dev`). Apply
Composer-specific runtime and deployment rules when working on a Composer
integration; the presence of a skill does not establish that integration.

## GitHub delivery preference

The user requests a GitHub push after every completed change. Finish relevant
verification, commit the change, and push the current authorized branch to its
configured origin. Do not force-push or commit secrets/generated build files.
Report a concrete authentication or remote conflict if a normal push fails.
