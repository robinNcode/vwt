import React, { useState, useEffect } from 'react';
import {
    Save, Layout, Mail, Phone, MapPin, Globe, Loader2,
    CheckCircle2, AlertCircle, Info, Search, FileText, Palette, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Skeleton from '../../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';

interface WebSettings {
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

const TABS = [
    { id: 'general', label: 'General & Contact', icon: Layout },
    { id: 'seo', label: 'SEO Configuration', icon: Search },
    { id: 'invoice', label: 'Invoice & Quotation', icon: FileText },
    { id: 'email', label: 'SMTP & Email', icon: Mail },
    { id: 'theme', label: 'Theme Preferences', icon: Palette },
];

const WebSettings: React.FC = () => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState<WebSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [activeTab, setActiveTab] = useState('general');

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await api.get('/web-settings');
            if (res.data.success) {
                setSettings(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch web settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = (field: string, value: any) => {
        if (!settings) return;
        if (field.startsWith('social_links.')) {
            const socialField = field.split('.')[1];
            setSettings({
                ...settings,
                social_links: {
                    ...settings.social_links,
                    [socialField]: value
                }
            });
        } else {
            setSettings({ ...settings, [field]: value });
        }
    };

    const saveSettings = async () => {
        if (!settings) return;
        setSaving(true);
        setMessage(null);
        try {
            const res = await api.put('/admin/web-settings', settings);
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Settings updated successfully!' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: 'Failed to update settings.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while saving.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 max-w-6xl pb-12">
                <Skeleton className="h-12 w-64 rounded-xl" />
                <Skeleton className="h-[600px] w-full rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-sora text-3xl font-extrabold text-slate-900 dark:text-white">Global File Settings</h1>
                    <p className="text-sm text-slate-500 dark:text-[#8A8FA8] mt-1 font-medium">Manage your website's JSON file-based static content and metadata</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving || !settings}
                    className="bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-[#F5A623]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group whitespace-nowrap"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} className="transition-transform group-hover:scale-110" />}
                    <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
                </button>
            </div>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className={cn("p-4 rounded-2xl flex items-center gap-3 border shadow-sm", message.type === 'success' ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700")}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="text-sm font-bold">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                {/* Tabs */}
                <div className="space-y-2">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all border",
                                    activeTab === tab.id
                                        ? "bg-[#F5A623]/10 border-[#F5A623]/20 text-[#d48e1d] dark:text-[#F5A623] shadow-sm transform scale-[1.02]"
                                        : "bg-white dark:bg-[#1A1E29] border-transparent text-slate-500 dark:text-[#8A8FA8] hover:bg-slate-50 dark:hover:bg-white/5"
                                )}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/20"
                    >
                        <div className="p-8 space-y-8">
                            {/* ── General Tab ── */}
                            {activeTab === 'general' && (
                                <>
                                    <h3 className="font-sora text-xl font-bold flex items-center gap-2"><Layout /> General & Contact info</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Site Name</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.site_name || ''} onChange={e => handleUpdate('site_name', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Tagline</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.site_tagline || ''} onChange={e => handleUpdate('site_tagline', e.target.value)} />
                                        </div>
                                        <div className="space-y-2 col-span-1 md:col-span-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Site Description</label>
                                            <textarea className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none min-h-[100px]" value={settings?.site_description || ''} onChange={e => handleUpdate('site_description', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Logo URL</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.logo_url || ''} onChange={e => handleUpdate('logo_url', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Favicon URL</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.favicon_url || ''} onChange={e => handleUpdate('favicon_url', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Public Email</label>
                                            <input type="email" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.email || ''} onChange={e => handleUpdate('email', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Phone</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.phone || ''} onChange={e => handleUpdate('phone', e.target.value)} />
                                        </div>
                                        <div className="space-y-2 col-span-1 md:col-span-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Address</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.address || ''} onChange={e => handleUpdate('address', e.target.value)} />
                                        </div>

                                        {/* SOCIAL LINKS LOOP */}
                                        <div className="col-span-1 md:col-span-2 mt-4"><h4 className="font-bold">Social Links</h4></div>
                                        {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'whatsapp', 'tiktok'].map(social => (
                                            <div key={social} className="space-y-2">
                                                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest capitalize">{social}</label>
                                                <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={(settings?.social_links as any)[social] || ''} onChange={e => handleUpdate(`social_links.${social}`, e.target.value)} />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* ── SEO Tab ── */}
                            {activeTab === 'seo' && (
                                <>
                                    <h3 className="font-sora text-xl font-bold flex items-center gap-2"><Search /> SEO Settings</h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Meta Title Template</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.meta_title || ''} onChange={e => handleUpdate('meta_title', e.target.value)} />
                                            <p className="text-xs text-gray-500">E.g., "Volt Wave Tech | %page_title%"</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Global Meta description</label>
                                            <textarea className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none min-h-[100px]" value={settings?.meta_description || ''} onChange={e => handleUpdate('meta_description', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Meta Keywords</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.meta_keywords || ''} onChange={e => handleUpdate('meta_keywords', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">OG Image URL (For Facebook/LinkedIn sharing)</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.og_image || ''} onChange={e => handleUpdate('og_image', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Google Analytics snippet configuration</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.google_analytics || ''} onChange={e => handleUpdate('google_analytics', e.target.value)} placeholder="G-XXXXXXXXXX" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── Invoice Tab ── */}
                            {activeTab === 'invoice' && (
                                <>
                                    <h3 className="font-sora text-xl font-bold flex items-center gap-2"><FileText /> Invoice & Quotation Templates</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Company Name (For PDF)</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.company_name || ''} onChange={e => handleUpdate('company_name', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Company Subtitle / Tagline</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.company_subtitle || ''} onChange={e => handleUpdate('company_subtitle', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Company Document Logo URL</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.company_logo_url || ''} onChange={e => handleUpdate('company_logo_url', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Authorized Signature Image URL</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.signature_image_url || ''} onChange={e => handleUpdate('signature_image_url', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Proprietor Name</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.proprietor_name || ''} onChange={e => handleUpdate('proprietor_name', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Proprietor Title</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.proprietor_title || ''} onChange={e => handleUpdate('proprietor_title', e.target.value)} />
                                        </div>
                                        <div className="space-y-2 col-span-1 md:col-span-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Business Address (Print)</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.business_address || ''} onChange={e => handleUpdate('business_address', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Business Print Email</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.business_email || ''} onChange={e => handleUpdate('business_email', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Business Print Phone</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.business_phone || ''} onChange={e => handleUpdate('business_phone', e.target.value)} />
                                        </div>

                                        {/* Bank details */}
                                        <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-gray-100 dark:border-white/5"><h4 className="font-bold">Bank Details</h4></div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Bank Name</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.bank_name || ''} onChange={e => handleUpdate('bank_name', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Account Name</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.bank_account_name || ''} onChange={e => handleUpdate('bank_account_name', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Account Number</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.bank_account_number || ''} onChange={e => handleUpdate('bank_account_number', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Routing Number</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.bank_routing_number || ''} onChange={e => handleUpdate('bank_routing_number', e.target.value)} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── Email Tab ── */}
                            {activeTab === 'email' && (
                                <>
                                    <h3 className="font-sora text-xl font-bold flex items-center gap-2"><Mail /> SMTP Email Configuration</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">SMTP Host</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.smtp_host || ''} onChange={e => handleUpdate('smtp_host', e.target.value)} placeholder="e.g. smtp.gmail.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">SMTP Port</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.smtp_port || ''} onChange={e => handleUpdate('smtp_port', e.target.value)} placeholder="465 or 587" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">SMTP Username</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.smtp_user || ''} onChange={e => handleUpdate('smtp_user', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">SMTP Password / App Password</label>
                                            <input type="password" placeholder="•••••••••" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.smtp_password || ''} onChange={e => handleUpdate('smtp_password', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">From Name</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.smtp_from_name || ''} onChange={e => handleUpdate('smtp_from_name', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Encryption (SSL/TLS)</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.smtp_encryption || ''} onChange={e => handleUpdate('smtp_encryption', e.target.value)} placeholder="tls" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── Theme Tab ── */}
                            {activeTab === 'theme' && (
                                <>
                                    <h3 className="font-sora text-xl font-bold flex items-center gap-2"><Palette /> Theme Configuration</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Primary Color (Hex)</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none border-l-[10px]" style={{ borderLeftColor: settings?.theme_primary_color || '#F5A623' }} value={settings?.theme_primary_color || ''} onChange={e => handleUpdate('theme_primary_color', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Accent Color</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none border-l-[10px]" style={{ borderLeftColor: settings?.theme_accent_color || '#2B3A55' }} value={settings?.theme_accent_color || ''} onChange={e => handleUpdate('theme_accent_color', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Default Layout Mode</label>
                                            <select className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.theme_default_mode || 'system'} onChange={e => handleUpdate('theme_default_mode', e.target.value)}>
                                                <option value="system">System Default</option>
                                                <option value="light">Light Mode</option>
                                                <option value="dark">Dark Mode</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Typography Body Font</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none" value={settings?.theme_font_family || ''} onChange={e => handleUpdate('theme_font_family', e.target.value)} placeholder="Inter, sans-serif" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default WebSettings;
