import type { Metadata } from 'next';

import View from '@/views/admin/Products';

export const metadata: Metadata = {
    title: 'Products',
};

export default function Page() {
    return <View />;
}
