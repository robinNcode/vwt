export type ApiFetchOptions = Omit<RequestInit, 'next'> & {
    revalidate?: number | false;
};

export class ApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

function buildApiUrl(path: string): string {
    const apiUrl = process.env.API_URL?.trim().replace(/\/+$/, '');

    if (!apiUrl) {
        throw new Error('API_URL is not configured');
    }

    if (/^https?:\/\//i.test(path)) {
        throw new Error('apiFetch expects a path relative to API_URL');
    }

    return `${apiUrl}/${path.replace(/^\/+/, '')}`;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
    const { revalidate = 120, cache, headers, ...requestInit } = options;
    const requestHeaders = new Headers(headers);

    if (!requestHeaders.has('Accept')) {
        requestHeaders.set('Accept', 'application/json');
    }

    const init: RequestInit = {
        ...requestInit,
        headers: requestHeaders,
    };

    if (cache === 'no-store') {
        init.cache = 'no-store';
    } else if (typeof revalidate === 'number' || revalidate === false) {
        init.next = { revalidate };
    }

    const response = await fetch(buildApiUrl(path), init);

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new ApiError(
            response.status,
            body || `API request failed with status ${response.status}`,
        );
    }

    return response.json() as Promise<T>;
}

/** Fetch public catalog data with ISR/revalidation */
export async function fetchCatalog<T>(path: string, revalidate: number | false = 120): Promise<T> {
    return apiFetch<T>(path, { revalidate });
}

/** Fetch user-specific or sensitive data with no-store */
export async function fetchUserSpecific<T>(path: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return apiFetch<T>(path, { cache: 'no-store', headers });
}
