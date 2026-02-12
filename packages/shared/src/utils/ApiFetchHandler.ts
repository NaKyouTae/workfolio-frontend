import {NextResponse} from "next/server"
import HttpMethod from "../enums/HttpMethod"
import {cookies} from "next/headers"

// 토큰 재발급 중복 방지를 위한 전역 상태
let isRefreshing = false;
let refreshPromise: Promise<{ accessToken: string; refreshToken: string } | null> | null = null;

// 토큰 재발급 함수 (중복 호출 방지)
async function refreshTokenSafely(accessToken: string | undefined, refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    // 이미 재발급 중이면 기존 Promise 반환
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    // 재발급 시작
    isRefreshing = true;

    refreshPromise = (async () => {
        try {
            // 백엔드 API를 직접 호출 (apiFetchHandler 사용하지 않음 - 무한 재귀 방지)
            const reissueResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/token/reissue`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken || '',
                    'RefreshToken': refreshToken,
                },
            });

            if (reissueResponse.ok) {
                const reissueData = await reissueResponse.json();
                
                // 쿠키에 저장
                const cookieStore = await cookies();
                if (reissueData.accessToken) {
                    cookieStore.set('accessToken', reissueData.accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        path: '/',
                        domain: 'localhost',
                        maxAge: 60 * 60 * 3, // 3시간
                    });
                }
                
                if (reissueData.refreshToken) {
                    cookieStore.set('refreshToken', reissueData.refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        path: '/',
                        domain: 'localhost',
                        maxAge: 60 * 60 * 24 * 7, // 7일
                    });
                }

                return {
                    accessToken: reissueData.accessToken,
                    refreshToken: reissueData.refreshToken,
                };
            } else {
                console.error('❌ [ApiFetchHandler] Token reissue failed:', reissueResponse.status);
                return null;
            }
        } catch (error) {
            console.error('❌ [ApiFetchHandler] Error during token reissue:', error);
            return null;
        } finally {
            // 재발급 완료 후 상태 초기화
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

export async function apiFetchHandler<T>(
    url: string,
    method: HttpMethod = HttpMethod.GET,
    body?: unknown,
    accessToken?: string,
    additionalHeaders?: Record<string, string>
): Promise<NextResponse<T> | NextResponse<{ message: string }>> {
    try {
        const headers: HeadersInit = {
            'Content-Type': "application/json",
        };
        
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        
        // 추가 헤더가 있으면 추가
        if (additionalHeaders) {
            Object.assign(headers, additionalHeaders);
        }
        
        const response = await fetch(url, {
            method,
            credentials: 'include',
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const status = response.status;

        // 401 에러 발생 시 refresh token으로 재발급 시도
        // accessToken이 없어도 refreshToken이 있으면 재발급 시도
        if (status === 401) {
            const cookieStore = await cookies();
            const refreshToken = cookieStore.get('refreshToken')?.value;
            
            // refresh token이 있으면 재발급 시도
            if (refreshToken) {
                try {
                    // 중복 방지된 토큰 재발급 (동시 요청 시 하나의 reissue만 실행)
                    const tokenData = await refreshTokenSafely(accessToken, refreshToken);
                    
                    if (tokenData && tokenData.accessToken) {
                        // 새 access token으로 원래 요청 재시도
                        const newAccessToken = tokenData.accessToken;
                        const retryHeaders: HeadersInit = {
                            'Content-Type': "application/json",
                            'Authorization': `Bearer ${newAccessToken}`,
                        };
                        
                        if (additionalHeaders) {
                            Object.assign(retryHeaders, additionalHeaders);
                        }
                        
                        const retryResponse = await fetch(url, {
                            method,
                            credentials: 'include',
                            headers: retryHeaders,
                            body: body ? JSON.stringify(body) : undefined,
                        });
                        
                        const retryStatus = retryResponse.status;
                        const retryResponseText = await retryResponse.text();
                        
                        try {
                            const retryData = retryResponseText ? JSON.parse(retryResponseText) : {};
                            return NextResponse.json(retryData, { status: retryStatus });
                        } catch {
                            console.error('Failed to parse JSON response:', retryResponseText);
                            return NextResponse.json({ message: 'Invalid JSON response', raw: retryResponseText }, { status: 500 });
                        }
                    } else {
                        console.error('❌ [ApiFetchHandler] Token reissue failed');
                        // 재발급 실패 시 쿠키 삭제
                        cookieStore.delete('accessToken');
                        cookieStore.delete('refreshToken');
                        return NextResponse.json({ message: 'Token reissue failed' }, { status: 401 });
                    }
                } catch (error) {
                    console.error('❌ [ApiFetchHandler] Error during token reissue:', error);
                    // 에러 발생 시 쿠키 삭제
                    cookieStore.delete('accessToken');
                    cookieStore.delete('refreshToken');
                    return NextResponse.json({ message: 'Token reissue error' }, { status: 401 });
                }
            } else {
                // refresh token이 없으면 쿠키 삭제
                console.error('❌ [ApiFetchHandler] No refresh token found');
                cookieStore.delete('accessToken');
                cookieStore.delete('refreshToken');
                cookieStore.delete('admin_access_token');
                cookieStore.delete('admin_refresh_token');
                return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
            }
        }
        
        // 응답 body를 텍스트로 먼저 읽기
        const responseText = await response.text();
        
        // JSON 파싱 시도
        try {
            const data = responseText ? JSON.parse(responseText) : {};
            return NextResponse.json(data, { status });
        } catch (parseError) {
            console.error('Failed to parse JSON response:', responseText);
            console.error('Parse error:', parseError);
            return NextResponse.json({ message: 'Invalid JSON response', raw: responseText }, { status: 500 });
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
