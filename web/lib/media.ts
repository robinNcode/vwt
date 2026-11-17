const absoluteUrlPattern = /^https?:\/\//i;

const serverUrl = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/+$/, '');

export const getMediaUrl = (url?: string | null) => {
    if (!url) return '';
    if (absoluteUrlPattern.test(url)) return url;
    if (!serverUrl) return url;

    return `${serverUrl}${url.startsWith('/') ? '' : '/'}${url}`;
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
