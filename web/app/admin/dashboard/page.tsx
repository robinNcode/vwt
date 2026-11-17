import type { Metadata } from 'next';

import View from '@/views/admin/Dashboard';

export const metadata: Metadata = {
    title: 'Dashboard',
};

export default function Page() {
    return <View />;
}
