#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Regenerate the 65 broken (2-byte) English product images from valid originals
and write them back into the desktop EN 5 folder (backing up the broken ones)."""
import os, sys, shutil
from pathlib import Path

sys.path.insert(0, '/tmp/zipwork')
os.chdir('/tmp/zipwork')

import redraw  # loads OCR at import; main() is guarded

EN = Path('/Users/yiyi/Desktop/新建文件夹_EN 5')
SRC_ROOT = Path('src/新建文件夹')
REGEN = Path('/tmp/zipwork/regen')
BACKUP = Path('/tmp/zipwork/broken_backup')
REGEN.mkdir(exist_ok=True)
BACKUP.mkdir(exist_ok=True)

# 1. collect broken files
broken = []
for d in sorted(os.listdir(EN)):
    fp = EN / d
    if not fp.is_dir():
        continue
    for f in sorted(os.listdir(fp)):
        if f.lower().endswith('.jpg'):
            p = fp / f
            if p.stat().st_size < 2048:
                broken.append((d, f, p))

print('broken files to regenerate:', len(broken))

ok, stillbad, nosrc = 0, [], []
for d, f, p in broken:
    src = SRC_ROOT / d / f
    if not src.exists():
        nosrc.append((d, f))
        continue
    # backup the broken file
    bdir = BACKUP / d
    bdir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(p, bdir / f)
    # regenerate into regen/
    out = REGEN / d / f
    out.parent.mkdir(parents=True, exist_ok=True)
    try:
        redraw.process_image(src, out)
    except Exception as e:
        print('  ERROR', d, f, e)
        stillbad.append((d, f, 'exception: %s' % e))
        continue
    if not out.exists() or out.stat().st_size < 2048:
        stillbad.append((d, f, 'still small: %s' % (out.stat().st_size if out.exists() else 'missing')))
        continue
    # write back over the broken file
    shutil.copy2(out, p)
    ok += 1

print()
print('regenerated & written back :', ok)
print('no source original         :', len(nosrc))
print('still broken               :', len(stillbad))
for x in stillbad[:15]:
    print('   ', x)
for x in nosrc[:10]:
    print('   NOSRC', x)

# 2. verify no broken remain
remain = []
for d in sorted(os.listdir(EN)):
    fp = EN / d
    if not fp.is_dir():
        continue
    for f in sorted(os.listdir(fp)):
        if f.lower().endswith('.jpg'):
            if (fp / f).stat().st_size < 2048:
                remain.append((d, f))
print()
print('remaining broken files in EN 5:', len(remain))
for x in remain[:20]:
    print('   ', x)

# 3. folder-level validity
novalid = []
for d in sorted(os.listdir(EN)):
    fp = EN / d
    if not fp.is_dir():
        continue
    v = sum(1 for f in os.listdir(fp) if f.lower().endswith('.jpg')
            and (fp / f).stat().st_size >= 2048)
    if v == 0:
        novalid.append(d)
print('folders with ZERO valid images now:', len(novalid))
for d in novalid:
    print('   ', d)
