"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] py-2" : "bg-transparent py-3.5"}`}>
      <div className="max-w-[1120px] mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="block">
          <Image src="/logo-transparent.svg" alt="ReForm Health Alliance" width={180} height={50} className="h-[50px] w-auto" priority />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors ${scrolled ? "text-gray-500 hover:text-navy" : "text-white/80 hover:text-white"}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/#contact" className="bg-navy text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors">
            Join ReForm
          </Link>
        </div>

        <button className="lg:hidden flex flex-col gap-[5px] p-1.5 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <motion.span animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className={`block w-6 h-0.5 ${scrolled ? "bg-gray-700" : "bg-white"}`} />
          <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className={`block w-6 h-0.5 ${scrolled ? "bg-gray-700" : "bg-white"}`} />
          <motion.span animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className={`block w-6 h-0.5 ${scrolled ? "bg-gray-700" : "bg-white"}`} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setMenuOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 w-[280px] h-screen bg-white z-50 shadow-xl pt-20 px-6 lg:hidden">
              <ul className="flex flex-col">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={() => setMenuOpen(false)} className="block py-3.5 text-gray-700 text-base font-medium border-b border-gray-100">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-4">
                  <Link href="/#contact" onClick={() => setMenuOpen(false)} className="block bg-navy text-white text-center py-3.5 px-5 rounded-lg font-semibold">
                    Join ReForm
                  </Link>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
