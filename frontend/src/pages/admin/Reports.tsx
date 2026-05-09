import React, { useState } from 'react';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Download,
    Calendar,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Reports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'sales' | 'expenses' | 'pl'>('pl');
    const [sales, setSales] = useState<any[]>([]);
    const [purchases, setPurchases] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [serviceRevs, setServiceRevs] = useState<any[]>([]);

    React.useEffect(() => {
        const fetchAll = async () => {
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
            }
        };
        fetchAll();
    }, []);

    const totalSales = sales.reduce((acc, curr) => acc + curr.amount, 0);
    const totalServiceRev = serviceRevs.reduce((acc, curr) => acc + curr.amount, 0);
    const totalRevenue = totalSales + totalServiceRev;
    const cogs = purchases.reduce((acc, curr) => acc + curr.amount, 0);
    const grossProfit = totalRevenue - cogs;
    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = grossProfit - totalExpense;

    const plData = [
        { label: 'Total Revenue', value: totalRevenue, trend: '+15.2%', isPositive: true },
        { label: 'Cost of Goods Sold', value: cogs, trend: '+5.4%', isPositive: false },
        { label: 'Gross Profit', value: grossProfit, trend: '+22.1%', isPositive: true },
        { label: 'Operating Expenses', value: totalExpense, trend: '-2.1%', isPositive: false },
        { label: 'Net Profit', value: netProfit, trend: '+18.5%', isPositive: netProfit >= 0 },
    ];

    const expenseCategories = Object.keys(expenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
    }, {} as Record<string, number>)).map(name => {
        const amount = expenses.filter(e => e.category === name).reduce((sum, e) => sum + e.amount, 0);
        const percent = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(0) + '%' : '0%';
        return { name, amount, percent };
    });

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-[#5C4D3C] dark:text-white">Accounting & Reports</h1>
                    <p className="text-sm text-[#8B7355] dark:text-[#8A8FA8] mt-1">Detailed financial analysis, P/L statements, and business metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-xl text-sm font-bold text-[#8B7355] dark:text-[#8A8FA8] hover:bg-[#F8F3E6] dark:hover:bg-white/5 transition-all shadow-sm">
                        <Calendar size={18} />
                        <span>This Month</span>
                    </button>
                    <button className="btn-primary flex items-center justify-center gap-2">
                        <Download size={18} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 bg-[#FDFBF7] dark:bg-[#1A1E29] p-1.5 rounded-2xl border border-[#E8DCC4] dark:border-white/5 w-fit">
                {[
                    { id: 'pl', label: 'Profit & Loss', icon: BarChart3 },
                    { id: 'sales', label: 'Sales Report', icon: TrendingUp },
                    { id: 'expenses', label: 'Expense Report', icon: PieChart },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                            activeTab === tab.id
                                ? "bg-white dark:bg-[#2A2F3D] text-[#5C4D3C] dark:text-white shadow-sm"
                                : "text-[#8B7355] dark:text-[#8A8FA8] hover:text-[#5C4D3C] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
                        )}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                >
                    {activeTab === 'pl' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* P/L Summary */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl p-8 shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20">
                                    <h3 className="font-sora text-lg font-bold text-[#5C4D3C] dark:text-white mb-6">Income Statement</h3>
                                    <div className="space-y-6">
                                        {plData.map((item, idx) => (
                                            <div key={idx} className={cn(
                                                "flex items-center justify-between pb-4",
                                                idx !== plData.length - 1 ? "border-b border-[#E8DCC4]/50 dark:border-white/5" : ""
                                            )}>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#8B7355] dark:text-[#8A8FA8] uppercase tracking-wider">{item.label}</span>
                                                    <span className={cn(
                                                        "text-[10px] font-extrabold flex items-center gap-1 mt-1",
                                                        item.isPositive ? "text-emerald-500" : "text-red-500"
                                                    )}>
                                                        {item.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                        {item.trend} VS LAST MONTH
                                                    </span>
                                                </div>
                                                <span className={cn(
                                                    "text-xl font-sora font-extrabold",
                                                    idx === plData.length - 1 ? "text-[#d48e1d] dark:text-[#F5A623] text-3xl" : "text-[#5C4D3C] dark:text-white"
                                                )}>
                                                    ৳{item.value.toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Stats Sidebar */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-gradient-to-br from-[#F5A623] to-[#D48E1D] rounded-2xl p-8 text-[#0D0F14] relative overflow-hidden shadow-xl shadow-[#F5A623]/20">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                                    <h3 className="font-sora font-bold opacity-80 uppercase tracking-widest text-xs mb-1">Net Margin</h3>
                                    <div className="text-5xl font-extrabold font-sora tracking-tight mb-2">45.8%</div>
                                    <p className="font-bold opacity-90 text-sm flex items-center gap-2">
                                        <TrendingUp size={16} /> +5.2% improvement
                                    </p>
                                </div>

                                <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl p-6 shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20">
                                    <h3 className="text-sm font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider mb-4">Top Expenses</h3>
                                    <div className="space-y-4">
                                        {expenseCategories.map((exp, idx) => (
                                            <div key={idx}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-bold text-[#5C4D3C] dark:text-white">{exp.name}</span>
                                                    <span className="text-xs font-bold text-[#8B7355] dark:text-[#8A8FA8]">৳{exp.amount.toLocaleString()}</span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-[#E8DCC4]/50 dark:bg-white/5 overflow-hidden">
                                                    <div
                                                        className="h-full bg-red-400 dark:bg-red-500 rounded-full"
                                                        style={{ width: exp.percent }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'sales' && (
                        <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl p-8 shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20 text-center">
                            <BarChart3 className="mx-auto text-[#d48e1d] dark:text-[#F5A623] mb-4" size={48} />
                            <h3 className="font-sora text-xl font-bold text-[#5C4D3C] dark:text-white mb-2">Sales Analytics Dashboard</h3>
                            <p className="text-[#8B7355] dark:text-[#8A8FA8] max-w-md mx-auto">Detailed sales breakdown by product, category, and sales channel will be visualized here.</p>
                        </div>
                    )}

                    {activeTab === 'expenses' && (
                        <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl p-8 shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20 text-center">
                            <PieChart className="mx-auto text-[#d48e1d] dark:text-[#F5A623] mb-4" size={48} />
                            <h3 className="font-sora text-xl font-bold text-[#5C4D3C] dark:text-white mb-2">Expense Categorization</h3>
                            <p className="text-[#8B7355] dark:text-[#8A8FA8] max-w-md mx-auto">Track and manage operational costs, purchase orders, and overheads across your business.</p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Reports;
