"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Order } from "@/types/order";

export default function OrderTrackingPage() {
  const [orderNo, setOrderNo] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  async function onTrack(e: React.FormEvent) {
    e.preventDefault();
    setOrder(null);
    setError("");
    try {
      const res = await apiFetch<Order>(`/orders/track/${encodeURIComponent(orderNo)}`);
      setOrder(res.data);
    } catch {
      setError("Order not found or API unavailable.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="text-2xl font-bold tracking-tight">Order tracking</h2>
      <form className="mt-6 flex gap-2" onSubmit={onTrack}>
        <input value={orderNo} onChange={(e) => setOrderNo(e.target.value)} required placeholder="ORD-20260508-123456" className="flex-1 rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
        <button type="submit" className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
          Track
        </button>
      </form>
      {error ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {order ? (
        <div className="mt-4 rounded-xl border border-neutral-200 p-4">
          <p className="text-sm">Order: <span className="font-semibold">{order.order_number}</span></p>
          <p className="text-sm">Customer: <span className="font-semibold">{order.customer_name}</span></p>
          <p className="text-sm">Status: <span className="font-semibold">{order.status}</span></p>
          <p className="text-sm">Payment: <span className="font-semibold">{order.payment_status}</span></p>
        </div>
      ) : null}
    </div>
  );
}

