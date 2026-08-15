from pathlib import Path
import re
import shutil

ASSET_NAMES = [
    'hero-bg-ultrawide-5120x2160.jpg',
    'hero-bg-desktop-3840x2160.jpg',
    'hero-bg-laptop-3200x2000.jpg',
    'hero-bg-tablet-landscape-2732x2048.jpg',
    'hero-bg-tablet-portrait-2048x2732.jpg',
    'hero-bg-mobile-1440x2560.jpg',
    'hero-bg-mobile-tall-1440x3120.jpg',
    'alina-portrait-clean.png',
]

src_assets = Path('approved/assets')
v2_assets = Path('v2/assets')
v2_assets.mkdir(parents=True, exist_ok=True)
for name in ASSET_NAMES:
    shutil.copy2(src_assets / name, v2_assets / name)

for path in (Path('approved/index.html'), Path('v2/approved.html')):
    text = path.read_text(encoding='utf-8')
    text = text.replace('../assets/alina-portrait-final-CG-Hxy5F.png', 'assets/alina-portrait-clean.png')
    text = re.sub(r'\s*<span class="portrait-contact-shadow"[^>]*></span>', '', text)
    text = re.sub(r'\s*<span class="header-line"[^>]*></span>', '', text)
    # Defensive override for cached/older declarations: no artificial floor puddle or header strip.
    hotfix = '\n    .portrait-contact-shadow,.header-line{display:none!important}\n    .hero-portrait img{filter:none!important}\n'
    if hotfix.strip() not in text:
        text = text.replace('</style>', hotfix + '  </style>')
    path.write_text(text, encoding='utf-8')
    print('Patched', path)
