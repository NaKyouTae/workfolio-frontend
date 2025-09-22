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
    clearUser: () => set({ user: null, error: null }),
}));
