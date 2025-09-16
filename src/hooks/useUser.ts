import { useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import { WorkerGetResponse, WorkerUpdateNickNameResponse } from '../../generated/worker';
import HttpMethod from '@/enums/HttpMethod';

export const useUser = () => {
    const { user, isLoading, error, setUser, setLoading, setError, clearUser } = useUserStore();
    
    // 유저 정보 가져오기 (useCallback으로 메모이제이션)
    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/workers/me', { method: HttpMethod.GET });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: WorkerGetResponse = await response.json();
            
            if (data.worker) {
                setUser(data.worker);
            } else {
                setError('유저 정보를 찾을 수 없습니다.');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '유저 정보를 가져오는 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error fetching user info:', err);
        } finally {
            setLoading(false);
        }
    }, [setUser, setLoading, setError]);
    
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
        fetchUser,
        logout,
        refreshUser,
        updateUserNickname,
        deleteAccount,
        isLoggedIn: !!user,
    };
};
