"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0c10]/90 backdrop-blur">
        <div className="vwt-container flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-white">
            <Image
              src="/images/brand/final_logo.png"
              alt="Volt Wave Tech"
              width={150}
              height={34}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <nav className="flex items-center gap-4 text-sm text-[#8b90a8]">
            <Link className="hover:text-white" href="/products">
              Products
            </Link>
            <Link className="hover:text-white" href="/services">
              Services
            </Link>
            <Link className="hover:text-white" href="/cart">
              Cart ({cartCount})
            </Link>
            <Link className="hover:text-white" href="/order-tracking">
              Track
            </Link>
            <Link className="rounded-lg bg-[#f5c518] px-3 py-1.5 text-[#0a0c10] hover:bg-[#ffd42a]" href="/admin/login">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 py-10">
        <div className="vwt-container flex flex-col gap-4 text-sm text-[#8b90a8] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Volt Wave Tech</p>
          <Image
            src="/images/brand/sign.jpg"
            alt="Authorized signature"
            width={140}
            height={40}
            className="h-10 w-auto object-contain opacity-80"
          />
        </div>
      </footer>
    </div>
  );
}

