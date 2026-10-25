import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Zap } from 'lucide-react'
import { useSiteSettings } from '@/lib/settings'
import finalLogo from '@/assets/images/final_logo.png'

const Footer = () => {
    const { t } = useTranslation()
    const { settings } = useSiteSettings()

    const siteName = settings?.site_name || 'Volt Wave Tech'
    const logoSrc = settings?.logo_url || finalLogo
    const address = settings?.address || t('contact_page.info.address')
    const phone = settings?.phone || '+880 1822-108496'
    const email = settings?.email || 'support@voltwavetech.com'
    const footerText = settings?.footer_text || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`
    const socialLinks = settings?.social_links || { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '', whatsapp: '', tiktok: '' }

    return (
        <footer className="bg-slate-900 dark:bg-[#080A0F] transition-colors duration-300">
            {/* Top strip */}
            <div className="border-b border-white/5">
                <div className="container-custom py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-[#F5A623] flex items-center justify-center">
                            <Zap size={20} className="text-white dark:text-[#0D0F14]" />
                        </div>
                        <p className="text-white font-bold text-lg">
                            Need a custom electronics solution?
                        </p>
                    </div>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 dark:bg-[#F5A623] px-6 py-3 text-sm font-bold text-white dark:text-[#0D0F14] hover:bg-blue-500 dark:hover:bg-[#D48E1D] transition-all active:scale-95 shrink-0"
                    >
                        Get in Touch →
                    </Link>
                </div>
            </div>

            {/* Main footer */}
            <div className="container-custom py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logoSrc} alt={siteName} className="h-8 object-contain brightness-0 invert" />
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {settings?.site_description || t('footer.desc')}
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                            {socialLinks.facebook && (
                                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                                    <Facebook size={16} />
                                </a>
                            )}
                            {socialLinks.instagram && (
                                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all">
                                    <Instagram size={16} />
                                </a>
                            )}
                            {socialLinks.twitter && (
                                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all">
                                    <Twitter size={16} />
                                </a>
                            )}
                            {socialLinks.linkedin && (
                                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all">
                                    <Linkedin size={16} />
                                </a>
                            )}
                            {socialLinks.youtube && (
                                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                                    <Youtube size={16} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t('footer.quick_links')}</h4>
                        <ul className="flex flex-col gap-3">
                            {[
                                { label: t('nav.products'), to: '/products' },
                                { label: t('nav.services'), to: '/services' },
                                { label: t('nav.about'), to: '/about' },
                                { label: t('nav.contact'), to: '/contact' },
                            ].map(link => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-blue-500 dark:bg-[#F5A623] group-hover:w-2 transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t('footer.support')}</h4>
                        <ul className="flex flex-col gap-3">
                            {[
                                { label: t('footer.faqs'), to: '/faq' },
                                { label: t('footer.shipping'), to: '/shipping' },
                                { label: t('footer.returns'), to: '/returns' },
                                { label: t('footer.track'), to: '/track-order' },
                            ].map(link => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-blue-500 dark:bg-[#F5A623] group-hover:w-2 transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t('footer.contact_us')}</h4>
                        <ul className="flex flex-col gap-5">
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-600/15 flex items-center justify-center shrink-0 mt-0.5">
                                    <MapPin className="text-blue-400" size={15} />
                                </div>
                                <span className="text-slate-400 text-sm leading-relaxed">{address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-600/15 flex items-center justify-center shrink-0">
                                    <Phone className="text-emerald-400" size={15} />
                                </div>
                                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-slate-400 text-sm hover:text-white transition-colors">
                                    {phone}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-yellow-600/15 flex items-center justify-center shrink-0">
                                    <Mail className="text-yellow-400" size={15} />
                                </div>
                                <a href={`mailto:${email}`} className="text-slate-400 text-sm hover:text-white transition-colors">
                                    {email}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/5">
                <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                    <p className="text-slate-500 text-xs">{footerText}</p>
                    <div className="flex gap-6">
                        <Link to="/terms" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{t('footer.terms')}</Link>
                        <Link to="/privacy" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{t('footer.privacy')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
