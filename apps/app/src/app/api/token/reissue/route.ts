import { NextResponse } from 'next/server';
import { getCookie } from '@workfolio/shared/utils/cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/token/reissue - 토큰 재발급
export async function GET() {
    try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'No refresh token found' },
                { status: 401 }
            );
        }

        // 백엔드 API를 직접 호출 (apiFetchHandler 사용하지 않음 - 무한 재귀 방지)
        const response = await fetch(`${API_BASE_URL}/api/token/reissue`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken || '',
                'RefreshToken': refreshToken,
            },
        });

        const data = await response.json();

        // reissue API에서 401이 발생하면 그냥 401 반환 (무한 재귀 방지)
        if (response.status === 401) {
            return NextResponse.json(data, { status: 401 });
        }

        if (response.status === 200 && data.accessToken) {
            // 재발급 성공 시 쿠키에 저장
            const res = NextResponse.json(data);

            res.cookies.set('accessToken', data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                domain: 'localhost',
                maxAge: 60 * 60 * 24 * 7, // 1시간
            });

            if (data.refreshToken) {
                res.cookies.set('refreshToken', data.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    domain: 'localhost',
                    maxAge: 60 * 60 * 24 * 7, // 7일
                });
            }

            return res;
        }

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error during token reissue:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
