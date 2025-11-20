import { NextRequest, NextResponse } from 'next/server';
import { getCookie } from '@/utils/cookie';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import HttpMethod from '@/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/token/reissue - 토큰 재발급
export async function GET(request: NextRequest) {
    try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'No refresh token found' },
                { status: 401 }
            );
        }

        // 백엔드 API를 통해 토큰 재발급
        const response = await apiFetchHandler(
            `${API_BASE_URL}/api/token/reissue`,
            HttpMethod.GET,
            undefined,
            accessToken,
            {
                'RefreshToken': refreshToken,
            }
        );

        const data = await response.json();

        if (response.status === 200 && data.accessToken) {
            // 재발급 성공 시 쿠키에 저장
            const res = NextResponse.json(data);
            
            res.cookies.set('accessToken', data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                domain: 'localhost',
                maxAge: 60 * 60 * 24 * 7, // 7일
            });

            if (data.refreshToken) {
                res.cookies.set('refreshToken', data.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    domain: 'localhost',
                    maxAge: 60 * 60 * 24 * 30, // 30일
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

