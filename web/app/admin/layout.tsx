import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import AdminLayout from '@/components/layout/AdminLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: {
        default: 'Admin',
        template: '%s | VWT Admin',
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminRootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return <AdminLayout>{children}</AdminLayout>;
}
