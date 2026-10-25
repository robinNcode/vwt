import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from './axios';

export interface WebSettings {
    site_name: string;
    site_tagline: string;
    site_description: string;
    logo_url: string;
    favicon_url: string;
    footer_text: string;
    social_links: {
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
        youtube: string;
        whatsapp: string;
        tiktok: string;
    };
    email: string;
    phone: string;
    phone2: string;
    address: string;
    map_url: string;

    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    og_image: string;
    google_analytics: string;
    canonical_url: string;

    company_name: string;
    company_subtitle: string;
    company_logo_url: string;
    signature_image_url: string;
    proprietor_name: string;
    proprietor_title: string;
    business_address: string;
    business_email: string;
    business_phone: string;
    business_phone2: string;
    bank_name: string;
    bank_account_name: string;
    bank_account_number: string;
    bank_routing_number: string;
    invoice_footer_note: string;

    smtp_host: string;
    smtp_port: string;
    smtp_user: string;
    smtp_from_name: string;
    smtp_from_email: string;
    smtp_encryption: string;

    theme_primary_color: string;
    theme_accent_color: string;
    theme_font_family: string;
    theme_heading_font: string;
    theme_default_mode: string;
    theme_border_radius: string;
    theme_sidebar_style: string;

    machinery_import_tax: string;
    default_shipment_method: string;
    currency_code: string;
    currency_symbol: string;

    enable_mfa: string;
    session_timeout: string;
    email_on_new_order: string;
    sms_on_critical_alert: string;

    [key: string]: any;
}

interface SiteSettingsContextType {
    settings: WebSettings | null;
    loading: boolean;
    refreshSettings: () => Promise<void>;
    getSetting: (key: string, defaultValue?: string) => string;
}

const DEFAULT_SETTINGS: WebSettings = {
    site_name: 'Volt Wave Tech',
    site_tagline: 'Empowering Next-Gen Electrical & Automation Solutions',
    site_description: 'Premier provider of high-grade industrial electrical equipment, automation systems, and engineering services.',
    logo_url: '',
    favicon_url: '',
    footer_text: '© 2026 Volt Wave Tech. All rights reserved.',
    social_links: {
        facebook: 'https://facebook.com/voltwavetech',
        twitter: '',
        instagram: '',
        linkedin: 'https://linkedin.com/company/voltwave',
        youtube: '',
        whatsapp: '+880170000000',
        tiktok: '',
    },
    email: 'admin@voltwavebd.com',
    phone: '+880 1822-108496',
    phone2: '',
    address: 'Kamarpara Nurani Madrasa, Uttara, Dhaka',
    map_url: '',
    meta_title: 'Volt Wave Tech | Industrial Electrical & Automation',
    meta_description: 'Industrial automation, electrical engineering, and machinery supplies in Bangladesh.',
    meta_keywords: 'electrical, machinery, engineering, automation, volt wave tech',
    og_image: '',
    google_analytics: '',
    canonical_url: 'https://voltwavebd.com',
    company_name: 'Volt Wave Tech',
    company_subtitle: 'Engineering & Industrial Solutions',
    company_logo_url: '',
    signature_image_url: '',
    proprietor_name: 'Md. Nazmul Huda',
    proprietor_title: 'Managing Director',
    business_address: 'Kamarpara Nurani Madrasa, Uttara, Dhaka',
    business_email: 'admin@voltwavebd.com',
    business_phone: '+880 1822-108496',
    business_phone2: '',
    bank_name: 'City Bank PLC',
    bank_account_name: 'Volt Wave Tech',
    bank_account_number: '1234567890123',
    bank_routing_number: '225272645',
    invoice_footer_note: 'Thank you for your business. For any query, contact accounts@voltwave.tech',
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_user: '',
    smtp_from_name: 'Volt Wave Tech',
    smtp_from_email: 'noreply@voltwave.tech',
    smtp_encryption: 'tls',
    theme_primary_color: '#F5A623',
    theme_accent_color: '#2B3A55',
    theme_font_family: 'Inter',
    theme_heading_font: 'Sora',
    theme_default_mode: 'system',
    theme_border_radius: 'rounded',
    theme_sidebar_style: 'default',
    machinery_import_tax: '15.5',
    default_shipment_method: 'Freight',
    currency_code: 'BDT',
    currency_symbol: '৳',
    enable_mfa: 'false',
    session_timeout: '60',
    email_on_new_order: 'true',
    sms_on_critical_alert: 'true',
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
    settings: DEFAULT_SETTINGS,
    loading: false,
    refreshSettings: async () => { },
    getSetting: () => '',
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<WebSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState<boolean>(true);

    const refreshSettings = useCallback(async () => {
        try {
            // Read all settings directly from database-backed endpoint
            const res = await api.get('/web-settings');

            if (res.data?.success && res.data.data) {
                const fetched = res.data.data;
                const merged: WebSettings = {
                    ...DEFAULT_SETTINGS,
                    ...fetched,
                    social_links: {
                        ...DEFAULT_SETTINGS.social_links,
                        ...(fetched.social_links || {}),
                    },
                };

                setSettings(merged);

                // Update document title dynamically
                if (merged.site_name && document.title) {
                    if (!document.title.includes(merged.site_name)) {
                        document.title = merged.site_name;
                    }
                }

                // Update Favicon dynamically if provided
                if (merged.favicon_url) {
                    const link = (document.querySelector("link[rel*='icon']") as HTMLLinkElement) || document.createElement('link');
                    link.type = 'image/x-icon';
                    link.rel = 'shortcut icon';
                    link.href = merged.favicon_url;
                    document.getElementsByTagName('head')[0].appendChild(link);
                }
            }
        } catch (error) {
            console.warn('SiteSettingsProvider: using fallback defaults', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshSettings();
    }, [refreshSettings]);

    const getSetting = (key: string, defaultValue = ''): string => {
        return settings?.[key] !== undefined && settings?.[key] !== null ? String(settings[key]) : defaultValue;
    };

    return (
        <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings, getSetting }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
export default SiteSettingsContext;
