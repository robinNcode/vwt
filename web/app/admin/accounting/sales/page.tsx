import type { Metadata } from 'next';

import View from '@/views/admin/Sales';

export const metadata: Metadata = {
    title: 'Sales',
};

export default function Page() {
    return <View />;
}
