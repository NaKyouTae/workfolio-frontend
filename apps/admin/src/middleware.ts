import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const protocol = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol;
    if (protocol === "http:") {
        const httpsUrl = request.nextUrl.clone();
        httpsUrl.protocol = "https:";
        return NextResponse.redirect(httpsUrl, 301);
    }

    if (request.nextUrl.pathname.startsWith("/dashboard")) {
        const adminAccessToken = request.cookies.get("admin_access_token");
        const adminRefreshToken = request.cookies.get("admin_refresh_token");

        if (!adminAccessToken && !adminRefreshToken) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
