import { create } from 'zustand';
import { RecordGroup } from '@/generated/common';

interface RecordGroupState {
    // RecordGroup 데이터
    ownedRecordGroups: RecordGroup[];
    sharedRecordGroups: RecordGroup[];
    
    // 체크된 그룹들
    checkedGroups: Set<string>;
    
    // 레코드 새로고침을 위한 상태
    recordRefreshTrigger: number;
    
    // 액션들
    setOwnedRecordGroups: (groups: RecordGroup[]) => void;
    setSharedRecordGroups: (groups: RecordGroup[]) => void;
    toggleGroup: (id: string) => void;
    initializeGroups: (groupIds: string[]) => void;
    clearAllGroups: () => void;
    toggleAllGroups: () => void;
    
    // 레코드 새로고침 액션
    triggerRecordRefresh: () => void;
    
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
    recordRefreshTrigger: 0,
    
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
        set((state) => {
            const newCheckedGroups = new Set(state.checkedGroups);
            groupIds.forEach(id => newCheckedGroups.add(id));
            return { checkedGroups: newCheckedGroups };
        }),
    
    clearAllGroups: () => 
        set({ checkedGroups: new Set() }),
    
    toggleAllGroups: () => 
        set((state) => {
            const allGroups = [...state.ownedRecordGroups, ...state.sharedRecordGroups];
            const allGroupIds = allGroups.map(group => group.id);
            const allChecked = allGroupIds.every(id => state.checkedGroups.has(id));
            
            if (allChecked) {
                // 모든 그룹이 체크되어 있으면 모두 해제
                return { checkedGroups: new Set() };
            } else {
                // 일부 또는 모든 그룹이 해제되어 있으면 모두 체크
                return { checkedGroups: new Set(allGroupIds) };
            }
        }),
    
    // 레코드 새로고침 액션
    triggerRecordRefresh: () => 
        set((state) => ({ recordRefreshTrigger: state.recordRefreshTrigger + 1 })),
    
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