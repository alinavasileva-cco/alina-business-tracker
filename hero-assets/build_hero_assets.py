from pathlib import Path
from PIL import Image
import numpy as np
import cv2
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "hero"
OUT.mkdir(parents=True, exist_ok=True)

REFERENCE = ROOT / "assets" / "final" / "hero-final.webp"
PORTRAIT = ROOT / "v4" / "assets" / "portrait" / "alina-portrait-rgba-final.png"

# Normalize the approved master screenshot to the QA reference coordinate system.
ref_img = Image.open(REFERENCE).convert("RGB").resize((1672, 941), Image.Resampling.LANCZOS)
ref_full = np.array(ref_img)
stage = ref_full[64:941].copy()
h, w = stage.shape[:2]

# ---------- content removal / clean plate ----------
def region_content_mask(img, x1, y1_abs, x2, y2_abs):
    y1 = max(0, y1_abs - 64)
    y2 = min(h, y2_abs - 64)
    sub = img[y1:y2, x1:x2]
    r, g, b = sub[:, :, 0], sub[:, :, 1], sub[:, :, 2]
    dark = (r < 125) & (g < 125) & (b < 125)
    red = (r > 130) & (g < 135) & (b < 120) & ((r - g) > 35)
    m = (dark | red).astype(np.uint8) * 255
    m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)), iterations=1)
    out = np.zeros((h, w), np.uint8)
    out[y1:y2, x1:x2] = m
    return out


def normalized_fill(img, mask, sigma):
    valid = (mask == 0).astype(np.float32)
    source = img.astype(np.float32)
    den = cv2.GaussianBlur(valid, (0, 0), sigmaX=sigma, sigmaY=sigma)
    den = np.maximum(den, 1e-4)
    filled = np.empty_like(source)
    for c in range(3):
        num = cv2.GaussianBlur(source[:, :, c] * valid, (0, 0), sigmaX=sigma, sigmaY=sigma)
        filled[:, :, c] = num / den
    soft = cv2.GaussianBlur((mask > 0).astype(np.float32), (0, 0), sigmaX=2.2, sigmaY=2.2)[..., None]
    return np.clip(source * (1 - soft) + filled * soft, 0, 255).astype(np.uint8)


mask_text = np.zeros((h, w), np.uint8)
for box in [
    (35, 180, 580, 360),
    (30, 455, 440, 740),
    (1070, 175, 1560, 545),
    (1070, 560, 1410, 745),
    (30, 845, 340, 930),
]:
    mask_text = cv2.bitwise_or(mask_text, region_content_mask(stage, *box))

clean1 = normalized_fill(stage, mask_text, 22)

portrait = Image.open(PORTRAIT).convert("RGBA")
target_h = 694
target_w = round(portrait.width * target_h / portrait.height)
portrait_alpha = np.array(portrait.resize((target_w, target_h), Image.Resampling.LANCZOS))[:, :, 3]
mask_portrait = np.zeros((h, w), np.uint8)
x_center = 817
x0 = x_center - target_w // 2
y0 = 188 - 64
ph = min(target_h, h - y0)
pw = min(target_w, w - x0)
mask_portrait[y0:y0 + ph, x0:x0 + pw] = np.maximum(
    mask_portrait[y0:y0 + ph, x0:x0 + pw], portrait_alpha[:ph, :pw]
)
mask_portrait = (mask_portrait > 8).astype(np.uint8) * 255
mask_portrait = cv2.dilate(mask_portrait, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)), iterations=1)
cv2.ellipse(mask_portrait, (817, 815), (115, 28), 0, 0, 360, 255, -1)

clean2 = normalized_fill(clean1, mask_portrait, 58)

floor_y = 786
left_end = 593
left_reveal_end = 628
niche_end = 1046
right_reveal_end = 1082


def bilinear_region(width, height, c00, c10, c01, c11):
    xs = np.linspace(0, 1, width)[None, :, None]
    ys = np.linspace(0, 1, height)[:, None, None]
    c00 = np.array(c00)[None, None, :]
    c10 = np.array(c10)[None, None, :]
    c01 = np.array(c01)[None, None, :]
    c11 = np.array(c11)[None, None, :]
    return ((1-xs)*(1-ys)*c00 + xs*(1-ys)*c10 + (1-xs)*ys*c01 + xs*ys*c11)


def mean_box(x1, y1, x2, y2):
    sub = stage[y1:y2, x1:x2]
    return np.median(sub.reshape(-1, 3), axis=0)

clean = np.zeros_like(stage)

# Synthetic matte walls sampled from the approved reference, keeping subtle natural falloff.
c00 = mean_box(80, 30, 180, 110)
c10 = mean_box(500, 30, 570, 110)
c01 = mean_box(80, 650, 180, 740)
c11 = mean_box(500, 650, 570, 740)
left = bilinear_region(left_end, floor_y, c00, c10, c01, c11)
xx = np.arange(left_end)
left_shadow = (18 * np.exp(-((left_end - 1 - xx) / 70) ** 2))[None, :, None]
clean[:floor_y, :left_end] = np.clip(left - left_shadow, 0, 255).astype(np.uint8)

# Authentic physical reveals from the approved reference.
clean[:floor_y, left_end:left_reveal_end] = stage[:floor_y, left_end:left_reveal_end]

# Preserve the reference niche light/shadow character, but remove portrait/text.
clean[:floor_y, left_reveal_end:niche_end] = clean2[:floor_y, left_reveal_end:niche_end]
niche = clean[:floor_y, left_reveal_end:niche_end]
niche_soft = cv2.GaussianBlur(niche, (0, 0), sigmaX=2.0, sigmaY=2.0)
clean[:floor_y, left_reveal_end:niche_end] = (0.88*niche + 0.12*niche_soft).astype(np.uint8)

clean[:floor_y, niche_end:right_reveal_end] = stage[:floor_y, niche_end:right_reveal_end]

c00 = mean_box(1120, 30, 1220, 110)
c10 = mean_box(1510, 30, 1610, 110)
c01 = mean_box(1120, 650, 1220, 740)
c11 = mean_box(1510, 650, 1610, 740)
right = bilinear_region(w - right_reveal_end, floor_y, c00, c10, c01, c11)
xx = np.arange(w - right_reveal_end)
right_shadow = (14 * np.exp(-(xx / 72) ** 2))[None, :, None]
clean[:floor_y, right_reveal_end:] = np.clip(right - right_shadow, 0, 255).astype(np.uint8)

# Low architectural floor: never rises through copy.
c00 = mean_box(350, 800, 500, 840)
c10 = mean_box(1300, 800, 1500, 840)
c01 = mean_box(350, 845, 500, 872)
c11 = mean_box(1300, 845, 1500, 872)
floor = bilinear_region(w, h - floor_y, c00, c10, c01, c11)
xx = np.arange(w)
vertical_shadow = (
    10*np.exp(-((xx-left_end)/48)**2) +
    7*np.exp(-((xx-niche_end)/50)**2)
)[None, :, None]
floor = np.clip(floor - vertical_shadow, 0, 255)
yy = np.arange(h-floor_y)[:, None]
center_ambient = np.exp(-((xx-835)/220)**2)[None, :] * np.exp(-((yy-10)/75)**2)
floor = np.clip(floor - center_ambient[:, :, None]*7, 0, 255)
clean[floor_y:] = floor.astype(np.uint8)

# Soften the wall/floor meeting without producing a UI-like horizontal stripe.
orig_band = stage[floor_y-8:floor_y+18].astype(np.float32)
curr_band = clean[floor_y-8:floor_y+18].astype(np.float32)
orig_band_blur = cv2.GaussianBlur(orig_band, (0, 0), sigmaX=18, sigmaY=6)
clean[floor_y-8:floor_y+18] = np.clip(curr_band*0.68 + orig_band_blur*0.32, 0, 255).astype(np.uint8)

stage_clean = Image.fromarray(clean, "RGB")
stage_clean.save(OUT / "hero-architecture-reference-clean.png", optimize=True)

# Desktop asset preserves the approved-reference geometry.
stage_clean.resize((2400, 1350), Image.Resampling.LANCZOS).save(
    OUT / "hero-architecture-desktop.webp", "WEBP", quality=92, method=6
)

segments = [(0,593),(593,628),(628,1046),(1046,1082),(1082,1672)]
floor_source = stage_clean.crop((0, floor_y, 1672, 877))


def make_plate(width, height, segment_widths, floor_h, filename):
    top_h = height - floor_h
    result = Image.new("RGB", (width, height))
    x = 0
    for (sx1, sx2), target_w in zip(segments, segment_widths):
        crop = stage_clean.crop((sx1, 0, sx2, floor_y)).resize((target_w, top_h), Image.Resampling.LANCZOS)
        result.paste(crop, (x, 0))
        x += target_w
    result.paste(floor_source.resize((width, floor_h), Image.Resampling.LANCZOS), (0, top_h))
    result.save(OUT / filename, "WEBP", quality=92, method=6)


make_plate(1600, 2000, [344,36,840,36,344], 230, "hero-architecture-tablet.webp")
make_plate(1080, 1920, [156,24,720,24,156], 235, "hero-architecture-mobile.webp")

# ---------- portrait edge decontamination ----------
rgba = np.array(portrait)
rgb = rgba[:, :, :3].copy()
alpha = rgba[:, :, 3].copy()
solid = alpha >= 248
_, inds = ndimage.distance_transform_edt(~solid, return_indices=True)
nearest_rgb = rgb[inds[0], inds[1]]
partial = (alpha > 0) & (alpha < 255)
lum = rgb.mean(axis=2)
contam = partial & (((alpha < 220) & (lum > 185)) | ((alpha < 128) & (lum > 165)))
weights = np.zeros_like(alpha, dtype=np.float32)
weights[contam] = np.clip((220-alpha[contam])/160, 0.25, 1.0)
weights[contam & (lum > 235)] = 1.0
out_rgb = rgb.astype(np.float32) * (1-weights[...,None]) + nearest_rgb.astype(np.float32) * weights[...,None]
clean_rgba = np.dstack([np.clip(out_rgb,0,255).astype(np.uint8), alpha])
clean_portrait = Image.fromarray(clean_rgba, "RGBA")
clean_portrait.save(OUT / "alina-portrait-clean.png", optimize=True)
clean_portrait.save(OUT / "alina-portrait-clean.webp", "WEBP", quality=95, method=6, alpha_quality=100)

# Machine-readable QA metadata.
alpha_bbox = Image.fromarray(alpha).getbbox()
(OUT / "asset-report.txt").write_text(
    "reference=assets/final/hero-final.webp\n"
    f"portrait_size={portrait.width}x{portrait.height}\n"
    f"portrait_mode={portrait.mode}\n"
    f"alpha_extrema={int(alpha.min())},{int(alpha.max())}\n"
    f"alpha_bbox={alpha_bbox}\n",
    encoding="utf-8",
)

print("Hero assets generated in", OUT)
