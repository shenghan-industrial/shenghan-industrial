import { NextResponse } from "next/server";
import { siteConfig } from "@/data/site-config";
import { kvGetJSON, kvPutJSON } from "@/lib/kv-storage";

export const runtime = "edge";

function getDefaults() {
  return {
    brandName: siteConfig.brand.name,
    slogan: siteConfig.brand.slogan,
    phone: siteConfig.contact.phone.display,
    email: siteConfig.contact.email,
    addressZh: siteConfig.contact.address.line3,
    addressEn: siteConfig.contact.address.line1,
    stats1: "25+ Certifications",
    stats2: "3200+ Projects Completed",
    stats3: "50000 tons Annual Capacity",
    heroTitleEn: "Global Home & Building Materials Manufacturer",
    heroTitleZh: "全球化家居建材源头制造品牌",
    heroSubEn: "Factory direct pricing, reliable logistics, full compliance, global after-sales",
    heroSubZh: "集自主研发、规模化生产、全球销售与一站式供应链服务",
    aboutTitleEn: "About Shengyu Industrial",
    aboutTitleZh: "关于盛煜实业",
    aboutDescEn: "",
    aboutDescZh: "",
  };
}

export async function GET() {
  try {
    const data = await kvGetJSON("site-config");
    if (data) return NextResponse.json(data);
    return NextResponse.json(getDefaults());
  } catch {
    return NextResponse.json(getDefaults());
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await kvPutJSON("site-config", body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
