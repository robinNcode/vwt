import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Calendar,
    X,
    Loader2,
    Truck,
    DollarSign,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '@/components/Pagination';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';

interface Purchase {
    id: number;
    amount: number;
    vendor: string;
    date: string;
    reference?: string;
}

const Purchases: React.FC = () => {
    const { t } = useTranslation();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);

    const [formData, setFormData] = useState({
        amount: 0,
        vendor: '',
        date: new Date().toISOString().split('T')[0],
        reference: ''
    });

    const fetchPurchases = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/accounting/purchases?search=${searchTerm}&page=${currentPage}`);
            if (res.data.success) {
                setPurchases(res.data.data || []);
                setTotalPages(1);
                setTotalItems(res.data.data?.length || 0);
            }
        } catch (error) {
            console.error('Failed to fetch purchases:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, [currentPage]);

    const handleUpsert = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingPurchase
            ? `/admin/accounting/purchases/${editingPurchase.id}`
            : '/admin/accounting/purchases';
        const method = editingPurchase ? 'put' : 'post';

        try {
            const res = await api({
                method,
                url,
                data: {
                    ...formData,
                    amount: Number(formData.amount),
                    date: new Date(formData.date).toISOString()
                }
            });
            if (res.data.success) {
                resetForm();
                fetchPurchases();
            }
        } catch (error) {
            console.error('Failed to save purchase:', error);
        }
    };

    const resetForm = () => {
        setIsModalOpen(false);
        setEditingPurchase(null);
        setFormData({
            amount: 0,
            vendor: '',
            date: new Date().toISOString().split('T')[0],
            reference: ''
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this purchase record?')) return;
        try {
            const res = await api.delete(`/admin/accounting/purchases/${id}`);
            if (res.data.success) fetchPurchases();
        } catch (error) {
            console.error('Failed to delete purchase:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-[#5C4D3C] dark:text-white">{t('accounting.purchases')}</h1>
                    <p className="text-sm text-[#8B7355] dark:text-[#8A8FA8] mt-1">Track inventory acquisitions and vendor payments.</p>
                </div>
                <button onClick={() => { setEditingPurchase(null); setIsModalOpen(true); }}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2">
                    <Plus size={18} /> New Purchase
                </button>
            </div>

            <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F3E6] dark:bg-[#13161E]/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Vendor</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Reference</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DCC4] dark:divide-white/5">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center"><Loader2 className="animate-spin mx-auto text-sky-500" /></td></tr>
                            ) : purchases.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No purchase records found.</td></tr>
                            ) : purchases.map((p) => (
                                <tr key={p.id} className="hover:bg-[#F8F3E6]/60 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{new Date(p.date).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500"><Truck size={14} /></div>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{p.vendor}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-mono italic">{p.reference || '---'}</td>
                                    <td className="px-6 py-4 font-mono font-bold text-sky-600 dark:text-sky-400">৳{p.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => {
                                                setEditingPurchase(p);
                                                setFormData({ amount: p.amount, vendor: p.vendor, date: p.date.split('T')[0], reference: p.reference || '' });
                                                setIsModalOpen(true);
                                            }} className="p-2 hover:bg-sky-500/10 text-sky-500 rounded-lg transition-colors"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="absolute inset-0 bg-[#0D0F14]/80 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-[#1A1E29] w-full max-w-lg rounded-2xl overflow-hidden relative z-10 shadow-2xl border border-slate-200 dark:border-white/5">
                            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <h3 className="font-sora font-extrabold text-xl text-slate-800 dark:text-white">{editingPurchase ? 'Edit Purchase' : 'Add Purchase Entry'}</h3>
                                <button onClick={resetForm} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleUpsert} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vendor Name</label>
                                    <input required type="text" className="w-full bg-slate-50 dark:bg-[#13161E] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm focus:border-sky-500/50 text-slate-900 dark:text-white"
                                        value={formData.vendor} onChange={(e) => setFormData({ ...formData, vendor: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount (BDT)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" size={16} />
                                            <input required type="number" step="0.01" className="w-full bg-slate-50 dark:bg-[#13161E] border border-slate-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-sky-500/50 text-slate-900 dark:text-white"
                                                value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</label>
                                        <input required type="date" className="w-full bg-slate-50 dark:bg-[#13161E] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm focus:border-sky-500/50 text-slate-900 dark:text-white"
                                            value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reference / PO Number</label>
                                    <input type="text" className="w-full bg-slate-50 dark:bg-[#13161E] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm focus:border-sky-500/50 text-slate-900 dark:text-white font-mono"
                                        value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} />
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={resetForm} className="flex-1 px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all">Cancel</button>
                                    <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold transition-all shadow-lg shadow-sky-500/20">
                                        {editingPurchase ? 'Update Purchase' : 'Record Purchase'}
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

export default Purchases;
