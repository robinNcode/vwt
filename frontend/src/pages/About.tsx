import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Target, Eye, ShieldCheck, Heart, Zap, Users, Package, Clock, CalendarCheck, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const About = () => {
    const { t } = useTranslation()

    const values = [
        {
            icon: <ShieldCheck size={36} />,
            title: t('about_page.values.quality'),
            desc: t('about_page.values.quality_desc'),
            gradient: 'from-blue-500 to-blue-700',
            bg: 'bg-blue-50 dark:bg-blue-500/10',
            border: 'border-blue-100 dark:border-blue-500/20',
            iconColor: 'text-white',
        },
        {
            icon: <Heart size={36} />,
            title: t('about_page.values.integrity'),
            desc: t('about_page.values.integrity_desc'),
            gradient: 'from-rose-500 to-red-700',
            bg: 'bg-rose-50 dark:bg-rose-500/10',
            border: 'border-rose-100 dark:border-rose-500/20',
            iconColor: 'text-white',
        },
        {
            icon: <Zap size={36} />,
            title: t('about_page.values.innovation'),
            desc: t('about_page.values.innovation_desc'),
            gradient: 'from-amber-400 to-yellow-600',
            bg: 'bg-amber-50 dark:bg-amber-500/10',
            border: 'border-amber-100 dark:border-amber-500/20',
            iconColor: 'text-white',
        },
    ]

    const stats = [
        { icon: <CalendarCheck size={28} />, label: 'Years of Experience', value: '10+' },
        { icon: <Users size={28} />, label: 'Happy Clients', value: '500+' },
        { icon: <Package size={28} />, label: 'Products Delivered', value: '2000+' },
        { icon: <Clock size={28} />, label: 'Support', value: '24/7' },
    ]

    return (
        <div className="bg-white dark:bg-[#0D0F14] transition-colors duration-300">

            {/* ── Page Hero ── */}
            <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 pt-32 pb-20 overflow-hidden">
                {/* decorative blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-700/20 blur-3xl" />
                </div>

                <div className="container-custom relative z-10">
                    {/* Eyebrow pill */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium backdrop-blur-sm">
                            <CalendarCheck size={14} />
                            Since 2015
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6 max-w-3xl leading-tight"
                    >
                        {t('about_page.title')}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 }}
                        className="text-xl text-white/75 leading-relaxed max-w-2xl"
                    >
                        {t('about_page.subtitle')}
                    </motion.p>
                </div>
            </section>

            {/* ── Stats Strip ── */}
            <section className="bg-blue-600 dark:bg-blue-700 py-12">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="flex flex-col items-center text-center text-white"
                            >
                                <div className="mb-3 text-white/80">{stat.icon}</div>
                                <div className="text-4xl font-extrabold">{stat.value}</div>
                                <div className="text-white/75 text-sm mt-1 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Mission & Vision ── */}
            <section className="py-24 bg-slate-50 dark:bg-[#0D0F14]">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-10 rounded-3xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-8 shadow-lg shadow-blue-600/30">
                                <Target size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                {t('about_page.mission_title')}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                                {t('about_page.mission_desc')}
                            </p>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-10 rounded-3xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-8 shadow-lg shadow-emerald-600/30">
                                <Eye size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                {t('about_page.vision_title')}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                                {t('about_page.vision_desc')}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Core Values ── */}
            <section className="py-24 bg-white dark:bg-[#0D0F14]">
                <div className="container-custom">
                    {/* Section header */}
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4 border border-blue-100 dark:border-blue-500/20"
                        >
                            Our Core Values
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.06 }}
                            className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white"
                        >
                            {t('about_page.values.title')}
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-10 rounded-3xl border ${value.bg} ${value.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center`}
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                    <span className={value.iconColor}>{value.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{value.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                                    {value.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Closing CTA ── */}
            <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
                <div className="container-custom text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-extrabold text-white mb-4"
                    >
                        Ready to work with us?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.08 }}
                        className="text-white/75 text-lg mb-10 max-w-xl mx-auto"
                    >
                        Let's build something great together. Reach out and our team will get back to you quickly.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.14 }}
                    >
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-blue-700 font-bold text-base hover:bg-blue-50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Contact Us
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>

        </div>
    )
}

export default About
