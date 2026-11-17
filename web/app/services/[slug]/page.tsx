import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, ChevronRight, Clock, Shield, Wrench, Zap } from 'lucide-react';

import AddToCartButton from '@/components/AddToCartButton';
import JsonLd, { breadcrumbList } from '@/components/JsonLd';
import ServiceCard from '@/components/ServiceCard';
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

type ServiceDetail = {
    id: number;
    slug: string;
    name_bn?: string | null;
    name_en?: string | null;
    description_bn?: string | null;
    description_en?: string | null;
    price?: number | string | null;
    image_url?: string | null;
    thumbnail_url?: string | null;
    thumb?: string | null;
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

function stripHtml(value?: string | null): string {
    return (value || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

async function getService(slug: string): Promise<ServiceDetail | null> {
    try {
        const payload = await apiFetch<ApiEnvelope<ServiceDetail>>(
            `/services/${encodeURIComponent(slug)}`,
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
    const service = await getService(slug);

    if (!service) {
        return { title: 'Service Not Found' };
    }

    const name = service.name_bn || service.name_en || 'Service';
    const description =
        stripHtml(
            service.description_bn || service.description_en,
        ) || `${name} provided by Volt Wave Tech.`;
    const image = absoluteMediaUrl(
        service.thumbnail_url || service.thumb || service.image_url,
    );
    const canonical = `${siteUrl}/services/${service.slug}`;

    return {
        title: name,
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

async function getOtherServices(slug: string): Promise<ServiceDetail[]> {
    try {
        const payload = await apiFetch<{
            data?: ServiceDetail[] | { items?: ServiceDetail[] } | null;
        }>('/services');
        const data = payload.data;

        if (Array.isArray(data)) {
            return data.filter((item) => item.slug !== slug).slice(0, 3);
        }

        if (data && Array.isArray(data.items)) {
            return data.items
                .filter((item) => item.slug !== slug)
                .slice(0, 3);
        }

        return [];
    } catch {
        return [];
    }
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const service = await getService(slug);

    if (!service) {
        notFound();
    }

    const name = service.name_bn || service.name_en || 'Service';
    const description =
        service.description_bn ||
        service.description_en ||
        'Expert electrical solutions provided by our certified team of professionals.';
    const price = Number(service.price ?? 0);
    const image = absoluteMediaUrl(
        service.thumbnail_url || service.thumb || service.image_url,
    );
    const otherServices = await getOtherServices(service.slug);
    const shareUrl = `${siteUrl}/services/${service.slug}`;

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
                        <Link href="/services" className="hover:text-blue-600">
                            Services
                        </Link>
                        <ChevronRight size={12} />
                        <span className="text-slate-900 dark:text-white">{name}</span>
                    </nav>
                </div>
            </div>

            <section className="container-custom py-12 lg:py-16">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    <div>
                        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-blue-600 to-indigo-700 dark:border-white/5 dark:from-[#1A1E29] dark:to-[#0D0F14]">
                            {image ? (
                                <img
                                    src={image}
                                    alt={name}
                                    className="h-full max-h-[420px] w-full object-cover opacity-80"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-3 py-24 text-white/80">
                                    <Wrench size={64} strokeWidth={1} />
                                    <span className="text-xs font-bold uppercase tracking-widest">
                                        Professional Service
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                            {[
                                { icon: Shield, label: 'Certified Team' },
                                { icon: Clock, label: 'Quick Turnaround' },
                                { icon: Zap, label: '24/7 Support' },
                            ].map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.label}
                                        className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center dark:border-white/5 dark:bg-white/5"
                                    >
                                        <Icon size={18} className="text-blue-600 dark:text-[#F5A623]" />
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                            {item.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 dark:bg-blue-500/10 dark:text-[#F5A623]">
                            Service
                        </span>

                        <h1 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl dark:text-white">
                            {name}
                        </h1>

                        <p className="mt-6 text-3xl font-black text-slate-900 dark:text-white">
                            {price > 0
                                ? `৳${price.toLocaleString('en-US')}`
                                : 'Contact for pricing'}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            {price > 0 ? (
                                <AddToCartButton
                                    serviceId={service.id}
                                    service={service}
                                    label="Book Service"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95 dark:bg-[#F5A623] dark:text-[#0D0F14] dark:hover:bg-[#D48E1D]"
                                />
                            ) : (
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-blue-700 dark:bg-[#F5A623] dark:text-[#0D0F14]"
                                >
                                    Request a Quote
                                </Link>
                            )}
                            <ShareButton url={shareUrl} title={name} />
                        </div>

                        <div className="mt-10 border-t border-slate-100 pt-8 dark:border-white/5">
                            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                                Service Overview
                            </h2>
                            <div
                                className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 [&_a]:text-blue-600 [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-3"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />

                            <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                                {[
                                    'Site assessment and requirement analysis',
                                    'Certified engineers and tested equipment',
                                    'Post-service support and documentation',
                                ].map((point) => (
                                    <li key={point} className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {otherServices.length > 0 && (
                <section className="border-t border-slate-100 bg-slate-50 py-16 dark:border-white/5 dark:bg-[#0D0F14]">
                    <div className="container-custom">
                        <h2 className="mb-8 text-2xl font-extrabold text-slate-900 dark:text-white">
                            Other Services
                        </h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                            {otherServices.map((item) => (
                                <ServiceCard
                                    key={item.id}
                                    service={item}
                                    shareUrl={`${siteUrl}/services/${item.slug}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <JsonLd
                value={breadcrumbList([
                    { name: 'Home', url: siteUrl },
                    { name: 'Services', url: `${siteUrl}/services` },
                    { name, url: shareUrl },
                ])}
            />
            <JsonLd
                value={{
                    '@context': 'https://schema.org',
                    '@type': 'Service',
                    name,
                    description: stripHtml(description),
                    url: shareUrl,
                    image: image || undefined,
                    provider: {
                        '@type': 'Organization',
                        name: 'Volt Wave Tech',
                        url: siteUrl,
                    },
                    areaServed: {
                        '@type': 'Country',
                        name: 'Bangladesh',
                    },
                    offers:
                        price > 0
                            ? {
                                  '@type': 'Offer',
                                  url: shareUrl,
                                  priceCurrency: 'BDT',
                                  price: price.toFixed(2),
                                  availability: 'https://schema.org/InStock',
                              }
                            : undefined,
                }}
            />
        </div>
    );
}
