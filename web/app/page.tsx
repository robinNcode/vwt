import type { Metadata } from 'next';

import Home from '@/views/Home';

export const metadata: Metadata = {
    title: 'Industrial Electrical & Automation Solutions',
    description:
        'Volt Wave Tech supplies industrial electrical equipment, AirTAC pneumatics, boiler spares, and delivers expert automation and engineering services across Bangladesh.',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Volt Wave Tech | Industrial Electrical & Automation',
        description:
            'Industrial electrical equipment, automation systems, and engineering services in Bangladesh.',
        url: '/',
        images: ['/images/final_logo.png'],
    },
};

export default function Page() {
    return <Home />;
}
