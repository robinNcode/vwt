"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!token || user?.type !== "admin") {
      const next = encodeURIComponent(pathname || "/admin/dashboard");
      router.replace(`/admin/login?next=${next}`);
    }
  }, [pathname, router, token, user?.type]);

  return (
    <div className="min-h-dvh bg-neutral-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-soft">
          <Link href="/admin/dashboard" className="block font-semibold tracking-tight">
            <span className="text-brand-600">Volt</span> Admin
          </Link>

          <nav className="mt-5 space-y-1 text-sm">
            <Link className="block rounded-xl px-3 py-2 hover:bg-neutral-50" href="/admin/dashboard">
              Dashboard
            </Link>
            <Link className="block rounded-xl px-3 py-2 hover:bg-neutral-50" href="/admin/products">
              Products
            </Link>
            <Link className="block rounded-xl px-3 py-2 hover:bg-neutral-50" href="/admin/services">
              Services
            </Link>
            <Link className="block rounded-xl px-3 py-2 hover:bg-neutral-50" href="/admin/orders">
              Orders
            </Link>
            <Link className="block rounded-xl px-3 py-2 hover:bg-neutral-50" href="/admin/invoices">
              Invoices
            </Link>
            <Link className="block rounded-xl px-3 py-2 hover:bg-neutral-50" href="/admin/settings">
              Settings
            </Link>
          </nav>
        </aside>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft">
          {token && user?.type === "admin" ? children : null}
        </section>
      </div>
    </div>
  );
}

