'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
    interface Window {
        gtag: (
            command: string,
            targetId: string,
            config?: {
                page_path?: string;
                page_title?: string;
            }
        ) => void;
        dataLayer: unknown[];
    }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

export const useGAPageView = () => {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === 'undefined' || !window.gtag) return;

        // URL의 쿼리 파라미터 포함하여 전체 경로 생성
        const pagePath = window.location.pathname + window.location.search;
        const pageTitle = document.title;

        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: pagePath,
            page_title: pageTitle,
        });
    }, [pathname]);
};

