import { NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "17861629313@163.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body;

    // Validate required fields
    if (!name || !phone || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // If no API key configured, just log and return success
    if (!RESEND_API_KEY) {
      console.log("Contact form submission (no email sent — RESEND_API_KEY not set):", {
        name,
        phone,
        email,
        message,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, mode: "log-only" });
    }

    // Send email via Resend
    const resend = new Resend(RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: `${name} <onboarding@resend.dev>`,
      to: [NOTIFY_EMAIL],
      subject: `New Inquiry from ${name} — Shenghan Industrial Website`,
      replyTo: email,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #F7F6F3;">
          <div style="background: #0A1628; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #C8A14C; font-size: 20px; margin: 0;">Shenghan Industrial</h1>
            <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 4px 0 0;">New Contact Form Inquiry</p>
          </div>
          <div style="background: #fff; padding: 24px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px 0; color: #9BA1AA; font-size: 13px; width: 80px;">Name</td><td style="padding: 10px 0; color: #1A1D24; font-size: 15px; font-weight: 600;">${name}</td></tr>
              <tr><td style="padding: 10px 0; color: #9BA1AA; font-size: 13px;">Phone</td><td style="padding: 10px 0; color: #1A1D24; font-size: 15px; font-weight: 600;">${phone}</td></tr>
              <tr><td style="padding: 10px 0; color: #9BA1AA; font-size: 13px;">Email</td><td style="padding: 10px 0; color: #1A1D24; font-size: 15px; font-weight: 600;">${email}</td></tr>
            </table>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #9BA1AA; font-size: 13px; margin-bottom: 8px;">Message</p>
              <p style="color: #1A1D24; font-size: 14px; line-height: 1.6; margin: 0;">${message}</p>
            </div>
          </div>
          <p style="color: #bbb; font-size: 11px; text-align: center; margin-top: 16px;">
            Submitted ${new Date().toLocaleString("en-US")} from Shenghan Industrial website
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
