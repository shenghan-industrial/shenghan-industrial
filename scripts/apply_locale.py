#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Apply a flat dotted-key translation map onto a copy of messages/en.json.

Usage:
    python3 scripts/apply_locale.py fr        # uses scripts/trans_fr.py
    python3 scripts/apply_locale.py ms        # uses scripts/trans_ms.py

Values may be str, list[str] (string arrays) or list[dict] (object arrays).
Any key absent from the map stays English (the UI falls back to English).
"""
import json, os, copy, importlib.util, sys

SITE = "/Users/yiyi/Desktop/shenghanindustrial-site"
MSG = os.path.join(SITE, "messages")


def set_path(obj, dotted, value):
    keys = dotted.split(".")
    cur = obj
    for k in keys[:-1]:
        if k not in cur or not isinstance(cur[k], dict):
            return False
        cur = cur[k]
    if keys[-1] not in cur:
        return False
    cur[keys[-1]] = value
    return True


def leaves(o, pre=""):
    for k, v in o.items():
        p = f"{pre}.{k}" if pre else k
        if isinstance(v, dict):
            yield from leaves(v, p)
        elif isinstance(v, list):
            for i, it in enumerate(v):
                if isinstance(it, dict):
                    yield from leaves(it, f"{p}[{i}]")
                else:
                    yield p + f"[{i}]", it
        else:
            yield p, v


def build(lang, T):
    en = json.load(open(os.path.join(MSG, "en.json"), encoding="utf-8"))
    out = copy.deepcopy(en)

    applied = missing = 0
    for k, v in T.items():
        if set_path(out, k, v):
            applied += 1
        else:
            missing += 1
            print("  UNKNOWN KEY:", k)

    path = os.path.join(MSG, f"{lang}.json")
    json.dump(out, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

    en_map = dict(leaves(en))
    out_map = dict(leaves(out))
    same = [k for k, v in out_map.items()
            if en_map.get(k) == v and isinstance(v, str) and len(v) > 1]

    def allkeys(o, pre=""):
        for k, v in o.items():
            p = f"{pre}.{k}" if pre else k
            if isinstance(v, dict):
                yield from allkeys(v, p)
            elif isinstance(v, list):
                yield p
            else:
                yield p
    notrans = [k for k in allkeys(en) if k not in T]

    print(f"\n[{lang}] applied={applied} unknown={missing} "
          f"identical-to-English={len(same)} untranslated={len(notrans)}")
    if notrans:
        print("  untranslated:", notrans[:20])
    print("  written ->", path)


if __name__ == "__main__":
    lang = sys.argv[1]
    spec = importlib.util.spec_from_file_location(
        f"trans_{lang}", os.path.join(SITE, "scripts", f"trans_{lang}.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    build(lang, mod.T)
