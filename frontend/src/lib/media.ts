const absoluteUrlPattern = /^https?:\/\//i;

export const getMediaUrl = (url?: string | null) => {
    if (!url) return '';
    if (absoluteUrlPattern.test(url)) return url;
    return `${import.meta.env.VITE_SERVER_URL || ''}${url}`;
};
