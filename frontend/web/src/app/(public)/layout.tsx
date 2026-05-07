import Link from "next/link";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold tracking-tight">
            <span className="text-brand-600">Volt</span> Wave Tech
          </Link>
          <nav className="flex items-center gap-4 text-sm text-neutral-700">
            <Link className="hover:text-neutral-900" href="/products">
              Products
            </Link>
            <Link className="hover:text-neutral-900" href="/services">
              Services
            </Link>
            <Link className="hover:text-neutral-900" href="/cart">
              Cart
            </Link>
            <Link className="hover:text-neutral-900" href="/order-tracking">
              Track
            </Link>
            <Link className="rounded-full bg-brand-500 px-3 py-1.5 text-white hover:bg-brand-600" href="/admin/login">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-neutral-200/70 py-10">
        <div className="mx-auto max-w-6xl px-4 text-sm text-neutral-600">
          © {new Date().getFullYear()} Volt Wave Tech
        </div>
      </footer>
    </div>
  );
}

