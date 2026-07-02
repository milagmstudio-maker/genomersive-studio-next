# 3D的な奥行きを持つ背景ループ動画 4候補（オフライン生成・シームレスループ）
import numpy as np
import subprocess
import os

OUT = os.path.dirname(os.path.abspath(__file__))
TAU = np.float32(2 * np.pi)
rng = np.random.default_rng(11)

def c(hexv):
    return np.array([int(hexv[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255

NAVY_T  = c("050a16")
NAVY_B  = c("0e1a30")
PURPLE  = c("b026ff")
MAGENTA = c("ff2ac0")
CREAM   = c("f4d9a6")
CYAN    = c("2effd5")

def smooth(v, lo, hi):
    return np.clip((v - lo) / (hi - lo), 0, 1)

def make_ctx(W, H):
    xx, yy = np.meshgrid(
        np.linspace(0, 1, W, dtype=np.float32),
        np.linspace(0, 1, H, dtype=np.float32),
    )
    bg = (NAVY_T[None, None, :] * (1 - yy[..., None]) + NAVY_B[None, None, :] * yy[..., None]).astype(np.float32)
    dx = (xx - 0.5) * (W / H)
    dy = yy - 0.5
    r = np.sqrt(dx**2 + dy**2)
    vig = (0.42 + 0.58 * np.clip((0.88 - r) / 0.62, 0, 1))[..., None].astype(np.float32)
    return xx, yy, bg, vig

def render(name, frame_fn, W, H, fps, dur, vig):
    n = fps * dur
    path = os.path.join(OUT, name)
    p = subprocess.Popen(
        ["ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
         "-vf", "scale=1280:720:flags=lanczos",
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "26",
         "-preset", "medium", "-movflags", "+faststart", path],
        stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    for i in range(n):
        t = np.float32(i / n)
        col = frame_fn(t)
        col = col + (rng.random(col.shape[:2] + (1,), dtype=np.float32) - 0.5) * 0.035
        col = col * vig
        p.stdin.write(np.ascontiguousarray((np.clip(col, 0, 1) * 255).astype(np.uint8)).tobytes())
    p.stdin.close()
    p.wait()
    print("done:", name)

# ══ 06 WAVESCAPE — 波形の地形の上を飛ぶ ══════════════════════
W6, H6 = 960, 540
xx6, yy6, bg6, vig6 = make_ctx(W6, H6)
R = 30
HOR = 0.34
x1 = xx6[0]
# 各行の波形（行番号 m に対して周期 R → ループ保証）
ROW_F = rng.integers(2, 6, R).astype(np.float32)
ROW_P = (rng.random(R) * TAU).astype(np.float32)
ROW_F2 = rng.integers(5, 11, R).astype(np.float32)
ROW_P2 = (rng.random(R) * TAU).astype(np.float32)
ENV6 = np.exp(-((x1 - 0.5) / 0.33) ** 2).astype(np.float32)
def f_wavescape(t):
    col = bg6.copy()
    # 地平線の光
    col += MAGENTA[None, None, :] * np.exp(-np.abs(yy6 - HOR) * 30)[..., None] * 0.35
    col += PURPLE[None, None, :] * np.exp(-np.abs(yy6 - HOR) * 12)[..., None] * 0.30
    order = sorted(range(R), key=lambda m: (m + t) % R)  # 遠い行から描く
    for m in order:
        s = ((m + t) % R) / R          # 0=最奥 → 1=手前
        yb = HOR + (1.12 - HOR) * s ** 1.7
        amp = 0.015 + 0.20 * s ** 1.9
        h = ENV6 * (0.45 + 0.30 * np.sin(TAU * ROW_F[m] * x1 + ROW_P[m])
                    + 0.25 * np.sin(TAU * ROW_F2[m] * x1 + ROW_P2[m]))
        h = np.abs(h)
        curve = yb - h * amp
        d = yy6 - curve[None, :]
        fill = d > 0
        # 行の面で奥を隠す（手前ほどわずかに明るいネイビー）
        shade = (bg6 * (0.75 + 0.5 * s))
        col = np.where(fill[..., None], shade, col)
        lineI = np.clip(1 - np.abs(d) / (0.0035 + 0.004 * s), 0, 1) ** 2
        lc = PURPLE * (1 - s) + MAGENTA * s
        col += lc[None, None, :] * lineI[..., None] * (0.25 + 0.75 * s)
    return col

# ══ 07 TUNNEL — ネオントンネル ═══════════════════════════════
W7, H7 = 1280, 720
xx7, yy7, bg7, vig7 = make_ctx(W7, H7)
tdx = (xx7 - 0.5) * (W7 / H7)
tdy = yy7 - 0.5
tr = np.sqrt(tdx**2 + tdy**2) + 1e-4
ta = np.arctan2(tdy, tdx) / TAU  # -0.5..0.5
tu = 0.14 / tr                    # 奥行き座標
fog7 = smooth(tr, 0.035, 0.30)    # 中心（最奥）は霧に沈む
def f_tunnel(t):
    col = bg7 * 0.55
    rings = 0.5 + 0.5 * np.sin(TAU * (tu * 3 - 2 * t))
    rings2 = 0.5 + 0.5 * np.sin(TAU * (tu * 7 - 4 * t) + 2.0)
    spokes = 0.5 + 0.5 * np.sin(TAU * (ta * 10 + t) + tu * 2.5)
    col += PURPLE[None, None, :] * (rings ** 3 * fog7)[..., None] * 0.45
    col += MAGENTA[None, None, :] * ((rings2 ** 5) * fog7)[..., None] * 0.22
    col += CYAN[None, None, :] * ((spokes ** 8) * (rings ** 2) * fog7)[..., None] * 0.18
    col += CREAM[None, None, :] * (np.exp(-tr * 16))[..., None] * 0.10  # 最奥の出口光
    return col

# ══ 08 GRID — 旧シェーダーのシンセウェーブ床 ═════════════════
W8, H8 = 1280, 720
xx8, yy8, bg8, vig8 = make_ctx(W8, H8)
HOR8 = 0.42
aspect8 = W8 / H8
depth8 = HOR8 - yy8
floor8 = depth8 > 0.002
z8 = np.where(floor8, HOR8 / np.maximum(depth8, 1e-4), 0)
wx8 = (xx8 - 0.5) * aspect8 * z8
def f_grid(t):
    col = bg8.copy()
    # 空: 紫の雲（整数周期のsin場）
    n = (np.sin(TAU * (0.9 * xx8 + 0.5 * yy8 + t) + 1.0)
         + 0.6 * np.sin(TAU * (1.7 * xx8 - 0.8 * yy8 + 2 * t) + 3.0))
    sky = (1 - floor8.astype(np.float32))
    col += PURPLE[None, None, :] * (smooth(n, 0.7, 1.6) * sky * 0.18)[..., None]
    # 地平線グロー
    hband = np.exp(-np.abs(yy8 - HOR8) * 38)
    col += PURPLE[None, None, :] * hband[..., None] * 0.50
    col += MAGENTA[None, None, :] * hband[..., None] * 0.25
    # 床グリッド（wz*0.25 / 速度4 → 完全ループ）
    wz = z8 + 4 * t
    gx = (wx8 * 1.8) % 1.0
    gz = (wz * 0.25) % 1.0
    lineX = np.clip(1 - np.minimum(gx, 1 - gx) / 0.055, 0, 1)
    lineZ = np.clip(1 - np.minimum(gz, 1 - gz) / 0.08, 0, 1)
    grid = np.maximum(lineX, lineZ) * floor8
    horizonT = 1 - smooth(depth8, 0, HOR8 * 0.7)
    bandCol = PURPLE[None, None, :] * (1 - horizonT[..., None]) + MAGENTA[None, None, :] * horizonT[..., None]
    lineCol = bandCol + (CYAN[None, None, :] - bandCol) * (lineX * (1 - lineZ))[..., None]
    fogFade = smooth(depth8, 0, 0.07)
    nearFade = 1 - smooth(depth8, HOR8 * 0.35, HOR8)
    col += lineCol * (grid * fogFade * nearFade)[..., None] * 0.55
    return col

# ══ 09 WARP — 星屑が手前に流れてくる ═════════════════════════
W9, H9 = 1280, 720
xx9, yy9, bg9, vig9 = make_ctx(W9, H9)
M9 = 260
S_x = (rng.random(M9) * 2 - 1).astype(np.float32)
S_y = (rng.random(M9) * 2 - 1).astype(np.float32)
S_z0 = rng.random(M9).astype(np.float32)
S_colors = []
for m in range(M9):
    r = rng.random()
    if r < 0.55: S_colors.append(CREAM)
    elif r < 0.78: S_colors.append(np.array([0.92, 0.92, 0.96], dtype=np.float32))
    elif r < 0.92: S_colors.append(CYAN)
    else: S_colors.append(PURPLE)
KSIZES = {}
def kern(sig):
    key = round(float(sig), 1)
    if key not in KSIZES:
        rad = max(1, int(np.ceil(key * 3)))
        g = np.arange(-rad, rad + 1, dtype=np.float32)
        KSIZES[key] = (rad, np.exp(-(g[:, None] ** 2 + g[None, :] ** 2) / (2 * key ** 2)))
    return KSIZES[key]
NEB9 = (np.exp(-(((xx9 - 0.5) * (W9 / H9)) ** 2 + (yy9 - 0.45) ** 2) / 0.5)[..., None]
        * PURPLE[None, None, :] * 0.10).astype(np.float32)
def stamp(col, px, py, sig, color, alpha):
    cx, cy = int(px * (W9 - 1)), int(py * (H9 - 1))
    rad, k = kern(sig)
    y0, y1 = max(0, cy - rad), min(H9, cy + rad + 1)
    x0, x1b = max(0, cx - rad), min(W9, cx + rad + 1)
    if y1 <= y0 or x1b <= x0: return
    ky0, kx0 = y0 - (cy - rad), x0 - (cx - rad)
    col[y0:y1, x0:x1b] += color[None, None, :] * k[ky0:ky0 + (y1 - y0), kx0:kx0 + (x1b - x0), None] * alpha
def f_warp(t):
    col = bg9.copy() + NEB9
    for m in range(M9):
        z = (S_z0[m] - t) % 1.0
        z = 0.08 + 0.92 * z
        scale = 0.30 / z
        px = 0.5 + S_x[m] * scale * (H9 / W9)
        py = 0.5 + S_y[m] * scale
        if not (-0.05 < px < 1.05 and -0.05 < py < 1.05):
            continue
        b = (1 - z) ** 1.6
        sig = 0.7 + 2.4 * (1 - z)
        # 進行方向の残像（2段）
        for j, dz in enumerate((0.0, 0.018, 0.036)):
            zj = z + dz
            sj = 0.30 / zj
            pxj = 0.5 + S_x[m] * sj * (H9 / W9)
            pyj = 0.5 + S_y[m] * sj
            stamp(col, pxj, pyj, sig * (1 - j * 0.25), S_colors[m], b * (0.55 - j * 0.18))
    return col

if __name__ == "__main__":
    render("06-wavescape.mp4", f_wavescape, W6, H6, 24, 8, vig6)
    render("07-tunnel.mp4", f_tunnel, W7, H7, 30, 8, vig7)
    render("08-grid.mp4", f_grid, W8, H8, 30, 8, vig8)
    render("09-warp.mp4", f_warp, W9, H9, 30, 8, vig9)
