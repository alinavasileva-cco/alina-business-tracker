from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np
import scipy.ndimage as ndi
import shutil

ROOT = Path(__file__).resolve().parents[1]
V2 = ROOT / 'v2'
ASSETS = V2 / 'assets'
TMP = ROOT / '.tmp' / 'final-hero'

MOBILE_TALL = ASSETS / 'hero-bg-mobile-tall-final-1440x3120.webp'
MOBILE = ASSETS / 'hero-bg-mobile-final-1440x2560.webp'
TABLET_P = ASSETS / 'hero-bg-tablet-portrait-final-2048x2732.webp'
PORTRAIT_IN = V2 / 'assets' / 'alina-portrait-clean.png'
PORTRAIT_OUT = ASSETS / 'alina-portrait-clean-v2.png'
HTML_IN = TMP / 'approved.html'
HTML_OUT = V2 / 'approved.html'


def cover_crop(im: Image.Image, size: tuple[int, int], y_bias: float) -> Image.Image:
    W, H = size
    w, h = im.size
    scale = max(W / w, H / h)
    nw, nh = int(round(w * scale)), int(round(h * scale))
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    x = max(0, (nw - W) // 2)
    y = int(round(max(0, nh - H) * y_bias))
    y = min(max(0, y), max(0, nh - H))
    return im.crop((x, y, x + W, y + H))


def build_responsive_plates() -> None:
    src = Image.open(MOBILE_TALL).convert('RGB')
    # 9:16 phone plate: keep the central niche / floor relation of the tall master.
    cover_crop(src, (1440, 2560), 0.50).save(MOBILE, 'WEBP', quality=90, method=6)
    # 3:4 tablet portrait: top-biased crop preserves the approved niche scale and floor line.
    cover_crop(src, (2048, 2732), 0.14).save(TABLET_P, 'WEBP', quality=90, method=6)


def clean_portrait() -> None:
    # Second-pass decontamination of the already cleaned RGBA portrait.
    # Only semi-transparent edge pixels are affected; opaque portrait pixels remain intact.
    im = Image.open(PORTRAIT_IN).convert('RGBA')
    arr = np.array(im)
    rgb = arr[:, :, :3].copy()
    alpha = arr[:, :, 3].astype(np.float32) / 255.0

    opaque = alpha > 0.97
    _, inds = ndi.distance_transform_edt(~opaque, return_indices=True)
    nearest_rgb = rgb[inds[0], inds[1]]

    edge = (alpha > 0) & (alpha < 0.995)
    weight = np.clip((0.995 - alpha) / 0.6, 0, 1)[..., None]
    rgbf = rgb.astype(np.float32)
    rgbf[edge] = (1 - weight[edge]) * rgbf[edge] + weight[edge] * nearest_rgb[edge].astype(np.float32)

    alpha_img = Image.fromarray((alpha * 255).astype(np.uint8), 'L')
    eroded = np.array(alpha_img.filter(ImageFilter.MinFilter(3))).astype(np.float32) / 255.0
    alpha2 = alpha.copy()
    edge2 = alpha < 0.999
    alpha2[edge2] = 0.35 * alpha[edge2] + 0.65 * eroded[edge2]
    alpha2[alpha2 < 0.008] = 0
    alpha2 = np.power(alpha2, 1.08)

    out = np.dstack([
        np.clip(rgbf, 0, 255).astype(np.uint8),
        np.clip(alpha2 * 255, 0, 255).astype(np.uint8),
    ])
    Image.fromarray(out, 'RGBA').save(PORTRAIT_OUT, 'PNG', optimize=True)


def publish_html() -> None:
    if not HTML_IN.exists():
        raise SystemExit(f'Missing {HTML_IN}')
    shutil.copy2(HTML_IN, HTML_OUT)


def validate() -> None:
    expected = {
        'hero-bg-ultrawide-final-5120x2160.webp': (5120, 2160),
        'hero-bg-desktop-final-3840x2160.webp': (3840, 2160),
        'hero-bg-laptop-final-3200x2000.webp': (3200, 2000),
        'hero-bg-tablet-landscape-final-2732x2048.webp': (2732, 2048),
        'hero-bg-tablet-portrait-final-2048x2732.webp': (2048, 2732),
        'hero-bg-mobile-final-1440x2560.webp': (1440, 2560),
        'hero-bg-mobile-tall-final-1440x3120.webp': (1440, 3120),
    }
    for name, size in expected.items():
        path = ASSETS / name
        if not path.exists():
            raise SystemExit(f'Missing {path}')
        with Image.open(path) as im:
            if im.size != size or im.mode != 'RGB':
                raise SystemExit(f'Invalid {path}: {im.size} {im.mode}')
            im.verify()
        print('OK', name, size)

    with Image.open(PORTRAIT_OUT) as im:
        if im.size != (595, 1938) or im.mode != 'RGBA':
            raise SystemExit(f'Invalid portrait: {im.size} {im.mode}')
        im.verify()
    print('OK portrait', PORTRAIT_OUT)

    shadow = ASSETS / 'portrait-floor-shadow.png'
    if not shadow.exists():
        raise SystemExit(f'Missing shadow matte: {shadow}')
    with Image.open(shadow) as im:
        im.verify()
    print('OK shadow matte', shadow)

    text = HTML_OUT.read_text(encoding='utf-8')
    required = [
        'GROWTH', 'NEEDS', 'SPACE.', 'АЛИНА ВАСИЛЬЕВА',
        '12 ЛЕТ', '600+', 'БОЛЕЕ 500 МЛН', '@AlinaVasileva',
        'assets/alina-portrait-clean-v2.png',
        'hero-bg-mobile-final-1440x2560.webp',
        'hero-bg-mobile-tall-final-1440x3120.webp',
        '<picture class="hero-bg"',
    ]
    for token in required:
        if token not in text:
            raise SystemExit(f'Missing required HTML token: {token}')
    forbidden = ['object-fit: fill', 'data:image/', 'drop-shadow(', 'portrait-contact-shadow']
    for token in forbidden:
        if token in text:
            raise SystemExit(f'Forbidden HTML/CSS token present: {token}')
    print('OK HTML validation')


if __name__ == '__main__':
    ASSETS.mkdir(parents=True, exist_ok=True)
    build_responsive_plates()
    clean_portrait()
    publish_html()
    validate()
