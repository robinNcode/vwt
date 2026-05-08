"use client";

import { useState } from "react";
import { submitQuotation } from "@/lib/dataClient";
import { useCartStore } from "@/store/cartStore";

export default function QuotationPage() {
  const items = useCartStore((s) => s.items);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");

  async function buildQuotation(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      setResult("Add items to cart first.");
      return;
    }
    const res = await submitQuotation({
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      notes,
      items: items.map((i) => ({
        product_name_en: i.name,
        sku: i.sku,
        unit_price: i.price,
        quantity: i.quantity,
      })),
    });
    setResult(
      res.source === "api"
        ? `Quotation created successfully (ID: ${res.quotation?.id ?? "N/A"}).`
        : "API unavailable. Mock quotation prepared successfully.",
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="text-2xl font-bold tracking-tight">Quotation builder</h2>
      <form className="mt-6 space-y-3 rounded-2xl border border-neutral-200 p-4" onSubmit={buildQuotation}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Project notes" className="min-h-24 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
        <button type="submit" className="w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
          Generate quotation
        </button>
      </form>
      {result ? <p className="mt-4 rounded-xl bg-neutral-100 px-4 py-3 text-sm">{result}</p> : null}
    </div>
  );
}

