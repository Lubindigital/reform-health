import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "ReForm Health Alliance <onboarding@resend.dev>";
const NOTIFY_EMAIL = process.env.RESEND_NOTIFY_EMAIL || "michael.lubin@reformnv.org";

export async function sendThankYouEmail({ to, name }: { to: string; name: string }) {
  if (!process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const firstName = (name || "").trim().split(" ")[0] || "there";

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Thank you for reaching out to ReForm Health Alliance",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:#0f172a;padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:600;">
                ReForm Health Alliance
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="font-size:16px;color:#1e293b;margin:0 0 16px;">
                Hi ${firstName},
              </p>
              <p style="font-size:16px;color:#475569;line-height:1.6;margin:0 0 16px;">
                Thank you for contacting the ReForm Health Alliance. We have received
                your message and a member of our team will be in touch shortly.
              </p>
              <p style="font-size:16px;color:#475569;line-height:1.6;margin:0 0 24px;">
                We are building a coalition of forward-thinking employers committed to
                transforming healthcare in Nevada. We look forward to learning more
                about how we can work together.
              </p>
              <p style="font-size:16px;color:#1e293b;margin:0;">
                Warm regards,<br/>
                <strong>The ReForm Health Alliance Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="font-size:13px;color:#94a3b8;margin:0;">
                ReForm Health Alliance
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}

interface WebinarLinkParams {
  to: string;
  firstName: string;
  eventTitle: string;
  meetingLink: string;
  /** Human-readable date/time line, e.g. "Tuesday, July 28, 2026 · 12:00 to 12:30 PM Pacific Time" */
  whenLabel: string;
  /** Optional .ics content; when present it is attached as an invite. */
  icsContent?: string | null;
  /** Optional "add to Google Calendar" link. */
  googleCalendarUrl?: string | null;
}

export async function sendWebinarLinkEmail({
  to,
  firstName,
  eventTitle,
  meetingLink,
  whenLabel,
  icsContent,
  googleCalendarUrl,
}: WebinarLinkParams) {
  if (!process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const name = (firstName || "").trim() || "there";

  const calendarButton = googleCalendarUrl
    ? `<tr><td style="padding:8px 0 0;"><a href="${googleCalendarUrl}" style="font-size:14px;color:#1d4ed8;text-decoration:none;font-weight:600;">Add to Google Calendar</a></td></tr>`
    : "";

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `You're registered: ${eventTitle}`,
    attachments: icsContent
      ? [
          {
            filename: "reform-webinar.ics",
            content: Buffer.from(icsContent, "utf-8"),
          },
        ]
      : undefined,
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:#0a193c;padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:600;">ReForm Health Alliance</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="font-size:16px;color:#1e293b;margin:0 0 16px;">Hi ${name},</p>
              <p style="font-size:16px;color:#475569;line-height:1.6;margin:0 0 24px;">
                You're registered for <strong>${eventTitle}</strong>. Here are your details.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin:0 0 24px;">
                <tr><td style="padding:20px 24px;">
                  <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">When</p>
                  <p style="margin:0 0 16px;font-size:15px;color:#1e293b;">${whenLabel}</p>
                  <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Join link</p>
                  <a href="${meetingLink}" style="font-size:15px;color:#1d4ed8;text-decoration:none;word-break:break-all;">${meetingLink}</a>
                  ${calendarButton}
                </td></tr>
              </table>
              <a href="${meetingLink}" style="display:inline-block;background-color:#1d4ed8;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:13px 26px;border-radius:8px;">Join the Webinar</a>
              <p style="font-size:14px;color:#94a3b8;line-height:1.6;margin:24px 0 0;">
                Save this email so you have the link handy. See you there.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="font-size:13px;color:#94a3b8;margin:0;">ReForm Health Alliance · Reno, Nevada</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}

interface RegistrationNotifyParams {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  eventTitle: string;
}

export async function sendRegistrationNotification(data: RegistrationNotifyParams) {
  if (!process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");

  await resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFY_EMAIL,
    subject: `New Webinar Registration: ${fullName}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="background-color:#0a193c;padding:24px 40px;">
          <h1 style="color:#ffffff;margin:0;font-size:18px;font-weight:600;">New Webinar Registration</h1>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Event</td></tr>
            <tr><td style="padding:0 0 16px;color:#1e293b;font-size:16px;">${data.eventTitle}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Name</td></tr>
            <tr><td style="padding:0 0 16px;color:#1e293b;font-size:16px;">${fullName}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Company</td></tr>
            <tr><td style="padding:0 0 16px;color:#1e293b;font-size:16px;">${data.company}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Email</td></tr>
            <tr><td style="padding:0 0 16px;color:#1e293b;font-size:16px;"><a href="mailto:${data.email}" style="color:#2563eb;">${data.email}</a></td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

interface NotifyParams {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  type?: string;
  message?: string;
  source: string;
}

export async function sendNotificationEmail(data: NotifyParams) {
  if (!process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFY_EMAIL,
    subject: `New ${data.source === "chatbot" ? "Chatbot" : "Form"} Lead: ${data.name}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:#0f172a;padding:24px 40px;">
              <h1 style="color:#ffffff;margin:0;font-size:18px;font-weight:600;">
                New Lead — ReForm Health Alliance
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Name</td></tr>
                <tr><td style="padding:0 0 16px;color:#1e293b;font-size:16px;">${data.name}</td></tr>
                <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Email</td></tr>
                <tr><td style="padding:0 0 16px;color:#1e293b;font-size:16px;"><a href="mailto:${data.email}" style="color:#2563eb;">${data.email}</a></td></tr>
                ${data.company ? `<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Organization</td></tr>
                <tr><td style="padding:0 0 16px;color:#1e293b;font-size:16px;">${data.company}</td></tr>` : ""}
                ${data.phone ? `<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Phone</td></tr>
                <tr><td style="padding:0 0 16px;color:#1e293b;font-size:16px;">${data.phone}</td></tr>` : ""}
                ${data.type ? `<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Type</td></tr>
                <tr><td style="padding:0 0 16px;color:#1e293b;font-size:16px;">${data.type}</td></tr>` : ""}
                ${data.message ? `<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Message</td></tr>
                <tr><td style="padding:0 0 16px;color:#1e293b;font-size:16px;line-height:1.5;">${data.message}</td></tr>` : ""}
                <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Source</td></tr>
                <tr><td style="padding:0 0 16px;color:#1e293b;font-size:16px;">${data.source === "chatbot" ? "AI Chatbot" : "Contact Form"}</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}
