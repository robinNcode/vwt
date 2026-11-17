import Link from 'next/link';

import ShareButton from './ShareButton';

export type ProductCardImage = {
    url?: string | null;
    thumbnail_url?: string | null;
    thumb?: string | null;
    is_primary?: boolean;
    sort_order?: number;
};

export type ProductCardData = {
    id: number | string;
    slug: string;
    name?: string | null;
    name_bn?: string | null;
    name_en?: string | null;
    price?: number | string | null;
    short_desc_bn?: string | null;
    short_desc_en?: string | null;
    brand?: string | null;
    category?: {
        name_bn?: string | null;
        name_en?: string | null;
    } | null;
    images?: ProductCardImage[] | null;
};

type ProductCardProps = {
    product: ProductCardData;
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

    if (!Number.isFinite(price)) {
        return 'Contact us';
    }

    return `৳${price.toLocaleString('en-US')}`;
}

function getPrimaryImage(product: ProductCardData): ProductCardImage | null {
    if (!product.images?.length) {
        return null;
    }

    return product.images.find((image) => image.is_primary) ?? product.images[0];
}

export default function ProductCard({ product, shareUrl }: ProductCardProps) {
    const name = product.name_bn || product.name_en || product.name || 'Product';
    const category =
        product.category?.name_bn ||
        product.category?.name_en ||
        product.brand ||
        'Electrical';
    const image = getPrimaryImage(product);
    const imageUrl = resolveMediaUrl(
        image?.thumbnail_url || image?.thumb || image?.url,
    );
    const href = `/products/${encodeURIComponent(product.slug)}`;

    return (
        <article className="group relative rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="relative h-64 overflow-hidden rounded-t-2xl bg-slate-50">
                <Link
                    href={href}
                    aria-label={`View ${name}`}
                    className="block h-full w-full"
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            width={640}
                            height={480}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-50 to-slate-100">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    className="h-9 w-9 text-slate-300"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 8l-9-5-9 5m18 0l-9 5m9-5v8l-9 5m0-8L3 8m9 5v8M3 8v8l9 5"
                                    />
                                </svg>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                No Image
                            </span>
                        </div>
                    )}
                </Link>
            </div>

            <div className="absolute right-4 top-4 z-10">
                <ShareButton url={shareUrl} title={name} variant="compact" />
            </div>

            <div className="p-6">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-blue-600">
                    {category}
                </span>
                <h2 className="mb-2 truncate text-lg font-bold text-slate-900">
                    <Link
                        href={href}
                        className="transition-colors hover:text-blue-600"
                    >
                        {name}
                    </Link>
                </h2>

                <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xl font-extrabold text-slate-900">
                        {formatPrice(product.price)}
                    </span>
                    <Link
                        href={href}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-600"
                        aria-label={`View details for ${name}`}
                    >
                        Details
                    </Link>
                </div>
            </div>
        </article>
    );
}
