import { useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import { WorkerGetResponse, WorkerUpdateNickNameResponse } from '@/generated/worker';
import HttpMethod from '@/enums/HttpMethod';

export const useUser = () => {
    const { user, isLoading, error, setUser, setLoading, setError, clearUser } = useUserStore();
    
    // 유저 정보 가져오기 (useCallback으로 메모이제이션)
    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // 쿠키에서 토큰 확인
            const hasToken = document.cookie.includes('refreshToken=');
            
            if (!hasToken) {
                // 토큰이 없으면 사용자 정보를 클리어하고 조용히 종료
                console.log('🔴 [useUser] No token found, user not logged in - clearUser 호출');
                clearUser();
                return;
            }
            
            const response = await fetch('/api/workers/me', { method: HttpMethod.GET });
            
            const data: WorkerGetResponse = await response.json();

            console.log('======================');
            console.log('data', data);
            console.log('======================');
            
            if (data.worker) {
                setUser(data.worker);
            } else {
                // 서버에서 유저 정보를 찾을 수 없으면 사용자 정보 클리어
                console.log('🔴 [useUser] No user data from server - clearUser 호출');
                clearUser();
            }
        } catch (err) {
            console.log('Error fetching user info:', err);
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
            console.log('🔴 [useUser] deleteAccount 성공 - clearUser 호출');
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
        console.log('🔴 [useUser] logout 호출 - clearUser 호출');
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
        fetchUser,
        logout,
        refreshUser,
        updateUserNickname,
        deleteAccount,
        isLoggedIn: !!user,
    };
};
