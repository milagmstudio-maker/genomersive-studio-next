<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Start here

Read [HANDOFF.md](./HANDOFF.md) before making any change. It has the project
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
  file, and is never available locally or in this sandbox.

Do not try to guess or fabricate values for these — flag missing-env
failures as expected rather than treating them as bugs to fix.

## Deploy

This repo deploys to Cloudflare Workers, not Vercel, despite what the
default README says. Never suggest a Vercel deploy. Actual deploy
(`npm run build:cf && npx wrangler deploy`) requires Cloudflare
credentials the agent does not have — always stop at opening a PR.
