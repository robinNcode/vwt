'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

export default function SiteChrome({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isStandalone =
        pathname.startsWith('/admin') || pathname === '/login';

    if (isStandalone) {
        return <>{children}</>;
    }

    const isHome = pathname === '/';

    return (
        <div
            className={`min-h-screen font-sans text-slate-900 transition-colors duration-300 selection:bg-blue-100 selection:text-blue-900 dark:bg-[#0D0F14] dark:text-white ${
                isHome ? 'bg-slate-50' : 'bg-white'
            }`}
        >
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
