import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Wrench,
    Check,
    X,
    Loader2,
    Upload,
    ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '@/components/Pagination';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';

interface Service {
    id: number;
    name_bn: string;
    name_en: string;
    slug: string;
    description_bn?: string;
    description_en?: string;
    price: number | null;
    image_url?: string;
    is_active: boolean;
    sort_order: number;
}

const Services: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name_bn: '',
        name_en: '',
        slug: '',
        description_bn: '',
        description_en: '',
        price: null as number | null,
        is_active: true,
        sort_order: 0
    });

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/services?search=${searchTerm}&page=${currentPage}`);
            if (res.data.success) {
                if (res.data.data.items) {
                    setServices(res.data.data.items);
                    setTotalPages(res.data.data.totalPages || 1);
                    setTotalItems(res.data.data.totalItems || 0);
                } else {
                    setServices(res.data.data);
                    setTotalPages(1);
                    setTotalItems(res.data.data.length);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpsert = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingService
            ? `/admin/services/${editingService.id}`
            : '/admin/services';
        const method = editingService ? 'put' : 'post';

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) data.append(key, String(value));
        });
        if (selectedFile) {
            data.append('image', selectedFile);
        }

        try {
            const res = await api({
                method,
                url,
                data,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                resetForm();
                fetchServices();
            }
        } catch (error) {
            console.error('Failed to save service:', error);
        }
    };

    const resetForm = () => {
        setIsModalOpen(false);
        setEditingService(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        setFormData({
            name_bn: '',
            name_en: '',
            slug: '',
            description_bn: '',
            description_en: '',
            price: null,
            is_active: true,
            sort_order: 0
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            const res = await api.delete(`/admin/services/${id}`);
            if (res.data.success) {
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
            description_bn: svc.description_bn || '',
            description_en: svc.description_en || '',
            price: svc.price,
            is_active: svc.is_active,
            sort_order: svc.sort_order
        });
        setPreviewUrl(svc.image_url ? `${import.meta.env.VITE_SERVER_URL}${svc.image_url}` : null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-[#5C4D3C] dark:text-white">{t('admin_nav.services')}</h1>
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
                        placeholder={t('admin_nav.search_placeholder')}
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
                                        <Loader2 className="animate-spin text-[#F5A623] mx-auto" size={32} />
                                    </td>
                                </tr>
                            ) : services.map((svc) => (
                                <tr key={svc.id} className="hover:bg-[#F8F3E6]/60 dark:hover:bg-white/[0.02] transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#d48e1d] overflow-hidden border border-[#F5A623]/20">
                                                {svc.image_url ? (
                                                    <img src={`${import.meta.env.VITE_SERVER_URL}${svc.image_url}`} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Wrench size={18} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#5C4D3C] dark:text-[#F0F2F7]">{i18n.language === 'en' ? svc.name_en : svc.name_bn}</p>
                                                <p className="text-[10px] text-[#8B7355] dark:text-[#4D526A] uppercase font-bold tracking-tight">{svc.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-[#5C4D3C] dark:text-[#F0F2F7]">
                                        {svc.price ? `৳${svc.price.toLocaleString()}` : 'Contact for Quote'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight",
                                            svc.is_active ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                                        )}>
                                            <div className={cn("w-1 h-1 rounded-full", svc.is_active ? "bg-emerald-500" : "bg-red-500")} />
                                            {svc.is_active ? 'Active' : 'Inactive'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-slate-500">{svc.sort_order}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEditModal(svc)} className="p-2 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 transition-all text-[#8B7355] dark:text-[#4D526A]">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(svc.id)} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all text-[#8B7355] dark:text-[#4D526A]">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} onPageChange={setCurrentPage} />
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="fixed inset-0 bg-[#0D0F14]/80 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#1A1E29] border border-white/5 w-full max-w-4xl rounded-3xl overflow-hidden relative z-10 shadow-2xl my-auto"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h3 className="font-sora font-extrabold text-xl text-white">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                                <button onClick={resetForm} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-white"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleUpsert} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:bg-white/[0.08] transition-all relative overflow-hidden group">
                                        {previewUrl ? (
                                            <div className="relative w-full h-48 flex items-center justify-center">
                                                <img src={previewUrl} alt="Preview" className="h-full object-contain rounded-xl" />
                                                <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center group">
                                                <div className="w-16 h-16 rounded-2xl bg-[#F5A623]/20 flex items-center justify-center text-[#F5A623] mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                    <Upload size={32} />
                                                </div>
                                                <p className="text-sm font-bold text-white">Click to Upload Service Showcase Image</p>
                                                <p className="text-[10px] text-[#4D526A] mt-1 uppercase tracking-widest font-bold">Recommended: 800x600px</p>
                                            </div>
                                        )}
                                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Service Title (EN)</label>
                                        <input required type="text" className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#F5A623]/50 text-white"
                                            value={formData.name_en} onChange={(e) => {
                                                const val = e.target.value;
                                                setFormData({ ...formData, name_en: val, slug: val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') });
                                            }} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Service Title (BN)</label>
                                        <input required type="text" className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#F5A623]/50 text-white"
                                            value={formData.name_bn} onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Base Price (BDT)</label>
                                            <input type="number" className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#F5A623]/50 text-white"
                                                placeholder="Nullable" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : null })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Priority Sort</label>
                                            <input type="number" className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#F5A623]/50 text-white"
                                                value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Access Slug</label>
                                        <input required type="text" className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#F5A623]/50 text-[#F5A623] font-mono"
                                            value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Description (EN)</label>
                                        <textarea className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#F5A623]/50 text-white min-h-[120px]"
                                            value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Description (BN)</label>
                                        <textarea className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#F5A623]/50 text-white min-h-[120px]"
                                            value={formData.description_bn} onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 py-4 border-t border-white/5">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                            className={cn("w-12 h-6 rounded-full transition-all relative", formData.is_active ? "bg-[#F5A623]" : "bg-[#4D526A]")}>
                                            <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", formData.is_active ? "right-1" : "left-1")} />
                                        </div>
                                        <span className="text-sm font-bold text-white">Public Availability</span>
                                    </label>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button type="button" onClick={resetForm} className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-sm font-bold text-[#8A8FA8] hover:bg-white/10 transition-all">Cancel</button>
                                    <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] text-sm font-bold transition-all shadow-lg shadow-[#F5A623]/20">
                                        {editingService ? 'Update Service Details' : 'Launch New Service'}
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
