import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import AddToCartForm from "@/components/AddToCartForm";
import ProductCard from "@/components/ProductCard";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Product Main Section */}
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Product Image Box */}
        <div className=" aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm sticky top-24">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium text-sm">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Details & Form */}
        <div className="space-y-6">
          <div>
            <span className="inline-block px-3.5 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold tracking-wider uppercase mb-4 border border-slate-200">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              About this item
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <AddToCartForm product={product} />
          </div>

          {/* Extra Guarantee / Perks Box */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
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
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
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
        <div className="border-t border-slate-100 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              You might also like
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.main?.map
              ? null
              : related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
