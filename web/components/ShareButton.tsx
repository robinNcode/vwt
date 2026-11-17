'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
    KeyboardEvent as ReactKeyboardEvent,
    MouseEvent as ReactMouseEvent,
} from 'react';

type ShareButtonProps = {
    url: string;
    title: string;
    variant?: 'default' | 'compact';
};

type ShareOption = {
    label: string;
    href: string;
};

function resolveUrl(url: string): string {
    if (/^https?:\/\//i.test(url)) {
        return url;
    }

    if (typeof window !== 'undefined') {
        return new URL(url, window.location.origin).toString();
    }

    return url;
}

function ShareIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.59 13.51l6.83 3.98m-.01-10.98l-6.82 3.98M18 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
            />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
        </svg>
    );
}

export default function ShareButton({
    url,
    title,
    variant = 'default',
}: ShareButtonProps) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const resetCopyRef = useRef<number | null>(null);
    const shareUrl = useMemo(() => resolveUrl(url), [url]);
    const isCompact = variant === 'compact';

    const socialOptions = useMemo<ShareOption[]>(() => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(title);
        const messengerAppId = process.env.NEXT_PUBLIC_MESSENGER_APP_ID?.trim();
        const messengerHref = messengerAppId
            ? `https://www.facebook.com/dialog/send?app_id=${encodeURIComponent(messengerAppId)}&link=${encodedUrl}&redirect_uri=${encodedUrl}`
            : 'https://www.messenger.com/';

        return [
            {
                label: 'WhatsApp',
                href: `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`,
            },
            {
                label: 'Facebook',
                href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            },
            {
                label: 'Messenger',
                href: messengerHref,
            },
            {
                label: 'Telegram',
                href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
            },
        ];
    }, [shareUrl, title]);

    const stopPropagation = useCallback(
        (event: ReactMouseEvent | ReactKeyboardEvent) => {
            event.stopPropagation();
        },
        [],
    );

    const handleShareClick = async (
        event: ReactMouseEvent<HTMLButtonElement>,
    ) => {
        stopPropagation(event);

        if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
            try {
                await navigator.share({
                    title,
                    text: title,
                    url: shareUrl,
                });
                return;
            } catch (error) {
                if (
                    typeof error === 'object' &&
                    error !== null &&
                    'name' in error &&
                    error.name === 'AbortError'
                ) {
                    return;
                }
            }
        }

        setOpen((current) => !current);
    };

    const handleCopy = async (event: ReactMouseEvent<HTMLButtonElement>) => {
        stopPropagation(event);

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareUrl);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = shareUrl;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            setCopied(true);

            if (resetCopyRef.current !== null) {
                window.clearTimeout(resetCopyRef.current);
            }

            resetCopyRef.current = window.setTimeout(() => {
                setCopied(false);
                resetCopyRef.current = null;
            }, 2000);
        } catch {
            setCopied(false);
        }

        setOpen(false);
    };

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleOutsideClick = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [open]);

    useEffect(() => {
        return () => {
            if (resetCopyRef.current !== null) {
                window.clearTimeout(resetCopyRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative inline-block"
            onClick={stopPropagation}
            onKeyDown={stopPropagation}
        >
            <button
                type="button"
                aria-label={`Share ${title}`}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={handleShareClick}
                className={
                    isCompact
                        ? 'inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md transition hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        : 'inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }
            >
                {isCompact ? (
                    copied ? (
                        <CheckIcon />
                    ) : (
                        <ShareIcon />
                    )
                ) : (
                    <>
                        <ShareIcon />
                        <span>{copied ? 'Copied!' : 'Share'}</span>
                    </>
                )}
            </button>

            {open && (
                <div
                    role="menu"
                    aria-label="Share options"
                    className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                >
                    <button
                        type="button"
                        role="menuitem"
                        aria-label="Copy link"
                        onClick={handleCopy}
                        className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                        Copy link
                    </button>

                    {socialOptions.map((option) => (
                        <a
                            key={option.label}
                            role="menuitem"
                            aria-label={`Share on ${option.label}`}
                            href={option.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) => {
                                stopPropagation(event);
                                setOpen(false);
                            }}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            {option.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
