import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Settings as SettingsIcon,
    Save,
    Globe,
    ShieldCheck,
    Bell,
    Loader2,
    Search,
    Truck,
    Share2,
    RotateCcw,
    Mail,
    Phone,
    FileText,
    Palette,
    Eye,
    EyeOff,
    ExternalLink,
    HelpCircle,
    CheckCircle2,
    AlertCircle,
    Sliders,
    Coins,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Skeleton from '../../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';

/* ─────────────────────── Types ─────────────────────── */

export interface SocialLinks {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    whatsapp: string;
    tiktok: string;
}

export interface SiteConfiguration {
    // General
    site_name: string;
    site_tagline: string;
    site_description: string;
    logo_url: string;
    favicon_url: string;
    footer_text: string;
    social_links: SocialLinks;
    email: string;
    phone: string;
    phone2: string;
    address: string;
    map_url: string;

    // SEO
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    og_image: string;
    google_analytics: string;
    canonical_url: string;

    // Invoice / Company
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

    // SMTP / Email
    smtp_host: string;
    smtp_port: string;
    smtp_user: string;
    smtp_password: string;
    smtp_from_name: string;
    smtp_from_email: string;
    smtp_encryption: string;

    // Theme & Branding
    theme_primary_color: string;
    theme_accent_color: string;
    theme_font_family: string;
    theme_heading_font: string;
    theme_default_mode: string;
    theme_border_radius: string;
    theme_sidebar_style: string;

    // Logistics & Operations
    machinery_import_tax: string;
    default_shipment_method: string;
    currency_code: string;
    currency_symbol: string;

    // Security & Notifications
    enable_mfa: string;
    session_timeout: string;
    email_on_new_order: string;
    sms_on_critical_alert: string;

    [key: string]: any;
}

const DEFAULT_CONFIG: SiteConfiguration = {
    site_name: 'Volt Wave Tech',
    site_tagline: '',
    site_description: '',
    logo_url: '',
    favicon_url: '',
    footer_text: '',
    social_links: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        whatsapp: '',
        tiktok: '',
    },
    email: '',
    phone: '',
    phone2: '',
    address: '',
    map_url: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_image: '',
    google_analytics: '',
    canonical_url: '',
    company_name: '',
    company_subtitle: '',
    company_logo_url: '',
    signature_image_url: '',
    proprietor_name: '',
    proprietor_title: '',
    business_address: '',
    business_email: '',
    business_phone: '',
    business_phone2: '',
    bank_name: '',
    bank_account_name: '',
    bank_account_number: '',
    bank_routing_number: '',
    invoice_footer_note: '',
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_password: '',
    smtp_from_name: '',
    smtp_from_email: '',
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

/* ─────────────────────── Category Tabs ─────────────────────── */

interface TabDefinition {
    id: string;
    label: string;
    icon: React.ElementType;
    description: string;
}

const TABS: TabDefinition[] = [
    { id: 'general', label: 'General & Contact', icon: Globe, description: 'Website title, slogan, contact emails & phone numbers' },
    { id: 'social', label: 'Social Media', icon: Share2, description: 'Social platform links and messaging contacts' },
    { id: 'seo', label: 'SEO & Metadata', icon: Search, description: 'Search engine tags, OpenGraph sharing and analytics' },
    { id: 'invoice', label: 'Invoice & Company', icon: FileText, description: 'Billing entity, bank details & invoice layout' },
    { id: 'email', label: 'SMTP & Mailer', icon: Mail, description: 'Outgoing mail server configuration & credentials' },
    { id: 'theme', label: 'Appearance & Theme', icon: Palette, description: 'Palette colors, fonts & dashboard layout' },
    { id: 'logistics', label: 'Logistics & Currency', icon: Truck, description: 'Import taxes, shipping methods & store currency' },
    { id: 'security', label: 'Security & Access', icon: ShieldCheck, description: 'Multi-factor authentication & session timeout policies' },
    { id: 'notifications', label: 'Notifications & Alerts', icon: Bell, description: 'Automated email notifications & SMS alerts' },
];

/* ─────────────────────── Standalone Form Inputs ─────────────────────── */
/* Placed outside the component body to avoid losing focus during typing */

const INPUT_CLS = "w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#4D526A] focus:outline-none focus:ring-2 focus:ring-[#F5A623]/20 focus:border-[#F5A623] transition-all font-medium";
const LABEL_CLS = "text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2";
const HINT_CLS = "text-[11px] text-slate-400 dark:text-[#4D526A] mt-1.5 leading-relaxed";

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode; fullWidth?: boolean }> = ({
    label, hint, children, fullWidth = false,
}) => (
    <div className={cn("space-y-2", fullWidth && "col-span-1 md:col-span-2")}>
        <label className={LABEL_CLS}>{label}</label>
        {children}
        {hint && <p className={HINT_CLS}>{hint}</p>}
    </div>
);

const TextInput: React.FC<{
    value: string; onChange: (v: string) => void; placeholder?: string; type?: string; icon?: React.ReactNode;
}> = ({ value, onChange, placeholder, type = 'text', icon }) => (
    <div className="relative">
        {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
            type={type}
            className={cn(INPUT_CLS, icon && "pl-11")}
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
        />
    </div>
);

const TextArea: React.FC<{
    value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}> = ({ value, onChange, placeholder, rows = 3 }) => (
    <textarea
        className={cn(INPUT_CLS, "resize-none")}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
    />
);

const SelectInput: React.FC<{
    value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}> = ({ value, onChange, options }) => (
    <select className={INPUT_CLS} value={value || ''} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
);

const ToggleSwitch: React.FC<{
    value: string; onChange: (v: string) => void; label: string; hint?: string;
}> = ({ value, onChange, label, hint }) => {
    const isEnabled = value === 'true';
    return (
        <div className="flex items-start justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
            <div className="space-y-1 pr-4">
                <span className="text-sm font-bold text-slate-900 dark:text-white block">{label}</span>
                {hint && <p className="text-xs text-slate-400 dark:text-[#4D526A]">{hint}</p>}
            </div>
            <button
                type="button"
                onClick={() => onChange(isEnabled ? 'false' : 'true')}
                className={cn(
                    "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/20",
                    isEnabled ? "bg-[#F5A623]" : "bg-slate-200 dark:bg-slate-700"
                )}
            >
                <span
                    className={cn(
                        "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200",
                        isEnabled ? "translate-x-6" : "translate-x-1"
                    )}
                />
            </button>
        </div>
    );
};

const ColorInput: React.FC<{
    value: string; onChange: (v: string) => void; label: string;
}> = ({ value, onChange, label }) => (
    <div className="space-y-2">
        <label className={LABEL_CLS}>{label}</label>
        <div className="flex items-center gap-3">
            <input
                type="color"
                value={value || '#F5A623'}
                onChange={e => onChange(e.target.value)}
                className="w-12 h-12 rounded-xl border border-slate-200 dark:border-white/10 cursor-pointer bg-transparent p-1"
            />
            <input
                type="text"
                className={cn(INPUT_CLS, "flex-1 font-mono")}
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                placeholder="#F5A623"
            />
            <div className="w-20 h-12 rounded-xl border border-slate-200 dark:border-white/10 shadow-inner" style={{ backgroundColor: value || '#F5A623' }} />
        </div>
    </div>
);

const SectionDivider: React.FC<{ title: string }> = ({ title }) => (
    <div className="col-span-1 md:col-span-2 mt-2 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-3">
        <h4 className="font-sora font-bold text-slate-700 dark:text-slate-300 text-sm">{title}</h4>
        <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
    </div>
);

/* ─────────────────────── Main Settings Page ─────────────────────── */

const Settings: React.FC = () => {
    const { t } = useTranslation();

    const [config, setConfig] = useState<SiteConfiguration>(DEFAULT_CONFIG);
    const [originalConfig, setOriginalConfig] = useState<SiteConfiguration>(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    /* ── Fetch settings from database via WebSettingController ── */
    const fetchConfig = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/web-settings');
            if (res.data?.success && res.data.data) {
                const merged: SiteConfiguration = {
                    ...DEFAULT_CONFIG,
                    ...res.data.data,
                    social_links: {
                        ...DEFAULT_CONFIG.social_links,
                        ...(res.data.data.social_links || {}),
                    },
                };
                setConfig(merged);
                setOriginalConfig(merged);
            }
        } catch (err) {
            console.error('Failed to fetch settings:', err);
            setMessage({ type: 'error', text: 'Failed to load settings from database. Please refresh.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    /* ── Active Tab info ── */
    const currentTab = useMemo(() => TABS.find(tab => tab.id === activeTab) || TABS[0], [activeTab]);

    /* ── Dirty state detection ── */
    const hasChanges = useMemo(() => {
        return JSON.stringify(config) !== JSON.stringify(originalConfig);
    }, [config, originalConfig]);

    /* ── Update handlers ── */
    const updateField = (field: string, value: any) => {
        if (field.startsWith('social_links.')) {
            const socialKey = field.split('.')[1] as keyof SocialLinks;
            setConfig(prev => ({
                ...prev,
                social_links: {
                    ...prev.social_links,
                    [socialKey]: value,
                },
            }));
        } else {
            setConfig(prev => ({ ...prev, [field]: value }));
        }
    };

    /* ── Reset handler ── */
    const resetChanges = () => {
        setConfig(originalConfig);
    };

    /* ── Save to database ── */
    const saveSettings = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await api.put('/admin/web-settings', config);
            if (res.data?.success) {
                setMessage({ type: 'success', text: 'All settings saved to database successfully!' });
                setOriginalConfig(config);
                setTimeout(() => setMessage(null), 4000);
            } else {
                setMessage({ type: 'error', text: res.data?.message || 'Failed to save settings.' });
            }
        } catch (err: any) {
            console.error('Save settings error:', err);
            setMessage({ type: 'error', text: err?.response?.data?.message || 'An error occurred while saving.' });
        } finally {
            setSaving(false);
        }
    };

    /* ──────────────── Tab Panels ──────────────── */

    const renderGeneral = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Website / Brand Name">
                <TextInput value={config.site_name} onChange={v => updateField('site_name', v)} placeholder="Volt Wave Tech" />
            </Field>
            <Field label="Tagline / Slogan">
                <TextInput value={config.site_tagline} onChange={v => updateField('site_tagline', v)} placeholder="Empowering Next-Gen Electrical Solutions" />
            </Field>
            <Field label="Site Description" fullWidth hint="Appears in search snippets, social shares, and footer">
                <TextArea value={config.site_description} onChange={v => updateField('site_description', v)} placeholder="Premier provider of industrial equipment..." rows={3} />
            </Field>
            <Field label="Logo URL" hint="Direct image link (SVG/PNG with transparent background recommended)">
                <TextInput value={config.logo_url} onChange={v => updateField('logo_url', v)} placeholder="https://..." icon={<ExternalLink size={14} />} />
            </Field>
            <Field label="Favicon URL" hint="Direct link to browser tab icon (16×16 or 32×32 ICO/PNG)">
                <TextInput value={config.favicon_url} onChange={v => updateField('favicon_url', v)} placeholder="https://..." icon={<ExternalLink size={14} />} />
            </Field>
            <Field label="Footer Copyright Notice" fullWidth>
                <TextInput value={config.footer_text} onChange={v => updateField('footer_text', v)} placeholder="© 2026 Volt Wave Tech. All rights reserved." />
            </Field>

            <SectionDivider title="Contact Information" />

            <Field label="Primary Support Email">
                <TextInput value={config.email} onChange={v => updateField('email', v)} placeholder="admin@voltwavebd.com" type="email" icon={<Mail size={14} />} />
            </Field>
            <Field label="Primary Telephone">
                <TextInput value={config.phone} onChange={v => updateField('phone', v)} placeholder="+880 1822-108496" icon={<Phone size={14} />} />
            </Field>
            <Field label="Secondary / Hot-Line Telephone">
                <TextInput value={config.phone2} onChange={v => updateField('phone2', v)} placeholder="+880 1234-567890" icon={<Phone size={14} />} />
            </Field>
            <Field label="Physical Address" fullWidth>
                <TextInput value={config.address} onChange={v => updateField('address', v)} placeholder="Kamarpara Nurani Madrasa, Uttara, Dhaka" />
            </Field>
            <Field label="Google Maps Embed / Location URL" fullWidth hint="Paste share link or embed URL">
                <TextInput value={config.map_url} onChange={v => updateField('map_url', v)} placeholder="https://maps.app.goo.gl/..." icon={<ExternalLink size={14} />} />
            </Field>
        </div>
    );

    const renderSocial = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(['facebook', 'linkedin', 'whatsapp', 'youtube', 'instagram', 'twitter', 'tiktok'] as const).map(platform => (
                <Field key={platform} label={platform.charAt(0).toUpperCase() + platform.slice(1)}>
                    <TextInput
                        value={config.social_links[platform] || ''}
                        onChange={v => updateField(`social_links.${platform}`, v)}
                        placeholder={`https://${platform}.com/...`}
                        icon={<Share2 size={14} />}
                    />
                </Field>
            ))}
        </div>
    );

    const renderSeo = () => (
        <div className="grid grid-cols-1 gap-6">
            <Field label="Page Title Format" hint='Global browser title structure (use %page_title% as placeholder)'>
                <TextInput value={config.meta_title} onChange={v => updateField('meta_title', v)} placeholder="Volt Wave Tech | %page_title%" />
            </Field>
            <Field label="Meta Description" hint="Recommended 150-160 characters for maximum search engine click-through">
                <TextArea value={config.meta_description} onChange={v => updateField('meta_description', v)} placeholder="Industrial automation and electronics..." rows={3} />
            </Field>
            <Field label="Meta Keywords" hint="Comma-separated keywords for meta tags">
                <TextInput value={config.meta_keywords} onChange={v => updateField('meta_keywords', v)} placeholder="industrial equipment, automation, electrical bd" />
            </Field>
            <Field label="Social Share Image URL (OG Image)" hint="1200×630px image displayed when sharing links on Facebook/LinkedIn">
                <TextInput value={config.og_image} onChange={v => updateField('og_image', v)} placeholder="https://..." icon={<ExternalLink size={14} />} />
            </Field>
            <Field label="Canonical Domain URL" hint="Canonical site URL preventing duplicate indexing">
                <TextInput value={config.canonical_url} onChange={v => updateField('canonical_url', v)} placeholder="https://voltwavebd.com" icon={<Globe size={14} />} />
            </Field>
            <Field label="Google Analytics Tracking ID" hint="Starts with G- (GA4 Measurement ID)">
                <TextInput value={config.google_analytics} onChange={v => updateField('google_analytics', v)} placeholder="G-XXXXXXXXXX" icon={<Search size={14} />} />
            </Field>
        </div>
    );

    const renderInvoice = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Company Legal Name (For PDF)">
                <TextInput value={config.company_name} onChange={v => updateField('company_name', v)} placeholder="Volt Wave Tech" />
            </Field>
            <Field label="Company Subtitle / Header Line">
                <TextInput value={config.company_subtitle} onChange={v => updateField('company_subtitle', v)} placeholder="Industrial Equipment & Automation" />
            </Field>
            <Field label="Document Logo URL (For Invoices/Quotes)" hint="High resolution transparent PNG">
                <TextInput value={config.company_logo_url} onChange={v => updateField('company_logo_url', v)} placeholder="https://..." icon={<ExternalLink size={14} />} />
            </Field>
            <Field label="Authorized Signature & Seal Image URL" hint="Direct link to scan/seal image for print templates">
                <TextInput value={config.signature_image_url} onChange={v => updateField('signature_image_url', v)} placeholder="https://..." icon={<ExternalLink size={14} />} />
            </Field>
            <Field label="Authorized Proprietor / Signatory Name">
                <TextInput value={config.proprietor_name} onChange={v => updateField('proprietor_name', v)} placeholder="Md. Nazmul Huda" />
            </Field>
            <Field label="Signatory Title / Designation">
                <TextInput value={config.proprietor_title} onChange={v => updateField('proprietor_title', v)} placeholder="Managing Director" />
            </Field>
            <Field label="Business Print Address" fullWidth>
                <TextInput value={config.business_address} onChange={v => updateField('business_address', v)} placeholder="Kamarpara Nurani Madrasa, Uttara, Dhaka" />
            </Field>
            <Field label="Billing Email">
                <TextInput value={config.business_email} onChange={v => updateField('business_email', v)} type="email" icon={<Mail size={14} />} />
            </Field>
            <Field label="Billing Phone">
                <TextInput value={config.business_phone} onChange={v => updateField('business_phone', v)} icon={<Phone size={14} />} />
            </Field>
            <Field label="Invoice & Quotation Footer Note" fullWidth hint="Printed at the bottom of every generated invoice and proposal">
                <TextArea value={config.invoice_footer_note} onChange={v => updateField('invoice_footer_note', v)} placeholder="Thank you for your business. For any query, contact..." rows={2} />
            </Field>

            <SectionDivider title="Corporate Bank Account (For Invoice Payments)" />

            <Field label="Bank Name">
                <TextInput value={config.bank_name} onChange={v => updateField('bank_name', v)} placeholder="City Bank PLC" />
            </Field>
            <Field label="Account Holder Name">
                <TextInput value={config.bank_account_name} onChange={v => updateField('bank_account_name', v)} placeholder="Volt Wave Tech" />
            </Field>
            <Field label="Account Number">
                <TextInput value={config.bank_account_number} onChange={v => updateField('bank_account_number', v)} placeholder="1234567890123" />
            </Field>
            <Field label="Routing Number">
                <TextInput value={config.bank_routing_number} onChange={v => updateField('bank_routing_number', v)} placeholder="225272645" />
            </Field>
        </div>
    );

    const renderEmail = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 flex items-start gap-3">
                <HelpCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    Outgoing SMTP configuration is saved to the database. For Gmail or Google Workspace, configure host as <strong>smtp.gmail.com</strong>, port <strong>587</strong> with <strong>TLS</strong>, and use an <strong>App Password</strong>.
                </p>
            </div>

            <Field label="SMTP Host">
                <TextInput value={config.smtp_host} onChange={v => updateField('smtp_host', v)} placeholder="smtp.gmail.com" />
            </Field>
            <Field label="SMTP Port">
                <SelectInput
                    value={config.smtp_port || '587'}
                    onChange={v => updateField('smtp_port', v)}
                    options={[
                        { value: '25', label: '25 (Unencrypted)' },
                        { value: '465', label: '465 (SSL)' },
                        { value: '587', label: '587 (TLS — Recommended)' },
                        { value: '2525', label: '2525 (Alternative)' },
                    ]}
                />
            </Field>
            <Field label="SMTP Username">
                <TextInput value={config.smtp_user} onChange={v => updateField('smtp_user', v)} placeholder="username@gmail.com" icon={<Mail size={14} />} />
            </Field>
            <Field label="SMTP Password / App Password">
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className={cn(INPUT_CLS, "pr-12")}
                        value={config.smtp_password || ''}
                        onChange={e => updateField('smtp_password', e.target.value)}
                        placeholder="•••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </Field>
            <Field label="Encryption Type">
                <SelectInput
                    value={config.smtp_encryption || 'tls'}
                    onChange={v => updateField('smtp_encryption', v)}
                    options={[
                        { value: 'tls', label: 'TLS (Recommended)' },
                        { value: 'ssl', label: 'SSL' },
                        { value: 'none', label: 'None' },
                    ]}
                />
            </Field>
            <Field label="Sender From Name">
                <TextInput value={config.smtp_from_name} onChange={v => updateField('smtp_from_name', v)} placeholder="Volt Wave Tech" />
            </Field>
            <Field label="Sender From Email">
                <TextInput value={config.smtp_from_email} onChange={v => updateField('smtp_from_email', v)} placeholder="noreply@voltwave.tech" type="email" icon={<Mail size={14} />} />
            </Field>
        </div>
    );

    const renderTheme = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
                <ColorInput label="Primary Brand Color" value={config.theme_primary_color} onChange={v => updateField('theme_primary_color', v)} />
            </div>
            <div className="col-span-1 md:col-span-2">
                <ColorInput label="Secondary Accent Color" value={config.theme_accent_color} onChange={v => updateField('theme_accent_color', v)} />
            </div>

            <SectionDivider title="Typography & Fonts" />

            <Field label="Body Font Family">
                <SelectInput
                    value={config.theme_font_family || 'Inter'}
                    onChange={v => updateField('theme_font_family', v)}
                    options={[
                        { value: 'Inter', label: 'Inter (Default Clean)' },
                        { value: 'Roboto', label: 'Roboto' },
                        { value: 'Open Sans', label: 'Open Sans' },
                        { value: 'Poppins', label: 'Poppins' },
                        { value: 'Noto Sans Bengali', label: 'Noto Sans Bengali' },
                    ]}
                />
            </Field>
            <Field label="Heading Font Family">
                <SelectInput
                    value={config.theme_heading_font || 'Sora'}
                    onChange={v => updateField('theme_heading_font', v)}
                    options={[
                        { value: 'Sora', label: 'Sora (Default Tech Accent)' },
                        { value: 'Inter', label: 'Inter' },
                        { value: 'Poppins', label: 'Poppins' },
                        { value: 'Montserrat', label: 'Montserrat' },
                        { value: 'Playfair Display', label: 'Playfair Display' },
                    ]}
                />
            </Field>

            <SectionDivider title="Layout & Dashboard Styling" />

            <Field label="Default Color Scheme">
                <SelectInput
                    value={config.theme_default_mode || 'system'}
                    onChange={v => updateField('theme_default_mode', v)}
                    options={[
                        { value: 'system', label: 'Follow OS System Preference' },
                        { value: 'light', label: 'Light Mode Default' },
                        { value: 'dark', label: 'Dark Mode Default' },
                    ]}
                />
            </Field>
            <Field label="Corner Radius Rounding">
                <SelectInput
                    value={config.theme_border_radius || 'rounded'}
                    onChange={v => updateField('theme_border_radius', v)}
                    options={[
                        { value: 'none', label: 'Sharp Edges (0px)' },
                        { value: 'sm', label: 'Subtle Rounding (4px)' },
                        { value: 'md', label: 'Medium (8px)' },
                        { value: 'rounded', label: 'Curved Soft (16px — Default)' },
                        { value: 'full', label: 'Pill / Capsule' },
                    ]}
                />
            </Field>
            <Field label="Admin Sidebar Style">
                <SelectInput
                    value={config.theme_sidebar_style || 'default'}
                    onChange={v => updateField('theme_sidebar_style', v)}
                    options={[
                        { value: 'default', label: 'Clean Contrast (White / Dark)' },
                        { value: 'branded', label: 'Accent Border Highlight' },
                        { value: 'compact', label: 'Minimalist Compact' },
                    ]}
                />
            </Field>
        </div>
    );

    const renderLogistics = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Machinery Import Duty / Tax %" hint="Applied to machinery quotations & customs calculation">
                <TextInput value={config.machinery_import_tax} onChange={v => updateField('machinery_import_tax', v)} placeholder="15.5" type="number" />
            </Field>
            <Field label="Default Shipment Method">
                <SelectInput
                    value={config.default_shipment_method || 'Freight'}
                    onChange={v => updateField('default_shipment_method', v)}
                    options={[
                        { value: 'Freight', label: 'Sea / Land Freight' },
                        { value: 'Air Cargo', label: 'Air Express Cargo' },
                        { value: 'Courier', label: 'Standard Local Courier' },
                        { value: 'Pickup', label: 'Warehouse Self Pickup' },
                    ]}
                />
            </Field>

            <SectionDivider title="Store Currency" />

            <Field label="Currency Code (ISO 4217)">
                <TextInput value={config.currency_code} onChange={v => updateField('currency_code', v)} placeholder="BDT" />
            </Field>
            <Field label="Currency Symbol">
                <TextInput value={config.currency_symbol} onChange={v => updateField('currency_symbol', v)} placeholder="৳" />
            </Field>
        </div>
    );

    const renderSecurity = () => (
        <div className="space-y-6">
            <ToggleSwitch
                label="Multi-Factor Authentication (MFA)"
                hint="Require two-step authentication for administrator and staff logins"
                value={config.enable_mfa}
                onChange={v => updateField('enable_mfa', v)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Staff Session Inactivity Timeout (Minutes)" hint="Automatically logs out inactive staff after this duration">
                    <SelectInput
                        value={config.session_timeout || '60'}
                        onChange={v => updateField('session_timeout', v)}
                        options={[
                            { value: '15', label: '15 Minutes (High Security)' },
                            { value: '30', label: '30 Minutes' },
                            { value: '60', label: '60 Minutes (Standard)' },
                            { value: '120', label: '2 Hours' },
                            { value: '480', label: '8 Hours (Full Shift)' },
                        ]}
                    />
                </Field>
            </div>
        </div>
    );

    const renderNotifications = () => (
        <div className="space-y-6">
            <ToggleSwitch
                label="Email Alerts for New Orders"
                hint="Send an instant notification email to sales admins whenever a new customer order is placed"
                value={config.email_on_new_order}
                onChange={v => updateField('email_on_new_order', v)}
            />

            <ToggleSwitch
                label="SMS Alerts for Critical Service Requests"
                hint="Dispatch high-priority SMS alerts to technicians for urgent machinery downtime tickets"
                value={config.sms_on_critical_alert}
                onChange={v => updateField('sms_on_critical_alert', v)}
            />
        </div>
    );

    /* ── Tab Selector ── */
    const renderActiveTabContent = () => {
        switch (activeTab) {
            case 'general': return renderGeneral();
            case 'social': return renderSocial();
            case 'seo': return renderSeo();
            case 'invoice': return renderInvoice();
            case 'email': return renderEmail();
            case 'theme': return renderTheme();
            case 'logistics': return renderLogistics();
            case 'security': return renderSecurity();
            case 'notifications': return renderNotifications();
            default: return renderGeneral();
        }
    };

    return (
        <div className="space-y-8 max-w-7xl pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-sora text-3xl font-extrabold text-slate-900 dark:text-white">
                        {t('settings.title') || 'Site Configuration'}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-[#8A8FA8] mt-1 font-medium">
                        Configure brand parameters, communications, templates, and operational policies (backed by Database)
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <AnimatePresence>
                        {hasChanges && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center gap-2"
                            >
                                <span className="text-xs text-amber-500 font-bold animate-pulse flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Unsaved changes
                                </span>
                                <button
                                    type="button"
                                    onClick={resetChanges}
                                    className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                                    title="Reset all changes"
                                >
                                    <RotateCcw size={18} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        type="button"
                        onClick={saveSettings}
                        disabled={saving || !hasChanges}
                        className="bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-[#F5A623]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group whitespace-nowrap"
                    >
                        {saving ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Save size={18} className="transition-transform group-hover:scale-110" />
                        )}
                        <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
                    </button>
                </div>
            </div>

            {/* Notification Alert */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={cn(
                            "p-4 rounded-2xl flex items-center gap-3 border shadow-sm",
                            message.type === 'success'
                                ? "bg-green-50 border-green-100 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400"
                                : "bg-red-50 border-red-100 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
                        )}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="text-sm font-bold">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Layout: Sidebar + Form Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Tabs Navigation */}
                <div className="lg:col-span-3 space-y-1.5">
                    {loading ? (
                        Array(9).fill(0).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)
                    ) : (
                        TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all border text-left",
                                        isActive
                                            ? "bg-[#F5A623]/10 border-[#F5A623]/20 text-[#d48e1d] dark:text-[#F5A623] shadow-sm"
                                            : "bg-white dark:bg-[#1A1E29] border-transparent text-slate-500 dark:text-[#8A8FA8] hover:bg-slate-50 dark:hover:bg-white/5"
                                    )}
                                >
                                    <Icon size={18} className="shrink-0" />
                                    <span className="truncate">{tab.label}</span>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Tab Content Panel */}
                <div className="lg:col-span-9">
                    {loading ? (
                        <Skeleton className="h-[600px] rounded-3xl" />
                    ) : (
                        <div className="bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/20">
                            {/* Panel Header */}
                            <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#F5A623] text-[#0D0F14] flex items-center justify-center shadow-lg shadow-[#F5A623]/20">
                                        {React.createElement(currentTab.icon, { size: 22 })}
                                    </div>
                                    <div>
                                        <h3 className="font-sora font-extrabold text-slate-900 dark:text-white text-xl">
                                            {currentTab.label}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-[#4D526A] font-medium mt-0.5 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
                                            {currentTab.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Panel Body */}
                            <div className="p-8">
                                {renderActiveTabContent()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
