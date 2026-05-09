import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Wrench,
    Check,
    X,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '@/components/Pagination';

interface Service {
    id: number;
    name_bn: string;
    name_en: string;
    slug: string;
    price: number | null;
    is_active: boolean;
    sort_order: number;
}

const Services: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({
        name_bn: '',
        name_en: '',
        slug: '',
        price: null as number | null,
        is_active: true,
        sort_order: 0
    });

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8083/api/v1/services?search=${searchTerm}&page=${currentPage}`);
            const data = await res.json();
            if (data.success) {
                if (data.data.items) {
                    setServices(data.data.items);
                    setTotalPages(data.data.totalPages || 1);
                    setTotalItems(data.data.totalItems || 0);
                } else {
                    setServices(data.data);
                    setTotalPages(1);
                    setTotalItems(data.data.length);
                }
            }
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchServices();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, currentPage]);

    const handleUpsert = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingService
            ? `http://localhost:8083/api/v1/services/${editingService.id}`
            : 'http://localhost:8083/api/v1/services';
        const method = editingService ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setIsModalOpen(false);
                setEditingService(null);
                setFormData({
                    name_bn: '',
                    name_en: '',
                    slug: '',
                    price: null,
                    is_active: true,
                    sort_order: 0
                });
                fetchServices();
            }
        } catch (error) {
            console.error('Failed to save service:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            const res = await fetch(`http://localhost:8083/api/v1/services/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                fetchServices();
            }
        } catch (error) {
            console.error('Failed to delete service:', error);
        }
    };

    const openEditModal = (svc: Service) => {
        setEditingService(svc);
        setFormData({
            name_bn: svc.name_bn,
            name_en: svc.name_en,
            slug: svc.slug,
            price: svc.price,
            is_active: svc.is_active,
            sort_order: svc.sort_order
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-[#5C4D3C] dark:text-white">Service Management</h1>
                    <p className="text-sm text-[#8B7355] dark:text-[#8A8FA8] mt-1">Configure your professional technical services.</p>
                </div>
                <button
                    onClick={() => { setEditingService(null); setIsModalOpen(true); }}
                    className="bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#F5A623]/20 flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Service
                </button>
            </div>

            <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355] dark:text-[#4D526A]" size={18} />
                    <input
                        type="text"
                        placeholder="Search services..."
                        className="bg-white dark:bg-[#13161E] border border-[#E8DCC4] dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#F5A623]/50 w-full transition-all text-[#5C4D3C] dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F3E6] dark:bg-[#13161E]/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Service Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Base Price</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Sort Order</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DCC4] dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin text-[#F5A623]" size={32} />
                                            <p className="text-sm text-[#4D526A]">Loading services...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : services.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#8B7355] dark:text-[#4D526A]">No services found.</td>
                                </tr>
                            ) : services.map((svc) => (
                                <tr key={svc.id} className="hover:bg-[#F8F3E6]/60 dark:hover:bg-white/[0.02] transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#d48e1d] dark:text-[#4D526A] group-hover:text-[#F5A623] transition-all">
                                                <Wrench size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#5C4D3C] dark:text-[#F0F2F7]">{svc.name_en}</p>
                                                <p className="text-xs text-[#8B7355] dark:text-[#4D526A] mt-0.5">{svc.name_bn}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-[#5C4D3C] dark:text-[#F0F2F7]">
                                        {svc.price ? `৳${svc.price.toLocaleString()}` : 'Contact for Price'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", svc.is_active ? "bg-emerald-500" : "bg-red-500")} />
                                            <span className="text-xs font-semibold text-[#8A8FA8]">{svc.is_active ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-[#d48e1d] dark:text-[#F5A623]">
                                        {svc.sort_order}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEditModal(svc)}
                                                className="p-2 rounded-lg hover:bg-blue-500/10 hover:text-blue-400 transition-all text-[#8B7355] dark:text-[#4D526A]"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(svc.id)}
                                                className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all text-[#8B7355] dark:text-[#4D526A]"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={setCurrentPage}
                />
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-[#0D0F14]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#1A1E29] border border-white/5 w-full max-w-2xl rounded-3xl overflow-hidden relative z-10 shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h3 className="font-sora font-extrabold text-xl text-white">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleUpsert} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Service Name (EN)</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5A623]/50 text-white transition-all"
                                            value={formData.name_en}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    name_en: val,
                                                    slug: val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Service Name (BN)</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5A623]/50 text-white transition-all"
                                            value={formData.name_bn}
                                            onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Access Slug</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-[#13161E] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5A623]/50 text-[#F5A623] transition-all font-mono"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Base Price (BDT)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5A623]/50 text-white transition-all"
                                            placeholder="Leave empty for 'Contact for Quote'"
                                            value={formData.price || ''}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : null })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Sort Order</label>
                                        <input
                                            type="number"
                                            className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5A623]/50 text-white transition-all"
                                            value={formData.sort_order}
                                            onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 py-4">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div
                                            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                            className={cn(
                                                "w-12 h-6 rounded-full transition-all relative",
                                                formData.is_active ? "bg-[#F5A623]" : "bg-[#4D526A]"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                                                formData.is_active ? "right-1" : "left-1"
                                            )} />
                                        </div>
                                        <span className="text-sm font-bold text-[#F0F2F7]">Show in Frontend</span>
                                    </label>
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-sm font-bold text-[#8A8FA8] hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 rounded-xl bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] text-sm font-bold transition-all shadow-lg shadow-[#F5A623]/20"
                                    >
                                        {editingService ? 'Update Service' : 'Create Service'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Services;
