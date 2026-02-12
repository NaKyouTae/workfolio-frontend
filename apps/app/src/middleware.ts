import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const protocol = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol;
    if (protocol === "http:") {
        const httpsUrl = request.nextUrl.clone();
        httpsUrl.protocol = "https:";
        return NextResponse.redirect(httpsUrl, 301);
    }

    if (request.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/records", request.url));
    }

    if (request.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/records", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/records/:path*",
        "/company-history/:path*",
        "/mypage/:path*",
        "/login",
    ],
};
