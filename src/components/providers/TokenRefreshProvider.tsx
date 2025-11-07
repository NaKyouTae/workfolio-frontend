'use client';

import { useEffect } from 'react';
import { setupGlobalFetchInterceptor } from '@/utils/fetchWithTokenRefresh';

/**
 * 토큰 자동 재발급을 위한 Provider
 * 앱 최상위에서 한 번만 사용
 */
export default function TokenRefreshProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window !== 'undefined') {
        console.log('setupGlobalFetchInterceptor');
      setupGlobalFetchInterceptor();
    }
  }, []);

  return <>{children}</>;
}

