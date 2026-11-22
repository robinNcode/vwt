import type { Metadata } from 'next';
import { Suspense } from 'react';

import JsonLd from '@/components/JsonLd';
import { apiFetch } from '@/lib/api';
import Products, { type Product } from '@/views/Products';

type ApiEnvelope<T> = {
    data?: T | { items?: T } | null;
};

const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

async function fetchProducts(): Promise<Product[]> {
    try {
        const payload = await apiFetch<ApiEnvelope<Product[]>>('/products');
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
    title: 'Products',
    description:
        'Browse industrial electrical products, AirTAC pneumatics, boiler spares, and equipment from Volt Wave Tech.',
    alternates: {
        canonical: '/products',
    },
    openGraph: {
        title: 'Products | Volt Wave Tech',
        description:
            'Browse industrial electrical products, AirTAC pneumatics, boiler spares, and equipment.',
        url: '/products',
        type: 'website',
        images: ['/images/final_logo.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Products | Volt Wave Tech',
        description:
            'Browse industrial electrical products, AirTAC pneumatics, boiler spares, and equipment.',
        images: ['/images/final_logo.png'],
    },
};

export default async function Page() {
    const products = await fetchProducts();

    return (
        <>
            <JsonLd value={{
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    name: 'Products',
                    url: `${siteUrl}/products`,
                    numberOfItems: products.length,
                    itemListElement: products.slice(0, 50).map((product, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        url: `${siteUrl}/products/${encodeURIComponent(product.slug || String(product.id))}`,
                        name: product.name_en || product.name_bn,
                    })),
                }}
            />
            <Suspense fallback={<div className="min-h-screen bg-white dark:bg-[#0D0F14]" />}>
                <Products initialProducts={products} />
            </Suspense>
        </>
    );
}
