import type { Metadata } from 'next';

import Checkout from '@/views/Checkout';

export const metadata: Metadata = {
    title: 'Checkout',
    description: 'Complete your Volt Wave Tech order.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <Checkout />;
}
