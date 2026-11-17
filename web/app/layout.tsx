import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import Providers from '@/components/Providers';
import SiteChrome from '@/components/SiteChrome';
import './globals.css';

const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'Volt Wave Tech | Industrial Electrical & Automation',
        template: '%s | Volt Wave Tech',
    },
    description:
        'Industrial automation, electrical engineering, machinery supplies, and expert service support in Bangladesh.',
    keywords: [
        'electrical',
        'machinery',
        'engineering',
        'automation',
        'volt wave tech',
    ],
    icons: {
        icon: '/images/final_icon.png',
        shortcut: '/images/final_icon.png',
        apple: '/images/final_icon.png',
    },
    openGraph: {
        type: 'website',
        siteName: 'Volt Wave Tech',
        title: 'Volt Wave Tech | Industrial Electrical & Automation',
        description:
            'Industrial automation, electrical engineering, machinery supplies, and expert service support in Bangladesh.',
        images: ['/images/final_logo.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Volt Wave Tech | Industrial Electrical & Automation',
        description:
            'Industrial automation, electrical engineering, machinery supplies, and expert service support in Bangladesh.',
        images: ['/images/final_logo.png'],
    },
    alternates: {
        canonical: '/',
    },
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="bn" suppressHydrationWarning>
            <body className="font-sans" suppressHydrationWarning>
                <Providers>
                    <SiteChrome>{children}</SiteChrome>
                </Providers>
            </body>
        </html>
    );
}
