// nightsky.frag.glsl
// Mila site — urban-night shader background
// Palette: night-sky navy (#0a0d1a), purple accent (#b026ff), cream warmth (#f4d9a6)
// Technique: fBm noise + domain-warped aurora + city glow + grain

precision highp float;

uniform float uTime;
uniform vec2  uMouse;      // normalized [0,1] — smoothed by JS
uniform vec2  uResolution; // pixels

varying vec2 vUv;

// -------------------------------------------------------
// Hash / noise primitives
// -------------------------------------------------------
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Gradient noise (Perlin-style)
float gnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f); // smoothstep

  return mix(
    mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Fractional Brownian Motion — 6 octaves
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2  shift = vec2(100.0);
  mat2  rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5)); // slight rotation per octave

  for (int i = 0; i < 6; i++) {
    v += a * gnoise(p);
    p  = rot * p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

// Domain-warped fBm (gives that viscous, flowing look)
float warpedFbm(vec2 p, float t) {
  vec2 q = vec2(
    fbm(p + vec2(0.0,  0.0) + t * 0.04),
    fbm(p + vec2(5.2,  1.3) + t * 0.03)
  );
  vec2 r = vec2(
    fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.025),
    fbm(p + 4.0 * q + vec2(8.3, 2.8) + t * 0.02)
  );
  return fbm(p + 4.0 * r + t * 0.015);
}

// -------------------------------------------------------
// Palette — night-sky navy, purple, cream
// -------------------------------------------------------
// t in [0,1] → color
vec3 nightPalette(float t) {
  // Three key stops
  vec3 navy  = vec3(0.039, 0.051, 0.102); // #0a0d1a
  vec3 deep  = vec3(0.071, 0.024, 0.157); // #120640  (deep violet midground)
  vec3 purp  = vec3(0.690, 0.149, 1.000); // #b026ff  accent
  vec3 cream = vec3(0.957, 0.851, 0.651); // #f4d9a6  warm city glow

  // blend navy→deep→purp→cream
  float s = t * 3.0;
  if (s < 1.0) return mix(navy,  deep,  s);
  if (s < 2.0) return mix(deep,  purp,  s - 1.0);
               return mix(purp,  cream, s - 2.0);
}

// -------------------------------------------------------
// Grain (photographic noise)
// -------------------------------------------------------
float grain(vec2 fragCoord, float t) {
  // high-frequency spatial hash, animated
  float g = hash(fragCoord * 0.5 + fract(t * 73.13) * 1000.0);
  return g;
}

// -------------------------------------------------------
// City light points (horizon)
// -------------------------------------------------------
float cityLights(vec2 uv, float t) {
  float result = 0.0;
  // Scatter ~40 pseudo-random points along the bottom strip
  for (int i = 0; i < 40; i++) {
    float fi = float(i);
    float px = fract(sin(fi * 13.71) * 43758.5);
    float py = fract(sin(fi * 7.31 + 1.0) * 31337.0) * 0.20; // bottom 20% of screen
    float sz = 0.003 + fract(sin(fi * 3.7) * 9999.0) * 0.006;

    vec2  delta = uv - vec2(px, py);
    float dist  = length(delta);

    // flickering brightness
    float flicker = 0.6 + 0.4 * sin(t * (1.0 + fract(sin(fi) * 99.9)) + fi);
    result += (sz * sz) / (dist * dist + sz * sz) * flicker;
  }
  return clamp(result, 0.0, 1.0);
}

// -------------------------------------------------------
// Main
// -------------------------------------------------------
void main() {
  vec2 uv = vUv;                            // [0,1] both axes
  vec2 fragCoord = uv * uResolution;

  float t = uTime;

  // Mouse parallax — subtle domain shift
  vec2 mouse = (uMouse - 0.5) * 2.0;       // [-1,1]
  vec2 parallaxUv = uv + mouse * 0.04;

  // --- Base warped noise (the sky) ---
  float warp = warpedFbm(parallaxUv * 2.5 + vec2(0.0, 0.3), t);
  warp = warp * 0.5 + 0.5;                 // remap to [0,1]

  // --- Color from palette ---
  float palT = warp * 0.55;                // keep mostly in the dark/mid range
  vec3 col = nightPalette(palT);

  // --- Aurora overlay ---
  // A second, faster warp pass for the purple aurora veil
  float aurora = warpedFbm(parallaxUv * 1.8 + vec2(3.0, 0.0) + mouse * 0.06, t * 1.3);
  aurora = smoothstep(0.35, 0.65, aurora * 0.5 + 0.5);

  // Position aurora in upper-mid screen (y > 0.35)
  float auroraY = smoothstep(0.2, 0.7, uv.y);
  aurora *= auroraY;

  vec3 purpleAccent = vec3(0.690, 0.149, 1.000); // #b026ff
  vec3 pinkAccent   = vec3(1.000, 0.165, 0.753); // #ff2ac0  for cyan-complement glitch feel
  vec3 auroraCol    = mix(purpleAccent, pinkAccent, smoothstep(0.3, 0.7, warp));
  col = mix(col, auroraCol, aurora * 0.30);      // screen-blend feel: additive-ish

  // --- City horizon glow ---
  float horizonY = smoothstep(0.25, 0.0, uv.y); // stronger at very bottom
  vec3  warmGlow  = vec3(0.957, 0.851, 0.651);   // cream #f4d9a6
  col = mix(col, warmGlow * 0.4, horizonY * 0.5);

  // --- City light points ---
  float lights = cityLights(uv, t);
  // warm tint for light points
  col += lights * warmGlow * 0.9;

  // --- Chain-link fence motif (soft diamond grid) ---
  // Use a rotated UV and a step-based diamond pattern
  float fence = 0.0;
  {
    vec2 fUv = uv + mouse * 0.015;  // slight parallax
    // 45-degree rotation
    vec2 rot45 = vec2(fUv.x + fUv.y, fUv.x - fUv.y);
    // Aspect correction
    rot45.x *= uResolution.x / uResolution.y;
    // Grid
    vec2 cell = fract(rot45 * 14.0) - 0.5;
    float distToEdge = min(abs(cell.x), abs(cell.y));
    fence = smoothstep(0.04, 0.01, distToEdge);
    fence *= 0.10; // very faint
    // fade by radial vignette (more visible toward center)
    float r = length(uv - vec2(0.5));
    fence *= smoothstep(0.75, 0.3, r);
  }
  vec3 fenceCol = vec3(0.957, 0.910, 0.757); // warm cream-white
  col = mix(col, fenceCol, fence);

  // --- Photographic grain ---
  float g = grain(fragCoord, t);
  // Apply as screen noise — additive small amount
  float grainStrength = 0.045;
  col += (g - 0.5) * grainStrength;

  // --- Edge vignette ---
  {
    vec2 vig = uv - 0.5;
    vig.x *= uResolution.x / uResolution.y; // aspect-correct
    float v = 1.0 - smoothstep(0.35, 0.85, length(vig) * 1.5);
    col *= v;
  }

  // --- Final tonemap (very light — keep darkness) ---
  col = clamp(col, 0.0, 1.0);
  // mild gamma lift in shadows to preserve night feel
  col = pow(col, vec3(0.92));

  gl_FragColor = vec4(col, 1.0);
}
