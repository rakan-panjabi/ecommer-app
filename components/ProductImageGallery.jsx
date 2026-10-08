"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductImageGallery({ image, name }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm lg:sticky lg:top-24 w-full">
      {image ? (
        <>
          {/* ইমেজ লোড হওয়ার আগ পর্যন্ত প্রিমিয়াম অ্যানিমেটেড লোডার ও ব্যাকগ্রাউন্ড */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 animate-pulse z-10 gap-2">
              <div className="w-8 h-8 border-4 border-slate-300 border-t-black rounded-full animate-spin"></div>
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                Loading...
              </span>
            </div>
          )}

          <Image
            src={image}
            alt={name || "Product Image"}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            onLoad={() => setImageLoaded(true)}
            className={`object-cover transition-opacity duration-500 ease-in-out hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium text-sm">
          No Image Available
        </div>
      )}
    </div>
  );
}
