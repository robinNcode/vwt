import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    RefreshCcw,
    ShoppingCart,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    Loader2,
    Package,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    grand_total: number;
    status: string;
    payment_status: string;
    created_at: string;
}

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<Order | null | 'not_found'>(null);
    const [searching, setSearching] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/orders?status=${statusFilter}`);
            if (res.data.success) {
                setOrders(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        setUpdatingId(id);
        try {
            const res = await api.put(`/admin/orders/${id}`, { status: newStatus });
            if (res.data.success) {
                fetchOrders();
                if (searchResult && typeof searchResult === 'object' && searchResult.id === id) {
                    setSearchResult({ ...searchResult, status: newStatus });
                }
            }
        } catch (error) {
            console.error('Failed to update order status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleQuickSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setSearching(true);
        setSearchResult(null);
        try {
            const res = await api.get(`/orders/track/${searchQuery.trim()}`);
            if (res.data.success && res.data.data) {
                setSearchResult(res.data.data);
            } else {
                setSearchResult('not_found');
            }
        } catch {
            setSearchResult('not_found');
        } finally {
            setSearching(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResult(null);
        searchRef.current?.focus();
    };

    const statusColors: Record<string, string> = {
        'pending': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'processing': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        'shipped': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        'delivered': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'cancelled': 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    const statusIcons: Record<string, React.ElementType> = {
        'pending': Clock,
        'processing': Package,
        'shipped': Truck,
        'delivered': CheckCircle2,
        'cancelled': XCircle,
    };

    const displayOrders = orders;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-[#5C4D3C] dark:text-white">Order Management</h1>
                    <p className="text-sm text-[#8B7355] dark:text-[#8A8FA8] mt-1">Track customer purchases and manage fulfillment states.</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 bg-[#F5A623]/10 hover:bg-[#F5A623]/20 text-[#d48e1d] dark:text-[#F5A623] border border-[#F5A623]/20 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                    <RefreshCcw size={14} />
                    Refresh
                </button>
            </div>

            {/* Quick Search Widget */}
            <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl p-5 shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-[#F5A623]/10 flex items-center justify-center">
                        <Search size={14} className="text-[#d48e1d] dark:text-[#F5A623]" />
                    </div>
                    <h3 className="font-bold text-sm text-[#5C4D3C] dark:text-white">Quick Order Search</h3>
                    <span className="text-[10px] bg-[#F5A623]/10 text-[#d48e1d] dark:text-[#F5A623] px-2 py-0.5 rounded-full font-bold">by Order ID</span>
                </div>
                <form onSubmit={handleQuickSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355] dark:text-[#4D526A]" />
                        <input
                            ref={searchRef}
                            id="admin-order-search"
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Enter order number or order ID..."
                            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#E8DCC4] dark:border-white/10 bg-white dark:bg-[#13161E] text-[#5C4D3C] dark:text-white placeholder-[#8B7355] dark:placeholder-[#4D526A] focus:outline-none focus:border-[#F5A623]/50 text-sm transition-all"
                        />
                        {searchQuery && (
                            <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] dark:text-[#4D526A] hover:text-[#d48e1d] dark:hover:text-[#F5A623]">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={searching || !searchQuery.trim()}
                        className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] font-bold px-5 py-2.5 rounded-xl text-xs transition-all disabled:opacity-50 shadow-lg shadow-[#F5A623]/20"
                    >
                        {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                        Search
                    </button>
                </form>

                {/* Search Result */}
                <AnimatePresence>
                    {searchResult && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 overflow-hidden"
                        >
                            {searchResult === 'not_found' ? (
                                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                                    <XCircle size={14} className="shrink-0" />
                                    No order found with ID: <strong>"{searchQuery}"</strong>
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl bg-[#F8F3E6] dark:bg-white/5 border border-[#E8DCC4] dark:border-[#F5A623]/20">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#F5A623]/10 flex items-center justify-center">
                                                <ShoppingCart size={16} className="text-[#d48e1d] dark:text-[#F5A623]" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-[#d48e1d] dark:text-[#F5A623] font-mono">{searchResult.order_number}</p>
                                                <p className="text-xs text-[#8B7355] dark:text-[#8A8FA8]">{searchResult.customer_name} · {searchResult.customer_email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="font-mono text-sm font-bold text-[#5C4D3C] dark:text-white">৳{searchResult.grand_total?.toLocaleString()}</span>
                                            <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase border", statusColors[searchResult.status] || 'bg-white/5 text-[#8A8FA8] border-white/5')}>
                                                {searchResult.status}
                                            </span>
                                            <select
                                                className="bg-white dark:bg-[#13161E] border border-[#E8DCC4] dark:border-white/5 rounded-lg px-2 py-1 text-[10px] font-bold text-[#5C4D3C] dark:text-[#8A8FA8] focus:outline-none focus:border-[#F5A623]/50"
                                                value={searchResult.status}
                                                onChange={(e) => handleStatusUpdate(searchResult.id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap",
                            statusFilter === status
                                ? "bg-[#F5A623] text-[#0D0F14] border-[#F5A623]"
                                : "bg-[#FDFBF7] dark:bg-white/5 text-[#8B7355] dark:text-[#8A8FA8] border-[#E8DCC4] dark:border-white/5 hover:bg-[#F8F3E6] dark:hover:bg-white/10"
                        )}
                    >
                        {status === '' ? 'All Orders' : status.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F3E6] dark:bg-[#13161E]/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Order Detail</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Fulfillment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DCC4] dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 className="animate-spin text-[#F5A623] mx-auto" size={32} />
                                    </td>
                                </tr>
                            ) : displayOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[#8B7355] dark:text-[#4D526A]">No orders found.</td>
                                </tr>
                            ) : displayOrders.map((order) => {
                                const StatusIcon = statusIcons[order.status] || Clock;
                                return (
                                    <tr key={order.id} className="hover:bg-[#F8F3E6]/60 dark:hover:bg-white/[0.02] transition-all group">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-[#d48e1d] dark:text-[#F5A623]">{order.order_number}</p>
                                            <p className="text-[10px] text-[#8B7355] dark:text-[#4D526A] mt-0.5">{new Date(order.created_at).toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-[#5C4D3C] dark:text-[#F0F2F7]">{order.customer_name}</p>
                                            <p className="text-[10px] text-[#8B7355] dark:text-[#4D526A]">{order.customer_email}</p>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-[#5C4D3C] dark:text-[#F0F2F7]">৳{order.grand_total.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                order.payment_status === 'paid' ? "text-emerald-400" : "text-amber-400"
                                            )}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase border",
                                                statusColors[order.status] || 'bg-white/5 text-[#8A8FA8] border-white/5'
                                            )}>
                                                <StatusIcon size={10} />
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {updatingId === order.id ? (
                                                    <Loader2 className="animate-spin text-[#F5A623]" size={16} />
                                                ) : (
                                                    <select
                                                        className="bg-white dark:bg-[#13161E] border border-[#E8DCC4] dark:border-white/5 rounded-lg px-2 py-1 text-[10px] font-bold text-[#5C4D3C] dark:text-[#8A8FA8] focus:outline-none focus:border-[#F5A623]/50"
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
