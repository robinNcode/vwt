"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import type { Service } from "@/types/service";

export default function AdminDashboardPage() {
  const token = useAuthStore((s) => s.token);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    if (!token) return;
    void Promise.all([
      apiFetch<Order[]>("/orders", { token }).then((r) => setOrders(r.data)).catch(() => setOrders([])),
      apiFetch<Product[]>("/products", { token }).then((r) => setProducts(r.data)).catch(() => setProducts([])),
      apiFetch<Service[]>("/services", { token }).then((r) => setServices(r.data)).catch(() => setServices([])),
    ]);
  }, [token]);

  const revenue = orders.reduce((sum, o) => sum + Number(o.grand_total || 0), 0);

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Orders", value: orders.length },
          { label: "Revenue", value: `৳${revenue.toLocaleString()}` },
          { label: "Products", value: products.length },
          { label: "Services", value: services.length },
        ].map((card) => (
          <article key={card.label} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">{card.label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-neutral-900">{card.value}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

