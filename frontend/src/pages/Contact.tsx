import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const Contact = () => {
    const { t } = useTranslation()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const apiBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8083/api/v1'
            await axios.post(`${apiBaseURL}/contact-messages`, formData)
            toast.success(t('contact_page.form.success'))
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            })
        } catch (error) {
            console.error('Contact form error:', error)
            toast.error(t('contact_page.form.error'))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div className="pt-32 pb-20 bg-white dark:bg-[#0D0F14] transition-colors duration-300">
            <div className="container-custom">
                <div className="max-w-3xl mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6"
                    >
                        {t('contact_page.title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 dark:text-slate-400"
                    >
                        {t('contact_page.subtitle')}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5"
                        >
                            <div className="flex flex-col gap-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">{t('contact_page.info.address_title')}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                            {t('contact_page.info.address')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">{t('contact_page.info.email_title')}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">support@voltwavetech.com</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center text-yellow-600 shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">{t('contact_page.info.phone_title')}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">+880 1234 567890</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-white/[0.02] p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-none"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('contact_page.form.name')}</label>
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-blue-600 dark:focus:border-[#F5A623] outline-none transition-all dark:text-white"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('contact_page.form.email')}</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-blue-600 dark:focus:border-[#F5A623] outline-none transition-all dark:text-white"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('contact_page.form.phone')}</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-blue-600 dark:focus:border-[#F5A623] outline-none transition-all dark:text-white"
                                            placeholder="+880..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('contact_page.form.subject')}</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-blue-600 dark:focus:border-[#F5A623] outline-none transition-all dark:text-white"
                                            placeholder="Product Query"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('contact_page.form.message')}</label>
                                    <textarea
                                        required
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-blue-600 dark:focus:border-[#F5A623] outline-none transition-all dark:text-white resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full btn-primary py-4 text-base bg-blue-600 dark:bg-[#F5A623] dark:text-[#0D0F14] flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            {t('contact_page.form.sending')}
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            {t('contact_page.form.submit')}
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
