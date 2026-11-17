import type { Metadata } from 'next';

import View from '@/views/admin/Users';

export const metadata: Metadata = {
    title: 'Users',
};

export default function Page() {
    return <View />;
}
