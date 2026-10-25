import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShoppingBag, Truck, RotateCcw, CreditCard, Shield, Wrench, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface FAQItem {
    q: string;
    a: string;
}
interface FAQCategory {
    id: string;
    label: string;
    icon: React.ElementType;
    color: string;
    items: FAQItem[];
}

const faqData: FAQCategory[] = [
    {
        id: 'ordering',
        label: 'Ordering & Payment',
        icon: ShoppingBag,
        color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        items: [
            {
                q: 'How do I place an order on Volt Wave Tech?',
                a: 'You can place an order by browsing our Products page, adding items to your cart, and completing checkout. You can also call us at +880 1822-108496 to place an order over the phone.'
            },
            {
                q: 'What payment methods do you accept?',
                a: 'We accept Cash on Delivery (COD), bKash, Nagad, Rocket, bank transfer (DBBL, Dutch-Bangla, BRAC Bank), and credit/debit cards. COD is available within Dhaka and major districts.'
            },
            {
                q: 'Is Cash on Delivery (COD) available?',
                a: 'Yes, COD is available across Bangladesh. For orders outside Dhaka, COD may be subject to availability depending on the courier partner\'s coverage area.'
            },
            {
                q: 'Can I modify or cancel my order after placing it?',
                a: 'Orders can be modified or cancelled within 1 hour of placement. Once the order is moved to "Processing" status, cancellation is not guaranteed. Please contact us immediately at support@voltwavetech.com or call us.'
            },
            {
                q: 'Is there a minimum order value?',
                a: 'There is no minimum order value for most products. However, free shipping thresholds may apply. Orders above ৳1,000 qualify for reduced shipping rates.'
            },
            {
                q: 'How do I get a VAT invoice?',
                a: 'A digital invoice is automatically generated and sent to your email after order confirmation. You can also request a printed invoice upon delivery. For B2B VAT invoices, please contact us with your BIN number.'
            },
        ]
    },
    {
        id: 'shipping',
        label: 'Shipping & Delivery',
        icon: Truck,
        color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
        items: [
            {
                q: 'How long does delivery take?',
                a: 'Delivery within Dhaka city takes 1–3 business days. For other districts in Bangladesh, delivery takes 3–7 business days depending on courier availability and your location.'
            },
            {
                q: 'What are the shipping charges?',
                a: 'Dhaka city: ৳60–৳80 flat rate. Outside Dhaka (district towns): ৳100–৳150. Remote/upazila areas: ৳120–৳180. Orders above ৳2,000 may qualify for free shipping within Dhaka.'
            },
            {
                q: 'Which courier services do you use?',
                a: 'We partner with Pathao Courier, Paperfly, RedX, Sundarban Courier, and SA Paribahan for nationwide deliveries. The courier is selected based on your location for the fastest delivery.'
            },
            {
                q: 'Do you deliver outside Bangladesh?',
                a: 'Currently, we only deliver within Bangladesh. For international inquiries, please contact us directly and we can discuss special arrangements.'
            },
            {
                q: 'How can I track my order?',
                a: 'You can track your order on our Track Order page using your order number. You will also receive SMS/email updates at each status change. The tracking number for the courier will be shared once the parcel is dispatched.'
            },
        ]
    },
    {
        id: 'returns',
        label: 'Returns & Refunds',
        icon: RotateCcw,
        color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
        items: [
            {
                q: 'What is your return policy?',
                a: 'We offer a 7-day return policy for most products from the date of delivery, provided the item is unused, in original packaging, and accompanied by proof of purchase. Electronic components must be in sealed condition unless defective.'
            },
            {
                q: 'How do I request a return?',
                a: 'To initiate a return, contact us at support@voltwavetech.com or call +880 1822-108496 within 7 days of delivery. Provide your order number and reason for return. Our team will arrange pickup.'
            },
            {
                q: 'When will I receive my refund?',
                a: 'Refunds are processed within 5–7 business days after we receive and inspect the returned item. For bKash/Nagad payments, refunds are instant once approved. For bank transfers, allow 3–5 banking days.'
            },
            {
                q: 'What items cannot be returned?',
                a: 'The following items are non-returnable: opened electronic ICs/modules (unless defective), custom-ordered items, consumables (solder, flux, etc.), items damaged due to misuse, and products without original packaging.'
            },
            {
                q: 'What if I receive a defective or wrong product?',
                a: 'If you receive a defective or incorrect item, please contact us within 48 hours of delivery with photos/video of the issue. We will arrange a free replacement or full refund, including return shipping costs.'
            },
        ]
    },
    {
        id: 'products',
        label: 'Products & Warranty',
        icon: Package,
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        items: [
            {
                q: 'Are your products genuine and original?',
                a: 'Yes, all our products are 100% genuine and sourced directly from authorized manufacturers and importers. We never stock counterfeit or low-quality replicas. Each product comes with authenticity verification where applicable.'
            },
            {
                q: 'Do products come with a warranty?',
                a: 'Most electronics and components carry a manufacturer warranty ranging from 3 months to 1 year. The warranty period is mentioned on each product page. Service warranty for installation/repair work is 30–90 days.'
            },
            {
                q: 'Can I get a product demo or datasheet?',
                a: 'Yes! You can request datasheets, technical specifications, or demo videos for any product by contacting our team. We also have technical support staff who can guide you on component selection.'
            },
            {
                q: 'Do you offer bulk/wholesale pricing?',
                a: 'Yes, we offer special pricing for bulk orders (typically 50+ units) and registered business customers. Contact us at support@voltwavetech.com with your requirements for a customized quotation.'
            },
            {
                q: 'How do I know if a product is in stock?',
                a: 'Stock availability is shown on each product page in real-time. If a product is out of stock, you can request a notification or place a pre-order for upcoming stock arrivals.'
            },
        ]
    },
    {
        id: 'security',
        label: 'Account & Security',
        icon: Shield,
        color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        items: [
            {
                q: 'Is my personal information safe?',
                a: 'Yes, your data is protected with industry-standard encryption (SSL/TLS). We never share your personal information with third parties without your consent, except as required by Bangladesh law.'
            },
            {
                q: 'How do I reset my password?',
                a: 'Click "Forgot Password" on the Login page and enter your registered email. You will receive a password reset link within a few minutes. If you don\'t receive it, check your spam folder or contact support.'
            },
            {
                q: 'Can I use the website without creating an account?',
                a: 'Yes, guest checkout is available. However, creating an account lets you track orders, view order history, save shipping addresses, and get personalized recommendations.'
            },
        ]
    },
    {
        id: 'services',
        label: 'Services & Repairs',
        icon: Wrench,
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        items: [
            {
                q: 'What services do you offer?',
                a: 'We offer electronics installation, UPS/IPS setup, solar panel installation, electrical wiring, PCB design and repair, and IoT device configuration. Visit our Services page for the full list.'
            },
            {
                q: 'How do I book a service?',
                a: 'You can book a service through our website or by calling us. After booking, our team will contact you within 24 hours to schedule an appointment at your preferred time.'
            },
            {
                q: 'Is there a service charge for diagnostics?',
                a: 'For in-shop diagnostics, there is no upfront charge if you proceed with the repair. For on-site visits within Dhaka, a visit charge of ৳200–৳500 applies, which is waived if you hire us for the service.'
            },
            {
                q: 'Do you offer annual maintenance contracts (AMC)?',
                a: 'Yes, we offer AMC packages for UPS systems, solar installations, and other equipment. Contact us for a customized AMC plan tailored to your needs.'
            },
        ]
    },
    {
        id: 'payment-security',
        label: 'Payment Security',
        icon: CreditCard,
        color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
        items: [
            {
                q: 'Is online payment safe on your website?',
                a: 'All transactions are secured with 256-bit SSL encryption. We use PCI-DSS compliant payment gateways. We never store your full card details on our servers.'
            },
            {
                q: 'What happens if my payment fails but money is deducted?',
                a: 'In case of a failed transaction with deduction, the amount is automatically reversed within 3–5 business days by your bank or mobile banking provider. Contact us immediately with your transaction ID for assistance.'
            },
            {
                q: 'Do you offer EMI (installment) options?',
                a: 'EMI options are available for orders above ৳5,000 via select credit cards (DBBL Nexus, BRAC Bank, Bank Asia). The EMI plan and processing fees depend on the card issuer.'
            },
        ]
    },
];

const FAQAccordion: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void; idx: number }> = ({ item, isOpen, onToggle, idx }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
        className="border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden"
    >
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white dark:bg-[#1A1E29] hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
        >
            <span className="font-semibold text-sm text-slate-800 dark:text-white leading-relaxed">{item.q}</span>
            <ChevronDown
                size={16}
                className={`shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                >
                    <div className="px-5 pb-5 pt-1 bg-slate-50 dark:bg-[#13161E]/60 border-t border-slate-100 dark:border-white/5">
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.a}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

const FAQ: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('ordering');
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const toggleItem = (key: string) => {
        setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const currentCategory = faqData.find(c => c.id === activeCategory)!;

    return (
        <div className="bg-white dark:bg-[#0D0F14] transition-colors duration-300">
            {/* ── Page Hero ── */}
            <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-indigo-700/20 blur-3xl pointer-events-none" />

                <div className="container-custom relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#F5A623] text-xs font-bold uppercase tracking-wider backdrop-blur-sm mb-6"
                    >
                        <HelpCircle size={14} />
                        Help Center & FAQs
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-4 font-sora"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
                    >
                        Find answers to common questions about ordering, shipping, returns, and our products and services.
                    </motion.p>
                </div>
            </section>

            {/* ── Main Content ── */}
            <div className="container-custom py-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64 shrink-0">
                        <div className="bg-white dark:bg-[#1A1E29] rounded-2xl border border-slate-200 dark:border-white/5 p-3 shadow-xl shadow-slate-200/50 dark:shadow-black/20 sticky top-24">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 py-2 mb-1">Categories</p>
                            {faqData.map(cat => {
                                const CatIcon = cat.icon;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-all mb-1 ${
                                            activeCategory === cat.id
                                                ? 'bg-blue-50 dark:bg-[#F5A623]/10 text-blue-700 dark:text-[#F5A623]'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                            activeCategory === cat.id ? cat.color : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600'
                                        }`}>
                                            <CatIcon size={14} />
                                        </div>
                                        <span className="leading-tight">{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* FAQ Items */}
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentCategory.color}`}>
                                        <currentCategory.icon size={18} />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-slate-900 dark:text-white">{currentCategory.label}</h2>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">{currentCategory.items.length} questions</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {currentCategory.items.map((item, idx) => {
                                        const key = `${activeCategory}-${idx}`;
                                        return (
                                            <FAQAccordion
                                                key={key}
                                                item={item}
                                                isOpen={!!openItems[key]}
                                                onToggle={() => toggleItem(key)}
                                                idx={idx}
                                            />
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Still need help */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-14 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-[#1A1E29] dark:to-[#1A1E29] dark:border dark:border-[#F5A623]/20 rounded-2xl p-8 text-center"
                >
                    <div className="w-14 h-14 rounded-2xl bg-white/10 dark:bg-[#F5A623]/10 flex items-center justify-center mx-auto mb-4">
                        <HelpCircle size={24} className="text-white dark:text-[#F5A623]" />
                    </div>
                    <h3 className="text-xl font-extrabold text-white mb-2">Still have questions?</h3>
                    <p className="text-blue-100 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                        Our support team is ready to help you with any queries not covered here.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 bg-white dark:bg-[#F5A623] text-blue-700 dark:text-[#0D0F14] font-bold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg transition-all"
                        >
                            Contact Support
                        </Link>
                        <a
                            href="tel:+8801822108496"
                            className="inline-flex items-center gap-2 bg-blue-500 dark:bg-white/10 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-400 dark:hover:bg-white/20 transition-all"
                        >
                            +880 1822-108496
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQ;
