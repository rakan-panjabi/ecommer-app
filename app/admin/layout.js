"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) return <div className="min-h-[80vh]">{children}</div>;

  return (
    <div className="min-h-[80vh] max-w-7xl mx-auto py-8 grid md:grid-cols-[220px_1fr] gap-8">
      <AdminSidebar />
      <div>{children}</div>
    </div>
  );
}
