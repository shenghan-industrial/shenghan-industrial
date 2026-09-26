import xlrd, os, re, json

XLS = '/Users/yiyi/Desktop/副本小国乐(1).xls'
ROOT = '/Users/yiyi/Desktop/新建文件夹_EN 5'

book = xlrd.open_workbook(XLS)
sh = book.sheet_by_index(0)

def cellstr(v):
    if isinstance(v, float):
        if v == int(v):
            return str(int(v))
        return str(v)
    return str(v).strip()

rows = []
for r in range(2, sh.nrows):
    name = cellstr(sh.cell_value(r, 1)).strip()
    if not name:
        continue
    bc = cellstr(sh.cell_value(r, 2)).strip()
    spec = cellstr(sh.cell_value(r, 3)).strip()
    rows.append({'name': name, 'barcode': bc, 'spec': spec})

print('excel products:', len(rows))
print('--- rows 69..end (previously truncated) ---')
for i, x in enumerate(rows):
    if i >= 68:
        print('  %2d | %s | %s | %s' % (i + 1, x['name'], x['barcode'], x['spec']))

folders = sorted([d for d in os.listdir(ROOT) if os.path.isdir(os.path.join(ROOT, d))])
print()
print('image folders:', len(folders))

def model(s):
    m = re.search(r'\d{4}', s)
    return m.group(0) if m else None

fmap = {}
for f in folders:
    fmap.setdefault(model(f), []).append(f)
emat = {}
for x in rows:
    emat.setdefault(model(x['name']), []).append(x)

# duplicate model check
dupf = {k: v for k, v in fmap.items() if len(v) > 1}
dupe = {k: v for k, v in emat.items() if len(v) > 1}
print('duplicate models in folders:', dupf)
print('duplicate models in excel:', {k: [y['name'] for y in v] for k, v in dupe.items()})

matched = []
unmatched_folders = []
for f in folders:
    mm = model(f)
    if mm is not None and mm in emat:
        matched.append((f, emat[mm][0]))
    else:
        unmatched_folders.append(f)

noimg = []
for x in rows:
    mm = model(x['name'])
    if mm is None or mm not in fmap:
        noimg.append(x)

print()
print('=== MATCH SUMMARY ===')
print('matched (folder<->excel):', len(matched))
print('folders with NO excel row:', len(unmatched_folders))
for f in unmatched_folders:
    print('   UNMATCHED-FOLDER:', f)
print('excel products with NO folder:', len(noimg))
for x in noimg:
    print('   NO-IMAGE:', x['name'], '|', x['barcode'], '|', x['spec'])

# save mapping for later use
out = []
for f, x in matched:
    imgs = sorted([q for q in os.listdir(os.path.join(ROOT, f)) if q.lower().endswith('.jpg')])
    out.append({
        'folder': f,
        'zh_name': x['name'],
        'barcode': x['barcode'],
        'spec': x['spec'],
        'model': model(f),
        'images': imgs,
    })
json.dump({'matched': out, 'noimg': noimg, 'unmatched_folders': unmatched_folders,
           'excel_total': len(rows), 'folder_total': len(folders)},
          open('/tmp/zipwork/xls_match.json', 'w', encoding='utf-8'),
          ensure_ascii=False, indent=1)
print()
print('saved -> /tmp/zipwork/xls_match.json')
print('sample matched:')
for o in out[:5]:
    print('  ', o['folder'], '-> zh:', o['zh_name'], '| bc:', o['barcode'], '| imgs:', len(o['images']))
