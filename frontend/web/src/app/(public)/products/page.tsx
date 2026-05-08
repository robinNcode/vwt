"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getProductsSafe } from "@/lib/dataClient";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [source, setSource] = useState<"api" | "mock">("api");
  const addProduct = useCartStore((s) => s.addProduct);

  useEffect(() => {
    void (async () => {
      const res = await getProductsSafe();
      setProducts(res.items.filter((item) => item.is_active));
      setSource(res.source);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white">Products</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#8b90a8]">
          Data source: {source}
        </span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <article key={p.id} className="rounded-2xl border border-white/10 bg-[#151820] p-4 shadow-soft">
            <Image
              src="/images/brand/visiting_card_volt_wave_tech.png"
              alt={`${p.name_en} image`}
              width={500}
              height={280}
              className="mb-3 h-36 w-full rounded-xl object-cover"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#f5c518]">{p.product_type}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{p.name_en}</h3>
            <p className="text-sm text-[#8b90a8]">{p.name_bn}</p>
            <p className="mt-3 text-sm font-medium text-[#f5c518]">Starting at ৳1,200</p>
            <button
              type="button"
              onClick={() => addProduct(p)}
              className="mt-4 w-full rounded-xl bg-[#f5c518] px-4 py-2 text-sm font-medium text-[#0a0c10] hover:bg-[#ffd42a]"
            >
              Add to cart
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

