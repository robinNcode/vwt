import type { Metadata } from 'next';

import Contact from '@/views/Contact';

export const metadata: Metadata = {
    title: 'Contact Us',
    description:
        'Contact Volt Wave Tech for product enquiries, quotations, service bookings, and technical support.',
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: 'Contact Us | Volt Wave Tech',
        description:
            'Contact Volt Wave Tech for product enquiries, quotations, service bookings, and technical support.',
        url: '/contact',
        type: 'website',
        images: ['/images/final_logo.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Us | Volt Wave Tech',
        description:
            'Contact Volt Wave Tech for product enquiries, quotations, service bookings, and technical support.',
        images: ['/images/final_logo.png'],
    },
};

export default function Page() {
    return <Contact />;
}
