# Hydration Safety — the rules and why they exist

## Why this matters more than usual on this project

This site runs on Cloudflare Workers via `@opennextjs/cloudflare`. The Worker renders the initial HTML server-side, then the client hydrates. WebGL doesn't exist on the server. If any of the React tree on the server differs from what the client produces on first paint, React tears the whole tree and you see a hydration error in the console — and a flash of unstyled content for the user.

The rules below close every common source of mismatch. Internalize the *why* once and they stop feeling arbitrary.

---

## Rule 1 — Always lazy-load the Canvas via `next/dynamic` with `ssr: false`

```tsx
// src/components/ShaderCanvas.tsx
"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./ShaderBackground"), {
  ssr: false,
  loading: () => null,         // no placeholder — keeps the page from "popping"
});

export function ShaderCanvas() {
  return <Scene />;
}
```

**Why:** Without `ssr: false`, Next.js will try to render `<Canvas>` on the Worker, which has no WebGL context. Even with a polyfill, the server output (no GL context, no rendered scene) won't match what the client paints, and you'll get hydration errors plus wasted server CPU. `ssr: false` makes it a client-only mount.

**Why `loading: () => null`:** A spinner here would be visible during the brief client-side import, defeating the point of a smooth bg.

---

## Rule 2 — No `Math.random`, `Date.now`, `crypto.randomUUID` in initial render

These produce different values on server and client. Even inside a client component, if Next pre-renders it (which is the default for static routes), the value baked into the HTML differs from the client's first re-render.

❌ Don't:

```tsx
function Scene() {
  const seed = Math.random();    // different on every render → mismatch
  return <Plane args={[seed]} />;
}
```

✅ Do:

```tsx
function Scene() {
  // Stable seed derived from something deterministic
  const seed = useMemo(() => 0.42, []);
  return <Plane args={[seed]} />;
}

// Or if you genuinely need randomness, generate it after mount:
function Scene() {
  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => setSeed(Math.random()), []);
  if (seed === null) return null;        // skip first paint
  return <Plane args={[seed]} />;
}
```

For shader uniforms, prefer **uTime-driven pseudo-randomness inside the fragment shader** (e.g. `hash(uv + uTime)`) over JS-side randomness. The shader runs entirely on the client, so it never participates in hydration.

---

## Rule 3 — Browser globals only inside `useEffect` or `useFrame`

`window`, `document`, `navigator`, `performance` don't exist on the Worker.

❌ Don't:

```tsx
function Scene() {
  const aspect = window.innerWidth / window.innerHeight;  // crashes in SSR
  // ...
}
```

✅ Do:

```tsx
function Scene() {
  const [aspect, setAspect] = useState(16 / 9);   // safe SSR default

  useEffect(() => {
    const update = () => setAspect(window.innerWidth / window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  // ...
}
```

Inside `useFrame((state) => ...)` you can freely use `state.size`, `state.viewport`, `state.mouse` — R3F has already populated them on the client.

---

## Rule 4 — `useThree` / `useFrame` only inside a `<Canvas>` subtree

R3F's hooks read from a React context that only exists inside `<Canvas>`. Calling them in a parent component throws at runtime, but more sneakily: if the parent is server-rendered, the error happens during SSR, not in the browser.

❌ Don't:

```tsx
export function ShaderCanvas() {
  const { gl } = useThree();    // ← wrong: this component is outside Canvas
  return <Canvas>...</Canvas>;
}
```

✅ Do — keep `useThree`/`useFrame` inside the Canvas children:

```tsx
function Inner() {
  const { gl } = useThree();    // ✓ this runs inside Canvas
  return <mesh />;
}

export function ShaderCanvas() {
  return <Canvas><Inner /></Canvas>;
}
```

---

## Rule 5 — Avoid time-dependent logic in the JSX itself

Anything like `new Date().getHours()` to "show a different bg at night" runs at render time. The Worker's clock and the user's clock differ. Move time-dependent logic into uniforms updated in `useFrame`, or compute on first effect.

---

## What if you see a hydration error anyway

1. Check the browser console — React names the failing component.
2. Inspect that component for: any of rules 2–5 violated, or a parent that forgot `ssr: false`.
3. As a last resort, wrap the offending element in `<div suppressHydrationWarning>`. This is a sledgehammer; only use it for genuinely irreconcilable differences (e.g. localized timestamps where the server zone is fixed).

If the error message is "There was an error while hydrating" with no useful component name, set `reactStrictMode: false` temporarily in `next.config.ts` to halve the renders and surface the real error — but turn it back on before shipping.
