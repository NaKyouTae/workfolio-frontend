import { create } from 'zustand';
import { RecordGroup } from '../../generated/common';

interface RecordGroupState {
    // RecordGroup 데이터
    ownedRecordGroups: RecordGroup[];
    sharedRecordGroups: RecordGroup[];
    
    // 체크된 그룹들
    checkedGroups: Set<string>;
    
    // 액션들
    setOwnedRecordGroups: (groups: RecordGroup[]) => void;
    setSharedRecordGroups: (groups: RecordGroup[]) => void;
    toggleGroup: (id: string) => void;
    initializeGroups: (groupIds: string[]) => void;
    clearAllGroups: () => void;
    
    // 계산된 값들
    getAllRecordGroups: () => RecordGroup[];
    getCheckedRecordGroups: () => RecordGroup[];
    getCheckedGroupIds: () => string[];
}

export const useRecordGroupStore = create<RecordGroupState>((set, get) => ({
    // 초기 상태
    ownedRecordGroups: [],
    sharedRecordGroups: [],
    checkedGroups: new Set<string>(),
    
    // 액션들
    setOwnedRecordGroups: (groups: RecordGroup[]) => 
        set({ ownedRecordGroups: groups }),
    
    setSharedRecordGroups: (groups: RecordGroup[]) => 
        set({ sharedRecordGroups: groups }),
    
    toggleGroup: (id: string) => 
        set((state) => {
            const newCheckedGroups = new Set(state.checkedGroups);
            if (newCheckedGroups.has(id)) {
                newCheckedGroups.delete(id);
            } else {
                newCheckedGroups.add(id);
            }
            return { checkedGroups: newCheckedGroups };
        }),
    
    initializeGroups: (groupIds: string[]) => 
        set({ checkedGroups: new Set(groupIds) }),
    
    clearAllGroups: () => 
        set({ checkedGroups: new Set() }),
    
    // 계산된 값들
    getAllRecordGroups: () => {
        const state = get();
        return [...state.ownedRecordGroups, ...state.sharedRecordGroups];
    },
    
    getCheckedRecordGroups: () => {
        const state = get();
        const allGroups = [...state.ownedRecordGroups, ...state.sharedRecordGroups];
        return allGroups.filter(group => state.checkedGroups.has(group.id));
    },
    
    getCheckedGroupIds: () => {
        const state = get();
        return Array.from(state.checkedGroups);
    },
})); 