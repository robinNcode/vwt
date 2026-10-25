import React from 'react';
import { RotateCcw, CheckCircle2, XCircle, Clock, Package, Phone, AlertTriangle, ArrowRight, ShieldCheck, Info, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Section: React.FC<{ id: string; icon: React.ElementType; iconColor: string; title: string; children: React.ReactNode }> = ({
    id, icon: Icon, iconColor, title, children
}) => (
    <motion.section
        id={id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
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

const ReturnPolicy: React.FC = () => {
    const toc = [
        { id: 'overview', label: 'Return Overview' },
        { id: 'eligibility', label: 'Return Eligibility' },
        { id: 'non-returnable', label: 'Non-Returnable Items' },
        { id: 'process', label: 'How to Return' },
        { id: 'refund', label: 'Refund Policy' },
        { id: 'defective', label: 'Defective / Wrong Items' },
        { id: 'warranty', label: 'Warranty Claims' },
        { id: 'contact', label: 'Return Support' },
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
                        <RotateCcw size={14} />
                        Customer Protection
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-4 font-sora"
                    >
                        Return & Refund Policy
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
                    >
                        Your satisfaction is our priority. Please read our return and refund terms carefully before initiating a return request.
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
                                    className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all block"
                                >
                                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                                    {item.label}
                                </a>
                            ))}
                        </div>

                        {/* Quick Summary */}
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-4 mt-4">
                            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-3 uppercase tracking-wider">At a Glance</p>
                            <div className="space-y-2">
                                {[
                                    '7-day return window',
                                    'Defective items: 48-hr report',
                                    'Free return for our fault',
                                    'Refund in 5–7 business days',
                                    'No restocking fee',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                        <span className="text-xs text-emerald-700 dark:text-emerald-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-6">
                        <Section id="overview" icon={Info} iconColor="bg-blue-500/10 text-blue-600 dark:text-blue-400" title="Return Policy Overview">
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                Volt Wave Tech is committed to customer satisfaction. We offer a <strong className="text-slate-800 dark:text-white">7-day return window</strong> from the date of delivery for eligible products. Returns are accepted when the item is unused, undamaged, and in its original packaging.
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                This policy is in accordance with the <strong className="text-slate-800 dark:text-white">Bangladesh Consumer Rights Protection Act, 2009</strong> and aims to provide fair, transparent, and hassle-free returns for all customers.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { icon: Clock, label: '7-Day Window', desc: 'Return within 7 days of delivery', color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
                                    { icon: Package, label: 'Original Condition', desc: 'Unused, original packaging required', color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
                                    { icon: ShieldCheck, label: 'Buyer Protection', desc: 'Full refund for defective items', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${item.color}`}>
                                        <item.icon size={16} className="mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{item.label}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section id="eligibility" icon={CheckCircle2} iconColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" title="Return Eligibility Conditions">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">A return request will be accepted if ALL of the following conditions are met:</p>
                            <div className="space-y-3">
                                {[
                                    { ok: true, text: 'Return is requested within 7 calendar days from the date of delivery.' },
                                    { ok: true, text: 'The item is unused, uninstalled, and in its original factory condition.' },
                                    { ok: true, text: 'All original packaging, labels, accessories, manuals, and warranty cards are intact.' },
                                    { ok: true, text: 'A valid proof of purchase (order number, invoice, or receipt) is provided.' },
                                    { ok: true, text: 'The item has not been tampered with, modified, or repaired by a third party.' },
                                    { ok: true, text: 'The reason for return is one of the accepted reasons listed below.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
                                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5">
                                <p className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Accepted Return Reasons:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {[
                                        'Item received is defective or damaged',
                                        'Wrong product sent by us',
                                        'Item does not match description/photos',
                                        'Missing parts or accessories',
                                        'Item not as per specification',
                                        'Dead-on-arrival (DOA) electronics',
                                    ].map((reason, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <ArrowRight size={12} className="text-blue-500 shrink-0" />
                                            {reason}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        <Section id="non-returnable" icon={XCircle} iconColor="bg-red-500/10 text-red-600 dark:text-red-400" title="Non-Returnable Items">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                The following items <strong className="text-slate-800 dark:text-white">cannot be returned</strong> under any circumstances unless they are defective upon arrival:
                            </p>
                            <div className="space-y-2">
                                {[
                                    'Electronic ICs, microcontrollers, and modules once removed from anti-static packaging',
                                    'Items damaged due to customer misuse, incorrect installation, or power surges',
                                    'Consumable items (solder wire, flux, thermal paste, adhesives, etc.)',
                                    'Custom-ordered or special-import items manufactured to specification',
                                    'Software licenses, digital downloads, or subscription services',
                                    'Items without original packaging, seals broken by customer',
                                    'Products purchased during clearance sales (marked as "Final Sale")',
                                    'Items that have been installed, soldered, or integrated into circuits',
                                    'Batteries and power cells (for safety reasons)',
                                    'Hygiene-sensitive or personal use items',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-2.5 py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                                        <XCircle size={13} className="text-red-400 mt-0.5 shrink-0" />
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                                <p className="text-xs text-red-700 dark:text-red-400">
                                    <strong>Note:</strong> Exceptions apply only when the above items are confirmed defective by our technical team upon inspection. Photos or video evidence must be provided.
                                </p>
                            </div>
                        </Section>

                        <Section id="process" icon={RotateCcw} iconColor="bg-orange-500/10 text-orange-600 dark:text-orange-400" title="How to Return a Product">
                            <div className="space-y-4">
                                {[
                                    { step: '1', title: 'Initiate Return Request', desc: 'Contact us via email at support@voltwavetech.com or call +880 1822-108496 within 7 days of delivery. Provide your order number, item name, and reason for return.' },
                                    { step: '2', title: 'Provide Evidence', desc: 'Share photos or a short video clearly showing the issue. For defective products, show the defect clearly. Our team will review within 24 business hours.' },
                                    { step: '3', title: 'Approval & Return Label', desc: 'Once approved, you will receive a return authorization. For returns due to our error, we arrange and pay for pickup. For customer-fault returns, a drop-off address will be shared.' },
                                    { step: '4', title: 'Pack & Ship the Item', desc: 'Pack the item securely in its original packaging with all accessories. Include the printed return authorization inside. Drop off or wait for pickup.' },
                                    { step: '5', title: 'Inspection & Resolution', desc: 'We inspect the item within 2–3 business days of receipt. You will be notified of the result — replacement dispatch or refund initiation.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{item.step}</div>
                                            {i < 4 && <div className="w-0.5 flex-1 bg-slate-200 dark:bg-white/10 mt-2" />}
                                        </div>
                                        <div className="pb-4">
                                            <p className="font-semibold text-sm text-slate-800 dark:text-white mb-1">{item.title}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section id="refund" icon={CreditCard} iconColor="bg-teal-500/10 text-teal-600 dark:text-teal-400" title="Refund Policy & Timeline">
                            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 mb-5">
                                <table className="w-full">
                                    <thead className="bg-slate-100 dark:bg-[#13161E]/60">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Payment Method</th>
                                            <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Refund Method</th>
                                            <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Timeline</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {[
                                            { method: 'Cash on Delivery (COD)', refund: 'bKash / Nagad / Bank Transfer', timeline: '5–7 business days' },
                                            { method: 'bKash', refund: 'Same bKash number', timeline: '1–3 business days' },
                                            { method: 'Nagad', refund: 'Same Nagad number', timeline: '1–3 business days' },
                                            { method: 'Rocket (DBBL)', refund: 'Same Rocket account', timeline: '2–5 business days' },
                                            { method: 'Bank Transfer', refund: 'Original bank account', timeline: '3–7 business days' },
                                            { method: 'Credit / Debit Card', refund: 'Same card (via gateway)', timeline: '5–10 business days' },
                                        ].map((row, i) => (
                                            <tr key={i} className="text-sm">
                                                <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{row.method}</td>
                                                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.refund}</td>
                                                <td className="py-3 px-4 text-blue-600 dark:text-[#F5A623] font-semibold">{row.timeline}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10">
                                <p className="text-xs text-blue-700 dark:text-blue-400">
                                    <strong>Note:</strong> Refunds are processed only after the returned item passes our quality inspection. Shipping costs are non-refundable unless the return is due to our error. For COD refunds, please provide your preferred mobile banking number.
                                </p>
                            </div>
                        </Section>

                        <Section id="defective" icon={AlertTriangle} iconColor="bg-amber-500/10 text-amber-600 dark:text-amber-400" title="Defective or Wrong Product Received">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                If you receive a <strong className="text-slate-800 dark:text-white">defective, damaged, or incorrect item</strong>, you must report it within <strong className="text-slate-800 dark:text-white">48 hours of delivery</strong>. Beyond this window, we cannot guarantee a free replacement due to courier handover policies.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                {[
                                    { title: 'Dead-on-Arrival (DOA)', desc: 'Items that do not function upon first use. Full replacement or refund within 7 days.', color: 'border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5' },
                                    { title: 'Physically Damaged', desc: 'Items damaged during shipping. We file a courier claim and provide replacement immediately.', color: 'border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/5' },
                                    { title: 'Wrong Item Sent', desc: 'Incorrect product sent due to our error. Free return pickup + priority replacement dispatch.', color: 'border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/5' },
                                    { title: 'Missing Accessories', desc: 'Parts or accessories missing from the package. We send missing items within 2–3 business days.', color: 'border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/5' },
                                ].map((item, i) => (
                                    <div key={i} className={`p-4 rounded-xl border ${item.color}`}>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white mb-1">{item.title}</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                                <p className="text-xs text-amber-700 dark:text-amber-300">
                                    <strong>Required:</strong> Please share clear photos or an unboxing video showing the issue. Reports without evidence cannot be processed. Do not discard original packaging until the issue is resolved.
                                </p>
                            </div>
                        </Section>

                        <Section id="warranty" icon={ShieldCheck} iconColor="bg-purple-500/10 text-purple-600 dark:text-purple-400" title="Warranty Claims">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                Many of our products come with manufacturer warranties. Warranty claims are separate from the 7-day return policy and apply even after the return window expires.
                            </p>
                            <div className="space-y-3">
                                {[
                                    { label: 'Electronics & Modules', period: '3–12 months manufacturer warranty (as specified per product)' },
                                    { label: 'UPS / IPS Systems', period: '1–2 years warranty (manufacturer terms apply)' },
                                    { label: 'Solar Panels', period: '2–5 years performance warranty' },
                                    { label: 'Cables & Accessories', period: '3–6 months warranty against manufacturing defects' },
                                    { label: 'Service / Repair Work', period: '30–90 days workmanship warranty' },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-slate-100 dark:border-white/5 last:border-0">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{item.label}</p>
                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-3 py-1 rounded-full">
                                            <Clock size={10} />
                                            {item.period}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
                                Warranty does not cover damage from misuse, water damage, unauthorized repair, voltage fluctuation damage, or physical impact. Warranty is void if seals are broken without authorization.
                            </p>
                        </Section>

                        <Section id="contact" icon={Phone} iconColor="bg-blue-500/10 text-blue-600 dark:text-blue-400" title="Return & Refund Support">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
                                Our customer protection team is dedicated to resolving your return and refund queries promptly:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone / WhatsApp</p>
                                    <a href="tel:+8801822108496" className="text-base font-bold text-blue-600 dark:text-[#F5A623] hover:underline">+880 1822-108496</a>
                                    <p className="text-xs text-slate-400 mt-1">9 AM – 9 PM, 7 days a week</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                                    <a href="mailto:returns@voltwavetech.com" className="text-base font-bold text-blue-600 dark:text-[#F5A623] hover:underline">returns@voltwavetech.com</a>
                                    <p className="text-xs text-slate-400 mt-1">Response within 24 hours</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-orange-600 transition-all"
                                >
                                    <RotateCcw size={14} />
                                    Request a Return
                                </Link>
                                <Link
                                    to="/shipping"
                                    className="inline-flex items-center gap-2 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
                                >
                                    Shipping Policy →
                                </Link>
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicy;
