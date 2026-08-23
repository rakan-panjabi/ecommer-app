"use client";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export default function FeaturedProducts({ products }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Header & Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Featured Products
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Grab our top-selling items right now
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            className="featured-prev w-10 h-10 rounded-full bg-slate-100 hover:bg-brand-accent hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            className="featured-next w-10 h-10 rounded-full bg-slate-100 hover:bg-brand-accent hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            aria-label="Next slide"
          >
            →
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 px-4">
          <p className="text-slate-500 mb-2">No products found.</p>
          <code className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-sm inline-block">
            npm run db:seed
          </code>
        </div>
      ) : (
        <div className="relative mb-10">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            loop={products.length >= 4}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: ".featured-next",
              prevEl: ".featured-prev",
            }}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="pb-4"
          >
            {products.map((p) => (
              <SwiperSlide key={p.id} className="h-auto">
                <ProductCard product={p} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* View All Button */}
      <div className="text-center mt-6">
        <Link
          href="/products"
          className="text-white font-semibold text-sm bg-black transition-colors items-center gap-2 inline-flex hover:bg-brand-accent px-8 py-3 rounded-xl shadow-md"
        >
          View all <span className="text-lg">→</span>
        </Link>
      </div>
    </section>
  );
}
