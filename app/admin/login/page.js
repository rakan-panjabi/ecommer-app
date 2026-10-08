"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  // ডেমো ইমেইল এবং পাসওয়ার্ড ইনিশিয়ালি সেট করে দেওয়া হলো
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

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

      toast.success("Login successful!", { id: toastId });

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
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
          Sign in to manage your store. (Demo Mode)
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
              placeholder="Write your email"
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

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex justify-center items-center shadow-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
          <p className="text-xs font-semibold text-slate-600 mb-0.5">
            Demo Credentials:
          </p>
          <p className="text-xs text-slate-500">
            Email:{" "}
            <span className="font-mono text-slate-700">admin@gmail.com</span>
          </p>
          <p className="text-xs text-slate-500">
            Password: <span className="font-mono text-slate-700">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
