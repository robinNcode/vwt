import React from 'react';
import { RotateCcw, CheckCircle2, XCircle, Clock, Package, Phone, AlertTriangle, ArrowRight, ShieldCheck, Info, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteSettings } from '@/lib/settings';

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
    const { t, i18n } = useTranslation();
    const { settings } = useSiteSettings();
    const isBn = i18n.language === 'bn';

    const toc = isBn ? [
        { id: 'overview', label: 'নীতিমালা সংক্ষেপ' },
        { id: 'eligibility', label: 'রিটার্নের যোগ্যতা' },
        { id: 'non-returnable', label: 'যেসব পণ্য রিটার্নযোগ্য নয়' },
        { id: 'process', label: 'কিভাবে রিটার্ন করবেন' },
        { id: 'refund', label: 'রিফান্ড ও অর্থ ফেরত' },
        { id: 'defective', label: 'ত্রুটিযুক্ত পণ্য রিপোর্ট' },
        { id: 'warranty', label: 'ওয়ারেন্টি দাবি' },
        { id: 'contact', label: 'রিটার্ন সহায়তা' },
    ] : [
        { id: 'overview', label: 'Return Overview' },
        { id: 'eligibility', label: 'Return Eligibility' },
        { id: 'non-returnable', label: 'Non-Returnable Items' },
        { id: 'process', label: 'How to Return' },
        { id: 'refund', label: 'Refund Policy' },
        { id: 'defective', label: 'Defective / Wrong Items' },
        { id: 'warranty', label: 'Warranty Claims' },
        { id: 'contact', label: 'Return Support' },
    ];

    const displayPhone = isBn && settings?.phone_bn ? settings.phone_bn : (settings?.phone || '+880 1822-108496');
    const rawPhone = settings?.phone || '+880 1822-108496';
    const email = settings?.email || 'returns@voltwavetech.com';

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
                        {t('returns_page.badge')}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-4 font-sora"
                    >
                        {t('returns_page.title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
                    >
                        {t('returns_page.subtitle')}
                    </motion.p>
                </div>
            </section>

            {/* ── Main Content ── */}
            <div className="container-custom py-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* TOC Sidebar */}
                    <div className="lg:w-56 shrink-0">
                        <div className="bg-white dark:bg-[#1A1E29] rounded-2xl border border-slate-200 dark:border-white/5 p-4 shadow-xl sticky top-24">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">
                                {t('returns_page.contents')}
                            </p>
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
                            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-3 uppercase tracking-wider">
                                {t('returns_page.at_a_glance')}
                            </p>
                            <div className="space-y-2">
                                {(isBn ? [
                                    '৭ দিনের রিটার্ন উইন্ডো',
                                    'নষ্ট পণ্য: ৪৮ ঘণ্টার মধ্যে রিপোর্ট',
                                    'আমাদের ভুলে ফ্রি রিটার্ন পিকআপ',
                                    '৫–৭ কার্যদিবসে রিফান্ড',
                                    'কোনো অতিরিক্ত রিস্টকিং ফি নেই',
                                ] : [
                                    '7-day return window',
                                    'Defective items: 48-hr report',
                                    'Free return for our fault',
                                    'Refund in 5–7 business days',
                                    'No restocking fee',
                                ]).map((item, i) => (
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
                        <Section
                            id="overview"
                            icon={Info}
                            iconColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            title={isBn ? 'রিটার্ন নীতিমালা পর্যালোচনা' : 'Return Policy Overview'}
                        >
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                {isBn ? (
                                    <>
                                        ভোল্ট ওয়েভ টেক গ্রাহকদের সর্বোত্তম সন্তুষ্টি নিশ্চিতে প্রতিশ্রুতিবদ্ধ। ডেলিভারির তারিখ থেকে <strong className="text-slate-800 dark:text-white">৭ দিনের সহজ রিটার্ন সুবিধা</strong> প্রযোজ্য। পণ্যটি সম্পূর্ণ অব্যবহৃত এবং অক্ষত মূল প্যাকেজিং সহ থাকতে হবে।
                                    </>
                                ) : (
                                    <>
                                        Volt Wave Tech is committed to customer satisfaction. We offer a <strong className="text-slate-800 dark:text-white">7-day return window</strong> from the date of delivery for eligible products. Returns are accepted when the item is unused, undamaged, and in its original packaging.
                                    </>
                                )}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                {isBn ? (
                                    <>
                                        এই নীতিমালা <strong className="text-slate-800 dark:text-white">বাংলাদেশ ভোক্তা অধিকার সংরক্ষণ আইন, ২০০৯</strong> অনুসারে গ্রাহকের স্বার্থ ও স্বচ্ছতা সুরক্ষার লক্ষ্যে প্রণীত।
                                    </>
                                ) : (
                                    <>
                                        This policy is in accordance with the <strong className="text-slate-800 dark:text-white">Bangladesh Consumer Rights Protection Act, 2009</strong> and aims to provide fair, transparent, and hassle-free returns for all customers.
                                    </>
                                )}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {(isBn ? [
                                    { icon: Clock, label: '৭ দিনের উইন্ডো', desc: 'ডেলিভারির ৭ দিনের মধ্যে আবেদন', color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
                                    { icon: Package, label: 'মূল প্যাকেজিং', desc: 'অব্যবহৃত ও মূল সিল অক্ষুণ্ণ', color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
                                    { icon: ShieldCheck, label: 'গ্রাহক সুরক্ষা', desc: 'ত্রুটিযুক্ত পণ্যে ১০০% রিফান্ড', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
                                ] : [
                                    { icon: Clock, label: '7-Day Window', desc: 'Return within 7 days of delivery', color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
                                    { icon: Package, label: 'Original Condition', desc: 'Unused, original packaging required', color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
                                    { icon: ShieldCheck, label: 'Buyer Protection', desc: 'Full refund for defective items', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
                                ]).map((item, i) => (
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

                        <Section
                            id="eligibility"
                            icon={CheckCircle2}
                            iconColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            title={isBn ? 'রিটার্নের যোগ্যতা ও শর্তাবলী' : 'Return Eligibility Conditions'}
                        >
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                {isBn
                                    ? 'রিটার্ন আবেদন গ্রহণের জন্য নিম্নলিখিত শর্তসমূহ পূরণ হতে হবে:'
                                    : 'A return request will be accepted if ALL of the following conditions are met:'}
                            </p>
                            <div className="space-y-3">
                                {(isBn ? [
                                    'ডেলিভারি পাওয়ার সর্বোচ্চ ৭ দিনের মধ্যে লিখিত বা মৌখিক আবেদন করতে হবে।',
                                    'পণ্য সম্পূর্ণ অব্যবহৃত ও সার্কিট বা যন্ত্রপাতিতে সংযুক্ত না করা অবস্থায় থাকতে হবে।',
                                    'সকল মূল এক্সেসরিজ, ক্যাবল, ম্যানুয়াল, ওয়ারেন্টি কার্ড ও বক্স অক্ষত থাকতে হবে।',
                                    'অর্ডার নম্বর, ডিজিটাল চালান বা ভ্যাট রসিদ প্রদান করতে হবে।',
                                    'পণ্য কোনো তৃতীয় পক্ষ কর্তৃক খোলা বা পরিবর্তনের চেষ্টা করা হয়নি।',
                                    'রিটার্নের কারণ অনুমোদিত ক্যাটাগরির অন্তর্ভুক্ত হতে হবে।',
                                ] : [
                                    'Return is requested within 7 calendar days from the date of delivery.',
                                    'The item is unused, uninstalled, and in its original factory condition.',
                                    'All original packaging, labels, accessories, manuals, and warranty cards are intact.',
                                    'A valid proof of purchase (order number, invoice, or receipt) is provided.',
                                    'The item has not been tampered with, modified, or repaired by a third party.',
                                    'The reason for return is one of the accepted reasons listed below.',
                                ]).map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
                                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5">
                                <p className="text-sm font-semibold text-slate-800 dark:text-white mb-3">
                                    {isBn ? 'গ্রহণযোগ্য রিটার্নের কারণসমূহ:' : 'Accepted Return Reasons:'}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {(isBn ? [
                                        'পণ্যটি ভাঙা, ক্ষতিগ্রস্ত বা ত্রুটিযুক্ত পাওয়া গেছে',
                                        'আমাদের পক্ষ থেকে ভুল বা অসঙ্গত পণ্য পাঠানো হয়েছে',
                                        'ওয়েবসাইটের বিবরণ বা ছবির সাথে অমিল',
                                        'প্যাকেটে প্রয়োজনীয় পার্টস বা এক্সেসরিজ অনুপস্থিত',
                                        'টেকনিক্যাল স্পেসিফিকেশন অনুযায়ী কাজ করছে না',
                                        'প্রথমবার চালুর সময় ডেড (DOA) ধরা পড়েছে',
                                    ] : [
                                        'Item received is defective or damaged',
                                        'Wrong product sent by us',
                                        'Item does not match description/photos',
                                        'Missing parts or accessories',
                                        'Item not as per specification',
                                        'Dead-on-arrival (DOA) electronics',
                                    ]).map((reason, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <ArrowRight size={12} className="text-blue-500 shrink-0" />
                                            {reason}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        <Section
                            id="non-returnable"
                            icon={XCircle}
                            iconColor="bg-red-500/10 text-red-600 dark:text-red-400"
                            title={isBn ? 'যেসব পণ্য রিটার্নযোগ্য নয়' : 'Non-Returnable Items'}
                        >
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                {isBn ? (
                                    <>
                                        নিম্নলিখিত পণ্যসমূহ <strong className="text-slate-800 dark:text-white">রিটার্ন করা সম্ভব নয়</strong> (ত্রুটিযুক্ত অবস্থায় ডেলিভারি ছাড়া):
                                    </>
                                ) : (
                                    <>
                                        The following items <strong className="text-slate-800 dark:text-white">cannot be returned</strong> under any circumstances unless they are defective upon arrival:
                                    </>
                                )}
                            </p>
                            <div className="space-y-2">
                                {(isBn ? [
                                    'অ্যান্টি-স্ট্যাটিক প্যাকেট থেকে খোলা মাইক্রোকন্ট্রোলার ও আইসি মডিউল',
                                    'ভুল ভোল্টেজ প্রয়োগ, শটসার্কিট বা কাস্টমারের অসতর্কতায় ক্ষতিগ্রস্ত পণ্য',
                                    'ব্যবহারযোগ্য উপকরণ (যেমন সোল্ডারিং ওয়্যার, পেস্ট, থার্মাল আঠা)',
                                    'কাস্টম অর্ডার অনুযায়ী আমদানিকৃত বা তৈরি পণ্য',
                                    'ডিজিটাল লাইসেন্স, সফটওয়্যার বা সাবস্ক্রিপশন কি',
                                    'সিল ভাঙা বা মূল প্যাকেজিং হারিয়ে যাওয়া পণ্য',
                                    'ক্লিয়ারেন্স সেল বা ফাইনাল অফারে বিক্রিত আইটেম',
                                    'সার্কিটে সোল্ডার বা ঝালাই করা পার্টস',
                                    'ব্যাটারি এবং কেমিক্যাল সেলসমূহ (নিরাপত্তাজনিত কারণে)',
                                ] : [
                                    'Electronic ICs, microcontrollers, and modules once removed from anti-static packaging',
                                    'Items damaged due to customer misuse, incorrect installation, or power surges',
                                    'Consumable items (solder wire, flux, thermal paste, adhesives, etc.)',
                                    'Custom-ordered or special-import items manufactured to specification',
                                    'Software licenses, digital downloads, or subscription services',
                                    'Items without original packaging, seals broken by customer',
                                    'Products purchased during clearance sales (marked as "Final Sale")',
                                    'Items that have been installed, soldered, or integrated into circuits',
                                    'Batteries and power cells (for safety reasons)',
                                ]).map((item, i) => (
                                    <div key={i} className="flex items-start gap-2.5 py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                                        <XCircle size={13} className="text-red-400 mt-0.5 shrink-0" />
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section
                            id="process"
                            icon={RotateCcw}
                            iconColor="bg-orange-500/10 text-orange-600 dark:text-orange-400"
                            title={isBn ? 'কিভাবে রিটার্ন সম্পন্ন করবেন' : 'How to Return a Product'}
                        >
                            <div className="space-y-4">
                                {(isBn ? [
                                    { step: '১', title: 'রিটার্ন রিকোয়েস্ট তৈরি করুন', desc: '৭ দিনের মধ্যে আমাদের হটলাইন বা ইমেইলে যোগাযোগ করে অর্ডার নম্বর ও রিটার্নের কারণ জানান।' },
                                    { step: '২', title: 'ছবি বা ভিডিও প্রমাণ দিন', desc: 'ত্রুটি স্পষ্ট বোঝা যায় এমন একটি আনবক্সিং ভিডিও বা স্পষ্ট ছবি আমাদের হোয়াটসঅ্যাপ বা ইমেইলে পাঠান।' },
                                    { step: '৩', title: 'রিটার্ন অনুমোদন', desc: 'আমাদের টিম যাচাই করে রিটার্ন অনুমোদন প্রদান করবে এবং পিকআপ শিডিউল নির্ধারণ করবে।' },
                                    { step: '৪', title: 'প্যাকেজিং ও হস্তান্তর', desc: 'মূল বক্সে সমস্ত এক্সেসরিজ সহ পণ্যটি প্যাক করে কুরিয়ার এজেন্টের কাছে হস্তান্তর করুন।' },
                                    { step: '৫', title: 'রিফান্ড অথবা প্রতিস্থাপন', desc: 'পণ্য আমাদের ওয়্যারহাউসে পৌঁছালে মান পরীক্ষার পর নতুন পণ্য পাঠানো হবে অথবা মূল্য রিফান্ড করা হবে।' },
                                ] : [
                                    { step: '1', title: 'Initiate Return Request', desc: 'Contact us via email or call within 7 days of delivery. Provide your order number, item name, and reason for return.' },
                                    { step: '2', title: 'Provide Evidence', desc: 'Share photos or a short video clearly showing the issue. For defective products, show the defect clearly. Our team will review within 24 business hours.' },
                                    { step: '3', title: 'Approval & Return Label', desc: 'Once approved, you will receive a return authorization. For returns due to our error, we arrange and pay for pickup.' },
                                    { step: '4', title: 'Pack & Ship the Item', desc: 'Pack the item securely in its original packaging with all accessories. Drop off or wait for courier pickup.' },
                                    { step: '5', title: 'Inspection & Resolution', desc: 'We inspect the item within 2–3 business days of receipt. You will be notified of replacement dispatch or refund initiation.' },
                                ]).map((item, i) => (
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

                        <Section
                            id="refund"
                            icon={CreditCard}
                            iconColor="bg-teal-500/10 text-teal-600 dark:text-teal-400"
                            title={isBn ? 'রিফান্ড মাধ্যম ও সময়সীমা' : 'Refund Policy & Timeline'}
                        >
                            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 mb-5">
                                <table className="w-full">
                                    <thead className="bg-slate-100 dark:bg-[#13161E]/60">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                {isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
                                            </th>
                                            <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                {isBn ? 'রিফান্ড পদ্ধতি' : 'Refund Method'}
                                            </th>
                                            <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                {isBn ? 'সময়কাল' : 'Timeline'}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {(isBn ? [
                                            { method: 'ক্যাশ অন ডেলিভারি (COD)', refund: 'বিকাশ / নগদ / ব্যাংক ট্রান্সফার', timeline: '৫–৭ কার্যদিবস' },
                                            { method: 'বিকাশ (bKash)', refund: 'মূল বিকাশ ওয়ালেট নম্বর', timeline: '১–৩ কার্যদিবস' },
                                            { method: 'নগদ (Nagad)', refund: 'মূল নগদ অ্যাকাউন্ট', timeline: '১–৩ কার্যদিবস' },
                                            { method: 'রকেট (Rocket)', refund: 'মূল রকেট অ্যাকাউন্ট', timeline: '২–৫ কার্যদিবস' },
                                            { method: 'ব্যাংক ট্রান্সফার', refund: 'প্রেরকের ব্যাংক অ্যাকাউন্ট', timeline: '৩–৭ ব্যাংকিং দিবস' },
                                            { method: 'ক্রেডিট / ডেবিট কার্ড', refund: 'মূল কার্ডে রিভার্সেল', timeline: '৫–১০ কার্যদিবস' },
                                        ] : [
                                            { method: 'Cash on Delivery (COD)', refund: 'bKash / Nagad / Bank Transfer', timeline: '5–7 business days' },
                                            { method: 'bKash', refund: 'Same bKash number', timeline: '1–3 business days' },
                                            { method: 'Nagad', refund: 'Same Nagad number', timeline: '1–3 business days' },
                                            { method: 'Rocket (DBBL)', refund: 'Same Rocket account', timeline: '2–5 business days' },
                                            { method: 'Bank Transfer', refund: 'Original bank account', timeline: '3–7 business days' },
                                            { method: 'Credit / Debit Card', refund: 'Same card (via gateway)', timeline: '5–10 business days' },
                                        ]).map((row, i) => (
                                            <tr key={i} className="text-sm">
                                                <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{row.method}</td>
                                                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.refund}</td>
                                                <td className="py-3 px-4 text-blue-600 dark:text-[#F5A623] font-semibold">{row.timeline}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        <Section
                            id="defective"
                            icon={AlertTriangle}
                            iconColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            title={isBn ? 'ত্রুটিযুক্ত বা ভুল পণ্য ডেলিভারির ক্ষেত্রে' : 'Defective or Wrong Product Received'}
                        >
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                {isBn ? (
                                    <>
                                        ভুল বা নষ্ট পণ্য পৌঁছালে অবশ্যই ডেলিভারির <strong className="text-slate-800 dark:text-white">৪৮ ঘণ্টার মধ্যে</strong> রিপোর্ট করতে হবে। কুরিয়ার পলিসির কারণে এই সময়ের পর বিনামূল্যে পিকআপ ব্যবস্থা করা কঠিন হতে পারে।
                                    </>
                                ) : (
                                    <>
                                        If you receive a <strong className="text-slate-800 dark:text-white">defective, damaged, or incorrect item</strong>, you must report it within <strong className="text-slate-800 dark:text-white">48 hours of delivery</strong>. Beyond this window, we cannot guarantee a free replacement due to courier handover policies.
                                    </>
                                )}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                {(isBn ? [
                                    { title: 'ডেড-অন-অ্যারাইভাল (DOA)', desc: 'প্রথমবার পাওয়ার পরেই চালুর কোনো লক্ষণ নেই এমন পণ্যে ১০০% বিনামূল্যে প্রতিস্থাপন।', color: 'border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5' },
                                    { title: 'শারীরিক ক্ষতি বা ভাঙা', desc: 'কুরিয়ারে পরিবহনের কারণে প্যাকেজ বা পণ্য ক্ষতিগ্রস্ত হলে জরুরি ভিত্তিতে ক্ষতিপূরণ।', color: 'border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/5' },
                                    { title: 'ভুল আইটেম পাঠানো হলে', desc: 'আমাদের অসাবধানতাবশত অন্য পণ্য গেলে বিনামূল্যে ফেরত ও সঠিক পণ্য প্রেরণ।', color: 'border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/5' },
                                    { title: 'অনুপস্থিত এক্সেসরিজ', desc: 'বক্সের ভেতরের কোনো ক্যাবল বা পার্টস বাদ পড়লে ২ কার্যদিবসের মধ্যে তা আলাদা প্রেরণ।', color: 'border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/5' },
                                ] : [
                                    { title: 'Dead-on-Arrival (DOA)', desc: 'Items that do not function upon first use. Full replacement or refund within 7 days.', color: 'border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5' },
                                    { title: 'Physically Damaged', desc: 'Items damaged during shipping. We file a courier claim and provide replacement immediately.', color: 'border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/5' },
                                    { title: 'Wrong Item Sent', desc: 'Incorrect product sent due to our error. Free return pickup + priority replacement dispatch.', color: 'border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/5' },
                                    { title: 'Missing Accessories', desc: 'Parts or accessories missing from the package. We send missing items within 2–3 business days.', color: 'border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/5' },
                                ]).map((item, i) => (
                                    <div key={i} className={`p-4 rounded-xl border ${item.color}`}>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white mb-1">{item.title}</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section
                            id="warranty"
                            icon={ShieldCheck}
                            iconColor="bg-purple-500/10 text-purple-600 dark:text-purple-400"
                            title={isBn ? 'ওয়ারেন্টি দাবি ও সময়কাল' : 'Warranty Claims'}
                        >
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                {isBn
                                    ? 'আমাদের অধিকাংশ টেকনিক্যাল পণ্যের সাথে অফিশিয়াল ওয়ারেন্টি থাকে। ৭ দিনের রিটার্ন উইন্ডো পার হওয়ার পরেও ওয়ারেন্টি চলাকালীন সময়ে সার্ভিস সুবিধা পাবেন।'
                                    : 'Many of our products come with manufacturer warranties. Warranty claims are separate from the 7-day return policy and apply even after the return window expires.'}
                            </p>
                            <div className="space-y-3">
                                {(isBn ? [
                                    { label: 'ইলেকট্রনিক্স ও আইসি মডিউল', period: '৩ থেকে ১২ মাস (পণ্য অনুযায়ী নির্ধারিত)' },
                                    { label: 'ইউপিএস ও আইপিএস ইনভার্টার', period: '১ থেকে ২ বছর প্রস্তুতকারক ওয়ারেন্টি' },
                                    { label: 'সোলার প্যানেলসমূহ', period: '২ থেকে ৫ বছর পারফরম্যান্স ওয়ারেন্টি' },
                                    { label: 'সংযোগ ক্যাবল ও এডাপ্টার', period: '৩ থেকে ৬ মাস কারখানা ত্রুটির বিরুদ্ধে' },
                                    { label: 'সার্ভিস ও মেরামত কাজ', period: '৩০ থেকে ৯০ দিন কাজের গ্যারান্টি' },
                                ] : [
                                    { label: 'Electronics & Modules', period: '3–12 months manufacturer warranty (as specified per product)' },
                                    { label: 'UPS / IPS Systems', period: '1–2 years warranty (manufacturer terms apply)' },
                                    { label: 'Solar Panels', period: '2–5 years performance warranty' },
                                    { label: 'Cables & Accessories', period: '3–6 months warranty against manufacturing defects' },
                                    { label: 'Service / Repair Work', period: '30–90 days workmanship warranty' },
                                ]).map((item, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-slate-100 dark:border-white/5 last:border-0">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{item.label}</p>
                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-3 py-1 rounded-full">
                                            <Clock size={10} />
                                            {item.period}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section
                            id="contact"
                            icon={Phone}
                            iconColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            title={isBn ? 'রিটার্ন ও রিফান্ড সহায়তা' : 'Return & Refund Support'}
                        >
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
                                {isBn
                                    ? 'রিটার্ন প্রক্রিয়া সহজ ও দ্রুত করতে আমাদের গ্রাহক সুরক্ষা টিম সর্বদা প্রস্তুত:'
                                    : 'Our customer protection team is dedicated to resolving your return and refund queries promptly:'}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        {isBn ? 'ফোন / হোয়াটসঅ্যাপ' : 'Phone / WhatsApp'}
                                    </p>
                                    <a href={`tel:${rawPhone.replace(/\s+/g, '')}`} className="text-base font-bold text-blue-600 dark:text-[#F5A623] hover:underline">
                                        {displayPhone}
                                    </a>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {isBn ? 'সকাল ৯টা – রাত ৯টা (সপ্তাহের ৭ দিন)' : '9 AM – 9 PM, 7 days a week'}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        {isBn ? 'ইমেইল সাপোর্ট' : 'Email'}
                                    </p>
                                    <a href={`mailto:${email}`} className="text-base font-bold text-blue-600 dark:text-[#F5A623] hover:underline">
                                        {email}
                                    </a>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {isBn ? '২৪ ঘণ্টার মধ্যে উত্তর দেওয়া হয়' : 'Response within 24 hours'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-orange-600 transition-all"
                                >
                                    <RotateCcw size={14} />
                                    {t('returns_page.request_return_btn')}
                                </Link>
                                <Link
                                    to="/shipping"
                                    className="inline-flex items-center gap-2 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
                                >
                                    {t('returns_page.shipping_policy_btn')}
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
