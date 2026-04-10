"""Generate PWA icons: bg #0f130a, centered bold 한글 '기', color #8fbc44."""
from __future__ import annotations

import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIRS = [
    os.path.join(ROOT, "icons"),
    os.path.join(ROOT, "public", "icons"),
]
BG = "#0f130a"
FG = "#8fbc44"
TEXT = "기"
SIZES = (72, 96, 128, 144, 152, 192, 384, 512)

# Windows Korean bold
FONT_CANDIDATES = (
    os.path.join(os.environ.get("WINDIR", "C:\\Windows"), "Fonts", "malgunbd.ttf"),
    os.path.join(os.environ.get("WINDIR", "C:\\Windows"), "Fonts", "malgun.ttf"),
)


def main() -> None:
    font_path = next((p for p in FONT_CANDIDATES if os.path.isfile(p)), None)
    for d in OUT_DIRS:
        os.makedirs(d, exist_ok=True)

    for size in SIZES:
        img = Image.new("RGB", (size, size), BG)
        draw = ImageDraw.Draw(img)
        font_size = max(12, int(size * 0.52))
        font = None
        if font_path:
            try:
                font = ImageFont.truetype(font_path, font_size)
            except OSError:
                font = None
        if font is None:
            font = ImageFont.load_default()

        draw.text((size / 2, size / 2), TEXT, fill=FG, font=font, anchor="mm")

        for d in OUT_DIRS:
            path = os.path.join(d, f"icon-{size}.png")
            img.save(path, "PNG")
            print("wrote", path)


if __name__ == "__main__":
    main()
