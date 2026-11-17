import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.resolve.alias['react-router-dom'] = path.resolve(
            process.cwd(),
            'lib/router.tsx',
        );

        return config;
    },
    async rewrites() {
        const apiUrl = (process.env.API_URL || 'http://127.0.0.1:8000/api/v1').replace(
            /\/+$/,
            '',
        );

        let apiOrigin = 'http://127.0.0.1:8000';

        try {
            apiOrigin = new URL(apiUrl).origin;
        } catch {
            // Keep the default origin for malformed values.
        }

        return [
            {
                source: '/api/:path*',
                destination: `${apiOrigin}/api/:path*`,
            },
            {
                source: '/storage/:path*',
                destination: `${apiOrigin}/storage/:path*`,
            },
            {
                source: '/uploads/:path*',
                destination: `${apiOrigin}/uploads/:path*`,
            },
        ];
    },
};

export default nextConfig;
