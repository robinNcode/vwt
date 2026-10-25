import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, XCircle, MapPin, Phone, Loader2, AlertCircle, PackageCheck, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    grand_total: number;
    status: string;
    payment_status: string;
    payment_method: string;
    created_at: string;
    updated_at: string;
    items?: OrderItem[];
}

const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: ShoppingBag, bg: 'bg-blue-500' },
    { key: 'processing', label: 'Processing', icon: Package, bg: 'bg-amber-500' },
    { key: 'shipped', label: 'Shipped', icon: Truck, bg: 'bg-purple-500' },
    { key: 'delivered', label: 'Delivered', icon: PackageCheck, bg: 'bg-emerald-500' },
];

const stepColors: Record<string, string> = {
    'bg-blue-500': '#3b82f6',
    'bg-amber-500': '#f59e0b',
    'bg-purple-500': '#a855f7',
    'bg-emerald-500': '#10b981',
};

const getStepIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    return statusSteps.findIndex(s => s.key === status);
};

const TrackOrder: React.FC = () => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;
        setLoading(true);
        setError('');
        setOrder(null);
        setSearched(true);
        try {
            const res = await api.get(`/orders/track/${orderId.trim()}`);
            if (res.data.success && res.data.data) {
                setOrder(res.data.data);
            } else {
                setError('No order found with this ID. Please check and try again.');
            }
        } catch {
            setError('No order found with this ID. Please check and try again.');
        } finally {
            setLoading(false);
        }
    };

    const currentStep = order ? getStepIndex(order.status) : -1;
    const isCancelled = order?.status === 'cancelled';

    return (
        <div className="bg-white dark:bg-[#0D0F14] transition-colors duration-300">
            {/* ── Page Hero ── */}
            <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-indigo-700/20 blur-3xl pointer-events-none" />

                <div className="container-custom relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#F5A623] text-xs font-bold uppercase tracking-wider backdrop-blur-sm mb-6"
                    >
                        <Truck size={14} />
                        Real-time Order Tracking
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-4 font-sora"
                    >
                        Track Your Order
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-300 max-w-xl mx-auto text-base md:text-lg leading-relaxed"
                    >
                        Enter your order number or order ID to get real-time tracking updates on your package.
                    </motion.p>
                </div>
            </section>

            {/* ── Main Content ── */}
            <div className="container-custom py-16">
                <div className="max-w-3xl mx-auto">

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleTrack}
                    className="bg-white dark:bg-[#1A1E29] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/20 mb-8"
                >
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Order Number / Order ID
                    </label>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                id="order-track-input"
                                type="text"
                                value={orderId}
                                onChange={e => setOrderId(e.target.value)}
                                placeholder="e.g. VWT-20241025-0001 or order ID"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#F5A623]/50 text-sm transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !orderId.trim()}
                            className="flex items-center gap-2 bg-blue-600 dark:bg-[#F5A623] hover:bg-blue-700 dark:hover:bg-[#D48E1D] text-white dark:text-[#0D0F14] font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 dark:shadow-[#F5A623]/20 text-sm"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                            Track
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-3">
                        You can find your order number in the confirmation email or SMS sent after purchase.
                    </p>
                </motion.form>

                <AnimatePresence>
                    {error && searched && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 mb-6"
                        >
                            <AlertCircle size={18} className="text-red-500 shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {order && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-white dark:bg-[#1A1E29] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/20">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Order Number</p>
                                        <h2 className="text-2xl font-extrabold text-blue-600 dark:text-[#F5A623] font-mono">{order.order_number}</h2>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
                                            isCancelled
                                                ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20'
                                                : order.status === 'delivered'
                                                    ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                                                    : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                                        }`}>
                                            {isCancelled ? <XCircle size={12} /> : order.status === 'delivered' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Customer</p>
                                        <p className="font-semibold text-slate-800 dark:text-white">{order.customer_name}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Order Total</p>
                                        <p className="font-bold text-slate-800 dark:text-white">৳{order.grand_total?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Payment</p>
                                        <p className={`font-bold ${order.payment_status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {order.payment_status?.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                {order.shipping_address && (
                                    <div className="mt-4 flex items-start gap-2.5 bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                                        <MapPin size={14} className="text-blue-500 dark:text-[#F5A623] mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Delivery Address</p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{order.shipping_address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {!isCancelled ? (
                                <div className="bg-white dark:bg-[#1A1E29] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/20">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-8 text-sm uppercase tracking-wider">Delivery Progress</h3>
                                    <div className="relative">
                                        <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-slate-200 dark:bg-white/10 hidden sm:block" />
                                        <div
                                            className="absolute top-5 left-[10%] h-0.5 hidden sm:block transition-all duration-700"
                                            style={{
                                                background: 'linear-gradient(to right, #3b82f6, #f59e0b, #10b981)',
                                                width: currentStep >= 0 ? `${(currentStep / (statusSteps.length - 1)) * 80}%` : '0%'
                                            }}
                                        />
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                            {statusSteps.map((step, idx) => {
                                                const isCompleted = currentStep >= idx;
                                                const isCurrent = currentStep === idx;
                                                const StepIcon = step.icon;
                                                const hexColor = stepColors[step.bg];
                                                return (
                                                    <div key={step.key} className="flex flex-col items-center text-center gap-3">
                                                        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                                            isCompleted ? `${step.bg} shadow-lg` : 'bg-slate-100 dark:bg-white/10'
                                                        } ${isCurrent ? 'scale-110' : ''}`}>
                                                            <StepIcon size={18} className={isCompleted ? 'text-white' : 'text-slate-400 dark:text-slate-600'} />
                                                            {isCurrent && (
                                                                <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: hexColor }} />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className={`text-xs font-bold ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600'}`}>
                                                                {step.label}
                                                            </p>
                                                            {isCurrent && <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Current</p>}
                                                            {isCompleted && !isCurrent && <p className="text-[10px] text-emerald-500 mt-0.5 font-semibold">✓ Done</p>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="mt-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10">
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                            📦 Estimated Delivery: <span className="font-bold">1–3 days within Dhaka, 3–7 days nationwide (via courier partners).</span>
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-[#1A1E29] rounded-2xl border border-red-200 dark:border-red-500/20 p-6 shadow-xl shadow-red-500/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                                            <XCircle size={24} className="text-red-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-red-600 dark:text-red-400">Order Cancelled</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">This order has been cancelled. Contact support for refund queries.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {order.items && order.items.length > 0 && (
                                <div className="bg-white dark:bg-[#1A1E29] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/20">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Order Items</h3>
                                    <div className="space-y-3">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/5 last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-white/5 flex items-center justify-center">
                                                        <Package size={14} className="text-blue-500 dark:text-[#F5A623]" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.product_name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400">×{item.quantity}</p>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-white">৳{(item.unit_price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-[#F5A623] dark:to-[#D48E1D] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-bold text-white dark:text-[#0D0F14] text-lg">Need help with your order?</h4>
                                    <p className="text-sm text-blue-100 dark:text-[#0D0F14]/70 mt-1">Our support team is available 9 AM – 9 PM, 7 days a week.</p>
                                </div>
                                <a
                                    href="tel:+8801822108496"
                                    className="inline-flex items-center gap-2 bg-white dark:bg-[#0D0F14] text-blue-600 dark:text-[#F5A623] font-bold px-5 py-2.5 rounded-xl text-sm hover:shadow-lg transition-all shrink-0"
                                >
                                    <Phone size={14} />
                                    Call Support
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!searched && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2"
                    >
                        {[
                            { icon: ShoppingBag, title: 'Place Order', desc: 'Complete your purchase online or by calling us.' },
                            { icon: Truck, title: 'Fast Shipping', desc: 'Delivered via trusted couriers across Bangladesh.' },
                            { icon: CheckCircle2, title: 'Track & Receive', desc: 'Monitor progress and receive at your doorstep.' },
                        ].map((card, i) => (
                            <div key={i} className="bg-white dark:bg-[#1A1E29] rounded-2xl border border-slate-100 dark:border-white/5 p-5 text-center shadow-md">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#F5A623]/10 flex items-center justify-center mx-auto mb-3">
                                    <card.icon size={18} className="text-blue-600 dark:text-[#F5A623]" />
                                </div>
                                <p className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{card.title}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">{card.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                )}
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
