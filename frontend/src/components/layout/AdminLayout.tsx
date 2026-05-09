import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Wrench,
    ShoppingCart,
    FileText,
    BarChart3,
    Settings as SettingsIcon,
    Menu,
    X,
    Bell,
    User,
    LogOut,
    ChevronRight,
    Search,
    FileSearch
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '@/lib/auth';
import ThemeToggle from '../ThemeToggle';
import { useTranslation } from 'react-i18next';
import finalLogo from '@/assets/images/final_logo.png';
import finalIcon from '@/assets/images/final_icon.png';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' || i18n.language.startsWith('en') ? 'bn' : 'en';
        i18n.changeLanguage(newLang);
    };

    const menuItems = [
        { icon: LayoutDashboard, label: t('admin_nav.dashboard'), path: '/admin/dashboard' },
        { icon: Package, label: t('admin_nav.products'), path: '/admin/products' },
        { icon: Wrench, label: t('admin_nav.services'), path: '/admin/services' },
        { icon: ShoppingCart, label: t('admin_nav.orders'), path: '/admin/orders' },
        { icon: FileSearch, label: t('admin_nav.quotations'), path: '/admin/quotations' },
        { icon: FileText, label: t('admin_nav.invoices'), path: '/admin/invoices' },
        { icon: BarChart3, label: t('admin_nav.accounting'), path: '/admin/reports' },
        { icon: SettingsIcon, label: t('admin_nav.settings'), path: '/admin/settings' },
    ];

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0D0F14] text-slate-900 dark:text-[#F0F2F7] font-sans transition-colors duration-300">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-full bg-white dark:bg-[#1A1E29] border-r border-slate-200 dark:border-white/5 transition-all duration-300 z-50",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="p-6 flex items-center gap-3">
                    {isSidebarOpen && (
                        <img src={finalLogo} alt="Logo" className="w-full h-full object-cover" />
                    )}
                    {!isSidebarOpen && (
                        <img src={finalIcon} alt="Logo" className="w-full h-full object-cover" />
                    )}
                </div>

                <nav className="mt-6 px-3 flex flex-col gap-1 text-slate-900 dark:text-white">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                                    isActive
                                        ? "bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623]"
                                        : "text-slate-500 dark:text-[#8A8FA8] hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-[#F0F2F7]"
                                )}
                            >
                                <item.icon className={cn("shrink-0", isActive ? "text-[#F5A623]" : "group-hover:text-slate-900 dark:group-hover:text-[#F0F2F7]")} size={20} />
                                {isSidebarOpen && <span className="text-sm font-semibold">{item.label}</span>}
                                {isActive && isSidebarOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F5A623]" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-6 left-0 w-full px-3">
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-[#8A8FA8] hover:bg-red-500/10 hover:text-red-500 transition-all",
                            !isSidebarOpen && "justify-center"
                        )}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="text-sm font-semibold">{t('admin_nav.logout')}</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn(
                "transition-all duration-300 min-h-screen",
                isSidebarOpen ? "pl-64" : "pl-20"
            )}>
                {/* Header */}
                <header className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0D0F14]/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-slate-600 dark:text-[#8A8FA8]"
                    >
                        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#4D526A]" size={16} />
                            <input
                                type="text"
                                placeholder={t('admin_nav.search_placeholder')}
                                className="bg-slate-100 dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#F5A623]/50 w-64 transition-all text-slate-900 dark:text-white"
                            />
                        </div>
                        <button
                            onClick={toggleLanguage}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-slate-600 dark:text-[#8A8FA8]"
                        >
                            {i18n.language === 'en' || i18n.language.startsWith('en') ? 'বাংলা' : 'EN'}
                        </button>
                        <ThemeToggle />
                        <button className="relative p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-slate-500 dark:text-[#8A8FA8]">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F5A623]" />
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/5 mx-2" />
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-8 h-8 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623] group-hover:bg-[#F5A623] group-hover:text-[#0D0F14] transition-all">
                                <User size={18} />
                            </div>
                            <div className="hidden sm:block text-slate-900 dark:text-white">
                                <p className="text-xs font-bold">{authService.getUser()?.name || 'Admin'}</p>
                                <p className="text-[10px] text-slate-500 dark:text-[#4D526A]">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 mb-8">
                        <span className="text-xs text-slate-400 dark:text-[#4D526A]">Admin Panel</span>
                        <ChevronRight size={12} className="text-slate-400 dark:text-[#4D526A]" />
                        <span className="text-xs text-[#F5A623] font-medium capitalize">
                            {location.pathname.split('/').pop()?.replace('-', ' ')}
                        </span>
                    </div>

                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
