<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Start here

Read [HANDOFF.md](./HANDOFF.md) before making project changes. Treat its dated progress, counts, and environment assumptions as historical until checked against current files. It has the project
overview, file map, data-update instructions, deploy steps, and a list of
decisions that are final and should not be re-proposed (core copy, service
naming, form architecture, hosting).

## Local dev limitations in this environment

`.env.local` is gitignored and will NOT be present in a fresh clone/sandbox.
Without it:
- `/blog` pages will fail to fetch from microCMS (missing `MICROCMS_API_KEY`,
  `MICROCMS_SERVICE_DOMAIN`).
- Everything else (Home, Services, Works, Contact UI, Case Study) renders
  fine without env vars — only the contact form's actual submission needs
  `DISCORD_WEBHOOK_URL`, which is a Cloudflare Workers secret, not an env
  file by default. Inspect availability by variable name only; do not assume every local environment has the same credentials.

Do not try to guess or fabricate values for these — flag missing-env
failures as expected rather than treating them as bugs to fix.

## Deploy

This repo deploys to Cloudflare Workers. Preserve that hosting choice.
Prepare and verify the complete change before requesting approval for production deployment. On an explicitly approved local release, check the active Cloudflare account (`npx wrangler whoami`), run `npm run build:cf`, then `npx wrangler deploy`, and verify the public result with cache bypass. If credentials are unavailable, prepare a reviewable diff or draft PR and report deployment as unperformed. Do not claim public verification from a local build alone.

## Scope and validation

Preserve the established copy, service names, visual world, and Discord contact architecture unless the user explicitly requests changes. Check current source and the relevant local Next.js documentation before code edits; an instruction-only edit does not require rebuilding the application.

For contact-field changes, update the label, placeholder/autocomplete, FormData, and API/Discord field labels together. For visual changes, check desktop and mobile. Shader-specific work can use `.agents/skills/shader-bg-fx/SKILL.md`.
