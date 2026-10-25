import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, ShoppingCart, Search, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { authService } from '@/lib/auth'
import { useCartStore } from '@/lib/cart'
import { useSiteSettings } from '@/lib/settings'
import ThemeToggle from '../ThemeToggle'
import CartDrawer from './CartDrawer'
import finalLogo from '@/assets/images/final_logo.png'

// Icons
import { Home, Box, Wrench, Info, Mail, Truck } from 'lucide-react'

const Navbar = () => {
    const { t, i18n } = useTranslation()
    const { settings } = useSiteSettings()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [user, setUser] = useState(authService.getUser())
    const { items, setIsOpen: setCartOpen, fetchCart } = useCartStore()
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

    const siteName = settings?.site_name || 'Volt Wave Tech'
    const logoSrc = settings?.logo_url || finalLogo

    useEffect(() => {
        const checkUser = () => {
            setUser(authService.getUser())
            fetchCart()
        }
        window.addEventListener('storage', checkUser)
        return () => window.removeEventListener('storage', checkUser)
    }, [fetchCart])

    useEffect(() => {
        fetchCart()
    }, [fetchCart])

    const handleLogout = () => {
        authService.logout()
        setUser(null)
        navigate('/login')
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'bn' ? 'en' : 'bn')
    }

    const navLinks = [
        { name: t('nav.home'), icon: <Home size={15} />, href: '/' },
        { name: t('nav.products'), icon: <Box size={15} />, href: '/products' },
        { name: t('nav.services'), icon: <Wrench size={15} />, href: '/services' },
        { name: t('nav.contact'), icon: <Mail size={15} />, href: '/contact' },
        { name: t('nav.track-orders'), icon: <Truck size={15} />, href: '/track-order' }
    ]

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                scrolled
                    ? "bg-white dark:bg-[#0D0F14] shadow-md border-b border-slate-200 dark:border-white/10 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container-custom flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img
                        src={logoSrc}
                        alt={siteName}
                        className={cn(
                            "h-8 md:h-10 object-contain transition-all duration-300"
                        )}
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={cn(
                                "text-sm font-semibold transition-colors flex items-center gap-2",
                                scrolled
                                    ? "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-[#F5A623]"
                                    : "text-white/90 hover:text-white drop-shadow"
                            )}
                        >
                            {link.icon}
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button className={cn(
                        "p-2 transition-colors",
                        scrolled
                            ? "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623]"
                            : "text-white/90 hover:text-white"
                    )}>
                        <Search size={16} />
                    </button>
                    <button
                        onClick={() => setCartOpen(true)}
                        className={cn(
                            "p-2 transition-colors relative",
                            scrolled
                                ? "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623]"
                                : "text-white/90 hover:text-white"
                        )}
                    >
                        <ShoppingCart size={16} />
                        <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 dark:bg-[#F5A623] text-[10px] font-bold text-white flex items-center justify-center rounded-full">
                            {cartCount}
                        </span>
                    </button>

                    <div className={cn(
                        "flex items-center p-1 rounded-xl border transition-all duration-300",
                        scrolled
                            ? "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10"
                            : "bg-white/10 border-white/20"
                    )}>
                        <button
                            onClick={() => i18n.changeLanguage('en')}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                i18n.language === 'en'
                                    ? scrolled
                                        ? "bg-white dark:bg-white/10 text-blue-600 dark:text-[#F5A623] shadow-sm"
                                        : "bg-white/20 text-white shadow-sm"
                                    : scrolled
                                        ? "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                        : "text-white/70 hover:text-white"
                            )}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => i18n.changeLanguage('bn')}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                i18n.language === 'bn'
                                    ? scrolled
                                        ? "bg-white dark:bg-white/10 text-blue-600 dark:text-[#F5A623] shadow-sm"
                                        : "bg-white/20 text-white shadow-sm"
                                    : scrolled
                                        ? "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                        : "text-white/70 hover:text-white"
                            )}
                        >
                            BN
                        </button>
                    </div>

                    <ThemeToggle />

                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link to="/admin/dashboard" className={cn(
                                "text-xs font-bold transition-colors",
                                scrolled
                                    ? "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623]"
                                    : "text-white/90 hover:text-white"
                            )}>
                                {t('admin_nav.dashboard')}
                            </Link>
                            <button onClick={handleLogout} className="btn-primary py-2 px-5 text-xs bg-red-500 hover:bg-red-600 border-red-500 shadow-red-500/10">
                                {t('nav.logout')}
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className={cn(
                            "py-2 px-5 text-xs rounded-xl font-semibold transition-all active:scale-95",
                            scrolled
                                ? "btn-primary"
                                : "bg-white text-blue-600 hover:bg-white/90 shadow-md"
                        )}>
                            {t('nav.login')}
                        </Link>
                    )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center gap-2">
                    <button
                        onClick={() => setCartOpen(true)}
                        className={cn(
                            "p-2 relative transition-colors",
                            scrolled ? "text-slate-600 dark:text-slate-400" : "text-white/90"
                        )}
                    >
                        <ShoppingCart size={17} />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-blue-600 dark:bg-[#F5A623] text-[10px] font-bold text-white flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={toggleLanguage}
                        className={cn(
                            "p-2 transition-colors",
                            scrolled ? "text-slate-600 dark:text-slate-400" : "text-white/90"
                        )}
                    >
                        <Globe size={17} />
                    </button>
                    <button
                        className={cn(
                            "p-2 transition-colors",
                            scrolled ? "text-slate-600 dark:text-slate-400" : "text-white/90"
                        )}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <ThemeToggle />
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-[#0D0F14] border-b border-slate-100 dark:border-white/5 overflow-hidden"
                    >
                        <div className="container-custom py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-lg font-medium text-slate-700 dark:text-slate-300 active:text-blue-600 dark:active:text-[#F5A623] flex items-center gap-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="text-lg">{link.icon}</span>
                                    <span>{link.name}</span>
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex flex-col gap-3">
                                {user ? (
                                    <>
                                        <Link to="/admin/dashboard" className="btn-secondary w-full text-center py-3 dark:bg-white/5 dark:text-white dark:border-white/10" onClick={() => setIsOpen(false)}>
                                            {t('admin_nav.dashboard')}
                                        </Link>
                                        <button onClick={handleLogout} className="btn-primary w-full bg-red-500 border-red-500">
                                            {t('nav.logout')}
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/login" className="btn-primary w-full" onClick={() => setIsOpen(false)}>
                                        {t('nav.login')}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <CartDrawer />
        </nav>
    )
}

export default Navbar
