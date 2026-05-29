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
    Lock,
    Key,
    UserCog,
    ChevronRight,
    AlertTriangle,
    RefreshCw,
    Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

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
    avatar_url?: string;
}

type ModalMode = 'editUser' | 'editPermissions' | 'createRole' | null;

const avatarColors = [
    'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-amber-500', 'bg-cyan-500', 'bg-rose-500',
];

const getAvatarColor = (name: string) =>
    avatarColors[name.charCodeAt(0) % avatarColors.length];

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [saving, setSaving] = useState(false);
    const [newRole, setNewRole] = useState({ name: '', slug: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, rolesRes, permsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/roles'),
                api.get('/admin/permissions'),
            ]);
            if (usersRes.data.success) setUsers(usersRes.data.data || []);
            if (rolesRes.data.success) setRoles(rolesRes.data.data || []);
            if (permsRes.data.success) setPermissions(permsRes.data.data || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load data. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const closeModal = () => {
        setModalMode(null);
        setSelectedUser(null);
        setSelectedRole(null);
        setNewRole({ name: '', slug: '' });
    };

    // --- User Update ---
    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        setSaving(true);
        try {
            const res = await api.put(`/admin/users/${selectedUser.id}`, {
                name: selectedUser.name,
                email: selectedUser.email,
                role_id: selectedUser.role_id,
                is_active: selectedUser.is_active,
            });
            if (res.data.success) {
                toast.success('User updated successfully');
                await fetchData();
                closeModal();
            }
        } catch {
            toast.error('Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    // --- Permission Toggle ---
    const togglePermission = (perm: Permission) => {
        if (!selectedRole) return;
        const exists = selectedRole.permissions.some(p => p.id === perm.id);
        const newPerms = exists
            ? selectedRole.permissions.filter(p => p.id !== perm.id)
            : [...selectedRole.permissions, perm];
        setSelectedRole({ ...selectedRole, permissions: newPerms });
    };

    const toggleModuleAll = (modulePerms: Permission[]) => {
        if (!selectedRole) return;
        const allChecked = modulePerms.every(mp => selectedRole.permissions.some(p => p.id === mp.id));
        let newPerms: Permission[];
        if (allChecked) {
            newPerms = selectedRole.permissions.filter(p => !modulePerms.some(mp => mp.id === p.id));
        } else {
            const toAdd = modulePerms.filter(mp => !selectedRole.permissions.some(p => p.id === mp.id));
            newPerms = [...selectedRole.permissions, ...toAdd];
        }
        setSelectedRole({ ...selectedRole, permissions: newPerms });
    };

    // --- Permission Save ---
    const handleUpdatePermissions = async () => {
        if (!selectedRole) return;
        setSaving(true);
        try {
            const permIds = selectedRole.permissions.map(p => p.id);
            const res = await api.put(`/admin/roles/${selectedRole.id}/permissions`, { permission_ids: permIds });
            if (res.data.success) {
                toast.success(`Permissions for "${selectedRole.name}" saved`);
                await fetchData();
                closeModal();
            }
        } catch {
            toast.error('Failed to update permissions');
        } finally {
            setSaving(false);
        }
    };

    // --- Create Role ---
    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRole.name.trim() || !newRole.slug.trim()) {
            toast.error('Name and slug are required');
            return;
        }
        setSaving(true);
        try {
            const res = await api.post('/admin/roles', newRole);
            if (res.data.success) {
                toast.success(`Role "${newRole.name}" created`);
                await fetchData();
                closeModal();
            }
        } catch {
            toast.error('Failed to create role');
        } finally {
            setSaving(false);
        }
    };

    // Group permissions by module
    const permissionsByModule = permissions.reduce((acc: Record<string, Permission[]>, p) => {
        if (!acc[p.module]) acc[p.module] = [];
        acc[p.module].push(p);
        return acc;
    }, {});

    const moduleIcons: Record<string, string> = {
        products: '📦', services: '🔧', orders: '🛒', quotations: '📋',
        invoices: '📄', accounting: '💰', reports: '📊', settings: '⚙️',
        users: '👥',
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-sora text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="w-10 h-10 rounded-2xl bg-[#F5A623]/10 flex items-center justify-center">
                            <UserCog className="text-[#F5A623]" size={22} />
                        </span>
                        Access Management
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-[#8A8FA8] mt-2 ml-[52px]">
                        Manage user identities and role-based permissions.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {activeTab === 'roles' && (
                        <button
                            onClick={() => setModalMode('createRole')}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] text-sm font-bold transition-all shadow-md shadow-[#F5A623]/20"
                        >
                            <Plus size={16} /> New Role
                        </button>
                    )}
                    <button onClick={fetchData} className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-slate-500" title="Refresh">
                        <RefreshCw size={16} />
                    </button>
                    <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                                activeTab === 'users'
                                    ? "bg-white dark:bg-white/10 text-[#F5A623] shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-white"
                            )}
                        >
                            <UsersIcon size={15} /> Users
                        </button>
                        <button
                            onClick={() => setActiveTab('roles')}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                                activeTab === 'roles'
                                    ? "bg-white dark:bg-white/10 text-[#F5A623] shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-white"
                            )}
                        >
                            <Shield size={15} /> Roles
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="animate-spin text-[#F5A623]" size={40} />
                    <p className="text-slate-400 text-sm">Loading access data...</p>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {/* ─── Users Tab ─── */}
                    {activeTab === 'users' && (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            className="bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl"
                        >
                            <div className="px-8 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-500">{users.length} users</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-white/[0.02]">
                                        <tr>
                                            <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">User</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Permissions</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-8 py-16 text-center text-slate-400">No users found.</td>
                                            </tr>
                                        ) : users.map(user => (
                                            <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0", getAvatarColor(user.name))}>
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                                                            <p className="text-xs text-slate-400">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-[#F5A623] bg-[#F5A623]/10 px-3 py-1.5 rounded-full w-fit">
                                                        <Shield size={11} />
                                                        {user.role?.name || <span className="text-slate-400">No Role</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-1 flex-wrap max-w-[200px]">
                                                        {(user.role?.permissions || []).length === 0 ? (
                                                            <span className="text-xs text-slate-400 italic">No permissions</span>
                                                        ) : (
                                                            <>
                                                                {user.role.permissions.slice(0, 2).map(p => (
                                                                    <span key={p.id} className="text-[10px] bg-slate-100 dark:bg-white/5 text-slate-500 px-2 py-0.5 rounded-md font-mono">
                                                                        {p.slug}
                                                                    </span>
                                                                ))}
                                                                {user.role.permissions.length > 2 && (
                                                                    <span className="text-[10px] bg-[#F5A623]/10 text-[#F5A623] px-2 py-0.5 rounded-md font-bold">
                                                                        +{user.role.permissions.length - 2}
                                                                    </span>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {user.is_active ? (
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                            <CheckCircle2 size={11} /> Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                            <XCircle size={11} /> Inactive
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button
                                                        onClick={() => { setSelectedUser(JSON.parse(JSON.stringify(user))); setModalMode('editUser'); }}
                                                        className="p-2 rounded-xl hover:bg-[#F5A623]/10 text-slate-400 hover:text-[#F5A623] transition-all"
                                                        title="Edit user"
                                                    >
                                                        <Edit2 size={17} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* ─── Roles Tab ─── */}
                    {activeTab === 'roles' && (
                        <motion.div
                            key="roles"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        >
                            {roles.length === 0 && (
                                <div className="col-span-3 py-20 text-center text-slate-400">No roles yet. Create one!</div>
                            )}
                            {roles.map(role => {
                                const roleUsers = users.filter(u => u.role_id === role.id);
                                return (
                                    <div key={role.id} className="bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col gap-5">
                                        {/* Card Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="w-12 h-12 rounded-2xl bg-[#F5A623]/10 text-[#F5A623] flex items-center justify-center shrink-0">
                                                <Shield size={24} />
                                            </div>
                                            <button
                                                onClick={() => { setSelectedRole(JSON.parse(JSON.stringify(role))); setModalMode('editPermissions'); }}
                                                className="flex items-center gap-1.5 text-xs font-bold text-[#F5A623] hover:text-[#D48E1D] border border-[#F5A623]/20 hover:border-[#F5A623]/50 px-3 py-1.5 rounded-lg transition-all"
                                            >
                                                <Key size={12} /> Edit Permissions
                                            </button>
                                        </div>

                                        {/* Role Info */}
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{role.name}</h3>
                                            <p className="text-xs text-slate-400 font-mono mt-0.5">{role.slug}</p>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 text-xs">
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <UsersIcon size={13} />
                                                <span className="font-bold text-slate-700 dark:text-slate-300">{roleUsers.length}</span> users
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <Lock size={13} />
                                                <span className="font-bold text-slate-700 dark:text-slate-300">{role.permissions?.length || 0}</span> permissions
                                            </div>
                                        </div>

                                        {/* Permission Chips */}
                                        <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                                            {(role.permissions || []).length === 0 ? (
                                                <span className="text-xs text-slate-400 italic flex items-center gap-1">
                                                    <AlertTriangle size={12} className="text-amber-400" /> No permissions assigned
                                                </span>
                                            ) : (
                                                <>
                                                    {role.permissions.slice(0, 4).map(p => (
                                                        <span key={p.id} className="text-[10px] font-bold bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400">
                                                            {p.name}
                                                        </span>
                                                    ))}
                                                    {role.permissions.length > 4 && (
                                                        <span className="text-[10px] font-bold bg-[#F5A623]/10 px-2 py-1 rounded-lg text-[#F5A623]">
                                                            +{role.permissions.length - 4} more
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* User Avatars */}
                                        {roleUsers.length > 0 && (
                                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                                                <div className="flex -space-x-2">
                                                    {roleUsers.slice(0, 4).map(u => (
                                                        <div key={u.id} className={cn("w-7 h-7 rounded-full border-2 border-white dark:border-[#1A1E29] flex items-center justify-center text-white text-[10px] font-bold", getAvatarColor(u.name))}>
                                                            {u.name.charAt(0)}
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-xs text-slate-400">{roleUsers.map(u => u.name.split(' ')[0]).slice(0, 2).join(', ')}{roleUsers.length > 2 ? `, +${roleUsers.length - 2}` : ''}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* ─── Modal ─── */}
            <AnimatePresence>
                {modalMode && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={closeModal}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="p-7 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01] shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-[#F5A623]/10 flex items-center justify-center">
                                        {modalMode === 'editUser' ? <UserCog className="text-[#F5A623]" size={20} /> :
                                            modalMode === 'createRole' ? <Plus className="text-[#F5A623]" size={20} /> :
                                                <Key className="text-[#F5A623]" size={20} />}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                            {modalMode === 'editUser' ? 'Edit User Access' :
                                                modalMode === 'createRole' ? 'Create New Role' :
                                                    `Manage Permissions — ${selectedRole?.name}`}
                                        </h2>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {modalMode === 'editUser' ? `Editing: ${selectedUser?.name}` :
                                                modalMode === 'createRole' ? 'Define role name and slug' :
                                                    `${selectedRole?.permissions.length || 0} permissions selected`}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-7 overflow-y-auto flex-1 space-y-6">

                                {/* Edit User */}
                                {modalMode === 'editUser' && selectedUser && (
                                    <form id="editUserForm" onSubmit={handleUpdateUser} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={selectedUser.name}
                                                    onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={selectedUser.email}
                                                    onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assign Role</label>
                                                <select
                                                    value={selectedUser.role_id}
                                                    onChange={e => {
                                                        const rid = parseInt(e.target.value);
                                                        setSelectedUser({ ...selectedUser, role_id: rid, role: roles.find(r => r.id === rid)! });
                                                    }}
                                                    className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                                                >
                                                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account Status</label>
                                                <div className="flex items-center gap-3 pt-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedUser({ ...selectedUser, is_active: !selectedUser.is_active })}
                                                        className={cn(
                                                            "relative inline-flex h-7 w-12 items-center rounded-full transition-colors shrink-0",
                                                            selectedUser.is_active ? "bg-[#F5A623]" : "bg-slate-200 dark:bg-slate-700"
                                                        )}
                                                    >
                                                        <span className={cn("inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform", selectedUser.is_active ? "translate-x-6" : "translate-x-1")} />
                                                    </button>
                                                    <span className={cn("text-sm font-bold", selectedUser.is_active ? "text-emerald-500" : "text-rose-500")}>
                                                        {selectedUser.is_active ? 'Active' : 'Disabled'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Show selected role's permissions */}
                                        {selectedUser.role && (
                                            <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 p-5">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Lock size={13} className="text-[#F5A623]" />
                                                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Inherited Permissions from "{selectedUser.role.name}"</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {(roles.find(r => r.id === selectedUser.role_id)?.permissions || []).length === 0 ? (
                                                        <span className="text-xs text-slate-400 italic">No permissions assigned to this role.</span>
                                                    ) : (
                                                        (roles.find(r => r.id === selectedUser.role_id)?.permissions || []).map(p => (
                                                            <span key={p.id} className="text-[10px] font-bold bg-[#F5A623]/10 text-[#F5A623] px-2.5 py-1 rounded-lg">
                                                                {p.name}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                )}

                                {/* Create Role */}
                                {modalMode === 'createRole' && (
                                    <form id="createRoleForm" onSubmit={handleCreateRole} className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Warehouse Manager"
                                                value={newRole.name}
                                                onChange={e => setNewRole({ ...newRole, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                                className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Slug (auto-generated)</label>
                                            <input
                                                type="text"
                                                value={newRole.slug}
                                                onChange={e => setNewRole({ ...newRole, slug: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                            <AlertTriangle size={12} className="text-amber-400" />
                                            After creating, go to the Roles tab and assign permissions.
                                        </p>
                                    </form>
                                )}

                                {/* Edit Permissions */}
                                {modalMode === 'editPermissions' && selectedRole && (
                                    <div className="space-y-6">
                                        {/* Quick summary bar */}
                                        <div className="flex items-center justify-between rounded-2xl bg-[#F5A623]/5 border border-[#F5A623]/20 px-5 py-3">
                                            <span className="text-sm font-bold text-slate-700 dark:text-white">
                                                <span className="text-[#F5A623]">{selectedRole.permissions.length}</span> / {permissions.length} permissions selected
                                            </span>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedRole({ ...selectedRole, permissions: [...permissions] })}
                                                    className="text-[11px] font-bold text-[#F5A623] hover:underline"
                                                >Select All</button>
                                                <span className="text-slate-300 dark:text-slate-600">|</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedRole({ ...selectedRole, permissions: [] })}
                                                    className="text-[11px] font-bold text-slate-400 hover:underline"
                                                >Clear All</button>
                                            </div>
                                        </div>

                                        {Object.entries(permissionsByModule).map(([module, modulePerms]) => {
                                            const allChecked = modulePerms.every(mp => selectedRole.permissions.some(p => p.id === mp.id));
                                            const someChecked = modulePerms.some(mp => selectedRole.permissions.some(p => p.id === mp.id));
                                            return (
                                                <div key={module} className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-base">{moduleIcons[module] || '🔒'}</span>
                                                            <h4 className="text-[10px] font-extrabold text-slate-500 dark:text-[#8A8FA8] uppercase tracking-widest">
                                                                {module}
                                                            </h4>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleModuleAll(modulePerms)}
                                                            className={cn(
                                                                "text-[10px] font-bold px-3 py-1 rounded-lg transition-all",
                                                                allChecked
                                                                    ? "bg-[#F5A623]/10 text-[#F5A623]"
                                                                    : "bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-600"
                                                            )}
                                                        >
                                                            {allChecked ? 'Deselect Module' : someChecked ? 'Select Remaining' : 'Select All'}
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {modulePerms.map(perm => {
                                                            const isChecked = selectedRole.permissions.some(p => p.id === perm.id);
                                                            return (
                                                                <div
                                                                    key={perm.id}
                                                                    onClick={() => togglePermission(perm)}
                                                                    className={cn(
                                                                        "flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all group select-none",
                                                                        isChecked
                                                                            ? "bg-[#F5A623]/5 border-[#F5A623]/40 text-[#d48e1d]"
                                                                            : "bg-slate-50 dark:bg-white/[0.01] border-slate-100 dark:border-white/5 text-slate-500 hover:border-[#F5A623]/20 hover:bg-[#F5A623]/[0.02]"
                                                                    )}
                                                                >
                                                                    <div className={cn(
                                                                        "w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0",
                                                                        isChecked ? "bg-[#F5A623] border-[#F5A623] text-white shadow-md shadow-[#F5A623]/30" : "border-slate-300 dark:border-slate-600"
                                                                    )}>
                                                                        {isChecked && <Check size={12} strokeWidth={3} />}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-bold leading-tight">{perm.name}</p>
                                                                        <p className="text-[10px] font-mono opacity-60 mt-0.5">{perm.slug}</p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-7 py-5 border-t border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/30 dark:bg-white/[0.01] shrink-0">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500 font-bold text-sm hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={
                                        modalMode === 'editUser' ? undefined :
                                            modalMode === 'createRole' ? undefined :
                                                handleUpdatePermissions
                                    }
                                    form={
                                        modalMode === 'editUser' ? 'editUserForm' :
                                            modalMode === 'createRole' ? 'createRoleForm' : undefined
                                    }
                                    type={modalMode === 'editPermissions' ? 'button' : 'submit'}
                                    disabled={saving}
                                    className="bg-[#F5A623] hover:bg-[#D48E1D] disabled:opacity-60 text-[#0D0F14] px-8 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-[#F5A623]/20"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> :
                                        modalMode === 'editUser' ? <Save size={16} /> :
                                            modalMode === 'createRole' ? <Plus size={16} /> :
                                                <Lock size={16} />}
                                    {saving ? 'Saving...' :
                                        modalMode === 'editUser' ? 'Update User' :
                                            modalMode === 'createRole' ? 'Create Role' :
                                                'Save Permissions'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Users;
