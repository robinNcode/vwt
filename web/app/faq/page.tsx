import type { Metadata } from 'next';

import FAQ from '@/views/FAQ';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions',
    description:
        'Answers about ordering, delivery, payments, warranty, and service support at Volt Wave Tech.',
    alternates: {
        canonical: '/faq',
    },
    openGraph: {
        title: 'Frequently Asked Questions | Volt Wave Tech',
        description:
            'Answers about ordering, delivery, payments, warranty, and service support at Volt Wave Tech.',
        url: '/faq',
        type: 'website',
        images: ['/images/final_logo.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Frequently Asked Questions | Volt Wave Tech',
        description:
            'Answers about ordering, delivery, payments, warranty, and service support at Volt Wave Tech.',
        images: ['/images/final_logo.png'],
    },
};

export default function Page() {
    return <FAQ />;
}
