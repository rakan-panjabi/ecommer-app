"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function AddToCartForm({ product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  function handleAdd() {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    addToCart(product, qty);
    router.push("/cart");
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-medium text-slate-600">Quantity</span>
        <div className="flex items-center border border-slate-300 rounded-lg">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100"
          >
            −
          </button>
          <span className="w-10 text-center font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100"
          >
            +
          </button>
        </div>
        <span className="text-sm text-slate-400">{product.stock} in stock</span>
      </div>

      <div className="flex gap-3">
        <button onClick={handleAdd} className="btn-secondary flex-1" disabled={product.stock === 0}>
          {added ? "Added ✓" : "Add to Cart"}
        </button>
        <button onClick={handleBuyNow} className="btn-primary flex-1" disabled={product.stock === 0}>
          Buy Now
        </button>
      </div>
    </div>
  );
}
