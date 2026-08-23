"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/products", label: "Products", icon: "🛒" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="bg-white border border-slate-200 rounded-xl p-4 h-fit">
      <h2 className="font-bold text-slate-900 px-2 mb-4">Admin Panel</h2>
      <nav className="space-y-1">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                active ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 mt-4 border-t border-slate-200 pt-4"
      >
        🚪 Logout
      </button>
      <Link href="/" className="block px-3 py-2 text-xs text-slate-400 hover:text-brand mt-1">
        ← Back to store
      </Link>
    </aside>
  );
}
