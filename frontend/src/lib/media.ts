const absoluteUrlPattern = /^https?:\/\//i;

export const getMediaUrl = (url?: string | null) => {
    if (!url) return '';
    if (absoluteUrlPattern.test(url)) return url;
    return `${import.meta.env.VITE_SERVER_URL || ''}${url}`;
};

/**
 * Returns the best thumbnail URL available for an item with fallback to original url.
 */
export const getThumbnailUrl = (item?: { thumbnail_url?: string | null; thumb?: string | null; url?: string | null; image_url?: string | null } | null) => {
    if (!item) return '';
    const src = item.thumbnail_url || item.thumb || item.url || item.image_url;
    return getMediaUrl(src);
};
