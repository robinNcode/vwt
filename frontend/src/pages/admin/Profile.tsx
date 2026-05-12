import React, { useState, useEffect } from 'react';
import {
    User as UserIcon,
    Mail,
    Shield,
    Camera,
    Save,
    Loader2,
    Lock,
    Eye,
    EyeOff,
    Settings as SettingsIcon,
    Calendar,
    Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import api from '@/lib/axios';

interface User {
    id: number;
    name: string;
    email: string;
    avatar_url: string | null;
    role: {
        name: string;
    };
    created_at: string;
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/profile');
            if (res.data.success) {
                setUser(res.data.data);
                setFormData({
                    name: res.data.data.name,
                    email: res.data.data.email,
                    password: ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingAvatar(true);
        const data = new FormData();
        data.append('avatar', file);

        try {
            const res = await api.post('/admin/profile/avatar', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setUser(res.data.data);
                setMessage({ type: 'success', text: 'Avatar updated successfully!' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to upload avatar.' });
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const res = await api.put('/admin/profile', formData);
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setUser(res.data.data);
                setFormData(prev => ({ ...prev, password: '' }));
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-[#F5A623]" size={40} />
            </div>
        );
    }

    const serverUrl = import.meta.env.VITE_SERVER_URL || '';

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="relative h-48 rounded-3xl bg-gradient-to-r from-[#F5A623] to-[#FF8C00] overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_30%,#ffffff_1px,transparent_1px)] bg-[length:20px_20px]" />
                <div className="absolute -bottom-16 left-12 p-1 bg-white dark:bg-[#0D0F14] rounded-full shadow-2xl">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 dark:bg-white/5 text-[#F5A623] flex items-center justify-center text-5xl font-black border-4 border-white dark:border-[#1A1E29]">
                        {user?.avatar_url ? (
                            <img src={serverUrl + user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user?.name.charAt(0)
                        )}
                        {uploadingAvatar && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Loader2 className="animate-spin text-[#F5A623]" size={24} />
                            </div>
                        )}
                    </div>
                    <label className="absolute bottom-2 right-2 p-2 bg-[#F5A623] text-[#0D0F14] rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
                        <Camera size={16} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                </div>
            </div>

            <div className="pt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Info Column */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">{user?.name}</h2>
                        <div className="flex items-center gap-2 text-[#F5A623] font-bold text-xs bg-[#F5A623]/10 px-3 py-1.5 rounded-full w-fit mb-6">
                            <Shield size={14} />
                            {user?.role.name}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-slate-100 dark:divide-white/5">
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <Mail size={16} />
                                <span>{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <Calendar size={16} />
                                <span>Joined {new Date(user?.created_at || '').toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <Globe size={16} />
                                <span>Administrator</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold flex items-center gap-2 mb-2">
                                <SettingsIcon size={18} className="text-[#F5A623]" />
                                Security Info
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Keep your login credentials secure. Changing your password will invalidate existing sessions.</p>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5A623]/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    </div>
                </div>

                {/* Right Form Column */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="font-sora font-extrabold text-slate-900 dark:text-white text-lg">Update Profile</h3>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Personal Details</p>
                        </div>

                        {message && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={cn("p-4 rounded-2xl text-sm font-bold", message.type === 'success' ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400")}>
                                {message.text}
                            </motion.div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#F5A623] transition-colors" size={20} />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl pl-14 pr-6 py-4 text-sm font-medium focus:ring-2 focus:ring-[#F5A623]/20 focus:border-[#F5A623] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#F5A623] transition-colors" size={20} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl pl-14 pr-6 py-4 text-sm font-medium focus:ring-2 focus:ring-[#F5A623]/20 focus:border-[#F5A623] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Password (Optional)</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#F5A623] transition-colors" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Leave blank to keep current"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl pl-14 pr-14 py-4 text-sm font-medium focus:ring-2 focus:ring-[#F5A623]/20 focus:border-[#F5A623] outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#F5A623]"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] py-4 rounded-2xl font-black shadow-lg shadow-[#F5A623]/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:grayscale"
                            >
                                {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                                <span>SAVE PROFILE</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
