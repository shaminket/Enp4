import os

BASE_URL = "https://shaminket.com"

# Importar el diccionario
import sys
sys.path.append(os.path.expanduser("~/enp4"))

from seo_catalog_data import seo_catalog

print(f"Total entradas a evaluar: {len(seo_catalog)}")

errors = []
for key, data in seo_catalog.items():
    title = data["title"]
    desc = data["desc"]
    canonical = data["canonical"]
    keywords = [k.strip() for k in data["keywords"].split(",")]

    # 1. Title <= 60 chars
    if len(title) > 60:
        errors.append(f"[{key}] Title > 60 chars ({len(title)}): {title}")
    if "| shaminket" not in title:
        errors.append(f"[{key}] Title missing '| shaminket': {title}")

    # 2. Desc entre 140 y 155 chars
    if not (140 <= len(desc) <= 155):
        errors.append(f"[{key}] Desc fuera de rango 140-155 ({len(desc)}): {desc}")

    desc_lower = desc.lower()
    for req in ["prepa 4", "unam", "shaminket"]:
        if req not in desc_lower:
            errors.append(f"[{key}] Desc missing '{req}': {desc}")

    # 3. Canonical
    if not canonical.startswith("https://shaminket.com"):
        errors.append(f"[{key}] Canonical invalid: {canonical}")

    # 4. Keywords 6 to 8
    if not (6 <= len(keywords) <= 8):
        errors.append(f"[{key}] Keywords count out of 6-8 ({len(keywords)}): {keywords}")

if errors:
    print(f"Se encontraron {len(errors)} discrepancias:")
    for e in errors:
        print(" -", e)
else:
    print("✓ Todos los títulos (<= 60), descripciones (140-155), canonicals y keywords son 100% conformes.")
