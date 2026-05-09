import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, Clock, Battery, Cpu, Wifi } from 'lucide-react'
import { Link } from 'react-router-dom'
import voltWaveTech from '@/assets/images/volt_wave_tech.png'
import visitingCard from '@/assets/images/visiting_card_volt_wave_tech.png'
import signWithSeal from '@/assets/images/Sign_with_seal.jpg'
import sign from '@/assets/images/sign.jpg'

const Home = () => {
    const { t } = useTranslation()

    const features = [
        {
            icon: <Zap className="text-yellow-500" size={24} />,
            title: "Fast Delivery",
            description: "Quick delivery across the country within 24-48 hours."
        },
        {
            icon: <Shield className="text-blue-500" size={24} />,
            title: "Original Products",
            description: "We guarantee 100% authentic and genuine electronics."
        },
        {
            icon: <Clock className="text-emerald-500" size={24} />,
            title: "24/7 Support",
            description: "Our dedicated support team is always ready to help you."
        }
    ]

    return (
        <div className="pb-20 bg-white dark:bg-[#0D0F14] transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                {/* Background Accents */}
                <div className="absolute top-0 right-0 -z-10 translate-x-1/4 -translate-y-1/4 transition-colors">
                    <div className="w-[600px] h-[600px] bg-blue-50/50 dark:bg-blue-500/5 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                </div>
                <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/4 translate-y-1/4">
                    <div className="w-[500px] h-[500px] bg-indigo-50/50 dark:bg-indigo-500/5 rounded-full blur-3xl opacity-60"></div>
                </div>

                <div className="container-custom">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-[#F5A623] text-sm font-semibold mb-8 ring-1 ring-inset ring-blue-600/10 dark:ring-white/10"
                        >
                            <Zap size={16} />
                            <span>New Arrival: Next-Gen Power Modules</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]"
                        >
                            {t('hero.title')}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed"
                        >
                            {t('hero.subtitle')}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link to="/products" className="btn-primary group dark:bg-[#F5A623] dark:text-[#0D0F14] dark:hover:bg-[#D48E1D]">
                                {t('hero.cta_products')}
                                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
                            </Link>
                            <Link to="/services" className="btn-secondary dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10">
                                {t('hero.cta_services')}
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-white dark:bg-[#0D0F14]">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 group hover:bg-white dark:hover:bg-white/5 hover:shadow-xl dark:active:shadow-none hover:border-transparent transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 shadow-sm dark:shadow-none flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-20 bg-white dark:bg-[#0D0F14]">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="flex-1 relative"
                        >
                            <div className="absolute inset-0 bg-blue-600/5 dark:bg-[#F5A623]/5 rounded-3xl -rotate-3 transition-colors"></div>
                            <img
                                src={signWithSeal}
                                alt="Certification"
                                className="relative z-10 w-full rounded-3xl shadow-2xl border-8 border-white dark:border-[#1A1E29]"
                            />
                        </motion.div>
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Certified Quality & Professional Excellence</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                                At Volt Wave Tech, we don't just sell electronics; we deliver excellence. Our products and services are backed by industry certifications and a commitment to the highest standards of safety and performance.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Licensed Electrical Professionals",
                                    "Genuine Manufacturer Warranty",
                                    "Quality Verified and Tested",
                                    "Eco-friendly Power Solutions"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                            <Shield size={14} fill="currentColor" fillOpacity={0.2} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5">
                                <img src={sign} alt="Signature" className="h-12 opacity-80 dark:brightness-0 dark:invert" />
                                <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">Authorized Signatory</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products CTA */}
            <section className="py-20 relative overflow-hidden">
                <div className="container-custom">
                    <div className="bg-blue-600 dark:bg-gradient-to-tr dark:from-[#F5A623] dark:to-[#FF8C00] rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl shadow-blue-200 dark:shadow-[#F5A623]/10">
                        {/* Decoration */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-20 group-hover:rotate-12 transition-transform duration-700">
                            <Battery className="w-64 h-64 text-white rotate-12" />
                        </div>

                        <div className="max-w-xl relative">
                            <h2 className="text-3xl md:text-5xl font-bold text-white dark:text-[#0D0F14] mb-6">Ready to upgrade your workspace?</h2>
                            <p className="text-blue-100 dark:text-[#0D0F14]/70 text-lg mb-8">
                                Explore our wide range of professional tools and expert components designed for engineers and hobbyists alike.
                            </p>
                            <Link to="/products" className="inline-flex items-center justify-center rounded-xl bg-white dark:bg-[#0D0F14] px-8 py-4 text-sm font-bold text-blue-600 dark:text-[#F5A623] shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-black active:scale-95">
                                Shop Collection
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4 relative">
                            <div className="w-40 h-40 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center gap-3 group hover:-translate-y-2 transition-transform">
                                <Cpu className="text-white dark:text-[#0D0F14]" size={32} />
                                <span className="text-white dark:text-[#0D0F14] text-xs font-medium uppercase tracking-widest">Smart ICs</span>
                            </div>
                            <div className="w-40 h-40 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center gap-3 mt-8 group hover:-translate-y-2 transition-transform">
                                <Wifi className="text-white dark:text-[#0D0F14]" size={32} />
                                <span className="text-white dark:text-[#0D0F14] text-xs font-medium uppercase tracking-widest">IoT Modules</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand Showcase */}
            <section className="py-20 bg-slate-50 dark:bg-[#0D0F14]">
                <div className="container-custom">
                    <div className="flex flex-col items-center text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Our Brand Identity</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
                            Volt Wave Tech stands for quality and reliability in the electronics industry.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-white/5 p-4 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors"
                        >
                            <img src={voltWaveTech} alt="Volt Wave Tech Banner" className="w-full rounded-2xl dark:brightness-90" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-white/5 p-4 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors"
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

