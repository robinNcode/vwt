import React, { useState, useEffect } from 'react';
import {
    Search,
    Eye,
    RefreshCcw,
    MoreHorizontal,
    ShoppingCart,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    Loader2
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
            }
        } catch (error) {
            console.error('Failed to update order status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const statusColors: any = {
        'pending': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'processing': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        'shipped': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        'delivered': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'cancelled': 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-[#5C4D3C] dark:text-white">Order Management</h1>
                    <p className="text-sm text-[#8B7355] dark:text-[#8A8FA8] mt-1">Track customer purchases and manage fulfillment states.</p>
                </div>
            </div>

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
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[#8B7355] dark:text-[#4D526A]">No orders found.</td>
                                </tr>
                            ) : orders.map((order) => (
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
                                            "px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase border",
                                            statusColors[order.status] || 'bg-white/5 text-[#8A8FA8] border-white/5'
                                        )}>
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
