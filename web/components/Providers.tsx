'use client';

import { Toaster } from 'react-hot-toast';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { ThemeProvider } from '@/components/ThemeContext';
import { SiteSettingsProvider } from '@/lib/settings';
import i18n from '@/lib/i18n';

export default function Providers({ children }: { children: ReactNode }) {
    useEffect(() => {
        const stored = window.localStorage.getItem('vwt_language');
        const language = stored === 'en' || stored === 'bn' ? stored : 'bn';

        if (i18n.language !== language) {
            void i18n.changeLanguage(language);
        }

        document.documentElement.lang = language;

        const handleLanguageChange = (value: string) => {
            window.localStorage.setItem('vwt_language', value);
            document.documentElement.lang = value;
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, []);

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
