import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { useSiteSettings } from '@/lib/settings'
import finalLogo from '@/assets/images/final_logo.png'

const Footer = () => {
    const { t } = useTranslation()
    const { settings } = useSiteSettings()

    const siteName = settings?.site_name || 'Volt Wave Tech'
    const logoSrc = settings?.logo_url || finalLogo
    const address = settings?.address || t('contact_page.info.address')
    const phone = settings?.phone || '+880 1700-000000'
    const email = settings?.email || 'support@voltwavetech.com'
    const footerText = settings?.footer_text || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`
    const socialLinks = settings?.social_links || { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '', whatsapp: '', tiktok: '' }

    return (
        <footer className="bg-slate-50 dark:bg-[#0D0F14] border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
            <div className="container-custom py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-6">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logoSrc} alt={siteName} className="h-7 object-contain dark:brightness-0 dark:invert" />
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            {settings?.site_description || t('footer.desc')}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {socialLinks.facebook && (
                                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 dark:hover:bg-[#F5A623] hover:text-white dark:hover:text-[#0D0F14] hover:border-blue-600 dark:hover:border-[#F5A623] transition-all">
                                    <Facebook size={18} />
                                </a>
                            )}
                            {socialLinks.instagram && (
                                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-pink-600 dark:hover:bg-[#F5A623] hover:text-white dark:hover:text-[#0D0F14] hover:border-pink-600 dark:hover:border-[#F5A623] transition-all">
                                    <Instagram size={18} />
                                </a>
                            )}
                            {socialLinks.twitter && (
                                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-400 dark:hover:bg-[#F5A623] hover:text-white dark:hover:text-[#0D0F14] hover:border-blue-400 dark:hover:border-[#F5A623] transition-all">
                                    <Twitter size={18} />
                                </a>
                            )}
                            {socialLinks.linkedin && (
                                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-700 dark:hover:bg-[#F5A623] hover:text-white dark:hover:text-[#0D0F14] hover:border-blue-700 dark:hover:border-[#F5A623] transition-all">
                                    <Linkedin size={18} />
                                </a>
                            )}
                            {socialLinks.youtube && (
                                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-red-600 dark:hover:bg-[#F5A623] hover:text-white dark:hover:text-[#0D0F14] hover:border-red-600 dark:hover:border-[#F5A623] transition-all">
                                    <Youtube size={18} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-6">{t('footer.quick_links')}</h4>
                        <ul className="flex flex-col gap-4">
                            <li><Link to="/products" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">{t('nav.products')}</Link></li>
                            <li><Link to="/services" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">{t('nav.services')}</Link></li>
                            <li><Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">{t('nav.about')}</Link></li>
                            <li><Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">{t('nav.contact')}</Link></li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-6">{t('footer.support')}</h4>
                        <ul className="flex flex-col gap-4">
                            <li><Link to="/faq" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">{t('footer.faqs')}</Link></li>
                            <li><Link to="/shipping" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">{t('footer.shipping')}</Link></li>
                            <li><Link to="/returns" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">{t('footer.returns')}</Link></li>
                            <li><Link to="/track-order" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">{t('footer.track')}</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-6">{t('footer.contact_us')}</h4>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-blue-600 dark:text-[#F5A623] shrink-0 mt-0.5" size={18} />
                                <span className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                    {address}
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-blue-600 dark:text-[#F5A623] shrink-0" size={18} />
                                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-slate-500 dark:text-slate-400 text-sm tracking-wide hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors">
                                    {phone}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-blue-600 dark:text-[#F5A623] shrink-0" size={18} />
                                <a href={`mailto:${email}`} className="text-slate-500 dark:text-slate-400 text-sm hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors">
                                    {email}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                    <p className="text-slate-400 dark:text-slate-500 text-xs">
                        {footerText}
                    </p>
                    <div className="flex gap-6">
                        <Link to="/terms" className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-[#F5A623] text-xs transition-colors">{t('footer.terms')}</Link>
                        <Link to="/privacy" className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-[#F5A623] text-xs transition-colors">{t('footer.privacy')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
