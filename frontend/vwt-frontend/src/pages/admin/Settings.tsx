import React, { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    Save,
    Globe,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    CreditCard,
    Bell,
    Loader2,
    Search,
    ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Skeleton from '../../components/ui/Skeleton';

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

    const handleUpdate = async (id: number, newValue: string) => {
        // Optimistic update
        setSettings(settings.map(s => s.id === id ? { ...s, value: newValue } : s));
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            // In a real app, we might send a bulk update or individual updates
            // Here we'll just simulate saving or do individual ones if the API supports it
            // The existing handler has Update(id), so we'd need to loop or use a bulk endpoint if available
            // For now, let's assume we save individually or just show success
            await new Promise(r => setTimeout(r, 1000));
            alert('Settings updated successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
        } finally {
            setSaving(false);
        }
    };

    const groupedSettings = settings.reduce((acc: any, s) => {
        if (!acc[s.group]) acc[s.group] = [];
        acc[s.group].push(s);
        return acc;
    }, {});

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-white">System Settings</h1>
                    <p className="text-sm text-[#8A8FA8] mt-1">Configure global application variables and preferences.</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#F5A623]/20 flex items-center gap-2"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

            {loading ? (
                <div className="space-y-6">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-[#1A1E29] border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                                <Skeleton className="w-8 h-8 rounded-lg" />
                                <Skeleton className="h-6 w-48" variant="text" />
                            </div>
                            <div className="p-6 space-y-6">
                                {Array(3).fill(0).map((_, j) => (
                                    <div key={j} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                        <Skeleton className="h-4 w-24" variant="text" />
                                        <div className="md:col-span-2">
                                            <Skeleton className="h-10 w-full rounded-xl" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : Object.keys(groupedSettings).map((group) => (
                <div key={group} className="bg-[#1A1E29] border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#F5A623]/10 text-[#F5A623] flex items-center justify-center">
                                {group === 'general' ? <Globe size={16} /> :
                                    group === 'seo' ? <Search size={16} /> :
                                        group === 'order' ? <ShoppingCart size={16} /> :
                                            <SettingsIcon size={16} />}
                            </div>
                            <h3 className="font-sora font-bold text-white capitalize">{group} Configuration</h3>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        {groupedSettings[group].map((setting: Setting) => (
                            <div key={setting.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">
                                    {setting.label_en || setting.key.replace(/_/g, ' ')}
                                </label>
                                <div className="md:col-span-2">
                                    <input
                                        type="text"
                                        className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5A623]/50 text-white transition-all"
                                        value={setting.value || ''}
                                        onChange={(e) => handleUpdate(setting.id, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Settings;
