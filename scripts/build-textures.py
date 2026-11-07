"""
Build offline planet textures from NASA tile services (run once, with internet).

  Moon  : LRO LROC WAC global mosaic (NASA Solar System Treks, Moon Trek WMTS)
  Mars  : Viking MDIM 2.1 colour mosaic (NASA Solar System Treks, Mars Trek WMTS)
  Earth : Blue Marble Next Generation (NASA GIBS, EPSG:4326 WMTS)

Each texture is a full equirectangular (plate carree) image covering -180..180 longitude and
90..-90 latitude, so it can wrap a Three.js sphere or sit under a lat/lon map directly.

Output: src/assets/textures/<body>_4k.webp (4096x2048) and <body>_2k.webp (2048x1024).
Downloaded tiles are cached in .tile-cache/ (gitignored) so a re-run is free.

Usage:  python scripts/build-textures.py            (needs Pillow: pip install pillow)
"""
import io
import os
import sys
import time
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, ".tile-cache")
OUT = os.path.join(ROOT, "src", "assets", "textures")

SOURCES = {
    "moon": {
        "url": "https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{row}/{col}.jpg",
        "z": 3, "cols": 16, "rows": 8, "tile": 256,
    },
    "mars": {
        "url": "https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{row}/{col}.jpg",
        "z": 3, "cols": 16, "rows": 8, "tile": 256,
    },
    "earth": {
        "url": "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_NextGeneration/default/500m/{z}/{row}/{col}.jpeg",
        "z": 3, "cols": 10, "rows": 5, "tile": 512,
    },
}


def fetch(url: str, cache_path: str) -> bytes:
    if os.path.exists(cache_path):
        with open(cache_path, "rb") as f:
            return f.read()
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "abandoned-not-forgotten/0.3"})
            data = urllib.request.urlopen(req, timeout=60).read()
            os.makedirs(os.path.dirname(cache_path), exist_ok=True)
            with open(cache_path, "wb") as f:
                f.write(data)
            return data
        except Exception as exc:  # network hiccup: back off and retry
            if attempt == 3:
                raise
            print(f"  retry {url}: {exc}")
            time.sleep(2 * (attempt + 1))
    raise RuntimeError("unreachable")


def build(body: str, cfg: dict) -> None:
    size = cfg["tile"]
    canvas = Image.new("RGB", (cfg["cols"] * size, cfg["rows"] * size))
    for row in range(cfg["rows"]):
        for col in range(cfg["cols"]):
            url = cfg["url"].format(z=cfg["z"], row=row, col=col)
            cached = os.path.join(CACHE, body, str(cfg["z"]), f"{row}_{col}.img")
            tile = Image.open(io.BytesIO(fetch(url, cached))).convert("RGB")
            canvas.paste(tile, (col * size, row * size))
        print(f"  {body}: row {row + 1}/{cfg['rows']}")
    os.makedirs(OUT, exist_ok=True)
    for label, width in (("4k", 4096), ("2k", 2048)):
        img = canvas.resize((width, width // 2), Image.LANCZOS)
        path = os.path.join(OUT, f"{body}_{label}.webp")
        img.save(path, "WEBP", quality=80, method=6)
        print(f"  wrote {os.path.relpath(path, ROOT)} ({os.path.getsize(path) // 1024} KB)")


if __name__ == "__main__":
    bodies = sys.argv[1:] or list(SOURCES)
    for name in bodies:
        print(f"Building {name} texture")
        build(name, SOURCES[name])
