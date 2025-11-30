import { create } from 'zustand';
import { Worker } from '@/generated/common';

const USER_STORAGE_KEY = 'workfolio_user';

// localStorage에 user 저장
const saveUserToStorage = (user: Worker | null): void => {
    if (typeof window === 'undefined') return;
    try {
        if (user) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(USER_STORAGE_KEY);
        }
    } catch {
        // localStorage 쓰기 실패 시 조용히 처리
    }
};

interface UserState {
    // 유저 정보
    user: Worker | null;
    isLoading: boolean;
    error: string | null;
    isHydrated: boolean; // 클라이언트 hydration 완료 여부
    
    // 액션들
    setUser: (user: Worker | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearUser: () => void;
    hydrate: () => void; // localStorage에서 복원 (동기적으로 실행)
}

export const useUserStore = create<UserState>((set, get) => {
    // 서버와 클라이언트 모두 동일한 초기 상태로 시작 (Hydration 에러 방지)
    return {
        // 초기 상태: 서버와 클라이언트 모두 null로 시작
        user: null,
        isLoading: false,
        error: null,
        isHydrated: false,
    
        // 액션들
        setUser: (user: Worker | null) => {
            saveUserToStorage(user); // localStorage에 저장
            set({ user });
        },
        setLoading: (loading: boolean) => set({ isLoading: loading }),
        setError: (error: string | null) => set({ error }),
        clearUser: () => {
            saveUserToStorage(null); // localStorage에서 제거
            set({ user: null, error: null });
        },
        hydrate: () => {
            // 클라이언트에서만 localStorage에서 복원 (동기적으로 실행)
            if (typeof window === 'undefined') return;
            // 이미 복원되었으면 다시 실행하지 않음
            if (get().isHydrated) return;
            try {
                const stored = localStorage.getItem(USER_STORAGE_KEY);
                if (stored) {
                    const user = JSON.parse(stored) as Worker;
                    set({ user, isHydrated: true });
                } else {
                    set({ isHydrated: true });
                }
            } catch {
                // localStorage 읽기 실패 시 조용히 처리
                set({ isHydrated: true });
            }
        },
    };
});
