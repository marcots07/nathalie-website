import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
  website?: string; // honeypot
  locale?: string;
};

export async function POST(req: Request) {
  let body: ContactBody;
  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, message, website, locale } = body;

  // Honeypot: silently accept (204-ish) so bots think they succeeded.
  if (website && website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (
    !name ||
    !email ||
    !message ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid fields" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "nathaliegp1411@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey) {
    // Don't leak configuration state to the client, but log for the operator.
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json(
      { ok: false, error: "Email service is not configured" },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);
  const subject =
    locale === "en"
      ? `New message from ${name} (nathaliegonzalez.com)`
      : `Nuevo mensaje de ${name} (nathaliegonzalez.com)`;

  try {
    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text: `From: ${name} <${email}>\nLocale: ${locale ?? "unknown"}\n\n${message}`,
    });
    if (result.error) {
      console.error("Resend error", result.error);
      return NextResponse.json(
        { ok: false, error: "Failed to send" },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend threw", err);
    return NextResponse.json(
      { ok: false, error: "Failed to send" },
      { status: 502 }
    );
  }
}
