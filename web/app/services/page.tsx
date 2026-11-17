import type { Metadata } from 'next';
import { Suspense } from 'react';

import JsonLd from '@/components/JsonLd';
import { apiFetch } from '@/lib/api';
import Services, { type Service } from '@/views/Services';

export const dynamic = 'force-dynamic';

type ApiEnvelope<T> = {
    data?: T | { items?: T } | null;
};

const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

async function fetchServices(): Promise<Service[]> {
    try {
        const payload = await apiFetch<ApiEnvelope<Service[]>>('/services');
        const data = payload.data;

        if (Array.isArray(data)) {
            return data;
        }

        if (data && Array.isArray(data.items)) {
            return data.items;
        }

        return [];
    } catch {
        return [];
    }
}

export const metadata: Metadata = {
    title: 'Services',
    description:
        'Professional electrical engineering, automation, installation, and maintenance services from Volt Wave Tech.',
    alternates: {
        canonical: '/services',
    },
    openGraph: {
        title: 'Services | Volt Wave Tech',
        description:
            'Professional electrical engineering, automation, installation, and maintenance services.',
        url: '/services',
    },
};

export default async function Page() {
    const services = await fetchServices();

    return (
        <>
            <JsonLd value={{
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    name: 'Services',
                    url: `${siteUrl}/services`,
                    numberOfItems: services.length,
                    itemListElement: services.slice(0, 50).map((service, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        url: `${siteUrl}/services/${encodeURIComponent(service.slug || String(service.id))}`,
                        name: service.name_en || service.name_bn,
                    })),
                }}
            />
            <Suspense fallback={<div className="min-h-screen bg-white dark:bg-[#0D0F14]" />}>
                <Services initialServices={services} />
            </Suspense>
        </>
    );
}
