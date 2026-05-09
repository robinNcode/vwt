import React, { useState, useEffect } from 'react';
import {
    FileText,
    Download,
    Search,
    Printer,
    CheckCircle2,
    Clock,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Invoice {
    id: number;
    order_id: number;
    invoice_number: string;
    issued_at: string;
}

const Invoices: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-white">Finance & Invoices</h1>
                    <p className="text-sm text-[#8A8FA8] mt-1">Review transaction documents and billing history.</p>
                </div>
            </div>

            <div className="bg-[#1A1E29] border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#13161E]/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#4D526A] uppercase tracking-wider">Invoice No.</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#4D526A] uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#4D526A] uppercase tracking-wider">Issued Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#4D526A] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <Loader2 className="animate-spin text-[#F5A623] mx-auto" size={32} />
                                    </td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[#4D526A]">No invoices found.</td>
                                </tr>
                            ) : invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-white/[0.02] transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                                <FileText size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-[#F0F2F7]">{invoice.invoice_number}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#8A8FA8]">#ORD-{invoice.order_id}</td>
                                    <td className="px-6 py-4 text-xs text-[#8A8FA8]">
                                        {new Date(invoice.issued_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 rounded-lg hover:bg-white/5 text-[#4D526A] hover:text-[#F0F2F7] transition-all">
                                                <Download size={16} />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-white/5 text-[#4D526A] hover:text-[#F0F2F7] transition-all">
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
        </div>
    );
};

export default Invoices;
