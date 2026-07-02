# Post-processing Setup — Readability Tradeoffs

## What was implemented

`post-processing-setup.tsx` exports a `<PostProcessingEffects />` component that
wraps a four-effect `EffectComposer` chain:

```
Bloom → ChromaticAberration → Vignette → Noise
```

---

## Effect-by-effect reasoning

### 1. Bloom (`intensity 0.6`, `luminanceThreshold 0.75`)

**Goal:** make brand colours `#b026ff` (purple) and `#ff2ac0` (magenta) visibly glow.

**Readability risk:** bloom at low thresholds washes out text and UI elements.

**Mitigation:**
- `luminanceThreshold: 0.75` means only pixels brighter than 75% white trigger
  the bloom pass. Neon materials with `emissiveIntensity ≥ 2` exceed this easily;
  regular text rendered in CSS/HTML is outside the Canvas and is **never touched**
  by EffectComposer at all.
- `intensity: 0.6` keeps the halo soft — strong enough to read as "glowing" in a
  dark scene, weak enough that nearby text doesn't get haloed if a bright element
  is close by.
- `luminanceSmoothing: 0.025` makes the gate sharp so only the intended neon
  pixels bloom rather than a gradient of surrounding pixels.
- `mipmapBlur: true` (postprocessing v3 API) produces a smooth multi-scale bloom
  rather than a single box blur, which looks more organic and avoids banding
  artifacts near text.

### 2. ChromaticAberration (`offset 0.0008`, `radialModulation: true`)

**Goal:** give a CRT/lens aesthetic that reinforces the neon/tech brand feel.

**Readability risk:** colour fringing on letterforms makes text unreadable.

**Mitigation:**
- `offset: new Vector2(0.0008, 0.0008)` — this is a very small offset. At the
  screen centre the split is essentially invisible (< 1 px at 1080p).
- `radialModulation: true` — the offset is multiplied by the fragment's distance
  from screen centre. Text and primary UI elements placed in the centre zone
  experience near-zero aberration; the colour split grows only toward corners
  where decorative elements live.
- `modulationOffset: 0.15` — the ramp starts 15% inside the edge, confining the
  visible effect to the outer ~85% of the screen radius.
- Placing CA **after** Bloom means the bloom halos themselves get the colour-split,
  which matches real-world lens physics and makes the glow feel more authentic.

### 3. Vignette (`offset 0.3`, `darkness 0.5`)

**Goal:** focus viewer attention on the centre; counteract bloom haze at edges.

**Readability risk:** minimal — vignette darkens corners, where content
density is typically lower.

**Tradeoff:** darkness 0.5 is moderately strong. If edge content is critical,
reduce to 0.35.

### 4. Noise (`opacity 0.04`, `BlendFunction.ADD`)

**Goal:** prevent colour banding on the very dark `#08101e` background.

**Readability risk:** negligible at opacity 0.04. At 0.1+ it would degrade
text contrast; keep below 0.06.

---

## HTML/CSS text is always safe

`EffectComposer` only processes what is rendered inside the `<Canvas>`. Any text,
buttons, or UI elements rendered as regular DOM elements overlay the canvas and
are completely unaffected by Bloom, CA, or any other post-processing effect. This
is the most important architectural reason why readability is preserved — keep
body copy in the DOM, not as Three.js `Text` meshes, unless those meshes are
deliberately meant to glow.

---

## Quick reference: parameter bounds for readability

| Effect | Safe range | Readability breaks at |
|---|---|---|
| Bloom intensity | 0.3 – 0.8 | > 1.2 with low threshold |
| luminanceThreshold | 0.7 – 0.9 | < 0.5 (everything glows) |
| CA offset | 0.0003 – 0.001 | > 0.002 without radialModulation |
| Vignette darkness | 0.3 – 0.6 | > 0.8 |
| Noise opacity | 0.02 – 0.06 | > 0.1 |
