"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const slides = [
  {
    tag: "New Arrivals",
    title: "Everyday essentials, thoughtfully made.",
    desc: "Discover a curated selection of accessories, electronics, and home goods — shipped fast, priced fair.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900",
  },
  {
    tag: "Trending Now",
    title: "Upgrade your lifestyle with premium quality.",
    desc: "Explore top-rated products designed for your everyday comfort and modern style.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",
  },
  {
    tag: "Special Offer",
    title: "Exclusive deals on top gadgets & accessories.",
    desc: "Grab your favorite items today with unbelievable discounts and fast home delivery.",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative bg-black text-white overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect={"fade"}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        navigation={true}
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-24 grid md:grid-cols-2 gap-10 items-center min-h-[300px] md:min-h-[440px] bg-black">
              {/* Text Content: Hidden on Mobile, Visible from Tablet (md) upwards */}
              <div className="hidden md:block z-10">
                <span className="inline-block bg-brand-accent/20 text-brand-accent px-3 py-1 rounded-full font-semibold mb-4 uppercase tracking-wider text-xs">
                  {slide.tag}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-slate-300 mb-8 max-w-md text-base md:text-lg leading-relaxed">
                  {slide.desc}
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-brand-accent text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-brand-accent/30 hover:bg-brand-accent/90 transition-all transform hover:-translate-y-0.5"
                >
                  Shop Now →
                </Link>
              </div>

              {/* Image Content: Visible on ALL devices (Mobile gets full image view, Desktop gets side-by-side) */}
              <div className="relative h-64 sm:h-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group w-full col-span-1 md:col-span-1">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
