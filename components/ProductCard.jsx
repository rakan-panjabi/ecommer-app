import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-brand-accent font-semibold uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="font-semibold text-slate-900 mt-1 line-clamp-1">{product.name}</h3>
        <p className="text-brand font-bold mt-1">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
