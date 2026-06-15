import { NextResponse } from "next/server";
import type { Resend } from "resend";

export const runtime = "edge";

let resend: Resend | null = null;
async function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) {
    const { Resend: R } = await import("resend");
    resend = new R(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface ContactBody {
  name: string;
  email: string;
  phone: string;
  message: string;
}

function validate(body: Partial<ContactBody>): { valid: true; data: ContactBody } | { valid: false; error: string } {
  const { name, email, phone, message } = body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return { valid: false, error: "Name is required (min 2 characters)." };
  }
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: "A valid email address is required." };
  }
  if (!phone || typeof phone !== "string" || phone.trim().length < 5) {
    return { valid: false, error: "Phone number is required." };
  }
  if (!message || typeof message !== "string" || message.trim().length < 5) {
    return { valid: false, error: "Message is required (min 5 characters)." };
  }

  return {
    valid: true,
    data: { name: name.trim(), email: email.trim(), phone: phone.trim(), message: message.trim() },
  };
}

async function sendViaResend(data: ContactBody): Promise<{ success: boolean; error?: string }> {
  const notifyEmail = process.env.NOTIFY_EMAIL || "info@shenghanindustrial.com";
  const r = await getResend();

  if (!r) {
    return { success: false, error: "Resend API key not configured." };
  }

  try {
    await r.emails.send({
      from: `Shenghan Website <noreply@shenghanindustrial.com>`,
      to: notifyEmail,
      replyTo: data.email,
      subject: `New inquiry from ${data.name} — Shengyu Website`,
      html: `
        <h2>New Contact Form Inquiry</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;font-family:sans-serif">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:100px">Name</td><td style="padding:8px;border-bottom:1px solid #eee">${data.name}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Phone</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Message</td><td style="padding:8px;border-bottom:1px solid #eee">${data.message.replace(/\n/g, "<br>")}</td></tr>
        </table>
        <p style="color:#888;font-size:12px;margin-top:24px">Submitted from shenghanindustrial.com contact form</p>
      `,
    });
    return { success: true };
  } catch (err) {
    console.error("Resend send error:", err);
    return { success: false, error: "Failed to send email notification." };
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const validation = validate(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { data } = validation;

    const emailResult = await sendViaResend(data);

    if (emailResult.success) {
      return NextResponse.json({ success: true, message: "Inquiry received. We will get back to you within 24 hours." });
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry received. We will get back to you within 24 hours.",
      note: emailResult.error,
    });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 });
  }
}
