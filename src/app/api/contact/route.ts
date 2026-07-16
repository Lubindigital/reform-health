import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";
import { sendThankYouEmail, sendNotificationEmail } from "@/lib/email";
import { verifyTurnstile, clientIp } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { name, company, email, phone, type, message, turnstileToken, website } = data;

  // Honeypot: real users never fill this hidden field. Silently accept and drop.
  if (typeof website === "string" && website.trim()) {
    return NextResponse.json({ success: true });
  }

  // Bot check. Fails open until TURNSTILE_SECRET_KEY is configured.
  const human = await verifyTurnstile(turnstileToken, clientIp(request));
  if (!human) {
    return NextResponse.json(
      { success: false, error: "Verification failed. Please try again." },
      { status: 400 },
    );
  }

  const formspreeAction =
    process.env.FORMSPREE_ACTION || "https://formspree.io/f/xkoprobn";

  await Promise.allSettled([
    // 1. Formspree notification backup
    fetch(formspreeAction, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, company, email, phone, type, message }),
    }),

    // 2. Save to Sanity CRM
    writeClient.create({
      _type: "contact",
      name: name || "",
      email: email || "",
      company: company || "",
      phone: phone || "",
      type: type || "",
      message: message || "",
      source: "contact-form",
      submittedAt: new Date().toISOString(),
    }),

    // 3. Send thank-you email to respondent
    sendThankYouEmail({ to: email, name }),

    // 4. Notify Michael about the new lead
    sendNotificationEmail({ name, email, company, phone, type, message, source: "contact-form" }),
  ]);

  return NextResponse.json({ success: true });
}
