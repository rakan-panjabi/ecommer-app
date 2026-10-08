"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) return <div className="min-h-[80vh]">{children}</div>;

  return (
    <div className="min-h-[80vh] max-w-7xl mx-auto py-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-8">
   
      {/* Sidebar: Mobile এ ফুল উইথ বা ড্রপডাউন হিসেবে কাজ করবে, ডেসিমাল স্ক্রিনে সাইডবার থাকবে */}
      <aside className="w-full">
        <AdminSidebar />
      </aside>
      <main className="w-full overflow-x-hidden">{children}</main>
    </div>
  );
}
