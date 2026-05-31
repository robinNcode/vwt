import React, { useState, useEffect } from 'react';
import {
    FileText, Plus, Printer, X, Save, Eye, EyeOff, Loader2, RefreshCw, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { TipTapEditor } from '@/components/TipTapEditor';
import PrintTemplate from '@/components/PrintTemplate';

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

interface Invoice {
    id: number;
    invoice_number: string;
    issued_at: string;
    template_config?: string;
    notes?: string;
    order_id?: number | null;
}

const Invoices: React.FC = () => {
    const { t } = useTranslation();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<Record<string, any>>({});

    const [items, setItems] = useState<InvoiceItem[]>([
        { id: '1', description: '<p>Standard Service</p>', quantity: 1, price: 0 }
    ]);
    const [clientData, setClientData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
    });
    const [formData, setFormData] = useState({
        invoice_number: '',
        due_date: new Date().toISOString().split('T')[0],
        notes: '<p><strong>Notes:</strong></p><p>Thank you for your business!</p>',
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [invRes, sRes] = await Promise.all([
                api.get('/admin/invoices'),
                api.get('/web-settings'),
            ]);
            if (invRes.data.success) {
                const list = invRes.data.data?.items ?? invRes.data.data;
                setInvoices(Array.isArray(list) ? list : []);
            }
            if (sRes.data.success && sRes.data.data) {
                setSettings(sRes.data.data);
            }
        } catch (e) {
            console.error('Fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const fetchNextNumber = async () => {
        try {
            const res = await api.get('/admin/invoices/next-number');
            if (res.data.success && res.data.data?.invoice_number) {
                setFormData(prev => ({ ...prev, invoice_number: res.data.data.invoice_number }));
            }
        } catch { /* fallback */ }
    };

    const handleOpenBuilder = () => {
        setClientData({ customer_name: '', customer_email: '', customer_phone: '', customer_address: '' });
        setFormData({
            invoice_number: '',
            due_date: new Date().toISOString().split('T')[0],
            notes: '<p><strong>Notes:</strong></p><p>Thank you for your business!</p>',
        });
        setItems([{ id: Date.now().toString(), description: '<p>Item 1</p>', quantity: 1, price: 0 }]);
        setShowPreview(false);
        fetchNextNumber();
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!clientData.customer_name) { toast.error('Client name is required'); return; }
        if (!formData.invoice_number) { toast.error('Invoice number is required'); return; }
        setSaving(true);
        try {
            const payload = {
                invoice_number: formData.invoice_number,
                due_date: formData.due_date,
                notes: formData.notes,
                template_config: JSON.stringify({ client: clientData, items }),
            };
            const res = await api.post('/admin/invoices', payload);
            if (res.data.success) {
                toast.success('Invoice saved!');
                setShowModal(false);
                fetchData();
            }
        } catch (e) {
            toast.error('Failed to save invoice');
        } finally {
            setSaving(false);
        }
    };

    const handleAddItem = () =>
        setItems(prev => [...prev, { id: Date.now().toString(), description: '<p></p>', quantity: 1, price: 0 }]);

    const handleRemoveItem = (id: string) =>
        setItems(prev => prev.filter(i => i.id !== id));

    const updateItem = (idx: number, field: keyof InvoiceItem, value: any) =>
        setItems(prev => { const n = [...prev]; (n[idx] as any)[field] = value; return n; });

    const total = () => items.reduce((s, i) => s + i.quantity * i.price, 0);

    const parseClientName = (inv: Invoice) => {
        try {
            if (inv.template_config) {
                const c = JSON.parse(inv.template_config);
                return c.client?.customer_name || 'Manual Entry';
            }
        } catch { }
        return inv.order_id ? `Order #${inv.order_id}` : 'Manual Entry';
    };

    /* ── Print helper ── */
    const handlePrint = () => {
        if (!showPreview) { setShowPreview(true); setTimeout(() => window.print(), 400); }
        else { window.print(); }
    };

    return (
        <>
            {/* ── List View ─────────────────────────────────────────── */}
            <div className="space-y-6 print:hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-sora text-2xl font-extrabold text-[#5C4D3C] dark:text-white">
                            {t('invoices.title')}
                        </h1>
                        <p className="text-sm text-[#8B7355] dark:text-[#8A8FA8] mt-1">{t('invoices.subtitle')}</p>
                    </div>
                    <button
                        id="btn-new-invoice"
                        onClick={handleOpenBuilder}
                        className="bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#F5A623]/20 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        <span>{t('invoices.create_manual')}</span>
                    </button>
                </div>

                {/* Table */}
                <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#F8F3E6] dark:bg-[#13161E]/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">{t('invoices.invoice_no')}</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">{t('invoices.client_orders')}</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">{t('invoices.issued_date')}</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider text-right">{t('invoices.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8DCC4] dark:divide-white/5">
                                {loading ? (
                                    <tr><td colSpan={4} className="px-6 py-12 text-center"><Loader2 className="animate-spin text-[#F5A623] mx-auto" size={32} /></td></tr>
                                ) : invoices.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-12 text-center text-[#8B7355] dark:text-[#4D526A]">{t('invoices.no_found')}</td></tr>
                                ) : invoices.map(inv => (
                                    <tr key={inv.id} className="hover:bg-[#F8F3E6]/60 dark:hover:bg-white/[0.02] transition-all">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center"><FileText size={16} /></div>
                                                <span className="text-sm font-bold text-[#5C4D3C] dark:text-[#F0F2F7] font-mono">{inv.invoice_number}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-[#5C4D3C] dark:text-[#F0F2F7]">{parseClientName(inv)}</td>
                                        <td className="px-6 py-4 text-xs text-[#8B7355] dark:text-[#8A8FA8]">{new Date(inv.issued_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 rounded-lg hover:bg-[#F5A623]/10 text-[#8B7355] hover:text-[#d48e1d] transition-all">
                                                <Printer size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Word-Doc Builder Modal ─────────────────────────────── */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[200] flex flex-col">
                        {/* Toolbar */}
                        <div className="print:hidden shrink-0 h-14 bg-white dark:bg-[#1A1E29] border-b border-[#E8DCC4] dark:border-white/5 flex items-center justify-between px-4 gap-3 shadow-md z-10">
                            <div className="flex items-center gap-3">
                                <FileText className="text-[#F5A623]" size={20} />
                                <span className="font-black text-[#2B3A55] dark:text-white text-base hidden sm:block">Invoice Builder</span>
                                <div className="flex gap-1 bg-gray-100 dark:bg-[#13161E] p-1 rounded-lg ml-2">
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className={cn('px-3 py-1 rounded-md text-xs font-bold transition-all', !showPreview ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500')}
                                    >Edit</button>
                                    <button
                                        onClick={() => setShowPreview(true)}
                                        className={cn('px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1', showPreview ? 'bg-[#F5A623] text-black' : 'text-gray-500')}
                                    ><Eye size={12} /> Preview</button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-[#2B3A55] hover:bg-[#1A2536] text-white px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 text-sm transition-all"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="bg-[#F5A623] hover:bg-[#d48e1d] text-black px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 text-sm transition-all"
                                >
                                    <Printer size={14} /> Print / PDF
                                </button>
                                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-red-500 transition-all">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-[#0D0F14] print:bg-white">
                            {/* ── EDIT MODE ── */}
                            {!showPreview && (
                                <motion.div
                                    key="edit"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="max-w-4xl mx-auto py-8 px-4 space-y-5 print:hidden"
                                >
                                    {/* Doc info */}
                                    <div className="bg-white dark:bg-[#1A1E29] rounded-2xl border border-[#E8DCC4] dark:border-white/5 p-5 shadow-sm">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wider">Document Info</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-[#5C4D3C] dark:text-slate-300 flex items-center gap-1">
                                                    Invoice # <button onClick={fetchNextNumber} title="Regenerate"><RefreshCw size={10} className="text-[#F5A623]" /></button>
                                                </label>
                                                <input
                                                    id="input-invoice-number"
                                                    type="text"
                                                    value={formData.invoice_number}
                                                    onChange={e => setFormData(p => ({ ...p, invoice_number: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-[#13161E] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 outline-none font-mono text-sm focus:border-[#F5A623]/50"
                                                    placeholder="Auto-generated"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-[#5C4D3C] dark:text-slate-300">Due Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.due_date}
                                                    onChange={e => setFormData(p => ({ ...p, due_date: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-[#13161E] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 outline-none text-sm focus:border-[#F5A623]/50"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-[#5C4D3C] dark:text-slate-300">Client Name *</label>
                                                <input
                                                    id="input-client-name"
                                                    type="text"
                                                    value={clientData.customer_name}
                                                    onChange={e => setClientData(p => ({ ...p, customer_name: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-[#13161E] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 outline-none text-sm focus:border-[#F5A623]/50"
                                                    placeholder="e.g. ACME Corp"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-[#5C4D3C] dark:text-slate-300">Client Phone</label>
                                                <input
                                                    type="text"
                                                    value={clientData.customer_phone}
                                                    onChange={e => setClientData(p => ({ ...p, customer_phone: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-[#13161E] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 outline-none text-sm focus:border-[#F5A623]/50"
                                                    placeholder="01XXXXXXXXX"
                                                />
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <label className="text-[11px] font-bold text-[#5C4D3C] dark:text-slate-300">Client Address</label>
                                                <input
                                                    type="text"
                                                    value={clientData.customer_address}
                                                    onChange={e => setClientData(p => ({ ...p, customer_address: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-[#13161E] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 outline-none text-sm focus:border-[#F5A623]/50"
                                                    placeholder="City, District"
                                                />
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <label className="text-[11px] font-bold text-[#5C4D3C] dark:text-slate-300">Client Email</label>
                                                <input
                                                    type="email"
                                                    value={clientData.customer_email}
                                                    onChange={e => setClientData(p => ({ ...p, customer_email: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-[#13161E] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 outline-none text-sm focus:border-[#F5A623]/50"
                                                    placeholder="client@example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="bg-white dark:bg-[#1A1E29] rounded-2xl border border-[#E8DCC4] dark:border-white/5 p-5 shadow-sm space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Line Items</p>
                                            <button
                                                id="btn-add-invoice-item"
                                                onClick={handleAddItem}
                                                className="text-xs font-bold bg-[#F5A623]/20 text-[#d48e1d] px-3 py-1.5 rounded-full hover:bg-[#F5A623]/30 transition-colors flex items-center gap-1"
                                            >
                                                <Plus size={12} /> Add Item
                                            </button>
                                        </div>

                                        {/* Column headers */}
                                        <div className="grid grid-cols-[1fr_90px_110px_90px_36px] gap-3 text-[10px] font-bold text-gray-400 uppercase px-1">
                                            <span>Description</span><span className="text-center">Qty</span><span className="text-right">Unit Price</span><span className="text-right">Total</span><span />
                                        </div>

                                        {items.map((item, idx) => (
                                            <div key={item.id} className="space-y-2 bg-gray-50 dark:bg-[#13161E]/60 rounded-xl p-3 border border-gray-100 dark:border-white/5">
                                                <TipTapEditor
                                                    value={item.description}
                                                    onChange={val => updateItem(idx, 'description', val)}
                                                />
                                                <div className="grid grid-cols-[1fr_90px_110px_90px_36px] gap-3 items-center">
                                                    <div />
                                                    <input
                                                        type="number" min="1"
                                                        value={item.quantity}
                                                        onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                                                        className="w-full bg-white dark:bg-[#1A1E29] border border-gray-200 dark:border-white/5 rounded-lg px-2 py-1.5 outline-none text-sm text-center"
                                                    />
                                                    <input
                                                        type="number" min="0" step="0.01"
                                                        value={item.price}
                                                        onChange={e => updateItem(idx, 'price', parseFloat(e.target.value) || 0)}
                                                        className="w-full bg-white dark:bg-[#1A1E29] border border-gray-200 dark:border-white/5 rounded-lg px-2 py-1.5 outline-none text-sm text-right"
                                                    />
                                                    <div className="text-right text-sm font-bold text-[#F5A623]">
                                                        {(item.quantity * item.price).toLocaleString()}
                                                    </div>
                                                    <button onClick={() => handleRemoveItem(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-300 hover:text-red-500 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-white/5">
                                            <div className="text-lg font-black text-[#2B3A55] dark:text-white">
                                                Total: <span className="text-[#F5A623] ml-3">৳ {total().toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="bg-white dark:bg-[#1A1E29] rounded-2xl border border-[#E8DCC4] dark:border-white/5 p-5 shadow-sm space-y-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Notes / Terms & Conditions</p>
                                        <TipTapEditor
                                            value={formData.notes}
                                            onChange={val => setFormData(p => ({ ...p, notes: val }))}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* ── PREVIEW / PRINT MODE ── */}
                            {showPreview && (
                                <div className="py-8 px-4 print:p-0 print:py-0">
                                    <PrintTemplate
                                        type="Invoice"
                                        documentNumber={formData.invoice_number}
                                        date={formData.due_date || new Date().toISOString()}
                                        clientName={clientData.customer_name || '—'}
                                        clientAddress={clientData.customer_address}
                                        clientEmail={clientData.customer_email}
                                        clientPhone={clientData.customer_phone}
                                        items={items.map(i => ({ ...i, total: i.quantity * i.price }))}
                                        subtotal={total()}
                                        discount={0}
                                        totalAmount={total()}
                                        notes={formData.notes}
                                        settings={settings}
                                        inWords={`${total().toLocaleString()} Taka Only`}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Print-only: render template outside modal so window.print() captures it */}
            {showModal && showPreview && (
                <div className="hidden print:block">
                    <PrintTemplate
                        type="Invoice"
                        documentNumber={formData.invoice_number}
                        date={formData.due_date || new Date().toISOString()}
                        clientName={clientData.customer_name || '—'}
                        clientAddress={clientData.customer_address}
                        clientEmail={clientData.customer_email}
                        clientPhone={clientData.customer_phone}
                        items={items.map(i => ({ ...i, total: i.quantity * i.price }))}
                        subtotal={total()}
                        discount={0}
                        totalAmount={total()}
                        notes={formData.notes}
                        settings={settings}
                        inWords={`${total().toLocaleString()} Taka Only`}
                    />
                </div>
            )}
        </>
    );
};

export default Invoices;
