import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import AddToCartForm from "@/components/AddToCartForm";
import ProductCard from "@/components/ProductCard";
import ProductImageGallery from "@/components/ProductImageGallery";

export const dynamic = "force-dynamic";

async function getProduct(slug) {
  return prisma.product.findUnique({ where: { slug } });
}

async function getRelated(category, excludeId) {
  return prisma.product.findMany({
    where: { category, NOT: { id: excludeId } },
    take: 4,
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — Rakan`,
    description: product.description,
  };
}

export default async function SingleProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelated(product.category, product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 md:space-y-16">
      {/* Product Main Section */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Product Image Box (Client Component দিয়ে ইমেজ হ্যান্ডেল করা হয়েছে যাতে স্লো লোডিংয়ে ইউজার স্মুথ ফিল পায়) */}
        <ProductImageGallery image={product.image} name={product.name} />

        {/* Product Details & Form */}
        <div className="space-y-6">
          <div>
            <span className="inline-block px-3.5 py-1 bg-amber-400 text-slate-800 rounded-full text-xs font-bold tracking-wider uppercase mb-3 border border-slate-200">
              {product.category}
            </span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Redesigned Price Box */}
            <div className="mt-4 inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900 text-white shadow-md">
              <span className="text-xs uppercase tracking-wider text-whtie font-semibold">
                Price:
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-400">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              About this item
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <AddToCartForm product={product} />
          </div>

          {/* Extra Guarantee / Perks Box */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xl">🚚</span>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Fast Delivery
                </p>
                <p className="text-[11px] text-slate-500">
                  Inside & Outside Dhaka
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Secure Checkout
                </p>
                <p className="text-[11px] text-slate-500">100% Protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <div className="border-t border-slate-200/60 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              You might also like
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
