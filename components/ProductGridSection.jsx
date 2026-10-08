import ProductCard from "@/components/ProductCard"; // আপনার প্রজেক্টে যে নামে প্রোডাক্ট কার্ড আছে
import Link from "next/link";

export default function ProductGridSection({ category, products }) {
  return (
    <section className="py-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* ক্যাটেগরি হেডার */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {category.name}
        </h2>
        <Link
          href={`/shop?category=${category.slug || category.id}`}
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* প্রোডাক্ট গ্রিড */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
