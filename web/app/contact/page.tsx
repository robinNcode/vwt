import type { Metadata } from 'next';

import Contact from '@/views/Contact';

export const metadata: Metadata = {
    title: 'Contact Us',
    description:
        'Contact Volt Wave Tech for product enquiries, quotations, service bookings, and technical support.',
    alternates: {
        canonical: '/contact',
    },
};

export default function Page() {
    return <Contact />;
}
