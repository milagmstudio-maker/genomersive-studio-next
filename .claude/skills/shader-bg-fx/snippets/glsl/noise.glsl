// noise.glsl — drop-in GLSL utilities
//
// Pick what you need. None of these allocate; all are pure functions of
// their inputs. Inline directly into your fragment shader (Next can also
// do `?raw` imports if you'd rather keep them as files).
//
// Cost guide (rough, per pixel):
//   hash22       ~ 4 ops
//   valueNoise   ~ 12 ops
//   simplex2D    ~ 30 ops
//   fbm(N=5)     ~ N * simplex
//
// For a fullscreen background at 1080p that's ~150 ops × 2M px = 300M ops/frame.
// Modern phones run that comfortably; old Androids may not. Use fewer fbm
// octaves or drop to valueNoise for low-tier fallback.

// ─── Hash functions ──────────────────────────────────────────────
// 1D → 1D
float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

// 2D → 1D
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 234.34));
  p += dot(p, p + 34.45);
  return fract(p.x * p.y);
}

// 2D → 2D (used by simplex)
vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

// ─── Value noise (cheap, blocky) ─────────────────────────────────
float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i + vec2(0.0, 0.0)), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// ─── Simplex noise (smoother, more expensive) ───────────────────
float simplex2D(vec2 p) {
  const float K1 = 0.366025404; // (sqrt(3)-1)/2
  const float K2 = 0.211324865; // (3-sqrt(3))/6
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(
    dot(a, hash22(i)),
    dot(b, hash22(i + o)),
    dot(c, hash22(i + 1.0))
  );
  return dot(n, vec3(70.0));
}

// ─── Fractal Brownian Motion ────────────────────────────────────
// N controls octaves. Use 3–5 for backgrounds; more is rarely worth the cost.
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * simplex2D(p);
    p *= 2.02;     // not exactly 2.0 — avoids axis-aligned artifacts
    a *= 0.5;
  }
  return v;
}

// Domain-warped fbm — much more organic, ~3x cost
float fbmWarp(vec2 p) {
  vec2 q = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));
  return fbm(p + 4.0 * q);
}
