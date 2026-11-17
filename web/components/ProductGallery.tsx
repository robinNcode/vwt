'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getMediaUrl } from '@/lib/media';

type GalleryImage = {
    url?: string | null;
    thumbnail_url?: string | null;
    thumb?: string | null;
    alt_bn?: string | null;
    alt_en?: string | null;
};

export default function ProductGallery({
    images,
    name,
}: {
    images: GalleryImage[];
    name: string;
}) {
    const sources = images
        .map((image) => image.thumbnail_url || image.thumb || image.url)
        .filter((value): value is string => Boolean(value))
        .map(getMediaUrl);
    const [active, setActive] = useState(0);
    const activeSrc = sources[active];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-8 dark:border-white/5 dark:bg-black/20">
                {activeSrc ? (
                    <img
                        src={activeSrc}
                        alt={name}
                        className="max-h-[420px] w-full object-contain drop-shadow-2xl"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-3 text-slate-300 dark:text-slate-700">
                        <Package size={64} strokeWidth={1} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                            Industrial Asset
                        </span>
                    </div>
                )}
            </div>

            {sources.length > 1 && (
                <div className="flex flex-wrap gap-3">
                    {sources.map((src, index) => (
                        <button
                            key={`${src}-${index}`}
                            type="button"
                            onClick={() => setActive(index)}
                            aria-label={`View image ${index + 1} of ${name}`}
                            className={cn(
                                'h-16 w-16 overflow-hidden rounded-xl border-2 bg-slate-50 transition-all dark:bg-black/20',
                                index === active
                                    ? 'border-blue-600 dark:border-[#F5A623]'
                                    : 'border-transparent opacity-70 hover:opacity-100',
                            )}
                        >
                            <img
                                src={src}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
