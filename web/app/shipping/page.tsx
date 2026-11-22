import type { Metadata } from 'next';

import ShippingPolicy from '@/views/ShippingPolicy';

export const metadata: Metadata = {
    title: 'Shipping Policy',
    description:
        'Volt Wave Tech delivery timelines, shipping charges, and courier coverage across Bangladesh.',
    alternates: {
        canonical: '/shipping',
    },
    openGraph: {
        title: 'Shipping Policy | Volt Wave Tech',
        description:
            'Volt Wave Tech delivery timelines, shipping charges, and courier coverage across Bangladesh.',
        url: '/shipping',
        type: 'website',
        images: ['/images/final_logo.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Shipping Policy | Volt Wave Tech',
        description:
            'Volt Wave Tech delivery timelines, shipping charges, and courier coverage across Bangladesh.',
        images: ['/images/final_logo.png'],
    },
};

export default function Page() {
    return <ShippingPolicy />;
}
