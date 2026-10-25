import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useSiteSettings } from '@/lib/settings'

const Contact = () => {
    const { t, i18n } = useTranslation()
    const { settings } = useSiteSettings()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })

    const isBn = i18n.language === 'bn'
    const address = (isBn && settings?.address_bn ? settings.address_bn : settings?.address) || t('contact_page.info.address')
    const email = settings?.email || 'support@voltwavetech.com'
    const phone = (isBn && settings?.phone_bn ? settings.phone_bn : settings?.phone) || '+880 1822-108496'
    const phoneRaw = settings?.phone || '+880 1822-108496'
    const phone2 = (isBn && settings?.phone2_bn ? settings.phone2_bn : settings?.phone2)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const apiBaseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.voltwavebd.com/api/v1'
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
        <div className="bg-white dark:bg-[#0D0F14] transition-colors duration-300">

            {/* ── Page Hero ── */}
            <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 pt-32 pb-24 overflow-hidden">
                {/* decorative blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-700/20 blur-3xl" />
                </div>

                <div className="container-custom relative z-10">
                    {/* Eyebrow pill */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium backdrop-blur-sm">
                            <Mail size={14} />
                            Get In Touch
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6 max-w-3xl leading-tight"
                    >
                        {t('contact_page.title')}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 }}
                        className="text-xl text-white/75 leading-relaxed max-w-2xl mb-10"
                    >
                        {settings?.site_tagline || t('contact_page.subtitle')}
                    </motion.p>

                    {/* Inline contact info pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 }}
                        className="flex flex-wrap gap-3"
                    >
                        <a
                            href={`tel:${phone.replace(/\s+/g, '')}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/85 text-sm hover:bg-white/20 transition-colors backdrop-blur-sm"
                        >
                            <Phone size={13} />
                            {phone}
                        </a>
                        <a
                            href={`mailto:${email}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/85 text-sm hover:bg-white/20 transition-colors backdrop-blur-sm"
                        >
                            <Mail size={13} />
                            {email}
                        </a>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/85 text-sm backdrop-blur-sm">
                            <MapPin size={13} />
                            {address}
                        </span>
                    </motion.div>
                </div>
            </section>

            {/* ── Main Content ── */}
            <section className="py-20 bg-white dark:bg-[#0D0F14]">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                        {/* ── Left: 3 separate contact cards ── */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            {/* Address card */}
                            <motion.div
                                initial={{ opacity: 0, x: -24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0 }}
                                className="p-7 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex gap-5 items-start"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                                    <MapPin size={22} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-base">
                                        {t('contact_page.info.address_title')}
                                    </h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                        {address}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Email card */}
                            <motion.div
                                initial={{ opacity: 0, x: -24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.08 }}
                                className="p-7 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex gap-5 items-start"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                                    <Mail size={22} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-base">
                                        {t('contact_page.info.email_title')}
                                    </h4>
                                    <a
                                        href={`mailto:${email}`}
                                        className="text-slate-500 dark:text-slate-400 text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                    >
                                        {email}
                                    </a>
                                </div>
                            </motion.div>

                            {/* Phone card */}
                            <motion.div
                                initial={{ opacity: 0, x: -24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.16 }}
                                className="p-7 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex gap-5 items-start"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center text-yellow-600 shrink-0">
                                    <Phone size={22} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-base">
                                        {t('contact_page.info.phone_title')}
                                    </h4>
                                    <a
                                        href={`tel:${phoneRaw.replace(/\s+/g, '')}`}
                                        className="text-slate-500 dark:text-slate-400 text-sm hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors block"
                                    >
                                        {phone}
                                    </a>
                                    {phone2 && (
                                        <a
                                            href={`tel:${(settings?.phone2 || phone2).replace(/\s+/g, '')}`}
                                            className="text-slate-500 dark:text-slate-400 text-sm hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors block mt-1"
                                        >
                                            {phone2}
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* ── Right: Contact Form ── */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-[#1A1E29] rounded-3xl border border-slate-100 dark:border-white/[0.08] shadow-xl shadow-slate-200/30 dark:shadow-none p-8 md:p-12"
                            >
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                                    {t('contact_page.form.heading', 'Send Us a Message')}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                {t('contact_page.form.name')}
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-blue-500 dark:focus:border-[#F5A623] focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-[#F5A623]/20 outline-none transition-all dark:text-white text-slate-900 placeholder:text-slate-400"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                {t('contact_page.form.email')}
                                            </label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-blue-500 dark:focus:border-[#F5A623] focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-[#F5A623]/20 outline-none transition-all dark:text-white text-slate-900 placeholder:text-slate-400"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                {t('contact_page.form.phone')}
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-blue-500 dark:focus:border-[#F5A623] focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-[#F5A623]/20 outline-none transition-all dark:text-white text-slate-900 placeholder:text-slate-400"
                                                placeholder="+880..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                {t('contact_page.form.subject')}
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-blue-500 dark:focus:border-[#F5A623] focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-[#F5A623]/20 outline-none transition-all dark:text-white text-slate-900 placeholder:text-slate-400"
                                                placeholder="Product Query"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {t('contact_page.form.message')}
                                        </label>
                                        <textarea
                                            required
                                            name="message"
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-blue-500 dark:focus:border-[#F5A623] focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-[#F5A623]/20 outline-none transition-all dark:text-white text-slate-900 placeholder:text-slate-400 resize-none"
                                            placeholder="How can we help you?"
                                        />
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#F5A623] dark:to-amber-500 text-white dark:text-[#0D0F14] font-bold text-base shadow-lg shadow-blue-600/25 dark:shadow-amber-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
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
            </section>

        </div>
    )
}

export default Contact
