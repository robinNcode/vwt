import type { Metadata } from 'next';

import View from '@/views/admin/Quotations';

export const metadata: Metadata = {
    title: 'Quotations',
};

export default function Page() {
    return <View />;
}
