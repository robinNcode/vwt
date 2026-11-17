import Link from 'next/link';
import { ArrowLeft, Package, Wrench } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-white px-4 pt-24 dark:bg-[#0D0F14]">
            <div className="max-w-xl text-center">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-[#F5A623]">
                    404
                </p>
                <h1 className="text-4xl font-extrabold text-slate-900 md:text-5xl dark:text-white">
                    Page not found
                </h1>
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                    The page you are looking for may have moved, or the link may be
                    incorrect.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 dark:bg-[#F5A623] dark:text-[#0D0F14] dark:hover:bg-[#D48E1D]"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    >
                        <Package size={16} />
                        Products
                    </Link>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    >
                        <Wrench size={16} />
                        Services
                    </Link>
                </div>
            </div>
        </div>
    );
}
