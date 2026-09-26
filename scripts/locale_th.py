#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Thai (th) translations for the DEXOREN site.

Flat dotted-key map. Values may be:
  - str            -> replaces a string leaf
  - list[str]      -> replaces a string array (e.g. factory.features)
  - list[dict]     -> replaces an object array (e.g. about.timeline)

Run:  python3 scripts/locale_th.py
Writes: messages/th.json  (starting from en.json so no key is ever lost)
"""
import json, os, copy

SITE = "/Users/yiyi/Desktop/shenghanindustrial-site"
MSG = os.path.join(SITE, "messages")

T = {
    # ── nav ──
    "nav.home": "หน้าแรก",
    "nav.products": "สินค้า",
    "nav.productCategories": "หมวดหมู่ทั้งหมด",
    "nav.services": "บริการ",
    "nav.newArrivals": "สินค้าใหม่",
    "nav.flashDeals": "ลดราคาพิเศษ",
    "nav.promotions": "โปรโมชัน",
    "nav.rankings": "อันดับขายดี",
    "nav.certifications": "ใบรับรองมาตรฐาน",
    "nav.tradeTerms": "เงื่อนไขการค้า",
    "nav.faq": "คำถามที่พบบ่อย",
    "nav.about": "เกี่ยวกับเรา",
    "nav.contact": "ติดต่อเรา",
    "nav.call": "WhatsApp",

    # ── hero ──
    "hero.title": "พันธมิตรสินค้าบ้านและของใช้ทั่วไปแบบครบวงจร",
    "hero.subtitle": "ราคาตรงจากโรงงาน การจัดส่งที่เชื่อถือได้ ครบถ้วนตามมาตรฐาน — พันธมิตรซัพพลายเชนแบบครบวงจรสำหรับผู้ซื้อ B2B ทั่วโลก",
    "hero.slide1.tagline": "ผู้ผลิตตรงจากโรงงาน",
    "hero.slide1.title": "ตรงจากโรงงาน",
    "hero.slide1.accent": "คุณภาพระดับโลก",
    "hero.slide1.desc": "เฟอร์นิเจอร์ วัสดุก่อสร้าง ฮาร์ดแวร์ ระบบแสงสว่าง และผลิตภัณฑ์ทำความสะอาดอุตสาหกรรม — ผลิตในโรงงานของเราเอง จัดส่งทั่วโลก",
    "hero.slide2.tagline": "การผลิตขั้นสูง",
    "hero.slide2.title": "ความแม่นยำ",
    "hero.slide2.accent": "ในทุกขั้นตอน",
    "hero.slide2.desc": "สายการผลิตอัตโนมัติ 8 สาย ที่ทำงานตลอด 24 ชั่วโมง พร้อมการตรวจสอบคุณภาพแบบเรียลไทม์ตั้งแต่วัตถุดิบจนถึงสินค้าสำเร็จรูป",
    "hero.slide3.tagline": "การประกันคุณภาพ",
    "hero.slide3.title": "ทุกชุดการผลิต",
    "hero.slide3.accent": "ทดสอบอย่างเข้มงวด",
    "hero.slide3.desc": "ห้องปฏิบัติการที่ได้รับการรับรอง CNAS ทำการทดสอบภาคบังคับ 12 รายการต่อชุดการผลิต — ไม่มีสินค้าใดจัดส่งหากไม่ผ่านการทดสอบ",
    "hero.slide4.tagline": "ขับเคลื่อนด้วยนวัตกรรม",
    "hero.slide4.title": "25 ปี",
    "hero.slide4.accent": "แห่งความเป็นเลิศทางเทคนิค",
    "hero.slide4.desc": "สิทธิบัตรระดับชาติมากกว่า 20 รายการ และทีมวิจัยพัฒนาที่ทุ่มเท ผลักดันขีดจำกัดของเทคโนโลยีวัสดุอย่างต่อเนื่อง",
    "hero.explore": "สำรวจสินค้า",
    "hero.touch": "ติดต่อเรา",
    "hero.stats.cert": "ใบรับรองมาตรฐาน",
    "hero.stats.projects": "โครงการที่แล้วเสร็จ",
    "hero.stats.capacity": "กำลังการผลิตรายปี",
    "hero.overlay.title": "จากโรงงานสู่โครงการของคุณ",
    "hero.overlay.sub": "ตรงจากโรงงาน · ราคาที่แข่งขันได้ · จัดส่งเชื่อถือได้ · บริการหลังการขายทั่วโลก",
    "hero.overlay.explore": "ดูโซลูชัน",
    "hero.overlay.consult": "ปรึกษาฟรี",

    # ── media ──
    "media.slogan": "โรงงานโดยตรง เข้าถึงทั่วโลก",
    "media.desc": "ตั้งแต่การจัดหาวัตถุดิบจนถึงการตรวจสอบขั้นสุดท้าย ทุกขั้นตอนของกระบวนการผลิตของเราได้รับการรับรอง ISO ชมวิดีโอทัวร์โรงงานเพื่อดูสายการผลิตของเรา",
    "media.watch": "ชมวิดีโอทัวร์โรงงาน",

    # ── products ──
    "products.searchPrefix": "ค้นหา: ",
    "products.allCategories": "หมวดหมู่ทั้งหมด",

    # ── factory ──
    "factory.label": "โรงงานของเรา",
    "factory.title": "การผลิตที่ทันสมัย",
    "factory.desc": "ฐานการผลิตขนาด 80,000 ตร.ม. ของเรามีสายการผลิตอัตโนมัติ 8 สาย กำลังการผลิตรายปี 50,000 ตัน ตั้งแต่การสังเคราะห์วัตถุดิบจนถึงการบรรจุสินค้าสำเร็จรูป ทุกขั้นตอนถูกควบคุมและตรวจสอบอย่างแม่นยำ",
    "factory.features": [
        "สายการผลิตอัตโนมัติ 8 สาย ทำงานตลอด 24 ชั่วโมง",
        "ห้องปฏิบัติการที่ได้รับการรับรอง CNAS พร้อมเครื่องมือทดสอบกว่า 50 รายการ",
        "ตรวจสอบคุณภาพแบบเรียลไทม์ในทุกขั้นตอนการผลิต",
        "คลังสินค้าอัจฉริยะพร้อมระบบควบคุมอุณหภูมิ",
    ],
    "factory.badge": "ISO 9001",

    # ── quality ──
    "quality.label": "การควบคุมคุณภาพ",
    "quality.title": "ทุกชุดการผลิต ผ่านการทดสอบอย่างเข้มงวด",
    "quality.desc": "ห้องปฏิบัติการที่ได้รับการรับรอง CNAS ของเราทำการทดสอบภาคบังคับ 12 รายการในทุกชุดการผลิต — ตั้งแต่ความทนแรงดึงและการยืดตัว ไปจนถึงการทดสอบการเสื่อมสภาพจากรังสี UV และความทนทานต่อสารเคมี ไม่มีสินค้าใดจัดส่งหากไม่ผ่านการทดสอบ",
    "quality.features": [
        "การทดสอบคุณภาพภาคบังคับ 12 รายการต่อชุดการผลิต",
        "การจำลองการเสื่อมสภาพเร่งเร็วกว่า 1,000 ชั่วโมง",
        "ตรวจสอบย้อนกลับได้ครบถ้วนตั้งแต่วัตถุดิบจนถึงสินค้าสำเร็จรูป",
        "มีใบรับรองจากหน่วยงานภายนอก SGS/TÜV",
    ],
    "quality.badge": "ห้องปฏิบัติการ CNAS",

    # ── gallery ──
    "gallery.label": "แกลเลอรี",
    "gallery.title": "ภายในโรงงานของเรา",
    "gallery.desc": "ชมโรงงานผลิตที่ทันสมัยและกระบวนการควบคุมคุณภาพของเรา",
    "gallery.all": "ทั้งหมด",
    "gallery.categories": ["ทั้งหมด", "โรงงาน", "สินค้า", "คุณภาพ"],
    "gallery.view": "ดู",

    # ── stats ──
    "stats.capacity": "กำลังการผลิตรายปี",
    "stats.projects": "โครงการที่แล้วเสร็จ",
    "stats.clients": "ลูกค้าองค์กร",
    "stats.experience": "ประสบการณ์ในอุตสาหกรรม",
    "stats.unit1": "พันตัน",
    "stats.unit2": "+",
    "stats.unit3": "+",
    "stats.unit4": " ปี",

    # ── partners ──
    "partners.prev": "พันธมิตรก่อนหน้า",
    "partners.next": "พันธมิตรถัดไป",

    # ── cta ──
    "cta.label": "ติดต่อ",
    "cta.title": "รับโซลูชันที่ออกแบบเพื่อคุณ",
    "cta.desc": "แจ้งความต้องการของโครงการให้เราทราบ ทีมเทคนิคของเราจะออกแบบโซลูชันสินค้าที่เหมาะสมที่สุดให้คุณ",

    # ── about ──
    "about.label": "เกี่ยวกับเรา",
    "about.title": "เกี่ยวกับ DEXOREN",
    "about.desc": "ตั้งแต่ปี 2002 — จากผู้ผลิตที่ได้รับความไว้วางใจ สู่ซัพพลายเชนสินค้าบ้านและของใช้ทั่วไปแบบครบวงจร โชว์รูมค้าส่ง 8,000 ตร.ม. คลังสินค้าแบบครบวงจร สินค้ากว่า 30,000 รายการ ครอบคลุมครัว การทำความสะอาด การจัดเก็บ สิ่งทอ ของตกแต่ง สินค้าสัตว์เลี้ยง และอื่นๆ",
    "about.storyLabel": "เรื่องราวของเรา",
    "about.storyTitle1": "สร้างขึ้นบนเทคโนโลยี",
    "about.storyTitle2": "นิยามด้วยคุณภาพ",
    "about.storyP1": "ก่อตั้งในปี 2002 DEXOREN เป็นผู้ผลิตแบบครบวงจรที่รวมการวิจัยพัฒนา การผลิต และการจัดจำหน่ายทั่วโลกเข้าด้วยกัน ใน 5 กลุ่มผลิตภัณฑ์หลัก สำนักงานใหญ่ตั้งอยู่ที่กว่างโจว เราดำเนินโรงงานผลิตที่ทันสมัยขนาด 80,000 ตร.ม.",
    "about.storyP2": "ห้องปฏิบัติการที่ได้รับการรับรอง CNAS ของเรามีอุปกรณ์ทดสอบและเครื่องมือวิจัยพัฒนาระดับโลก สนับสนุนด้วยสิทธิบัตรระดับชาติกว่า 20 รายการ กลุ่มผลิตภัณฑ์ของเราครอบคลุมเฟอร์นิเจอร์ กาวและวัสดุยาแนวสำหรับอาคาร ระบบแสงสว่าง LED ฮาร์ดแวร์ก่อสร้าง และโซลูชันทำความสะอาดอุตสาหกรรม",
    "about.storyP3": "ตลอดกว่าสองทศวรรษ DEXOREN ขับเคลื่อนด้วยนวัตกรรมทางเทคโนโลยีและนิยามด้วยคุณภาพสินค้า — ส่งมอบสินค้าตรงจากโรงงานที่เชื่อถือได้ให้ลูกค้ากว่า 3,200 รายทั่วโลก",
    "about.journeyLabel": "เส้นทางของเรา",
    "about.journeyTitle": "เส้นทางของเรา",
    "about.journeyDesc": "กว่าสองทศวรรษของความก้าวหน้าอย่างไม่หยุดยั้ง — ทุกก้าวล้วนมีจุดมุ่งหมายและมุ่งมั่น",
    "about.valuesLabel": "ค่านิยมหลัก",
    "about.certsLabel": "ใบรับรองมาตรฐาน",
    "about.tagline": "เราตัดต้นทุนส่วนเกินของคนกลางออกไป แต่คงบริการของคนกลางที่คุณต้องการจริงๆ ไว้",
    "about.teamLabel": "ทีมงานมืออาชีพ",
    "about.teamSubtitle": "สี่ทีมเฉพาะทางครอบคลุมการวิจัยพัฒนา การควบคุมคุณภาพ ธุรกิจระหว่างประเทศ และโลจิสติกส์",
    "about.team.title": "พบกับทีมงานของเรา",
    "about.team.designer": "นักออกแบบภายใน",
    "about.team.designerDesc": "สร้างแบบแปลน 2D/3D ที่ปรับให้เข้ากับความชอบด้านสุนทรียะและงบประมาณของตลาดคุณ",
    "about.team.qc": "วิศวกรควบคุมคุณภาพ",
    "about.team.qcDesc": "ตรวจสอบคุณภาพตลอดห่วงโซ่ตั้งแต่วัตถุดิบจนถึงสินค้าสำเร็จรูป พร้อมรายงานการตรวจสอบแบบเรียลไทม์",
    "about.team.supply": "ผู้เชี่ยวชาญซัพพลายเชน",
    "about.team.supplyDesc": "บูรณาการโรงงานต้นทางกว่า 100 แห่ง ติดต่อจุดเดียว ครอบคลุมทุกหมวดหมู่",
    "about.team.promo": "ผู้นำด้านการส่งเสริมการขายระดับโลก",
    "about.team.promoDesc": "จัดหาสื่อการตลาด เนื้อหาโซเชียลมีเดีย และกลยุทธ์ส่งเสริมการขายฟรีสำหรับตลาดของคุณ",
    "about.process.title": "กระบวนการโปร่งใส 100%",
    "about.process.desc": "ทัวร์โรงงานทางวิดีโอทางไกล ร่วมตรวจสอบสินค้าแบบเรียลไทม์ และเข้าถึงแดชบอร์ดคำสั่งซื้อของคุณได้อย่างเต็มที่ — คุณเห็นทุกสิ่งที่เราเห็น",
    "about.timeline": [
        {"year": "2002", "title": "ก่อตั้งบริษัท", "desc": "DEXOREN ก่อตั้งขึ้นที่กว่างโจว เริ่มต้นจากธุรกิจค้าวัสดุก่อสร้าง"},
        {"year": "2008", "title": "เริ่มการผลิต", "desc": "เปิดสายการผลิตสายแรก เปลี่ยนผ่านจากการค้าสู่การผลิต"},
        {"year": "2013", "title": "ขยายกลุ่มผลิตภัณฑ์", "desc": "ขยายจากวัสดุก่อสร้างสู่เฟอร์นิเจอร์และฮาร์ดแวร์ — วางรากฐานสู่พอร์ตโฟลิโอหลายหมวดหมู่"},
        {"year": "2018", "title": "ขยายทั่วประเทศ", "desc": "สร้างเครือข่ายการขายทั่วประเทศให้บริการลูกค้าองค์กรกว่า 300 รายในจีน"},
        {"year": "2022", "title": "กลุ่มผลิตภัณฑ์ใหม่", "desc": "เปิดตัวกลุ่มผลิตภัณฑ์แสงสว่าง LED และผลิตภัณฑ์ทำความสะอาดอุตสาหกรรม ครบห้าหมวดหมู่"},
        {"year": "2025", "title": "ก้าวสู่ระดับโลก", "desc": "ขยายการส่งออกสู่เอเชียตะวันออกเฉียงใต้ ตะวันออกกลาง และแอฟริกา — เริ่มต้นการเดินทางระดับโลก"},
    ],
    "about.values": [
        {"title": "พันธกิจ", "desc": "เสริมศักยภาพผู้ซื้อทั่วโลกด้วยสินค้าคุณภาพตรงจากโรงงานในราคาที่แข่งขันได้"},
        {"title": "วิสัยทัศน์", "desc": "เป็นผู้ผลิตหลายหมวดหมู่ระดับโลกและพันธมิตรการส่งออกที่ได้รับความไว้วางใจ"},
        {"title": "ค่านิยมหลัก", "desc": "ความซื่อสัตย์มาก่อน คุณภาพเป็นหลัก ขับเคลื่อนด้วยนวัตกรรม ร่วมมือแบบได้ประโยชน์ร่วมกัน"},
        {"title": "สมรรถนะหลัก", "desc": "ความเชี่ยวชาญการผลิต 25 ปี กลุ่มผลิตภัณฑ์หลายหมวดหมู่ และการควบคุมคุณภาพแบบครบวงจร"},
    ],
    "about.certs": [
        {"title": "ISO 9001:2015", "desc": "ระบบบริหารคุณภาพ"},
        {"title": "ISO 14001:2015", "desc": "ระบบบริหารสิ่งแวดล้อม"},
        {"title": "ห้องปฏิบัติการ CNAS", "desc": "การรับรองระดับชาติของจีน"},
        {"title": "เครื่องหมาย CE", "desc": "รับรองความสอดคล้องมาตรฐานยุโรป"},
    ],

    # ── contact ──
    "contact.label": "ติดต่อ",
    "contact.title": "ติดต่อเรา",
    "contact.desc": "เรายินดีรับฟังจากคุณ — ไม่ว่าจะเป็นคำถามเรื่องสินค้าหรือข้อเสนอความร่วมมือ",
    "contact.call": "WhatsApp",
    "contact.email": "อีเมลถึงเรา",
    "contact.visit": "เยี่ยมชมเรา",
    "contact.hours": "เวลาทำการ",
    "contact.respond": "เราตอบกลับภายใน 24 ชั่วโมง",
    "contact.appointment": "เข้าชมตามนัดหมาย",
    "contact.connectLabel": "เชื่อมต่อกับเรา",
    "contact.connectTitle": "ติดตามการเดินทางของเรา",
    "contact.connectDesc": "ติดตามข่าวสารการเปิดตัวสินค้าใหม่ มุมมองอุตสาหกรรม และข่าวบริษัทของเราบนโซเชียลมีเดีย",
    "contact.formTitle": "ส่งข้อความถึงเรา",
    "contact.faq.label": "คำถามที่พบบ่อย",
    "contact.faq.title": "คำถามที่พบบ่อย",
    "contact.faq.desc": "คำถามทั่วไปเกี่ยวกับสินค้า การสั่งซื้อ และการจัดส่ง",
    "contact.faq.q1": "จำนวนสั่งซื้อขั้นต่ำ (MOQ) คือเท่าใด?",
    "contact.faq.a1": "MOQ แตกต่างกันตามสินค้า สินค้าส่วนใหญ่เริ่มต้นที่ 10 ชิ้นต่อแบบ ติดต่อเราเพื่อทราบรายละเอียด MOQ ของสินค้าเฉพาะ — เราสามารถรองรับคำสั่งซื้อทดลองได้",
    "contact.faq.q2": "คุณมีบริการปรับแต่ง OEM/ODM หรือไม่?",
    "contact.faq.a2": "มี เราให้บริการ OEM/ODM ครบวงจร รวมถึงการปรับแต่งขนาด วัสดุ สี พื้นผิว และตราสินค้า ทีมวิศวกรของเราทำงานตามข้อกำหนดของคุณ",
    "contact.faq.q3": "ระยะเวลาการผลิตโดยทั่วไปคือเท่าใด?",
    "contact.faq.a3": "ระยะเวลามาตรฐาน 25–35 วันสำหรับสินค้าส่วนใหญ่ คำสั่งซื้อแบบปรับแต่งอาจใช้เวลา 35–45 วัน มีบริการเร่งด่วนตามคำขอ",
    "contact.faq.q4": "ฉันสามารถขอตัวอย่างก่อนสั่งซื้อจำนวนมากได้หรือไม่?",
    "contact.faq.a4": "ได้ มีตัวอย่างให้ ค่าตัวอย่างสามารถคืนได้เมื่อสั่งซื้อจำนวนมากครั้งแรก เราจัดส่งผ่าน DHL/FedEx/UPS พร้อมการติดตาม",
    "contact.faq.q5": "คุณรับเงื่อนไขการชำระเงินแบบใดบ้าง?",
    "contact.faq.a5": "เรารับ T/T (มัดจำ 30% ชำระส่วนที่เหลือ 70% ก่อนจัดส่ง), L/C ที่เห็น และ Western Union พันธมิตรระยะยาวอาจได้รับเงื่อนไขเครดิต",
    "contact.faq.q6": "คุณมีบริการสนับสนุนด้านโลจิสติกส์และการจัดส่งหรือไม่?",
    "contact.faq.a6": "มี เรามีความร่วมมือกับผู้ส่งต่อสินค้ารายใหญ่ และสามารถจัดการจัดส่งแบบ FOB/CIF/DDP ทั่วโลก รวมถึงการจัดวางตู้คอนเทนเนอร์ให้เหมาะสม",

    # ── form ──
    "form.name": "ชื่อของคุณ",
    "form.phone": "หมายเลขโทรศัพท์",
    "form.email": "ที่อยู่อีเมล",
    "form.message": "แจ้งความต้องการของคุณ...",
    "form.submit": "ส่งคำขอ",
    "form.sending": "กำลังส่ง...",
    "form.thanks": "ขอบคุณสำหรับคำขอของคุณ",
    "form.reply": "เราจะติดต่อกลับภายใน 24 ชั่วโมง",
    "form.again": "ส่งข้อความอีกครั้ง",

    # ── footer ──
    "footer.products": "สินค้า",
    "footer.company": "บริษัท",
    "footer.contact": "ติดต่อ",
    "footer.privacy": "นโยบายความเป็นส่วนตัว",
    "footer.terms": "เงื่อนไขการให้บริการ",
    "footer.rights": "สงวนลิขสิทธิ์ทั้งหมด",
    "footer.needHelp": "ต้องการความช่วยเหลือ?",
    "footer.helpHours": "ตอบกลับรวดเร็ว — โดยปกติภายใน 12 ชั่วโมง (GMT+8)",
    "footer.productsList.homeMerchandise": "ของใช้ในบ้านและของใช้ทั่วไป",
    "footer.productsList.furniture": "เฟอร์นิเจอร์",
    "footer.productsList.buildingMaterials": "วัสดุก่อสร้าง",
    "footer.productsList.hardware": "ฮาร์ดแวร์",
    "footer.productsList.appliances": "เครื่องใช้ไฟฟ้า",
    "footer.productsList.lighting": "ระบบแสงสว่าง",
    "footer.companyList.about": "เกี่ยวกับเรา",
    "footer.companyList.certs": "ใบรับรองมาตรฐาน",
    "footer.companyList.tradeTerms": "เงื่อนไขการค้า",
    "footer.companyList.faq": "คำถามที่พบบ่อย",
    "footer.companyList.contact": "ติดต่อเรา",

    # ── detail ──
    "detail.trustFactory": "โรงงานของเราเอง",
    "detail.trustISO": "ได้รับการรับรอง ISO",
    "detail.trustResponse": "ตอบกลับภายใน 24 ชม.",
    "detail.tradeTitle": "การค้าและการจัดส่ง",
    "detail.tradeMoq": "จำนวนสั่งซื้อขั้นต่ำ",
    "detail.tradeLead": "ระยะเวลาการผลิต",
    "detail.tradeTerm": "เงื่อนไขการค้า",
    "detail.tradePack": "บรรจุภัณฑ์",
    "detail.tradeCert": "ใบรับรองมาตรฐาน",
    "detail.tradeBrand": "ตราสินค้า",
    "detail.tradePrice": "ราคาอ้างอิง (FOB)",
    "detail.tradePriceNote": "เป็นราคาโดยประมาณ — ยืนยันราคาสุดท้ายเมื่อเสนอราคา",
    "detail.requestQuote": "ขอใบเสนอราคา",
    "detail.whatsappLabel": "แชทผ่าน WhatsApp",

    # ── cart ──
    "cart.title": "รายการสอบถาม",
    "cart.empty": "รายการสอบถามของคุณว่างอยู่ เลือกดูสินค้าและเพิ่มรายการที่คุณสนใจ",
    "cart.quantity": "จำนวน",
    "cart.category": "หมวดหมู่",
    "cart.inquiryList": "รายการสอบถาม",
    "cart.total": "รวม",
    "cart.items": "รายการ",
    "cart.website": "เว็บไซต์",
    "cart.copy": "คัดลอกข้อความ",
    "cart.copied": "คัดลอกแล้ว",
    "cart.download": "ดาวน์โหลด",
    "cart.contactChat": "ติดต่อเราเพื่อขอใบเสนอราคา",
    "cart.clearAll": "ล้างทั้งหมด",
    "cart.submitInquiry": "ส่งคำขอสอบถาม",
    "cart.formName": "ชื่อของคุณ *",
    "cart.formEmail": "ที่อยู่อีเมล *",
    "cart.formMessage": "หมายเหตุเพิ่มเติม (ไม่บังคับ)",
    "cart.cancel": "ยกเลิก",
    "cart.formPhone": "WhatsApp / โทรศัพท์ *",
    "cart.successTitle": "ส่งคำขอสอบถามแล้ว!",
    "cart.successMsg": "เราจะตอบกลับภายใน 24 ชั่วโมง",

    # ── cookie ──
    "cookie.title": "ประกาศคุกกี้",
    "cookie.desc": "เราใช้คุกกี้ที่จำเป็นเพื่อให้เว็บไซต์ทำงานได้อย่างถูกต้อง ไม่มีการใช้คุกกี้ติดตามหรือโฆษณาโดยไม่ได้รับความยินยอมจากคุณ",
    "cookie.learn": "เรียนรู้เพิ่มเติม",
    "cookie.accept": "ยอมรับและดำเนินการต่อ",

    # ── modal ──
    "modal.features": "คุณสมบัติ",
    "modal.specs": "ข้อกำหนด",

    # ── promo ──
    "promo.title": "ลดราคาพิเศษประจำเดือน",
    "promo.subtitle": "จำนวนจำกัด — จนกว่าสินค้าจะหมด",
    "promo.viewAll": "ดูข้อเสนอทั้งหมด",
    "promo.limited": "จำกัด",
    "promo.daysLeft": "เหลืออีก {n} วัน",

    # ── bestseller ──
    "bestseller.title": "สินค้าขายดีประจำเดือน",
    "bestseller.subtitle": "ได้รับความนิยมสูงสุดจากผู้ซื้อทั่วโลก",
    "bestseller.label": "สินค้าแนะนำ",

    # ── home ──
    "home.featured": "สินค้าแนะนำ",
    "home.newThisMonth": "มาใหม่เดือนนี้",
    "home.topPicks": "สินค้าแนะนำ",
    "home.bestSellers": "สินค้าขายดีประจำเดือน",
    "home.rankedBy7Days": "จัดอันดับตามยอดขาย 7 วัน — อัปเดตทุกวัน",
    "home.hotRanking": "สินค้าขายดี",
    "home.viewAll": "ดูทั้งหมด",
    "home.backToHome": "กลับหน้าแรก",
    "home.selectCategory": "เลือกหมวดหมู่จากแถบด้านข้าง",
    "home.noProducts": "ไม่มีสินค้า",
    "home.moreProducts": "สินค้าเพิ่มเติม",
    "home.noProductsInCategory": "ยังไม่มีสินค้าในหมวดหมู่นี้",
    "home.allProducts": "สินค้าทั้งหมด",
    "home.search": "ค้นหาสินค้า... กด Enter",
    "home.searchPlaceholder": "ค้นหาสินค้า... กด Enter",
    "home.loadMore": "โหลดเพิ่มเติม",
    "home.items": "รายการ",
    "home.all": "ทั้งหมด",
    "home.customerReviews": "เสียงจากลูกค้าของเรา",
    "home.verifiedBuyer": "ผู้ซื้อที่ยืนยันแล้ว",
    "home.reviewRated": "ให้คะแนน",
    "home.reviewStars": "ดาว",
    "home.valueCards.design.title": "ออกแบบ + เลือกสินค้า",
    "home.valueCards.design.desc": "ปรึกษาการออกแบบภายในและจับคู่สินค้าฟรีสำหรับตลาดของคุณ",
    "home.valueCards.quality.title": "การควบคุมคุณภาพ",
    "home.valueCards.quality.desc": "ตรวจโรงงานตลอดห่วงโซ่และทดสอบโดยหน่วยงานภายนอกทุกชุดการผลิต",
    "home.valueCards.delivery.title": "จัดส่งแบบครบวงจร",
    "home.valueCards.delivery.desc": "รวมสินค้าหลายหมวดหมู่ จัดส่งถึงประตูบ้านทั่วโลก",
    "home.trust.countries": "ให้บริการกว่า 30 ประเทศ",
    "home.trust.containers": "จัดส่งตู้คอนเทนเนอร์กว่า 1,200 ตู้",
    "home.trust.rating": "คะแนน Google 4.8★",
    "home.trust.clients": "ลูกค้ากว่า 3,200 รายทั่วโลก",

    # ── rankings / promotions ──
    "rankings.suffix": " อันดับ",
    "promotions.daysLeft": "เหลืออีก {n} วัน — จนกว่าสินค้าจะหมด",

    # ── common ──
    "common.brand": "DEXOREN",
    "common.slogan": "ซัพพลายเชนสินค้าบ้านและของใช้ทั่วไป | โชว์รูม 8,000 ตร.ม. · สินค้า 30,000+ รายการ",
    "common.search": "ค้นหา",
    "common.searchPlaceholder": "ค้นหาสินค้า...",
    "common.backToHome": "กลับหน้าแรก",
    "common.noProducts": "ไม่มีสินค้า",
    "common.noProductsInCategory": "ยังไม่มีสินค้าในหมวดหมู่นี้",
    "common.selectCategory": "เลือกหมวดหมู่จากแถบด้านข้าง",
    "common.viewAll": "ดูทั้งหมด",
    "common.comingSoon": "เร็วๆ นี้",
    "common.subline": "ตรงจากโรงงาน · ราคาที่แข่งขันได้ · จัดส่งเชื่อถือได้ · บริการหลังการขายทั่วโลก",

    # ── search ──
    "search.placeholder": "ค้นหาสินค้า... กด Enter",
    "search.inlinePlaceholder": "ค้นหา...",
    "search.button": "ค้นหา",
    "search.categoryTag": "หมวดหมู่",
    "search.productTag": "สินค้า",

    # ── flashDeals / newArrivals ──
    "flashDeals.title": "ลดราคาพิเศษรายวัน",
    "flashDeals.subtitle": "เปิดในเวลาสุ่ม จนกว่าสินค้าจะหมด",
    "flashDeals.tag": "พิเศษ",
    "flashDeals.emptyState": "ข้อเสนอพิเศษเร็วๆ นี้ — ติดตามไว้!",
    "newArrivals.title": "สินค้าใหม่ 2026",
    "newArrivals.subtitle": "พบกับสินค้าใหม่ล่าสุดของเราในปีนี้",
    "newArrivals.emptyState": "สินค้าใหม่เร็วๆ นี้ — กลับมาตรวจสอบอีกครั้ง!",

    # ── quickInquiry ──
    "quickInquiry.title": "สอบถามด่วน",
    "quickInquiry.namePlaceholder": "ชื่อของคุณ",
    "quickInquiry.emailPlaceholder": "อีเมลของคุณ",
    "quickInquiry.phonePlaceholder": "WhatsApp / โทรศัพท์",
    "quickInquiry.submit": "ส่งคำขอสอบถาม",
    "quickInquiry.sending": "กำลังส่ง...",
    "quickInquiry.success": "ส่งคำขอแล้ว!",
    "quickInquiry.successMsg": "เราจะติดต่อคุณภายใน 24 ชั่วโมง",
    "quickInquiry.close": "ปิด",
    "quickInquiry.footerNote": "เราตอบกลับภายใน 24 ชั่วโมง",
    "quickInquiry.validationError": "กรุณากรอกชื่อและอีเมลของคุณ",
    "quickInquiry.networkError": "ข้อผิดพลาดของเครือข่าย กรุณาลองใหม่",

    "weeklySold": "ขาย 7 วัน: ",

    # ── services ──
    "services.heroLabel": "เหนือกว่าการจัดหา · การเสริมศักยภาพอย่างเต็มที่",
    "services.heroTitle": "บริการเพิ่มมูลค่าที่ครบถ้วน",
    "services.heroSubtitle": "ตั้งแต่การออกแบบจนถึงโลจิสติกส์ — เก้าโมดูลบริการหลักสำหรับพันธมิตร B2B ทั่วโลก",
    "services.ctaTitle": "บริการทั้งหมดฟรีสำหรับลูกค้าที่ร่วมงานกัน",
    "services.ctaDesc": "เราไม่ได้แสวงหากำไรจากบริการ — นี่คือความได้เปรียบในการแข่งขันของเรา ทั้งเก้าบริการฟรีสำหรับลูกค้าที่ร่วมงานกัน",
    "services.getStarted": "เริ่มต้นใช้งาน",
    "services.browseProducts": "เลือกดูสินค้า",

    # ── certifications ──
    "certifications.heroLabel": "ความสอดคล้องและความไว้วางใจ",
    "certifications.heroTitle": "ใบรับรองและการปฏิบัติตามมาตรฐาน",
    "certifications.heroSubtitle": "ใบรับรองทั้งหมดเป็นต้นฉบับจากโรงงาน และสามารถดาวน์โหลดตามประเทศได้เมื่อร้องขอ เราช่วยให้คุณผ่านศุลกากรและปฏิบัติตามข้อกำหนดในท้องถิ่นทั่วโลก",
    "certifications.introTitle": "ความสอดคล้องที่ติดตั้งมาเพื่อการค้าระดับโลก",
    "certifications.introDesc": "สินค้าทุกชิ้นของ DEXOREN มีใบรับรองที่ได้รับการยอมรับในระดับสากลสนับสนุน — เพื่อให้การจัดส่งของคุณผ่านศุลกากรได้อย่างราบรื่นและผู้ซื้อของคุณไว้วางใจสินค้าบนชั้นวาง",
    "certifications.applicableTo": "ใช้กับ",
    "certifications.region": "ภูมิภาค",
    "certifications.standard": "มาตรฐาน",
    "certifications.requestTitle": "ต้องการไฟล์ใบรับรองสำหรับตลาดของคุณ?",
    "certifications.requestDesc": "เราให้สำเนาใบรับรองต้นฉบับรายประเทศ (PDF) และรายงานการทดสอบจากหน่วยงานภายนอก (SGS, TÜV, Intertek) เพื่อสนับสนุนการนำเข้าและการประมูลของคุณ",
    "certifications.requestBtn": "ขอใบรับรอง",
    "certifications.downloadNote": "ใบรับรองออกให้ตามคำสั่งซื้อและประเทศปลายทาง แจ้งตลาดเป้าหมายของคุณให้เราทราบ แล้วเราจะส่งชุดเอกสารที่คุณต้องการ",

    # ── tradeTerms ──
    "tradeTerms.heroLabel": "วิธีการทำงานร่วมกับคุณ",
    "tradeTerms.heroTitle": "เงื่อนไขการค้า การชำระเงิน และการจัดส่ง",
    "tradeTerms.heroSubtitle": "โปร่งใส ยืดหยุ่น และพร้อมสำหรับการส่งออก ตั้งแต่ Incoterms ไปจนถึงการชำระเงินและการจัดส่ง ทุกอย่างออกแบบมาเพื่อให้การจัดซื้อข้ามพรมแดนง่ายและมีความเสี่ยงต่ำ",
    "tradeTerms.incotermsTitle": "Incoterms ที่เรารองรับ",
    "tradeTerms.incotermsSub": "เลือกเงื่อนไขการส่งมอบที่เหมาะกับการจัดโลจิสติกส์ของคุณ คำสั่งซื้อส่วนใหญ่จัดส่งแบบ FOB หรือ CIF จากท่าเรือหลักของจีน",
    "tradeTerms.paymentsLabel": "ปลอดภัยและยืดหยุ่น",
    "tradeTerms.paymentsTitle": "วิธีการชำระเงิน",
    "tradeTerms.paymentsSub": "ตัวเลือกที่ยืดหยุ่นและปลอดภัยสำหรับคำสั่งซื้อทุกขนาด — ตั้งแต่ตัวอย่างชิ้นเดียวจนถึงตู้คอนเทนเนอร์เต็ม",
    "tradeTerms.logisticsLabel": "จัดส่งถึงที่ที่คุณขาย",
    "tradeTerms.logisticsTitle": "การจัดส่งและโลจิสติกส์",
    "tradeTerms.logisticsSub": "เราร่วมงานกับผู้ขนส่งรายใหญ่และมีคลังสินค้าในต่างประเทศ เพื่อให้สินค้าของคุณถึงมือตรงเวลา ไม่ว่าที่ใด",
    "tradeTerms.factsLabel": "สิ่งที่ควรทราบก่อนสั่งซื้อ",
    "tradeTerms.factsTitle": "ข้อมูลสำคัญในการสั่งซื้อ",
    "tradeTerms.moqTitle": "จำนวนสั่งซื้อขั้นต่ำ",
    "tradeTerms.moqDesc": "สินค้าพร้อมส่ง: เริ่มต้น 10 ชิ้นต่อ SKU/แบบ OEM และตราสินค้าของคุณเอง: 500–1,000 ชิ้นต่อ SKU สามารถรวมหลาย SKU ในตู้คอนเทนเนอร์เดียวเพื่อลดต้นทุนต่อชิ้น",
    "tradeTerms.leadTimeTitle": "ระยะเวลาการผลิต",
    "tradeTerms.leadTimeDesc": "สินค้ามาตรฐาน: 25–35 วัน คำสั่งซื้อแบบปรับแต่ง/OEM: 35–45 วัน มีบริการเร่งด่วนตามคำขอ",
    "tradeTerms.sampleTitle": "ตัวอย่างสินค้า",
    "tradeTerms.sampleDesc": "มีตัวอย่างให้และจัดส่งผ่าน DHL/FedEx/UPS พร้อมการติดตาม ค่าตัวอย่างสามารถคืนได้เมื่อสั่งซื้อจำนวนมากครั้งแรก",
    "tradeTerms.packagingTitle": "บรรจุภัณฑ์",
    "tradeTerms.packagingDesc": "กล่องส่งออกมาตรฐานพร้อมวัสดุกันกระแทก มีกล่องสีที่กำหนดเอง บาร์โค้ด และการวางพาเลท พาเลทและลังไม้ผ่านการรมควัน ISPM-15 พร้อมตราประทับอย่างเป็นทางการเมื่อร้องขอ",
    "tradeTerms.quoteTitle": "การเสนอราคาและสกุลเงิน",
    "tradeTerms.quoteDesc": "เสนอราคาเป็นสกุลเงินดอลลาร์สหรัฐ (มีหยวนเมื่อร้องขอ) และมีอายุ 30 วัน เงื่อนไขมาตรฐาน: มัดจำ 30% ส่วนที่เหลือ 70% ชำระเมื่อได้รับสำเนาใบตราส่ง",
    "tradeTerms.complianceLabel": "คุณภาพ การเรียกร้อง และการปฏิบัติตามมาตรฐาน",
    "tradeTerms.complianceTitle": "การตรวจสอบคุณภาพ การเรียกร้อง และการปฏิบัติตามมาตรฐาน",
    "tradeTerms.complianceSub": "วิธีที่เราปกป้องคุณภาพ เงิน และการเข้าถึงตลาดของคุณ — ก่อน ระหว่าง และหลังการจัดส่ง",
    "tradeTerms.qualityTitle": "การตรวจสอบคุณภาพ",
    "tradeTerms.qualityDesc": "ยินดีให้ตรวจสอบก่อนจัดส่งโดย SGS, Bureau Veritas หรือ Intertek — คุณเป็นผู้แต่งตั้งผู้ตรวจสอบ หรือเราจัดการให้ก็ได้ หากอัตราสินค้าเสียหายเกิน AQL ที่ตกลงกัน เราจะผลิตใหม่หรือชดเชยตามจำนวน",
    "tradeTerms.claimsTitle": "การเรียกร้องและบริการหลังการขาย",
    "tradeTerms.claimsDesc": "แจ้งสินค้าขาด ปรุงแตก หรือจัดส่งผิดภายใน 7 วันหลังรับสินค้า พร้อมหลักฐานภาพถ่ายหรือวิดีโอ เราชำระค่าสินค้าที่เรียกร้องโดยการจัดส่งทดแทน เครดิตสำหรับคำสั่งซื้อถัดไป หรือคืนเงิน ตามที่ตกลงเป็นรายกรณี",
    "tradeTerms.certTitle": "ใบรับรองและการปฏิบัติตามมาตรฐาน",
    "tradeTerms.certDesc": "เราสนับสนุนการปฏิบัติตามมาตรฐานของตลาดปลายทาง: SASO (ซาอุดีอาระเบีย), ESMA (สหรัฐอาหรับเอมิเรตส์), PVOC (เคนยา), SONCAP (ไนจีเรีย) และการตรวจสอบก่อนจัดส่ง COC รวมถึง FDA / LFGB / EU 1935/2004 สำหรับสินค้าที่สัมผัสอาหาร ค่าใช้จ่ายและระยะเวลาขึ้นอยู่กับสินค้า",
    "tradeTerms.oemTitle": "OEM และตราสินค้าของคุณเอง",
    "tradeTerms.oemDesc": "ปรับแต่งโลโก้ สี บรรจุภัณฑ์ และบาร์โค้ด ตั้งแต่ 500–1,000 ชิ้นต่อ SKU เราจัดการงานศิลป์ แม่พิมพ์ และการออกแบบกล่องส่งออก โดยมีการอนุมัติตัวอย่างก่อนการผลิตจำนวนมาก",
    "tradeTerms.ctaTitle": "พร้อมหารือเรื่องคำสั่งซื้อของคุณแล้วหรือยัง?",
    "tradeTerms.ctaDesc": "แจ้งตลาดเป้าหมาย สินค้า และจำนวนให้เราทราบ — เราจะเสนอ Incoterm แผนการชำระเงิน และเส้นทางการจัดส่งที่ดีที่สุด",
    "tradeTerms.ctaBtn": "ติดต่อทีมงานของเรา",
    "tradeTerms.catalogBtn": "ขอแคตตาล็อก (PDF)",

    # ── faqPage ──
    "faqPage.heroLabel": "สนับสนุนผู้ซื้อ",
    "faqPage.heroTitle": "คำถามที่พบบ่อย มีคำตอบ",
    "faqPage.heroSubtitle": "ทุกสิ่งที่ผู้ซื้อ B2B มักถามเกี่ยวกับ MOQ ราคา ตัวอย่าง การปฏิบัติตามมาตรฐาน และการจัดส่ง — ก่อนสั่งซื้อครั้งแรก",
    "faqPage.linkCerts": "ใบรับรองมาตรฐาน",
    "faqPage.linkCertsDesc": "เอกสารการปฏิบัติตามมาตรฐานที่เราสามารถออกให้ต่อคำสั่งซื้อ",
    "faqPage.linkTrade": "เงื่อนไขการค้า",
    "faqPage.linkTradeDesc": "Incoterms วิธีการชำระเงิน และระยะเวลาการผลิต",
    "faqPage.ctaTitle": "ยังมีคำถามอยู่หรือไม่?",
    "faqPage.ctaDesc": "ส่งข้อความถึงเราทาง WhatsApp หรือส่งคำขอสอบถาม — ทีมส่งออกของเราตอบกลับภายใน 24 ชั่วโมง",

    # ── about (补充) ──
    "about.heroTitle": "ซัพพลายเชนสินค้าบ้านและของใช้ทั่วไปแบบครบวงจร",
    "about.heroSubtitle": "บูรณาการการวิจัยพัฒนา การผลิตขนาดใหญ่ การจัดจำหน่ายทั่วโลก และบริการซัพพลายเชน",
    "about.positioning": "ตำแหน่งทางการตลาด",
    "about.aboutDEXOREN": "เกี่ยวกับ DEXOREN",
    "about.introP1": "DEXOREN ก่อตั้งขึ้นในปี 2002 — แบรนด์การผลิตที่ทันสมัยซึ่งบูรณาการการวิจัยพัฒนา การผลิตขนาดใหญ่ การขายทั่วโลก และบริการซัพพลายเชน เราดำเนินฐานการผลิตของตนเอง ส่งมอบสินค้าตรงจากโรงงานและโซลูชันแบบครบวงจรให้กับผู้นำเข้า ผู้รับเหมา ผู้ค้าปลีกเครือข่าย และผู้ขาย B2B ข้ามพรมแดนทั่วโลก",
    "about.introP2": "ด้วยความเชี่ยวชาญกว่า 20 ปี เรายึดมั่นในคุณภาพเป็นอันดับแรก การปฏิบัติตามมาตรฐานเป็นอันดับแรก มุ่งเน้นบริการ และความร่วมมือแบบได้ประโยชน์ร่วมกัน เราไม่แสวงหากำไรจากการบวกราคาสินค้า — เรียกเก็บเฉพาะค่าบริการตามมาตรฐาน ปัจจุบันเราให้บริการพันธมิตร B2B ในกว่า 30 ประเทศ",
    "about.philosophy": "ปรัชญา",
    "about.beyondLabel": "เหนือกว่าสินค้า",
    "about.beyondTitle": "9 บริการเสริมมูลค่าเพื่อเสริมศักยภาพธุรกิจของคุณ",
    "about.beyondDesc": "ตั้งแต่การออกแบบจนถึงโลจิสติกส์ — สำรวจระบบบริการที่ครบถ้วนของเรา",
    "about.viewServices": "ดูบริการทั้งหมด",
    "about.partnership": "ความร่วมมือ",
    "about.partnershipTitle": "เป็นพันธมิตรทางยุทธศาสตร์ระยะยาวของเรา",
    "about.partnershipDesc": "ไม่ว่าจะเป็นผู้ค้าปลีกรายย่อย ผู้ขายข้ามพรมแดน หรือกลุ่มวิศวกรรมขนาดใหญ่ — เรามอบมาตรฐานตราสินค้าที่เป็นหนึ่งเดียวและขีดความสามารถระดับมืออาชีพ ในฐานะพันธมิตรซัพพลายเชนระดับโลกที่คุณไว้วางใจ",
    "about.getInTouch": "ติดต่อเรา",
    "about.compliance": "การปฏิบัติตามมาตรฐาน",
    "about.complianceSubtitle": "ใบรับรองทั้งหมดเป็นต้นฉบับจากโรงงาน สามารถดาวน์โหลดตามประเทศได้",
    "about.access": "การเข้าถึง",
    "weeklySoldSuffix": "",
}


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


def main():
    en = json.load(open(os.path.join(MSG, "en.json"), encoding="utf-8"))
    out = copy.deepcopy(en)

    applied = missing = 0
    for k, v in T.items():
        if set_path(out, k, v):
            applied += 1
        else:
            missing += 1
            print("  MISSING KEY:", k)

    path = os.path.join(MSG, "th.json")
    json.dump(out, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

    # coverage report: how many leaves still equal to English
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

    def leaves_en(o, pre=""):
        for k, v in o.items():
            p = f"{pre}.{k}" if pre else k
            if isinstance(v, dict):
                yield from leaves_en(v, p)
            elif isinstance(v, list):
                for i, it in enumerate(v):
                    if isinstance(it, dict):
                        yield from leaves_en(it, f"{p}[{i}]")
                    else:
                        yield p + f"[{i}]", it
            else:
                yield p, v

    en_map = dict(leaves_en(en))
    th_map = dict(leaves(out))
    same = [k for k, v in th_map.items() if en_map.get(k) == v and isinstance(v, str) and len(v) > 1]
    print(f"\napplied={applied} missing={missing}")
    print(f"total leaves={len(th_map)}  still-English={len(same)}")
    if same:
        print("still English sample:", same[:15])
    print("written ->", path)


if __name__ == "__main__":
    main()
