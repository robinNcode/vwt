import type { Metadata } from 'next';

import TrackOrder from '@/views/TrackOrder';

export const metadata: Metadata = {
    title: 'Track Your Order',
    description:
        'Track the delivery status of your Volt Wave Tech order using your order number and contact details.',
    alternates: {
        canonical: '/track-order',
    },
};

export default function Page() {
    return <TrackOrder />;
}
