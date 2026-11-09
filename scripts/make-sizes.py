"""Kisebb, reszponzív képváltozatok generálása az images/ mappa képeiből.

Az eredeti fájlokat NEM módosítja, csak új fájlokat ír az images/sizes/ mappába.
Futtatás (Pillow kell hozzá):  python3 scripts/make-sizes.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "images"
OUT = SRC / "sizes"
WIDTHS = (640, 1200, 1800)
QUALITY = 80

OUT.mkdir(exist_ok=True)
for jpg in sorted(SRC.glob("*.jpg")):
    with Image.open(jpg) as im:
        im = im.convert("RGB")
        for w in WIDTHS:
            if w >= im.width:
                continue
            h = round(im.height * w / im.width)
            small = im.resize((w, h), Image.LANCZOS)
            small.save(OUT / f"{jpg.stem}-{w}.jpg", "JPEG", quality=QUALITY, optimize=True, progressive=True)
            small.save(OUT / f"{jpg.stem}-{w}.webp", "WEBP", quality=QUALITY, method=6)
    print("kész:", jpg.name)
