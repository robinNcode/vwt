import React from 'react';
import { Truck, MapPin, Clock, Package, AlertTriangle, Phone, CheckCircle2, Info, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Section: React.FC<{ id: string; icon: React.ElementType; iconColor: string; title: string; children: React.ReactNode; delay?: number }> = ({
    id, icon: Icon, iconColor, title, children, delay = 0
}) => (
    <motion.section
        id={id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="bg-white dark:bg-[#1A1E29] rounded-2xl border border-slate-200 dark:border-white/5 p-7 shadow-xl shadow-slate-200/30 dark:shadow-black/20"
    >
        <div className="flex items-center gap-3 mb-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}>
                <Icon size={18} />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white font-sora">{title}</h2>
        </div>
        {children}
    </motion.section>
);

const TableRow: React.FC<{ zone: string; time: string; cost: string; highlight?: boolean }> = ({ zone, time, cost, highlight }) => (
    <tr className={`border-b border-slate-100 dark:border-white/5 last:border-0 ${highlight ? 'bg-blue-50/50 dark:bg-[#F5A623]/5' : ''}`}>
        <td className="py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">{zone}</td>
        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{time}</td>
        <td className={`py-3 px-4 text-sm font-bold ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>{cost}</td>
    </tr>
);

const ShippingPolicy: React.FC = () => {
    const toc = [
        { id: 'overview', label: 'Shipping Overview' },
        { id: 'zones', label: 'Delivery Zones & Rates' },
        { id: 'timeline', label: 'Order Timeline' },
        { id: 'couriers', label: 'Courier Partners' },
        { id: 'cod', label: 'Cash on Delivery' },
        { id: 'special', label: 'Special Conditions' },
        { id: 'contact', label: 'Shipping Support' },
    ];

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
                        <Truck size={14} />
                        Shipping Information
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-4 font-sora"
                    >
                        Shipping Policy
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
                    >
                        We deliver across Bangladesh through trusted courier partners. Read our complete shipping terms below.
                    </motion.p>
                </div>
            </section>

            {/* ── Main Content ── */}
            <div className="container-custom py-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* TOC Sidebar */}
                    <div className="lg:w-56 shrink-0">
                        <div className="bg-white dark:bg-[#1A1E29] rounded-2xl border border-slate-200 dark:border-white/5 p-4 shadow-xl sticky top-24">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">Contents</p>
                            {toc.map(item => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] hover:bg-slate-50 dark:hover:bg-white/5 transition-all block"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-6">
                        <Section id="overview" icon={Info} iconColor="bg-blue-500/10 text-blue-600 dark:text-blue-400" title="Shipping Overview">
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                Volt Wave Tech ships products to all districts and upazilas across Bangladesh. We aim to deliver your order as quickly as possible through our verified courier network. All shipments are handled with care to ensure products arrive in perfect condition.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { icon: MapPin, label: 'Nationwide', desc: 'All 64 districts covered', color: 'text-blue-500' },
                                    { icon: Clock, label: 'Fast Processing', desc: 'Order processed within 24 hrs', color: 'text-amber-500' },
                                    { icon: Package, label: 'Secure Packaging', desc: 'Anti-static, padded packaging', color: 'text-purple-500' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-white/5">
                                        <item.icon size={16} className={`mt-0.5 shrink-0 ${item.color}`} />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{item.label}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section id="zones" icon={MapPin} iconColor="bg-purple-500/10 text-purple-600 dark:text-purple-400" title="Delivery Zones & Shipping Rates">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Shipping rates are calculated based on delivery zone. The following rates apply per order regardless of weight (up to 2 kg). Heavier parcels may incur additional charges.
                            </p>
                            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/5">
                                <table className="w-full">
                                    <thead className="bg-slate-100 dark:bg-[#13161E]/60">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Zone / Area</th>
                                            <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Est. Delivery</th>
                                            <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Shipping Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <TableRow zone="Dhaka City (Within Dhaka metro)" time="1–2 business days" cost="৳60" />
                                        <TableRow zone="Dhaka District (Outside metro)" time="1–3 business days" cost="৳80" />
                                        <TableRow zone="Chittagong, Sylhet, Rajshahi, Khulna, Barishal, Rangpur (City)" time="2–4 business days" cost="৳110" />
                                        <TableRow zone="Other District Towns (Sadar)" time="3–5 business days" cost="৳130" />
                                        <TableRow zone="Upazila / Sub-district Level" time="4–6 business days" cost="৳150" />
                                        <TableRow zone="Remote / Hard to Reach Areas" time="5–7 business days" cost="৳180" />
                                        <TableRow zone="Orders above ৳2,000 (Dhaka Only)" time="1–2 business days" cost="Free" highlight />
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 flex items-start gap-2.5 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                                <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-amber-700 dark:text-amber-300">
                                    Shipping rates may vary during festivals (Eid, Puja), national holidays, or in case of courier surcharges. Any extra charges will be communicated before dispatch.
                                </p>
                            </div>
                        </Section>

                        <Section id="timeline" icon={Clock} iconColor="bg-amber-500/10 text-amber-600 dark:text-amber-400" title="Order Processing & Delivery Timeline">
                            <div className="space-y-4">
                                {[
                                    { step: '1', title: 'Order Confirmation', desc: 'Order confirmed via SMS/email immediately after placement. Payment verified within 1–2 hours for online payments.', time: 'Immediate' },
                                    { step: '2', title: 'Order Processing', desc: 'Items are picked, quality checked, packed, and labeled. Orders placed before 2:00 PM are processed the same day.', time: 'Within 24 hours' },
                                    { step: '3', title: 'Handover to Courier', desc: 'Parcel is handed over to the courier partner. A tracking number is generated and sent via SMS/email.', time: 'Same day / Next day' },
                                    { step: '4', title: 'In Transit', desc: 'Parcel is in transit through the courier network. You can track your order using the provided tracking number.', time: 'Depends on zone' },
                                    { step: '5', title: 'Out for Delivery', desc: 'Courier attempts delivery. Ensure someone is available at the address. 3 delivery attempts are made before return.', time: 'Delivery day' },
                                    { step: '6', title: 'Delivered', desc: 'Parcel delivered to the address. Signature may be required for high-value orders. Inspect before signing.', time: 'Final step' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-[#F5A623] text-white dark:text-[#0D0F14] flex items-center justify-center text-xs font-bold shrink-0">{item.step}</div>
                                            {i < 5 && <div className="w-0.5 flex-1 bg-slate-200 dark:bg-white/10 mt-2" />}
                                        </div>
                                        <div className="pb-4">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-semibold text-sm text-slate-800 dark:text-white">{item.title}</p>
                                                <span className="text-[10px] bg-blue-50 dark:bg-[#F5A623]/10 text-blue-600 dark:text-[#F5A623] px-2 py-0.5 rounded-full font-bold">{item.time}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section id="couriers" icon={Truck} iconColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" title="Our Courier Partners">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
                                We work with the following courier services, selected based on your location for optimal speed and reliability:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { name: 'Pathao Courier', coverage: 'Dhaka & major cities', speed: 'Express available' },
                                    { name: 'Paperfly', coverage: 'Nationwide (64 districts)', speed: 'Standard & Express' },
                                    { name: 'RedX', coverage: 'Nationwide delivery', speed: 'Standard service' },
                                    { name: 'Sundarban Courier', coverage: 'All districts & upazilas', speed: 'Standard service' },
                                    { name: 'SA Paribahan', coverage: 'All districts', speed: 'Budget option' },
                                    { name: 'JnEx (Janani Express)', coverage: 'Dhaka & Chittagong', speed: 'Express same-day' },
                                ].map((c, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-[#F5A623]/20 transition-colors bg-slate-50 dark:bg-white/5">
                                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{c.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{c.coverage} · {c.speed}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
                                * Volt Wave Tech reserves the right to choose the courier partner based on availability and delivery location. You may request a specific courier at checkout, subject to availability.
                            </p>
                        </Section>

                        <Section id="cod" icon={CreditCard} iconColor="bg-rose-500/10 text-rose-600 dark:text-rose-400" title="Cash on Delivery (COD) Terms">
                            <ul className="space-y-3">
                                {[
                                    'COD is available for orders up to ৳10,000. Higher value orders may require advance payment.',
                                    'Please keep the exact amount ready. Courier delivery agents may not carry change.',
                                    'For COD orders, please answer courier calls. Unanswered deliveries may be returned after 3 attempts.',
                                    'COD charges: ৳20–৳30 extra per order (added at checkout) to cover collection fees from courier.',
                                    'Returning a COD order without receipt means the refund will be processed after the item is received and verified.',
                                    'Repeated cancellations of COD orders may result in COD being disabled for your account.',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-[#F5A623] mt-1.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Section>

                        <Section id="special" icon={AlertTriangle} iconColor="bg-orange-500/10 text-orange-600 dark:text-orange-400" title="Special Shipping Conditions">
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/10">
                                    <h4 className="font-semibold text-sm text-slate-800 dark:text-white mb-2">Fragile & High-Value Items</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Electronic components, ICs, and modules are shipped in anti-static bags inside foam-padded boxes. For orders above ৳5,000, we recommend requesting insurance (available for ৳50–₹100 extra).</p>
                                </div>
                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10">
                                    <h4 className="font-semibold text-sm text-slate-800 dark:text-white mb-2">Bulk & Heavy Orders</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Orders above 5 kg or high-volume commercial orders are shipped via SA Paribahan or direct freight. Shipping costs for heavy orders are calculated separately and communicated before dispatch.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10">
                                    <h4 className="font-semibold text-sm text-slate-800 dark:text-white mb-2">Force Majeure & Delays</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Volt Wave Tech is not responsible for delivery delays caused by natural disasters, hartal/strikes, national emergencies, or courier service disruptions. We will notify customers of any significant delays.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                    <h4 className="font-semibold text-sm text-slate-800 dark:text-white mb-2">Parcel Lost / Damaged in Transit</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">If your parcel is lost or damaged in transit, please report within 48 hours of expected delivery. We will coordinate with the courier and provide a replacement or full refund based on investigation outcome.</p>
                                </div>
                            </div>
                        </Section>

                        <Section id="contact" icon={Phone} iconColor="bg-teal-500/10 text-teal-600 dark:text-teal-400" title="Shipping Support">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
                                For any shipping-related queries, you can reach our logistics support team through the following channels:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone / WhatsApp</p>
                                    <a href="tel:+8801822108496" className="text-base font-bold text-blue-600 dark:text-[#F5A623] hover:underline">+880 1822-108496</a>
                                    <p className="text-xs text-slate-400 mt-1">Available 9 AM – 9 PM, 7 days</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Support</p>
                                    <a href="mailto:support@voltwavetech.com" className="text-base font-bold text-blue-600 dark:text-[#F5A623] hover:underline">support@voltwavetech.com</a>
                                    <p className="text-xs text-slate-400 mt-1">Response within 24 hours</p>
                                </div>
                            </div>
                            <div className="mt-5 flex items-center gap-3 flex-wrap">
                                <Link
                                    to="/track-order"
                                    className="inline-flex items-center gap-2 bg-blue-600 dark:bg-[#F5A623] text-white dark:text-[#0D0F14] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700 dark:hover:bg-[#D48E1D] transition-all"
                                >
                                    <Truck size={14} />
                                    Track My Order
                                </Link>
                                <Link
                                    to="/returns"
                                    className="inline-flex items-center gap-2 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
                                >
                                    Return Policy →
                                </Link>
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
