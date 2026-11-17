type ApiFetchOptions = Omit<RequestInit, 'cache' | 'next'> & {
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
    const { revalidate = 120, headers, ...requestInit } = options;
    const requestHeaders = new Headers(headers);

    if (!requestHeaders.has('Accept')) {
        requestHeaders.set('Accept', 'application/json');
    }

    const response = await fetch(buildApiUrl(path), {
        ...requestInit,
        headers: requestHeaders,
        next: { revalidate },
    });

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new ApiError(
            response.status,
            body || `API request failed with status ${response.status}`,
        );
    }

    return response.json() as Promise<T>;
}
