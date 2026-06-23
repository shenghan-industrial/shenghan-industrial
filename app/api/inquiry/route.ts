export const runtime = "edge";

import { NextResponse } from "next/server";
import type { Resend } from "resend";
import { kvGetJSON, kvPutJSON } from "@/lib/kv-storage";
import { verifyTurnstile } from "@/lib/turnstile";

// ── Types ──────────────────────────────────────────────────
export type InquiryStatus = "new_inquiry" | "contacted" | "quoted" | "won" | "closed";

interface InquiryItem {
  productId: string;
  name: string;
  model?: string;
  quantity: number;
  category: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  items: InquiryItem[];
  totalItems: number;
  status: InquiryStatus;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Helpers ────────────────────────────────────────────────
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

async function readInquiries(): Promise<Inquiry[]> {
  try {
    return ((await kvGetJSON<Inquiry[]>("inquiries")) ?? []) as Inquiry[];
  } catch {
    return [];
  }
}

async function writeInquiries(list: Inquiry[]): Promise<void> {
  await kvPutJSON("inquiries", list);
}

// ── Email with retry ──────────────────────────────────────
async function sendEmailWithRetry(
  html: string,
  maxRetries = 3
): Promise<boolean> {
  const r = await getResend();
  if (!r) {
    console.warn("[inquiry] Resend not configured, skipping email");
    return false;
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await r.emails.send({
        from: "Shengyu Industrial <noreply@shenghanindustrial.com>",
        to: NOTIFY_EMAIL,
        subject: "New Inquiry Received — Shengyu Industrial",
        html,
      });
      console.log(`[inquiry] Email sent on attempt ${attempt}`);
      return true;
    } catch (e) {
      console.error(`[inquiry] Email attempt ${attempt}/${maxRetries} failed:`, e);
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 3s, 5s
        await new Promise((r) => setTimeout(r, 1000 * (attempt * 2 - 1)));
      }
    }
  }
  console.error(`[inquiry] Email failed after ${maxRetries} attempts`);
  return false;
}

// ── GET: list all inquiries (admin) ────────────────────────
export async function GET() {
  try {
    return NextResponse.json(await readInquiries());
  } catch {
    return NextResponse.json({ error: "Read failed" }, { status: 500 });
  }
}

// ── POST: create new inquiry ───────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, items, turnstileToken } = body as {
      name: string;
      email: string;
      phone?: string;
      message?: string;
      items: InquiryItem[];
      turnstileToken?: string;
    };

    // Validation
    if (!name || !email || !items?.length) {
      return NextResponse.json(
        { error: "Name, email, and items are required" },
        { status: 400 }
      );
    }

    // Turnstile verification
    if (turnstileToken) {
      const ok = await verifyTurnstile(turnstileToken);
      if (!ok) {
        return NextResponse.json(
          { error: "Security check failed. Please refresh and try again." },
          { status: 400 }
        );
      }
    }

    const now = new Date().toISOString();
    const inquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      name,
      email,
      phone: phone || "",
      message: message || "",
      items,
      totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
      status: "new_inquiry",
      createdAt: now,
      updatedAt: now,
    };

    // Save to KV
    const inquiries = await readInquiries();
    inquiries.unshift(inquiry);
    await writeInquiries(inquiries);

    // Build email
    const productList = items
      .map(
        (i) =>
          `• ${i.model ? `[${i.model}] ` : ""}${i.name} x ${i.quantity} (${i.category})`
      )
      .join("\n");

    const emailHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#B8A080">New Inquiry Received</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:100px">Name</td><td style="padding:8px;border-bottom:1px solid #eee">${name}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Phone</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="https://wa.me/${phone.replace(/[^0-9+]/g, "")}">${phone}</a></td></tr>` : ""}
        </table>
        ${message ? `<p style="margin-top:16px;padding:12px;background:#f5f5f5;border-radius:8px;line-height:1.6">${message}</p>` : ""}
        <h3 style="color:#3D3730;margin-top:20px">Products (${inquiry.totalItems} total)</h3>
        <pre style="background:#f5f5f5;padding:16px;border-radius:8px;line-height:1.8">${productList}</pre>
        <p style="color:#999;font-size:12px;margin-top:16px">Status: ${inquiry.status} | ID: ${inquiry.id}</p>
      </div>`;

    // Send email with retry (non-blocking)
    sendEmailWithRetry(emailHtml).catch(() => {});

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (e) {
    console.error("[inquiry] POST failed:", e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}

// ── PUT: update inquiry status / assignment / notes (admin) ─
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, assignedTo, notes } = body as {
      id: string;
      status?: InquiryStatus;
      assignedTo?: string;
      notes?: string;
    };

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const inquiries = await readInquiries();
    const idx = inquiries.findIndex((inq) => inq.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    if (status) inquiries[idx].status = status;
    if (assignedTo !== undefined) inquiries[idx].assignedTo = assignedTo || undefined;
    if (notes !== undefined) inquiries[idx].notes = notes || undefined;
    inquiries[idx].updatedAt = new Date().toISOString();

    await writeInquiries(inquiries);

    return NextResponse.json({ success: true, inquiry: inquiries[idx] });
  } catch (e) {
    console.error("[inquiry] PUT failed:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
