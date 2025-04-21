import { create } from 'zustand';

interface StateType {
    selectedIdx: string;
    setSelectedIdx: (selectedIdx: string) => void;
}

const useSelectedTodoListStore = create<StateType>((set) => ({
    selectedIdx: '',
    setSelectedIdx: (selectedIdx: string) => set({ selectedIdx }),
}));

export default useSelectedTodoListStore;
