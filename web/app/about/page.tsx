import type { Metadata } from 'next';

import About from '@/views/About';

export const metadata: Metadata = {
    title: 'About Us',
    description:
        'Learn about Volt Wave Tech, our engineering team, and our mission to deliver reliable industrial electrical and automation solutions.',
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: 'About Us | Volt Wave Tech',
        description:
            'Learn about Volt Wave Tech, our engineering team, and our mission to deliver reliable industrial electrical and automation solutions.',
        url: '/about',
        type: 'website',
        images: ['/images/final_logo.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Us | Volt Wave Tech',
        description:
            'Learn about Volt Wave Tech, our engineering team, and our mission to deliver reliable industrial electrical and automation solutions.',
        images: ['/images/final_logo.png'],
    },
};

export default function Page() {
    return <About />;
}
