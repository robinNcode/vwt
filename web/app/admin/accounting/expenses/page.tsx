import type { Metadata } from 'next';

import View from '@/views/admin/Expenses';

export const metadata: Metadata = {
    title: 'Expenses',
};

export default function Page() {
    return <View />;
}
