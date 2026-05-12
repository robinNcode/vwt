import React, { useState, useEffect } from 'react';
import {
    Users as UsersIcon,
    Shield,
    Plus,
    Loader2,
    CheckCircle2,
    XCircle,
    Edit2,
    Save,
    X,
    Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
}

interface Role {
    id: number;
    name: string;
    slug: string;
    permissions: Permission[];
}

interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    role: Role;
    is_active: boolean;
}

const Users: React.FC = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, rolesRes, permsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/roles'),
                api.get('/admin/permissions')
            ]);
            if (usersRes.data.success) setUsers(usersRes.data.data);
            if (rolesRes.data.success) setRoles(rolesRes.data.data);
            if (permsRes.data.success) setPermissions(permsRes.data.data);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdatePermissions = async () => {
        if (!selectedRole) return;
        setSaving(true);
        try {
            const permIds = selectedRole.permissions.map(p => p.id);
            const res = await api.put(`/admin/roles/${selectedRole.id}/permissions`, { permission_ids: permIds });
            if (res.data.success) {
                await fetchData();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Failed to update permissions:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        setSaving(true);
        try {
            const res = await api.put(`/admin/users/${selectedUser.id}`, selectedUser);
            if (res.data.success) {
                await fetchData();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Failed to update user:', error);
        } finally {
            setSaving(false);
        }
    };

    const togglePermission = (perm: Permission) => {
        if (!selectedRole) return;
        const exists = selectedRole.permissions.find(p => p.id === perm.id);
        const newPerms = exists
            ? selectedRole.permissions.filter(p => p.id !== perm.id)
            : [...selectedRole.permissions, perm];
        setSelectedRole({ ...selectedRole, permissions: newPerms });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-sora text-3xl font-extrabold text-slate-900 dark:text-white">Access Management</h1>
                    <p className="text-sm text-slate-500 dark:text-[#8A8FA8] mt-1 font-medium">Manage user identities and role-based permissions.</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                            activeTab === 'users' ? "bg-white dark:bg-white/10 text-[#F5A623] shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-white"
                        )}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                            activeTab === 'roles' ? "bg-white dark:bg-white/10 text-[#F5A623] shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-white"
                        )}
                    >
                        Roles
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F5A623]" size={40} /></div>
            ) : (
                <AnimatePresence mode="wait">
                    {activeTab === 'users' ? (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-white/[0.02]">
                                        <tr>
                                            <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">User</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {users.map(user => (
                                            <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-[#F5A623]/10 text-[#F5A623] flex items-center justify-center font-bold">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</span>
                                                            <span className="text-xs text-slate-500">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-[#F5A623] bg-[#F5A623]/10 px-3 py-1.5 rounded-full w-fit">
                                                        <Shield size={12} />
                                                        {user.role?.name || 'No Role'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {user.is_active ? (
                                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                                                            <CheckCircle2 size={12} /> Active
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                                                            <XCircle size={12} /> Inactive
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button
                                                        onClick={() => { setSelectedUser(user); setShowModal(true); }}
                                                        className="p-2 rounded-xl hover:bg-[#F5A623]/10 text-slate-400 hover:text-[#F5A623] transition-all"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="roles"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {roles.map(role => (
                                <div key={role.id} className="bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#F5A623]/10 text-[#F5A623] flex items-center justify-center">
                                            <Shield size={24} />
                                        </div>
                                        <button
                                            onClick={() => { setSelectedRole(role); setShowModal(true); }}
                                            className="text-xs font-bold text-[#F5A623] hover:underline"
                                        >
                                            Edit Permissions
                                        </button>
                                    </div>
                                    <h3 className="font-sora font-extrabold text-slate-900 dark:text-white text-lg capitalize">{role.name}</h3>
                                    <p className="text-xs text-slate-500 font-mono mt-1">Slug: {role.slug}</p>
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {role.permissions.slice(0, 3).map(p => (
                                            <span key={p.id} className="text-[10px] font-bold bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md text-slate-500">
                                                {p.name}
                                            </span>
                                        ))}
                                        {role.permissions.length > 3 && (
                                            <span className="text-[10px] font-bold bg-[#F5A623]/10 px-2 py-1 rounded-md text-[#F5A623]">
                                                +{role.permissions.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0D0F14]/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01]">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                        {activeTab === 'users' ? 'Update User Access' : `Manage ${selectedRole?.name} Permissions`}
                                    </h2>
                                    <p className="text-sm text-slate-500">Configuration changes will take effect immediately.</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400"><X size={20} /></button>
                            </div>

                            <div className="p-8 overflow-y-auto flex-1">
                                {activeTab === 'users' && selectedUser ? (
                                    <form onSubmit={handleUpdateUser} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={selectedUser.name}
                                                    onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm font-medium"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={selectedUser.email}
                                                    onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Assign Role</label>
                                                <select
                                                    value={selectedUser.role_id}
                                                    onChange={e => setSelectedUser({ ...selectedUser, role_id: parseInt(e.target.value), role: roles.find(r => r.id === parseInt(e.target.value))! })}
                                                    className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm font-medium outline-none"
                                                >
                                                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Account Status</label>
                                                <div className="flex items-center gap-3 pt-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedUser({ ...selectedUser, is_active: !selectedUser.is_active })}
                                                        className={cn(
                                                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                                            selectedUser.is_active ? "bg-[#F5A623]" : "bg-slate-200 dark:bg-slate-700"
                                                        )}
                                                    >
                                                        <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", selectedUser.is_active ? "translate-x-6" : "translate-x-1")} />
                                                    </button>
                                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{selectedUser.is_active ? 'Active' : 'Disabled'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-8 flex justify-end gap-3 border-t border-slate-100 dark:border-white/5">
                                            <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3.5 rounded-2xl border border-slate-200 text-slate-500 font-bold">Cancel</button>
                                            <button type="submit" disabled={saving} className="bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] px-10 py-3.5 rounded-2xl font-bold flex items-center gap-2">
                                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                                <span>{saving ? 'Saving...' : 'Update Identity'}</span>
                                            </button>
                                        </div>
                                    </form>
                                ) : activeTab === 'roles' && selectedRole ? (
                                    <div className="space-y-8">
                                        {/* Group by Module */}
                                        {Object.entries(
                                            permissions.reduce((acc: Record<string, Permission[]>, p) => {
                                                if (!acc[p.module]) acc[p.module] = [];
                                                acc[p.module].push(p);
                                                return acc;
                                            }, {})
                                        ).map(([module, modulePerms]) => (
                                            <div key={module} className="space-y-4">
                                                <h4 className="text-[10px] font-extrabold text-[#F5A623] uppercase tracking-widest border-b border-[#F5A623]/20 pb-2">{module} Identity</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {modulePerms.map(perm => {
                                                        const isChecked = selectedRole.permissions.some(p => p.id === perm.id);
                                                        return (
                                                            <div
                                                                key={perm.id}
                                                                onClick={() => togglePermission(perm)}
                                                                className={cn(
                                                                    "flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all",
                                                                    isChecked
                                                                        ? "bg-[#F5A623]/5 border-[#F5A623]/30 text-[#d48e1d]"
                                                                        : "bg-slate-50/50 dark:bg-white/[0.01] border-slate-100 dark:border-white/5 text-slate-500 hover:border-slate-200"
                                                                )}
                                                            >
                                                                <div className={cn("w-5 h-5 rounded-md border flex items-center justify-center transition-colors", isChecked ? "bg-[#F5A623] border-[#F5A623] text-white" : "border-slate-300 dark:border-slate-600")}>
                                                                    {isChecked && <CheckCircle2 size={14} />}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-xs font-bold">{perm.name}</span>
                                                                    <span className="text-[10px] opacity-70 font-mono">{perm.slug}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="pt-8 flex justify-end gap-3 border-t border-slate-100 dark:border-white/5">
                                            <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3.5 rounded-2xl border border-slate-200 text-slate-500 font-bold">Cancel</button>
                                            <button onClick={handleUpdatePermissions} disabled={saving} className="bg-[#F5A623] text-[#0D0F14] px-10 py-3.5 rounded-2xl font-bold flex items-center gap-2">
                                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                                                <span>{saving ? 'Locked...' : 'Overwrite Permissions'}</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Users;
