import { NextResponse } from "next/server";
import type { Resend } from "resend";
import fs from "fs";
import path from "path";

export const runtime = "edge";

const INQUIRIES_JSON = path.join(process.cwd(), "data", "inquiries.json");
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "shenghanind@163.com";

let resend: Resend | null = null;
async function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) {
    const { Resend: R } = await import("resend");
    resend = new R(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface InquiryItem {
  productId: string;
  name: string;
  quantity: number;
  category: string;
}

function readInquiries() {
  if (!fs.existsSync(INQUIRIES_JSON)) return [];
  try { return JSON.parse(fs.readFileSync(INQUIRIES_JSON, "utf8")); }
  catch { return []; }
}

export async function GET() {
  try {
    return NextResponse.json(readInquiries());
  } catch {
    return NextResponse.json({ error: "Read failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, items } = body as {
      name: string;
      email: string;
      phone?: string;
      message?: string;
      items: InquiryItem[];
    };

    if (!name || !email || !items?.length) {
      return NextResponse.json({ error: "Name, email, and items are required" }, { status: 400 });
    }

    const inquiry = {
      id: `inq-${Date.now()}`,
      name,
      email,
      phone: phone || "",
      message: message || "",
      items,
      totalItems: items.reduce((sum: number, i: InquiryItem) => sum + i.quantity, 0),
      createdAt: new Date().toISOString(),
    };

    // Save to JSON
    const inquiries = readInquiries();
    inquiries.unshift(inquiry);
    const dir = path.dirname(INQUIRIES_JSON);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(INQUIRIES_JSON, JSON.stringify(inquiries, null, 2), "utf8");

    // Build product list for email
    const productList = items
      .map((i) => `• ${i.name} × ${i.quantity} (${i.category})`)
      .join("\n");

    // Send email notification (only if RESEND_API_KEY is configured)
    try {
      const r = await getResend();
      if (r) {
        await r.emails.send({
        from: "Shengyu Industrial <noreply@shenghanindustrial.com>",
        to: NOTIFY_EMAIL,
        subject: `New Inquiry from ${name} — ${items.length} product(s)`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #B8A080;">New Inquiry Received</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>WhatsApp/Phone:</strong> <a href="https://wa.me/${phone.replace(/[^0-9+]/g, '')}">${phone}</a></p>` : ""}
            <p><strong>Time:</strong> ${new Date(inquiry.createdAt).toLocaleString()}</p>
            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <h3 style="color: #3D3730;">Products (${inquiry.totalItems} total)</h3>
            <pre style="background: #f5f5f5; padding: 16px; border-radius: 8px; line-height: 1.8;">${productList}</pre>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px;">Click the WhatsApp link above to contact ${name} directly.</p>
          </div>
        `,
      });
        console.log(`Inquiry email sent to ${NOTIFY_EMAIL}`);
      }
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      // Still return success — inquiry was saved even if email fails
    }

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (e) {
    console.error("Inquiry save failed:", e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
