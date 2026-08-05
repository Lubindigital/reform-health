import "../globals.css";

/**
 * Root layout for the embedded Sanity Studio.
 *
 * Deliberately separate from the site layout in `(site)/layout.tsx`. Sanity
 * requires that <SanityLive /> and <VisualEditing /> never mount inside the
 * Studio route, and a single shared root layout made that impossible. Splitting
 * into route groups also stops the marketing chat widget, Vercel Analytics and
 * the LinkedIn/GA4/Clarity tags from loading inside the CMS, which they did
 * before — those fired a pageview every time an editor opened Studio.
 *
 * Route groups don't affect URLs: this still serves /studio.
 */
export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
