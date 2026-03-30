import Image from "next/image";
import Link from "next/link";
import { CONTACT, SOCIAL_LINKS } from "@/lib/constants";

const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case "LinkedIn":
      return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
    case "Twitter":
      return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
    case "Facebook":
      return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
    default:
      return null;
  }
};

export function Footer() {
  return (
    <footer className="bg-gray-900 pt-16 text-white/50">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_0.8fr_1fr] gap-12 pb-12 border-b border-white/[0.06]">
          <div>
            <Image src="/logo.png" alt="ReForm Health Alliance" width={140} height={40} className="h-[40px] w-auto grayscale invert opacity-70" />
            <p className="mt-4 text-sm leading-relaxed">A collective of leading Nevada organizations disrupting the health insurance status quo.</p>
            <div className="flex gap-3 mt-5">
              {SOCIAL_LINKS.map((link) => {
                return (
                  <a
                    key={link.platform}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                );
              })}
            </div>
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
