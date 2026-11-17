import type { Metadata } from 'next';

import View from '@/views/admin/Services';

export const metadata: Metadata = {
    title: 'Services',
};

export default function Page() {
    return <View />;
}
