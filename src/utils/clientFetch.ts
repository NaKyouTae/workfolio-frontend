/**
 * 클라이언트 사이드 fetch 인터셉터
 * 401 응답을 가로채서 토큰 재발급 후 원래 요청 재시도
 */

// 토큰 재발급 중복 방지를 위한 전역 상태
let isRefreshing = false;
let refreshPromise: Promise<{ accessToken: string } | null> | null = null;

// 원본 fetch 저장 (무한 재귀 방지)
let originalFetch: typeof fetch | null = null;

// refreshToken 존재 여부 확인 (httpOnly 쿠키는 직접 읽을 수 없으므로 쿠키 존재 여부만 확인)
function hasRefreshToken(): boolean {
    if (typeof document === 'undefined') return false;
    return document.cookie.includes('refreshToken=');
}

// 토큰 재발급 함수 (중복 호출 방지)
async function refreshTokenSafely(): Promise<{ accessToken: string } | null> {
    // 이미 재발급 중이면 기존 Promise 반환
    if (isRefreshing && refreshPromise) {
        console.log('⏳ Token refresh already in progress, waiting...');
        return refreshPromise;
    }

    // 재발급 시작
    isRefreshing = true;
    console.log('🔄 Starting token refresh...');

    refreshPromise = (async () => {
        try {
            if (!hasRefreshToken()) {
                console.error('❌ No refresh token found');
                return null;
            }

            // 원본 fetch 사용 (무한 재귀 방지)
            const fetchFn = originalFetch || fetch;

            // 서버 API를 통해 토큰 재발급 (httpOnly 쿠키는 자동으로 전송됨)
            const reissueResponse = await fetchFn('/api/token/reissue', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (reissueResponse.ok) {
                const reissueData = await reissueResponse.json();
                console.log('✅ Token reissue successful');

                // 서버에서 쿠키로 토큰이 설정되므로, 응답에서 accessToken만 반환
                if (reissueData.accessToken) {
                    return {
                        accessToken: reissueData.accessToken,
                    };
                }
                return null;
            } else {
                console.error('❌ Token reissue failed:', reissueResponse.status);
                return null;
            }
        } catch (error) {
            console.error('❌ Error during token reissue:', error);
            return null;
        } finally {
            // 재발급 완료 후 상태 초기화
            isRefreshing = false;
            refreshPromise = null;
        }
    })() as Promise<{ accessToken: string } | null>;

    return refreshPromise;
}

// 원본 fetch 타입 정의
type FetchType = typeof fetch;

// fetch 인터셉터 래퍼
export const clientFetch: FetchType = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    // 원본 fetch 사용 (무한 재귀 방지)
    const fetchFn = originalFetch || fetch;
    
    // 원본 fetch 호출
    const response = await fetchFn(input, init);

    // 401 에러 발생 시 토큰 재발급 시도
    if (response.status === 401) {
        console.log('🔄 401 Unauthorized detected, attempting token refresh...');
        
        // refresh token이 있으면 재발급 시도
        if (hasRefreshToken()) {
            console.log('✅ Refresh token found, calling reissue API...');
            
            try {
                // 중복 방지된 토큰 재발급 (동시 요청 시 하나의 reissue만 실행)
                const tokenData = await refreshTokenSafely();
                
                if (tokenData && tokenData.accessToken) {
                    // 새 access token으로 원래 요청 재시도
                    console.log('🔁 Retrying original request with new token...');
                    
                    const newHeaders = new Headers(init?.headers);
                    newHeaders.set('Authorization', `Bearer ${tokenData.accessToken}`);
                    
                    // 원본 fetch 사용 (무한 재귀 방지)
                    const fetchFn = originalFetch || fetch;
                    const retryResponse = await fetchFn(input, {
                        ...init,
                        headers: newHeaders,
                    });
                    
                    // 재시도 응답도 401이면 토큰 재발급이 실패한 것
                    if (retryResponse.status === 401) {
                        console.error('❌ Retry after token refresh also returned 401 - redirecting to login');
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                        return retryResponse;
                    }
                    
                    // 재시도 성공 시 사용자 정보를 다시 가져오도록 이벤트 발생
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('tokenRefreshed'));
                    }
                    
                    return retryResponse;
                } else {
                    console.error('❌ Token reissue failed');
                    // 재발급 실패 시 로그인 페이지로 리다이렉트
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    return response;
                }
            } catch (error) {
                console.error('❌ Error during token reissue:', error);
                // 에러 발생 시 로그인 페이지로 리다이렉트
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return response;
            }
        } else {
            // refresh token이 없으면 로그인 페이지로 리다이렉트
            console.error('❌ No refresh token found');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            return response;
        }
    }

    return response;
};

// 기본 export로 설정
export default clientFetch;

// Window 인터페이스 확장
declare global {
    interface Window {
        __fetchInterceptorSetup?: boolean;
    }
}

/**
 * 전역 fetch를 오버라이드하여 자동으로 토큰 재발급 처리
 * 클라이언트 사이드에서만 동작
 * 
 * @example
 * // app/layout.tsx 또는 _app.tsx에서 호출
 * if (typeof window !== 'undefined') {
 *   setupFetchInterceptor();
 * }
 */
export function setupFetchInterceptor() {
    if (typeof window === 'undefined') {
        console.warn('setupFetchInterceptor should only be called on client side');
        return;
    }

    // 이미 설정되었는지 확인
    if (window.__fetchInterceptorSetup) {
        return;
    }

    // 원본 fetch 저장 (무한 재귀 방지)
    if (!originalFetch) {
        originalFetch = window.fetch;
    }

    // fetch 오버라이드
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        // clientFetch를 통해 처리
        return clientFetch(input, init);
    };

    // 설정 완료 표시
    window.__fetchInterceptorSetup = true;
    console.log('✅ Fetch interceptor setup complete');
}

