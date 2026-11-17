import type { Metadata } from 'next';

import View from '@/views/admin/Purchases';

export const metadata: Metadata = {
    title: 'Purchases',
};

export default function Page() {
    return <View />;
}
