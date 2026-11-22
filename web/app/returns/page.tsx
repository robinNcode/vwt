import type { Metadata } from 'next';

import ReturnPolicy from '@/views/ReturnPolicy';

export const metadata: Metadata = {
    title: 'Return Policy',
    description:
        'Volt Wave Tech returns, replacement, and warranty policy for products and services.',
    alternates: {
        canonical: '/returns',
    },
    openGraph: {
        title: 'Return Policy | Volt Wave Tech',
        description:
            'Volt Wave Tech returns, replacement, and warranty policy for products and services.',
        url: '/returns',
        type: 'website',
        images: ['/images/final_logo.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Return Policy | Volt Wave Tech',
        description:
            'Volt Wave Tech returns, replacement, and warranty policy for products and services.',
        images: ['/images/final_logo.png'],
    },
};

export default function Page() {
    return <ReturnPolicy />;
}
