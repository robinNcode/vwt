import type { Metadata } from 'next';

import View from '@/views/admin/Messages';

export const metadata: Metadata = {
    title: 'Messages',
};

export default function Page() {
    return <View />;
}
