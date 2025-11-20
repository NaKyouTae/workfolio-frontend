'use client';

import { useEffect } from 'react';
import { setupFetchInterceptor } from '@/utils/clientFetch';

/**
 * Fetch 인터셉터 초기화 컴포넌트
 * 클라이언트 사이드에서 전역 fetch를 오버라이드하여 토큰 재발급 처리
 */
export default function FetchInterceptor() {
    useEffect(() => {
        // 클라이언트 사이드에서만 실행
        setupFetchInterceptor();
    }, []);

    return null; // UI 렌더링 없음
}

