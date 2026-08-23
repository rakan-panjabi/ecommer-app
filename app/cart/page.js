"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  // কোয়ান্টিটি আপডেট হ্যান্ডলার উইথ স্টক ভ্যালিডেশন
  const handleQuantityChange = (item, newQuantity) => {
    // যদি স্টক প্রপার্টি থাকে এবং নতুন কোয়ান্টিটি স্টকের চেয়ে বেশি হয়
    if (item.stock !== undefined && newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock!`);
      return;
    }
    if (newQuantity < 1) return;

    updateQuantity(item.productId, newQuantity);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
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
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="border-b border-slate-100 pb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Your Shopping Cart
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your selected items before proceeding to checkout.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const isAtMaxStock =
              item.stock !== undefined && item.quantity >= item.stock;

            return (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm transition-all hover:border-slate-200"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-bold text-slate-900 hover:text-slate-700 truncate block text-base"
                    >
                      {item.name}
                    </Link>
                    <p className="font-bold text-slate-900 mt-1">
                      {formatPrice(item.price)}
                    </p>
                    {item.stock !== undefined && (
                      <p
                        className={`text-[11px] mt-1 font-medium ${isAtMaxStock ? "text-amber-600" : "text-slate-400"}`}
                      >
                        {isAtMaxStock
                          ? "Maximum stock reached"
                          : `Stock available: ${item.stock}`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-0.5">
                    <button
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg font-bold transition-all"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                      disabled={isAtMaxStock}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 sticky top-24">
          <h2 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-4">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-medium text-slate-500 text-xs">
                Calculated at checkout
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
            <span className="font-bold text-slate-900">Total</span>
            <span className="font-extrabold text-xl text-slate-900">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-sm text-center block"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
