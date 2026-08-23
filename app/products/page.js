import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getProducts(searchParams) {
  const where = {};
  if (searchParams.category && searchParams.category !== "all") {
    where.category = searchParams.category;
  }
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }
  return prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
}

async function getCategories() {
  const products = await prisma.product.findMany({
    select: { category: true },
  });
  return [...new Set(products.map((p) => p.category))];
}

export default async function ProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  const [products, categories] = await Promise.all([
    getProducts(resolvedSearchParams),
    getCategories(),
  ]);
  const activeCategory = resolvedSearchParams.category || "all";
  const searchQuery = resolvedSearchParams.q || "";

  return (
    <div className=" mx-auto space-y-10">
      {/* Header Banner Section */}
      <div className="text-center mb-4 mt-12">
        <h2 className="inline-block bg-brand/10 text-brand px-3 py-1 rounded-full font-semibold text-lg uppercase tracking-wider mb-2">
          Rakan Store Collection
        </h2>
      </div>

      {/* Search & Filters Bar */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          <Link
            href="/products"
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
              activeCategory === "all"
                ? "bg-slate-900 text-white shadow-slate-900/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            All Products
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/products?category=${encodeURIComponent(c)}${
                searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""
              }`}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                activeCategory === c
                  ? "bg-slate-900 text-white shadow-slate-900/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {/* Search Input Box */}
        <form
          className="flex gap-2 w-full lg:w-80 shrink-0"
          action="/products"
          method="GET"
        >
          {activeCategory !== "all" && (
            <input type="hidden" name="category" value={activeCategory} />
          )}
          <div className="relative flex-1">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search products..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-10 py-3 text-xs sm:text-sm font-medium outline-none focus:border-slate-400 focus:bg-white transition-all text-slate-950 placeholder:text-slate-400"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
              🔍
            </span>
          </div>
        </form>
      </div>

      {/* Products Grid or Empty State */}
      <div className="mb-8 max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="py-24 text-center bg-white border border-slate-100 rounded-3xl shadow-sm space-y-3 mb-8">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-2xl text-slate-400 shadow-inner">
              📦
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No products found
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto">
              We couldn't find anything matching your search or filter. Try
              checking your spelling or clearing filters.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-block px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
              >
                Reset Filters
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
