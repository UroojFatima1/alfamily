/** @type {import('next').NextConfig} */

// next.config.js
export default {
    async rewrites()
    {
        return [
            {
                source: "/api/auth/:path*",
                destination: "https://alfamilys.vercel.app/api/auth/:path*",
            },
        ];
    },
};
