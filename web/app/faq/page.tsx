import type { Metadata } from 'next';

import FAQ from '@/views/FAQ';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions',
    description:
        'Answers about ordering, delivery, payments, warranty, and service support at Volt Wave Tech.',
    alternates: {
        canonical: '/faq',
    },
};

export default function Page() {
    return <FAQ />;
}
