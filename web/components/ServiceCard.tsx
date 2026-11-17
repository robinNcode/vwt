import Link from 'next/link';

import ShareButton from './ShareButton';

export type ServiceCardData = {
    id: number | string;
    slug: string;
    name_bn?: string | null;
    name_en?: string | null;
    description_bn?: string | null;
    description_en?: string | null;
    price?: number | string | null;
    image_url?: string | null;
    thumbnail_url?: string | null;
    thumb?: string | null;
};

type ServiceCardProps = {
    service: ServiceCardData;
    shareUrl: string;
};

function resolveMediaUrl(value?: string | null): string | null {
    if (!value) {
        return null;
    }

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    const apiUrl = process.env.API_URL;

    if (!apiUrl) {
        return value;
    }

    try {
        return new URL(value, new URL(apiUrl).origin).toString();
    } catch {
        return value;
    }
}

function formatPrice(value?: number | string | null): string {
    const price = Number(value ?? 0);

    if (!Number.isFinite(price) || price <= 0) {
        return 'Contact Us';
    }

    return `৳${price.toLocaleString('en-US')}`;
}

export default function ServiceCard({ service, shareUrl }: ServiceCardProps) {
    const name = service.name_bn || service.name_en || 'Service';
    const description =
        service.description_bn ||
        service.description_en ||
        'Expert electrical solutions provided by our certified team of professionals.';
    const imageUrl = resolveMediaUrl(
        service.thumbnail_url || service.thumb || service.image_url,
    );
    const href = `/services/${encodeURIComponent(service.slug)}`;

    return (
        <article className="group relative rounded-2xl border border-slate-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute left-0 right-0 top-0 h-1 rounded-t-2xl bg-slate-100 transition-colors duration-300 group-hover:bg-blue-500" />

            <div className="absolute right-4 top-4 z-10">
                <ShareButton url={shareUrl} title={name} variant="compact" />
            </div>

            <Link
                href={href}
                aria-label={`View ${name}`}
                className="mb-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-110"
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        width={160}
                        height={160}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        className="h-8 w-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.7 6.3a4 4 0 0 0-5.6 5.6L3 18v3h3l6.1-6.1a4 4 0 0 0 5.6-5.6l-2.5 2.5-2-2 2.5-2.5z"
                        />
                    </svg>
                )}
            </Link>

            <h2 className="mb-3 text-xl font-bold leading-snug text-slate-900">
                <Link
                    href={href}
                    className="transition-colors group-hover:text-blue-600"
                >
                    {name}
                </Link>
            </h2>

            <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-slate-500">
                {description}
            </p>

            <div className="flex items-center justify-between border-t border-slate-50 pt-5">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {service.price ? 'Starts from' : 'Pricing'}
                    </span>
                    <span className="text-xl font-extrabold text-slate-900">
                        {formatPrice(service.price)}
                    </span>
                </div>
                <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900/5 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-900/10"
                    aria-label={`View details for ${name}`}
                >
                    Details
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-3.5 w-3.5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 12h14m-6-6l6 6-6 6"
                        />
                    </svg>
                </Link>
            </div>
        </article>
    );
}
