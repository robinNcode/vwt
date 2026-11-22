import type { Metadata } from 'next';

import JsonLd from '@/components/JsonLd';
import Home from '@/views/Home';

const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
    title: 'Industrial Electrical & Automation Solutions',
    description:
        'Volt Wave Tech supplies industrial electrical equipment, AirTAC pneumatics, boiler spares, and delivers expert automation and engineering services across Bangladesh.',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Volt Wave Tech | Industrial Electrical & Automation',
        description:
            'Industrial electrical equipment, automation systems, and engineering services in Bangladesh.',
        url: '/',
        type: 'website',
        images: ['/images/final_logo.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Volt Wave Tech | Industrial Electrical & Automation',
        description:
            'Industrial electrical equipment, automation systems, and engineering services in Bangladesh.',
        images: ['/images/final_logo.png'],
    },
};

export default function Page() {
    return (
        <>
            <JsonLd
                value={{
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: 'Volt Wave Tech',
                    url: siteUrl,
                    potentialAction: {
                        '@type': 'SearchAction',
                        target: `${siteUrl}/products?search={search_term_string}`,
                        'query-input': 'required name=search_term_string',
                    },
                }}
            />
            <Home />
        </>
    );
}
