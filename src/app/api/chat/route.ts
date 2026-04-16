import { streamText, convertToModelMessages, UIMessage, tool } from "ai";
import { z } from "zod";
import { SITE_CONTEXT } from "@/data/site-context";
import { writeClient } from "@/sanity/lib/writeClient";
import { sendThankYouEmail, sendNotificationEmail } from "@/lib/email";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "anthropic/claude-sonnet-4.6",
    system: `You are a team member of the ReForm Health Alliance speaking on behalf of the organization. Always use first-person language: "we", "our", "us". Never refer to ReForm in the third person — you ARE ReForm.

If a visitor expresses interest in joining, learning more, or getting in touch, encourage them to share their name, email, and company so you can connect them with our team. When they provide contact information, use the captureLeadInfo tool to save it.

Here is everything about us:

${SITE_CONTEXT}

Guidelines:
- Always speak as ReForm: "We believe...", "Our mission is...", "We bring together..."
- Never use bold/italic markdown formatting. Use plain text only. Put quotes around any taglines or direct quotes.
- Only answer questions related to ReForm Health Alliance, healthcare, and employer benefits.
- If asked something outside your knowledge, suggest the visitor reach out to us directly.
- Keep responses very short — 1-2 sentences max. Be direct and to the point.
- Be warm and professional — you are the voice of the alliance.`,
    messages: await convertToModelMessages(messages),
    tools: {
      captureLeadInfo: tool({
        description:
          "Capture a lead's contact information when they express interest in ReForm Health Alliance. Call this when the user provides their name, email, or company.",
        inputSchema: z.object({
          name: z.string().describe("The visitor's full name"),
          email: z.string().email().describe("The visitor's email address"),
          company: z.string().optional().describe("The visitor's company or organization"),
          phone: z.string().optional().describe("The visitor's phone number"),
        }),
        execute: async ({ name, email, company, phone }) => {
          const formspreeAction =
            process.env.FORMSPREE_ACTION || "https://formspree.io/f/xkoprobn";

          await Promise.allSettled([
            // Save to Sanity CRM
            writeClient.create({
              _type: "contact",
              name: name || "",
              email: email || "",
              company: company || "",
              phone: phone || "",
              source: "chatbot",
              submittedAt: new Date().toISOString(),
            }),

            // Formspree notification
            fetch(formspreeAction, {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify({
                _subject: `New Chatbot Lead: ${name}`,
                name,
                email,
                company: company || "Not provided",
                phone: phone || "Not provided",
                source: "AI Chatbot",
              }),
            }),

            // Thank-you email
            sendThankYouEmail({ to: email, name }),

            // Notify Michael about the new lead
            sendNotificationEmail({ name, email, company, phone, source: "chatbot" }),
          ]);

          return { success: true, message: `Contact info saved for ${name}` };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
