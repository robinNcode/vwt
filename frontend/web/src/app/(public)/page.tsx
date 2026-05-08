import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,197,24,0.1),transparent_60%)]" />
        <div className="vwt-container relative">
          <p className="inline-flex rounded-full border border-[#f5c518]/30 bg-[#f5c518]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#f5c518]">
            Now shipping across Bangladesh
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
            <span className="block">Power Your</span>
            <span className="block text-[#f5c518]">Electrical Projects</span>
            <span className="block text-[#8b90a8]">with precision.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[#8b90a8]">
            Premium electrical & electronics accessories, components, and professional services
            in one place for engineers and businesses.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="vwt-btn-primary">
              Browse Products
            </Link>
            <Link href="/services" className="vwt-btn-secondary">
              View Services
            </Link>
            <Link href="/quotation" className="vwt-btn-secondary">
              Build Quotation
            </Link>
          </div>
          <div className="mt-10 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["2,400+", "Products"],
              ["98%", "Satisfaction"],
              ["12k+", "Customers"],
              ["48h", "Avg Delivery"],
            ].map(([n, l]) => (
              <div key={n}>
                <p className="text-2xl font-bold text-white">{n}</p>
                <p className="text-xs uppercase tracking-[0.15em] text-[#5a5f77]">{l}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/brand/volt_wave_tech.png"
              alt="Volt Wave Tech featured banner"
              width={1400}
              height={700}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="vwt-section">
        <div className="vwt-container">
          <div className="vwt-card p-3">
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                className="flex-1 rounded-xl border border-white/10 bg-[#0f1219] px-4 py-3 text-sm text-white placeholder:text-[#5a5f77]"
                placeholder="Search circuit breakers, cables, switches, transformers..."
                readOnly
              />
              <button className="vwt-btn-primary">Search</button>
            </div>
          </div>
        </div>
      </section>

      <section className="vwt-section pt-0">
        <div className="vwt-container">
          <h2 className="vwt-title text-white">Shop by Category</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Power Systems",
              "Cables & Wiring",
              "Switchgear",
              "LED Lighting",
              "Solar & Renewable",
              "Control Panels",
            ].map((cat) => (
              <article key={cat} className="vwt-card p-5">
                <h3 className="text-lg font-semibold text-white">{cat}</h3>
                <p className="mt-1 text-sm text-[#8b90a8]">Industrial quality components</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="vwt-section bg-[#0f1219]">
        <div className="vwt-container">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#f5c518]">Featured</p>
              <h2 className="vwt-title mt-2 text-white">Popular Products</h2>
            </div>
            <Link href="/products" className="vwt-btn-secondary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="vwt-section">
        <div className="vwt-container">
          <h2 className="vwt-title text-white">What we offer</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["01", "Installation & Wiring"],
              ["02", "Maintenance & Repair"],
              ["03", "System Design & Consultation"],
            ].map(([n, title]) => (
              <article key={n} className="vwt-card p-6">
                <p className="text-sm font-semibold text-[#f5c518]">{n}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-[#8b90a8]">
                  Professional electrical services for residential, commercial, and industrial projects.
                </p>
              </article>
            ))}
          </div>

          <div className="relative mt-8 overflow-hidden rounded-2xl border border-[#f5c518]/30 bg-[#151820] p-6">
            <Image
              src="/images/brand/invoice_quatation_watermark.png"
              alt="Invoice watermark"
              width={800}
              height={400}
              className="pointer-events-none absolute -right-12 -top-10 h-40 w-auto opacity-20"
            />
            <p className="relative text-xs uppercase tracking-[0.15em] text-[#f5c518]">Limited Time</p>
            <h3 className="relative mt-2 text-2xl font-bold text-white">Get 15% off on bulk orders</h3>
            <p className="relative mt-2 text-[#8b90a8]">
              Order above ৳10,000 and unlock wholesale pricing. Valid for industrial and commercial clients.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

