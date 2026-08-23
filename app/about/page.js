import Image from "next/image";

export const metadata = { title: "About Us — Rakan" };

export default function AboutPage() {
  return (
    <div className="bg-slate-50/50 min-h-screen">
      <div className="">
        {/* Featured Image with Overlay Effect */}
        <div className="relative overflow-hidden mb-16 h-[640px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Image
            width={1200}
            height={1200}
            src="/about.jpg"
            alt="Our team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-8">
            <p className="text-white font-medium text-lg md:text-xl">
              "Honest prices, fast shipping, and care in every single package."
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl grid md:grid-cols-2 gap-10 items-center rounded-3xl mx-auto">
          <div className="space-y-4 min-h-80 text-slate-600 leading-relaxed bg-white mb-8 p-8 md:p-12 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              How it all started
            </h2>
            <p>
              Rakan started as a small idea: build a store that feels honest,
              simple, and easy to shop from — no clutter, no pressure, just good
              products at fair prices.
            </p>
            <p>
              We hand-pick every item in our catalog, focusing on everyday
              essentials — accessories, electronics, and home goods — that are
              well made and built to last.
            </p>
          </div>
          <div className="space-y-4 min-h-80 text-slate-600 leading-relaxed bg-white mb-8 p-8 md:p-12 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Our Promise to You
            </h2>
            <p>
              Every order is packed with care and shipped quickly, because we
              know how good it feels to open a package that was worth the wait.
            </p>
            <p>
              We're a small, independent team, and every message, review, and
              order genuinely helps us grow. Thank you for shopping with us and
              being part of our journey.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-3xl md:text-4xl font-extrabold text-brand mb-1">
              10K+
            </p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Happy Customers
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-3xl md:text-4xl font-extrabold text-brand mb-1">
              500+
            </p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Products Sold Monthly
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-3xl md:text-4xl font-extrabold text-brand mb-1">
              4.8/5
            </p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Average Rating
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
