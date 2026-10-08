"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

// ফেচ ফাংশন (React Query এর জন্য স্ট্যাটাস ফিল্টারসহ)
async function fetchDashboardData({ queryKey }) {
  const [, status] = queryKey;
  const url =
    status === "ALL" ? "/api/admin/sales" : `/api/admin/sales?status=${status}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch dashboard overview data");
  return res.json();
}

export default function AdminDashboardPage() {
  const [statusFilter, setStatusFilter] = useState("ALL"); // ফিল্টার স্টেট

  // ১. React Query দিয়ে ড্যাশবোর্ড ডাটা ফেচিং এবং ক্যাশ হ্যান্ডলিং
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["admin-dashboard", statusFilter],
    queryFn: fetchDashboardData,
    placeholderData: (previousData) => previousData, // ফিল্টার বদলানোর সময় আগের ডেটা ধরে রেখে স্মুথ ট্রানজিশন দেয়
    staleTime: 1000 * 60 * 3, // ৩ মিনিট পর্যন্ত ডেটা ফ্রেশ রাখবে
  });

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 font-medium animate-pulse">
          Loading dashboard overview...
        </p>
      </div>
    );
  }

  const { monthly = [], summary = {} } = data || {};

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header & Status Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Store performance metrics, order fulfillment, and sales analytics.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl self-start sm:self-auto overflow-x-auto max-w-full">
          {["ALL", "DELIVERED", "PENDING", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              disabled={isPlaceholderData}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap disabled:opacity-70 ${
                statusFilter === status
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {status === "ALL"
                ? "All Orders"
                : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl text-xl">
              💰
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Revenue
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500">Total Revenue</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {formatPrice(summary.totalRevenue || 0)}
          </p>
        </div>

        {/* Total Orders & Breakdown */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl text-xl">
              📦
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Orders
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500">Total Orders</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {summary.totalOrders || 0}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs font-semibold">
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Delivered: {summary.deliveredOrders || 0}
            </span>
            <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
              Cancelled: {summary.cancelledOrders || 0}
            </span>
          </div>
        </div>

        {/* Success Ratio */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-amber-50 text-amber-600 rounded-2xl text-xl">
              📈
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
              Ratio
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500">Success Ratio</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {summary.successRatio || "0%"}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Pending orders:{" "}
            <span className="font-semibold text-slate-600">
              {summary.pendingOrders || 0}
            </span>
          </p>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-purple-50 text-purple-600 rounded-2xl text-xl">
              📊
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
              AOV
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500">Avg. Order Value</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {formatPrice(summary.avgOrderValue || 0)}
          </p>
        </div>
      </div>

      {/* Monthly Sales Report Section */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Monthly Sales Report
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Revenue and order breakdown grouped by month (cancelled orders
              excluded from revenue).
            </p>
          </div>
        </div>

        {monthly.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No sales data available for the selected filter.
          </div>
        ) : (
          <>
            {/* Bar Chart */}
            <div className="pt-4 pb-2">
              <ResponsiveContainer width="100%" height={340}>
                <BarChart
                  data={monthly}
                  margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                      padding: "10px 14px",
                    }}
                    formatter={(value, name) =>
                      name === "total"
                        ? [formatPrice(value), "Revenue"]
                        : [value, "Orders"]
                    }
                  />
                  <Bar
                    dataKey="total"
                    fill="#0f172a"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={70}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Data Table */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="font-bold text-sm text-slate-800 mb-4">
                Detailed Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider font-semibold text-slate-400 border-b border-slate-100 bg-slate-50/50">
                      <th className="py-3 px-4 rounded-l-xl">Month</th>
                      <th className="py-3 px-4">Orders Count</th>
                      <th className="py-3 px-4 rounded-r-xl">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {monthly.map((m) => (
                      <tr
                        key={m.label}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {m.label}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                            {m.orders} {m.orders === 1 ? "Order" : "Orders"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {formatPrice(m.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
