import { NextResponse, type NextRequest } from "next/server";

/**
 * Host-based behaviour that next.config.ts cannot do behind Project Cloud's
 * edge. The edge rewrites the Host header on the way to the app, so the
 * `has: [{ type: "host" }]` rules in next.config.ts never fire there (checked
 * live 2026-11-10: reformnv.org served 200 instead of redirecting to www, and
 * the generated address had no X-Robots-Tag). The original host is read from
 * X-Forwarded-Host first and Host second.
 *
 *  - reformnv.org -> 308 to https://www.reformnv.org/<path>
 *    Vercel did this at the domain level; off Vercel the app does it.
 *  - The platform's generated *.ivyup.io (or *.vercel.app) address serves the
 *    same pages as www: X-Robots-Tag: noindex keeps it out of search results.
 */
const CANONICAL = "www.reformnv.org";
const GENERATED = /\.(ivyup\.io|vercel\.app)$/i;

function effectiveHost(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-host");
  const raw = (forwarded ? forwarded.split(",")[0] : req.headers.get("host")) ?? "";
  return raw.trim().split(":")[0].toLowerCase();
}

export function proxy(req: NextRequest) {
  const host = effectiveHost(req);

  if (host === "reformnv.org") {
    const url = new URL(req.nextUrl.pathname + req.nextUrl.search, `https://${CANONICAL}`);
    return NextResponse.redirect(url, 308);
  }

  const res = NextResponse.next();
  if (host !== CANONICAL && GENERATED.test(host)) {
    res.headers.set("X-Robots-Tag", "noindex");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
