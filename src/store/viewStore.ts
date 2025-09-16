import { create } from 'zustand';

export type ViewType = 'dashboard' | 'mypage';

interface ViewState {
    currentView: ViewType;
    setView: (view: ViewType) => void;
}

export const useViewStore = create<ViewState>((set) => ({
    currentView: 'dashboard',
    setView: (view: ViewType) => set({ currentView: view }),
}));
