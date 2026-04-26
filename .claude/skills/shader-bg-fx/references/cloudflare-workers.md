# Cloudflare Workers + OpenNext — what to watch for

This site deploys via `@opennextjs/cloudflare` (config in `wrangler.jsonc` + `open-next.config.ts`). The Worker runtime is **V8 isolates, not Node.js**, with `nodejs_compat` flag enabled. WebGL is purely client-side, so the shader work itself is unaffected — but the build pipeline has a few quirks.

## What works out of the box

- Three.js, R3F, drei, postprocessing all run client-only. The Worker just serves their JS bundles as static assets.
- Static assets in `.open-next/assets` are served by the `ASSETS` binding configured in `wrangler.jsonc`. No additional config needed for shader chunks — they're auto-emitted by Next's chunk splitter.
- HDRI / GLTF assets in `public/` are served as-is. Use `/textures/foo.exr` paths, not absolute URLs.

## What breaks if you're not careful

### 1. `next/dynamic({ ssr: false })` is mandatory

The Worker runs the React server tree. Any component that touches `window`, `document`, or three.js at module load will throw during the SSR pass. The bundler doesn't know to skip it for you. Always wrap shader components.

### 2. No Node-specific APIs in modules imported from server components

If a shader utility module does `import fs from "node:fs"` (e.g. for asset preprocessing), that module cannot be imported anywhere reachable from a server component — including transitively. Use Vite-style `?raw` imports or hardcode the GLSL in `.tsx` template literals.

❌ Don't:
```ts
// Reads at runtime — fails on the Worker
import fs from "node:fs";
const noiseGLSL = fs.readFileSync("./noise.glsl", "utf8");
```

✅ Do — inline the shader, or use a build-time string import:
```ts
import noiseGLSL from "./noise.glsl?raw";   // bundler handles this
```

For Next.js / Turbopack, `?raw` works. If you have trouble, just inline:
```ts
const noiseGLSL = `vec2 hash22(vec2 p) { ... }`;
```

### 3. Asset binding paths

`wrangler.jsonc` has:
```json
"assets": { "directory": ".open-next/assets", "binding": "ASSETS" }
```

So anything in `public/` ends up in `.open-next/assets/` after `npm run build:cf`. Don't manually edit `.open-next/` — it's regenerated every build.

### 4. Bundle size pressure on free Workers tier

Workers Free has a 1MB compressed Worker script size limit (assets are separate). The Worker itself is just OpenNext's wrapper + your server code; client JS is in `assets/` and unconstrained. So shader code in client components is *fine*. But be careful about pulling three.js into a *server* component or middleware — that would balloon the Worker script.

Sanity check after build:
```bash
ls -lh .open-next/worker.js          # should be under 1MB
du -sh .open-next/assets/_next/      # client chunks; unconstrained but watch trends
```

### 5. Cache headers for shader chunks

Shader code rarely changes once shipped, but Next gives chunk files content-hashed names — they're already immutably cacheable. Cloudflare's default asset caching respects this. Don't add custom Cache-Control unless you have a specific reason.

### 6. Local preview vs production

```bash
# Test the actual Worker locally before deploying
npx opennextjs-cloudflare preview
```

This runs the same code Cloudflare will execute. Good for catching `nodejs_compat` issues that only surface in the Worker runtime (e.g. a polyfilled API that exists in dev but not in production isolates).

## Deploy commands (existing flow)

```bash
npm run build:cf         # = next build && opennextjs-cloudflare build
npx wrangler deploy      # uploads worker.js + assets/ to Cloudflare
```

There is no GitHub Actions auto-deploy on this repo (it was tried and removed). All deploys are manual from the dev machine.
