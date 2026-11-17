import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Package, ShieldCheck, Truck } from 'lucide-react';

import AddToCartButton from '@/components/AddToCartButton';
import JsonLd, { breadcrumbList } from '@/components/JsonLd';
import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/ProductGallery';
import ShareButton from '@/components/ShareButton';
import { ApiError, apiFetch } from '@/lib/api';

export const revalidate = 120;

const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
const apiOrigin = (() => {
    try {
        return new URL(
            process.env.API_URL || 'http://127.0.0.1:8000/api/v1',
        ).origin;
    } catch {
        return 'http://127.0.0.1:8000';
    }
})();

type ProductImage = {
    id?: number;
    url?: string | null;
    thumbnail_url?: string | null;
    thumb?: string | null;
    alt_bn?: string | null;
    alt_en?: string | null;
    is_primary?: boolean;
    sort_order?: number;
};

type ProductDetail = {
    id: number;
    slug: string;
    name_bn?: string | null;
    name_en?: string | null;
    sku?: string | null;
    brand?: string | null;
    price?: number | string | null;
    stock?: number | null;
    short_desc_bn?: string | null;
    short_desc_en?: string | null;
    description_bn?: string | null;
    description_en?: string | null;
    meta_title_bn?: string | null;
    meta_title_en?: string | null;
    meta_desc_bn?: string | null;
    meta_desc_en?: string | null;
    category?: { name_bn?: string | null; name_en?: string | null } | null;
    images?: ProductImage[] | null;
    updated_at?: string | null;
};

type ApiEnvelope<T> = { data?: T | null };

type PageProps = {
    params: Promise<{ slug: string }>;
};

function absoluteMediaUrl(value?: string | null): string | null {
    if (!value) return null;
    if (/^https?:\/\//i.test(value)) return value;

    return `${apiOrigin}${value.startsWith('/') ? '' : '/'}${value}`;
}

function primaryImage(product: ProductDetail): string | null {
    const images = product.images || [];
    const image = images.find((item) => item.is_primary) || images[0];

    return absoluteMediaUrl(image?.url || image?.thumbnail_url || image?.thumb);
}

function stripHtml(value?: string | null): string {
    return (value || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

async function getProduct(slug: string): Promise<ProductDetail | null> {
    try {
        const payload = await apiFetch<ApiEnvelope<ProductDetail>>(
            `/products/${encodeURIComponent(slug)}`,
        );

        return payload.data ?? null;
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return null;
        }

        return null;
    }
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return { title: 'Product Not Found' };
    }

    const name = product.name_bn || product.name_en || 'Product';
    const description =
        stripHtml(
            product.meta_desc_bn ||
                product.meta_desc_en ||
                product.short_desc_bn ||
                product.short_desc_en ||
                product.description_bn ||
                product.description_en,
        ) || `${name} available from Volt Wave Tech.`;
    const image = primaryImage(product);
    const canonical = `${siteUrl}/products/${product.slug}`;

    return {
        title: product.meta_title_bn || product.meta_title_en || name,
        description,
        alternates: { canonical },
        openGraph: {
            title: name,
            description,
            url: canonical,
            type: 'website',
            images: image ? [{ url: image, alt: name }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: name,
            description,
            images: image ? [image] : undefined,
        },
    };
}

async function getRelatedProducts(
    categoryName: string | null | undefined,
): Promise<ProductDetail[]> {
    if (!categoryName) return [];

    try {
        const payload = await apiFetch<ApiEnvelope<ProductDetail[]>>('/products');

        if (!Array.isArray(payload.data)) return [];

        return payload.data
            .filter(
                (item) =>
                    (item.category?.name_en || item.category?.name_bn) ===
                    categoryName,
            )
            .slice(0, 4);
    } catch {
        return [];
    }
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const name = product.name_bn || product.name_en || 'Product';
    const description =
        product.description_bn ||
        product.description_en ||
        product.short_desc_bn ||
        product.short_desc_en ||
        '';
    const price = Number(product.price ?? 0);
    const inStock = Number(product.stock ?? 0) > 0;
    const image = primaryImage(product);
    const categoryName = product.category?.name_bn || product.category?.name_en;
    const related = await getRelatedProducts(
        product.category?.name_en || product.category?.name_bn,
    );
    const shareUrl = `${siteUrl}/products/${product.slug}`;

    return (
        <div className="bg-white dark:bg-[#0D0F14]">
            <div className="border-b border-slate-100 bg-slate-50 pt-28 dark:border-white/5 dark:bg-[#0D0F14]">
                <div className="container-custom py-5">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
                    >
                        <Link href="/" className="hover:text-blue-600">
                            Home
                        </Link>
                        <ChevronRight size={12} />
                        <Link href="/products" className="hover:text-blue-600">
                            Products
                        </Link>
                        <ChevronRight size={12} />
                        <span className="text-slate-900 dark:text-white">
                            {name}
                        </span>
                    </nav>
                </div>
            </div>

            <section className="container-custom py-12 lg:py-16">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    <ProductGallery images={product.images || []} name={name} />

                    <div>
                        {categoryName && (
                            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 dark:bg-blue-500/10 dark:text-[#F5A623]">
                                {categoryName}
                            </span>
                        )}

                        <h1 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl dark:text-white">
                            {name}
                        </h1>

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            {product.brand && <span>Brand: {product.brand}</span>}
                            {product.sku && (
                                <span className="font-mono">SKU: {product.sku}</span>
                            )}
                            <span
                                className={
                                    inStock
                                        ? 'font-bold text-emerald-600'
                                        : 'font-bold text-red-500'
                                }
                            >
                                {inStock ? 'In stock' : 'Out of stock'}
                            </span>
                        </div>

                        <p className="mt-6 text-3xl font-black text-slate-900 dark:text-white">
                            ৳{price.toLocaleString('en-US')}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <AddToCartButton
                                productId={product.id}
                                product={product}
                                disabled={!inStock}
                                label={inStock ? 'Add to Cart' : 'Out of Stock'}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#F5A623] dark:text-[#0D0F14] dark:hover:bg-[#D48E1D]"
                            />
                            <ShareButton url={shareUrl} title={name} />
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-600 sm:grid-cols-3 dark:border-white/5 dark:bg-white/5 dark:text-slate-300">
                            <span className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                Genuine product
                            </span>
                            <span className="flex items-center gap-2">
                                <Truck size={16} className="text-blue-500" />
                                Nationwide delivery
                            </span>
                            <span className="flex items-center gap-2">
                                <Package size={16} className="text-orange-500" />
                                Expert support
                            </span>
                        </div>

                        {description && (
                            <div className="mt-10 border-t border-slate-100 pt-8 dark:border-white/5">
                                <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                                    Product Details
                                </h2>
                                <div
                                    className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 [&_a]:text-blue-600 [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-3"
                                    dangerouslySetInnerHTML={{ __html: description }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {related.length > 0 && (
                <section className="border-t border-slate-100 bg-slate-50 py-16 dark:border-white/5 dark:bg-[#0D0F14]">
                    <div className="container-custom">
                        <h2 className="mb-8 text-2xl font-extrabold text-slate-900 dark:text-white">
                            Related Products
                        </h2>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {related
                                .filter((item) => item.slug !== product.slug)
                                .map((item) => (
                                    <ProductCard
                                        key={item.id}
                                        product={{
                                            ...item,
                                            slug: item.slug,
                                            images: item.images,
                                        }}
                                        shareUrl={`${siteUrl}/products/${item.slug}`}
                                    />
                                ))}
                        </div>
                    </div>
                </section>
            )}

            <JsonLd
                value={breadcrumbList([
                    { name: 'Home', url: siteUrl },
                    { name: 'Products', url: `${siteUrl}/products` },
                    { name, url: shareUrl },
                ])}
            />
            <JsonLd
                value={{
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    name,
                    description: stripHtml(description),
                    sku: product.sku || undefined,
                    brand: product.brand
                        ? { '@type': 'Brand', name: product.brand }
                        : undefined,
                    category: categoryName || undefined,
                    image: image ? [image] : undefined,
                    url: shareUrl,
                    offers: {
                        '@type': 'Offer',
                        url: shareUrl,
                        priceCurrency: 'BDT',
                        price: price.toFixed(2),
                        availability: inStock
                            ? 'https://schema.org/InStock'
                            : 'https://schema.org/OutOfStock',
                        itemCondition: 'https://schema.org/NewCondition',
                    },
                }}
            />
        </div>
    );
}
