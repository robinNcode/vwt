"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="text-2xl font-bold tracking-tight">Cart</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-600">Your cart is empty. Add products to continue.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
              <div>
                <p className="font-medium text-neutral-900">{item.name}</p>
                <p className="text-xs text-neutral-500">{item.sku}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateQty(item.id, Number(e.target.value || 1))}
                  className="w-16 rounded-lg border border-neutral-300 px-2 py-1 text-sm"
                />
                <p className="w-24 text-right text-sm font-semibold">৳{(item.price * item.quantity).toLocaleString()}</p>
                <button type="button" onClick={() => removeItem(item.id)} className="text-xs font-semibold text-red-600">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-xl bg-neutral-100 px-4 py-3">
            <p className="font-semibold">Total</p>
            <p className="font-bold">৳{total.toLocaleString()}</p>
          </div>
          <Link href="/checkout" className="inline-flex rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white">
            Continue to checkout
          </Link>
        </div>
      )}
    </div>
  );
}

