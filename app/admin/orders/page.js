"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_BADGES = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    limit: 5,
  });

  function loadOrders(pageNum = 1, currentStatus = status) {
    setLoading(true);
    fetch(`/api/orders?status=${currentStatus}&page=${pageNum}&limit=5`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data?.data || []);
        if (data?.pagination) {
          setPagination(data.pagination);
          setPage(data.pagination.page);
        }
        setLoading(false);
      });
  }

  // স্ট্যাটাস পরিবর্তন হলে প্রথম পেজ থেকে ডাটা লোড হবে
  useEffect(() => {
    setPage(1);
    loadOrders(1, status);
  }, [status]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage and track all customer orders and fulfillment statuses.
          </p>
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Filter:
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-xl px-3 sm:px-4 py-2 outline-none focus:border-slate-400 shadow-sm transition-all w-full sm:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm">
        {loading ? (
          <div className="py-16 text-center">
            <p className="text-slate-500 text-sm font-medium animate-pulse">
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No orders found for this filter.
          </div>
        ) : (
          <div>
            {/* Scrollable wrapper for table */}
            <div className="w-full overflow-x-auto pb-2">
              <table className="w-full text-sm text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="text-xs uppercase tracking-wider font-semibold text-slate-400 border-b border-slate-200 bg-slate-50/70">
                    <th className="py-3.5 px-4 sm:px-6">Customer</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-4 px-4 sm:px-6">
                        <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                          {o.customerName}
                        </p>
                        <p className="text-slate-400 text-[11px] sm:text-xs mt-0.5 truncate max-w-[180px]">
                          {o.email}
                        </p>
                      </td>

                      <td className="py-4 px-4 text-slate-600 font-medium text-xs sm:text-sm whitespace-nowrap">
                        {formatDate(o.createdAt)}
                      </td>

                      <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-[11px] sm:text-xs font-medium">
                          {o.items.length}{" "}
                          {o.items.length === 1 ? "Item" : "Items"}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                        {formatPrice(o.total)}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold border uppercase tracking-wider inline-block ${
                            STATUS_BADGES[o.status] ||
                            "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all shadow-sm"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50/70 rounded-b-2xl sm:rounded-b-3xl">
                <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
                  Showing page{" "}
                  <span className="font-bold text-slate-700">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-700">
                    {pagination.totalPages}
                  </span>{" "}
                  (Total {pagination.total} orders)
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                  <button
                    onClick={() => loadOrders(page - 1, status)}
                    disabled={page <= 1}
                    className="flex-1 sm:flex-initial px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => loadOrders(page + 1, status)}
                    disabled={page >= pagination.totalPages}
                    className="flex-1 sm:flex-initial px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
