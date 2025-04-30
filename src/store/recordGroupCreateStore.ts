import { create } from 'zustand';

interface RecordGroupCreateState {
    // 상태
    selectedColor: string;
    title: string;


    isOpen: boolean;
    isLoading: boolean;
    error: string | null;

    // 액션
    openModal: () => void;
    closeModal: () => void;
    setSelectedColor: (color: string) => void;
    setTitle: (title: string) => void;
    resetForm: () => void;
    createRecordGroup: () => Promise<void>;
}

const initialState = {
    selectedColor: '#F15B50',
    title: '',
    isOpen: false,
    isLoading: false,
    error: null,
};

export const useRecordGroupCreateStore = create<RecordGroupCreateState>((set, get) => ({
    // 초기 상태
    ...initialState,

    // 액션
    setSelectedColor: (color: string) => {
        set({ selectedColor: color });
    },

    setTitle: (title: string) => {
        set({ title });
    },

    resetForm: () => {
        set(initialState);
    },

    openModal: () => {
        set({ isOpen: true });
    },

    closeModal: () => {
        set({ isOpen: false });
    },

    createRecordGroup: async () => {
        const { title, selectedColor } = get();
        
        if (!title.trim()) {
            set({ error: '기록장 이름을 입력해주세요.' });
            return;
        }

        try {
            set({ isLoading: true, error: null });

            const response = await fetch('/api/recordGroups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title.trim(),
                    color: selectedColor,
                }),
            });

            if (!response.ok) {
                throw new Error('기록장 생성에 실패했습니다.');
            }

            // 성공 시 폼 초기화
            set(initialState);
            
        } catch (error) {
            set({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
        } finally {
            set({ isLoading: false });
        }
    },
})); 