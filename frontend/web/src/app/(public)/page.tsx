import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <section className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-brand-50 via-white to-accent-100 p-10 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
          Volt Wave Tech
        </p>
        <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
          Premium electrical & electronics accessories. Reliable services.
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-neutral-700">
          Browse products, book services, build quotations, and track orders — all in a fast,
          Bengali-first experience.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          >
            Browse products
          </Link>
          <Link
            href="/services"
            className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
          >
            View services
          </Link>
          <Link
            href="/quotation"
            className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
          >
            Build quotation
          </Link>
        </div>
      </section>
    </div>
  );
}

