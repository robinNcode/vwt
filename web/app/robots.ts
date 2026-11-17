import type { MetadataRoute } from 'next';

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

export default function robots(): MetadataRoute.Robots {
    const origin = getOrigin();

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/cart', '/checkout', '/account', '/admin', '/login'],
            },
        ],
        sitemap: `${origin}/sitemap.xml`,
    };
}
