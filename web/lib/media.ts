const absoluteUrlPattern = /^https?:\/\//i;
const serverUrl = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/+$/, '').replace(/\/api\/v1$/i, '');

export const getMediaUrl = (url?: string | null) => {
    if (!url) return '';

    const trimmedUrl = url.trim();
    if (!trimmedUrl) return '';
    if (absoluteUrlPattern.test(trimmedUrl)) return trimmedUrl;
    if (!serverUrl) return trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`;

    const path = trimmedUrl.replace(/^\/+/, '');
    return `${serverUrl}/${path}`;
};

/**
 * Returns the best thumbnail URL available for an item with fallback to the original.
 */
export const getThumbnailUrl = (
    item?: {
        thumbnail_url?: string | null;
        thumb?: string | null;
        url?: string | null;
        image_url?: string | null;
    } | null,
) => {
    if (!item) return '';

    const src = item.thumbnail_url || item.thumb || item.url || item.image_url;

    return getMediaUrl(src);
};
