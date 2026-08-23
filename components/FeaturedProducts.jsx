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
    <section className="max-w-7xl mx-auto py-12">
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Featured Products
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Grab our top-selling items right now
          </p>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="featured-prev w-10 h-10 rounded-full bg-slate-100 hover:bg-brand-accent hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-sm">
            ←
          </button>
          <button className="featured-next w-10 h-10 rounded-full bg-slate-100 hover:bg-brand-accent hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-sm">
            →
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500 mb-2">No products found.</p>
          <code className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-sm">
            npm run db:seed
          </code>
        </div>
      ) : (
        <div className="relative px-2">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
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
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-4"
          >
            {products.map((p) => (
              <SwiperSlide key={p.id}>
                <ProductCard product={p} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
        </div>
      )}
      <div className="text-center">
        <Link
          href="/products"
          className="text-white font-semibold text-sm bg-black transition-colors items-center gap-1 inline-flex hover:bg-brand-accent px-8 py-2"
        >
          View all <span className="text-lg">→</span>
        </Link>
      </div>
    </section>
  );
}
