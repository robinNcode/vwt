import type { Metadata } from 'next';

import View from '@/views/admin/Settings';

export const metadata: Metadata = {
    title: 'Settings',
};

export default function Page() {
    return <View />;
}
