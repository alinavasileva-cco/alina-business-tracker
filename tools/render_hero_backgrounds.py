from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

OUT = Path("approved/assets")
OUT.mkdir(parents=True, exist_ok=True)

SPECS = [
    ("hero-bg-ultrawide-5120x2160.jpg", 5120, 2160, 0.27, 0.82, 21),
    ("hero-bg-desktop-3840x2160.jpg", 3840, 2160, 0.30, 0.82, 22),
    ("hero-bg-laptop-3200x2000.jpg", 3200, 2000, 0.32, 0.83, 23),
    ("hero-bg-tablet-landscape-2732x2048.jpg", 2732, 2048, 0.39, 0.84, 24),
    ("hero-bg-tablet-portrait-2048x2732.jpg", 2048, 2732, 0.52, 0.86, 25),
    ("hero-bg-mobile-1440x2560.jpg", 1440, 2560, 0.58, 0.87, 26),
    ("hero-bg-mobile-tall-1440x3120.jpg", 1440, 3120, 0.58, 0.88, 27),
]


def low_frequency_noise(rng, w, h):
    sh = max(4, h // 90)
    sw = max(4, w // 90)
    raw = rng.normal(0, 1, (sh, sw))
    raw = (raw - raw.min()) / max(1e-6, raw.max() - raw.min()) * 255
    im = Image.fromarray(raw.astype(np.uint8), "L")
    im = im.resize((w, h), Image.Resampling.BICUBIC)
    im = im.filter(ImageFilter.GaussianBlur(max(3, w // 700)))
    a = np.asarray(im, dtype=np.float32)
    return (a - a.mean()) / 255.0


def render(w, h, niche_width, horizon, seed):
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w]

    # Warm matte wall. Texture is intentionally very low-amplitude so it stays clean at 200% zoom.
    wall = np.array([234.0, 223.0, 211.0], dtype=np.float32)
    fine = rng.normal(0, 0.40, (h, w)).astype(np.float32)
    low = low_frequency_noise(rng, w, h) * 2.0
    vertical = (yy / h - 0.40) * 2.4
    center_glow = 2.5 * np.exp(-(((xx - w * 0.54) / (w * 0.80)) ** 2 + ((yy - h * 0.28) / (h * 0.78)) ** 2))

    base = np.empty((h, w, 3), dtype=np.float32)
    for c in range(3):
        base[:, :, c] = wall[c] - vertical + center_glow + fine + low
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), "RGB").convert("RGBA")

    # Broad studio daylight only. No hard diagonal CSS-like stripes.
    wash = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(wash, "RGBA")
    d.polygon([(0, int(h * 0.10)), (int(w * 0.27), int(h * 0.18)), (int(w * 0.31), int(h * 0.78)), (0, int(h * 0.88))], fill=(255, 250, 241, 35))
    d.polygon([(int(w * 0.78), int(h * 0.22)), (w, int(h * 0.16)), (w, int(h * 0.80)), (int(w * 0.82), int(h * 0.74))], fill=(255, 247, 236, 11))
    wash = wash.filter(ImageFilter.GaussianBlur(max(16, w // 150)))
    img = Image.alpha_composite(img, wash)

    # Extremely soft window shadows: visible as atmosphere, never as bars.
    shadows = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(shadows, "RGBA")
    for i, alpha in enumerate((18, 14)):
        x = int(w * (0.02 + i * 0.095))
        bw = max(5, int(w * 0.008))
        d.polygon([(x, int(h * 0.18)), (x + bw, int(h * 0.18)), (x + int(w * 0.085) + bw, int(h * 0.76)), (x + int(w * 0.085), int(h * 0.76))], fill=(58, 48, 40, alpha))
    shadows = shadows.filter(ImageFilter.GaussianBlur(max(22, w // 125)))
    img = Image.alpha_composite(img, shadows)

    horizon_y = int(h * horizon)
    floor_h = h - horizon_y
    fy = np.arange(floor_h, dtype=np.float32)[:, None]
    floor = np.empty((floor_h, w, 3), dtype=np.float32)
    floor_base = np.array([226.0, 216.0, 204.0], dtype=np.float32)
    floor_noise = rng.normal(0, 0.42, (floor_h, w)).astype(np.float32)
    for c in range(3):
        floor[:, :, c] = floor_base[c] + fy / max(1, floor_h) * 3.0 + floor_noise
    floor_rgba = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    floor_rgba.paste(Image.fromarray(np.clip(floor, 0, 255).astype(np.uint8), "RGB").convert("RGBA"), (0, horizon_y))
    img = Image.alpha_composite(img, floor_rgba)

    # Deep architectural niche. It starts below the header instead of creating a flat bar at y=0.
    x0 = int(w * (0.5 - niche_width / 2))
    x1 = int(w * (0.5 + niche_width / 2))
    outer_top = int(h * 0.035)
    frame = max(26, int(w * (0.030 if w >= h else 0.040)))
    top_depth = max(frame, int(h * 0.060))
    ix0, ix1 = x0 + frame, x1 - frame
    iy0, iy1 = outer_top + top_depth, horizon_y

    # Ambient occlusion around the opening: broad and low-contrast.
    ambient = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(ambient, "RGBA")
    d.rectangle((x0 - int(w * 0.006), outer_top, x0 + frame + int(w * 0.010), horizon_y), fill=(46, 37, 31, 30))
    d.rectangle((x1 - frame - int(w * 0.004), outer_top, x1 + int(w * 0.004), horizon_y), fill=(46, 37, 31, 12))
    d.rectangle((x0, outer_top - int(h * 0.004), x1, iy0 + int(h * 0.008)), fill=(46, 37, 31, 18))
    ambient = ambient.filter(ImageFilter.GaussianBlur(max(12, w // 230)))
    img = Image.alpha_composite(img, ambient)

    geom = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    nh, nw = iy1 - iy0, ix1 - ix0
    by, bx = np.mgrid[0:nh, 0:nw]

    # Back wall is darker than the outer wall and gains depth toward the left/top corners.
    back = np.empty((nh, nw, 4), dtype=np.float32)
    back_base = np.array([200.0, 188.0, 174.0], dtype=np.float32)
    glow = 3.0 * np.exp(-(((bx - nw * 0.58) / (nw * 0.85)) ** 2 + ((by - nh * 0.48) / (nh * 0.95)) ** 2))
    left_shadow = -7.0 * np.exp(-(bx / max(1, nw * 0.13)) ** 2)
    right_shadow = -1.5 * np.exp(-((nw - 1 - bx) / max(1, nw * 0.12)) ** 2)
    top_shadow = -5.0 * np.exp(-(by / max(1, nh * 0.10)) ** 2)
    back_noise = rng.normal(0, 0.34, (nh, nw)).astype(np.float32)
    for c in range(3):
        back[:, :, c] = back_base[c] + glow + left_shadow + right_shadow + top_shadow + back_noise
    back[:, :, 3] = 255
    geom.alpha_composite(Image.fromarray(np.clip(back, 0, 255).astype(np.uint8), "RGBA"), (ix0, iy0))

    d = ImageDraw.Draw(geom, "RGBA")
    # Side and top planes. No explicit white edge stripe: depth comes from tonal planes and AO.
    d.polygon([(x0, outer_top), (ix0, iy0), (ix0, iy1), (x0, horizon_y)], fill=(190, 177, 163, 255))
    d.polygon([(ix1, iy0), (x1, outer_top), (x1, horizon_y), (ix1, iy1)], fill=(222, 209, 195, 255))
    d.polygon([(x0, outer_top), (x1, outer_top), (ix1, iy0), (ix0, iy0)], fill=(188, 174, 159, 255))
    img = Image.alpha_composite(img, geom)

    # Soft inner AO only; no bright vertical line and no artificial floor ellipse.
    ao = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(ao, "RGBA")
    band = max(4, w // 500)
    d.rectangle((ix0, iy0, ix0 + band, iy1), fill=(48, 38, 31, 35))
    d.rectangle((ix0, iy0, ix1, iy0 + band), fill=(48, 38, 31, 28))
    d.rectangle((ix1 - band, iy0, ix1, iy1), fill=(48, 38, 31, 12))
    ao = ao.filter(ImageFilter.GaussianBlur(max(4, w // 500)))
    img = Image.alpha_composite(img, ao)

    result = np.asarray(img.convert("RGB"), dtype=np.float32)
    dx = (xx - w / 2) / (w / 2)
    dy = (yy - h / 2) / (h / 2)
    vignette = np.clip((dx * dx + dy * dy - 1.02) * 1.45, 0, 1)[..., None]
    result *= 1 - 0.012 * vignette
    return Image.fromarray(np.clip(result, 0, 255).astype(np.uint8), "RGB")


for name, width, height, niche_width, horizon, seed in SPECS:
    print(f"Rendering {name}: {width}x{height}")
    image = render(width, height, niche_width, horizon, seed)
    image.save(OUT / name, "JPEG", quality=95, subsampling=0, optimize=True, progressive=True)

print("Rendered", len(SPECS), "HQ hero backgrounds")
