import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from '../components/ui/Skeleton';
import watermark from '@/assets/images/invoice_quatation_watermark.png';
import { Zap, Shield, Clock, Wrench } from 'lucide-react';
import api from '../lib/axios';
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

const Services: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

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
        <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
            <Skeleton className="w-14 h-14 rounded-2xl" />
            <Skeleton className="h-8 w-2/3" variant="text" />
            <Skeleton className="h-20 w-full" variant="text" />
            <div className="flex items-center justify-between pt-4">
                <Skeleton className="h-6 w-1/4" variant="text" />
                <Skeleton className="h-12 w-32 rounded-xl" />
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-slate-50/50 dark:bg-[#0D0F14]">
            {/* Watermark Background */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale"
                style={{
                    backgroundImage: `url(${watermark})`,
                    backgroundSize: '400px',
                    backgroundRepeat: 'repeat'
                }}
            />

            <div className="container-custom relative z-10">
                <div className="max-w-3xl mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">{t('nav.services')}</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-xl leading-relaxed">
                        Professional electrical engineering and support services tailored for your industrial and commercial needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {loading ? (
                        Array(4).fill(0).map((_, i) => <ServiceSkeleton key={i} />)
                    ) : services.length > 0 ? (
                        services.map((service) => {
                            const name = getName(service);
                            const desc = getDesc(service);
                            return (
                                <div
                                    key={service.id}
                                    onClick={() => setSelectedService(service)}
                                    className="group bg-white dark:bg-[#1A1E29] rounded-3xl border border-slate-100 dark:border-white/5 p-8 hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-black/30 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                                >
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-[#F5A623] flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 border border-blue-100 dark:border-blue-500/20">
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
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-[#F5A623] transition-colors">
                                        {name}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 line-clamp-3">
                                        {desc || "Expert electrical solutions provided by our certified team of professionals."}
                                    </p>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                {service.price ? 'Starts from' : 'Pricing'}
                                            </span>
                                            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                                                {service.price ? `৳${service.price.toLocaleString()}` : 'Contact Us'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedService(service);
                                            }}
                                            className="bg-blue-600 dark:bg-[#F5A623] text-white dark:text-[#0D0F14] px-6 py-3 rounded-xl font-bold hover:bg-blue-700 dark:hover:bg-[#D48E1D] transition-colors shadow-lg shadow-blue-200 dark:shadow-[#F5A623]/10"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white dark:bg-[#1A1E29] rounded-3xl border border-slate-100 dark:border-white/5">
                            <Wrench size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-4" strokeWidth={1} />
                            <p className="text-slate-500 text-xl font-medium">No services listed at the moment.</p>
                        </div>
                    )}
                </div>

                {/* Trust Badges */}
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {[
                        { icon: <Shield size={20} />, text: "Certified Professionals" },
                        { icon: <Clock size={20} />, text: "24/7 Priority Support" },
                        { icon: <Zap size={20} />, text: "Quick Turnaround" }
                    ].map((badge, i) => (
                        <div key={i} className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-white/5 shadow-sm flex items-center justify-center text-blue-600 dark:text-[#F5A623] border border-slate-100 dark:border-white/5">
                                {badge.icon}
                            </div>
                            <span className="font-bold text-sm uppercase tracking-wider">{badge.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <ServiceModal
                service={selectedService}
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
            />
        </div>
    );
};

export default Services;
