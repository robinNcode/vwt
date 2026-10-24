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
    [key: string]: any;
}

export interface DbSettingItem {
    id: number;
    group: string;
    key: string;
    value: string | null;
    label_en: string | null;
    label_bn: string | null;
}

interface SiteSettingsContextType {
    settings: WebSettings | null;
    dbSettings: Record<string, string>;
    loading: boolean;
    refreshSettings: () => Promise<void>;
    getDbSetting: (key: string, defaultValue?: string) => string;
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
    email: 'info@voltwave.tech',
    phone: '+880 1700-000000',
    phone2: '+880 1234-567890',
    address: 'Kazi Nazrul Islam Ave, Dhaka, Bangladesh',
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
    business_address: 'Kazi Nazrul Islam Ave, Dhaka, Bangladesh',
    business_email: 'info@voltwave.tech',
    business_phone: '+880 1700-000000',
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
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
    settings: DEFAULT_SETTINGS,
    dbSettings: {},
    loading: false,
    refreshSettings: async () => {},
    getDbSetting: () => '',
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<WebSettings>(DEFAULT_SETTINGS);
    const [dbSettings, setDbSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<boolean>(true);

    const refreshSettings = useCallback(async () => {
        try {
            const [webRes, dbRes] = await Promise.allSettled([
                api.get('/web-settings'),
                api.get('/settings'), // Public/cached or available endpoint
            ]);

            let merged = { ...DEFAULT_SETTINGS };
            const dbMap: Record<string, string> = {};

            if (dbRes.status === 'fulfilled' && dbRes.value.data?.success && Array.isArray(dbRes.value.data.data)) {
                dbRes.value.data.data.forEach((item: DbSettingItem) => {
                    if (item.key && item.value !== null && item.value !== undefined) {
                        dbMap[item.key] = item.value;
                    }
                });
                setDbSettings(dbMap);
            }

            if (webRes.status === 'fulfilled' && webRes.value.data?.success && webRes.value.data.data) {
                merged = { ...merged, ...webRes.value.data.data };
                if (webRes.value.data.data.social_links) {
                    merged.social_links = {
                        ...merged.social_links,
                        ...webRes.value.data.data.social_links,
                    };
                }
            }

            // Fallback DB fields into web settings if web settings is blank
            if (dbMap['site_name'] && !merged.site_name) merged.site_name = dbMap['site_name'];
            if (dbMap['site_email'] && !merged.email) merged.email = dbMap['site_email'];
            if (dbMap['site_phone'] && !merged.phone) merged.phone = dbMap['site_phone'];
            if (dbMap['site_address'] && !merged.address) merged.address = dbMap['site_address'];
            if (dbMap['footer_text'] && !merged.footer_text) merged.footer_text = dbMap['footer_text'];
            if (dbMap['facebook_url'] && !merged.social_links.facebook) merged.social_links.facebook = dbMap['facebook_url'];
            if (dbMap['linkedin_url'] && !merged.social_links.linkedin) merged.social_links.linkedin = dbMap['linkedin_url'];

            setSettings(merged);

            // Update document title dynamically
            if (merged.site_name && document.title) {
                if (!document.title.includes(merged.site_name)) {
                    document.title = merged.site_name;
                }
            }

            // Update Favicon dynamically if provided
            if (merged.favicon_url) {
                const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = merged.favicon_url;
                document.getElementsByTagName('head')[0].appendChild(link);
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

    const getDbSetting = (key: string, defaultValue = ''): string => {
        return dbSettings[key] ?? defaultValue;
    };

    return (
        <SiteSettingsContext.Provider value={{ settings, dbSettings, loading, refreshSettings, getDbSetting }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
export default SiteSettingsContext;

