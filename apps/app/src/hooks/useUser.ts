import { useCallback, useLayoutEffect } from 'react';
import { useUserStore } from '@workfolio/shared/store/userStore';
import { WorkerGetResponse, WorkerUpdateNickNameResponse } from '@workfolio/shared/generated/worker';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';

export const useUser = () => {
    const { user, isLoading, error, isHydrated, setUser, setLoading, setError, clearUser, hydrate } = useUserStore();
    
    // 클라이언트에서만 localStorage에서 복원 (Hydration 에러 방지)
    // useLayoutEffect를 사용하여 브라우저 페인트 전에 실행 (깜빡임 최소화)
    useLayoutEffect(() => {
        if (typeof window !== 'undefined' && !isHydrated) {
            hydrate();
        }
    }, [isHydrated, hydrate]);
    
    // 유저 정보 가져오기 (useCallback으로 메모이제이션)
    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // httpOnly 쿠키는 JavaScript로 읽을 수 없으므로 cookie 체크 없이 바로 API 호출
            // 서버에서 쿠키를 확인하고 응답을 주므로, cookie 조회 지연 없이 즉시 호출
            // 401이면 서버 사이드(apiFetchHandler)에서 자동으로 토큰 재발급 처리
            const response = await fetch('/api/workers/me', { method: HttpMethod.GET });
            
            // 응답 상태 확인
            if (!response.ok) {
                if (response.status === 401) {
                    // 401 응답이면 토큰 재발급이 시도되었을 수 있음
                    // 서버 사이드(apiFetchHandler)에서 이미 처리했으므로, 재발급 실패 시에만 clearUser 
                    // 토큰 재발급이 실패했을 가능성이 높으므로 clearUser 호출
                    clearUser();
                    return;
                }
                // 다른 에러면 사용자 정보 클리어
                clearUser();
                return;
            }
            
            const data: WorkerGetResponse = await response.json();
            
            if (data.worker) {
                setUser(data.worker);
            } else {
                // 서버에서 유저 정보를 찾을 수 없으면 사용자 정보 클리어
                clearUser();
            }
        } catch (err) {
            // 네트워크 에러 등은 조용히 처리
            // 기존 user가 있으면 유지하고, 없으면 clearUser 호출하지 않음
            // (리프레시 시 일시적인 네트워크 문제일 수 있으므로)
            console.error('Error fetching user info:', err);
            // catch 블록에서는 clearUser를 호출하지 않음 (기존 상태 유지)
            // localStorage에서 복원된 user가 있으면 유지됨
        } finally {
            setLoading(false);
        }
    }, [setUser, setLoading, setError, clearUser]);
    
    // 회원 탈퇴
    const deleteAccount = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/workers/me', { method: HttpMethod.DELETE });
            
            // 400 에러가 발생해도 회원 탈퇴가 완료된 것으로 간주
            if (!response.ok && response.status !== 400) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // 성공 시 유저 정보 클리어 및 로그아웃
            clearUser();
            document.cookie = 'accessToken=; max-age=0; path=/';
            document.cookie = 'refreshToken=; max-age=0; path=/';
            
            // 로그인 페이지로 리다이렉트
            window.location.href = '/login';
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '회원 탈퇴 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error deleting account:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [clearUser, setLoading, setError]);
    
    // 로그아웃
    const logout = useCallback(() => {
        clearUser();
        // 쿠키에서 토큰 제거
        document.cookie = 'accessToken=; max-age=0; path=/';
        document.cookie = 'refreshToken=; max-age=0; path=/';
    }, [clearUser]);
    
    // 유저 정보 새로고침
    const refreshUser = useCallback(() => {
        fetchUser();
    }, [fetchUser]);
    
    // 닉네임 업데이트
    const updateUserNickname = useCallback(async (newNickName: string) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`/api/workers/${encodeURIComponent(newNickName)}`, { method: HttpMethod.PUT });
            
            if (!response.ok) {
                if (response.status === 409) {
                    throw new Error('이 닉네임은 이미 사용 중이에요.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: WorkerUpdateNickNameResponse = await response.json();
            
            if (data.isSuccess) {
                // 성공 시 유저 정보 새로고침
                await fetchUser();
            } else {
                setError('닉네임 변경에 실패했습니다.');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '닉네임 변경 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error updating nickname:', err);
            throw err; // Mypage에서 에러를 처리할 수 있도록 다시 throw
        } finally {
            setLoading(false);
        }
    }, [fetchUser, setLoading, setError]);
    
    return {
        user,
        isLoading,
        error,
        isHydrated, // hydration 완료 여부도 반환
        fetchUser,
        logout,
        refreshUser,
        updateUserNickname,
        deleteAccount,
        isLoggedIn: !!user,
    };
};
