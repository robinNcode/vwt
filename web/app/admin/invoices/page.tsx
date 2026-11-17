import type { Metadata } from 'next';

import View from '@/views/admin/Invoices';

export const metadata: Metadata = {
    title: 'Invoices',
};

export default function Page() {
    return <View />;
}
