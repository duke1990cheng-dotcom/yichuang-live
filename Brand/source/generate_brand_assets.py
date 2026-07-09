from pathlib import Path
from math import cos, sin, pi

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[2]
LOGO = ROOT / "Logo"
ICON = ROOT / "Icon"
GUIDE = ROOT / "Guideline"
BRAND = ROOT / "Brand"
OUTPUT = ROOT / "Output"

for folder in [LOGO, ICON, GUIDE, BRAND, OUTPUT, OUTPUT / "png", OUTPUT / "pdf", GUIDE / "png"]:
    folder.mkdir(parents=True, exist_ok=True)


COLORS = {
    "ink": "#30383C",
    "black": "#111111",
    "white": "#FFFFFF",
    "paper": "#F7F7F5",
    "mist": "#E8ECEE",
    "line": "#CBD3D7",
    "gold": "#C9975B",
    "blue": "#7D94AA",
    "sage": "#84917E",
    "soft_ink": "#687176",
}

FONT_CN = "/System/Library/Fonts/PingFang.ttc"
FONT_CN_ALT = "/System/Library/Fonts/STHeiti Medium.ttc"
FONT_EN = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_EN_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
pdfmetrics.registerFont(TTFont("BrandEN", FONT_EN))
pdfmetrics.registerFont(TTFont("BrandENBold", FONT_EN_BOLD))


def hex_to_rgb(value):
    value = value.lstrip("#")
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))


def svg_header(width, height, bg=None):
    bg_rect = f'<rect width="{width}" height="{height}" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">{bg_rect}'


def logo_mark_svg(x, y, s=1, color=COLORS["ink"]):
    def r(px, py, w, h, rx=0):
        return f'<rect x="{x + px*s:.2f}" y="{y + py*s:.2f}" width="{w*s:.2f}" height="{h*s:.2f}" rx="{rx*s:.2f}" fill="{color}"/>'

    def p(points):
        pts = " ".join(f"{x + px*s:.2f},{y + py*s:.2f}" for px, py in points)
        return f'<polygon points="{pts}" fill="{color}"/>'

    parts = []
    # Left character: "一"
    parts.append(r(4, 94, 156, 17, 1))
    # Right character: custom geometric "窗"
    parts.append(p([(344, 10), (363, 5), (374, 29), (354, 34)]))
    parts.append(r(242, 26, 156, 21, 1))
    parts.append(r(242, 26, 16, 43, 0))
    parts.append(r(382, 26, 16, 43, 0))
    parts.append(p([(248, 72), (340, 39), (372, 52), (278, 86)]))
    parts.append(p([(286, 95), (330, 72), (370, 93), (323, 116)]))
    parts.append(r(267, 91, 18, 104, 0))
    parts.append(r(375, 91, 18, 104, 0))
    parts.append(r(267, 177, 126, 18, 0))
    parts.append(p([(289, 127), (329, 101), (368, 121), (327, 145)]))
    parts.append(p([(302, 159), (330, 141), (354, 154), (326, 172)]))
    parts.append(r(315, 104, 18, 70, 0))
    return "\n".join(parts)


def logo_svg(path, color=COLORS["ink"], bg=None):
    width, height = 720, 420
    content = [svg_header(width, height, bg)]
    content.append(f'<g transform="translate(80 42)">{logo_mark_svg(0, 0, 1.18, color)}</g>')
    content.append(
        f'<text x="360" y="325" text-anchor="middle" fill="{color}" '
        f'font-family="Avenir Next, Helvetica Neue, Arial, sans-serif" font-size="31" '
        f'font-weight="400" letter-spacing="24">YI CHUANG</text>'
    )
    content.append("</svg>")
    path.write_text("\n".join(content), encoding="utf-8")


def icon_svg(kind, path, stroke):
    width = height = 120
    sw = 2
    common = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}"><g fill="none" stroke="{stroke}" '
        f'stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">'
    )
    if kind == "heat":
        body = [
            '<circle cx="60" cy="60" r="16"/>',
            '<path d="M60 22v16M60 82v16M22 60h16M82 60h16"/>',
            '<path d="M33 33l11 11M76 76l11 11M87 33L76 44M44 76L33 87"/>',
        ]
    elif kind == "privacy":
        body = [
            '<path d="M60 17l34 13v25c0 24-14 40-34 49-20-9-34-25-34-49V30l34-13z"/>',
            '<rect x="48" y="55" width="24" height="24" rx="4"/>',
            '<path d="M52 55v-8c0-5 3-10 8-10s8 5 8 10v8"/>',
            '<path d="M60 65v7"/>',
        ]
    else:
        body = [
            '<path d="M30 73c33-1 51-18 62-50-32 2-55 17-62 50z"/>',
            '<path d="M27 88c18-26 36-41 63-58"/>',
            '<path d="M44 70c-10-5-17-13-20-24"/>',
        ]
    path.write_text(common + "\n".join(body) + "</g></svg>", encoding="utf-8")


def header_svg(path):
    width, height = 1200, 560
    svg = [svg_header(width, height, COLORS["paper"])]
    svg.append(f'<g transform="translate(345 58)">{logo_mark_svg(0, 0, 1.23, COLORS["ink"])}</g>')
    svg.append(
        f'<text x="600" y="348" text-anchor="middle" fill="{COLORS["ink"]}" '
        f'font-family="Avenir Next, Helvetica Neue, Arial, sans-serif" font-size="28" '
        f'letter-spacing="25">YI CHUANG</text>'
    )
    svg.append(f'<line x1="390" y1="382" x2="810" y2="382" stroke="{COLORS["blue"]}" stroke-width="1.6"/>')
    positions = [(425, "heat", "隔热", "阻隔热量", COLORS["gold"]),
                 (600, "privacy", "隐私", "保护隐私", COLORS["blue"]),
                 (775, "energy", "节能", "节能降耗", COLORS["sage"])]
    for cx, kind, title, sub, col in positions:
        temp = ICON / f"_{kind}.svg"
        icon_svg(kind, temp, col)
        inner = temp.read_text(encoding="utf-8").split(">", 1)[1].rsplit("</svg>", 1)[0]
        svg.append(f'<g transform="translate({cx-30} 410) scale(0.5)">{inner}</g>')
        svg.append(f'<text x="{cx+45}" y="443" fill="{COLORS["ink"]}" font-family="PingFang SC, Helvetica Neue, Arial" font-size="25" font-weight="500">{title}</text>')
        svg.append(f'<text x="{cx+45}" y="477" fill="{COLORS["soft_ink"]}" font-family="PingFang SC, Helvetica Neue, Arial" font-size="15">{sub}</text>')
    svg.append(f'<line x1="512" y1="418" x2="512" y2="475" stroke="{COLORS["gold"]}" stroke-width="1"/>')
    svg.append(f'<line x1="690" y1="418" x2="690" y2="475" stroke="{COLORS["gold"]}" stroke-width="1"/>')
    svg.append(f'<text x="600" y="535" text-anchor="middle" fill="{COLORS["ink"]}" font-family="PingFang SC, Helvetica Neue, Arial" font-size="24" letter-spacing="9">专业窗膜服务 · </text>')
    svg.append(f'<text x="712" y="535" text-anchor="start" fill="{COLORS["gold"]}" font-family="PingFang SC, Helvetica Neue, Arial" font-size="24" letter-spacing="9">提升居住品质</text>')
    svg.append("</svg>")
    path.write_text("\n".join(svg), encoding="utf-8")


def load_font(path, size):
    return ImageFont.truetype(path if Path(path).exists() else FONT_CN_ALT, size)


def draw_logo_mark(draw, x, y, s=1, fill=COLORS["ink"]):
    c = hex_to_rgb(fill) if isinstance(fill, str) else fill

    def rect(px, py, w, h, r=0):
        box = [x + px*s, y + py*s, x + (px+w)*s, y + (py+h)*s]
        if r:
            draw.rounded_rectangle(box, radius=r*s, fill=c)
        else:
            draw.rectangle(box, fill=c)

    def poly(points):
        draw.polygon([(x + px*s, y + py*s) for px, py in points], fill=c)

    rect(4, 94, 156, 17, 1)
    poly([(344, 10), (363, 5), (374, 29), (354, 34)])
    rect(242, 26, 156, 21, 1)
    rect(242, 26, 16, 43)
    rect(382, 26, 16, 43)
    poly([(248, 72), (340, 39), (372, 52), (278, 86)])
    poly([(286, 95), (330, 72), (370, 93), (323, 116)])
    rect(267, 91, 18, 104)
    rect(375, 91, 18, 104)
    rect(267, 177, 126, 18)
    poly([(289, 127), (329, 101), (368, 121), (327, 145)])
    poly([(302, 159), (330, 141), (354, 154), (326, 172)])
    rect(315, 104, 18, 70)


def draw_logo_mark_pdf(c, page_h, x, y, s=1, fill=COLORS["ink"]):
    c.setFillColor(colors.HexColor(fill))

    def yy(py, h=0):
        return page_h - (y + py*s) - h*s

    def rect(px, py, w, h):
        c.rect(x + px*s, yy(py, h), w*s, h*s, stroke=0, fill=1)

    def poly(points):
        p = c.beginPath()
        p.moveTo(x + points[0][0]*s, page_h - (y + points[0][1]*s))
        for px, py in points[1:]:
            p.lineTo(x + px*s, page_h - (y + py*s))
        p.close()
        c.drawPath(p, stroke=0, fill=1)

    rect(4, 94, 156, 17)
    poly([(344, 10), (363, 5), (374, 29), (354, 34)])
    rect(242, 26, 156, 21)
    rect(242, 26, 16, 43)
    rect(382, 26, 16, 43)
    poly([(248, 72), (340, 39), (372, 52), (278, 86)])
    poly([(286, 95), (330, 72), (370, 93), (323, 116)])
    rect(267, 91, 18, 104)
    rect(375, 91, 18, 104)
    rect(267, 177, 126, 18)
    poly([(289, 127), (329, 101), (368, 121), (327, 145)])
    poly([(302, 159), (330, 141), (354, 154), (326, 172)])
    rect(315, 104, 18, 70)


def draw_icon_pdf(c, page_h, x, y, kind, stroke, scale=1):
    c.setStrokeColor(colors.HexColor(stroke))
    c.setLineWidth(2 * scale)
    c.setLineCap(1)
    c.setLineJoin(1)

    def tx(px):
        return x + px * scale

    def ty(py):
        return page_h - (y + py * scale)

    def line(points):
        p = c.beginPath()
        p.moveTo(tx(points[0][0]), ty(points[0][1]))
        for px, py in points[1:]:
            p.lineTo(tx(px), ty(py))
        c.drawPath(p, stroke=1, fill=0)

    if kind == "heat":
        c.circle(tx(60), ty(60), 16*scale, stroke=1, fill=0)
        for pts in [[(60,22),(60,38)],[(60,82),(60,98)],[(22,60),(38,60)],[(82,60),(98,60)],
                    [(33,33),(44,44)],[(76,76),(87,87)],[(87,33),(76,44)],[(44,76),(33,87)]]:
            line(pts)
    elif kind == "privacy":
        line([(60,17),(94,30),(94,55),(90,70),(80,88),(60,104),(40,88),(30,70),(26,55),(26,30),(60,17)])
        c.roundRect(tx(48), ty(79), 24*scale, 24*scale, 4*scale, stroke=1, fill=0)
        line([(52,55),(52,47),(55,39),(60,37),(65,39),(68,47),(68,55)])
        line([(60,65),(60,72)])
    else:
        line([(30,73),(48,70),(67,63),(82,48),(92,23),(69,27),(49,37),(36,53),(30,73)])
        line([(27,88),(42,67),(61,49),(90,30)])
        line([(44,70),(33,62),(24,46)])


def draw_spaced_text(draw, xy, text, font, fill, spacing, anchor="mm"):
    x, y = xy
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + spacing * (len(text) - 1)
    if anchor == "mm":
        x -= total / 2
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=fill, anchor="lm")
        x += w + spacing


def raster_logo(path, transparent=False, white=False, scale=3):
    w, h = 720 * scale, 420 * scale
    bg = (0, 0, 0, 0) if transparent else hex_to_rgb(COLORS["paper"])
    img = Image.new("RGBA", (w, h), bg)
    d = ImageDraw.Draw(img)
    color = COLORS["white"] if white else COLORS["ink"]
    draw_logo_mark(d, 80*scale, 42*scale, 1.18*scale, color)
    font = load_font(FONT_EN, 31 * scale)
    draw_spaced_text(d, (360*scale, 325*scale), "YI CHUANG", font, hex_to_rgb(color), 24*scale)
    img.save(path)


def draw_icon_pil(draw, cx, cy, kind, color, scale=1):
    c = hex_to_rgb(color)
    sw = max(1, int(2 * scale))
    def line(points):
        draw.line([(cx + x*scale, cy + y*scale) for x, y in points], fill=c, width=sw, joint="curve")
    def ellipse(box):
        draw.ellipse([cx+box[0]*scale, cy+box[1]*scale, cx+box[2]*scale, cy+box[3]*scale], outline=c, width=sw)
    if kind == "heat":
        ellipse((44, 44, 76, 76))
        for a in range(0, 360, 45):
            r1, r2 = 24, 40
            line([(60 + cos(a*pi/180)*r1, 60 + sin(a*pi/180)*r1), (60 + cos(a*pi/180)*r2, 60 + sin(a*pi/180)*r2)])
    elif kind == "privacy":
        line([(60,17),(94,30),(94,55),(90,70),(80,88),(60,104),(40,88),(30,70),(26,55),(26,30),(60,17)])
        draw.rounded_rectangle([cx+48*scale, cy+55*scale, cx+72*scale, cy+79*scale], radius=4*scale, outline=c, width=sw)
        line([(52,55),(52,47),(55,39),(60,37),(65,39),(68,47),(68,55)])
        line([(60,65),(60,72)])
    else:
        line([(30,73),(48,70),(67,63),(82,48),(92,23),(69,27),(49,37),(36,53),(30,73)])
        line([(27,88),(42,67),(61,49),(90,30)])
        line([(44,70),(33,62),(24,46)])


def raster_header(path, scale=2):
    w, h = 1200*scale, 560*scale
    img = Image.new("RGBA", (w, h), hex_to_rgb(COLORS["paper"]))
    d = ImageDraw.Draw(img)
    draw_logo_mark(d, 345*scale, 58*scale, 1.23*scale, COLORS["ink"])
    draw_spaced_text(d, (600*scale, 348*scale), "YI CHUANG", load_font(FONT_EN, 28*scale), hex_to_rgb(COLORS["ink"]), 25*scale)
    d.line([(390*scale,382*scale),(810*scale,382*scale)], fill=hex_to_rgb(COLORS["blue"]), width=max(1, int(1.6*scale)))
    cn_title = load_font(FONT_CN, 25*scale)
    cn_sub = load_font(FONT_CN, 15*scale)
    for cx, kind, title, sub, col in [(425,"heat","隔热","阻隔热量",COLORS["gold"]), (600,"privacy","隐私","保护隐私",COLORS["blue"]), (775,"energy","节能","节能降耗",COLORS["sage"])]:
        draw_icon_pil(d, (cx-30)*scale, 410*scale, kind, col, 0.5*scale)
        d.text(((cx+45)*scale,443*scale), title, font=cn_title, fill=hex_to_rgb(COLORS["ink"]), anchor="lm")
        d.text(((cx+45)*scale,477*scale), sub, font=cn_sub, fill=hex_to_rgb(COLORS["soft_ink"]), anchor="lm")
    d.line([(512*scale,418*scale),(512*scale,475*scale)], fill=hex_to_rgb(COLORS["gold"]), width=scale)
    d.line([(690*scale,418*scale),(690*scale,475*scale)], fill=hex_to_rgb(COLORS["gold"]), width=scale)
    tag_font = load_font(FONT_CN, 24*scale)
    draw_spaced_text(d, (600*scale, 535*scale), "专业窗膜服务 · ", tag_font, hex_to_rgb(COLORS["ink"]), 9*scale)
    d.text((712*scale,535*scale), "提升居住品质", font=tag_font, fill=hex_to_rgb(COLORS["gold"]), anchor="lm", spacing=9*scale)
    img.save(path)


def make_logo_pdf(path):
    c = canvas.Canvas(str(path), pagesize=(720, 420))
    c.setFillColor(colors.HexColor(COLORS["paper"]))
    c.rect(0, 0, 720, 420, stroke=0, fill=1)
    draw_logo_mark_pdf(c, 420, 80, 42, 1.18, COLORS["ink"])
    c.setFillColor(colors.HexColor(COLORS["ink"]))
    c.setFont("BrandEN", 31)
    c.drawCentredString(360, 92, "Y  I     C  H  U  A  N  G")
    c.save()


def make_header_pdf(path):
    c = canvas.Canvas(str(path), pagesize=(1200, 560))
    c.drawImage(ImageReader(str(OUTPUT / "png" / "header.png")), 0, 0, width=1200, height=560)
    c.save()


def swatch_svg():
    w, h = 1000, 560
    names = [("Ink", "ink"), ("Warm Gold", "gold"), ("Privacy Blue", "blue"), ("Energy Sage", "sage"), ("Mist", "mist"), ("Paper", "paper")]
    out = [svg_header(w, h, COLORS["paper"])]
    out.append(f'<text x="60" y="78" fill="{COLORS["ink"]}" font-family="Arial" font-size="34" letter-spacing="4">BRAND COLOR</text>')
    for i, (label, key) in enumerate(names):
        x = 60 + (i % 3) * 300
        y = 130 + (i // 3) * 190
        out.append(f'<rect x="{x}" y="{y}" width="230" height="95" rx="2" fill="{COLORS[key]}" stroke="{COLORS["line"]}"/>')
        out.append(f'<text x="{x}" y="{y+130}" fill="{COLORS["ink"]}" font-family="Arial" font-size="20">{label}</text>')
        out.append(f'<text x="{x}" y="{y+158}" fill="{COLORS["soft_ink"]}" font-family="Arial" font-size="17">{COLORS[key]}</text>')
    out.append("</svg>")
    (BRAND / "brand-colors.svg").write_text("\n".join(out), encoding="utf-8")


def make_guideline_pdf():
    pdf = GUIDE / "YICHUANG_Brand_Guideline.pdf"
    W, H = 1600, 1131
    page_paths = []
    title_font = load_font(FONT_EN_BOLD, 64)
    num_font = load_font(FONT_EN, 34)
    sub_font = load_font(FONT_CN, 30)
    small_font = load_font(FONT_EN, 18)
    cn_big = load_font(FONT_CN, 58)
    cn_mid = load_font(FONT_CN, 34)
    en_mid = load_font(FONT_EN, 42)
    pages = [
        ("YI CHUANG", "一窗品牌基础识别", LOGO / "transparent.png"),
        ("LOGO", "主标志 / 黑白版本 / 安全空间", LOGO / "logo.png"),
        ("HEADER", "标准品牌头图组合", OUTPUT / "png" / "header.png"),
        ("ICONS", "隔热 / 隐私 / 节能", None),
        ("COLOR", "品牌色彩", None),
        ("TYPOGRAPHY", "中文与英文排版", None),
        ("APPLICATION", "极简、住宅、高级、轻科技", LOGO / "logo终版.png"),
    ]
    for idx, (title, subtitle, image) in enumerate(pages, start=1):
        img = Image.new("RGB", (W, H), hex_to_rgb(COLORS["paper"]))
        d = ImageDraw.Draw(img)
        d.text((84, 82), f"{idx:02d}", font=num_font, fill=hex_to_rgb(COLORS["ink"]))
        d.text((170, 68), title, font=title_font, fill=hex_to_rgb(COLORS["ink"]))
        d.text((172, 143), subtitle, font=sub_font, fill=hex_to_rgb(COLORS["soft_ink"]))
        d.line([(172, 202), (290, 202)], fill=hex_to_rgb(COLORS["gold"]), width=3)
        if title == "ICONS":
            for x, kind, label, col in [(360,"heat","隔热",COLORS["gold"]), (690,"privacy","隐私",COLORS["blue"]), (1020,"energy","节能",COLORS["sage"])]:
                icon_img = Image.new("RGBA", (240, 240), (0,0,0,0))
                draw_icon_pil(ImageDraw.Draw(icon_img), 0, 0, kind, col, 2)
                p = GUIDE / "png" / f"guide-icon-{kind}.png"
                icon_img.save(p)
                img.alpha_composite(icon_img, (x, 410)) if img.mode == "RGBA" else img.paste(icon_img, (x, 410), icon_img)
                tw = d.textlength(label, font=cn_mid)
                d.text((x + 120 - tw / 2, 690), label, font=cn_mid, fill=hex_to_rgb(COLORS["ink"]))
        elif title == "COLOR":
            keys = ["ink", "gold", "blue", "sage", "mist", "paper"]
            labels = ["Ink", "Gold", "Blue", "Sage", "Mist", "Paper"]
            for i, key in enumerate(keys):
                x = 170 + i * 220
                d.rectangle([x, 430, x+150, 580], fill=hex_to_rgb(COLORS[key]), outline=hex_to_rgb(COLORS["line"]))
                d.text((x, 625), labels[i], font=small_font, fill=hex_to_rgb(COLORS["ink"]))
                d.text((x, 655), COLORS[key], font=small_font, fill=hex_to_rgb(COLORS["soft_ink"]))
        elif title == "TYPOGRAPHY":
            d.text((210, 410), "一窗 专业窗膜服务", font=cn_big, fill=hex_to_rgb(COLORS["ink"]))
            d.text((210, 505), "YI CHUANG WINDOW FILM SERVICE", font=en_mid, fill=hex_to_rgb(COLORS["ink"]))
            d.text((210, 605), "中文：PingFang SC / Noto Sans SC / 思源黑体", font=cn_mid, fill=hex_to_rgb(COLORS["soft_ink"]))
            d.text((210, 660), "英文：Avenir Next / Helvetica Neue / Arial", font=cn_mid, fill=hex_to_rgb(COLORS["soft_ink"]))
        elif image:
            placed = Image.open(image).convert("RGBA")
            max_w, max_h = (760, 455) if title != "APPLICATION" else (980, 470)
            placed.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
            img.paste(placed, ((W - placed.width)//2, 345), placed)
        d.text((W-310, H-70), "YICHUANG BRAND GUIDELINE", font=small_font, fill=hex_to_rgb(COLORS["soft_ink"]))
        page_path = GUIDE / "png" / f"guideline-page-{idx}.png"
        img.save(page_path)
        page_paths.append(page_path)
    c = canvas.Canvas(str(pdf), pagesize=landscape(A4))
    PW, PH = landscape(A4)
    for page in page_paths:
        c.drawImage(ImageReader(str(page)), 0, 0, width=PW, height=PH)
        c.showPage()
    c.save()
    return pdf


def write_docs():
    (BRAND / "brand-colors.md").write_text(
        "# Brand Color\n\n"
        f"- Ink: `{COLORS['ink']}`\n"
        f"- Warm Gold: `{COLORS['gold']}`\n"
        f"- Privacy Blue: `{COLORS['blue']}`\n"
        f"- Energy Sage: `{COLORS['sage']}`\n"
        f"- Mist Line: `{COLORS['line']}`\n"
        f"- Paper White: `{COLORS['paper']}`\n",
        encoding="utf-8",
    )
    (BRAND / "typography.md").write_text(
        "# Typography\n\n"
        "中文字体：PingFang SC / Noto Sans SC / 思源黑体。\n\n"
        "英文字体：Avenir Next / Helvetica Neue / Arial。\n\n"
        "字号建议：Logo 英文 31px；Header 中文主标签 25px；辅助文字 15px；品牌口号 24px；规范标题 34px。\n\n"
        "字重建议：Logo 400；中文标题 500；正文 300-400；强调文字 500。\n",
        encoding="utf-8",
    )


def main():
    logo_svg(LOGO / "logo.svg", COLORS["ink"], None)
    logo_svg(LOGO / "logo-black.svg", COLORS["black"], None)
    logo_svg(LOGO / "logo-white.svg", COLORS["white"], None)
    raster_logo(LOGO / "logo.png", transparent=False)
    raster_logo(LOGO / "transparent.png", transparent=True)
    raster_logo(LOGO / "logo-white-preview.png", transparent=False, white=True)
    for kind, name, color in [("heat", "heat-insulation", COLORS["gold"]), ("privacy", "privacy", COLORS["blue"]), ("energy", "energy-saving", COLORS["sage"])]:
        icon_svg(kind, ICON / f"{name}.svg", color)
    header_svg(OUTPUT / "header.svg")
    raster_header(OUTPUT / "png" / "header.png")
    make_logo_pdf(LOGO / "logo.pdf")
    make_header_pdf(OUTPUT / "pdf" / "header.pdf")
    swatch_svg()
    write_docs()
    guide_pdf = make_guideline_pdf()
    for temp in ICON.glob("_*.svg"):
        temp.unlink()
    # Copy headline files into requested folder names as well.
    (OUTPUT / "header.png").write_bytes((OUTPUT / "png" / "header.png").read_bytes())
    (OUTPUT / "header.pdf").write_bytes((OUTPUT / "pdf" / "header.pdf").read_bytes())
    return guide_pdf


if __name__ == "__main__":
    print(main())
