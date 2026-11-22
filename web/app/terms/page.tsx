import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions',
    description:
        'Terms and conditions for purchasing products and booking services from Volt Wave Tech.',
    alternates: {
        canonical: '/terms',
    },
    openGraph: {
        title: 'Terms & Conditions | Volt Wave Tech',
        description:
            'Terms and conditions for purchasing products and booking services from Volt Wave Tech.',
        url: '/terms',
        type: 'website',
        images: ['/images/final_logo.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Terms & Conditions | Volt Wave Tech',
        description:
            'Terms and conditions for purchasing products and booking services from Volt Wave Tech.',
        images: ['/images/final_logo.png'],
    },
};

const sections = [
    {
        title: 'Orders and quotations',
        body: 'All orders are subject to stock availability and confirmation. Quotations remain valid for the period stated on the document. Prices may change without prior notice.',
    },
    {
        title: 'Payments',
        body: 'Payment terms are confirmed at the time of order. Advance payment may be required for special-order items, imported equipment, and custom engineering work.',
    },
    {
        title: 'Product information',
        body: 'We aim to keep product specifications accurate. Manufacturer documentation takes precedence where differences exist. Images are indicative and may vary slightly from the delivered item.',
    },
    {
        title: 'Service work',
        body: 'Service bookings are scheduled after site assessment. Additional work discovered during execution will be quoted and approved before proceeding.',
    },
    {
        title: 'Limitation of liability',
        body: 'Our liability is limited to the value of the goods or services supplied. We are not responsible for indirect or consequential losses arising from installation or use.',
    },
];

export default function Page() {
    return (
        <div className="bg-white pt-28 dark:bg-[#0D0F14]">
            <section className="border-b border-slate-100 bg-slate-50 py-14 dark:border-white/5 dark:bg-[#0D0F14]">
                <div className="container-custom">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-[#F5A623]">
                        Legal
                    </p>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                        Terms &amp; Conditions
                    </h1>
                    <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
                        These terms apply to purchases and service engagements with
                        Volt Wave Tech.
                    </p>
                </div>
            </section>

            <section className="container-custom py-14">
                <div className="max-w-3xl space-y-8">
                    {sections.map((section) => (
                        <div key={section.title}>
                            <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                                {section.title}
                            </h2>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                {section.body}
                            </p>
                        </div>
                    ))}

                    <p className="border-t border-slate-100 pt-8 text-sm text-slate-500 dark:border-white/5 dark:text-slate-400">
                        Questions about these terms? Contact us at{' '}
                        <a
                            href="mailto:support@voltwavetech.com"
                            className="font-semibold text-blue-600 dark:text-[#F5A623]"
                        >
                            support@voltwavetech.com
                        </a>
                        .
                    </p>
                </div>
            </section>
        </div>
    );
}
