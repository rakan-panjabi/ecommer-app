"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, formatDate } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED",
];

const STATUS_BADGES = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  RETURNED: "bg-orange-50 text-orange-700 border-orange-200",
  REFUNDED: "bg-rose-50 text-rose-700 border-rose-200",
};

async function fetchOrderDetails({ queryKey }) {
  const [, id] = queryKey;
  const res = await fetch(`/api/orders/${id}`);
  if (!res.ok) throw new Error("Failed to fetch order details");
  return res.json();
}

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: fetchOrderDetails,
    enabled: !!id,
    staleTime: 1000 * 60 * 3,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus) => {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Order status updated successfully!");

      queryClient.invalidateQueries({ queryKey: ["admin-order", id] });

      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });

      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update status");
    },
  });

  if (isLoading || !order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 font-medium animate-pulse">
          Loading order details...
        </p>
      </div>
    );
  }

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shippingCost = order.total - subtotal > 0 ? order.total - subtotal : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-3">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/admin/orders"
          className="text-slate-500 hover:text-slate-900 text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
        >
          ← Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Order Details
            </h1>
            <p className="text-sm font-mono text-slate-400 mt-0.5">
              ID: {order.id}
            </p>
          </div>

          {/* Status Change Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Update Status:
            </span>
            <select
              value={order.status}
              onChange={(e) => updateStatusMutation.mutate(e.target.value)}
              disabled={updateStatusMutation.isPending}
              className={`bg-white border text-xs font-bold uppercase rounded-xl px-4 py-2.5 outline-none shadow-sm transition-all cursor-pointer disabled:opacity-50 ${
                STATUS_BADGES[order.status] || "border-slate-200 text-slate-700"
              }`}
            >
              {STATUSES.map((s) => (
                <option
                  key={s}
                  value={s}
                  className="bg-white text-slate-900 font-medium"
                >
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Ordered Items & Cost Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            <h2 className="font-bold text-slate-900 text-lg mb-6">
              Ordered Items
            </h2>

            <div className="space-y-4 divide-y divide-slate-50">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between pt-4 first:pt-0"
                >
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="relative w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                      {item.product?.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product?.name || "Product"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm md:text-base">
                        {item.product?.name || "Product Name"}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Total */}
                  <span className="font-bold text-slate-900 text-sm md:text-base">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="border-t border-slate-100 mt-6 pt-6 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Cost</span>
                <span className="font-medium">{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-lg text-slate-900 pt-3 border-t border-slate-100">
                <span>Total Amount</span>
                <span className="text-slate-900">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Customer & Delivery Info */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
            <div>
              <h2 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">
                Customer Information
              </h2>
              <div className="space-y-1.5 text-sm">
                <p className="font-bold text-slate-900 text-base">
                  {order.customerName}
                </p>
                <p className="text-slate-500">{order.email}</p>
                <p className="text-slate-500">📞 {order.phone}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h2 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">
                Delivery Address
              </h2>
              <p className="text-sm text-slate-600">
                {order.address}, {order.city}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h2 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">
                Order Meta
              </h2>
              <p className="text-sm text-slate-600">
                Placed on{" "}
                <span className="font-semibold text-slate-800">
                  {formatDate(order.createdAt)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
