import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Thank You | ReForm Health Alliance",
};

export default function ThankYouPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-32 pb-20">
        <div className="text-center max-w-md px-6">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-gray-500 leading-relaxed mb-8">
            Your message has been received. We&apos;ll be in touch with you shortly to discuss how you can be part of the ReForm Health Alliance.
          </p>
          <Link href="/" className="inline-block bg-navy text-white px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors">
            Back to Home
          </Link>
        </div>
      </main>
    </>
  );
}
