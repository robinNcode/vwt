import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import finalLogo from '@/assets/images/final_logo.png'

const Footer = () => {
    const { t } = useTranslation()

    return (
        <footer className="bg-slate-50 dark:bg-[#0D0F14] border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
            <div className="container-custom py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-6">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={finalLogo} alt="Volt Wave Tech" className="h-6 object-contain dark:brightness-0 dark:invert" />
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Your destination for premium electronics and professional electrical services.
                            We bring power to your life with quality and trust.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 dark:hover:bg-[#F5A623] hover:text-white dark:hover:text-[#0D0F14] hover:border-blue-600 dark:hover:border-[#F5A623] transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 dark:hover:bg-[#F5A623] hover:text-white dark:hover:text-[#0D0F14] hover:border-blue-600 dark:hover:border-[#F5A623] transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 dark:hover:bg-[#F5A623] hover:text-white dark:hover:text-[#0D0F14] hover:border-blue-600 dark:hover:border-[#F5A623] transition-all">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-6">Quick Links</h4>
                        <ul className="flex flex-col gap-4">
                            <li><Link to="/products" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">Products</Link></li>
                            <li><Link to="/services" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">Services</Link></li>
                            <li><Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">About Us</Link></li>
                            <li><Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-6">Support</h4>
                        <ul className="flex flex-col gap-4">
                            <li><Link to="/faq" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">FAQs</Link></li>
                            <li><Link to="/shipping" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">Shipping Policy</Link></li>
                            <li><Link to="/returns" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">Return Policy</Link></li>
                            <li><Link to="/track-order" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors text-sm">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-6">Contact Us</h4>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-blue-600 dark:text-[#F5A623] shrink-0" size={18} />
                                <span className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                    Hosna Plaza, Mirpur-10, Dhaka-1216, Bangladesh
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-blue-600 dark:text-[#F5A623] shrink-0" size={18} />
                                <span className="text-slate-500 dark:text-slate-400 text-sm tracking-wide">+880 1234 567890</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-blue-600 dark:text-[#F5A623] shrink-0" size={18} />
                                <span className="text-slate-500 dark:text-slate-400 text-sm">support@voltwavetech.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                    <p className="text-slate-400 dark:text-slate-500 text-xs">
                        © {new Date().getFullYear()} Volt Wave Tech. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link to="/terms" className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-[#F5A623] text-xs transition-colors">Terms of Service</Link>
                        <Link to="/privacy" className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-[#F5A623] text-xs transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
