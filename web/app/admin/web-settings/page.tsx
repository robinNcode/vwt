import type { Metadata } from 'next';

import View from '@/views/admin/WebSettings';

export const metadata: Metadata = {
    title: 'Web Settings',
};

export default function Page() {
    return <View />;
}
