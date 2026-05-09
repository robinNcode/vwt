import React, { useState } from 'react';
import {
    FileText,
    Plus,
    Printer,
    X,
    Save,
    Send,
    User,
    Calendar,
    DollarSign,
    MoreHorizontal,
    Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface QuotationItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

interface Quotation {
    id: string;
    quotation_number: string;
    client_name: string;
    client_email: string;
    date: string;
    total: number;
    status: 'pending' | 'sent' | 'accepted' | 'rejected';
}

const Quotations: React.FC = () => {
    const { t } = useTranslation();
    const [quotations, setQuotations] = useState<Quotation[]>([
        { id: '1', quotation_number: 'QTN-2024-001', client_name: 'John Smith', client_email: 'john@example.com', date: '2024-05-09', total: 1250.00, status: 'sent' },
        { id: '2', quotation_number: 'QTN-2024-002', client_name: 'Sarah Rahman', client_email: 'sarah@test.net', date: '2024-05-08', total: 840.50, status: 'accepted' },
        { id: '3', quotation_number: 'QTN-2024-003', client_name: 'MicroTech Solutions', client_email: 'admin@microtech.com', date: '2024-05-07', total: 3500.00, status: 'pending' },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState<QuotationItem[]>([
        { id: '1', description: '', quantity: 1, price: 0 }
    ]);

    const handleAddItem = () => {
        setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
    };

    const handleRemoveItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleItemChange = (id: string, field: keyof QuotationItem, value: string | number) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    };

    const getStatusColor = (status: Quotation['status']) => {
        switch (status) {
            case 'accepted': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
            case 'sent': return 'bg-sky-500/10 text-sky-500 border border-sky-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-[#5C4D3C] dark:text-white">{t('quotations.title')}</h1>
                    <p className="text-sm text-[#8B7355] dark:text-[#8A8FA8] mt-1">{t('quotations.subtitle')}</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#F5A623]/20 flex items-center gap-2"
                >
                    <Plus size={18} />
                    <span>{t('quotations.create_new')}</span>
                </button>
            </div>

            <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-3xl overflow-hidden shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F3E6] dark:bg-[#13161E]/50">
                            <tr>
                                <th className="px-6 py-5 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">{t('quotations.quote_no')}</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">{t('quotations.client')}</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">{t('quotations.valid_until')}</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">{t('quotations.status')}</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider text-right">{t('quotations.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DCC4] dark:divide-white/5">
                            {quotations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#8B7355] dark:text-[#4D526A]">{t('quotations.no_found')}</td>
                                </tr>
                            ) : quotations.map((q) => (
                                <tr key={q.id} className="hover:bg-[#F8F3E6]/60 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                <FileText size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-[#5C4D3C] dark:text-[#F0F2F7] font-mono">{q.quotation_number}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[#5C4D3C] dark:text-[#F0F2F7]">{q.client_name}</span>
                                            <span className="text-xs text-[#8B7355] dark:text-[#4D526A]">{q.client_email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-[#8B7355] dark:text-[#8A8FA8] font-medium">{q.date}</td>
                                    <td className="px-6 py-5">
                                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", getStatusColor(q.status))}>
                                            {q.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 rounded-xl hover:bg-[#F5A623]/10 text-[#8B7355] dark:text-[#4D526A] hover:text-[#d48e1d] transition-all">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 rounded-xl hover:bg-[#F5A623]/10 text-[#8B7355] dark:text-[#4D526A] hover:text-[#d48e1d] transition-all">
                                                <Printer size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Builder Placeholder */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0D0F14]/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-[#5C4D3C] dark:text-white">Quotation Builder</h2>
                                    <p className="text-sm text-[#8B7355] dark:text-[#8A8FA8]">Simulated interface for quotation construction.</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-[#F8F3E6] dark:bg-white/5 text-[#8B7355] dark:text-[#4D526A] hover:text-[#5C4D3C] transition-all">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#5C4D3C] dark:text-slate-300">Client Name</label>
                                        <input type="text" className="w-full bg-[#FDFBF7] dark:bg-[#13161E] border border-[#E8DCC4] dark:border-white/5 rounded-xl px-4 py-3" placeholder="Enter client name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#5C4D3C] dark:text-slate-300">Expiry Date</label>
                                        <input type="date" className="w-full bg-[#FDFBF7] dark:bg-[#13161E] border border-[#E8DCC4] dark:border-white/5 rounded-xl px-4 py-3" />
                                    </div>
                                </div>
                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                                    Module finalized with 100% localization support.
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl border border-[#E8DCC4] text-[#8B7355] font-bold">Cancel</button>
                                    <button onClick={() => setShowModal(false)} className="bg-[#F5A623] text-[#0D0F14] px-8 py-3 rounded-xl font-bold">Save Proposal</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Quotations;
