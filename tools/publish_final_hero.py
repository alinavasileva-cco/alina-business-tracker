from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np
import scipy.ndimage as ndi
import shutil

ROOT = Path(__file__).resolve().parents[1]
V2 = ROOT / 'v2'
ASSETS = V2 / 'assets'
TMP = ROOT / '.tmp' / 'final-hero'
HTML_IN = TMP / 'approved.html'
HTML_OUT = V2 / 'approved.html'
PORTRAIT_IN = ASSETS / 'alina-portrait-clean.png'
PORTRAIT_OUT = ASSETS / 'alina-portrait-final-nohalo.png'
PORTRAIT_SIZE = (1190, 3876)

PLATES = {
    'hero-bg-ultrawide-final-5120x2160.webp': ('hero-bg-ultrawide-5120x2160.jpg', (5120, 2160)),
    'hero-bg-desktop-final-3840x2160.webp': ('hero-bg-desktop-3840x2160.jpg', (3840, 2160)),
    'hero-bg-laptop-final-3200x2000.webp': ('hero-bg-laptop-3200x2000.jpg', (3200, 2000)),
    'hero-bg-tablet-landscape-final-2732x2048.webp': ('hero-bg-tablet-landscape-2732x2048.jpg', (2732, 2048)),
    'hero-bg-tablet-portrait-final-2048x2732.webp': ('hero-bg-tablet-portrait-2048x2732.jpg', (2048, 2732)),
    'hero-bg-mobile-final-1440x2560.webp': ('hero-bg-mobile-1440x2560.jpg', (1440, 2560)),
    'hero-bg-mobile-tall-final-1440x3120.webp': ('hero-bg-mobile-tall-1440x3120.jpg', (1440, 3120)),
}


def build_responsive_plates() -> None:
    for out_name, (src_name, expected_size) in PLATES.items():
        src_path = ASSETS / src_name
        if not src_path.exists():
            raise SystemExit(f'Missing source plate: {src_path}')
        with Image.open(src_path) as src:
            src = src.convert('RGB')
            if src.size != expected_size:
                raise SystemExit(f'Unexpected source size {src_path}: {src.size}, expected {expected_size}')
            src.save(ASSETS / out_name, 'WEBP', quality=96, method=6)


def clean_portrait() -> None:
    im = Image.open(PORTRAIT_IN).convert('RGBA')
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.float32)
    alpha = arr[:, :, 3].astype(np.float32) / 255.0

    solid = alpha > 0.97
    _, inds = ndi.distance_transform_edt(~solid, return_indices=True)
    nearest = rgb[inds[0], inds[1]]
    edge = (alpha > 0) & (alpha < 0.9995)
    edge_w = np.clip((0.9995 - alpha) / 0.30, 0, 1)[..., None]
    rgb[edge] = rgb[edge] * (1 - edge_w[edge]) + nearest[edge] * edge_w[edge]

    a8 = Image.fromarray(np.clip(alpha * 255, 0, 255).astype(np.uint8), 'L')
    eroded = np.array(a8.filter(ImageFilter.MinFilter(3))).astype(np.float32) / 255.0
    alpha2 = alpha.copy()
    semi = (alpha > 0) & (alpha < 0.92)
    alpha2[semi] = np.minimum(alpha2[semi], 0.25 * alpha[semi] + 0.75 * eroded[semi])
    alpha2[alpha2 < 0.022] = 0

    premul = rgb * alpha2[..., None]
    rgba_pm = np.dstack([np.clip(premul, 0, 255), np.clip(alpha2 * 255, 0, 255)]).astype(np.uint8)
    up = Image.fromarray(rgba_pm, 'RGBA').resize(PORTRAIT_SIZE, Image.Resampling.LANCZOS)
    up_arr = np.array(up).astype(np.float32)
    a = up_arr[:, :, 3:4] / 255.0
    pm = up_arr[:, :, :3]
    out_rgb = np.zeros_like(pm)
    mask = a[:, :, 0] > 0.002
    out_rgb[mask] = np.clip(pm[mask] / a[mask], 0, 255)
    out = np.dstack([out_rgb.astype(np.uint8), up_arr[:, :, 3].astype(np.uint8)])
    Image.fromarray(out, 'RGBA').save(PORTRAIT_OUT, 'PNG', optimize=True)


def publish_html() -> None:
    if not HTML_IN.exists():
        raise SystemExit(f'Missing {HTML_IN}')
    shutil.copy2(HTML_IN, HTML_OUT)


def validate() -> None:
    for out_name, (src_name, expected_size) in PLATES.items():
        src_path = ASSETS / src_name
        with Image.open(src_path) as src:
            if src.size != expected_size:
                raise SystemExit(f'Invalid source plate {src_path}: {src.size}')
            src.verify()
        path = ASSETS / out_name
        data = path.read_bytes()
        if data[:4] != b'RIFF' or data[8:12] != b'WEBP':
            raise SystemExit(f'Invalid WEBP signature: {path}')
        with Image.open(path) as im:
            if im.size != expected_size or im.mode != 'RGB':
                raise SystemExit(f'Invalid {path}: {im.size} {im.mode}')
            im.verify()
        print('OK plate', src_name, expected_size)

    data = PORTRAIT_OUT.read_bytes()
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        raise SystemExit('Invalid portrait PNG signature')
    with Image.open(PORTRAIT_OUT) as im:
        if im.size != PORTRAIT_SIZE or im.mode != 'RGBA':
            raise SystemExit(f'Invalid portrait: {im.size} {im.mode}')
        extrema = im.getchannel('A').getextrema()
        if extrema != (0, 255):
            raise SystemExit(f'Invalid portrait alpha extrema: {extrema}')
    with Image.open(PORTRAIT_OUT) as im:
        im.verify()
    print('OK portrait', PORTRAIT_OUT, PORTRAIT_SIZE)

    text = HTML_OUT.read_text(encoding='utf-8')
    required = [
        'GROWTH', 'NEEDS', 'SPACE.', 'АЛИНА ВАСИЛЬЕВА', '12 ЛЕТ', '600+',
        'БОЛЕЕ 500 МЛН', '@AlinaVasileva', 'alina-portrait-final-nohalo.png',
        'hero-bg-mobile-tall-1440x3120.jpg', 'hero-bg-desktop-3840x2160.jpg',
    ]
    for token in required:
        if token not in text:
            raise SystemExit(f'Missing required HTML token: {token}')
    forbidden = ['object-fit: fill', 'data:image/', 'drop-shadow(', 'filter:drop-shadow', 'nav-dot']
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
