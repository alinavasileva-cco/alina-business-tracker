from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

OUT = Path("approved/assets")
OUT.mkdir(parents=True, exist_ok=True)

SPECS = [
    ("hero-bg-ultrawide-5120x2160.jpg", 5120, 2160, 0.27, 0.82, 11),
    ("hero-bg-desktop-3840x2160.jpg", 3840, 2160, 0.30, 0.82, 12),
    ("hero-bg-laptop-3200x2000.jpg", 3200, 2000, 0.32, 0.83, 13),
    ("hero-bg-tablet-landscape-2732x2048.jpg", 2732, 2048, 0.39, 0.84, 14),
    ("hero-bg-tablet-portrait-2048x2732.jpg", 2048, 2732, 0.52, 0.86, 15),
    ("hero-bg-mobile-1440x2560.jpg", 1440, 2560, 0.58, 0.87, 16),
    ("hero-bg-mobile-tall-1440x3120.jpg", 1440, 3120, 0.58, 0.88, 17),
]


def low_frequency_noise(rng, w, h):
    sh = max(4, h // 90)
    sw = max(4, w // 90)
    raw = rng.normal(0, 1, (sh, sw))
    raw = (raw - raw.min()) / max(1e-6, raw.max() - raw.min()) * 255
    im = Image.fromarray(raw.astype(np.uint8), "L")
    im = im.resize((w, h), Image.Resampling.BICUBIC)
    im = im.filter(ImageFilter.GaussianBlur(max(4, w // 650)))
    a = np.asarray(im, dtype=np.float32)
    return (a - a.mean()) / 255.0


def render(w, h, niche_width, horizon, seed):
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w]

    wall = np.array([234.0, 223.0, 211.0], dtype=np.float32)
    fine = rng.normal(0, 0.55, (h, w)).astype(np.float32)
    low = low_frequency_noise(rng, w, h) * 1.15
    vertical = (yy / h - 0.42) * 3.3
    center_glow = 2.2 * np.exp(-(((xx - w * 0.54) / (w * 0.78)) ** 2 + ((yy - h * 0.30) / (h * 0.78)) ** 2))

    base = np.empty((h, w, 3), dtype=np.float32)
    for c in range(3):
        base[:, :, c] = wall[c] - vertical + center_glow + fine + low
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), "RGB").convert("RGBA")

    # Natural light: broad left wash, subtle right wash.
    wash = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(wash, "RGBA")
    d.polygon([(0, int(h * 0.10)), (int(w * 0.31), int(h * 0.20)), (int(w * 0.32), int(h * 0.80)), (0, int(h * 0.89))], fill=(255, 249, 238, 47))
    d.polygon([(int(w * 0.73), int(h * 0.30)), (w, int(h * 0.20)), (w, int(h * 0.78)), (int(w * 0.79), int(h * 0.72))], fill=(255, 246, 232, 18))
    wash = wash.filter(ImageFilter.GaussianBlur(max(18, w // 145)))
    img = Image.alpha_composite(img, wash)

    # Diffuse window-frame shadows on the left. They are rasterized here, not CSS.
    shadows = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(shadows, "RGBA")
    for i, alpha in enumerate((30, 25, 20)):
        x = int(w * (0.018 + i * 0.086))
        bw = max(6, int(w * 0.010))
        d.polygon([(x, int(h * 0.15)), (x + bw, int(h * 0.148)), (x + int(w * 0.095) + bw, int(h * 0.78)), (x + int(w * 0.095), int(h * 0.79))], fill=(69, 56, 45, alpha))
    d.polygon([(0, int(h * 0.43)), (int(w * 0.32), int(h * 0.395)), (int(w * 0.323), int(h * 0.424)), (0, int(h * 0.472))], fill=(69, 56, 45, 19))
    shadows = shadows.filter(ImageFilter.GaussianBlur(max(18, w // 150)))
    img = Image.alpha_composite(img, shadows)

    horizon_y = int(h * horizon)
    floor_h = h - horizon_y
    fy, fx = np.mgrid[0:floor_h, 0:w]
    floor = np.empty((floor_h, w, 3), dtype=np.float32)
    floor_base = np.array([224.0, 213.0, 201.0], dtype=np.float32)
    depth = fy / max(1, floor_h) * 4.2
    floor_noise = rng.normal(0, 0.65, (floor_h, w)).astype(np.float32)
    for c in range(3):
        floor[:, :, c] = floor_base[c] + depth + floor_noise
    floor_rgba = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    floor_rgba.paste(Image.fromarray(np.clip(floor, 0, 255).astype(np.uint8), "RGB").convert("RGBA"), (0, horizon_y))
    img = Image.alpha_composite(img, floor_rgba)

    x0 = int(w * (0.5 - niche_width / 2))
    x1 = int(w * (0.5 + niche_width / 2))
    frame = max(24, int(w * (0.025 if w >= h else 0.034)))
    top_depth = max(frame, int(h * 0.045))
    ix0, ix1 = x0 + frame, x1 - frame
    iy0, iy1 = top_depth, horizon_y

    ambient = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(ambient, "RGBA")
    d.rectangle((x0 - int(w * 0.008), 0, x0 + frame, horizon_y), fill=(48, 39, 32, 35))
    d.rectangle((x1 - frame, 0, x1 + int(w * 0.008), horizon_y), fill=(48, 39, 32, 14))
    d.rectangle((x0, 0, x1, top_depth + int(h * 0.008)), fill=(48, 39, 32, 19))
    ambient = ambient.filter(ImageFilter.GaussianBlur(max(12, w // 220)))
    img = Image.alpha_composite(img, ambient)

    geom = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    nh, nw = iy1 - iy0, ix1 - ix0
    by, bx = np.mgrid[0:nh, 0:nw]
    back = np.empty((nh, nw, 4), dtype=np.float32)
    back_base = np.array([206.0, 194.0, 181.0], dtype=np.float32)
    glow = 3.5 * np.exp(-(((bx - nw * 0.58) / (nw * 0.75)) ** 2 + ((by - nh * 0.47) / (nh * 0.84)) ** 2))
    left_shadow = -6.0 * np.exp(-(bx / max(1, nw * 0.15)) ** 2)
    top_shadow = -2.6 * np.exp(-(by / max(1, nh * 0.12)) ** 2)
    back_noise = rng.normal(0, 0.50, (nh, nw)).astype(np.float32)
    for c in range(3):
        back[:, :, c] = back_base[c] + glow + left_shadow + top_shadow + back_noise
    back[:, :, 3] = 255
    geom.alpha_composite(Image.fromarray(np.clip(back, 0, 255).astype(np.uint8), "RGBA"), (ix0, iy0))

    d = ImageDraw.Draw(geom, "RGBA")
    d.polygon([(x0, 0), (ix0, iy0), (ix0, iy1), (x0, horizon_y)], fill=(193, 180, 167, 255))
    d.polygon([(ix1, iy0), (x1, 0), (x1, horizon_y), (ix1, iy1)], fill=(229, 217, 204, 255))
    d.polygon([(x0, 0), (x1, 0), (ix1, iy0), (ix0, iy0)], fill=(196, 183, 169, 255))
    img = Image.alpha_composite(img, geom)

    edges = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(edges, "RGBA")
    d.rectangle((ix0 - 3, iy0, ix0 + 3, iy1), fill=(65, 53, 44, 42))
    d.rectangle((ix1 - 3, iy0, ix1 + 3, iy1), fill=(255, 248, 238, 58))
    d.rectangle((x1 - 3, 0, x1 + 3, horizon_y), fill=(255, 248, 238, 39))
    edges = edges.filter(ImageFilter.GaussianBlur(max(1, w // 1300)))
    img = Image.alpha_composite(img, edges)

    contact = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(contact, "RGBA")
    d.ellipse((x0 - int(w * 0.025), horizon_y - int(h * 0.014), x1 + int(w * 0.025), horizon_y + int(h * 0.028)), fill=(70, 55, 44, 38))
    contact = contact.filter(ImageFilter.GaussianBlur(max(18, w // 165)))
    img = Image.alpha_composite(img, contact)

    result = np.asarray(img.convert("RGB"), dtype=np.float32)
    dx = (xx - w / 2) / (w / 2)
    dy = (yy - h / 2) / (h / 2)
    vignette = np.clip((dx * dx + dy * dy - 0.96) * 1.7, 0, 1)[..., None]
    result *= 1 - 0.018 * vignette
    return Image.fromarray(np.clip(result, 0, 255).astype(np.uint8), "RGB")


for name, width, height, niche_width, horizon, seed in SPECS:
    print(f"Rendering {name}: {width}x{height}")
    image = render(width, height, niche_width, horizon, seed)
    image.save(OUT / name, "JPEG", quality=92, optimize=True, progressive=True)

print("Rendered", len(SPECS), "HQ hero backgrounds")
