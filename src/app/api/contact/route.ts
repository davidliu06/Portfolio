import { NextResponse } from "next/server";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; email?: string; message?: string };
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY || !toEmail) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Contact form is not configured in this environment. Add RESEND_API_KEY and CONTACT_TO_EMAIL to Vercel, .env.local, or .env."
      },
      { status: 503 }
    );
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const safeName = escapeHtml(body.name);
    const safeEmail = escapeHtml(body.email);
    const safeMessage = escapeHtml(body.message);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: toEmail,
      subject: `Portfolio message from ${body.name}`,
      replyTo: body.email,
      text: `Name: ${body.name}\nEmail: ${body.email}\n\n${body.message}`,
      html: `
        <div>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p style="white-space:pre-wrap">${safeMessage}</p>
        </div>
      `
    });

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: `Resend rejected the message: ${error.message}. Check your Resend sender/domain verification and CONTACT_FROM_EMAIL.`
        },
        { status: 502 }
      );
    }
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to send message through Resend. Check RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL."
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
