/**
 * 토큰 재발급을 지원하는 자동 인터셉터
 * 
 * ## 동작 방식
 * - 앱 시작 시 `setupGlobalFetchInterceptor()`가 자동으로 호출됨
 * - 모든 fetch API 호출이 자동으로 가로채짐
 * - 401 에러 발생 시 자동으로 토큰 재발급 시도
 * - 재발급 성공 시 원래 요청 자동 재시도
 * - 사용자는 토큰 만료를 인지하지 못함
 * 
 * ## 사용 방법
 * 별도의 작업이 필요 없습니다. 일반적인 fetch를 그대로 사용하세요:
 * 
 * ```typescript
 * // 자동으로 401 처리됨
 * const response = await fetch('/api/workers/me', {
 *   method: 'GET',
 * });
 * ```
 * 
 * ## 토큰 재발급 플로우
 * 1. API 호출 → 401 Unauthorized 발생
 * 2. 자동으로 /api/token/reissue 호출 (refresh token 체크)
 * 3. Refresh token이 있으면 → 새 access token 발급
 * 4. 원래 API 요청 자동 재시도 → 응답 반환 ✅
 * 5. Refresh token이 없거나 만료되면 → 로그인 페이지로 리다이렉트 (개발 중 비활성화)
 * 
 * ## 제외되는 API
 * - `/api/token/reissue` (토큰 재발급 API 자체)
 * - 외부 도메인 API (다른 서버의 API)
 * 
 * ## 개발 완료 후 해야 할 일
 * `redirectToLogin()` 함수의 주석을 해제하여 로그인 페이지 리다이렉트 활성화
 */

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// 토큰 재발급 대기 중인 요청들을 처리
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// 토큰 재발급 완료 후 대기 중인 요청들에게 알림
function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

// 토큰 재발급 실패 시 대기 중인 요청들 초기화
function onRefreshFailed() {
  refreshSubscribers = [];
}

// 참고: httpOnly 쿠키는 클라이언트에서 읽을 수 없으므로,
// 401 에러 발생 시 무조건 토큰 재발급을 시도하고 실패하면 로그인 페이지로 이동

// 원래 fetch를 저장 (interceptor 설정 전에 저장)
let _internalFetch: typeof fetch;
if (typeof window !== 'undefined') {
  _internalFetch = window.fetch.bind(window);
} else {
  _internalFetch = fetch;
}

// 토큰 재발급 시도
async function refreshToken(): Promise<string | null> {
  try {
    console.log('🔄 Attempting token refresh...');
    const response = await _internalFetch('/api/token/reissue', {
      method: 'GET',
      credentials: 'include',
    });

    console.log('📡 Token refresh response status:', response.status);

    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ Refresh token not found or expired');
      } else {
        console.error('❌ Token refresh failed with status:', response.status);
      }
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    console.log('✅ Token refresh successful');
    console.log('✅ New access token received');
    return data.accessToken || null;
  } catch (error) {
    console.error('❌ Error refreshing token:', error);
    return null;
  }
}

// 로그인 페이지로 리다이렉트
function redirectToLogin() {
  console.log('🚪 Should redirect to login page (currently disabled for development)');
  
  // 개발 완료 후 주석 해제
  // httpOnly 쿠키는 클라이언트에서 삭제 불가
  // 로그아웃 API를 통해 서버에서 쿠키 삭제
  // _internalFetch('/api/logout', { method: 'POST' })
  //   .catch(err => console.error('Logout API error:', err))
  //   .finally(() => {
  //     // 로그인 페이지로 이동
  //     window.location.href = '/login';
  //   });
}

/**
 * 토큰 재발급을 지원하는 fetch wrapper
 * @param input - fetch의 첫 번째 인자 (URL 또는 Request)
 * @param init - fetch의 두 번째 인자 (RequestInit)
 * @returns Promise<Response>
 */
export async function fetchWithTokenRefresh(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  
  // 첫 번째 요청 시도 (원래 fetch 사용하여 무한 루프 방지)
  let response = await _internalFetch(input, init);

  console.log(`📞 API call to ${url} - Status: ${response.status}`);

  // 401 에러가 아니면 그대로 반환
  if (response.status !== 401) {
    return response;
  }

  console.log(`🔒 401 Unauthorized detected for ${url}`);
  console.log('🔄 Starting token refresh process...');

  // 401 에러이고 로그인된 경우 토큰 재발급 시도
  if (isRefreshing) {
    console.log('⏳ Token refresh already in progress, waiting...');
    // 이미 토큰 재발급 중이면 대기
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh(() => {
        // 토큰 재발급 성공 후 원래 요청 재시도
        _internalFetch(input, init)
          .then(resolve)
          .catch(reject);
      });
    });
  }

  isRefreshing = true;

  try {
    // 토큰 재발급 시도 (refresh token이 있는지 자동으로 체크됨)
    const newToken = await refreshToken();
    console.log('🔄 New token:', newToken);
    
    if (!newToken) {
      // 토큰 재발급 실패 (refresh token이 없거나 만료됨)
      console.error('❌ Token refresh failed - no refresh token or expired');
      onRefreshFailed();
      isRefreshing = false;
      
      // 로그인 페이지로 리다이렉트 (개발 중에는 주석 처리됨)
      redirectToLogin();
      
      return response;
    }

    // 토큰 재발급 성공
    console.log('✅ Token refresh successful, notifying waiting requests...');
    onRefreshed(newToken);
    isRefreshing = false;

    console.log('🔁 Retrying original request with new token...');
    // 원래 요청 재시도
    response = await _internalFetch(input, init);
    console.log('✅ Retry successful, status:', response.status);
    return response;
  } catch (error) {
    console.error('❌ Error in fetchWithTokenRefresh:', error);
    onRefreshFailed();
    isRefreshing = false;
    
    // 에러 발생 시에도 로그인 페이지로 리다이렉트 (개발 중에는 주석 처리됨)
    redirectToLogin();
    
    return response;
  }
}

/**
 * 전역 fetch를 래핑하여 자동 토큰 재발급 지원
 * 모든 API 호출에서 401 에러 발생 시 자동으로 토큰 재발급 시도
 * 
 * ## 동작 방식
 * 1. 모든 fetch 호출을 가로챔
 * 2. 401 에러 발생 시 자동으로 토큰 재발급 시도
 * 3. 재발급 성공 시 원래 요청 자동 재시도
 * 4. 재발급 실패 시 로그인 페이지로 리다이렉트 (개발 중에는 비활성화)
 * 
 * ## 제외되는 API
 * - /api/token/reissue (토큰 재발급 API 자체)
 * - 외부 도메인 API
 */
export function setupGlobalFetchInterceptor() {
  if (typeof window === 'undefined') {
    console.log('⚠️ Server-side detected, skipping fetch interceptor');
    return;
  }

  // 이미 오버라이드되어 있는지 체크
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window.fetch as any).__intercepted) {
    console.log('⚠️ Fetch interceptor already installed');
    return;
  }

  // 원래 fetch 저장
  const _originalFetch = window.fetch.bind(window);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    // 토큰 재발급 API 자체는 원래 fetch 사용 (무한 루프 방지)
    if (url.includes('/api/token/reissue')) {
      return _originalFetch(input, init);
    }
    
    // 외부 API는 제외
    if (url.startsWith('http://') || url.startsWith('https://')) {
      if (!url.includes(window.location.host)) {
        return _originalFetch(input, init);
      }
    }
    
    // 첫 번째 요청 시도
    let response = await _originalFetch(input, init);
    
    // 401 에러가 아니면 그대로 반환
    if (response.status !== 401) {
      return response;
    }
    
    console.log(`🔒 401 Unauthorized detected for ${url} - attempting token refresh`);
    
    // 401 에러 발생 시 토큰 재발급 시도
    if (isRefreshing) {
      console.log('⏳ Token refresh already in progress, waiting...');
      // 이미 토큰 재발급 중이면 대기
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(() => {
          // 토큰 재발급 성공 후 원래 요청 재시도
          _originalFetch(input, init)
            .then(resolve)
            .catch(reject);
        });
      });
    }

    isRefreshing = true;

    try {
      // 토큰 재발급 시도 (refresh token이 있는지 자동으로 체크됨)
      const newToken = await refreshToken();
      
      if (!newToken) {
        // 토큰 재발급 실패 (refresh token이 없거나 만료됨)
        console.error('❌ Token refresh failed - no refresh token or expired');
        onRefreshFailed();
        isRefreshing = false;
        
        // 로그인 페이지로 리다이렉트 (개발 중에는 주석 처리됨)
        redirectToLogin();
        
        return response;
      }

      // 토큰 재발급 성공
      console.log('✅ Token refresh successful, notifying waiting requests...');
      onRefreshed(newToken);
      isRefreshing = false;

      console.log('🔁 Retrying original request with new token...');
      // 원래 요청 재시도
      response = await _originalFetch(input, init);
      console.log('✅ Retry successful, status:', response.status);
      return response;
    } catch (error) {
      console.error('❌ Error in token refresh process:', error);
      onRefreshFailed();
      isRefreshing = false;
      
      // 에러 발생 시에도 로그인 페이지로 리다이렉트 (개발 중에는 주석 처리됨)
      redirectToLogin();
      
      return response;
    }
  };

  // 오버라이드 표시
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((window as any).fetch).__intercepted = true;
  
  console.log('✅ Global fetch interceptor enabled - all API calls with 401 error will auto-refresh token');
}

