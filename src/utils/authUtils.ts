'use client';

/**
 * 클라이언트 사이드에서 로그인 상태를 확인하는 유틸리티 함수
 * @returns 로그인 여부 (accessToken 또는 refreshToken이 있으면 true)
 */
export function isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    
    const cookies = document.cookie.split('; ');
    const accessToken = cookies.find(row => row.startsWith('accessToken='))?.split('=')[1];
    const refreshToken = cookies.find(row => row.startsWith('refreshToken='))?.split('=')[1];
    
    return !!(accessToken || refreshToken);
}

