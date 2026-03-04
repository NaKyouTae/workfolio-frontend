'use client';

/**
 * 클라이언트 사이드에서 로그인 상태를 확인하는 유틸리티 함수
 * @returns 로그인 여부 (accessToken 또는 refreshToken이 있으면 true)
 */
export function isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;

    const cookies = document.cookie.split('; ');
    // httpOnly 토큰은 JS에서 읽을 수 없으므로 logged_in 쿠키로 확인
    const loggedIn = cookies.find(row => row.startsWith('logged_in='))?.split('=')[1];

    return loggedIn === 'true';
}

