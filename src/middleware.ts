import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // HTTP → HTTPS 강제 리다이렉트
    // Vercel에서는 x-forwarded-proto 헤더를 확인하여 HTTPS 강제
    const protocol = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol;
    if (protocol === "http:") {
        const httpsUrl = request.nextUrl.clone();
        httpsUrl.protocol = "https:";
        return NextResponse.redirect(httpsUrl, 301);
    }

    // 루트 경로(/)로 접근하면 records로 리다이렉트
    if (request.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/records", request.url));
    }

    // 어드민 페이지 보호
    if (request.nextUrl.pathname.startsWith("/admin")) {
        // 어드민 로그인 페이지는 허용
        if (request.nextUrl.pathname === "/admin") {
            return NextResponse.next();
        }

        // 어드민 대시보드 및 하위 페이지는 토큰 확인
        const adminAccessToken = request.cookies.get("admin_access_token");
        const adminRefreshToken = request.cookies.get("admin_refresh_token");

        if (!adminAccessToken && !adminRefreshToken) {
            // 토큰이 없으면 어드민 로그인 페이지로 리다이렉트
            return NextResponse.redirect(new URL("/admin", request.url));
        }
    }

    // 로그인 페이지는 제거되었으므로 리다이렉트
    if (request.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/records", request.url));
    }

    // 모든 페이지는 로그인 없이 접근 가능 (로그인은 팝업으로 처리)
    return NextResponse.next();
}

// 이 미들웨어가 적용될 경로를 정의
export const config = {
    matcher: [
        "/",
        "/records/:path*",
        "/company-history/:path*",
        "/mypage/:path*",
        "/login",
        "/admin/:path*",
        // 필요한 다른 경로들도 추가 가능
    ],
};
