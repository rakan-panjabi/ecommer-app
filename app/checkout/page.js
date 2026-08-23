"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, updateQuantity } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });
  const [shippingArea, setShippingArea] = useState("inside"); // inside | outside
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Delivery charge calculation
  const shippingCost = shippingArea === "inside" ? 60 : 120;
  const finalTotal = totalPrice + shippingCost;

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const toastId = toast.loading("Placing your order...");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          shippingCost,
          totalAmount: finalTotal,
          paymentMethod: "Cash on Delivery",
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      toast.success("Order placed successfully!", { id: toastId });
      clearCart();
      router.push(`/order-success/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400 text-3xl">
          🛒
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Your cart is empty
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-sm"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="border-b border-slate-100 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Checkout
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete your details to finish your order.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Billing & Shipping Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
            Shipping Details
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                required
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 text-sm"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                required
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 text-sm"
                placeholder="017xxxxxxxx"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 text-sm"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                City / Area
              </label>
              <input
                required
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 text-sm"
                placeholder="Dhaka"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Full Address
            </label>
            <textarea
              required
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 text-sm resize-none"
              placeholder="House, Road, Area, Thana..."
            />
          </div>

          {/* Delivery Area Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Delivery Charge
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingArea === "inside"
                    ? "border-slate-900 bg-slate-50 font-medium"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingArea === "inside"}
                    onChange={() => setShippingArea("inside")}
                    className="accent-slate-900"
                  />
                  <span className="text-sm text-slate-800">Inside Dhaka</span>
                </div>
                <span className="text-sm font-bold text-slate-900">৳60</span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingArea === "outside"
                    ? "border-slate-900 bg-slate-50 font-medium"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingArea === "outside"}
                    onChange={() => setShippingArea("outside")}
                    className="accent-slate-900"
                  />
                  <span className="text-sm text-slate-800">Outside Dhaka</span>
                </div>
                <span className="text-sm font-bold text-slate-900">৳120</span>
              </label>
            </div>
          </div>

          {/* Payment Method (Cash on Delivery Only) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Payment Method
            </label>
            <div className="p-4 rounded-xl border border-slate-900 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked
                  readOnly
                  className="accent-slate-900"
                />
                <span className="text-sm font-semibold text-slate-900">
                  Cash on Delivery (COD)
                </span>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full">
                Available
              </span>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold shadow-md hover:bg-slate-800 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? "Placing Order..."
              : `Confirm Order — ${formatPrice(finalTotal)}`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm lg:sticky lg:top-24 space-y-4">
          <h2 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-4">
            Order Summary
          </h2>

          <div className="space-y-3 divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => {
              const isAtMaxStock =
                item.stock !== undefined && item.quantity >= item.stock;

              return (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 gap-3 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800 line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      {formatPrice(item.price)} each
                    </p>
                  </div>

                  {/* Quantity Controls & Total Price */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg font-bold transition-all text-xs cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        disabled={isAtMaxStock}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg font-bold transition-all text-xs disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-semibold text-slate-900 shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee</span>
              <span className="font-medium text-slate-900">
                {formatPrice(shippingCost)}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex justify-between font-extrabold text-lg text-slate-900">
            <span>Total Payable</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
