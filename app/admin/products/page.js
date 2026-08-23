"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  image: "",
  category: "",
  stock: "",
  featured: false,
};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    limit: 5,
  });

  function loadProducts(pageNum = 1) {
    setLoading(true);
    fetch(`/api/products?page=${pageNum}&limit=5`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data?.data || []);
        if (data?.pagination) {
          setPagination(data.pagination);
          setPage(data.pagination.page);
        }
        setLoading(false);
      });
  }

  useEffect(() => {
    loadProducts(page);
  }, []);

  function openAddForm() {
    setForm(emptyForm);
    setEditingSlug(null);
    setShowForm(true);
  }

  function openEditForm(p) {
    setForm({ ...p, price: String(p.price), stock: String(p.stock) });
    setEditingSlug(p.slug);
    setShowForm(true);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "name" && !editingSlug ? { slug: slugify(value) } : {}),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingSlug) {
        await fetch(`/api/products/${editingSlug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            price: parseFloat(form.price),
            stock: parseInt(form.stock),
          }),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setShowForm(false);
      loadProducts(page);
    } catch (err) {
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${slug}`, { method: "DELETE" });
    loadProducts(page);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Products Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add, edit, and manage your store products and inventory.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-xs sm:text-sm hover:bg-slate-800 transition-all shadow-sm shrink-0"
        >
          + Add Product
        </button>
      </div>

      {/* Add/Edit Form Card */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h2 className="font-bold text-base sm:text-lg text-slate-900">
              {editingSlug ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-600 text-xs sm:text-sm font-medium"
            >
              ✕ Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Product Name
                </label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Wireless Headphones"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none focus:border-slate-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  URL Slug
                </label>
                <input
                  required
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="e.g. wireless-headphones"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none focus:border-slate-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Price ($)
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none focus:border-slate-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Stock Quantity
                </label>
                <input
                  required
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none focus:border-slate-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Category
                </label>
                <input
                  required
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none focus:border-slate-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Image URL
                </label>
                <input
                  required
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none focus:border-slate-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Description
              </label>
              <textarea
                required
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write product description..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none focus:border-slate-400 transition-all resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-4 h-4 accent-slate-900 rounded"
              />
              <label
                htmlFor="featured"
                className="text-xs sm:text-sm font-medium text-slate-700 cursor-pointer"
              >
                Show on homepage (Featured Product)
              </label>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-xs sm:text-sm hover:bg-slate-800 transition-all shadow-sm disabled:opacity-55"
              >
                {saving ? "Saving..." : "Save Product"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs sm:text-sm hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table Wrapper */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm">
        {loading ? (
          <div className="py-16 text-center">
            <p className="text-slate-500 text-xs sm:text-sm font-medium animate-pulse">
              Loading products...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs sm:text-sm">
            No products found. Add your first product.
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            {/* Scrollable container for table */}
            <div className="w-full max-w-full overflow-x-auto pb-1">
              <table className="w-full text-xs sm:text-sm text-left border-collapse min-w-max">
                <thead>
                  <tr className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-slate-400 border-b border-slate-200 bg-slate-50/70">
                    <th className="py-3.5 px-4 sm:px-6">Product</th>
                    <th className="py-3.5 px-3 sm:px-4">Category</th>
                    <th className="py-3.5 px-3 sm:px-4">Price</th>
                    <th className="py-3.5 px-3 sm:px-4">Stock</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                            {p.image ? (
                              <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">
                                No Image
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block max-w-[160px] sm:max-w-xs truncate text-xs sm:text-sm">
                              {p.name}
                            </span>
                            {p.featured && (
                              <span className="inline-block mt-0.5 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] sm:text-[10px] font-bold uppercase rounded-md">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 sm:px-4 text-slate-600 font-medium whitespace-nowrap">
                        {p.category}
                      </td>
                      <td className="py-4 px-3 sm:px-4 font-bold text-slate-900 whitespace-nowrap">
                        {formatPrice(p.price)}
                      </td>
                      <td className="py-4 px-3 sm:px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium inline-block ${
                            p.stock > 0
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEditForm(p)}
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-[11px] sm:text-xs font-semibold transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.slug)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-[11px] sm:text-xs font-semibold transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50/70 rounded-b-2xl sm:rounded-b-3xl">
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium text-center sm:text-left">
                  Showing page{" "}
                  <span className="font-bold text-slate-700">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-700">
                    {pagination.totalPages}
                  </span>{" "}
                  (Total {pagination.total} products)
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                  <button
                    onClick={() => loadProducts(page - 1)}
                    disabled={page <= 1}
                    className="flex-1 sm:flex-initial px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => loadProducts(page + 1)}
                    disabled={page >= pagination.totalPages}
                    className="flex-1 sm:flex-initial px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}