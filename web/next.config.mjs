import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.voltwavebd.com',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8083',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8083',
            },
        ],
    },
    webpack(config) {
        config.resolve.alias['react-router-dom'] = path.resolve(
            process.cwd(),
            'lib/router.tsx',
        );

        return config;
    },
    async rewrites() {
        const apiUrl = (process.env.API_URL || 'http://127.0.0.1:8083/api/v1').replace(
            /\/+$/,
            '',
        );

        let apiOrigin = 'http://127.0.0.1:8083';

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
