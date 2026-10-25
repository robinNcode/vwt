import React from 'react';
import { Truck, MapPin, Clock, Package, AlertTriangle, Phone, CheckCircle2, Info, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteSettings } from '@/lib/settings';

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
    const { t, i18n } = useTranslation();
    const { settings } = useSiteSettings();
    const isBn = i18n.language === 'bn';

    const toc = isBn ? [
        { id: 'overview', label: 'শিপিং পর্যালোচনা' },
        { id: 'zones', label: 'ডেলিভারি এলাকা ও রেট' },
        { id: 'timeline', label: 'অর্ডার প্রক্রিয়া ও সময়রেখা' },
        { id: 'couriers', label: 'কুরিয়ার পার্টনার্স' },
        { id: 'cod', label: 'ক্যাশ অন ডেলিভারি (COD)' },
        { id: 'special', label: 'বিশেষ শর্তাবলী' },
        { id: 'contact', label: 'শিপিং সহায়তা' },
    ] : [
        { id: 'overview', label: 'Shipping Overview' },
        { id: 'zones', label: 'Delivery Zones & Rates' },
        { id: 'timeline', label: 'Order Timeline' },
        { id: 'couriers', label: 'Courier Partners' },
        { id: 'cod', label: 'Cash on Delivery' },
        { id: 'special', label: 'Special Conditions' },
        { id: 'contact', label: 'Shipping Support' },
    ];

    const displayPhone = isBn && settings?.phone_bn ? settings.phone_bn : (settings?.phone || '+880 1822-108496');
    const rawPhone = settings?.phone || '+880 1822-108496';
    const email = settings?.email || 'support@voltwavetech.com';

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
                        {t('shipping_page.badge')}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-4 font-sora"
                    >
                        {t('shipping_page.title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
                    >
                        {t('shipping_page.subtitle')}
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
                                {t('shipping_page.contents')}
                            </p>
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
                        <Section
                            id="overview"
                            icon={Info}
                            iconColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            title={isBn ? 'শিপিং নীতিমালা পর্যালোচনা' : 'Shipping Overview'}
                        >
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                {isBn
                                    ? 'ভোল্ট ওয়েভ টেক সারা বাংলাদেশের সকল জেলা ও উপজেলায় দ্রুত ও নিরাপদ ডেলিভারি নিশ্চিত করে। আমাদের বিশ্বস্ত কুরিয়ার নেটওয়ার্কের মাধ্যমে প্রতিটি পার্সেল সর্বোচ্চ সুরক্ষার সাথে গ্রাহকের ঠিকানায় পৌঁছানো হয়।'
                                    : 'Volt Wave Tech ships products to all districts and upazilas across Bangladesh. We aim to deliver your order as quickly as possible through our verified courier network. All shipments are handled with care to ensure products arrive in perfect condition.'}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {(isBn ? [
                                    { icon: MapPin, label: 'দেশজুড়ে ডেলিভারি', desc: '৬৪টি জেলা ও প্রত্যন্ত অঞ্চল', color: 'text-blue-500' },
                                    { icon: Clock, label: 'দ্রুত প্রসেসিং', desc: '২৪ ঘণ্টার মধ্যে পার্সেল প্রস্তুত', color: 'text-amber-500' },
                                    { icon: Package, label: 'নিরাপদ প্যাকেজিং', desc: 'অ্যান্টি-স্ট্যাটিক ও সুরক্ষিত বক্স', color: 'text-purple-500' },
                                ] : [
                                    { icon: MapPin, label: 'Nationwide', desc: 'All 64 districts covered', color: 'text-blue-500' },
                                    { icon: Clock, label: 'Fast Processing', desc: 'Order processed within 24 hrs', color: 'text-amber-500' },
                                    { icon: Package, label: 'Secure Packaging', desc: 'Anti-static, padded packaging', color: 'text-purple-500' },
                                ]).map((item, i) => (
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

                        <Section
                            id="zones"
                            icon={MapPin}
                            iconColor="bg-purple-500/10 text-purple-600 dark:text-purple-400"
                            title={isBn ? 'ডেলিভারি এলাকা ও শিপিং চার্জ' : 'Delivery Zones & Shipping Rates'}
                        >
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                {isBn
                                    ? 'অর্ডার প্রতি ২ কেজি পর্যন্ত ওজনে নির্দিষ্ট রেট প্রযোজ্য। অধিক ওজনের পণ্যের ক্ষেত্রে অতিরিক্ত কুরিয়ার চার্জ প্রযোজ্য হতে পারে।'
                                    : 'Shipping rates are calculated based on delivery zone. The following rates apply per order regardless of weight (up to 2 kg). Heavier parcels may incur additional charges.'}
                            </p>
                            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/5">
                                <table className="w-full">
                                    <thead className="bg-slate-100 dark:bg-[#13161E]/60">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                {isBn ? 'এলাকা / জোন' : 'Zone / Area'}
                                            </th>
                                            <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                {isBn ? 'আনুমানিক সময়' : 'Est. Delivery'}
                                            </th>
                                            <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                {isBn ? 'শিপিং চার্জ' : 'Shipping Cost'}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isBn ? (
                                            <>
                                                <TableRow zone="ঢাকা সিটি (মেট্রোপলিটন এলাকা)" time="১–২ কার্যদিবস" cost="৬০ ৳" />
                                                <TableRow zone="ঢাকা জেলা (মেট্রোর বাইরে সাভার, কেরানীগঞ্জ ইত্যাদি)" time="১–৩ কার্যদিবস" cost="৮০ ৳" />
                                                <TableRow zone="চট্টগ্রাম, সিলেট, রাজশাহী, খুলনা, বরিশাল, রংপুর (বিভাগীয় শহর)" time="২–৪ কার্যদিবস" cost="১১০ ৳" />
                                                <TableRow zone="অন্যান্য জেলা সদর" time="৩–৫ কার্যদিবস" cost="১৩০ ৳" />
                                                <TableRow zone="উপজেলা ও থানা পর্যায়" time="৪–৬ কার্যদিবস" cost="১৫০ ৳" />
                                                <TableRow zone="দূরবর্তী ও বিশেষ অঞ্চল" time="৫–৭ কার্যদিবস" cost="১৮০ ৳" />
                                                <TableRow zone="২,০০০ টাকার বেশি অর্ডার (শুধুমাত্র ঢাকা)" time="১–২ কার্যদিবস" cost="ফ্রি ডেলিভারি" highlight />
                                            </>
                                        ) : (
                                            <>
                                                <TableRow zone="Dhaka City (Within Dhaka metro)" time="1–2 business days" cost="৳60" />
                                                <TableRow zone="Dhaka District (Outside metro)" time="1–3 business days" cost="৳80" />
                                                <TableRow zone="Chittagong, Sylhet, Rajshahi, Khulna, Barishal, Rangpur (City)" time="2–4 business days" cost="৳110" />
                                                <TableRow zone="Other District Towns (Sadar)" time="3–5 business days" cost="৳130" />
                                                <TableRow zone="Upazila / Sub-district Level" time="4–6 business days" cost="৳150" />
                                                <TableRow zone="Remote / Hard to Reach Areas" time="5–7 business days" cost="৳180" />
                                                <TableRow zone="Orders above ৳2,000 (Dhaka Only)" time="1–2 business days" cost="Free" highlight />
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 flex items-start gap-2.5 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                                <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-amber-700 dark:text-amber-300">
                                    {isBn
                                        ? 'ঈদুল ফিতর, ঈদুল আজহা, পূজা বা প্রাকৃতিক দুর্যোগে কুরিয়ারের সাময়িক অতিরিক্ত চাপ বা ছুটির কারণে নির্ধারিত সময় কিছুটা পরিবর্তন হতে পারে।'
                                        : 'Shipping rates may vary during festivals (Eid, Puja), national holidays, or in case of courier surcharges. Any extra charges will be communicated before dispatch.'}
                                </p>
                            </div>
                        </Section>

                        <Section
                            id="timeline"
                            icon={Clock}
                            iconColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            title={isBn ? 'অর্ডার প্রক্রিয়াকরণ ও ডেলিভারি সময়রেখা' : 'Order Processing & Delivery Timeline'}
                        >
                            <div className="space-y-4">
                                {(isBn ? [
                                    { step: '১', title: 'অর্ডার নিশ্চিতকরণ', desc: 'অর্ডার দেওয়ার সাথে সাথে এসএমএস ও ইমেইলে নোটিফিকেশন পাঠানো হয়। অনলাইন পেমেন্ট ১ ঘণ্টার মধ্যে ভেরিফাই করা হয়।', time: 'অবিলম্বে' },
                                    { step: '২', title: 'প্যাকেজিং ও কোয়ালিটি চেক', desc: 'প্রকৌশল দল পণ্য যাচাই করে অ্যান্টি-স্ট্যাটিক বাবল র‍্যাপে সুরক্ষিতভাবে প্যাক করে। দুপুর ২টার আগের অর্ডার একই দিনে প্রসেস হয়।', time: '২৪ ঘণ্টার মধ্যে' },
                                    { step: '৩', title: 'কুরিয়ারে হস্তান্তর', desc: 'পার্সেল কুরিয়ার পার্টনারের কাছে তুলে দেওয়া হয় এবং ট্র্যাকিং নম্বর জেনারেট হয়ে যায়।', time: 'একই দিন / পরদিন' },
                                    { step: '৪', title: 'ট্রানজিটে যাত্রা', desc: 'কুরিয়ার নেটওয়ার্কের মাধ্যমে পার্সেল আপনার গন্তব্যের উদ্দেশ্যে রওনা দেয়। ট্র্যাকিং পেজ থেকে লাইভ অবস্থা দেখতে পাবেন।', time: 'এলাকা অনুযায়ী' },
                                    { step: '৫', title: 'ডেলিভারি প্রদান', desc: 'কুরিয়ার রাইডার আপনার ঠিকানায় পার্সেল নিয়ে যান। ডেলিভারির সময় রিসিভ করার জন্য সচল ফোন নম্বর নিশ্চিত রাখুন।', time: 'ডেলিভারির দিন' },
                                    { step: '৬', title: 'সম্পন্ন', desc: 'গ্রাহক পণ্য বুঝে নেন। প্যাকেট অক্ষত দেখে বুঝে নিন ও স্বাক্ষর করুন।', time: 'শেষ ধাপ' },
                                ] : [
                                    { step: '1', title: 'Order Confirmation', desc: 'Order confirmed via SMS/email immediately after placement. Payment verified within 1–2 hours for online payments.', time: 'Immediate' },
                                    { step: '2', title: 'Order Processing', desc: 'Items are picked, quality checked, packed, and labeled. Orders placed before 2:00 PM are processed the same day.', time: 'Within 24 hours' },
                                    { step: '3', title: 'Handover to Courier', desc: 'Parcel is handed over to the courier partner. A tracking number is generated and sent via SMS/email.', time: 'Same day / Next day' },
                                    { step: '4', title: 'In Transit', desc: 'Parcel is in transit through the courier network. You can track your order using the provided tracking number.', time: 'Depends on zone' },
                                    { step: '5', title: 'Out for Delivery', desc: 'Courier attempts delivery. Ensure someone is available at the address. 3 delivery attempts are made before return.', time: 'Delivery day' },
                                    { step: '6', title: 'Delivered', desc: 'Parcel delivered to the address. Signature may be required for high-value orders. Inspect before signing.', time: 'Final step' },
                                ]).map((item, i) => (
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

                        <Section
                            id="couriers"
                            icon={Truck}
                            iconColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            title={isBn ? 'আমাদের বিশ্বস্ত কুরিয়ার পার্টনার্স' : 'Our Courier Partners'}
                        >
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
                                {isBn
                                    ? 'দ্রুত ও নিরাপদ পার্সেল পৌঁছানোর জন্য আমরা বাংলাদেশের শীর্ষস্থানীয় কুরিয়ার সার্ভিসগুলোর সাথে কাজ করি:'
                                    : 'We work with the following courier services, selected based on your location for optimal speed and reliability:'}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {(isBn ? [
                                    { name: 'পাঠাও কুরিয়ার (Pathao Courier)', coverage: 'ঢাকা ও প্রধান শহরসমূহ', speed: 'দ্রুত এক্সপ্রেস সার্ভিস' },
                                    { name: 'পেপারফ্লাই (Paperfly)', coverage: 'সারাদেশে ৬৪ জেলায় ডোরস্টেপ', speed: 'স্ট্যান্ডার্ড ও ক্যাশ অন ডেলিভারি' },
                                    { name: 'রেডএক্স (RedX)', coverage: 'সারাদেশে বিস্তৃত নেটওয়ার্ক', speed: 'স্ট্যান্ডার্ড সার্ভিস' },
                                    { name: 'সুন্দরবন কুরিয়ার সার্ভিস', coverage: 'সকল জেলা ও উপজেলা ব্রাঞ্চ', speed: 'স্ট্যান্ডার্ড পার্সেল' },
                                    { name: 'এসএ পরিবহন (SA Paribahan)', coverage: 'সকল জেলা সদরে ভারী মালামাল', speed: 'কম খরচে বাল্ক শিপমেন্ট' },
                                    { name: 'জননী এক্সপ্রেস (JnEx)', coverage: 'ঢাকা ও চট্টগ্রাম করিডোর', speed: 'দ্রুতগামী একই দিনের এক্সপ্রেস' },
                                ] : [
                                    { name: 'Pathao Courier', coverage: 'Dhaka & major cities', speed: 'Express available' },
                                    { name: 'Paperfly', coverage: 'Nationwide (64 districts)', speed: 'Standard & Express' },
                                    { name: 'RedX', coverage: 'Nationwide delivery', speed: 'Standard service' },
                                    { name: 'Sundarban Courier', coverage: 'All districts & upazilas', speed: 'Standard service' },
                                    { name: 'SA Paribahan', coverage: 'All districts', speed: 'Budget option' },
                                    { name: 'JnEx (Janani Express)', coverage: 'Dhaka & Chittagong', speed: 'Express same-day' },
                                ]).map((c, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-[#F5A623]/20 transition-colors bg-slate-50 dark:bg-white/5">
                                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{c.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{c.coverage} · {c.speed}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section
                            id="cod"
                            icon={CreditCard}
                            iconColor="bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            title={isBn ? 'ক্যাশ অন ডেলিভারি (COD) এর নিয়মাবলী' : 'Cash on Delivery (COD) Terms'}
                        >
                            <ul className="space-y-3">
                                {(isBn ? [
                                    'সর্বোচ্চ ১০,০০০ টাকা পর্যন্ত অর্ডারে ক্যাশ অন ডেলিভারি প্রযোজ্য। এর বেশি অর্ডারে আংশিক অগ্রিম পেমেন্ট প্রয়োজন হতে পারে।',
                                    'অনুগ্রহ করে নির্ধারিত পরিমাণ টাকা প্রস্তুত রাখুন। কুরিয়ার রাইডারের কাছে সবসময় ভাঙতি নাও থাকতে পারে।',
                                    'কুরিয়ার রাইডারের ফোন কল রিসিভ করুন। ৩ বার চেষ্টা করার পরও যোগাযোগ না হলে পার্সেল ফেরত পাঠানো হতে পারে।',
                                    'কুরিয়ার কালেকশন চার্জ বাবদ ২০-৩০ টাকা সিওডি ফি যুক্ত হতে পারে।',
                                    'অনাকাঙ্ক্ষিত কারণে বিনা নোটিশে একাধিকবার সিওডি পার্সেল প্রত্যাখ্যান করলে ভবিষ্যৎ অর্ডারে সিওডি সুবিধা স্থগিত হতে পারে।',
                                ] : [
                                    'COD is available for orders up to ৳10,000. Higher value orders may require advance payment.',
                                    'Please keep the exact amount ready. Courier delivery agents may not carry change.',
                                    'For COD orders, please answer courier calls. Unanswered deliveries may be returned after 3 attempts.',
                                    'COD charges: ৳20–৳30 extra per order (added at checkout) to cover collection fees from courier.',
                                    'Returning a COD order without receipt means the refund will be processed after the item is received and verified.',
                                    'Repeated cancellations of COD orders may result in COD being disabled for your account.',
                                ]).map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-[#F5A623] mt-1.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Section>

                        <Section
                            id="special"
                            icon={AlertTriangle}
                            iconColor="bg-orange-500/10 text-orange-600 dark:text-orange-400"
                            title={isBn ? 'বিশেষ শিপিং পরিস্থিতি' : 'Special Shipping Conditions'}
                        >
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/10">
                                    <h4 className="font-semibold text-sm text-slate-800 dark:text-white mb-2">
                                        {isBn ? 'সংবেদনশীল ও সূক্ষ্ম ইলেকট্রনিক্স পার্টস' : 'Fragile & High-Value Items'}
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {isBn
                                            ? 'আইসি, মাইক্রোকন্ট্রোলার ও সেন্সর ইত্যাদি অ্যান্টি-স্ট্যাটিক ব্যাগে সুরক্ষিত রেখে শক্ত বাক্সে পাঠানো হয় যাতে ট্রানজিটে কোনো ক্ষতি না হয়।'
                                            : 'Electronic components, ICs, and modules are shipped in anti-static bags inside foam-padded boxes. For orders above ৳5,000, we recommend requesting insurance (available for ৳50–₹100 extra).'}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10">
                                    <h4 className="font-semibold text-sm text-slate-800 dark:text-white mb-2">
                                        {isBn ? 'ভারী পণ্য ও বাল্ক অর্ডার' : 'Bulk & Heavy Orders'}
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {isBn
                                            ? '৫ কেজির বেশি পণ্য বা বড় যন্ত্রপাতি এসএ পরিবহন বা সরাসরি কুরিয়ার ফ্রেইট সার্ভিসে পাঠানো হয় এবং ভাড়া ওজন সাপেক্ষে প্রযোজ্য হয়।'
                                            : 'Orders above 5 kg or high-volume commercial orders are shipped via SA Paribahan or direct freight. Shipping costs for heavy orders are calculated separately and communicated before dispatch.'}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10">
                                    <h4 className="font-semibold text-sm text-slate-800 dark:text-white mb-2">
                                        {isBn ? 'প্রাকৃতিক দুর্যোগ বা অনাকাঙ্ক্ষিত বিলম্ব' : 'Force Majeure & Delays'}
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {isBn
                                            ? 'বন্যা, ভারী বৃষ্টিপাত বা রাজনৈতিক অচলাবস্থায় কুরিয়ার চলাচলে বিলম্ব হলে আমাদের গ্রাহক সেবা টিম অবিলম্বে যোগাযোগ করবে।'
                                            : 'Volt Wave Tech is not responsible for delivery delays caused by natural disasters, hartal/strikes, national emergencies, or courier service disruptions. We will notify customers of any significant delays.'}
                                    </p>
                                </div>
                            </div>
                        </Section>

                        <Section
                            id="contact"
                            icon={Phone}
                            iconColor="bg-teal-500/10 text-teal-600 dark:text-teal-400"
                            title={isBn ? 'শিপিং সহায়তা ও কন্টাক্ট' : 'Shipping Support'}
                        >
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
                                {isBn
                                    ? 'শিপিং সংক্রান্ত যেকোনো প্রয়োজনে আমাদের লজিস্টিকস টিমের সাথে যোগাযোগ করুন:'
                                    : 'For any shipping-related queries, you can reach our logistics support team through the following channels:'}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        {t('shipping_page.phone_label')}
                                    </p>
                                    <a href={`tel:${rawPhone.replace(/\s+/g, '')}`} className="text-base font-bold text-blue-600 dark:text-[#F5A623] hover:underline">
                                        {displayPhone}
                                    </a>
                                    <p className="text-xs text-slate-400 mt-1">{t('shipping_page.avail_hours')}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        {t('shipping_page.email_label')}
                                    </p>
                                    <a href={`mailto:${email}`} className="text-base font-bold text-blue-600 dark:text-[#F5A623] hover:underline">
                                        {email}
                                    </a>
                                    <p className="text-xs text-slate-400 mt-1">{t('shipping_page.response_time')}</p>
                                </div>
                            </div>
                            <div className="mt-5 flex items-center gap-3 flex-wrap">
                                <Link
                                    to="/track-order"
                                    className="inline-flex items-center gap-2 bg-blue-600 dark:bg-[#F5A623] text-white dark:text-[#0D0F14] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700 dark:hover:bg-[#D48E1D] transition-all"
                                >
                                    <Truck size={14} />
                                    {t('shipping_page.track_btn')}
                                </Link>
                                <Link
                                    to="/returns"
                                    className="inline-flex items-center gap-2 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
                                >
                                    {t('shipping_page.returns_btn')}
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
