# ブランドカラー完全一致の背景ループ動画 5候補を生成する
# 1280x720 / 30fps / 8秒 / シームレスループ（時間項はすべて整数周期）
import numpy as np
import subprocess
import os

W, H, FPS, DUR = 1280, 720, 30, 8
N = FPS * DUR
OUT = os.path.dirname(os.path.abspath(__file__))

xx, yy = np.meshgrid(
    np.linspace(0, 1, W, dtype=np.float32),
    np.linspace(0, 1, H, dtype=np.float32),
)
TAU = np.float32(2 * np.pi)

# ── ブランドパレット（globals.css と完全一致）─────────────
def c(hexv):
    return np.array([int(hexv[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255

NAVY_T  = c("050a16")  # --night-sky-top
NAVY_B  = c("0e1a30")  # --night-sky-bottom
PURPLE  = c("b026ff")  # --accent
MAGENTA = c("ff2ac0")  # --accent-hot
CREAM   = c("f4d9a6")  # --accent-cream
CYAN    = c("2effd5")  # --accent-cyan

BG = (NAVY_T[None, None, :] * (1 - yy[..., None]) + NAVY_B[None, None, :] * yy[..., None]).astype(np.float32)

# ビネット（シェーダー版と同じ係数）
_dx = (xx - 0.5) * (W / H)
_dy = yy - 0.5
_r = np.sqrt(_dx**2 + _dy**2)
VIG = (0.42 + 0.58 * np.clip((0.88 - _r) / 0.62, 0, 1))[..., None].astype(np.float32)

rng = np.random.default_rng(7)

def smooth(v, lo, hi):
    return np.clip((v - lo) / (hi - lo), 0, 1)

def render(name, frame_fn):
    path = os.path.join(OUT, name)
    p = subprocess.Popen(
        ["ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "26",
         "-preset", "medium", "-movflags", "+faststart", path],
        stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    for i in range(N):
        t = np.float32(i / N)
        col = frame_fn(t)
        # フィルムグレイン
        col = col + (rng.random((H, W, 1), dtype=np.float32) - 0.5) * 0.035
        col = col * VIG
        frame = (np.clip(col, 0, 1) * 255).astype(np.uint8)
        p.stdin.write(np.ascontiguousarray(frame).tobytes())
    p.stdin.close()
    p.wait()
    print("done:", name)

# ── 候補1: オシロスコープ波形 ──────────────────────────────
x1 = xx[0]  # (W,)
WAVE_LINES = [
    # (y中心, 振幅, 色, 太さ, 周期数, 強さ)
    (0.50, 0.10, PURPLE,  0.012, 1, 0.55),
    (0.50, 0.16, MAGENTA, 0.006, 2, 0.30),
    (0.50, 0.07, CYAN,    0.004, 3, 0.35),
    (0.32, 0.04, PURPLE,  0.003, 2, 0.20),
    (0.70, 0.05, CREAM,   0.003, 1, 0.14),
]
def f_wave(t):
    col = BG.copy()
    for yc, amp, colr, wd, n, inten in WAVE_LINES:
        curve = yc + amp * (
            0.55 * np.sin(TAU * (3 * x1 + n * t))
            + 0.30 * np.sin(TAU * (7 * x1 - 2 * n * t) + 1.7)
            + 0.15 * np.sin(TAU * (13 * x1 + 3 * n * t) + 4.1)
        )
        d = yy - curve[None, :]
        glow = np.exp(-(d / wd) ** 2) + 0.35 * np.exp(-(d / (wd * 4)) ** 2)
        col += colr[None, None, :] * glow[..., None] * inten
    return col

# ── 候補2: スペクトラムバー ────────────────────────────────
NB = 56
bar_idx = np.clip((xx * NB).astype(np.int32), 0, NB - 1)
gap = ((xx * NB) % 1.0)
gapmask = ((gap > 0.18) & (gap < 0.82)).astype(np.float32)[..., None]
freqs = rng.integers(1, 4, NB).astype(np.float32)
phis = rng.random(NB).astype(np.float32)
env = (0.35 + 0.65 * np.exp(-((np.arange(NB) - NB / 2) / (NB / 2.6)) ** 2)).astype(np.float32)
def f_spectrum(t):
    col = BG.copy()
    h = 0.06 + 0.30 * env * (0.5 + 0.5 * np.sin(TAU * (freqs * t + phis)))
    h2 = 0.06 + 0.30 * env * (0.5 + 0.5 * np.sin(TAU * (np.roll(freqs, 7) * t + np.roll(phis, 11))))
    hh = np.maximum(h, h2 * 0.8)
    h_map = hh[bar_idx]
    rel = (yy - (1 - h_map)) / h_map
    inside = (rel > 0).astype(np.float32) * np.clip(rel, 0, 1) ** 0.65
    tip = np.exp(-((yy - (1 - h_map)) / 0.012) ** 2)
    grad = np.clip(1 - rel, 0, 1)[..., None]
    bars = (PURPLE[None, None, :] * grad + MAGENTA[None, None, :] * (1 - grad)) * inside[..., None]
    col += (bars * 0.50 + CYAN[None, None, :] * tip[..., None] * 0.25) * gapmask
    col += CREAM[None, None, :] * np.exp(-np.abs(yy - 1.0) * 14)[..., None] * 0.10
    return col

# ── 候補3: オーロラドリフト（旧シェーダーの動画版）──────────
AUR = [
    (1.0, 1, 1, 1, 0.0), (0.7, 2, -1, 1, 1.3),
    (0.5, 3, 2, -1, 2.6), (0.35, 5, -2, 2, 4.0),
]
def f_aurora(t):
    n = np.zeros((H, W), dtype=np.float32)
    for a, fx, fy, nt, ph in AUR:
        n += a * np.sin(TAU * (fx * 0.9 * xx + fy * 0.6 * yy + nt * t) + ph) \
               * np.sin(TAU * (fx * 0.5 * xx - fy * 0.8 * yy + nt * t) + ph * 2.2)
    n = n / 2.55 * 0.5 + 0.5
    col = BG.copy()
    skymask = (1 - smooth(yy, 0.72, 0.98))[..., None]
    col += PURPLE[None, None, :] * (smooth(n, 0.52, 0.85) ** 1.5)[..., None] * 0.40 * skymask
    col += MAGENTA[None, None, :] * (smooth(n, 0.72, 0.95) ** 2)[..., None] * 0.20 * skymask
    col += CYAN[None, None, :] * (smooth(n, 0.88, 0.99) ** 2)[..., None] * 0.10 * skymask
    col += CREAM[None, None, :] * np.exp(-np.abs(yy - 0.80) * 10)[..., None] * 0.16
    return col

# ── 候補4: 漂う粒子（スタジオの塵）─────────────────────────
M = 130
P_x0 = rng.random(M).astype(np.float32)
P_y0 = rng.random(M).astype(np.float32)
P_vy = rng.integers(1, 3, M).astype(np.float32)          # 上昇: ループ中に1〜2画面
P_vx = rng.integers(-1, 2, M).astype(np.float32)         # 横流れ: -1/0/1画面
P_sig = (rng.random(M) * 2.6 + 1.4).astype(np.float32)   # ガウスのσ(px)
P_tw = rng.integers(1, 4, M).astype(np.float32)          # 明滅周期
P_ph = (rng.random(M) * TAU).astype(np.float32)
P_colors = []
for m in range(M):
    r = rng.random()
    if r < 0.62: P_colors.append(CREAM * 0.8)
    elif r < 0.80: P_colors.append(CYAN * 0.9)
    elif r < 0.92: P_colors.append(PURPLE)
    else: P_colors.append(MAGENTA * 0.9)
P_kern = []
for m in range(M):
    rad = int(np.ceil(P_sig[m] * 3))
    g = np.arange(-rad, rad + 1, dtype=np.float32)
    k = np.exp(-(g[:, None] ** 2 + g[None, :] ** 2) / (2 * P_sig[m] ** 2))
    P_kern.append((rad, k))
GLOW_A = np.exp(-(((xx - 0.30) * (W / H)) ** 2 + (yy - 0.35) ** 2) / 0.16)[..., None] * PURPLE[None, None, :] * 0.10
GLOW_B = np.exp(-(((xx - 0.75) * (W / H)) ** 2 + (yy - 0.70) ** 2) / 0.10)[..., None] * CYAN[None, None, :] * 0.05
def f_dust(t):
    col = BG.copy()
    sway = 0.5 + 0.5 * np.sin(TAU * t)
    col += GLOW_A * (0.7 + 0.3 * sway) + GLOW_B * (1.0 - 0.3 * sway)
    for m in range(M):
        px = (P_x0[m] + P_vx[m] * t) % 1.0
        py = (P_y0[m] - P_vy[m] * t) % 1.0
        cx, cy = int(px * (W - 1)), int(py * (H - 1))
        rad, k = P_kern[m]
        alpha = 0.55 * (0.7 + 0.3 * np.sin(TAU * P_tw[m] * t + P_ph[m]))
        y0, y1 = max(0, cy - rad), min(H, cy + rad + 1)
        x0, x1b = max(0, cx - rad), min(W, cx + rad + 1)
        ky0, kx0 = y0 - (cy - rad), x0 - (cx - rad)
        patch = k[ky0:ky0 + (y1 - y0), kx0:kx0 + (x1b - x0)]
        col[y0:y1, x0:x1b] += P_colors[m][None, None, :] * patch[..., None] * alpha
    return col

# ── 候補5: サインリボン ────────────────────────────────────
RIBBONS = [
    (0.38, 0.10, 0.085, PURPLE,  1, 0.30, 0.0),
    (0.55, -0.14, 0.060, CYAN,   1, 0.16, 2.0),
    (0.62, 0.08, 0.110, MAGENTA, 2, 0.18, 4.2),
    (0.30, -0.06, 0.045, CREAM,  1, 0.08, 1.1),
]
def f_ribbons(t):
    col = BG.copy()
    for c0, slope, wd, colr, n, inten, ph in RIBBONS:
        yc = c0 + slope * xx + 0.07 * np.sin(TAU * (1.2 * xx + n * t) + ph) \
             + 0.03 * np.sin(TAU * (2.8 * xx - n * t) + ph * 1.7)
        d = yy - yc
        band = np.exp(-(d / wd) ** 2)
        col += colr[None, None, :] * band[..., None] * inten
    return col

if __name__ == "__main__":
    render("01-waveform.mp4", f_wave)
    render("02-spectrum.mp4", f_spectrum)
    render("03-aurora.mp4", f_aurora)
    render("04-dust.mp4", f_dust)
    render("05-ribbons.mp4", f_ribbons)
