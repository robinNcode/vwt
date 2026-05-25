import React, { useState, useEffect } from 'react';
import {
    FileText,
    Download,
    Printer,
    Plus,
    Loader2,
    X,
    Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Pagination from '@/components/Pagination';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

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
    const { t } = useTranslation();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showManualModal, setShowManualModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [saving, setSaving] = useState(false);

    const [newInvoice, setNewInvoice] = useState({
        client_name: '',
        client_address: '',
        invoice_number: `INV-${Date.now().toString().slice(-6)}`,
        due_date: '',
        notes: '',
        items: [{ description: '', quantity: 1, price: 0 }]
    });

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/invoices?search=${searchTerm}&page=${currentPage}`);
            if (res.data.success) {
                if (res.data.data.items) {
                    setInvoices(res.data.data.items);
                    setTotalPages(res.data.data.totalPages || 1);
                    setTotalItems(res.data.data.totalItems || 0);
                } else {
                    setInvoices(res.data.data);
                    setTotalPages(1);
                    setTotalItems(res.data.data.length);
                }
            }
        } catch (error) {
            console.error('Failed to fetch invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchInvoices();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, currentPage]);

    const handleAddItem = () => {
        setNewInvoice({
            ...newInvoice,
            items: [...newInvoice.items, { description: '', quantity: 1, price: 0 }]
        });
    };

    const handleItemChange = (idx: number, field: string, value: any) => {
        const newItems = [...newInvoice.items];
        newItems[idx] = { ...newItems[idx], [field]: value };
        setNewInvoice({ ...newInvoice, items: newItems });
    };

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // In a real scenario, we might need to create a simplified Order first 
            // if the backend strictly requires order_id. 
            // For now, we'll try to send the data.
            const payload = {
                order_id: 1, // Placeholder if required
                invoice_number: newInvoice.invoice_number,
                due_date: newInvoice.due_date,
                notes: newInvoice.notes
            };
            const res = await api.post('/admin/invoices', payload);
            if (res.data.success) {
                toast.success('Invoice created successfully');
                setShowManualModal(false);
                fetchInvoices();
            }
        } catch (error) {
            console.error('Create failed:', error);
            toast.error('Failed to create invoice');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-[#5C4D3C] dark:text-white">{t('invoices.title')}</h1>
                    <p className="text-sm text-[#8B7355] dark:text-[#8A8FA8] mt-1">{t('invoices.subtitle')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('admin_nav.search_placeholder')}
                            className="bg-white dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#F5A623]/50 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowManualModal(true)}
                        className="bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#F5A623]/20 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        <span>{t('invoices.create_manual')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F3E6] dark:bg-[#13161E]/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">{t('invoices.invoice_no')}</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">{t('invoices.client_orders')}</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">{t('invoices.issued_date')}</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">{t('invoices.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DCC4] dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <Loader2 className="animate-spin text-[#F5A623] mx-auto" size={32} />
                                    </td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[#8B7355] dark:text-[#4D526A]">{t('invoices.no_found')}</td>
                                </tr>
                            ) : invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-[#F8F3E6]/60 dark:hover:bg-white/[0.02] transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#F5A623]/10 text-[#d48e1d] dark:text-[#F5A623] flex items-center justify-center">
                                                <FileText size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-[#5C4D3C] dark:text-[#F0F2F7] font-mono">{invoice.invoice_number}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#8B7355] dark:text-[#8A8FA8] font-medium">
                                        {invoice.order_id ? `#ORD-${invoice.order_id}` : invoice.client_name || 'Manual Entry'}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-[#8B7355] dark:text-[#8A8FA8]">
                                        {new Date(invoice.issued_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 rounded-lg hover:bg-white dark:hover:bg-white/5 text-[#8B7355] dark:text-[#4D526A] hover:text-[#d48e1d] dark:hover:text-[#F5A623] transition-all">
                                                <Download size={16} />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-white dark:hover:bg-white/5 text-[#8B7355] dark:text-[#4D526A] hover:text-[#d48e1d] dark:hover:text-[#F5A623] transition-all">
                                                <Printer size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-[#E8DCC4] dark:border-white/5">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {/* Manual Invoice Modal */}
            {showManualModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0D0F14]/60 backdrop-blur-sm" onClick={() => setShowManualModal(false)} />
                    <div className="relative bg-white dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-extrabold text-[#5C4D3C] dark:text-white">{t('invoices.modal_title')}</h2>
                                <p className="text-sm text-[#8B7355] dark:text-[#8A8FA8]">{t('invoices.modal_desc')}</p>
                            </div>
                            <button onClick={() => setShowManualModal(false)} className="p-2 rounded-xl bg-[#F8F3E6] dark:bg-white/5 text-[#8B7355] dark:text-[#4D526A] hover:text-[#5C4D3C] dark:hover:text-[#F0F2F7]">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateInvoice} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#5C4D3C] dark:text-slate-300">{t('invoices.invoice_no')}</label>
                                    <input
                                        type="text"
                                        value={newInvoice.invoice_number}
                                        readOnly
                                        className="w-full bg-[#F8F3E6] dark:bg-[#13161E] border border-[#E8DCC4] dark:border-white/5 rounded-xl px-4 py-3 text-[#8B7355] cursor-not-allowed outline-none font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#5C4D3C] dark:text-slate-300">Due Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-[#FDFBF7] dark:bg-[#13161E] border border-[#E8DCC4] dark:border-white/5 rounded-xl px-4 py-3 text-[#5C4D3C] dark:text-white outline-none"
                                        value={newInvoice.due_date}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#5C4D3C] dark:text-slate-300">{t('invoices.client_name')}</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter client name"
                                        className="w-full bg-[#FDFBF7] dark:bg-[#13161E] border border-[#E8DCC4] dark:border-white/5 rounded-xl px-4 py-3 text-[#5C4D3C] dark:text-white outline-none"
                                        value={newInvoice.client_name}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, client_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#5C4D3C] dark:text-slate-300">Client Address</label>
                                    <input
                                        type="text"
                                        placeholder="Enter client address"
                                        className="w-full bg-[#FDFBF7] dark:bg-[#13161E] border border-[#E8DCC4] dark:border-white/5 rounded-xl px-4 py-3 text-[#5C4D3C] dark:text-white outline-none"
                                        value={newInvoice.client_address}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, client_address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-[#5C4D3C] dark:text-white">{t('invoices.items_title')}</h3>
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="text-xs font-bold text-[#d48e1d] dark:text-[#F5A623] hover:underline"
                                    >
                                        {t('invoices.add_item')}
                                    </button>
                                </div>

                                {newInvoice.items.map((item, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-4">
                                        <div className="col-span-6">
                                            <input
                                                type="text"
                                                placeholder={t('invoices.desc')}
                                                className="w-full bg-[#FDFBF7] dark:bg-[#13161E] border border-[#E8DCC4] dark:border-white/5 rounded-xl px-4 py-3 text-sm text-[#5C4D3C] dark:text-white outline-none"
                                                value={item.description}
                                                onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                placeholder={t('invoices.qty')}
                                                className="w-full bg-[#FDFBF7] dark:bg-[#13161E] border border-[#E8DCC4] dark:border-white/5 rounded-xl px-4 py-3 text-sm text-[#5C4D3C] dark:text-white outline-none"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-span-4">
                                            <input
                                                type="number"
                                                placeholder={t('invoices.price')}
                                                className="w-full bg-[#FDFBF7] dark:bg-[#13161E] border border-[#E8DCC4] dark:border-white/5 rounded-xl px-4 py-3 text-sm text-[#5C4D3C] dark:text-white outline-none"
                                                value={item.price}
                                                onChange={(e) => handleItemChange(idx, 'price', parseFloat(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#5C4D3C] dark:text-slate-300">Notes / Terms</label>
                                <textarea
                                    className="w-full bg-[#FDFBF7] dark:bg-[#13161E] border border-[#E8DCC4] dark:border-white/5 rounded-xl px-4 py-3 text-sm text-[#5C4D3C] dark:text-white min-h-[80px] outline-none"
                                    value={newInvoice.notes}
                                    onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                                />
                            </div>

                            <div className="mt-8 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowManualModal(false)}
                                    className="px-6 py-3 rounded-xl border border-[#E8DCC4] dark:border-white/10 text-[#8B7355] dark:text-[#8A8FA8] font-bold hover:bg-[#F8F3E6] dark:hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#F5A623]/20 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    <span>{t('invoices.save')}</span>
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
