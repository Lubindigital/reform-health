import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-gray-900 pt-16 text-white/50">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_0.8fr_1fr] gap-12 pb-12 border-b border-white/[0.06]">
          <div>
            <Image src="/logo.png" alt="ReForm Health Alliance" width={140} height={40} className="h-[40px] w-auto grayscale invert opacity-70" />
            <p className="mt-4 text-sm leading-relaxed">A collective of leading Nevada organizations disrupting the health insurance status quo.</p>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-[2px] mb-5">Alliance</h4>
            <ul className="space-y-2.5">
              {[{ label: "About", href: "/#about" }, { label: "Beliefs", href: "/#beliefs" }, { label: "Initiatives", href: "/#initiatives" }, { label: "Membership", href: "/#membership" }].map((item) => (
                <li key={item.label}><Link href={item.href} className="text-sm hover:text-navy-light transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-[2px] mb-5">Resources</h4>
            <ul className="space-y-2.5">
              <li><Link href="/blog" className="text-sm hover:text-navy-light transition-colors">Insights</Link></li>
              <li><Link href="/#contact" className="text-sm hover:text-navy-light transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-[2px] mb-5">Contact</h4>
            <div className="space-y-2 text-sm">
              <p><a href={CONTACT.phoneHref} className="hover:text-navy-light transition-colors">{CONTACT.phone}</a></p>
              <p>{CONTACT.location}</p>
            </div>
          </div>
        </div>
        <div className="py-6 text-center text-xs">
          <p>&copy; 2026 ReForm Health Alliance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
