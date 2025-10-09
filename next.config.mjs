/** @type {import('next').NextConfig} */

// next.config.js
export default {
    async rewrites()
    {
        return [
            {
                source: "/api/:path*",
                destination: "https://alfamilys.vercel.app/api/:path*",
            },
        ];
    },
};
