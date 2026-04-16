import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ChatWidget from "@/components/chat/ChatWidget";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ReForm Health Alliance | Nevada Employer Coalition for Better Healthcare",
  description:
    "ReForm Health Alliance is a collective of leading Nevada organizations disrupting the health insurance status quo to deliver better care and benefits at sustainably lower costs.",
  keywords: [
    "Nevada employer coalition",
    "healthcare reform Nevada",
    "employer health benefits",
    "high performing health plans",
    "healthcare costs Reno NV",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.reformnv.org/" },
  openGraph: {
    title: "ReForm Health Alliance | Better Care. Lower Costs. Stronger Communities.",
    description: "A collective of leading Nevada organizations disrupting the health insurance status quo.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ReForm Health Alliance",
              description: "Nevada employer coalition disrupting the health insurance status quo",
              telephone: "775-636-5005",
              url: "https://www.reformnv.org",
              address: { "@type": "PostalAddress", addressLocality: "Reno", addressRegion: "NV", addressCountry: "US" },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Analytics />
        <ChatWidget />
      </body>
    </html>
  );
}
