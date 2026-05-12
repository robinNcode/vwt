import React, { useState, useEffect, useMemo } from 'react';
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
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Skeleton from '../../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';

interface Setting {
    id: number;
    group: string;
    key: string;
    value: string | null;
    label_en: string | null;
    label_bn: string | null;
}

const Settings: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [settings, setSettings] = useState<Setting[]>([]);
    const [originalSettings, setOriginalSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeGroup, setActiveGroup] = useState<string>('general');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/settings');
            if (res.data.success) {
                setSettings(res.data.data);
                setOriginalSettings(res.data.data);
                // Set first group as active if available
                if (res.data.data.length > 0) {
                    setActiveGroup(res.data.data[0].group);
                }
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = (id: number, newValue: string) => {
        setSettings(prev => prev.map(s => s.id === id ? { ...s, value: newValue } : s));
    };

    const hasChanges = useMemo(() => {
        return JSON.stringify(settings) !== JSON.stringify(originalSettings);
    }, [settings, originalSettings]);

    const resetChanges = () => {
        setSettings(originalSettings);
    };

    const saveSettings = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await api.patch('/admin/settings/bulk', settings);
            if (res.data.success) {
                setMessage({ type: 'success', text: t('settings.save_success') || 'Settings updated successfully!' });
                setOriginalSettings(settings);
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: t('settings.save_error') || 'Failed to update settings.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: t('settings.save_error') || 'An error occurred while saving.' });
        } finally {
            setSaving(false);
        }
    };

    const groupedSettings = useMemo(() => {
        return settings.reduce((acc: Record<string, Setting[]>, s) => {
            if (!acc[s.group]) acc[s.group] = [];
            acc[s.group].push(s);
            return acc;
        }, {});
    }, [settings]);

    const groups = Object.keys(groupedSettings);

    const getIcon = (group: string) => {
        switch (group.toLowerCase()) {
            case 'general': return <Globe size={18} />;
            case 'seo': return <Search size={18} />;
            case 'order': return <ShoppingCart size={18} />;
            case 'security': return <ShieldCheck size={18} />;
            case 'notifications': return <Bell size={18} />;
            case 'templates': return <Layout size={18} />;
            case 'logistics': return <Truck size={18} />;
            case 'social': return <Share2 size={18} />;
            default: return <SettingsIcon size={18} />;
        }
    };

    const getFieldIcon = (key: string) => {
        if (key.includes('email')) return <Mail size={14} className="text-slate-400" />;
        if (key.includes('phone')) return <Phone size={14} className="text-slate-400" />;
        return <Info size={14} className="text-slate-400" />;
    };

    const renderInput = (setting: Setting) => {
        const isTextArea = setting.key.includes('template') || setting.key.includes('content') || setting.key.includes('address') || setting.key.includes('footer');
        const isBoolean = setting.value === 'true' || setting.value === 'false';

        if (isBoolean) {
            return (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleUpdate(setting.id, setting.value === 'true' ? 'false' : 'true')}
                        className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                            setting.value === 'true' ? "bg-[#F5A623]" : "bg-slate-200 dark:bg-slate-700"
                        )}
                    >
                        <span
                            className={cn(
                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                setting.value === 'true' ? "translate-x-6" : "translate-x-1"
                            )}
                        />
                    </button>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {setting.value === 'true' ? 'Enabled' : 'Disabled'}
                    </span>
                </div>
            );
        }

        if (isTextArea) {
            return (
                <textarea
                    className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10 focus:border-[#F5A623] transition-all font-medium min-h-[120px] resize-none"
                    value={setting.value || ''}
                    onChange={(e) => handleUpdate(setting.id, e.target.value)}
                />
            );
        }

        return (
            <input
                type="text"
                className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10 focus:border-[#F5A623] transition-all font-medium"
                value={setting.value || ''}
                onChange={(e) => handleUpdate(setting.id, e.target.value)}
            />
        );
    };

    return (
        <div className="space-y-8 max-w-6xl pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-sora text-3xl font-extrabold text-slate-900 dark:text-white">{t('settings.title') || 'System Settings'}</h1>
                    <p className="text-sm text-slate-500 dark:text-[#8A8FA8] mt-1 font-medium">{t('settings.subtitle') || 'Manage your global configuration and preferences'}</p>
                </div>
                <div className="flex items-center gap-3">
                    <AnimatePresence>
                        {hasChanges && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={resetChanges}
                                className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                            >
                                <RotateCcw size={20} />
                            </motion.button>
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3 space-y-2">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)
                    ) : groups.map((group) => (
                        <button
                            key={group}
                            onClick={() => setActiveGroup(group)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all border",
                                activeGroup === group
                                    ? "bg-[#F5A623]/10 border-[#F5A623]/20 text-[#d48e1d] dark:text-[#F5A623] shadow-sm"
                                    : "bg-white dark:bg-[#1A1E29] border-transparent text-slate-500 dark:text-[#8A8FA8] hover:bg-slate-50 dark:hover:bg-white/5"
                            )}
                        >
                            {getIcon(group)}
                            <span className="capitalize">{t(`settings.groups.${group.toLowerCase()}`) || group}</span>
                        </button>
                    ))}
                </div>

                {/* Settings Form */}
                <div className="lg:col-span-9">
                    {loading ? (
                        <Skeleton className="h-[500px] rounded-3xl" />
                    ) : (
                        <motion.div
                            key={activeGroup}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/20"
                        >
                            <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#F5A623] text-[#0D0F14] flex items-center justify-center shadow-lg shadow-[#F5A623]/20">
                                        {getIcon(activeGroup)}
                                    </div>
                                    <div>
                                        <h3 className="font-sora font-extrabold text-slate-900 dark:text-white text-xl capitalize">
                                            {t(`settings.groups.${activeGroup.toLowerCase()}`) || `${activeGroup} Configuration`}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-[#4D526A] font-bold uppercase tracking-wider mt-1 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
                                            Active Section Settings
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 space-y-10">
                                {groupedSettings[activeGroup]?.map((setting: Setting) => (
                                    <div key={setting.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start group/field">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                                {getFieldIcon(setting.key)}
                                                {(i18n.language.startsWith('en') ? setting.label_en : setting.label_bn) || setting.label_en || setting.key}
                                            </label>
                                            <p className="text-[10px] text-slate-400 dark:text-[#4D526A] font-mono leading-relaxed truncate group-hover/field:text-slate-500 transition-colors">
                                                {setting.key}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2">
                                            {renderInput(setting)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
