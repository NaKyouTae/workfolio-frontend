import { create } from 'zustand';
import { Worker } from '@/generated/common';

interface UserState {
    // 유저 정보
    user: Worker | null;
    isLoading: boolean;
    error: string | null;
    
    // 액션들
    setUser: (user: Worker | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    // 초기 상태
    user: null,
    isLoading: false,
    error: null,
    
    // 액션들
    setUser: (user: Worker | null) => set({ user }),
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    clearUser: () => {
        // clearUser 호출 위치 추적을 위한 로그
        const stack = new Error().stack;
        const caller = stack?.split('\n')[2]?.trim() || 'unknown';
        console.log('🔴 [clearUser] 호출됨:', caller);
        console.trace('clearUser 호출 스택:');
        set({ user: null, error: null });
    },
}));
