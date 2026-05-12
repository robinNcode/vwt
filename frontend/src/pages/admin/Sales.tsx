import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    TrendingUp,
    Calendar,
    X,
    Loader2,
    FileText,
    DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '@/components/Pagination';
import { useTranslation } from 'react-i18next';

interface Sale {
    id: number;
    amount: number;
    date: string;
    reference?: string;
}

const Sales: React.FC = () => {
    const { t } = useTranslation();
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSale, setEditingSale] = useState<Sale | null>(null);

    const [formData, setFormData] = useState({
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        reference: ''
    });

    const fetchSales = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8083/api/v1/accounting/sales?search=${searchTerm}&page=${currentPage}`);
            const data = await res.json();
            if (data.success) {
                setSales(data.data || []);
                setTotalPages(1); // Backend might not support paging yet for this
                setTotalItems(data.data?.length || 0);
            }
        } catch (error) {
            console.error('Failed to fetch sales:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, [currentPage]);

    const handleUpsert = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingSale
            ? `http://localhost:8083/api/v1/accounting/sales/${editingSale.id}`
            : 'http://localhost:8083/api/v1/accounting/sales';
        const method = editingSale ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: Number(formData.amount),
                    date: new Date(formData.date).toISOString()
                })
            });
            const result = await res.json();
            if (result.success) {
                setIsModalOpen(false);
                setEditingSale(null);
                setFormData({
                    amount: 0,
                    date: new Date().toISOString().split('T')[0],
                    reference: ''
                });
                fetchSales();
            }
        } catch (error) {
            console.error('Failed to save sale:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this record?')) return;
        try {
            const res = await fetch(`http://localhost:8083/api/v1/accounting/sales/${id}`, {
                method: 'DELETE'
            });
            if ((await res.json()).success) fetchSales();
        } catch (error) {
            console.error('Failed to delete sale:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-[#5C4D3C] dark:text-white">{t('accounting.sales')}</h1>
                    <p className="text-sm text-[#8B7355] dark:text-[#8A8FA8] mt-1">Manage and track your general sales revenue.</p>
                </div>
                <button
                    onClick={() => { setEditingSale(null); setIsModalOpen(true); }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                    <Plus size={18} />
                    New Sale
                </button>
            </div>

            <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F3E6] dark:bg-[#13161E]/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Reference</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DCC4] dark:divide-white/5">
                            {loading ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" /></td></tr>
                            ) : sales.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No sale records found.</td></tr>
                            ) : sales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-[#F8F3E6]/60 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                <Calendar size={14} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{new Date(sale.date).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono italic">{sale.reference || 'N/A'}</td>
                                    <td className="px-6 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">৳{sale.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => {
                                                setEditingSale(sale);
                                                setFormData({ amount: sale.amount, date: sale.date.split('T')[0], reference: sale.reference || '' });
                                                setIsModalOpen(true);
                                            }} className="p-2 hover:bg-emerald-500/10 text-emerald-500 rounded-lg transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(sale.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#0D0F14]/80 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-[#1A1E29] w-full max-w-lg rounded-2xl overflow-hidden relative z-10 shadow-2xl border border-slate-200 dark:border-white/5">
                            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <h3 className="font-sora font-extrabold text-xl text-slate-800 dark:text-white">{editingSale ? 'Edit Sale' : 'Add Sale Record'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleUpsert} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount (BDT)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                                        <input required type="number" step="0.01" className="w-full bg-slate-50 dark:bg-[#13161E] border border-slate-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 text-slate-900 dark:text-white"
                                            value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction Date</label>
                                    <input required type="date" className="w-full bg-slate-50 dark:bg-[#13161E] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 text-slate-900 dark:text-white"
                                        value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reference / Note</label>
                                    <input type="text" placeholder="e.g. INV-2024-001" className="w-full bg-slate-50 dark:bg-[#13161E] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 text-slate-900 dark:text-white font-mono"
                                        value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} />
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all">Cancel</button>
                                    <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-all shadow-lg shadow-emerald-500/20">
                                        {editingSale ? 'Update Entry' : 'Save Record'}
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

export default Sales;
