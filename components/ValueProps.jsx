export default function ValueProps() {
  const perks = [
    {
      title: "Fast Delivery",
      desc: "Delivered safely to your door within 2–3 business days.",
      icon: "⚡",
    },
    {
      title: "Secure Checkout",
      desc: "Your payment and personal info are 100% protected.",
      icon: "🔒",
    },
    {
      title: "Easy Returns",
      desc: "Hassle-free return policy within 7 days of purchase.",
      icon: "🔄",
    },
  ];

  return (
    <section className="bg-slate-100 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {perks.map((perk, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow"
          >
            <span className="text-2xl md:text-3xl p-3 bg-brand-accent/10 text-brand-accent rounded-xl shrink-0 flex items-center justify-center">
              {perk.icon}
            </span>
            <div>
              <h3 className="font-bold text-slate-900 mb-1 text-base">
                {perk.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {perk.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
