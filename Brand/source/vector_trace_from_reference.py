from collections import defaultdict
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "Logo" / "logo终版.png"
LOGO_DIR = ROOT / "Logo"
OUTPUT_DIR = ROOT / "Output"


def ensure_dirs():
    LOGO_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def region_mask(arr, box, threshold=9):
    x, y, w, h = box
    crop = arr[y:y + h, x:x + w].astype(np.int16)
    border = np.concatenate([
        crop[:3].reshape(-1, 3),
        crop[-3:].reshape(-1, 3),
        crop[:, :3].reshape(-1, 3),
        crop[:, -3:].reshape(-1, 3),
    ])
    bg = np.median(border, axis=0)
    dist = np.sqrt(((crop - bg) ** 2).sum(axis=2))
    dark = crop.max(axis=2) < 246
    return crop.astype(np.uint8), (dist > threshold) & dark


def runs_by_color(crop, mask):
    h, w = mask.shape
    groups = defaultdict(list)
    for yy in range(h):
        xx = 0
        while xx < w:
            if not mask[yy, xx]:
                xx += 1
                continue
            color = tuple(int(v) for v in crop[yy, xx])
            start = xx
            xx += 1
            while xx < w and mask[yy, xx] and tuple(int(v) for v in crop[yy, xx]) == color:
                xx += 1
            groups[color].append((start, yy, xx - start))
    return groups


def path_from_runs(runs):
    return " ".join(f"M{x} {y}h{w}v1h-{w}z" for x, y, w in runs)


def object_svg(arr, obj):
    crop, mask = region_mask(arr, obj["box"], obj.get("threshold", 9))
    groups = runs_by_color(crop, mask)
    paths = [f'<g id="{obj["id"]}" transform="translate({obj["tx"]} {obj["ty"]})">']
    for color, runs in sorted(groups.items()):
        fill = "#{:02X}{:02X}{:02X}".format(*color)
        paths.append(f'<path fill="{fill}" d="{path_from_runs(runs)}"/>')
    paths.append("</g>")
    return "\n".join(paths), crop, mask


def write_svg(path, width, height, objects, arr):
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<title>YICHUANG vector trace from logo终版.png</title>',
    ]
    for obj in objects:
        svg, _, _ = object_svg(arr, obj)
        parts.append(svg)
    parts.append("</svg>")
    path.write_text("\n".join(parts), encoding="utf-8")


def composite_png(path, width, height, objects, arr, bg=None):
    base = Image.new("RGBA", (width, height), bg if bg else (0, 0, 0, 0))
    for obj in objects:
        crop, mask = region_mask(arr, obj["box"], obj.get("threshold", 9))
        rgba = np.zeros((mask.shape[0], mask.shape[1], 4), dtype=np.uint8)
        rgba[:, :, :3] = crop
        rgba[:, :, 3] = mask.astype(np.uint8) * 255
        layer = Image.fromarray(rgba, "RGBA")
        base.alpha_composite(layer, (obj["tx"], obj["ty"]))
    base.save(path)


def main():
    ensure_dirs()
    img = Image.open(SRC).convert("RGB")
    arr = np.array(img)

    # Source boxes are measured in the original 1310 x 1201 reference image.
    # tx/ty positions preserve source-relative spacing inside each output viewBox.
    logo_origin = (452, 76)
    logo_objects = [
        {"id": "object-01-logo-cn", "box": (488, 86, 315, 139), "tx": 488 - logo_origin[0], "ty": 86 - logo_origin[1], "threshold": 8},
        {"id": "object-02-yi-chuang", "box": (462, 261, 367, 23), "tx": 462 - logo_origin[0], "ty": 261 - logo_origin[1], "threshold": 8},
    ]
    write_svg(LOGO_DIR / "logo.svg", 386, 218, logo_objects, arr)
    composite_png(LOGO_DIR / "transparent.png", 386, 218, logo_objects, arr)
    composite_png(LOGO_DIR / "logo.png", 386, 218, logo_objects, arr, bg=(247, 248, 248, 255))

    header_origin = (371, 76)
    header_objects = [
        {"id": "object-01-logo-cn", "box": (488, 86, 315, 139), "tx": 488 - header_origin[0], "ty": 86 - header_origin[1], "threshold": 8},
        {"id": "object-02-yi-chuang", "box": (462, 261, 367, 23), "tx": 462 - header_origin[0], "ty": 261 - header_origin[1], "threshold": 8},
        {"id": "object-04-heat-icon", "box": (381, 344, 51, 51), "tx": 381 - header_origin[0], "ty": 344 - header_origin[1], "threshold": 7},
        {"id": "object-05-privacy-icon", "box": (589, 345, 45, 51), "tx": 589 - header_origin[0], "ty": 345 - header_origin[1], "threshold": 7},
        {"id": "object-06-energy-icon", "box": (792, 350, 51, 44), "tx": 792 - header_origin[0], "ty": 350 - header_origin[1], "threshold": 7},
        {"id": "object-07-service-text", "box": (457, 474, 174, 22), "tx": 457 - header_origin[0], "ty": 474 - header_origin[1], "threshold": 8},
        {"id": "object-08-quality-text", "box": (668, 474, 173, 22), "tx": 668 - header_origin[0], "ty": 474 - header_origin[1], "threshold": 8},
    ]
    write_svg(OUTPUT_DIR / "header.svg", 482, 430, header_objects, arr)


if __name__ == "__main__":
    main()
