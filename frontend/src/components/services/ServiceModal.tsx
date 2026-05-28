import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Zap, Shield, Clock } from 'lucide-react';

interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
}

interface ServiceModalProps {
    service: Service | null;
    isOpen: boolean;
    onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, isOpen, onClose }) => {
    if (!service) return null;

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
                        className="relative w-full max-w-2xl bg-white dark:bg-[#0D0F14] rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10 p-8 md:p-12"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-400 transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                                <Zap size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                    {service.name}
                                </h2>
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest block mt-1">Professional Service</span>
                            </div>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8 border-b border-slate-100 dark:border-white/5 pb-8">
                            {service.description || "Expert electrical solutions provided by our certified team of professionals. This service includes full inspection, implementation, and a comprehensive quality assurance check."}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                <Shield className="text-emerald-500" size={20} />
                                <span className="text-sm font-medium">Certified Team</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                <Clock className="text-orange-500" size={20} />
                                <span className="text-sm font-medium">Quick Turnaround</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto bg-slate-50 dark:bg-white/5 p-6 rounded-2xl">
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Estimated Cost</span>
                                <span className="text-3xl font-black text-slate-900 dark:text-white">
                                    ${service.price}
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    // Normally you would redirect to a booking page
                                    alert("Proceeding to booking...");
                                    onClose();
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-blue-600/30 active:scale-95 flex items-center gap-2"
                            >
                                <Calendar size={20} />
                                Book Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ServiceModal;
