#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Remove specific payment ratios (30% / 70% / against copy of B/L) from public copy.

Payment METHODS are kept (they build buyer trust); the commercial TERMS
(deposit ratio, balance trigger) are no longer published — they are agreed
per order instead.
"""
import json, os

SITE = "/Users/yiyi/Desktop/shenghanindustrial-site"
MSG = os.path.join(SITE, "messages")

# tradeTerms.quoteDesc — keep currency + validity, drop the payment schedule
QUOTE = {
    "en": "Quotes are issued in USD (CNY available on request) and remain valid for 30 days. Deposit and balance terms are agreed per order.",
    "zh": "报价以美元出具（可按需提供人民币价），有效期 30 天。定金与尾款条件按订单商定。",
    "es": "Cotizamos en USD (CNY a pedido) y las ofertas son válidas por 30 días. El anticipo y el saldo se acuerdan por pedido.",
    "th": "เสนอราคาเป็นสกุลเงินดอลลาร์สหรัฐ (มีหยวนเมื่อร้องขอ) และมีอายุ 30 วัน เงื่อนไขมัดจำและส่วนที่เหลือตกลงตามแต่ละคำสั่งซื้อ",
    "fr": "Les devis sont établis en USD (CNY sur demande) et restent valables 30 jours. L'acompte et le solde sont convenus commande par commande.",
    "ms": "Sebut harga dikeluarkan dalam USD (CNY atas permintaan) dan sah selama 30 hari. Terma deposit dan baki dipersetujui mengikut pesanan.",
}

# contact.faq.a5 — list the methods, drop the ratios
A5 = {
    "en": "We accept T/T bank transfer and L/C at sight. Trade Assurance / escrow is available for first-time buyers, and PayPal or Western Union for samples and small amounts. Deposit and balance terms are agreed per order.",
    "zh": "我们接受电汇 T/T 与即期信用证（L/C at sight）。首次合作可用 Trade Assurance / 第三方担保，样品及小额款项可用 PayPal 或西联汇款。定金与尾款条件按订单商定。",
    "es": "Aceptamos transferencia bancaria T/T y L/C a la vista. Trade Assurance / depósito en garantía disponible para nuevos compradores, y PayPal o Western Union para muestras e importes pequeños. El anticipo y el saldo se acuerdan por pedido.",
    "th": "เรารับโอนเงินผ่านธนาคาร T/T และ L/C ที่เห็น สำหรับผู้ซื้อครั้งแรกมี Trade Assurance / escrow และสำหรับตัวอย่างหรือจำนวนเงินเล็กน้อยใช้ PayPal หรือ Western Union ได้ เงื่อนไขมัดจำและส่วนที่เหลือตกลงตามแต่ละคำสั่งซื้อ",
    "fr": "Nous acceptons le virement bancaire T/T et la L/C à vue. Trade Assurance / séquestre disponible pour les nouveaux acheteurs, et PayPal ou Western Union pour les échantillons et petits montants. L'acompte et le solde sont convenus commande par commande.",
    "ms": "Kami menerima pindahan bank T/T dan L/C pada pandangan. Trade Assurance / escrow tersedia untuk pembeli kali pertama, dan PayPal atau Western Union untuk sampel serta jumlah kecil. Terma deposit dan baki dipersetujui mengikut pesanan.",
}

for lang in ["en", "zh", "es", "th", "fr", "ms"]:
    path = os.path.join(MSG, f"{lang}.json")
    d = json.load(open(path, encoding="utf-8"))
    changed = []
    if "tradeTerms" in d and "quoteDesc" in d["tradeTerms"]:
        d["tradeTerms"]["quoteDesc"] = QUOTE[lang]
        changed.append("tradeTerms.quoteDesc")
    if "contact" in d and "faq" in d["contact"] and "a5" in d["contact"]["faq"]:
        d["contact"]["faq"]["a5"] = A5[lang]
        changed.append("contact.faq.a5")
    json.dump(d, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"{lang}.json: {changed}")
