"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [result, setResult] = useState<string>("");

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    try {
      const res = await apiFetch<{ order_number: string }>("/orders", {
        method: "POST",
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          ship_address_line1: address,
          ship_city: city,
          currency_code: "BDT",
          subtotal,
          grand_total: subtotal,
          items: items.map((i) => ({
            product_name_bn: i.name,
            product_name_en: i.name,
            sku: i.sku,
            unit_price: i.price,
            quantity: i.quantity,
            line_total: i.price * i.quantity,
          })),
        }),
      });
      setResult(`Order placed successfully: ${res.data.order_number}`);
      clear();
    } catch {
      setResult("API unavailable. Order simulation completed with mock flow.");
      clear();
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="text-2xl font-bold tracking-tight">Checkout</h2>
      <form className="mt-6 space-y-3 rounded-2xl border border-neutral-200 p-4" onSubmit={placeOrder}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required type="email" className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" required className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Shipping address" required className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" required className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
        <button type="submit" className="w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
          Place order
        </button>
      </form>
      {result ? <p className="mt-4 rounded-xl bg-neutral-100 px-4 py-3 text-sm">{result}</p> : null}
    </div>
  );
}

