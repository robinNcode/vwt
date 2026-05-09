import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from '../components/ui/Skeleton';
import watermark from '@/assets/images/invoice_quatation_watermark.png';
import { Zap, Shield, Clock } from 'lucide-react';

interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
}

const Services: React.FC = () => {
    const { t } = useTranslation();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                // Simulate network delay for skeleton visibility
                await new Promise(resolve => setTimeout(resolve, 1500));
                const response = await fetch('http://localhost:8083/api/v1/services');
                const data = await response.json();
                if (data.success) {
                    setServices(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const ServiceSkeleton = () => (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
            <Skeleton className="w-12 h-12 rounded-2xl" />
            <Skeleton className="h-8 w-2/3" variant="text" />
            <Skeleton className="h-20 w-full" variant="text" />
            <div className="flex items-center justify-between pt-4">
                <Skeleton className="h-6 w-1/4" variant="text" />
                <Skeleton className="h-12 w-32 rounded-xl" />
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-slate-50/50">
            {/* Watermark Background */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale"
                style={{
                    backgroundImage: `url(${watermark})`,
                    backgroundSize: '400px',
                    backgroundRepeat: 'repeat'
                }}
            ></div>

            <div className="container-custom relative z-10">
                <div className="max-w-3xl mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">{t('nav.services')}</h1>
                    <p className="text-slate-600 text-xl leading-relaxed">
                        Professional electrical engineering and support services tailored for your industrial and commercial needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {loading ? (
                        Array(4).fill(0).map((_, i) => <ServiceSkeleton key={i} />)
                    ) : services.length > 0 ? (
                        services.map((service) => (
                            <div key={service.id} className="group bg-white rounded-3xl border border-slate-100 p-8 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 hover:-translate-y-1">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <Zap size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.name}</h3>
                                <p className="text-slate-500 leading-relaxed mb-8">
                                    {service.description || "Expert electrical solutions provided by our certified team of professionals."}
                                </p>
                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Starts from</span>
                                        <span className="text-2xl font-extrabold text-slate-900">${service.price}</span>
                                    </div>
                                    <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100">
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
                        <div key={i} className="flex items-center gap-4 text-slate-600">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                                {badge.icon}
                            </div>
                            <span className="font-bold text-sm uppercase tracking-wider">{badge.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;

