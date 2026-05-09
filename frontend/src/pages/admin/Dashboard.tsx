import React from 'react';
import {
    Users,
    ShoppingCart,
    Package,
    TrendingUp,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const [sales, setSales] = React.useState<any[]>([]);
    const [purchases, setPurchases] = React.useState<any[]>([]);
    const [expenses, setExpenses] = React.useState<any[]>([]);
    const [serviceRevs, setServiceRevs] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [salesRes, purchasesRes, expensesRes, revRes] = await Promise.all([
                    fetch('http://localhost:8083/api/v1/accounting/sales'),
                    fetch('http://localhost:8083/api/v1/accounting/purchases'),
                    fetch('http://localhost:8083/api/v1/accounting/expenses'),
                    fetch('http://localhost:8083/api/v1/accounting/service-revenues')
                ]);
                const salesData = await salesRes.json();
                const purchasesData = await purchasesRes.json();
                const expensesData = await expensesRes.json();
                const revData = await revRes.json();

                if (salesData.success) setSales(salesData.data || []);
                if (purchasesData.success) setPurchases(purchasesData.data || []);
                if (expensesData.success) setExpenses(expensesData.data || []);
                if (revData.success) setServiceRevs(revData.data || []);
            } catch (error) {
                console.error("Failed to fetch accounting data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const totalIncome = sales.reduce((a, b) => a + b.amount, 0) + serviceRevs.reduce((a, b) => a + b.amount, 0);
    const totalExpense = purchases.reduce((a, b) => a + b.amount, 0) + expenses.reduce((a, b) => a + b.amount, 0);
    const netMargin = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    const stats = [
        { label: t('dashboard.revenue'), value: `৳${totalIncome.toLocaleString()}`, change: '▲ 12.4%', color: '#F5A623', trend: 'up', icon: TrendingUp },
        { label: t('dashboard.orders'), value: '1,284', change: '▲ 8.1%', color: '#F5A623', trend: 'up', icon: ShoppingCart },
        { label: t('dashboard.products'), value: '523', change: '▲ 3.2%', color: '#F5A623', trend: 'up', icon: Package },
        { label: t('dashboard.customers'), value: '1,209', change: '▼ 2.1%', color: '#EF4444', trend: 'down', icon: Users },
    ];

    const recentOrders = [
        { id: '#VWT-1241', customer: 'Rafiq Ahmed', amount: '৳12,400', status: 'Delivered' },
        { id: '#VWT-1240', customer: 'Nadia Islam', amount: '৳5,600', status: 'Shipped' },
        { id: '#VWT-1239', customer: 'Karim Hossain', amount: '৳8,200', status: 'Processing' },
        { id: '#VWT-1238', customer: 'Farhana Pervin', amount: '৳3,150', status: 'Delivered' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-[#5C4D3C] dark:text-white">{t('dashboard.overview')}</h1>
                    <p className="text-sm text-[#8B7355] dark:text-[#8A8FA8] mt-1">{t('dashboard.subtitle')}</p>
                </div>
                <button className="bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#F5A623]/20">
                    {t('dashboard.export')}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-[#F5A623]/40 dark:hover:border-[#F5A623]/30 transition-all shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-[#8B7355] dark:text-[#8A8FA8] uppercase tracking-wider">{stat.label}</span>
                            <div className="p-2 rounded-lg bg-[#F5A623]/10 dark:bg-white/5 text-[#d48e1d] dark:text-[#8A8FA8] group-hover:bg-[#F5A623]/20 dark:group-hover:bg-[#F5A623]/10 group-hover:text-[#d48e1d] dark:group-hover:text-[#F5A623] transition-all">
                                <stat.icon size={16} />
                            </div>
                        </div>
                        <h3 className="font-sora text-2xl font-bold text-[#5C4D3C] dark:text-white">{stat.value}</h3>
                        <p className={cn(
                            "text-xs font-bold mt-2",
                            stat.trend === 'up' ? "text-emerald-500" : "text-rose-500"
                        )}>
                            {stat.change}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Tables Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20">
                    <div className="p-6 border-b border-[#E8DCC4] dark:border-white/5 flex items-center justify-between">
                        <h3 className="font-sora font-bold text-[#5C4D3C] dark:text-white">{t('dashboard.recent_orders')}</h3>
                        <Link to="/admin/orders" className="text-xs text-[#d48e1d] dark:text-[#F5A623] font-bold hover:underline">{t('dashboard.view_all')}</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#F8F3E6] dark:bg-[#13161E]/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8DCC4] dark:divide-white/5">
                                {recentOrders.map((order, idx) => (
                                    <tr key={idx} className="hover:bg-[#F8F3E6]/60 dark:hover:bg-white/[0.02] transition-all">
                                        <td className="px-6 py-4 text-sm font-bold text-[#d48e1d] dark:text-[#F5A623] font-mono">{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-[#5C4D3C] dark:text-gray-300 font-medium">{order.customer}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-[#5C4D3C] dark:text-gray-300">{order.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-tight",
                                                order.status === 'Delivered' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                                    order.status === 'Shipped' ? "bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20" :
                                                        "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                            )}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 rounded-lg hover:bg-[#F5A623]/10 transition-all text-[#8A8FA8] hover:text-[#d48e1d]">
                                                <ArrowUpRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl p-6 shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20">
                    <h3 className="font-sora font-bold mb-6 text-[#5C4D3C] dark:text-white">{t('dashboard.quick_actions')}</h3>
                    <div className="flex flex-col gap-3">
                        <Link to="/admin/products" className="flex items-center gap-4 p-4 rounded-xl bg-[#F8F3E6] dark:bg-white/5 hover:bg-[#E8DCC4]/50 dark:hover:bg-white/10 transition-all group border border-transparent hover:border-[#F5A623]/20">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Package size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-[#5C4D3C] dark:text-white">{t('dashboard.add_product')}</p>
                                <p className="text-[10px] text-[#8B7355] dark:text-[#4D526A]">{t('dashboard.add_product_desc')}</p>
                            </div>
                        </Link>
                        <Link to="/admin/orders" className="flex items-center gap-4 p-4 rounded-xl bg-[#F8F3E6] dark:bg-white/5 hover:bg-[#E8DCC4]/50 dark:hover:bg-white/10 transition-all group border border-transparent hover:border-[#F5A623]/20">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ShoppingCart size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-[#5C4D3C] dark:text-white">{t('dashboard.create_order')}</p>
                                <p className="text-[10px] text-[#8B7355] dark:text-[#4D526A]">{t('dashboard.create_order_desc')}</p>
                            </div>
                        </Link>
                        <button className="flex items-center gap-4 p-4 rounded-xl bg-[#F8F3E6] dark:bg-white/5 hover:bg-[#E8DCC4]/50 dark:hover:bg-white/10 transition-all group border border-transparent hover:border-[#F5A623]/20">
                            <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 text-[#d48e1d] dark:text-[#F5A623] flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-[#5C4D3C] dark:text-white">{t('dashboard.customer_query')}</p>
                                <p className="text-[10px] text-[#8B7355] dark:text-[#4D526A]">{t('dashboard.customer_query_desc')}</p>
                            </div>
                        </button>
                    </div>

                    <div className="mt-8 p-5 bg-gradient-to-br from-[#F5A623] to-[#D48E1D] rounded-2xl relative overflow-hidden group cursor-pointer shadow-lg shadow-[#F5A623]/20">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <h4 className="text-[#0D0F14] font-sora font-extrabold text-lg relative z-10 leading-tight">{t('dashboard.need_support')}</h4>
                        <p className="text-[#0D0F14]/70 text-xs font-bold mt-2 relative z-10 transition-transform group-hover:translate-x-1">{t('dashboard.visit_docs')} →</p>
                    </div>
                </div>
            </div>

            {/* Accounting Overview Widget */}
            <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl p-6 shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-sora font-bold text-[#5C4D3C] dark:text-white">{t('accounting.overview')}</h3>
                    <Link to="/admin/reports" className="text-xs text-[#d48e1d] dark:text-[#F5A623] font-bold hover:underline">{t('accounting.full_report')}</Link>
                </div>
                {loading ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#F5A623]" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">{t('accounting.total_income')}</p>
                            <h4 className="text-2xl font-sora font-bold text-emerald-700 dark:text-emerald-300">
                                ৳{totalIncome.toLocaleString()}
                            </h4>
                        </div>
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide mb-1">{t('accounting.total_expenses')}</p>
                            <h4 className="text-2xl font-sora font-bold text-rose-700 dark:text-rose-300">
                                ৳{totalExpense.toLocaleString()}
                            </h4>
                        </div>
                        <div className="p-4 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/20">
                            <p className="text-xs font-bold text-[#d48e1d] dark:text-[#F5A623] uppercase tracking-wide mb-1">{t('accounting.net_margin')}</p>
                            <h4 className="text-2xl font-sora font-bold text-[#d48e1d] dark:text-[#F5A623]">
                                {netMargin.toFixed(1)}%
                            </h4>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
