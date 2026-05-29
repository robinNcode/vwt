import React, { useState, useEffect } from 'react';
import {
    Save,
    Layout,
    Mail,
    Phone,
    MapPin,
    Globe,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Skeleton from '../../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';

interface WebSettings {
    site_name: string;
    site_description: string;
    logo_url: string;
    favicon_url: string;
    email: string;
    phone: string;
    address: string;
    footer_text: string;
    meta_keywords: string;
    social_links: {
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
    };
}

const WebSettings: React.FC = () => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState<WebSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
                setMessage({ type: 'success', text: 'Web settings updated successfully!' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: 'Failed to update web settings.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while saving.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 max-w-4xl pb-12">
                <Skeleton className="h-12 w-64 rounded-xl" />
                <Skeleton className="h-[600px] w-full rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-sora text-3xl font-extrabold text-slate-900 dark:text-white">Web Settings</h1>
                    <p className="text-sm text-slate-500 dark:text-[#8A8FA8] mt-1 font-medium">Manage your website's static content and metadata (Stored in files)</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving || !settings}
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

            <div className="bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/20">
                <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#F5A623] text-[#0D0F14] flex items-center justify-center shadow-lg shadow-[#F5A623]/20">
                            <Layout size={24} />
                        </div>
                        <div>
                            <h3 className="font-sora font-extrabold text-slate-900 dark:text-white text-xl">General Information</h3>
                            <p className="text-xs text-slate-500 dark:text-[#4D526A] font-bold uppercase tracking-wider mt-1">Core website identity and contact details</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-8 space-y-8">
                    {/* Site Identity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <Globe size={14} className="text-[#F5A623]" />
                                Site Name
                            </label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10 focus:border-[#F5A623] transition-all font-medium"
                                value={settings?.site_name || ''}
                                onChange={(e) => handleUpdate('site_name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <Info size={14} className="text-[#F5A623]" />
                                Meta Keywords
                            </label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10 focus:border-[#F5A623] transition-all font-medium"
                                value={settings?.meta_keywords || ''}
                                onChange={(e) => handleUpdate('meta_keywords', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                            <Layout size={14} className="text-[#F5A623]" />
                            Site Description
                        </label>
                        <textarea
                            className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10 focus:border-[#F5A623] transition-all font-medium min-h-[100px]"
                            value={settings?.site_description || ''}
                            onChange={(e) => handleUpdate('site_description', e.target.value)}
                        />
                    </div>

                    {/* URLs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                Logo URL
                            </label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10 focus:border-[#F5A623] transition-all font-medium"
                                value={settings?.logo_url || ''}
                                onChange={(e) => handleUpdate('logo_url', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                Favicon URL
                            </label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10 focus:border-[#F5A623] transition-all font-medium"
                                value={settings?.favicon_url || ''}
                                onChange={(e) => handleUpdate('favicon_url', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <Mail size={14} className="text-[#F5A623]" />
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10 focus:border-[#F5A623] transition-all font-medium"
                                value={settings?.email || ''}
                                onChange={(e) => handleUpdate('email', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <Phone size={14} className="text-[#F5A623]" />
                                Phone
                            </label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10 focus:border-[#F5A623] transition-all font-medium"
                                value={settings?.phone || ''}
                                onChange={(e) => handleUpdate('phone', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                            <MapPin size={14} className="text-[#F5A623]" />
                            Address
                        </label>
                        <input
                            type="text"
                            className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10 focus:border-[#F5A623] transition-all font-medium"
                            value={settings?.address || ''}
                            onChange={(e) => handleUpdate('address', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                            Footer Text
                        </label>
                        <textarea
                            className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10 focus:border-[#F5A623] transition-all font-medium min-h-[80px]"
                            value={settings?.footer_text || ''}
                            onChange={(e) => handleUpdate('footer_text', e.target.value)}
                        />
                    </div>

                    {/* Social Links */}
                    <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                        <h4 className="font-sora font-extrabold text-slate-900 dark:text-white text-lg mb-6">Social Media Links</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    <Facebook size={14} className="text-[#1877F2]" />
                                    Facebook
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10 focus:border-[#F5A623] transition-all font-medium"
                                    value={settings?.social_links.facebook || ''}
                                    onChange={(e) => handleUpdate('social_links.facebook', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    <Twitter size={14} className="text-[#1DA1F2]" />
                                    Twitter
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10 focus:border-[#F5A623] transition-all font-medium"
                                    value={settings?.social_links.twitter || ''}
                                    onChange={(e) => handleUpdate('social_links.twitter', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    <Instagram size={14} className="text-[#E4405F]" />
                                    Instagram
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10 focus:border-[#F5A623] transition-all font-medium"
                                    value={settings?.social_links.instagram || ''}
                                    onChange={(e) => handleUpdate('social_links.instagram', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    <Linkedin size={14} className="text-[#0A66C2]" />
                                    LinkedIn
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10 focus:border-[#F5A623] transition-all font-medium"
                                    value={settings?.social_links.linkedin || ''}
                                    onChange={(e) => handleUpdate('social_links.linkedin', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebSettings;
