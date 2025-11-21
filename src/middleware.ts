import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 루트 경로(/)로 접근하면 records로 리다이렉트
    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/records', request.url));
    }
    
    // 어드민 페이지 보호
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // 어드민 로그인 페이지는 허용
        if (request.nextUrl.pathname === '/admin') {
            return NextResponse.next();
        }
        
        // 어드민 대시보드 및 하위 페이지는 토큰 확인
        const adminAccessToken = request.cookies.get('admin_access_token');
        const adminRefreshToken = request.cookies.get('admin_refresh_token');
        
        if (!adminAccessToken && !adminRefreshToken) {
            // 토큰이 없으면 어드민 로그인 페이지로 리다이렉트
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }
    
    // 로그인 페이지는 항상 허용
    if (request.nextUrl.pathname === '/login') {
        const response = NextResponse.next();
        
        // portal 로그인 성공 시 (accessToken이 있는 경우) admin 토큰 제거
        const accessToken = request.cookies.get('accessToken');
        const refreshToken = request.cookies.get('refreshToken');
        
        if (accessToken && refreshToken) {
            // admin 토큰 제거
            response.cookies.delete('admin_access_token');
            response.cookies.delete('admin_refresh_token');
        }
        
        return response;
    }
    
    // 보호된 페이지들 (토큰이 필요한 페이지) - 현재는 없음
    // records와 mypage는 샘플 데이터로 접근 가능하도록 허용
    const protectedPaths: string[] = [];
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));
    
    if (isProtectedPath) {
        // 토큰 확인
        const accessToken = request.cookies.get('accessToken');
        
        if (!accessToken) {
            // 토큰이 없으면 로그인 페이지로 리다이렉트 (임시 주석 처리)
            // return NextResponse.redirect(new URL('/login', request.url));
            console.log('⚠️ [middleware] No access token found, but redirect disabled (임시 주석 처리)');
        }
    }
    
    // 다른 모든 페이지는 허용
    return NextResponse.next();
}

// 이 미들웨어가 적용될 경로를 정의
export const config = {
    matcher: [
        '/',
        '/records/:path*',
        '/company-history/:path*',
        '/mypage/:path*',
        '/login',
        '/admin/:path*',
        // 필요한 다른 경로들도 추가 가능
    ],
};

