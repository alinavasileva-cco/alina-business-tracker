from __future__ import annotations

from pathlib import Path
import sys

import numpy as np
import scipy.ndimage as ndi
from PIL import Image, ImageFilter


def clean_portrait(source: Path, target: Path) -> None:
    """Remove only pale matte contamination at the alpha edge.

    The interior pixels of the subject are preserved. The operation acts on a
    narrow outer contour and uses the nearest opaque interior colour to avoid
    a white fringe around blonde hair after compositing on the hero scene.
    """
    image = Image.open(source).convert('RGBA')
    rgba = np.array(image).astype(np.float32)
    rgb = rgba[:, :, :3]
    alpha = rgba[:, :, 3] / 255.0

    visible = alpha > 0.003
    distance_inside = ndi.distance_transform_edt(visible)

    interior = (distance_inside >= 13.0) & (alpha > 0.994)
    if not interior.any():
        interior = (distance_inside >= 8.0) & (alpha > 0.98)

    _, indices = ndi.distance_transform_edt(~interior, return_indices=True)
    nearest_rgb = rgb[indices[0], indices[1]]

    luminance = rgb.mean(axis=2)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)

    edge_strength = np.clip((15.0 - distance_inside) / 15.0, 0.0, 1.0)
    semi_strength = np.clip((0.9995 - alpha) / 0.30, 0.0, 1.0)
    decontam_weight = np.maximum(edge_strength * 0.995, semi_strength * 0.99) * visible

    pale_neutral_edge = (
        (luminance > 140.0)
        & (chroma < 100.0)
        & (distance_inside < 17.0)
    )
    decontam_weight[pale_neutral_edge] = np.maximum(
        decontam_weight[pale_neutral_edge],
        np.clip((17.0 - distance_inside[pale_neutral_edge]) / 17.0, 0.0, 1.0),
    )

    rgb = rgb * (1.0 - decontam_weight[..., None]) + nearest_rgb * decontam_weight[..., None]

    alpha_image = Image.fromarray(np.clip(alpha * 255.0, 0, 255).astype(np.uint8), 'L')
    eroded = np.array(alpha_image.filter(ImageFilter.MinFilter(9))).astype(np.float32) / 255.0
    cleaned_alpha = np.minimum(alpha, 0.015 * alpha + 0.985 * eroded)

    outer = visible & (distance_inside < 6.6)
    outer_factor = np.clip((distance_inside - 0.03) / 6.57, 0.01, 1.0)
    cleaned_alpha[outer] *= outer_factor[outer]

    halo_zone = pale_neutral_edge & (distance_inside < 11.5)
    halo_fade = np.clip((distance_inside - 0.12) / 11.38, 0.01, 1.0)
    cleaned_alpha[halo_zone] *= 0.05 + 0.36 * halo_fade[halo_zone]

    cleaned_alpha_image = Image.fromarray(
        np.clip(cleaned_alpha * 255.0, 0, 255).astype(np.uint8), 'L'
    ).filter(ImageFilter.GaussianBlur(0.28))
    cleaned_alpha = np.array(cleaned_alpha_image).astype(np.float32) / 255.0
    cleaned_alpha[cleaned_alpha < 0.009] = 0.0

    out = np.dstack([
        np.clip(rgb, 0, 255).astype(np.uint8),
        np.clip(cleaned_alpha * 255.0, 0, 255).astype(np.uint8),
    ])

    result = Image.fromarray(out, 'RGBA')
    if result.size != (1190, 3876):
        result = result.resize((1190, 3876), Image.Resampling.LANCZOS)

    final_rgba = np.array(result).astype(np.uint8)
    final_alpha = Image.fromarray(final_rgba[:, :, 3], 'L').filter(ImageFilter.MinFilter(3))
    final_alpha = final_alpha.filter(ImageFilter.GaussianBlur(0.16))
    final_rgba[:, :, 3] = np.array(final_alpha)

    target.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(final_rgba, 'RGBA').save(target, 'PNG', optimize=True)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit('usage: clean_portrait_v11.py SOURCE TARGET')
    clean_portrait(Path(sys.argv[1]), Path(sys.argv[2]))
