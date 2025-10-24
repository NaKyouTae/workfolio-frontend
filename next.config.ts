import type { NextConfig } from "next";
import {webpack} from "next/dist/compiled/webpack/webpack"

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // 🔥 Strict Mode 비활성화 (API 중복 호출 확인용)
  webpack: (config, { isServer }) => {
    if (isServer) {
      // 서버에서만 로그 출력하도록 설정
      config.plugins.push(
          new webpack.DefinePlugin({
            'process.env.LOG_LEVEL': JSON.stringify('debug')
          })
      );
    }
    return config;
  },
};

export default nextConfig;
