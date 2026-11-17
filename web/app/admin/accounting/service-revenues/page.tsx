import type { Metadata } from 'next';

import View from '@/views/admin/ServiceRevenues';

export const metadata: Metadata = {
    title: 'Service Revenues',
};

export default function Page() {
    return <View />;
}
