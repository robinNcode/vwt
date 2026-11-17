'use client';

import { Toaster } from 'react-hot-toast';
import type { ReactNode } from 'react';

import { ThemeProvider } from '@/components/ThemeContext';
import { SiteSettingsProvider } from '@/lib/settings';
import '@/lib/i18n';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <SiteSettingsProvider>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        className: 'dark:bg-[#1A1E29] dark:text-white',
                    }}
                />
            </SiteSettingsProvider>
        </ThemeProvider>
    );
}
