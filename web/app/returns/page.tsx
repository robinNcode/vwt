import type { Metadata } from 'next';

import ReturnPolicy from '@/views/ReturnPolicy';

export const metadata: Metadata = {
    title: 'Return Policy',
    description:
        'Volt Wave Tech returns, replacement, and warranty policy for products and services.',
    alternates: {
        canonical: '/returns',
    },
};

export default function Page() {
    return <ReturnPolicy />;
}
