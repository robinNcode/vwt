import type { Metadata } from 'next';

import View from '@/views/admin/Reports';

export const metadata: Metadata = {
    title: 'Reports',
};

export default function Page() {
    return <View />;
}
