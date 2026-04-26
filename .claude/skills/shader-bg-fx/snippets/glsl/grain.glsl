// grain.glsl — film grain functions
//
// Three flavors, escalating in quality and cost:
//   1. cheapGrain     — fastest, slight banding visible on flat areas
//   2. grain          — balanced (recommended for backgrounds)
//   3. coloredGrain   — channel-separated, gives subtle chromatic dust

// 1. Pseudo-random scalar grain
float cheapGrain(vec2 uv, float t) {
  return fract(sin(dot(uv * 1000.0 + t, vec2(12.9898, 78.233))) * 43758.5453);
}

// 2. Slightly nicer hash — fewer artifacts on retina screens
float grain(vec2 uv, float t) {
  vec2 p = uv * vec2(1024.0, 1024.0);
  p += vec2(t * 91.0, t * 53.0);
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// 3. Per-channel grain for subtle color noise
vec3 coloredGrain(vec2 uv, float t) {
  vec2 p = uv * 1024.0;
  return vec3(
    fract(sin(dot(p + t * 91.0, vec2(12.9898, 78.233))) * 43758.5453),
    fract(sin(dot(p + t * 53.0, vec2(63.7264, 10.873))) * 43758.5453),
    fract(sin(dot(p + t * 71.0, vec2(45.5512, 95.661))) * 43758.5453)
  );
}

// ─── Usage in fragment ──────────────────────────────────────────
// Apply *after* tone mapping. Subtract 0.5 so it centers around 0
// (otherwise grain only brightens, never darkens):
//
//   float g = grain(uv, uTime);
//   col += (g - 0.5) * 0.08;       // intensity 0.05–0.12 is the sweet spot
//
// For colored grain:
//
//   vec3 cg = coloredGrain(uv, uTime);
//   col += (cg - 0.5) * 0.05;
//
// Match the brand mood: this site is grainy/analog, so grain intensity
// 0.08–0.12 reads natural. Below 0.05 it disappears; above 0.15 it looks
// like signal loss.
