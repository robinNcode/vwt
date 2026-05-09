import React, { useState } from 'react';
import {
    FileText,
    Plus,
    Search,
    Printer,
    Download,
    X,
    Save,
    Send,
    User,
    Calendar,
    DollarSign,
    MoreHorizontal,
    Trash2,
    Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
            case 'accepted': return 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400';
            case 'sent': return 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400';
            case 'rejected': return 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400';
            default: return 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-[#8A8FA8]';
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-[#5C4D3C] dark:text-white">Quotations & Proposals</h1>
                    <p className="text-sm text-[#8B7355] dark:text-[#8A8FA8] mt-1">Generate and manage business estimates for potential clients.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center justify-center gap-2"
                >
                    <Plus size={18} />
                    <span>Generate New Quotation</span>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Quotations', value: '24', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Accepted', value: '12', icon: Save, color: 'text-green-500', bg: 'bg-green-500/10' },
                    { label: 'Pending Response', value: '8', icon: Calendar, color: 'text-[#F5A623]', bg: 'bg-[#F5A623]/10' },
                    { label: 'Conversion Rate', value: '50%', icon: Send, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 p-6 rounded-2xl shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-extrabold text-[#5C4D3C] dark:text-white">{stat.value}</h3>
                            </div>
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 p-4 rounded-2xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355] dark:text-[#4D526A]" size={18} />
                    <input
                        type="text"
                        placeholder="Search quotations, clients..."
                        className="w-full bg-white dark:bg-[#0D0F14] border-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#5C4D3C] dark:text-white focus:ring-1 focus:ring-[#F5A623] transition-all"
                    />
                </div>
                <button className="px-4 py-2.5 bg-white dark:bg-[#0D0F14] border border-[#E8DCC4] dark:border-white/5 rounded-xl text-sm font-bold text-[#8B7355] dark:text-[#8A8FA8] hover:bg-[#F8F3E6] dark:hover:bg-white/5 transition-all">
                    Filter
                </button>
            </div>

            {/* Quotations List */}
            <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-3xl overflow-hidden shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F3E6] dark:bg-[#13161E]/50">
                            <tr>
                                <th className="px-6 py-5 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Number</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Client Info</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Date</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DCC4] dark:divide-white/5">
                            {quotations.map((q) => (
                                <tr key={q.id} className="hover:bg-[#F8F3E6]/60 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                <FileText size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-[#5C4D3C] dark:text-[#F0F2F7]">{q.quotation_number}</span>
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
                                        <span className="text-sm font-extrabold text-[#5C4D3C] dark:text-[#F0F2F7]">${q.total.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", getStatusColor(q.status))}>
                                            {q.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 rounded-xl hover:bg-white dark:hover:bg-white/5 text-[#8B7355] dark:text-[#4D526A] hover:text-blue-500 dark:hover:text-blue-400 transition-all">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 rounded-xl hover:bg-white dark:hover:bg-white/5 text-[#8B7355] dark:text-[#4D526A] hover:text-green-500 dark:hover:text-[#F5A623] transition-all">
                                                <Printer size={18} />
                                            </button>
                                            <button className="p-2 rounded-xl hover:bg-white dark:hover:bg-white/5 text-[#8B7355] dark:text-[#4D526A] hover:text-red-500 transition-all">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal - Quotation Builder */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">New Quotation Builder</h2>
                                    <p className="text-sm text-slate-500 dark:text-[#8A8FA8] mt-1 font-medium">Create a professional estimate and send it instantly.</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-[#4D526A] hover:text-slate-900 dark:text-white transition-all hover:rotate-90">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                {/* Left Side - Client Info & Terms */}
                                <div className="lg:col-span-1 space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-slate-400 dark:text-[#4D526A] uppercase tracking-widest flex items-center gap-2">
                                            <User size={14} /> Client Information
                                        </h3>
                                        <div className="space-y-4">
                                            <input type="text" placeholder="Full Name" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#F5A623]/20 focus:border-[#F5A623] transition-all" />
                                            <input type="email" placeholder="Email Address" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#F5A623]/20 focus:border-[#F5A623] transition-all" />
                                            <textarea placeholder="Client Address" rows={3} className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#F5A623]/20 focus:border-[#F5A623] transition-all resize-none"></textarea>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-slate-400 dark:text-[#4D526A] uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={14} /> Valid Until
                                        </h3>
                                        <input type="date" className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#F5A623]/20 focus:border-[#F5A623] transition-all" />
                                    </div>
                                </div>

                                {/* Right Side - Items List */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-bold text-slate-400 dark:text-[#4D526A] uppercase tracking-widest flex items-center gap-2">
                                                <DollarSign size={14} /> Service Items
                                            </h3>
                                            <button
                                                onClick={handleAddItem}
                                                className="text-xs font-bold text-[#F5A623] hover:underline"
                                            >
                                                + Add New Line
                                            </button>
                                        </div>

                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {items.map((item) => (
                                                <motion.div
                                                    layout
                                                    key={item.id}
                                                    className="p-6 bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-3xl relative group"
                                                >
                                                    <div className="grid grid-cols-12 gap-5">
                                                        <div className="col-span-7">
                                                            <label className="text-[10px] font-bold text-slate-400 dark:text-[#4D526A] uppercase mb-1 block ml-1">Description</label>
                                                            <input
                                                                type="text"
                                                                value={item.description}
                                                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                                placeholder="e.g. Electrical Installation"
                                                                className="w-full bg-white dark:bg-[#1A1E29] border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white"
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <label className="text-[10px] font-bold text-slate-400 dark:text-[#4D526A] uppercase mb-1 block ml-1">Qty</label>
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                                className="w-full bg-white dark:bg-[#1A1E29] border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white"
                                                            />
                                                        </div>
                                                        <div className="col-span-3">
                                                            <label className="text-[10px] font-bold text-slate-400 dark:text-[#4D526A] uppercase mb-1 block ml-1">Price</label>
                                                            <input
                                                                type="number"
                                                                value={item.price}
                                                                onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                                                                className="w-full bg-white dark:bg-[#1A1E29] border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white"
                                                            />
                                                        </div>
                                                    </div>
                                                    {items.length > 1 && (
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/10"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Summary & Actions */}
                                    <div className="p-8 bg-[#F5A623]/5 border border-[#F5A623]/20 rounded-3xl">
                                        <div className="flex items-center justify-between mb-8">
                                            <span className="text-xl font-bold text-slate-900 dark:text-white">Estimated Total</span>
                                            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                                ${calculateTotal().toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex gap-4">
                                            <button className="flex-1 px-8 py-5 rounded-2xl bg-white dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 shadow-sm">
                                                <Printer size={18} />
                                                <span>Print PDF</span>
                                            </button>
                                            <button className="flex-2 px-8 py-5 rounded-2xl bg-[#F5A623] text-[#0D0F14] font-bold hover:bg-[#D48E1D] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F5A623]/20">
                                                <Send size={18} />
                                                <span>Finalize & Send</span>
                                            </button>
                                        </div>
                                    </div>
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
