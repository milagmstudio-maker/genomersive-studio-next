# Post-Processing Setup: Brand Glow with Readability Preserved

## What was implemented

An `EffectComposer` chain inside `<Canvas>` with four effects in this order:

```
Bloom → ChromaticAberration → Noise → Vignette
```

## Effect-by-effect readability tradeoffs

### 1. Bloom (`intensity={0.6}`, `luminanceThreshold={0.8}`)

**The key number is `luminanceThreshold={0.8}`.**

Bloom only processes pixels whose luminance exceeds 80% of full white. The brand neon colors (#b026ff, #ff2ac0) — when rendered as emissive/lit elements against the dark scene — exceed this threshold and receive a glow halo. Body text and UI copy, rendered against the dark navy (#08101e) background, produce luminance values well below 0.8 and are completely unaffected by the bloom pass.

`luminanceSmoothing={0.1}` keeps the feathering tight. A higher smoothing value (e.g. 0.5) would let the bloom bleed laterally into adjacent text areas; the tighter value keeps the glow edge crisp and contained.

`intensity={0.6}` is a deliberate middle value. The skill reference recommends 0.4–0.8 for "moody effect without EDM-video excess." At 0.6, the purple and magenta accents read as lit/glowing without washing out surrounding content.

### 2. Chromatic Aberration (`offset=0.001`, `radialModulation`, `modulationOffset={0.75}`)

**`radialModulation` is the readability safeguard.**

Without radial modulation, chromatic aberration shifts every pixel by the same RGB offset — including the text at the center of the screen. With it, the offset scales from zero at the screen center to full value at the edges, using a radial distance function.

`modulationOffset={0.75}` pushes the "zero-shift zone" outward — roughly the central 75% of the screen radius is at or near zero offset. Headings and body copy that live in this zone receive no perceptible color fringing.

The `offset` is capped at `[0.001, 0.001]` (one thousandth of screen dimensions). On a 1440p display that's roughly 1.4px — visible as a subtle rainbow fringe on bright edge elements, invisible on center text.

**Why CA runs after Bloom:** it is applied on top of the bloomed image, so the color fringes appear on the glow halos too, which looks physically plausible (like a real lens) and adds visual richness at the edges without touching the center.

### 3. Noise (`opacity={0.16}`, `BlendFunction.OVERLAY`)

Grain at this opacity reinforces the urban-night/film atmosphere without degrading legibility. `OVERLAY` blend mode adds grain perceptually — lighter areas get lighter grain, darker areas get darker — rather than uniformly fogging the image.

**Caution:** if the project CSS has `.bg-noise::after` grain active (`globals.css`), disable it when this PP chain is enabled. Running both produces double-grain that mudds both the background and overlaid text.

### 4. Vignette (`offset={0.15}`, `darkness={0.8}`)

Edge darkening draws attention to the center — the same region where CA is at zero and where text lives. This creates a self-reinforcing hierarchy: edges are dark and CA-shifted (purely decorative), center is bright and sharp (readable).

`offset={0.15}` starts the darkening at 15% in from each edge. `darkness={0.8}` is moderate — the edges dim but don't go black, preserving any brand elements placed near the frame.

## Effect order rationale

| Position | Effect | Why here |
|---|---|---|
| 1st | Bloom | Sees raw HDR scene values, not yet color-shifted. Bloom on the true luminance data is more accurate. |
| 2nd | ChromaticAberration | Shifts the already-bloomed image. Fringe appears on glow halos, which looks physically correct. |
| 3rd | Noise | Grain over the final color-corrected image so it doesn't interact with bloom math. |
| 4th | Vignette | Last pass so it darkens everything uniformly, including grain, for a clean final look. |

## Performance notes

- `resolutionScale={0.5}` on the EffectComposer halves the render target size for bloom downsampling — Bloom is the most expensive effect and the blur is wide enough that half-res is visually identical.
- `multisampling={0}` disables MSAA on PP targets (unnecessary when post-processing is active).
- `gl={{ antialias: false }}` on the Canvas saves GPU work; the EffectComposer does its own smoothing.
- `prefers-reduced-motion` users get a static canvas with no EffectComposer — zero animation cost.

## What to watch for during QA

- Test on a real phone at medium brightness. Bloom can feel overwhelming on OLED screens with high contrast; if so, lower `intensity` to 0.4.
- If body text feels "swimmy", lower `modulationOffset` to 0.6 to shrink the fringe-free center zone — counter-intuitively this helps because it moves the fringe onset further from text.
- If the double-grain issue appears (overly noisy background), confirm `globals.css` `.bg-noise::after` is disabled.
