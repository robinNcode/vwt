import type { Metadata } from 'next';

import About from '@/views/About';

export const metadata: Metadata = {
    title: 'About Us',
    description:
        'Learn about Volt Wave Tech, our engineering team, and our mission to deliver reliable industrial electrical and automation solutions.',
    alternates: {
        canonical: '/about',
    },
};

export default function Page() {
    return <About />;
}
