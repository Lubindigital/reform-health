import { NextRequest, NextResponse } from "next/server";
import { createPrivateDocument } from "@/sanity/lib/writeClient";
import { sendThankYouEmail, sendNotificationEmail } from "@/lib/email";
import { verifyTurnstile, clientIp } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { name, company, email, phone, type, message, turnstileToken, website } = data;

  // Honeypot: real users never fill this hidden field. Silently accept and drop.
  if (typeof website === "string" && website.trim()) {
    console.warn(`[contact] honeypot triggered; dropping submission from ${email || "unknown"}`);
    return NextResponse.json({ success: true });
  }

  // Bot check. Fails open until TURNSTILE_SECRET_KEY is configured.
  const human = await verifyTurnstile(turnstileToken, clientIp(request));
  if (!human) {
    console.warn(`[contact] Turnstile verification failed for ${email || "unknown"}`);
    return NextResponse.json(
      { success: false, error: "Verification failed. Please try again." },
      { status: 400 },
    );
  }

  const formspreeAction =
    process.env.FORMSPREE_ACTION || "https://formspree.io/f/xkoprobn";

  const results = await Promise.allSettled([
    // 1. Formspree notification backup
    fetch(formspreeAction, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, company, email, phone, type, message }),
    }),

    // 2. Save to Sanity CRM (as a draft — the dataset is public, see writeClient)
    createPrivateDocument({
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

  // Surface sink failures so a lost lead is debuggable instead of silently returning success.
  const steps = ["formspree", "sanity-write", "thankyou-email", "notify-email"];
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`[contact] ${steps[i]} failed for ${email || "unknown"}:`, r.reason);
    }
  });

  return NextResponse.json({ success: true });
}
