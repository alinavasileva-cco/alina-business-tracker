from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np

SRC = Path('assets/alina-portrait-final-CG-Hxy5F.png')
OUT = Path('approved/assets/alina-portrait-clean.png')
OUT.parent.mkdir(parents=True, exist_ok=True)

im = Image.open(SRC).convert('RGBA')
a = np.asarray(im, dtype=np.float32)
rgb = a[:, :, :3]
alpha = a[:, :, 3] / 255.0

# Decontaminate semi-transparent edge RGB from the former light background.
# Estimate local intrinsic colour from blurred premultiplied colour / blurred alpha,
# while preserving the original alpha and all opaque interior pixels.
radius = 1.35
alpha_img = Image.fromarray(np.clip(alpha * 255, 0, 255).astype(np.uint8), 'L')
alpha_blur = np.asarray(alpha_img.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32) / 255.0

estimate = np.zeros_like(rgb)
for c in range(3):
    premult = rgb[:, :, c] * alpha
    pm_img = Image.fromarray(np.clip(premult, 0, 255).astype(np.uint8), 'L')
    pm_blur = np.asarray(pm_img.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32)
    estimate[:, :, c] = pm_blur / np.maximum(alpha_blur, 0.015)

edge = (alpha > 0.002) & (alpha < 0.985)
# Extra focus on bright/neutral fringe pixels where halo is visually strongest.
spread = rgb.max(axis=2) - rgb.min(axis=2)
bright_neutral = edge & (rgb.mean(axis=2) > 150) & (spread < 70)
soft_edge = edge & (alpha < 0.80)
replace = bright_neutral | soft_edge
rgb[replace] = np.clip(estimate[replace], 0, 255)

# Remove only nearly invisible outer contamination; do not erode hair or silhouette.
alpha2 = alpha.copy()
alpha2[alpha2 < 0.010] = 0.0
alpha2 = np.clip((alpha2 - 0.004) / 0.996, 0.0, 1.0)

out = np.dstack([np.clip(rgb, 0, 255), alpha2[:, :, None] * 255]).astype(np.uint8)
Image.fromarray(out, 'RGBA').save(OUT, 'PNG', optimize=True)
print('Saved', OUT, Image.open(OUT).size)
