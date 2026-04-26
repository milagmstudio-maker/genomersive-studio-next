# Pre-Deploy Checklist for Shader BG changes

Before `npm run build:cf && npx wrangler deploy`, walk this list. Every item maps to a class of bug we've actually shipped.

## Console hygiene

- [ ] DevTools Console is empty on a hard reload of `/`
- [ ] No "Hydration failed" warnings on any of `/`, `/works`, `/services`, `/blog`, `/contact`
- [ ] No "Cannot find module 'three'" or chunk-load errors
- [ ] No "Maximum update depth exceeded" (usually a `useFrame` setting state every frame)

## Visual

- [ ] Brand palette intact — purple accents readable, no CSS-vs-shader color clash
- [ ] No flash of unstyled content on first paint (Splash should still cover the gap)
- [ ] Grain/glitch isn't doubled up (CSS `.bg-noise::after` + shader noise → too much)
- [ ] Mobile (Chrome DevTools mobile mode + real iPhone if possible): bg renders, doesn't lag scrolling

## Performance

- [ ] Run `npm run build` — check first-load JS for `/`. Should remain under ~150KB excluding the dynamically-imported shader chunk
- [ ] In dev: enable `<Stats />` or `<Perf />` — sustained ≥45 FPS on a real phone, ≥55 on desktop
- [ ] Frame time p95 (visible in Perf) ≤ 22ms on the slowest target device
- [ ] DevTools Network — three.js + drei chunks should be **lazy** (load only after the page is interactive, not blocking initial paint)

## Accessibility

- [ ] `prefers-reduced-motion: reduce` honored — the shader either freezes (no `uTime` increment) or falls back to the CSS BG. Test with DevTools "Rendering" → "Emulate CSS prefers-reduced-motion: reduce"
- [ ] Page is still navigable with the BG hidden (block the Canvas in DevTools — confirm content reads OK)
- [ ] Focus rings on links/buttons aren't washed out by Bloom

## Cloudflare-specific

- [ ] `npm run build:cf` succeeds without warnings about `nodejs_compat` or unsupported APIs
- [ ] `.open-next/worker.js` size is unchanged (shader code shouldn't bloat the Worker)
- [ ] Local Worker preview works: `npx opennextjs-cloudflare preview` and visit the URL it prints

## Cleanup

- [ ] If the new shader replaces `BackgroundFX` or parts of `GlitchOverlay`, delete the unused code and CSS
- [ ] No `console.log` left in shader components
- [ ] No `r3f-perf` or debug `<Stats />` left in the production code path (env-gated is fine)

## Ship

```bash
npm run build:cf && npx wrangler deploy
```

Then check the live URL: `https://genomersive-studio-next.mila-gmstudio.workers.dev`. The version ID in the deploy output goes into the commit message if you want a paper trail.
