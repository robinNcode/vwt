"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { Product } from "@/types/product";

type ProductUpsert = Pick<
  Product,
  "category_id" | "product_type" | "name_bn" | "name_en" | "slug" | "is_active" | "is_featured"
>;

export default function AdminProductsPage() {
  const token = useAuthStore((s) => s.token);

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ProductUpsert>({
    category_id: 1,
    product_type: "accessory",
    name_bn: "",
    name_en: "",
    slug: "",
    is_active: true,
    is_featured: false,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const isEditing = useMemo(() => editingId !== null, [editingId]);

  async function load() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<Product[]>("/products", { token });
      setItems(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError(null);
    try {
      if (editingId) {
        await apiFetch<Product>(`/products/${editingId}`, {
          method: "PUT",
          token,
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch<Product>("/products", { method: "POST", token, body: JSON.stringify(form) });
      }
      setForm({ ...form, name_bn: "", name_en: "", slug: "" });
      setEditingId(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      category_id: p.category_id,
      product_type: p.product_type,
      name_bn: p.name_bn,
      name_en: p.name_en,
      slug: p.slug,
      is_active: p.is_active,
      is_featured: p.is_featured,
    });
  }

  async function onDelete(id: number) {
    if (!token) return;
    if (!confirm("Delete this product?")) return;
    setError(null);
    try {
      await apiFetch<unknown>(`/products/${id}`, { method: "DELETE", token });
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight">Products</h1>
      <p className="mt-2 text-sm text-neutral-600">Admin CRUD for products.</p>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={onSubmit} className="rounded-2xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{isEditing ? "Edit product" : "New product"}</h2>
            {isEditing ? (
              <button
                type="button"
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    category_id: 1,
                    product_type: "accessory",
                    name_bn: "",
                    name_en: "",
                    slug: "",
                    is_active: true,
                    is_featured: false,
                  });
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>

          <div className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                Name (BN)
              </span>
              <input
                value={form.name_bn}
                onChange={(e) => setForm((s) => ({ ...s, name_bn: e.target.value }))}
                required
                className="mt-2 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500"
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                Name (EN)
              </span>
              <input
                value={form.name_en}
                onChange={(e) => setForm((s) => ({ ...s, name_en: e.target.value }))}
                required
                className="mt-2 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500"
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                Slug
              </span>
              <input
                value={form.slug}
                onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
                required
                className="mt-2 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500"
                placeholder="example-product"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                  Category ID
                </span>
                <input
                  value={form.category_id}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, category_id: Number(e.target.value || 0) }))
                  }
                  type="number"
                  min={1}
                  required
                  className="mt-2 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500"
                />
              </label>
              <label className="block text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                  Type
                </span>
                <select
                  value={form.product_type}
                  onChange={(e) => setForm((s) => ({ ...s, product_type: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-500"
                >
                  <option value="accessory">Accessory</option>
                  <option value="machinery">Machinery</option>
                  <option value="garment">Garment</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                checked={form.is_active}
                onChange={(e) => setForm((s) => ({ ...s, is_active: e.target.checked }))}
                type="checkbox"
                className="size-4"
              />
              Active
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                checked={form.is_featured}
                onChange={(e) => setForm((s) => ({ ...s, is_featured: e.target.checked }))}
                type="checkbox"
                className="size-4"
              />
              Featured
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-70"
            disabled={!token}
          >
            {isEditing ? "Save changes" : "Create product"}
          </button>
        </form>

        <div className="rounded-2xl border border-neutral-200">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
            <h2 className="text-sm font-semibold">All products</h2>
            <button
              type="button"
              onClick={() => void load()}
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-900"
              disabled={loading || !token}
            >
              Refresh
            </button>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs text-neutral-600">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Slug</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Active</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-4 text-neutral-600" colSpan={5}>
                      Loading...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-neutral-600" colSpan={5}>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  items.map((p) => (
                    <tr key={p.id} className="border-t border-neutral-200">
                      <td className="px-4 py-2">{p.id}</td>
                      <td className="px-4 py-2 font-mono text-xs">{p.slug}</td>
                      <td className="px-4 py-2">{p.name_en}</td>
                      <td className="px-4 py-2">{p.is_active ? "Yes" : "No"}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                          onClick={() => startEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="ml-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                          onClick={() => void onDelete(p.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

