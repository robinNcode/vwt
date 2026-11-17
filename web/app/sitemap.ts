import type { MetadataRoute } from 'next';

import { apiFetch } from '@/lib/api';

export const revalidate = 120;

type ApiEnvelope<T> = {
    data?: T | null;
};

type SitemapRecord = {
    slug?: unknown;
    updated_at?: unknown;
};

function getOrigin(): string {
    const configured =
        process.env.SITE_URL?.trim() ||
        process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
        'http://localhost:3000';

    try {
        return new URL(configured).origin;
    } catch {
        return 'http://localhost:3000';
    }
}

function normalizeRecords(payload: ApiEnvelope<unknown>): SitemapRecord[] {
    const data = payload?.data;

    if (!Array.isArray(data)) {
        return [];
    }

    return data.filter(
        (item): item is Record<string, unknown> =>
            typeof item === 'object' && item !== null,
    );
}

async function fetchRecords(path: string): Promise<SitemapRecord[]> {
    try {
        return normalizeRecords(await apiFetch<ApiEnvelope<unknown>>(path));
    } catch {
        return [];
    }
}

function toEntries(
    records: SitemapRecord[],
    pathPrefix: string,
    origin: string,
): MetadataRoute.Sitemap {
    return records.flatMap((record) => {
        if (typeof record.slug !== 'string' || !record.slug.trim()) {
            return [];
        }

        let lastModified: Date | undefined;

        if (
            typeof record.updated_at === 'string' ||
            typeof record.updated_at === 'number'
        ) {
            const date = new Date(record.updated_at);

            if (!Number.isNaN(date.getTime())) {
                lastModified = date;
            }
        }

        return [
            {
                url: `${origin}${pathPrefix}/${encodeURIComponent(record.slug.trim())}`,
                lastModified,
            },
        ];
    });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const origin = getOrigin();
    const now = new Date();

    const [products, services, posts] = await Promise.all([
        fetchRecords('/products'),
        fetchRecords('/services'),
        fetchRecords('/blog'),
    ]);

    const staticEntries: MetadataRoute.Sitemap = [
        { url: origin, lastModified: now, changeFrequency: 'weekly', priority: 1 },
        { url: `${origin}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${origin}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${origin}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${origin}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${origin}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${origin}/shipping`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
        { url: `${origin}/returns`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
        { url: `${origin}/track-order`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    ];

    return [
        ...staticEntries,
        ...toEntries(products, '/products', origin),
        ...toEntries(services, '/services', origin),
        ...toEntries(posts, '/blog', origin),
    ];
}
