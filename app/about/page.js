import Image from "next/image";

export const metadata = { title: "About Us — Rakan" };

export default function AboutPage() {
  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* Featured Image with Overlay Effect */}
      <div className="relative overflow-hidden  h-[380px] sm:h-[480px] md:h-[560px] mb-8">
        <Image
          width={1200}
          height={1200}
          src="/about.jpg"
          alt="Our team"
          priority
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent flex items-end p-6 sm:p-10">
          <p className="text-white font-medium text-base sm:text-xl md:text-2xl max-w-2xl leading-snug">
            "Honest prices, fast shipping, and care in every single package."
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
          <div className="space-y-4 text-slate-600 leading-relaxed bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                How it all started
              </h2>
              <p className="text-sm sm:text-base mb-3">
                Rakan started as a small idea: build a store that feels honest,
                simple, and easy to shop from — no clutter, no pressure, just
                good products at fair prices.
              </p>
              <p className="text-sm sm:text-base">
                We hand-pick every item in our catalog, focusing on everyday
                essentials — accessories, electronics, and home goods — that are
                well made and built to last.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-slate-600 leading-relaxed bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                Our Promise to You
              </h2>
              <p className="text-sm sm:text-base mb-3">
                Every order is packed with care and shipped quickly, because we
                know how good it feels to open a package that was worth the
                wait.
              </p>
              <p className="text-sm sm:text-base">
                We're a small, independent team, and every message, review, and
                order genuinely helps us grow. Thank you for shopping with us
                and being part of our journey.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center my-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-3xl md:text-4xl font-extrabold text-brand-accent mb-1">
              10K+
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Happy Customers
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-3xl md:text-4xl font-extrabold text-brand-accent mb-1">
              500+
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Products Sold Monthly
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-3xl md:text-4xl font-extrabold text-brand-accent mb-1">
              4.8/5
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Average Rating
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
