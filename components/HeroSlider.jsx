"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function HeroSlider({ categories = [] }) {
  // Category Index 0 (Banner 1 / Main Slider): Ekhane category index 0 er products theke slides banabo
  const cat0 = categories[0];
  const mainSlides =
    cat0?.products?.length > 0
      ? cat0.products.slice(0, 3).map((product) => ({
          tag: cat0.category,
          title: product.name || `Explore Our Best ${cat0.category}`,
          desc:
            product.description ||
            `Discover premium quality ${cat0.category} handpicked just for you.`,
          image:
            product.images?.[0] ||
            product.image ||
            "https://i.postimg.cc/85hmLzFF/3.avif",
          category: cat0.category,
        }))
      : [
          {
            tag: "Collection",
            title: "Premium Products for Your Festive Elegance.",
            desc: "Discover our exclusive, comfortable, and trendy collection crafted for you.",
            image: "https://i.postimg.cc/85hmLzFF/3.avif",
            category: "all",
          },
        ];

  // Category Index 1 (Banner 2) ebong Category Index 2 (Banner 3)
  const cat1 = categories[1];
  const cat2 = categories[2];

  // Banner 2 data (Category Index 1er prothom product)
  const banner2Product = cat1?.products?.[0];
  const banner2Image =
    banner2Product?.images?.[0] ||
    banner2Product?.image ||
    "https://i.postimg.cc/4dC1K93n/10.jpg";
  const banner2Title = cat1?.category || "Featured Collection";

  // Banner 3 data (Category Index 2er prothom product)
  const banner3Product = cat2?.products?.[0];
  const banner3Image =
    banner3Product?.images?.[0] ||
    banner3Product?.image ||
    "https://i.postimg.cc/Ss0GXMx5/21.webp";
  const banner3Title = cat2?.category || "Special Essentials";

  return (
    <section className="relative text-white overflow-hidden py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 items-center">
          {/* Left: Main Slider (Banner 1 - Category Index 0 products) */}
          <div className="col-span-12 lg:col-span-8 overflow-hidden shadow-xl border border-white/10 bg-black">
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
              {mainSlides.map((slide, index) => (
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
                      <span className="inline-block bg-amber-400 text-black px-3.5 py-1 rounded-full font-semibold mb-4 uppercase tracking-wider text-xs shadow-sm">
                        {slide.tag}
                      </span>
                      <h1 className="text-2xl sm:text-4xl lg:text-4xl font-extrabold leading-tight mb-3 tracking-tight line-clamp-2">
                        {slide.title}
                      </h1>
                      <p className="text-slate-200 mb-6 text-sm sm:text-base leading-relaxed line-clamp-2">
                        {slide.desc}
                      </p>
                      <Link
                        href={`/products?category=${encodeURIComponent(slide.category)}`}
                        className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-semibold shadow-lg hover:bg-amber-400 hover:text-white transition-all transform hover:-translate-y-0.5"
                      >
                        Shop Collection →
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right: 2 Promotional Banners (Banner 2 & Banner 3 -> Category Index 1 & 2) */}
          <div className="col-span-12 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
            {/* Banner 2 (Category Index 1) */}
            <div className="relative overflow-hidden shadow-lg border border-white/10 group h-[180px] sm:h-[215px] lg:h-[222px] bg-slate-900">
              <img
                src={banner2Image}
                alt={banner2Title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  Featured
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 capitalize">
                  {banner2Title}
                </h3>
                <Link
                  href={`/products?category=${encodeURIComponent(banner2Title)}`}
                  className="text-xs font-semibold text-white underline underline-offset-4 hover:text-amber-400 transition-colors w-fit"
                >
                  Explore →
                </Link>
              </div>
            </div>

            {/* Banner 3 (Category Index 2) */}
            <div className="relative overflow-hidden shadow-lg border border-white/10 group h-[180px] sm:h-[215px] lg:h-[222px] bg-slate-900">
              <img
                src={banner3Image}
                alt={banner3Title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  Special
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 capitalize">
                  {banner3Title}
                </h3>
                <Link
                  href={`/products?category=${encodeURIComponent(banner3Title)}`}
                  className="text-xs font-semibold text-white underline underline-offset-4 hover:text-amber-400 transition-colors w-fit"
                >
                  Explore →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
