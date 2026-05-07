"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { Order } from "@/types/order";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

export default function AdminOrdersPage() {
  const token = useAuthStore((s) => s.token);
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<Order[]>("/orders", { token });
      setItems(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function updateStatus(id: number, status: string) {
    if (!token) return;
    setError(null);
    try {
      await apiFetch<Order>(`/orders/${id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight">Orders</h1>
      <p className="mt-2 text-sm text-neutral-600">View orders and update statuses.</p>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h2 className="text-sm font-semibold">All orders</h2>
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
                <th className="px-4 py-2">Order</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Payment</th>
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
                    No orders found.
                  </td>
                </tr>
              ) : (
                items.map((o) => (
                  <tr key={o.id} className="border-t border-neutral-200">
                    <td className="px-4 py-2 font-mono text-xs">{o.order_number}</td>
                    <td className="px-4 py-2">{o.customer_name}</td>
                    <td className="px-4 py-2">৳{o.grand_total}</td>
                    <td className="px-4 py-2">
                      <select
                        value={o.status}
                        onChange={(e) => void updateStatus(o.id, e.target.value)}
                        className="rounded-lg border border-neutral-300 bg-white px-2 py-1 text-sm"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">{o.payment_status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

