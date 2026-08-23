"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="bg-slate-50/50 py-8 md:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="inline-block bg-brand/10 text-brand px-4 py-1.5 rounded-full font-semibold text-sm md:text-base uppercase tracking-wider mb-2 border border-brand/20">
            Get in Touch
          </h2>
        </div>

        {/* Main Grid Section */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Info & Map (1 span) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Info Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Contact Information
              </h3>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 font-bold">
                    📍
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Our Location</p>
                    <p className="mt-0.5 leading-relaxed">
                      West Nakhalpara, Baitul Atik Jam-E-Masjid (Chapra Masjid),
                      Tejgaon, Dhaka-1215
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 font-bold">
                    📞
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Phone Number</p>
                    <p className="mt-0.5">01577-128893</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 font-bold">
                    ✉️
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      Email Address
                    </p>
                    <p className="mt-0.5 break-all">rakanfabric@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Box */}
            <div className="bg-white p-3 rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-64 sm:h-72">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.4587913701816!2d90.39048067605857!3d23.766671588150235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c75e3a504fc7%3A0xe670fbaad6eba44!2sBaitul%20Atik%20Jam-E-Masjid%20(Chapra%20Masjid)!5e0!3m2!1sen!2sbd!4v1787511653772!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Form (2 span) */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-100">
            {status === "success" ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Message Sent Successfully!
                </h2>
                <p className="text-slate-600 max-w-md mx-auto text-sm">
                  Thanks for reaching out! We've received your message and will
                  get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Send us a Message
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Fill out the form below and our team will respond shortly.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Your Name
                    </label>
                    <input
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-slate-800 text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-slate-800 text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Subject
                  </label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-slate-800 text-sm"
                    placeholder="Order inquiry, product question, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-slate-800 text-sm resize-none"
                    placeholder="How can we help you today?"
                  />
                </div>

                {status === "error" && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                    Something went wrong. Please try again later.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 bg-brand-accent text-white rounded-xl font-semibold shadow-lg shadow-brand-accent/20 hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {status === "loading" ? "Sending Message..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
