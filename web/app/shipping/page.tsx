import type { Metadata } from 'next';

import ShippingPolicy from '@/views/ShippingPolicy';

export const metadata: Metadata = {
    title: 'Shipping Policy',
    description:
        'Volt Wave Tech delivery timelines, shipping charges, and courier coverage across Bangladesh.',
    alternates: {
        canonical: '/shipping',
    },
};

export default function Page() {
    return <ShippingPolicy />;
}
