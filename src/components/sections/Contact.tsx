"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Phone, MapPin } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { FadeUp } from "@/components/motion/FadeUp";

export function Contact() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/thank-you");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="tag">Get Involved</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Join the Alliance
            </h2>
            <p className="text-gray-500 leading-relaxed mb-9">
              Whether you&apos;re a large employer, a small business, an independent provider or benefits consultant&mdash; we want to hear from you. Together, we&apos;re stronger.
            </p>

            <div className="flex flex-col gap-6">
              {[
                { icon: Phone, label: "Phone", value: CONTACT.phone, href: CONTACT.phoneHref },
                { icon: MapPin, label: "Location", value: CONTACT.location },
              ].map((item, i) => (
                <FadeUp key={item.label} delay={i * 0.1}>
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 bg-navy/[0.06] rounded-lg flex items-center justify-center text-navy flex-shrink-0">
                      <item.icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <strong className="block text-xs uppercase tracking-wider text-gray-400 mb-1">{item.label}</strong>
                      {item.href ? (
                        <a href={item.href} className="text-gray-900 font-semibold hover:text-navy transition-colors">{item.value}</a>
                      ) : (
                        <span className="text-gray-600 text-sm">{item.value}</span>
                      )}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="bg-off-white border border-gray-100 rounded-2xl p-9"
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input type="text" name="name" required placeholder="Full Name" className="w-full px-3.5 py-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all" />
                <input type="text" name="company" required placeholder="Organization" className="w-full px-3.5 py-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input type="email" name="email" required placeholder="Email" className="w-full px-3.5 py-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all" />
                <input type="tel" name="phone" placeholder="Phone" className="w-full px-3.5 py-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all" />
              </div>
              <select name="type" className="w-full px-3.5 py-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all appearance-none mb-4">
                <option value="">I am a...</option>
                <option value="employer">Employer / HR Leader</option>
                <option value="consultant">Benefit Consultant</option>
                <option value="provider">Healthcare Provider</option>
                <option value="other">Other / General Inquiry</option>
              </select>
              <textarea name="message" rows={4} placeholder="Tell us about your organization and interest in the alliance..." className="w-full px-3.5 py-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all resize-y min-h-[100px] mb-5" />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-navy text-white py-3.5 rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
