'use client';

import NextLink from 'next/link';
import {
    useParams as useNextParams,
    usePathname,
    useRouter,
    useSearchParams as useNextSearchParams,
} from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { AnchorHTMLAttributes } from 'react';

type NavigateOptions = {
    replace?: boolean;
    state?: unknown;
    scroll?: boolean;
};

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    to?: string;
    href?: string;
    replace?: boolean;
    prefetch?: boolean;
    state?: unknown;
};

export function Link({ to, href, replace, prefetch, state, ...rest }: LinkProps) {
    const destination = to ?? href ?? '#';

    return (
        <NextLink
            href={destination}
            replace={replace}
            prefetch={prefetch}
            {...rest}
        />
    );
}

export function useNavigate() {
    const router = useRouter();

    return useCallback(
        (to: string | number, options?: NavigateOptions) => {
            if (typeof to === 'number') {
                if (to < 0) {
                    router.back();
                } else {
                    router.forward();
                }
                return;
            }

            if (options?.replace) {
                router.replace(to, { scroll: options.scroll });
            } else {
                router.push(to, { scroll: options?.scroll });
            }
        },
        [router],
    );
}

export function useLocation() {
    const pathname = usePathname();
    const searchParams = useNextSearchParams();

    return useMemo(() => {
        const search = searchParams.toString();

        return {
            pathname,
            search: search ? `?${search}` : '',
            hash: '',
            key: search ? `${pathname}?${search}` : pathname,
            state: null,
        };
    }, [pathname, searchParams]);
}

export function useSearchParams(): [
    URLSearchParams,
    (next: URLSearchParams | Record<string, string>, options?: NavigateOptions) => void,
] {
    const searchParams = useNextSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const params = useMemo(
        () => new URLSearchParams(searchParams.toString()),
        [searchParams],
    );

    const setSearchParams = useCallback(
        (
            next: URLSearchParams | Record<string, string>,
            options?: NavigateOptions,
        ) => {
            const query =
                next instanceof URLSearchParams
                    ? next.toString()
                    : new URLSearchParams(next).toString();
            const destination = query ? `${pathname}?${query}` : pathname;

            if (options?.replace) {
                router.replace(destination);
            } else {
                router.push(destination);
            }
        },
        [pathname, router],
    );

    return [params, setSearchParams];
}

export function useParams<T extends Record<string, string | string[]>>() {
    return useNextParams<T>();
}
