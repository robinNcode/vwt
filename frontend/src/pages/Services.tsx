import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/ui/Skeleton';
import { Zap, Shield, Clock, Wrench, ShoppingCart, CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import api from '../lib/axios';
import { useCartStore } from '../lib/cart';
import { getMediaUrl } from '../lib/media';
import ServiceModal from '../components/services/ServiceModal';

export interface Service {
    id: number;
    name_en: string;
    name_bn: string;
    description_en?: string;
    description_bn?: string;
    price: number | null;
    image_url?: string;
    slug: string;
    is_active: boolean;
    sort_order: number;
}

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
    }),
};

const trustBadges = [
    { icon: Shield, label: 'Certified Professionals', desc: 'ISO-grade expertise' },
    { icon: Clock, label: '24/7 Priority Support', desc: 'Always here for you' },
    { icon: Zap, label: 'Quick Turnaround', desc: 'Fast, reliable delivery' },
];

const Services: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/services');
                if (response.data.success) {
                    setServices(response.data.data.items || response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch services:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const getName = (s: Service) => i18n.language === 'bn' ? s.name_bn : s.name_en;
    const getDesc = (s: Service) =>
        i18n.language === 'bn' ? (s.description_bn || s.description_en || '') : (s.description_en || s.description_bn || '');

    const ServiceSkeleton = () => (
        <div className="bg-white dark:bg-[#1A1E29] rounded-2xl border border-slate-100 dark:border-white/5 p-8 space-y-4">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <Skeleton className="h-8 w-2/3" variant="text" />
            <Skeleton className="h-20 w-full" variant="text" />
            <div className="flex items-center justify-between pt-4">
                <Skeleton className="h-6 w-1/4" variant="text" />
                <Skeleton className="h-12 w-32 rounded-xl" />
            </div>
        </div>
    );

    return (
        <>
            {/* ── Page Hero ── */}
            <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 overflow-hidden">
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                {/* Glows */}
                <div className="absolute -top-40 right-0 w-[560px] h-[560px] rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

                <div className="container-custom relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={0}
                        className="flex items-center gap-2 mb-5"
                    >
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
                            <Layers size={12} />
                            What We Offer
                        </span>
                    </motion.div>

                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={1}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight max-w-3xl"
                    >
                        {t('nav.services')}
                    </motion.h1>

                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={2}
                        className="text-white/75 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
                    >
                        Professional electrical engineering and support services tailored for your industrial and commercial needs.
                    </motion.p>

                    {/* Trust badge pills in hero */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={3}
                        className="flex flex-wrap gap-3"
                    >
                        {trustBadges.map((badge, i) => {
                            const Icon = badge.icon;
                            return (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm"
                                >
                                    <Icon size={15} className="text-[#F5A623]" />
                                    {badge.label}
                                </span>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ── Stats / Trust Strip ── */}
            <div className="bg-white dark:bg-[#1A1E29] border-b border-slate-100 dark:border-white/5">
                <div className="container-custom py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-white/5">
                        {trustBadges.map((badge, i) => {
                            const Icon = badge.icon;
                            return (
                                <div key={i} className="flex items-center gap-4 py-4 sm:py-0 sm:px-8 first:pl-0 last:pr-0">
                                    <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-[#F5A623] border border-blue-100 dark:border-blue-500/20 shrink-0">
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{badge.label}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">{badge.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Services Grid ── */}
            <div className="bg-slate-50 dark:bg-[#0D0F14]">
                <div className="container-custom py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => <ServiceSkeleton key={i} />)
                        ) : services.length > 0 ? (
                            services.map((service, idx) => {
                                const name = getName(service);
                                const desc = getDesc(service);
                                return (
                                    <motion.div
                                        key={service.id}
                                        initial="hidden"
                                        animate="visible"
                                        variants={fadeUp}
                                        custom={idx % 6}
                                        onClick={() => setSelectedService(service)}
                                        className="group relative bg-white dark:bg-[#1A1E29] rounded-2xl border border-slate-100 dark:border-white/5 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                                    >
                                        {/* Colored top-border accent */}
                                        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-slate-100 dark:bg-white/5 group-hover:bg-blue-500 dark:group-hover:bg-[#F5A623] transition-colors duration-300" />

                                        {/* Icon */}
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-[#F5A623] flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 border border-blue-100 dark:border-blue-500/20">
                                            {service.image_url ? (
                                                <img
                                                    src={getMediaUrl(service.image_url)}
                                                    alt={name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Wrench size={30} />
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-[#F5A623] transition-colors leading-snug">
                                            {name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 line-clamp-3 text-sm">
                                            {desc || 'Expert electrical solutions provided by our certified team of professionals.'}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-5 border-t border-slate-50 dark:border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {service.price ? 'Starts from' : 'Pricing'}
                                                </span>
                                                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                                                    {service.price ? `৳${service.price.toLocaleString()}` : 'Contact Us'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedService(service);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900/5 dark:bg-white/5 text-slate-700 dark:text-white px-4 py-2.5 text-sm font-bold hover:bg-slate-900/10 dark:hover:bg-white/10 transition-colors"
                                                >
                                                    Details
                                                    <ArrowRight size={14} />
                                                </button>
                                                {service.price && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            addToCart({ serviceId: service.id, quantity: 1, service });
                                                        }}
                                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 dark:bg-[#F5A623] text-white dark:text-[#0D0F14] px-4 py-2.5 text-sm font-bold hover:bg-blue-700 dark:hover:bg-[#D48E1D] transition-colors shadow-lg shadow-blue-200 dark:shadow-[#F5A623]/10"
                                                    >
                                                        <ShoppingCart size={16} />
                                                        Add
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="col-span-full py-24 flex flex-col items-center justify-center gap-5 text-center bg-white dark:bg-[#1A1E29] rounded-2xl border border-slate-100 dark:border-white/5"
                                >
                                    <div className="w-24 h-24 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center shadow-sm">
                                        <Wrench size={48} strokeWidth={1} className="text-slate-300 dark:text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-1">No services listed</p>
                                        <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">
                                            Please check back later — new services are being added.
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Why Choose Us strip ── */}
            {!loading && services.length > 0 && (
                <div className="bg-white dark:bg-[#1A1E29] border-t border-slate-100 dark:border-white/5">
                    <div className="container-custom py-12">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                            <div className="max-w-md">
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-[#F5A623] mb-2">Why Volt Wave Tech?</p>
                                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                                    Trusted by leading industrial partners across Bangladesh
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[
                                    { stat: '500+', label: 'Projects Delivered' },
                                    { stat: '98%', label: 'Client Satisfaction' },
                                    { stat: '12+', label: 'Years Experience' },
                                ].map((item, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-3xl font-extrabold text-blue-600 dark:text-[#F5A623]">{item.stat}</p>
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ServiceModal
                service={selectedService}
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
            />
        </>
    );
};

export default Services;
