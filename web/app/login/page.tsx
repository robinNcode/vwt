import type { Metadata } from 'next';

import Login from '@/views/Login';

export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Sign in to the Volt Wave Tech administration panel.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <Login />;
}
