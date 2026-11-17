import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description:
        'How Volt Wave Tech collects, uses, and protects your personal information.',
    alternates: {
        canonical: '/privacy',
    },
};

const sections = [
    {
        title: 'Information we collect',
        body: 'We collect the details you provide when placing an order, requesting a quotation, booking a service, or contacting us. This may include your name, phone number, email address, delivery address, and company details.',
    },
    {
        title: 'How we use your information',
        body: 'Your information is used to process orders, arrange delivery, provide support, issue invoices, and respond to enquiries. We may contact you about the status of an order or service booking.',
    },
    {
        title: 'Payment data',
        body: 'We do not store full card numbers or mobile-wallet PINs. Payment confirmations and transaction references may be retained for accounting and dispute resolution.',
    },
    {
        title: 'Sharing',
        body: 'We share only the information needed to complete your order, such as the delivery address with a courier. We do not sell personal information.',
    },
    {
        title: 'Retention and security',
        body: 'Records are retained as required for accounting and warranty purposes. Access is restricted to authorised staff and protected by standard administrative and technical controls.',
    },
    {
        title: 'Your choices',
        body: 'You may request access to, correction of, or deletion of your personal information by contacting us. Some records may be retained where required by law.',
    },
];

export default function Page() {
    return (
        <div className="bg-white pt-28 dark:bg-[#0D0F14]">
            <section className="border-b border-slate-100 bg-slate-50 py-14 dark:border-white/5 dark:bg-[#0D0F14]">
                <div className="container-custom">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-[#F5A623]">
                        Privacy
                    </p>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                        Privacy Policy
                    </h1>
                    <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
                        This policy explains what information we collect and how it
                        is used.
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
                        For privacy requests, email{' '}
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
