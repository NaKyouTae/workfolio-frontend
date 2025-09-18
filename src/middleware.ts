import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 루트 경로(/)로 접근하면 dashboard로 리다이렉트
    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // 로그인 페이지는 항상 허용
    if (request.nextUrl.pathname === '/login') {
        return NextResponse.next();
    }
    
    // 보호된 페이지들 (토큰이 필요한 페이지)
    const protectedPaths = ['/dashboard', '/mypage'];
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));
    
    if (isProtectedPath) {
        // 토큰 확인
        const accessToken = request.cookies.get('accessToken');
        
        if (!accessToken) {
            // 토큰이 없으면 로그인 페이지로 리다이렉트
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
    
    // 다른 모든 페이지는 허용
    return NextResponse.next();
}

// 이 미들웨어가 적용될 경로를 정의
export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/mypage/:path*',
        '/login',
        // 필요한 다른 경로들도 추가 가능
    ],
};

