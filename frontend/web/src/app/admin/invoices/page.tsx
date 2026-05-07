"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { Invoice } from "@/types/invoice";

type InvoiceUpsert = Pick<Invoice, "order_id" | "invoice_number">;

export default function AdminInvoicesPage() {
  const token = useAuthStore((s) => s.token);

  const [items, setItems] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<InvoiceUpsert>({ order_id: 0, invoice_number: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const isEditing = useMemo(() => editingId !== null, [editingId]);

  async function load() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<Invoice[]>("/invoices", { token });
      setItems(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load invoices");
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
        await apiFetch<Invoice>(`/invoices/${editingId}`, {
          method: "PUT",
          token,
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch<Invoice>("/invoices", { method: "POST", token, body: JSON.stringify(form) });
      }
      setForm({ order_id: 0, invoice_number: "" });
      setEditingId(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  }

  function startEdit(i: Invoice) {
    setEditingId(i.id);
    setForm({ order_id: i.order_id, invoice_number: i.invoice_number });
  }

  async function onDelete(id: number) {
    if (!token) return;
    if (!confirm("Delete this invoice?")) return;
    setError(null);
    try {
      await apiFetch<unknown>(`/invoices/${id}`, { method: "DELETE", token });
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight">Invoices</h1>
      <p className="mt-2 text-sm text-neutral-600">Admin CRUD for invoices.</p>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={onSubmit} className="rounded-2xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{isEditing ? "Edit invoice" : "New invoice"}</h2>
            {isEditing ? (
              <button
                type="button"
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                onClick={() => {
                  setEditingId(null);
                  setForm({ order_id: 0, invoice_number: "" });
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>

          <div className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                Order ID
              </span>
              <input
                value={form.order_id || ""}
                onChange={(e) => setForm((s) => ({ ...s, order_id: Number(e.target.value || 0) }))}
                type="number"
                min={1}
                required
                className="mt-2 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500"
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                Invoice number
              </span>
              <input
                value={form.invoice_number}
                onChange={(e) => setForm((s) => ({ ...s, invoice_number: e.target.value }))}
                required
                className="mt-2 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500"
                placeholder="INV-0001"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-70"
            disabled={!token}
          >
            {isEditing ? "Save changes" : "Create invoice"}
          </button>
        </form>

        <div className="rounded-2xl border border-neutral-200">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
            <h2 className="text-sm font-semibold">All invoices</h2>
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
                  <th className="px-4 py-2">Invoice</th>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">PDF</th>
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
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  items.map((i) => (
                    <tr key={i.id} className="border-t border-neutral-200">
                      <td className="px-4 py-2">{i.id}</td>
                      <td className="px-4 py-2 font-mono text-xs">{i.invoice_number}</td>
                      <td className="px-4 py-2">{i.order_id}</td>
                      <td className="px-4 py-2">{i.pdf_url ? "Yes" : "No"}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                          onClick={() => startEdit(i)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="ml-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                          onClick={() => void onDelete(i.id)}
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

