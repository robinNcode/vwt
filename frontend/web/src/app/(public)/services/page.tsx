"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getServicesSafe } from "@/lib/dataClient";
import type { Service } from "@/types/service";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [source, setSource] = useState<"api" | "mock">("api");

  useEffect(() => {
    void (async () => {
      const res = await getServicesSafe();
      setServices(res.items.filter((item) => item.is_active));
      setSource(res.source);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white">Services</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#8b90a8]">
          Data source: {source}
        </span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <article key={s.id} className="rounded-2xl border border-white/10 bg-[#151820] p-4 shadow-soft">
            <Image
              src="/images/brand/Sign_with_seal.jpg"
              alt={`${s.name_en} visual`}
              width={500}
              height={300}
              className="mb-3 h-36 w-full rounded-xl object-cover"
            />
            <h3 className="text-lg font-semibold text-white">{s.name_en}</h3>
            <p className="text-sm text-[#8b90a8]">{s.name_bn}</p>
            <p className="mt-4 text-sm font-medium text-[#f5c518]">
              {s.price ? `৳${s.price.toLocaleString()}` : "Price on quotation"}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

