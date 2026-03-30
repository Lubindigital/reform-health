import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { name, company, email, phone, type, message } = data;

  // Split name into first/last
  const nameParts = (name || "").trim().split(" ");
  const firstname = nameParts[0] || "";
  const lastname = nameParts.slice(1).join(" ") || "";

  // 1. Send to Formspree as backup/notification
  const formspreeAction = process.env.FORMSPREE_ACTION || "https://formspree.io/f/xkoprobn";
  try {
    await fetch(formspreeAction, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, company, email, phone, type, message }),
    });
  } catch {
    // Non-blocking — continue even if Formspree fails
  }

  // 2. Create/update contact in HubSpot
  const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;
  if (hubspotToken) {
    try {
      await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${hubspotToken}`,
        },
        body: JSON.stringify({
          properties: {
            firstname,
            lastname,
            email,
            phone: phone || "",
            company: company || "",
            message: message || "",
            hs_lead_status: "NEW",
          },
        }),
      });
    } catch {
      // If contact already exists, try update by email
      try {
        await fetch(
          `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${hubspotToken}`,
            },
            body: JSON.stringify({
              properties: {
                firstname,
                lastname,
                phone: phone || "",
                company: company || "",
                message: message || "",
              },
            }),
          }
        );
      } catch {
        // Log but don't fail
        console.error("HubSpot update failed");
      }
    }
  }

  return NextResponse.json({ success: true });
}
