import type { NextConfig } from "next";
import { webpack } from "next/dist/compiled/webpack/webpack";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    transpilePackages: ["@workfolio/shared"],

    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=31536000; includeSubDomains; preload",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                ],
            },
        ];
    },

    swcMinify: true,
    compiler: {
        removeConsole:
            process.env.NODE_ENV === "production"
                ? {
                      exclude: ["error", "warn"],
                  }
                : false,
    },

    webpack: (config, { isServer }) => {
        if (isServer) {
            config.plugins.push(
                new webpack.DefinePlugin({
                    "process.env.LOG_LEVEL": JSON.stringify("debug"),
                })
            );
        }
        return config;
    },
};

export default nextConfig;
