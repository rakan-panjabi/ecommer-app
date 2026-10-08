import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

const PRODUCTS_PER_PAGE = 20;

async function getProducts(searchParams, page = 1) {
  const totalStart = performance.now();

  const where = {};

  if (searchParams.category && searchParams.category !== "all") {
    where.category = searchParams.category;
  }

  if (searchParams.q) {
    const search = searchParams.q.trim();

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }
  }

  const skip = (page - 1) * PRODUCTS_PER_PAGE;

  const dbStart = performance.now();

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: PRODUCTS_PER_PAGE,
    }),

    prisma.product.count({
      where,
    }),
  ]);

  const dbTime = performance.now() - dbStart;
  const totalTime = performance.now() - totalStart;

  return {
    products,
    totalCount,
    totalPages: Math.ceil(totalCount / PRODUCTS_PER_PAGE),
  };
}

async function getCategories() {
  const start = performance.now();

  const categories = await prisma.product.groupBy({
    by: ["category"],
    orderBy: {
      category: "asc",
    },
  });

  return categories.map((item) => item.category).filter(Boolean);
}

export default async function ProductsPage({ searchParams }) {
  // Next.js 14: searchParams is NOT a Promise
  const resolvedSearchParams = searchParams;

  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);

  const pageStart = performance.now();

  const [productResult, categories] = await Promise.all([
    getProducts(resolvedSearchParams, currentPage),
    getCategories(),
  ]);

  const { products, totalCount, totalPages } = productResult;

  const activeCategory = resolvedSearchParams.category || "all";

  const searchQuery = resolvedSearchParams.q || "";

  const createPageUrl = (pageNumber) => {
    const params = new URLSearchParams();

    if (activeCategory !== "all") {
      params.set("category", activeCategory);
    }

    if (searchQuery) {
      params.set("q", searchQuery);
    }

    params.set("page", pageNumber.toString());

    return `/products?${params.toString()}`;
  };

  const isManyCategories = categories.length > 7;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8 md:py-12">
      <div className="text-center mb-6">
        <h2 className="inline-block bg-brand-accent/10 text-brand-accent px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider mb-2">
          Rakan Store Collection
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div
          className={
            isManyCategories
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pb-2 lg:pb-0 w-full lg:w-auto"
              : "flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar"
          }
        >
          <Link
            href="/products"
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold text-center whitespace-nowrap transition-all shadow-sm ${
              activeCategory === "all"
                ? "bg-slate-900 text-white shadow-slate-900/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            All Products
          </Link>

          {categories.map((category) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}${
                searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""
              }`}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold text-center whitespace-nowrap transition-all shadow-sm ${
                activeCategory === category
                  ? "bg-slate-900 text-white shadow-slate-900/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>

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

      <div className="mb-12 space-y-8">
        {products.length === 0 ? (
          <div className="py-20 text-center bg-white border border-slate-100 rounded-3xl shadow-sm space-y-3 px-4">
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
                className="inline-block px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
              >
                Reset Filters
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                {currentPage > 1 ? (
                  <Link
                    href={createPageUrl(currentPage - 1)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-sm"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed">
                    ← Previous
                  </span>
                )}

                <span className="px-4 py-2 text-xs font-semibold text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>

                {currentPage < totalPages ? (
                  <Link
                    href={createPageUrl(currentPage + 1)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-sm"
                  >
                    Next →
                  </Link>
                ) : (
                  <span className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed">
                    Next →
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
