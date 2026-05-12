import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, ShoppingCart, Search, Globe, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { authService } from '@/lib/auth'
import ThemeToggle from '../ThemeToggle'
import finalLogo from '@/assets/images/final_logo.png'
import finalIcon from '@/assets/images/final_icon.png'

const Navbar = () => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [user, setUser] = useState(authService.getUser())

    useEffect(() => {
        const checkUser = () => {
            setUser(authService.getUser())
        }
        window.addEventListener('storage', checkUser)
        return () => window.removeEventListener('storage', checkUser)
    }, [])

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
        { name: t('nav.home'), href: '/' },
        { name: t('nav.products'), href: '/products' },
        { name: t('nav.services'), href: '/services' },
        { name: t('nav.about'), href: '/about' },
        { name: t('nav.contact'), href: '/contact' },
    ]

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-white/80 dark:bg-[#0D0F14]/80 backdrop-blur-lg shadow-sm border-b border-slate-100 dark:border-white/5 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container-custom flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img src={finalLogo} alt="Volt Wave Tech" className="h-8 md:h-10 object-contain dark:brightness-0 dark:invert" />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors">
                        <Search size={20} />
                    </button>
                    <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors relative">
                        <ShoppingCart size={20} />
                        <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 dark:bg-[#F5A623] text-[10px] font-bold text-white flex items-center justify-center rounded-full">
                            0
                        </span>
                    </button>

                    <div className="flex items-center bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                        <button
                            onClick={() => i18n.changeLanguage('en')}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                i18n.language === 'en'
                                    ? "bg-white dark:bg-white/10 text-blue-600 dark:text-[#F5A623] shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
                            )}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => i18n.changeLanguage('bn')}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                i18n.language === 'bn'
                                    ? "bg-white dark:bg-white/10 text-blue-600 dark:text-[#F5A623] shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
                            )}
                        >
                            BN
                        </button>
                    </div>

                    <ThemeToggle />

                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link to="/admin/dashboard" className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors">
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="btn-primary py-2 px-5 text-xs bg-red-500 hover:bg-red-600 border-red-500 shadow-red-500/10">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-primary py-2 px-5 text-xs">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="p-2 text-slate-600 dark:text-slate-400"
                    >
                        <Globe size={20} />
                    </button>
                    <button
                        className="p-2 text-slate-600 dark:text-slate-400"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
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
                                    className="text-lg font-medium text-slate-700 dark:text-slate-300 active:text-blue-600 dark:active:text-[#F5A623]"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex flex-col gap-3">
                                {user ? (
                                    <>
                                        <Link to="/admin/dashboard" className="btn-secondary w-full text-center py-3 dark:bg-white/5 dark:text-white dark:border-white/10" onClick={() => setIsOpen(false)}>
                                            Dashboard
                                        </Link>
                                        <button onClick={handleLogout} className="btn-primary w-full bg-red-500 border-red-500">
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/login" className="btn-primary w-full" onClick={() => setIsOpen(false)}>
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar

