import React, { useState, useEffect } from 'react';
import {
    FileText,
    Download,
    Search,
    Printer,
    Plus,
    Loader2,
    X,
    Save
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Invoice {
    id: number;
    order_id: number | null;
    invoice_number: string;
    client_name?: string;
    total_amount?: number;
    status?: string;
    issued_at: string;
}

const Invoices: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [showManualModal, setShowManualModal] = useState(false);
    const [newInvoice, setNewInvoice] = useState({
        client_name: '',
        invoice_number: `INV-${Date.now().toString().slice(-6)}`,
        total_amount: 0,
        items: [{ description: '', quantity: 1, price: 0 }]
    });

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8083/api/v1/invoices`);
            const data = await res.json();
            if (data.success) {
                setInvoices(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleAddItem = () => {
        setNewInvoice({
            ...newInvoice,
            items: [...newInvoice.items, { description: '', quantity: 1, price: 0 }]
        });
    };

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        // Typically would call API here
        alert('Manual Invoice functionality simulated. In a real app, this would hit the backend.');
        setShowManualModal(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-slate-900 dark:text-white">Finance & Invoices</h1>
                    <p className="text-sm text-slate-500 dark:text-[#8A8FA8] mt-1">Review transaction documents and billing history.</p>
                </div>
                <button
                    onClick={() => setShowManualModal(true)}
                    className="btn-primary flex items-center justify-center gap-2"
                >
                    <Plus size={18} />
                    <span>Create Manual Invoice</span>
                </button>
            </div>

            <div className="bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl dark:shadow-black/20 transition-all">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-[#13161E]/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-[#4D526A] uppercase tracking-wider">Invoice No.</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-[#4D526A] uppercase tracking-wider">Order ID / Client</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-[#4D526A] uppercase tracking-wider">Issued Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-[#4D526A] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <Loader2 className="animate-spin text-blue-600 dark:text-[#F5A623] mx-auto" size={32} />
                                    </td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 dark:text-[#4D526A]">No invoices found.</td>
                                </tr>
                            ) : invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                <FileText size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-[#F0F2F7]">{invoice.invoice_number}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-[#8A8FA8]">
                                        {invoice.order_id ? `#ORD-${invoice.order_id}` : invoice.client_name || 'Manual Entry'}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-[#8A8FA8]">
                                        {new Date(invoice.issued_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-[#4D526A] hover:text-slate-900 dark:hover:text-[#F0F2F7] transition-all">
                                                <Download size={16} />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-[#4D526A] hover:text-slate-900 dark:hover:text-[#F0F2F7] transition-all">
                                                <Printer size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manual Invoice Modal */}
            {showManualModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowManualModal(false)} />
                    <div className="relative bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create Manual Invoice</h2>
                                <p className="text-sm text-slate-500 dark:text-[#8A8FA8]">Manually generate an invoice for offline orders.</p>
                            </div>
                            <button onClick={() => setShowManualModal(false)} className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-[#4D526A] hover:text-slate-900 dark:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateInvoice} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Invoice Number</label>
                                    <input
                                        type="text"
                                        value={newInvoice.invoice_number}
                                        readOnly
                                        className="w-full bg-slate-100 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Client Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter client name"
                                        className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#F5A623] outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 dark:text-white">Invoice Items</h3>
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="text-xs font-bold text-blue-600 dark:text-[#F5A623] hover:underline"
                                    >
                                        + Add Item
                                    </button>
                                </div>

                                {newInvoice.items.map((item, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-4">
                                        <div className="col-span-6">
                                            <input
                                                type="text"
                                                placeholder="Description"
                                                className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#F5A623] outline-none"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                placeholder="Qty"
                                                className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#F5A623] outline-none"
                                            />
                                        </div>
                                        <div className="col-span-4">
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#F5A623] outline-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowManualModal(false)}
                                    className="px-6 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-[#8A8FA8] font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 dark:bg-[#F5A623] text-white dark:text-[#0D0F14] px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-[#D48E1D] transition-all"
                                >
                                    <Save size={18} />
                                    <span>Save Invoice</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invoices;
