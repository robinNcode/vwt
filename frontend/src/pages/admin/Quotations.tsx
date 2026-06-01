import React, { useState, useEffect } from 'react';
import {
    FileText, Plus, Printer, X, Save, Eye, Loader2, RefreshCw, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { TipTapEditor } from '@/components/TipTapEditor';
import PrintTemplate from '@/components/PrintTemplate';

interface QItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

interface Quotation {
    id: number;
    quotation_number: string;
    customer_name?: string;
    customer_email?: string;
    status: string;
    created_at: string;
    items?: any[];
}

const Quotations: React.FC = () => {
    const { t } = useTranslation();
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<Record<string, any>>({});

    const [items, setItems] = useState<QItem[]>([
        { id: '1', description: '<p>Item 1</p>', quantity: 1, price: 0 }
    ]);
    const [formData, setFormData] = useState({
        quotation_number: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        expires_at: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        notes: '<p><strong>Terms &amp; Conditions:</strong></p><ul><li>Valid for 15 days from date of issue.</li><li>50% advance payment required before commencement.</li><li>Price excludes VAT &amp; AIT unless stated.</li></ul>',
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [qRes, sRes] = await Promise.all([
                api.get('/admin/quotations'),
                api.get('/web-settings'),
            ]);
            if (qRes.data.success) {
                const list = qRes.data.data?.items ?? qRes.data.data;
                setQuotations(Array.isArray(list) ? list : []);
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
            const res = await api.get('/admin/quotations/next-number');
            if (res.data.success && res.data.data?.quotation_number) {
                setFormData(prev => ({ ...prev, quotation_number: res.data.data.quotation_number }));
            }
        } catch { /* fallback */ }
    };

    const handleOpenBuilder = () => {
        setFormData({
            quotation_number: '',
            customer_name: '',
            customer_email: '',
            customer_phone: '',
            customer_address: '',
            expires_at: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
            notes: '<p><strong>Terms &amp; Conditions:</strong></p><ul><li>Valid for 15 days from date of issue.</li><li>50% advance payment required before commencement.</li><li>Price excludes VAT &amp; AIT unless stated.</li></ul>',
        });
        setItems([{ id: Date.now().toString(), description: '<p>Item 1</p>', quantity: 1, price: 0 }]);
        setShowPreview(false);
        fetchNextNumber();
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.customer_name) { toast.error('Client name is required'); return; }
        if (!formData.quotation_number) { toast.error('Quotation number is required'); return; }
        setSaving(true);
        try {
            const payload = {
                quotation_number: formData.quotation_number,
                customer_name: formData.customer_name,
                customer_email: formData.customer_email || undefined,
                customer_phone: formData.customer_phone || undefined,
                customer_address: formData.customer_address || undefined,
                expires_at: formData.expires_at || undefined,
                notes: formData.notes,
                items: items.map(i => ({
                    product_name_en: i.description,
                    sku: 'MANUAL',
                    unit_price: i.price,
                    quantity: i.quantity,
                })),
            };
            const res = await api.post('/admin/quotations', payload);
            if (res.data.success) {
                toast.success('Quotation saved!');
                setShowModal(false);
                fetchData();
            }
        } catch (e) {
            toast.error('Failed to save quotation');
        } finally {
            setSaving(false);
        }
    };

    const handleAddItem = () =>
        setItems(prev => [...prev, { id: Date.now().toString(), description: '<p></p>', quantity: 1, price: 0 }]);

    const handleRemoveItem = (id: string) =>
        setItems(prev => prev.filter(i => i.id !== id));

    const updateItem = (idx: number, field: keyof QItem, value: any) =>
        setItems(prev => { const n = [...prev]; (n[idx] as any)[field] = value; return n; });

    const total = () => items.reduce((s, i) => s + i.quantity * i.price, 0);

    const handlePrint = () => {
        if (!showPreview) { setShowPreview(true); setTimeout(() => window.print(), 400); }
        else { window.print(); }
    };

    const statusColor = (s: string) => {
        switch (s?.toLowerCase()) {
            case 'accepted': return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
            case 'sent': return 'bg-sky-500/10 text-sky-600 border border-sky-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
        }
    };

    return (
        <>
            {/* ── List View ─────────────────────────────────────────── */}
            <div className="space-y-6 print:hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-sora text-2xl font-extrabold text-[#5C4D3C] dark:text-white">
                            {t('quotations.title')}
                        </h1>
                        <p className="text-sm text-[#8B7355] dark:text-[#8A8FA8] mt-1">{t('quotations.subtitle')}</p>
                    </div>
                    <button
                        id="btn-new-quotation"
                        onClick={handleOpenBuilder}
                        className="bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#F5A623]/20 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        <span>{t('quotations.create_new')}</span>
                    </button>
                </div>

                {/* Table */}
                <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#F8F3E6] dark:bg-[#13161E]/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">{t('quotations.quote_no')}</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">{t('quotations.client')}</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">{t('quotations.status')}</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider text-right">{t('quotations.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8DCC4] dark:divide-white/5">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center"><Loader2 className="animate-spin text-[#F5A623] mx-auto" size={32} /></td></tr>
                                ) : quotations.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-[#8B7355] dark:text-[#4D526A]">{t('quotations.no_found')}</td></tr>
                                ) : quotations.map(q => (
                                    <tr key={q.id} className="hover:bg-[#F8F3E6]/60 dark:hover:bg-white/[0.02] transition-all">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#F5A623]/10 text-[#d48e1d] flex items-center justify-center"><FileText size={16} /></div>
                                                <span className="text-sm font-bold text-[#5C4D3C] dark:text-[#F0F2F7] font-mono">{q.quotation_number}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-[#5C4D3C] dark:text-[#F0F2F7]">{q.customer_name || '—'}</p>
                                            <p className="text-xs text-[#8B7355] dark:text-[#4D526A]">{q.customer_email || ''}</p>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-[#8B7355] dark:text-[#8A8FA8]">{new Date(q.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', statusColor(q.status))}>
                                                {q.status}
                                            </span>
                                        </td>
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
                                <span className="font-black text-[#2B3A55] dark:text-white text-base hidden sm:block">Quotation Builder</span>
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
                                                    Quotation # <button onClick={fetchNextNumber} title="Regenerate"><RefreshCw size={10} className="text-[#F5A623]" /></button>
                                                </label>
                                                <input
                                                    id="input-quotation-number"
                                                    type="text"
                                                    value={formData.quotation_number}
                                                    onChange={e => setFormData(p => ({ ...p, quotation_number: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-[#13161E] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 outline-none font-mono text-sm focus:border-[#F5A623]/50"
                                                    placeholder="Auto-generated"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-[#5C4D3C] dark:text-slate-300">Valid Until</label>
                                                <input
                                                    type="date"
                                                    value={formData.expires_at}
                                                    onChange={e => setFormData(p => ({ ...p, expires_at: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-[#13161E] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 outline-none text-sm focus:border-[#F5A623]/50"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-[#5C4D3C] dark:text-slate-300">Client Name *</label>
                                                <input
                                                    id="input-client-name"
                                                    type="text"
                                                    value={formData.customer_name}
                                                    onChange={e => setFormData(p => ({ ...p, customer_name: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-[#13161E] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 outline-none text-sm focus:border-[#F5A623]/50"
                                                    placeholder="e.g. Super Star Co."
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-[#5C4D3C] dark:text-slate-300">Client Phone</label>
                                                <input
                                                    type="text"
                                                    value={formData.customer_phone}
                                                    onChange={e => setFormData(p => ({ ...p, customer_phone: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-[#13161E] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 outline-none text-sm focus:border-[#F5A623]/50"
                                                    placeholder="01XXXXXXXXX"
                                                />
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <label className="text-[11px] font-bold text-[#5C4D3C] dark:text-slate-300">Client Address</label>
                                                <input
                                                    type="text"
                                                    value={formData.customer_address}
                                                    onChange={e => setFormData(p => ({ ...p, customer_address: e.target.value }))}
                                                    className="w-full bg-gray-50 dark:bg-[#13161E] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 outline-none text-sm focus:border-[#F5A623]/50"
                                                    placeholder="City, District"
                                                />
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <label className="text-[11px] font-bold text-[#5C4D3C] dark:text-slate-300">Client Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.customer_email}
                                                    onChange={e => setFormData(p => ({ ...p, customer_email: e.target.value }))}
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
                                                id="btn-add-quotation-item"
                                                onClick={handleAddItem}
                                                className="text-xs font-bold bg-[#F5A623]/20 text-[#d48e1d] px-3 py-1.5 rounded-full hover:bg-[#F5A623]/30 transition-colors flex items-center gap-1"
                                            >
                                                <Plus size={12} /> Add Item
                                            </button>
                                        </div>

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
                                        type="Quotation"
                                        documentNumber={formData.quotation_number}
                                        date={formData.expires_at || new Date().toISOString()}
                                        clientName={formData.customer_name || '—'}
                                        clientAddress={formData.customer_address}
                                        clientEmail={formData.customer_email}
                                        clientPhone={formData.customer_phone}
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
        </>
    );
};

export default Quotations;
