import type { Metadata } from 'next';

import View from '@/views/admin/Profile';

export const metadata: Metadata = {
    title: 'Profile',
};

export default function Page() {
    return <View />;
}
