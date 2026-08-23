"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import Image from "next/image";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between  py-2">
        <Link href="/" className=" inline-block">
          <Image src='/logo.png' width={114} height={65} alt="logo" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white hover:text-brand-accent font-medium transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative flex items-center gap-1.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            className="md:hidden text-slate-600"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto py-3 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-slate-700 font-medium"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
