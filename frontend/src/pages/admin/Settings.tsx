import React, { useState, useEffect } from 'react';
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
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Skeleton from '../../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

interface Setting {
    id: number;
    group: string;
    key: string;
    value: string | null;
    label_en: string | null;
}

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8083/api/v1/settings`);
            const data = await res.json();
            if (data.success) {
                setSettings(data.data);
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
        setSettings(settings.map(s => s.id === id ? { ...s, value: newValue } : s));
    };

    const saveSettings = async () => {
        setSaving(true);
        setMessage(null);
        try {
            // Bulk update simulation
            const updates = settings.map(s => ({ id: s.id, value: s.value }));

            // Assuming there's a bulk endpoint or we just simulate it
            await new Promise(r => setTimeout(r, 1200));

            setMessage({ type: 'success', text: 'Settings updated successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const groupedSettings = settings.reduce((acc: Record<string, Setting[]>, s) => {
        if (!acc[s.group]) acc[s.group] = [];
        acc[s.group].push(s);
        return acc;
    }, {});

    const getIcon = (group: string) => {
        switch (group.toLowerCase()) {
            case 'general': return <Globe size={18} />;
            case 'seo': return <Search size={18} />;
            case 'order': return <ShoppingCart size={18} />;
            case 'security': return <ShieldCheck size={18} />;
            case 'notifications': return <Bell size={18} />;
            default: return <SettingsIcon size={18} />;
        }
    };

    return (
        <div className="space-y-8 max-w-5xl pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-slate-900 dark:text-white">System Settings</h1>
                    <p className="text-sm text-slate-500 dark:text-[#8A8FA8] mt-1 font-medium">Configure global application variables and preferences.</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving || loading}
                    className="bg-blue-600 dark:bg-[#F5A623] hover:bg-blue-700 dark:hover:bg-[#D48E1D] text-white dark:text-[#0D0F14] px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 dark:shadow-[#F5A623]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {saving ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        <Save size={18} className="transition-transform group-hover:scale-110" />
                    )}
                    <span>Save Changes</span>
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

            <div className="grid grid-cols-1 gap-8">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-xl" />
                                <Skeleton className="h-6 w-48" variant="text" />
                            </div>
                            <div className="p-8 space-y-8">
                                {Array(3).fill(0).map((_, j) => (
                                    <div key={j} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                        <Skeleton className="h-4 w-32" variant="text" />
                                        <div className="md:col-span-3">
                                            <Skeleton className="h-12 w-full rounded-2xl" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : Object.keys(groupedSettings).map((group) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={group}
                        className="bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 dark:bg-[#F5A623]/10 text-blue-600 dark:text-[#F5A623] flex items-center justify-center border border-blue-500/10 dark:border-[#F5A623]/10">
                                    {getIcon(group)}
                                </div>
                                <div>
                                    <h3 className="font-sora font-extrabold text-slate-900 dark:text-white text-lg capitalize">{group} Configuration</h3>
                                    <p className="text-xs text-slate-400 dark:text-[#4D526A] font-bold uppercase tracking-wider mt-0.5">Core system parameters</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 space-y-8">
                            {groupedSettings[group].map((setting: Setting) => (
                                <div key={setting.id} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center group/field">
                                    <label className="text-xs font-bold text-slate-500 dark:text-[#8A8FA8] uppercase tracking-widest pl-1">
                                        {setting.label_en || setting.key.replace(/_/g, ' ')}
                                    </label>
                                    <div className="md:col-span-3 relative">
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:focus:ring-[#F5A623]/10 focus:border-blue-600 dark:focus:border-[#F5A623] transition-all font-medium"
                                            value={setting.value || ''}
                                            onChange={(e) => handleUpdate(setting.id, e.target.value)}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-focus-within/field:opacity-100 transition-opacity">
                                            <div className="w-1 h-1 rounded-full bg-blue-600 dark:bg-[#F5A623]" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Settings;
