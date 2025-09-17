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
    
    // 다른 모든 페이지는 토큰 없이도 접근 가능
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

