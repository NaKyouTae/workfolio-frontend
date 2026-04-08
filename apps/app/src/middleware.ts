import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const protocol = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol;

    // http → https 리디렉트
    if (protocol === "http:") {
        const httpsUrl = request.nextUrl.clone();
        httpsUrl.protocol = "https:";
        return NextResponse.redirect(httpsUrl, 301);
    }

    // OAuth 콜백: 백엔드에서 리다이렉트된 토큰 쿼리 파라미터를 쿠키로 저장
    const accessToken = request.nextUrl.searchParams.get("access_token");
    const refreshToken = request.nextUrl.searchParams.get("refresh_token");
    if (accessToken && refreshToken) {
        const response = NextResponse.redirect(new URL("/dashboard", request.url));
        const isProduction = process.env.NODE_ENV === "production";

        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 2, // 2시간
        });
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7일
        });

        // 클라이언트에서 로그인 상태를 확인할 수 있는 non-httpOnly 쿠키
        response.cookies.set("logged_in", "true", {
            httpOnly: false,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7일
        });

        return response;
    }

    if (request.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/info", request.url));
    }

    if (request.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (request.nextUrl.pathname.startsWith("/mypage")) {
        const existingAccessToken = request.cookies.get("accessToken");
        const existingRefreshToken = request.cookies.get("refreshToken");
        if (!existingAccessToken && !existingRefreshToken) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|assets|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)",
    ],
};
