import { useState, useEffect } from 'react';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';

/**
 * SSR 환경에서 데모 배너 깜빡임을 방지하기 위해
 * 클라이언트 마운트 후에만 데모 여부를 판단하는 훅
 */
export function useIsDemo(): boolean | null {
    const [isDemo, setIsDemo] = useState<boolean | null>(null);

    useEffect(() => {
        setIsDemo(!isLoggedIn());
    }, []);

    return isDemo;
}
