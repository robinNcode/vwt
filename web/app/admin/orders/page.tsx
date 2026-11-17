import type { Metadata } from 'next';

import View from '@/views/admin/Orders';

export const metadata: Metadata = {
    title: 'Orders',
};

export default function Page() {
    return <View />;
}
