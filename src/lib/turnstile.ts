// Server-side Cloudflare Turnstile verification.
//
// Fails OPEN until TURNSTILE_SECRET_KEY is configured, so the site keeps working
// exactly as before while the keys are being set up. Once the secret is present,
// a missing or invalid token is rejected.

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // No secret configured yet → protection is off, let submissions through.
  if (!secret) return true;

  // Secret is set, so a token is required.
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // Verification endpoint unreachable (e.g. Cloudflare hiccup). Fail open so a
    // transient outage never blocks a real lead.
    return true;
  }
}

/** Best-effort client IP from the request, for Turnstile's optional remoteip. */
export function clientIp(request: Request): string | undefined {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0]?.trim() : undefined;
}
