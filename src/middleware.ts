import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    if(request.nextUrl.pathname == '/login') {
        return NextResponse.next()
    }
    
    // 쿠키에서 accessToken과 refreshToken 확인
    const accessToken = request.cookies.get('accessToken');
    const refreshToken = request.cookies.get('refreshToken');
    
    // 토큰이 없으면 로그인 페이지로 리디렉션
    if (!accessToken || !refreshToken) {
        request.cookies.delete('accessToken')
        request.cookies.delete('refreshToken')
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // 토큰이 있으면 대시보드 페이지로 리디렉션
    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    return NextResponse.next();
}

// 이 미들웨어가 적용될 경로를 정의
export const config = {
    matcher: ['/', '/dashboard/:path*'],
};
