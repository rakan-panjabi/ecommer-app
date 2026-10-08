"use client";

import { useState, useEffect } from "react";

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hideLoader = () => setIsLoading(false);

    if (document.readyState === "complete") {
      setIsLoading(false);
    } else {
      window.addEventListener("load", hideLoader, { once: true });
    }

    const safetyTimer = setTimeout(hideLoader, 300);

    return () => {
      window.removeEventListener("load", hideLoader);
      clearTimeout(safetyTimer);
    };
  }, []);

  if (!isLoading) return null; 

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white backdrop-blur-md transition-opacity duration-300">
      <div className="flex flex-col items-center gap-4">
        {/* স্পিনারের বর্ডার আরও প্রমিনেন্ট ও গাঢ় করা হলো */}
        <div className="w-16 h-16 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-900 tracking-widest uppercase">
          Loading Rakan...
        </p>
      </div>
    </div>
  );
}
