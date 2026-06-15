import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "edge";

const SITE_JSON = path.join(process.cwd(), "data", "site-custom.json");
const SITE_TS = path.join(process.cwd(), "data", "site-config.ts");

function getDefaults() {
  // Read from site-config.ts to get current values
  const content = fs.readFileSync(SITE_TS, "utf8");

  const extract = (key: string): string => {
    const match = content.match(new RegExp(`${key}[:\s]+["\`]([^"\`]+)["\`]`));
    return match?.[1] || "";
  };

  return {
    brandName: extract("name") || "Shengyu Industrial",
    slogan: extract("slogan") || "Global Home & Building Materials Manufacturer",
    phone: extract("display") || "+86 138 0013 8000",
    email: extract("email") || "shenghanind@163.com",
    addressZh: extract("line3") || "山东省临沂市",
    addressEn: extract("line1") || "Linyi, Shandong, China",
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
    if (fs.existsSync(SITE_JSON)) {
      return NextResponse.json(JSON.parse(fs.readFileSync(SITE_JSON, "utf8")));
    }
    return NextResponse.json(getDefaults());
  } catch {
    return NextResponse.json(getDefaults());
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(SITE_JSON, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
