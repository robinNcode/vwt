import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Zap, Shield, Clock, Wrench } from 'lucide-react';
import type { Service } from '../../pages/Services';
import { useTranslation } from 'react-i18next';

interface ServiceModalProps {
    service: Service | null;
    isOpen: boolean;
    onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, isOpen, onClose }) => {
    const { i18n } = useTranslation();

    if (!service) return null;

    const name = i18n.language === 'bn' ? service.name_bn : service.name_en;
    const desc = i18n.language === 'bn'
        ? (service.description_bn || service.description_en || '')
        : (service.description_en || service.description_bn || '');

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-[#0D0F14] rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10"
                    >
                        {/* Header Banner */}
                        <div className="relative h-48 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-[#1A1E29] dark:to-[#0D0F14] overflow-hidden">
                            {service.image_url ? (
                                <img
                                    src={`${import.meta.env.VITE_SERVER_URL}${service.image_url}`}
                                    alt={name}
                                    className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                                />
                            ) : null}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white mb-3 overflow-hidden">
                                    {service.image_url ? (
                                        <img
                                            src={`${import.meta.env.VITE_SERVER_URL}${service.image_url}`}
                                            alt={name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Wrench size={28} />
                                    )}
                                </div>
                                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Professional Service</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors z-20"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 md:p-10">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                                {name}
                            </h2>

                            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8 border-b border-slate-100 dark:border-white/5 pb-8">
                                {desc || "Expert electrical solutions provided by our certified team of professionals. This service includes full inspection, implementation, and a comprehensive quality assurance check."}
                            </p>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {[
                                    { icon: <Shield size={18} className="text-emerald-500" />, label: 'Certified Team' },
                                    { icon: <Clock size={18} className="text-orange-500" />, label: 'Quick Turnaround' },
                                    { icon: <Zap size={18} className="text-blue-500 dark:text-[#F5A623]" />, label: '24/7 Support' },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 text-center">
                                        {item.icon}
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5">
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        {service.price ? 'Estimated Cost' : 'Pricing'}
                                    </span>
                                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                                        {service.price ? `৳${service.price.toLocaleString()}` : 'Contact Us'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        alert("Redirecting to booking...");
                                        onClose();
                                    }}
                                    className="bg-blue-600 dark:bg-[#F5A623] hover:bg-blue-700 dark:hover:bg-[#D48E1D] text-white dark:text-[#0D0F14] px-8 py-4 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-blue-600/30 active:scale-95 flex items-center gap-2"
                                >
                                    <Calendar size={18} />
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ServiceModal;
