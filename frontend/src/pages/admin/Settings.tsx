import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Settings as SettingsIcon,
    Save,
    Globe,
    ShieldCheck,
    Bell,
    Loader2,
    Search,
    ShoppingCart,
    CheckCircle2,
    AlertCircle,
    Layout,
    Truck,
    Share2,
    RotateCcw,
    Mail,
    Phone,
    Info,
    FileText,
    Palette,
    Eye,
    EyeOff,
    ExternalLink,
    HelpCircle,
    Database,
    Monitor,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Skeleton from '../../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';

/* ─────────────────────── Types ─────────────────────── */

interface DbSetting {
    id: number;
    group: string;
    key: string;
    value: string | null;
    label_en: string | null;
    label_bn: string | null;
}

interface SocialLinks {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    whatsapp: string;
    tiktok: string;
}

interface WebSettingsData {
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
    smtp_password: string;
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
}

/* ─────────────────────── Tab Configuration ─────────────────────── */

type TabSource = 'db' | 'web';

interface Tab {
    id: string;
    label: string;
    labelKey: string;
    icon: React.ElementType;
    source: TabSource;
    description: string;
    dbGroup?: string; // For DB-backed tabs, the settings.group filter
}

const TABS: Tab[] = [
    { id: 'general', label: 'General', labelKey: 'settings.groups.general', icon: Globe, source: 'web', description: 'Site name, contact info, branding & social links' },
    { id: 'seo', label: 'SEO', labelKey: 'settings.groups.seo', icon: Search, source: 'web', description: 'Meta tags, analytics, and search engine optimization' },
    { id: 'invoice', label: 'Invoice & Quotation', labelKey: 'settings.groups.invoice', icon: FileText, source: 'web', description: 'Company info, bank details & document templates' },
    { id: 'email', label: 'SMTP & Email', labelKey: 'settings.groups.email', icon: Mail, source: 'web', description: 'Outgoing email server configuration' },
    { id: 'theme', label: 'Theme', labelKey: 'settings.groups.theme', icon: Palette, source: 'web', description: 'Colors, typography & visual preferences' },
    { id: 'db-general', label: 'System', labelKey: 'settings.groups.system', icon: Database, source: 'db', dbGroup: 'general', description: 'Core system key-value parameters' },
    { id: 'db-logistics', label: 'Logistics', labelKey: 'settings.groups.logistics', icon: Truck, source: 'db', dbGroup: 'logistics', description: 'Import taxes, shipping methods' },
    { id: 'db-security', label: 'Security', labelKey: 'settings.groups.security', icon: ShieldCheck, source: 'db', dbGroup: 'security', description: 'Authentication & session policies' },
    { id: 'db-notifications', label: 'Notifications', labelKey: 'settings.groups.notifications', icon: Bell, source: 'db', dbGroup: 'notifications', description: 'Alert channels and triggers' },
];

/* ─────────────────────── Helper: reusable input classes ─────────────────────── */

const INPUT_CLS = "w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#4D526A] focus:outline-none focus:ring-2 focus:ring-[#F5A623]/20 focus:border-[#F5A623] transition-all font-medium";
const LABEL_CLS = "text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2";
const HINT_CLS = "text-[11px] text-slate-400 dark:text-[#4D526A] mt-1.5 leading-relaxed";

/* ─────────────────────── Component ─────────────────────── */

const Settings: React.FC = () => {
    const { t, i18n } = useTranslation();

    /* ── State: DB-backed settings ── */
    const [dbSettings, setDbSettings] = useState<DbSetting[]>([]);
    const [dbOriginal, setDbOriginal] = useState<DbSetting[]>([]);

    /* ── State: Web/file-backed settings ── */
    const [webSettings, setWebSettings] = useState<WebSettingsData | null>(null);
    const [webOriginal, setWebOriginal] = useState<WebSettingsData | null>(null);

    /* ── UI state ── */
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    /* ── Fetch both data sources ── */
    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [dbRes, webRes] = await Promise.all([
                api.get('/admin/settings'),
                api.get('/web-settings'),
            ]);
            if (dbRes.data.success) {
                setDbSettings(dbRes.data.data);
                setDbOriginal(dbRes.data.data);
            }
            if (webRes.data.success) {
                setWebSettings(webRes.data.data);
                setWebOriginal(webRes.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch settings:', err);
            setMessage({ type: 'error', text: 'Failed to load settings. Please refresh.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    /* ── Active tab meta ── */
    const currentTab = useMemo(() => TABS.find(t => t.id === activeTab)!, [activeTab]);

    /* ── DB: grouped settings ── */
    const dbGrouped = useMemo(() => {
        return dbSettings.reduce((acc: Record<string, DbSetting[]>, s) => {
            if (!acc[s.group]) acc[s.group] = [];
            acc[s.group].push(s);
            return acc;
        }, {});
    }, [dbSettings]);

    /* ── Dirty detection ── */
    const dbDirty = useMemo(() => JSON.stringify(dbSettings) !== JSON.stringify(dbOriginal), [dbSettings, dbOriginal]);
    const webDirty = useMemo(() => JSON.stringify(webSettings) !== JSON.stringify(webOriginal), [webSettings, webOriginal]);
    const hasChanges = dbDirty || webDirty;

    /* ── Handlers: DB ── */
    const handleDbUpdate = (id: number, newValue: string) => {
        setDbSettings(prev => prev.map(s => s.id === id ? { ...s, value: newValue } : s));
    };

    /* ── Handlers: Web ── */
    const handleWebUpdate = (field: string, value: string) => {
        if (!webSettings) return;
        if (field.startsWith('social_links.')) {
            const key = field.split('.')[1] as keyof SocialLinks;
            setWebSettings({
                ...webSettings,
                social_links: { ...webSettings.social_links, [key]: value },
            });
        } else {
            setWebSettings({ ...webSettings, [field]: value });
        }
    };

    /* ── Reset ── */
    const resetChanges = () => {
        setDbSettings(dbOriginal);
        setWebSettings(webOriginal);
    };

    /* ── Save (only dirty sources) ── */
    const saveSettings = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const promises: Promise<any>[] = [];
            if (dbDirty) promises.push(api.patch('/admin/settings/bulk', dbSettings));
            if (webDirty && webSettings) promises.push(api.put('/admin/web-settings', webSettings));

            const results = await Promise.all(promises);
            const allOk = results.every(r => r.data.success);

            if (allOk) {
                setMessage({ type: 'success', text: t('settings.save_success') || 'All settings updated successfully!' });
                setDbOriginal(dbSettings);
                setWebOriginal(webSettings);
                setTimeout(() => setMessage(null), 4000);
            } else {
                setMessage({ type: 'error', text: t('settings.save_error') || 'Some settings failed to save.' });
            }
        } catch {
            setMessage({ type: 'error', text: t('settings.save_error') || 'An error occurred while saving.' });
        } finally {
            setSaving(false);
        }
    };

    /* ── Render helpers ── */

    const Field = ({ label, hint, children, fullWidth = false }: { label: string; hint?: string; children: React.ReactNode; fullWidth?: boolean }) => (
        <div className={cn("space-y-2", fullWidth && "col-span-1 md:col-span-2")}>
            <label className={LABEL_CLS}>{label}</label>
            {children}
            {hint && <p className={HINT_CLS}>{hint}</p>}
        </div>
    );

    const TextInput = ({ value, onChange, placeholder, type = 'text', icon }: {
        value: string; onChange: (v: string) => void; placeholder?: string; type?: string; icon?: React.ReactNode;
    }) => (
        <div className="relative">
            {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
            <input
                type={type}
                className={cn(INPUT_CLS, icon && "pl-11")}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );

    const TextArea = ({ value, onChange, placeholder, rows = 3 }: {
        value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
    }) => (
        <textarea
            className={cn(INPUT_CLS, "resize-none")}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
        />
    );

    const SelectInput = ({ value, onChange, options }: {
        value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
    }) => (
        <select className={INPUT_CLS} value={value} onChange={e => onChange(e.target.value)}>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    );

    const ColorInput = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => (
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
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="#F5A623"
                />
                <div className="w-20 h-12 rounded-xl border border-slate-200 dark:border-white/10 shadow-inner" style={{ backgroundColor: value || '#F5A623' }} />
            </div>
        </div>
    );

    const SectionDivider = ({ title }: { title: string }) => (
        <div className="col-span-1 md:col-span-2 mt-2 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-3">
            <h4 className="font-sora font-bold text-slate-700 dark:text-slate-300 text-sm">{title}</h4>
            <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
        </div>
    );

    /* ── DB setting input renderer ── */
    const renderDbInput = (setting: DbSetting) => {
        const isTextArea = setting.key.includes('template') || setting.key.includes('content') || setting.key.includes('address') || setting.key.includes('footer');
        const isBoolean = setting.value === 'true' || setting.value === 'false';
        const isNumber = setting.key.includes('timeout') || setting.key.includes('tax');

        if (isBoolean) {
            return (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleDbUpdate(setting.id, setting.value === 'true' ? 'false' : 'true')}
                        className={cn(
                            "relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/20",
                            setting.value === 'true' ? "bg-[#F5A623]" : "bg-slate-200 dark:bg-slate-700"
                        )}
                    >
                        <span
                            className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200",
                                setting.value === 'true' ? "translate-x-6" : "translate-x-1"
                            )}
                        />
                    </button>
                    <span className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        setting.value === 'true' ? "text-[#F5A623]" : "text-slate-400"
                    )}>
                        {setting.value === 'true' ? 'Enabled' : 'Disabled'}
                    </span>
                </div>
            );
        }

        if (isTextArea) {
            return (
                <textarea
                    className={cn(INPUT_CLS, "min-h-[100px] resize-none")}
                    value={setting.value || ''}
                    onChange={(e) => handleDbUpdate(setting.id, e.target.value)}
                />
            );
        }

        return (
            <input
                type={isNumber ? "number" : "text"}
                className={INPUT_CLS}
                value={setting.value || ''}
                onChange={(e) => handleDbUpdate(setting.id, e.target.value)}
            />
        );
    };

    /* ──────────────── Tab Content Renderers ──────────────── */

    const renderGeneralTab = () => {
        if (!webSettings) return null;
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Site Name">
                    <TextInput value={webSettings.site_name || ''} onChange={v => handleWebUpdate('site_name', v)} placeholder="Your Company Name" />
                </Field>
                <Field label="Tagline / Slogan">
                    <TextInput value={webSettings.site_tagline || ''} onChange={v => handleWebUpdate('site_tagline', v)} placeholder="Your catchy slogan here" />
                </Field>
                <Field label="Site Description" fullWidth hint="Appears in search results and social shares">
                    <TextArea value={webSettings.site_description || ''} onChange={v => handleWebUpdate('site_description', v)} placeholder="Brief description of your business..." />
                </Field>
                <Field label="Logo URL" hint="Full URL to your logo image (PNG/SVG recommended)">
                    <TextInput value={webSettings.logo_url || ''} onChange={v => handleWebUpdate('logo_url', v)} placeholder="https://..." icon={<ExternalLink size={14} />} />
                </Field>
                <Field label="Favicon URL" hint="16×16 or 32×32 ICO/PNG for browser tab icon">
                    <TextInput value={webSettings.favicon_url || ''} onChange={v => handleWebUpdate('favicon_url', v)} placeholder="https://..." icon={<ExternalLink size={14} />} />
                </Field>
                <Field label="Footer Text" fullWidth>
                    <TextInput value={webSettings.footer_text || ''} onChange={v => handleWebUpdate('footer_text', v)} placeholder="© 2024 Your Company. All rights reserved." />
                </Field>

                <SectionDivider title="Contact Information" />

                <Field label="Public Email">
                    <TextInput value={webSettings.email || ''} onChange={v => handleWebUpdate('email', v)} placeholder="info@example.com" type="email" icon={<Mail size={14} />} />
                </Field>
                <Field label="Primary Phone">
                    <TextInput value={webSettings.phone || ''} onChange={v => handleWebUpdate('phone', v)} placeholder="+880 1700-000000" icon={<Phone size={14} />} />
                </Field>
                <Field label="Secondary Phone">
                    <TextInput value={webSettings.phone2 || ''} onChange={v => handleWebUpdate('phone2', v)} placeholder="+880 1700-111111" icon={<Phone size={14} />} />
                </Field>
                <Field label="Address" fullWidth>
                    <TextInput value={webSettings.address || ''} onChange={v => handleWebUpdate('address', v)} placeholder="Your business address" />
                </Field>
                <Field label="Google Maps Embed URL" fullWidth hint="Paste the embed URL from Google Maps">
                    <TextInput value={webSettings.map_url || ''} onChange={v => handleWebUpdate('map_url', v)} placeholder="https://maps.google.com/..." icon={<ExternalLink size={14} />} />
                </Field>

                <SectionDivider title="Social Media Links" />

                {(['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'whatsapp', 'tiktok'] as const).map(social => (
                    <Field key={social} label={social.charAt(0).toUpperCase() + social.slice(1)}>
                        <TextInput
                            value={(webSettings.social_links as any)?.[social] || ''}
                            onChange={v => handleWebUpdate(`social_links.${social}`, v)}
                            placeholder={`https://${social}.com/...`}
                            icon={<Share2 size={14} />}
                        />
                    </Field>
                ))}
            </div>
        );
    };

    const renderSeoTab = () => {
        if (!webSettings) return null;
        return (
            <div className="grid grid-cols-1 gap-6">
                <Field label="Meta Title Template" hint='Use %page_title% as placeholder. E.g. "Volt Wave Tech | %page_title%"'>
                    <TextInput value={webSettings.meta_title || ''} onChange={v => handleWebUpdate('meta_title', v)} placeholder="Volt Wave Tech | %page_title%" />
                </Field>
                <Field label="Global Meta Description" hint="Recommended 150-160 characters for optimal SEO">
                    <TextArea value={webSettings.meta_description || ''} onChange={v => handleWebUpdate('meta_description', v)} placeholder="A concise description of your website for search engines..." rows={3} />
                </Field>
                <Field label="Meta Keywords" hint="Comma-separated keywords">
                    <TextInput value={webSettings.meta_keywords || ''} onChange={v => handleWebUpdate('meta_keywords', v)} placeholder="machinery, industrial, equipment, Bangladesh" />
                </Field>
                <Field label="OG Image URL" hint="1200×630px image for Facebook/LinkedIn shares">
                    <TextInput value={webSettings.og_image || ''} onChange={v => handleWebUpdate('og_image', v)} placeholder="https://..." icon={<ExternalLink size={14} />} />
                </Field>
                <Field label="Canonical URL" hint="The preferred URL for this site (prevents duplicate content)">
                    <TextInput value={webSettings.canonical_url || ''} onChange={v => handleWebUpdate('canonical_url', v)} placeholder="https://www.yourdomain.com" icon={<Globe size={14} />} />
                </Field>
                <Field label="Google Analytics Measurement ID" hint="Starts with G- for GA4">
                    <TextInput value={webSettings.google_analytics || ''} onChange={v => handleWebUpdate('google_analytics', v)} placeholder="G-XXXXXXXXXX" icon={<SettingsIcon size={14} />} />
                </Field>
            </div>
        );
    };

    const renderInvoiceTab = () => {
        if (!webSettings) return null;
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Company Name (for PDF)">
                    <TextInput value={webSettings.company_name || ''} onChange={v => handleWebUpdate('company_name', v)} placeholder="Volt Wave Tech" />
                </Field>
                <Field label="Company Subtitle / Tagline">
                    <TextInput value={webSettings.company_subtitle || ''} onChange={v => handleWebUpdate('company_subtitle', v)} placeholder="Industrial Equipment & Services" />
                </Field>
                <Field label="Company Logo URL (for documents)" hint="High-res PNG with transparent background recommended">
                    <TextInput value={webSettings.company_logo_url || ''} onChange={v => handleWebUpdate('company_logo_url', v)} placeholder="https://..." icon={<ExternalLink size={14} />} />
                </Field>
                <Field label="Authorized Signature Image" hint="URL to the signature image used on invoices">
                    <TextInput value={webSettings.signature_image_url || ''} onChange={v => handleWebUpdate('signature_image_url', v)} placeholder="https://..." icon={<ExternalLink size={14} />} />
                </Field>
                <Field label="Proprietor Name">
                    <TextInput value={webSettings.proprietor_name || ''} onChange={v => handleWebUpdate('proprietor_name', v)} />
                </Field>
                <Field label="Proprietor Title">
                    <TextInput value={webSettings.proprietor_title || ''} onChange={v => handleWebUpdate('proprietor_title', v)} placeholder="Managing Director" />
                </Field>
                <Field label="Business Address (for print)" fullWidth>
                    <TextInput value={webSettings.business_address || ''} onChange={v => handleWebUpdate('business_address', v)} />
                </Field>
                <Field label="Business Email (for print)">
                    <TextInput value={webSettings.business_email || ''} onChange={v => handleWebUpdate('business_email', v)} type="email" icon={<Mail size={14} />} />
                </Field>
                <Field label="Business Phone (for print)">
                    <TextInput value={webSettings.business_phone || ''} onChange={v => handleWebUpdate('business_phone', v)} icon={<Phone size={14} />} />
                </Field>
                <Field label="Invoice Footer Note" fullWidth hint="Printed at the bottom of every invoice/quotation">
                    <TextArea value={webSettings.invoice_footer_note || ''} onChange={v => handleWebUpdate('invoice_footer_note', v)} placeholder="Thank you for your business..." rows={2} />
                </Field>

                <SectionDivider title="Bank Details" />

                <Field label="Bank Name">
                    <TextInput value={webSettings.bank_name || ''} onChange={v => handleWebUpdate('bank_name', v)} />
                </Field>
                <Field label="Account Holder Name">
                    <TextInput value={webSettings.bank_account_name || ''} onChange={v => handleWebUpdate('bank_account_name', v)} />
                </Field>
                <Field label="Account Number">
                    <TextInput value={webSettings.bank_account_number || ''} onChange={v => handleWebUpdate('bank_account_number', v)} />
                </Field>
                <Field label="Routing Number">
                    <TextInput value={webSettings.bank_routing_number || ''} onChange={v => handleWebUpdate('bank_routing_number', v)} />
                </Field>
            </div>
        );
    };

    const renderEmailTab = () => {
        if (!webSettings) return null;
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 flex items-start gap-3">
                    <HelpCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                        Configure your outgoing email server (SMTP). For Gmail, use <strong>smtp.gmail.com</strong> with port <strong>587</strong> and TLS encryption.
                        You'll need an <strong>App Password</strong> instead of your regular Google password.
                    </p>
                </div>

                <Field label="SMTP Host">
                    <TextInput value={webSettings.smtp_host || ''} onChange={v => handleWebUpdate('smtp_host', v)} placeholder="smtp.gmail.com" />
                </Field>
                <Field label="SMTP Port">
                    <SelectInput
                        value={webSettings.smtp_port || '587'}
                        onChange={v => handleWebUpdate('smtp_port', v)}
                        options={[
                            { value: '25', label: '25 (Unencrypted)' },
                            { value: '465', label: '465 (SSL)' },
                            { value: '587', label: '587 (TLS — Recommended)' },
                            { value: '2525', label: '2525 (Alternative)' },
                        ]}
                    />
                </Field>
                <Field label="SMTP Username">
                    <TextInput value={webSettings.smtp_user || ''} onChange={v => handleWebUpdate('smtp_user', v)} placeholder="your@email.com" icon={<Mail size={14} />} />
                </Field>
                <Field label="SMTP Password / App Password">
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className={cn(INPUT_CLS, "pr-12")}
                            value={webSettings.smtp_password || ''}
                            onChange={e => handleWebUpdate('smtp_password', e.target.value)}
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
                <Field label="Encryption">
                    <SelectInput
                        value={webSettings.smtp_encryption || 'tls'}
                        onChange={v => handleWebUpdate('smtp_encryption', v)}
                        options={[
                            { value: 'tls', label: 'TLS (Recommended)' },
                            { value: 'ssl', label: 'SSL' },
                            { value: 'none', label: 'None (Not recommended)' },
                        ]}
                    />
                </Field>
                <Field label="From Name" hint="The display name shown in outgoing emails">
                    <TextInput value={webSettings.smtp_from_name || ''} onChange={v => handleWebUpdate('smtp_from_name', v)} placeholder="Volt Wave Tech" />
                </Field>
                <Field label="From Email" hint="Must match the SMTP username for most providers">
                    <TextInput value={webSettings.smtp_from_email || ''} onChange={v => handleWebUpdate('smtp_from_email', v)} placeholder="noreply@yourdomain.com" type="email" icon={<Mail size={14} />} />
                </Field>
            </div>
        );
    };

    const renderThemeTab = () => {
        if (!webSettings) return null;
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                    <ColorInput label="Primary Color" value={webSettings.theme_primary_color || '#F5A623'} onChange={v => handleWebUpdate('theme_primary_color', v)} />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <ColorInput label="Accent Color" value={webSettings.theme_accent_color || '#2B3A55'} onChange={v => handleWebUpdate('theme_accent_color', v)} />
                </div>

                <SectionDivider title="Typography" />

                <Field label="Body Font Family">
                    <SelectInput
                        value={webSettings.theme_font_family || 'Inter'}
                        onChange={v => handleWebUpdate('theme_font_family', v)}
                        options={[
                            { value: 'Inter', label: 'Inter (Default)' },
                            { value: 'Roboto', label: 'Roboto' },
                            { value: 'Open Sans', label: 'Open Sans' },
                            { value: 'Lato', label: 'Lato' },
                            { value: 'Poppins', label: 'Poppins' },
                            { value: 'Noto Sans Bengali', label: 'Noto Sans Bengali' },
                        ]}
                    />
                </Field>
                <Field label="Heading Font">
                    <SelectInput
                        value={webSettings.theme_heading_font || 'Sora'}
                        onChange={v => handleWebUpdate('theme_heading_font', v)}
                        options={[
                            { value: 'Sora', label: 'Sora (Default)' },
                            { value: 'Inter', label: 'Inter' },
                            { value: 'Poppins', label: 'Poppins' },
                            { value: 'Montserrat', label: 'Montserrat' },
                            { value: 'Playfair Display', label: 'Playfair Display' },
                        ]}
                    />
                </Field>

                <SectionDivider title="Layout Preferences" />

                <Field label="Default Color Mode">
                    <SelectInput
                        value={webSettings.theme_default_mode || 'system'}
                        onChange={v => handleWebUpdate('theme_default_mode', v)}
                        options={[
                            { value: 'system', label: 'Follow System Preference' },
                            { value: 'light', label: 'Light Mode' },
                            { value: 'dark', label: 'Dark Mode' },
                        ]}
                    />
                </Field>
                <Field label="Border Radius Style">
                    <SelectInput
                        value={webSettings.theme_border_radius || 'rounded'}
                        onChange={v => handleWebUpdate('theme_border_radius', v)}
                        options={[
                            { value: 'none', label: 'Sharp (0px)' },
                            { value: 'sm', label: 'Subtle (4px)' },
                            { value: 'md', label: 'Medium (8px)' },
                            { value: 'rounded', label: 'Rounded (16px — Default)' },
                            { value: 'full', label: 'Pill (999px)' },
                        ]}
                    />
                </Field>
                <Field label="Admin Sidebar Style">
                    <SelectInput
                        value={webSettings.theme_sidebar_style || 'default'}
                        onChange={v => handleWebUpdate('theme_sidebar_style', v)}
                        options={[
                            { value: 'default', label: 'Default (White/Dark)' },
                            { value: 'branded', label: 'Branded (Primary Color)' },
                            { value: 'compact', label: 'Compact (Icons Only)' },
                        ]}
                    />
                </Field>
            </div>
        );
    };

    const renderDbTab = () => {
        const group = currentTab.dbGroup;
        if (!group) return null;
        const items = dbGrouped[group] || [];

        if (items.length === 0) {
            return (
                <div className="text-center py-16">
                    <Database size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-sm text-slate-400 dark:text-[#4D526A] font-medium">No settings found in this group</p>
                    <p className="text-xs text-slate-300 dark:text-[#2D3142] mt-1">Settings will appear here once configured</p>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {items.map((setting) => (
                    <div key={setting.id} className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start group/field">
                        <div className="space-y-1.5">
                            <label className={LABEL_CLS}>
                                {setting.key.includes('email') ? <Mail size={14} className="text-slate-400" /> :
                                 setting.key.includes('phone') ? <Phone size={14} className="text-slate-400" /> :
                                 <Info size={14} className="text-slate-400" />}
                                {(i18n.language.startsWith('en') ? setting.label_en : setting.label_bn) || setting.label_en || setting.key}
                            </label>
                            <p className="text-[10px] text-slate-400 dark:text-[#4D526A] font-mono leading-relaxed group-hover/field:text-slate-500 transition-colors">
                                {setting.group}/{setting.key}
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            {renderDbInput(setting)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    /* ── Tab content router ── */
    const renderTabContent = () => {
        if (currentTab.source === 'db') return renderDbTab();
        switch (activeTab) {
            case 'general': return renderGeneralTab();
            case 'seo': return renderSeoTab();
            case 'invoice': return renderInvoiceTab();
            case 'email': return renderEmailTab();
            case 'theme': return renderThemeTab();
            default: return null;
        }
    };

    /* ──────────────── Main Render ──────────────── */

    return (
        <div className="space-y-8 max-w-7xl pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-sora text-3xl font-extrabold text-slate-900 dark:text-white">
                        {t('settings.title') || 'Site Configuration'}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-[#8A8FA8] mt-1 font-medium">
                        {t('settings.subtitle') || 'Manage your website settings, preferences, and integrations'}
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
                        onClick={saveSettings}
                        disabled={saving || !hasChanges}
                        className="bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-[#F5A623]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group whitespace-nowrap"
                    >
                        {saving ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Save size={18} className="transition-transform group-hover:scale-110" />
                        )}
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </div>

            {/* Success/Error Banner */}
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

            {/* Layout: Sidebar + Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3 space-y-1.5">
                    {loading ? (
                        Array(9).fill(0).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)
                    ) : (
                        <>
                            {/* Web-backed settings header */}
                            <p className="text-[10px] text-slate-400 dark:text-[#4D526A] font-bold uppercase tracking-widest px-4 pt-2 pb-1">
                                Website
                            </p>
                            {TABS.filter(t => t.source === 'web').map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all border",
                                            isActive
                                                ? "bg-[#F5A623]/10 border-[#F5A623]/20 text-[#d48e1d] dark:text-[#F5A623] shadow-sm"
                                                : "bg-white dark:bg-[#1A1E29] border-transparent text-slate-500 dark:text-[#8A8FA8] hover:bg-slate-50 dark:hover:bg-white/5"
                                        )}
                                    >
                                        <Icon size={18} />
                                        <span>{t(tab.labelKey) || tab.label}</span>
                                    </button>
                                );
                            })}

                            {/* DB-backed settings header */}
                            <div className="pt-3">
                                <p className="text-[10px] text-slate-400 dark:text-[#4D526A] font-bold uppercase tracking-widest px-4 pt-2 pb-1">
                                    System
                                </p>
                            </div>
                            {TABS.filter(t => t.source === 'db').map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                const count = tab.dbGroup ? (dbGrouped[tab.dbGroup]?.length || 0) : 0;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all border",
                                            isActive
                                                ? "bg-[#F5A623]/10 border-[#F5A623]/20 text-[#d48e1d] dark:text-[#F5A623] shadow-sm"
                                                : "bg-white dark:bg-[#1A1E29] border-transparent text-slate-500 dark:text-[#8A8FA8] hover:bg-slate-50 dark:hover:bg-white/5"
                                        )}
                                    >
                                        <Icon size={18} />
                                        <span className="flex-1 text-left">{t(tab.labelKey) || tab.label}</span>
                                        {count > 0 && (
                                            <span className="text-[10px] bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-[#4D526A] px-2 py-0.5 rounded-full font-mono">
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </>
                    )}
                </div>

                {/* Content Panel */}
                <div className="lg:col-span-9">
                    {loading ? (
                        <Skeleton className="h-[600px] rounded-3xl" />
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/20"
                        >
                            {/* Panel Header */}
                            <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#F5A623] text-[#0D0F14] flex items-center justify-center shadow-lg shadow-[#F5A623]/20">
                                        {React.createElement(currentTab.icon, { size: 22 })}
                                    </div>
                                    <div>
                                        <h3 className="font-sora font-extrabold text-slate-900 dark:text-white text-xl">
                                            {t(currentTab.labelKey) || currentTab.label}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-[#4D526A] font-medium mt-0.5 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
                                            {currentTab.description}
                                            <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-[#4D526A] font-mono">
                                                {currentTab.source === 'db' ? 'Database' : 'Config File'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Panel Body */}
                            <div className="p-8">
                                {renderTabContent()}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
