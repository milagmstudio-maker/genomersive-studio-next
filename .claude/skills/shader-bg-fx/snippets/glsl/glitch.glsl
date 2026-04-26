// glitch.glsl — cheap analog/digital glitch effects
//
// All of these mutate a `vec3 col` already computed for the current pixel.
// They work on the final color, after lighting/composition.
//
// Tune the magic numbers — defaults are conservative for this site.

// ─── RGB channel split ──────────────────────────────────────────
// Samples the surrounding scene with offsets per channel. Requires the
// scene to be available as a texture; for a fully-procedural shader BG
// you can just shift the *uv* used for each channel's recomputation.

vec3 rgbSplit(vec2 uv, sampler2D scene, float strength) {
  vec2 dir = vec2(strength, 0.0);
  float r = texture2D(scene, uv + dir).r;
  float g = texture2D(scene, uv).g;
  float b = texture2D(scene, uv - dir).b;
  return vec3(r, g, b);
}

// ─── Scanlines ─────────────────────────────────────────────────
float scanlines(vec2 uv, vec2 resolution, float intensity) {
  // 2px-period dark stripe pattern, anti-aliased so it doesn't strobe at zoom
  float y = uv.y * resolution.y;
  float band = 0.5 + 0.5 * cos(y * 3.14159 * 0.5);
  return mix(1.0, band, intensity);
}

// Apply: col *= scanlines(uv, uResolution, 0.18);

// ─── Horizontal displacement bands ──────────────────────────────
// Periodic VHS-style band that nudges a horizontal slice of the image.
// Returns a UV offset to apply when sampling.

vec2 displaceBands(vec2 uv, float t, float strength) {
  float bandY = step(0.96, fract(t * 0.8));         // ~4% of the time, briefly
  float bandRow = step(0.4, fract(uv.y * 7.0 + t)); // every ~7th row
  float push = (bandY * bandRow) * strength;
  return vec2(push, 0.0);
}

// Apply (procedural shader, no texture):
//   vec2 g_uv = uv + displaceBands(uv, uTime, 0.04);
//   // ...recompute color with g_uv instead of uv

// ─── Hash-driven wobble (continuous, subtle) ───────────────────
// Slight horizontal wobble that's always on, like CRT misalignment.

vec2 crtWobble(vec2 uv, float t, float amount) {
  float w = sin(uv.y * 200.0 + t * 5.0) * amount;
  return vec2(uv.x + w, uv.y);
}

// ─── Block displacement (digital glitch) ───────────────────────
// Snaps the screen into rectangular regions and shifts each randomly.
// Use sparingly — strong effect.

vec2 blockGlitch(vec2 uv, float t, float density, float amount) {
  vec2 block = floor(uv * density) / density;
  float n = fract(sin(dot(block, vec2(12.9, 78.2)) + floor(t * 4.0)) * 43758.5);
  float kick = step(0.92, n);  // only ~8% of blocks displace at a time
  return vec2(uv.x + (n - 0.5) * amount * kick, uv.y);
}

// ─── Vignette (folded into glitch chunk for convenience) ───────
float vignette(vec2 uv, float radius, float softness) {
  vec2 c = uv - 0.5;
  return smoothstep(radius, radius - softness, length(c));
}

// Apply: col *= mix(0.55, 1.0, vignette(uv, 0.85, 0.6));
//
// The lower bound (0.55) controls how dark the corners get. 0.4 is moody,
// 0.7 is barely there.
