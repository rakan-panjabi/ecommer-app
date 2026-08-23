import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

async function getCategories() {
  try {
    const products = await prisma.product.findMany({
      select: { category: true },
    });
    // ইউনিক ক্যাটেগরি বের করে শুধু প্রথম ৪/৫টি নেওয়া হলো
    const uniqueCategories = [
      ...new Set(products.map((p) => p.category)),
    ].filter(Boolean);
    return uniqueCategories.slice(0, 5);
  } catch (error) {
    // ডাটাবেজ কানেকশন ফেইল করলে ফলব্যাক ক্যাটেগরি দেখাবে
    return ["Panjabi", "Attar", "Tupi"];
  }
}

export default async function Footer() {
  const categories = await getCategories();

  return (
    <footer className="bg-black text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & Bio */}
        <div className="md:col-span-1 space-y-4">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              width={114}
              height={50}
              alt="Rakan Logo"
              className="object-contain"
            />
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed">
            Premium quality Panjabi, Attar, and traditional essentials. Designed
            for your everyday comfort and style.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-base tracking-wide">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                href="/products"
                className="hover:text-brand-accent transition-colors"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-brand-accent transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-brand-accent transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Dynamic Categories (Max 4-5 items) */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-base tracking-wide">
            Categories
          </h4>
          <ul className="space-y-2.5 text-sm">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className="hover:text-brand-accent transition-colors capitalize"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-base tracking-wide">
            Contact Us
          </h4>
          <div className="space-y-3 text-sm text-slate-400">
            <p className="flex items-start gap-2">
              <span className="text-brand-accent mt-0.5">📍</span>
              <span>
                West Nakhalpara , Baitul Atik Jam-E-Masjid (Chapra Masjid),
                Tejgaon, dhaka-1215
              </span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-brand-accent">📞</span>
              <a
                href="tel:01577128893"
                className="hover:text-white transition-colors"
              >
                01577-128893
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-brand-accent">✉️</span>
              <a
                href="mailto:rakanfabric@gmail.com"
                className="hover:text-white transition-colors"
              >
                rakanfabric@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()}{" "}
            <strong className="text-white">Rakan</strong>. All rights reserved.
          </p>
          <p className="text-slate-500">
            Crafted with care for your fashion store.
          </p>
        </div>
      </div>
    </footer>
  );
}
