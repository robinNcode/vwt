import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
    ArrowRight, Zap, Shield, Clock, Battery, Cpu, Wifi, Search,
    CheckCircle2, Star, TrendingUp, Users, Package
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import voltWaveTech from '@/assets/images/visiting_card_volt_wave_tech_back.png';
import visitingCard from '@/assets/images/visiting_card_volt_wave_tech.png';
import signWithSeal from '@/assets/images/Sign_with_seal.jpg';
import sign from '@/assets/images/sign.jpg';
import voltwaveLightBg from '@/assets/images/voltwave_light_clean.png';
import voltwaveDarkBg from '@/assets/images/voltwave_dark_clean.png';

const Home = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')

    const features = [
        {
            icon: <Zap className="text-yellow-500" size={22} />,
            title: t('features.fast_delivery.title'),
            description: t('features.fast_delivery.desc'),
            color: 'from-yellow-500/10 to-orange-500/5',
            border: 'border-yellow-200 dark:border-yellow-500/15',
        },
        {
            icon: <Shield className="text-blue-500" size={22} />,
            title: t('features.original_products.title'),
            description: t('features.original_products.desc'),
            color: 'from-blue-500/10 to-cyan-500/5',
            border: 'border-blue-200 dark:border-blue-500/15',
        },
        {
            icon: <Clock className="text-emerald-500" size={22} />,
            title: t('features.support.title'),
            description: t('features.support.desc'),
            color: 'from-emerald-500/10 to-teal-500/5',
            border: 'border-emerald-200 dark:border-emerald-500/15',
        },
    ]

    const stats = [
        { label: 'Happy Clients', value: '500+', icon: <Users size={18} className="text-blue-400" /> },
        { label: 'Products', value: '2,000+', icon: <Package size={18} className="text-emerald-400" /> },
        { label: 'Years Experience', value: '10+', icon: <TrendingUp size={18} className="text-orange-400" /> },
        { label: 'Support Rating', value: '4.9★', icon: <Star size={18} className="text-yellow-400" /> },
    ]

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault()
        const term = searchTerm.trim()
        if (!term) {
            navigate('/products')
            return
        }
        navigate(`/products?search=${encodeURIComponent(term)}`)
    }

    return (
        <div className="bg-white dark:bg-[#0D0F14] transition-colors duration-300">

            {/* ─── Hero Section (full viewport, navbar overlaps it) ─── */}
            <section className="relative isolate min-h-screen flex flex-col justify-center overflow-hidden">
                {/* Background image */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat dark:hidden"
                    style={{ backgroundImage: `url(${voltwaveLightBg})` }}
                    aria-hidden="true"
                />
                <div
                    className="absolute inset-0 z-0 hidden bg-cover bg-center bg-no-repeat dark:block"
                    style={{ backgroundImage: `url(${voltwaveDarkBg})` }}
                    aria-hidden="true"
                />

                {/* Overlay — darker for light mode to ensure text contrast */}
                <div className="absolute inset-0 z-[1] bg-gradient-to-br from-blue-900/75 via-slate-900/70 to-indigo-900/65 dark:from-[#0D0F14]/85 dark:via-[#0D0F14]/80 dark:to-[#0D0F14]/75" aria-hidden="true" />

                {/* Glow accents */}
                <div className="absolute top-0 right-0 z-[2] translate-x-1/4 -translate-y-1/4 pointer-events-none">
                    <div className="w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-3xl opacity-60 animate-pulse" />
                </div>
                <div className="absolute bottom-0 left-0 z-[2] -translate-x-1/4 translate-y-1/4 pointer-events-none">
                    <div className="w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl opacity-60" />
                </div>

                {/* Content */}
                <div className="container-custom relative z-10 pt-32 pb-24 md:pt-40 md:pb-32">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-[#F5A623] text-sm font-semibold mb-8 ring-1 ring-inset ring-white/20"
                        >
                            <Zap size={15} />
                            <span>{t('hero.new_arrival')}</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08]"
                        >
                            {t('hero.title')}
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.2 }}
                            className="text-lg md:text-xl text-white/75 mb-10 leading-relaxed max-w-2xl"
                        >
                            {t('hero.subtitle')}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 mb-12"
                        >
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center rounded-xl bg-[#F5A623] px-8 py-4 font-bold text-[#0D0F14] shadow-lg shadow-orange-500/25 transition-all hover:bg-[#D48E1D] hover:shadow-orange-500/40 active:scale-95 group"
                            >
                                {t('hero.cta_products')}
                                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
                            </Link>
                            <Link
                                to="/services"
                                className="inline-flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md px-8 py-4 font-bold text-white ring-1 ring-inset ring-white/25 transition-all hover:bg-white/20 active:scale-95"
                            >
                                {t('hero.cta_services')}
                            </Link>
                        </motion.div>

                        {/* Search bar */}
                        <motion.form
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.4 }}
                            onSubmit={handleSearch}
                            className="w-full max-w-3xl rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-3 shadow-2xl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                                    <input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search AirTAC products, boiler spares, or services…"
                                        className="w-full rounded-2xl border border-white/15 bg-white/10 py-4 pl-11 pr-4 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-[#F5A623]/40 transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="rounded-2xl bg-[#F5A623] px-6 py-4 font-bold text-[#0D0F14] transition-colors hover:bg-[#D48E1D] active:scale-95"
                                >
                                    Search Catalog
                                </button>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {['AirTAC solenoid valve', 'Boiler spare parts', 'AC installation', 'Heat seal machine'].map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => {
                                            setSearchTerm(item)
                                            navigate(`/products?search=${encodeURIComponent(item)}`)
                                        }}
                                        className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/20 hover:text-white transition-all"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </motion.form>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-50">
                    <span className="text-white text-[10px] uppercase tracking-widest">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.4 }}
                        className="w-px h-8 bg-gradient-to-b from-white to-transparent"
                    />
                </div>
            </section>

            {/* ─── Stats Strip ─── */}
            <section className="py-12 bg-blue-600 dark:bg-gradient-to-r dark:from-[#1A1E29] dark:to-[#0D0F14] border-y border-blue-500/30 dark:border-white/5">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 }}
                                className="flex flex-col items-center text-center gap-2"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    {stat.icon}
                                </div>
                                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                                <p className="text-blue-100 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Feature Cards ─── */}
            <section className="py-24 bg-white dark:bg-[#0D0F14]">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-blue-600 dark:text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3"
                        >
                            Why Choose Us
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.08 }}
                            className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white"
                        >
                            Built for Professionals
                        </motion.h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative p-8 rounded-2xl bg-gradient-to-br ${feature.color} border ${feature.border} group hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                            >
                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/8 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Trust / Certification Section ─── */}
            <section className="py-24 bg-slate-50 dark:bg-[#0D0F14]">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Image side */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="flex-1 relative w-full max-w-md lg:max-w-none"
                        >
                            <div className="absolute inset-0 bg-blue-600/8 dark:bg-[#F5A623]/5 rounded-3xl -rotate-3" />
                            <img
                                src={signWithSeal}
                                alt="Certification"
                                className="relative z-10 w-full rounded-3xl shadow-2xl border-8 border-white dark:border-[#1A1E29]"
                            />
                        </motion.div>

                        {/* Text side */}
                        <div className="flex-1">
                            <motion.p
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-blue-600 dark:text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-4"
                            >
                                Our Promise
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.08 }}
                                className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
                            >
                                {t('trust.title')}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.14 }}
                                className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed"
                            >
                                {t('trust.desc')}
                            </motion.p>
                            <motion.ul
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="space-y-3"
                            >
                                {[
                                    t('trust.points.licensed'),
                                    t('trust.points.warranty'),
                                    t('trust.points.verified'),
                                    t('trust.points.eco'),
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                                        <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </motion.ul>
                            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-white/8">
                                <img src={sign} alt="Signature" className="h-12 opacity-80 dark:brightness-0 dark:invert" />
                                <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{t('trust.signatory')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Products CTA ─── */}
            <section className="py-24 bg-white dark:bg-[#0D0F14]">
                <div className="container-custom">
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-[#F5A623] dark:to-[#FF8C00] p-10 md:p-16 shadow-2xl shadow-blue-500/20 dark:shadow-orange-500/10">
                        {/* Decoration */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none">
                            <Battery className="w-80 h-80 text-white rotate-12" />
                        </div>
                        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 opacity-10 pointer-events-none">
                            <Cpu className="w-64 h-64 text-white" />
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
                            <div className="max-w-xl">
                                <p className="text-blue-100 dark:text-[#0D0F14]/70 text-sm font-bold uppercase tracking-widest mb-3">Explore Now</p>
                                <h2 className="text-3xl md:text-5xl font-extrabold text-white dark:text-[#0D0F14] mb-6">
                                    {t('cta.title')}
                                </h2>
                                <p className="text-blue-100 dark:text-[#0D0F14]/70 text-lg mb-8">
                                    {t('cta.desc')}
                                </p>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center justify-center rounded-xl bg-white dark:bg-[#0D0F14] px-8 py-4 text-sm font-bold text-blue-600 dark:text-[#F5A623] shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-black active:scale-95 group"
                                >
                                    {t('cta.button')}
                                    <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={16} />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="w-36 h-36 md:w-44 md:h-44 bg-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center gap-3 hover:-translate-y-2 transition-transform">
                                    <Cpu className="text-white dark:text-[#0D0F14]" size={32} />
                                    <span className="text-white dark:text-[#0D0F14] text-[11px] font-bold uppercase tracking-widest">{t('cta.ics')}</span>
                                </div>
                                <div className="w-36 h-36 md:w-44 md:h-44 bg-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center gap-3 mt-8 hover:-translate-y-2 transition-transform">
                                    <Wifi className="text-white dark:text-[#0D0F14]" size={32} />
                                    <span className="text-white dark:text-[#0D0F14] text-[11px] font-bold uppercase tracking-widest">{t('cta.iot')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Brand Showcase ─── */}
            <section className="py-24 bg-slate-50 dark:bg-[#0D0F14]">
                <div className="container-custom">
                    <div className="flex flex-col items-center text-center mb-16">
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-blue-600 dark:text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-3"
                        >
                            Our Identity
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.08 }}
                            className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4"
                        >
                            {t('brand.title')}
                        </motion.h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
                            {t('brand.desc')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-white/5 p-5 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-white/8 transition-colors hover:-translate-y-1 duration-300"
                        >
                            <img src={voltWaveTech} alt="Volt Wave Tech Banner" className="w-full rounded-2xl dark:brightness-90" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-white/5 p-5 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-white/8 transition-colors hover:-translate-y-1 duration-300"
                        >
                            <img src={visitingCard} alt="Volt Wave Tech Visiting Card" className="w-full rounded-2xl dark:brightness-90" />
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
