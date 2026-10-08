"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Swiper CSS import (autoplay css জরুরি)
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

export default function CategorySliderSection({ category, products }) {
  const slugifiedCategory = category.toLowerCase().replace(/[^a-z0-9]/g, "-");

  const prevClass = `cat-prev-${slugifiedCategory}`;
  const nextClass = `cat-next-${slugifiedCategory}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight capitalize">
            {category}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Explore our best picks in {category}
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <button
              className={`${prevClass} w-10 h-10 rounded-full bg-slate-100 hover:bg-black hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-sm cursor-pointer`}
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              className={`${nextClass} w-10 h-10 rounded-full bg-slate-100 hover:bg-black hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-sm cursor-pointer`}
              aria-label="Next slide"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-slate-50-rounded-2xl border border-dashed border-slate-200 px-4">
          <p className="text-slate-500 mb-2">
            No products found in this category.
          </p>
        </div>
      ) : (
        <div className="relative mb-4">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            loop={true}
            // autoplay={{
            //   delay: 3500,
            //   disableOnInteraction: false,
            //   pauseOnMouseEnter: true,
            // }}
            navigation={{
              nextEl: `.${nextClass}`,
              prevEl: `.${prevClass}`,
            }}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerType: 3, slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="pb-4"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="h-auto">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <div className="text-center mt-6">
        <Link
          href={`/products?category=${encodeURIComponent(category)}`}
          className="text-white font-semibold text-sm bg-black transition-colors items-center gap-2 inline-flex hover:bg-brand-accent px-8 py-3 rounded-xl shadow-md"
        >
          View all {category} <span className="text-lg">→</span>
        </Link>
      </div>
    </section>
  );
}
