'use client';

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Zap } from 'lucide-react'
import { useSiteSettings } from '@/lib/settings'
const finalLogo = '/images/final_logo.png'

type SocialIconProps = { size?: number }

const Facebook = ({ size = 16 }: SocialIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.4V4.9c-.7-.1-1.6-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3V11H7.5v3h2.3v7h3.7z" />
    </svg>
)

const Twitter = ({ size = 16 }: SocialIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.9 3H22l-6.8 7.8L23 21h-6.3l-4.9-6.4L6.2 21H3l7.3-8.4L2.4 3h6.4l4.4 5.8L18.9 3zm-1.1 16h1.7L7.2 4.7H5.4L17.8 19z" />
    </svg>
)

const Instagram = ({ size = 16 }: SocialIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
)

const Linkedin = ({ size = 16 }: SocialIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.5 8.5H3.8V21h2.7V8.5zM5.1 3A1.6 1.6 0 1 0 5.1 6.2 1.6 1.6 0 0 0 5.1 3zM21 13.9c0-3.7-2-5.5-4.7-5.5-2.2 0-3.2 1.2-3.7 2V8.5H9.9V21h2.7v-6.7c0-1.8.3-3.5 2.5-3.5 2.1 0 2.2 2 2.2 3.6V21H21v-7.1z" />
    </svg>
)

const Youtube = ({ size = 16 }: SocialIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23 12s0-3.4-.4-5c-.3-1.1-1.1-1.9-2.2-2.2C18.8 4.4 12 4.4 12 4.4s-6.8 0-8.4.4c-1.1.3-1.9 1.1-2.2 2.2C1 8.6 1 12 1 12s0 3.4.4 5c.3 1.1 1.1 1.9 2.2 2.2 1.6.4 8.4.4 8.4.4s6.8 0 8.4-.4c1.1-.3 1.9-1.1 2.2-2.2.4-1.6.4-5 .4-5zM9.8 15.5v-7l6 3.5-6 3.5z" />
    </svg>
)

const Footer = () => {
    const { t, i18n } = useTranslation()
    const { settings } = useSiteSettings()
    const isBn = i18n.language === 'bn'

    const siteName = (isBn && settings?.site_name_bn ? settings.site_name_bn : settings?.site_name) || 'Volt Wave Tech'
    const logoSrc = settings?.logo_url || finalLogo
    const address = (isBn && settings?.address_bn ? settings.address_bn : settings?.address) || t('contact_page.info.address')
    const phone = (isBn && settings?.phone_bn ? settings.phone_bn : settings?.phone) || '+880 1822-108496'
    const phoneRaw = settings?.phone || '+880 1822-108496'
    const email = settings?.email || 'support@voltwavetech.com'
    const footerText = (isBn && settings?.footer_text_bn ? settings.footer_text_bn : settings?.footer_text) || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`
    const siteDescription = (isBn && settings?.site_description_bn ? settings.site_description_bn : settings?.site_description) || t('footer.desc')
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
                            {t('footer.strip_title')}
                        </p>
                    </div>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 dark:bg-[#F5A623] px-6 py-3 text-sm font-bold text-white dark:text-[#0D0F14] hover:bg-blue-500 dark:hover:bg-[#D48E1D] transition-all active:scale-95 shrink-0"
                    >
                        {t('footer.strip_btn')}
                    </Link>
                </div>
            </div>

            {/* Main footer */}
            <div className="container-custom py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logoSrc} alt={siteName} width={509} height={73} className="h-8 w-auto object-contain brightness-0 invert" />
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {siteDescription}
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                            {socialLinks.facebook && (
                                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Volt Wave Tech on Facebook"
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                                    <Facebook size={16} />
                                </a>
                            )}
                            {socialLinks.instagram && (
                                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Volt Wave Tech on Instagram"
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all">
                                    <Instagram size={16} />
                                </a>
                            )}
                            {socialLinks.twitter && (
                                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Volt Wave Tech on Twitter"
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all">
                                    <Twitter size={16} />
                                </a>
                            )}
                            {socialLinks.linkedin && (
                                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Volt Wave Tech on LinkedIn"
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all">
                                    <Linkedin size={16} />
                                </a>
                            )}
                            {socialLinks.youtube && (
                                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="Volt Wave Tech on YouTube"
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
                                <a href={`tel:${phoneRaw.replace(/\s+/g, '')}`} className="text-slate-400 text-sm hover:text-white transition-colors">
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
                    <p className="text-slate-400 text-xs">{footerText}</p>
                    <div className="flex items-center gap-6">
                        <Link to="/terms" className="text-slate-400 hover:text-slate-200 text-xs transition-colors">{t('footer.terms')}</Link>
                        <Link to="/privacy" className="text-slate-400 hover:text-slate-200 text-xs transition-colors">{t('footer.privacy')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
