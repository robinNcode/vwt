import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Target, Eye, ShieldCheck, Heart, Zap } from 'lucide-react'

const About = () => {
    const { t } = useTranslation()

    const values = [
        {
            icon: <ShieldCheck className="text-blue-500" size={32} />,
            title: t('about_page.values.quality'),
            desc: t('about_page.values.quality_desc')
        },
        {
            icon: <Heart className="text-red-500" size={32} />,
            title: t('about_page.values.integrity'),
            desc: t('about_page.values.integrity_desc')
        },
        {
            icon: <Zap className="text-yellow-500" size={32} />,
            title: t('about_page.values.innovation'),
            desc: t('about_page.values.innovation_desc')
        }
    ]

    return (
        <div className="pt-32 pb-20 bg-white dark:bg-[#0D0F14] transition-colors duration-300">
            <div className="container-custom">
                {/* Header */}
                <div className="max-w-3xl mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6"
                    >
                        {t('about_page.title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed"
                    >
                        {t('about_page.subtitle')}
                    </motion.p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                            <Target size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('about_page.mission_title')}</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {t('about_page.mission_desc')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-emerald-600/20">
                            <Eye size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('about_page.vision_title')}</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {t('about_page.vision_desc')}
                        </p>
                    </motion.div>
                </div>

                {/* Values */}
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">{t('about_page.values.title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-transparent hover:shadow-xl transition-all duration-300 text-center"
                            >
                                <div className="inline-flex items-center justify-center mb-6">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{value.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                                    {value.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
