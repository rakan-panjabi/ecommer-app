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
    tag: "Eid Collection",
    title: "Premium Panjabi for Your Festive Elegance.",
    desc: "Discover our exclusive, comfortable, and trendy Panjabi collection crafted for your special occasions.",
    image: "https://i.postimg.cc/85hmLzFF/3.avif",
  },
  {
    tag: "New Arrivals",
    title: "Traditional Craftsmanship Meets Modern Style.",
    desc: "Elevate your ethnic wardrobe with finest fabrics and intricate embroidery designs.",
    image: "https://i.postimg.cc/rmSN5wdz/4.png",
  },
  {
    tag: "Exclusive Design",
    title: "Sophisticated Panjabis for Every Celebration.",
    desc: "Experience ultimate comfort and superior quality with our handpicked festive wear.",
    image: "https://i.postimg.cc/d18jGV70/6.png",
  },
  {
    tag: "Special Offer",
    title: "Complete Your Sunnah Look This Season.",
    desc: "Explore top-tier festive essentials shipped fast and priced fair.",
    image: "https://i.postimg.cc/G20jByp8/8.png",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative text-white overflow-hidden py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 items-center">
          {/* Left: Main Slider (8 Columns) */}
          <div className="col-span-12 lg:col-span-8  overflow-hidden shadow-xl border border-white/10 bg-black">
            <Swiper
              modules={[Autoplay, Pagination, Navigation, EffectFade]}
              effect={"fade"}
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              navigation={true}
              className="hero-swiper"
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="relative min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex items-center p-6 sm:p-10 lg:p-12">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 brightness-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-lg">
                      <span className="inline-block bg-brand-accent text-black px-3.5 py-1 rounded-full font-semibold mb-4 uppercase tracking-wider text-xs shadow-sm">
                        {slide.tag}
                      </span>
                      <h1 className="text-2xl sm:text-4xl lg:text-4xl font-extrabold leading-tight mb-3 tracking-tight line-clamp-2">
                        {slide.title}
                      </h1>
                      <p className="text-slate-200 mb-6 text-sm sm:text-base leading-relaxed line-clamp-2">
                        {slide.desc}
                      </p>
                      <Link
                        href="/products?category=panjabi"
                        className="inline-flex items-center gap-2 bg-white text-black px-6 py-3  font-semibold shadow-lg hover:bg-brand-accent hover:text-white transition-all transform hover:-translate-y-0.5"
                      >
                        Shop Collection →
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right: 2 Promotional Banners (4 Columns) -> Attar & Tupi */}
          <div className="col-span-12 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
            {/* Banner 1: Attar */}
            <div className="relative  overflow-hidden shadow-lg border border-white/10 group h-[180px] sm:h-[215px] lg:h-[222px] bg-slate-900">
              <img
                src="https://i.postimg.cc/4dC1K93n/10.jpg"
                alt="Premium Attar Collection"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  Pure Fragrance
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  Exclusive Attar
                </h3>
                <Link
                  href="/products?category=perfume"
                  className="text-xs font-semibold text-white underline underline-offset-4 hover:text-amber-400 transition-colors w-fit"
                >
                  Explore Perfume →
                </Link>
              </div>
            </div>

            {/* Banner 2: Tupi (Prayer Cap) */}
            <div className="relative  overflow-hidden shadow-lg border border-white/10 group h-[180px] sm:h-[215px] lg:h-[222px] bg-slate-900">
              <img
                src="https://i.postimg.cc/Ss0GXMx5/21.webp"
                alt="Stylish Tupi Collection"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  Sunnah Essentials
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  Premium Tupi
                </h3>
                <Link
                  href="/products?category=Tupi"
                  className="text-xs font-semibold text-white underline underline-offset-4 hover:text-amber-400 transition-colors w-fit"
                >
                  Explore Tupi →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
