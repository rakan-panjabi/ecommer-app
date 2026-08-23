"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // <-- টোস্ট ইম্পোর্ট করা হলো

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // লগইন শুরু হওয়ার টোস্ট (অপশনাল, চাইলে রাখতে পারেন)
    const toastId = toast.loading("Signing in...");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      // সাকসেস টোস্ট
      toast.success("Login successful!", { id: toastId });

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
      // এরর টোস্ট
      toast.error(err.message || "Invalid email or password", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
      <div className="bg-white border border-slate-200 rounded-xl p-8 w-full max-w-sm shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 mb-1">Admin Login</h1>
        <p className="text-sm text-slate-500 mb-6">
          Sign in to manage your store.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all text-sm"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          {/* ইনপুট ফিল্ডের নিচের এরর মেসেজ */}
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-slate-400 mt-6 text-center">
          Default: admin@example.com / admin123
        </p>
      </div>
    </div>
  );
}
