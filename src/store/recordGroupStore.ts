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
    
    // 로딩 상태
    isLoading: boolean;
    
    // 액션들
    setOwnedRecordGroups: (groups: RecordGroup[]) => void;
    setSharedRecordGroups: (groups: RecordGroup[]) => void;
    toggleGroup: (id: string) => void;
    initializeGroups: (groupIds: string[]) => void;
    clearAllGroups: () => void;
    toggleAllGroups: () => void;
    setIsLoading: (loading: boolean) => void;
    
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
    isLoading: false,
    
    // 액션들
    setOwnedRecordGroups: (groups: RecordGroup[]) => 
        set((state) => {
            // id를 키로 하는 Map을 만들어서 비교 (순서 무관, title/color 변경 감지)
            const oldMap = new Map(state.ownedRecordGroups.map(g => [g.id, g]));
            const newMap = new Map(groups.map(g => [g.id, g]));
            
            // 길이가 다르면 업데이트 필요
            if (oldMap.size !== newMap.size) {
                // 업데이트 로직 계속 진행
            } else {
                // 모든 그룹이 동일한지 확인 (title, color, type 포함)
                let isSame = true;
                for (const [id, oldGroup] of oldMap) {
                    const newGroup = newMap.get(id);
                    if (!newGroup || 
                        oldGroup.title !== newGroup.title ||
                        oldGroup.color !== newGroup.color ||
                        oldGroup.type !== newGroup.type) {
                        isSame = false;
                        break;
                    }
                }
                
                if (isSame) {
                    return state;
                }
            }

            // 새로운 그룹(기존에 없던 그룹)만 체크에 추가
            const existingIds = new Set(state.ownedRecordGroups.map(g => g.id));
            const newGroups = groups.filter(g => !existingIds.has(g.id));
            
            if (newGroups.length === 0) {
                // 새로운 그룹이 없으면 checkedGroups는 변경하지 않음
                return { ownedRecordGroups: groups };
            }

            const newCheckedGroups = new Set(state.checkedGroups);
            newGroups.forEach(group => newCheckedGroups.add(group.id));
            
            return { 
                ownedRecordGroups: groups,
                checkedGroups: newCheckedGroups
            };
        }),
    
    setSharedRecordGroups: (groups: RecordGroup[]) => 
        set((state) => {
            // id를 키로 하는 Map을 만들어서 비교 (순서 무관, title/color 변경 감지)
            const oldMap = new Map(state.sharedRecordGroups.map(g => [g.id, g]));
            const newMap = new Map(groups.map(g => [g.id, g]));
            
            // 길이가 다르면 업데이트 필요
            if (oldMap.size !== newMap.size) {
                // 업데이트 로직 계속 진행
            } else {
                // 모든 그룹이 동일한지 확인 (title, color, type 포함)
                let isSame = true;
                for (const [id, oldGroup] of oldMap) {
                    const newGroup = newMap.get(id);
                    if (!newGroup || 
                        oldGroup.title !== newGroup.title ||
                        oldGroup.color !== newGroup.color ||
                        oldGroup.type !== newGroup.type) {
                        isSame = false;
                        break;
                    }
                }
                
                if (isSame) {
                    return state;
                }
            }

            // 새로운 그룹(기존에 없던 그룹)만 체크에 추가
            const existingIds = new Set(state.sharedRecordGroups.map(g => g.id));
            const newGroups = groups.filter(g => !existingIds.has(g.id));
            
            if (newGroups.length === 0) {
                // 새로운 그룹이 없으면 checkedGroups는 변경하지 않음
                return { sharedRecordGroups: groups };
            }

            const newCheckedGroups = new Set(state.checkedGroups);
            newGroups.forEach(group => newCheckedGroups.add(group.id));
            
            return { 
                sharedRecordGroups: groups,
                checkedGroups: newCheckedGroups
            };
        }),
    
    toggleGroup: (id: string) => 
        set((state) => {
            const newCheckedGroups = new Set(state.checkedGroups);
            if (newCheckedGroups.has(id)) {
                newCheckedGroups.delete(id);
            } else {
                newCheckedGroups.add(id);
            }
            // record 새로고침 트리거
            return { 
                checkedGroups: newCheckedGroups,
                recordRefreshTrigger: state.recordRefreshTrigger + 1
            };
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
            // undefined나 null인 id를 필터링
            const allGroupIds = allGroups.map(group => group.id).filter((id): id is string => !!id);
            const allChecked = allGroupIds.length > 0 && allGroupIds.every(id => state.checkedGroups.has(id));
            
            // record 새로고침 트리거
            if (allChecked) {
                // 모든 그룹이 체크되어 있으면 모두 해제
                return { 
                    checkedGroups: new Set(),
                    recordRefreshTrigger: state.recordRefreshTrigger + 1
                };
            } else {
                // 일부 또는 모든 그룹이 해제되어 있으면 모두 체크
                return { 
                    checkedGroups: new Set(allGroupIds),
                    recordRefreshTrigger: state.recordRefreshTrigger + 1
                };
            }
        }),
    
    // 레코드 새로고침 액션
    triggerRecordRefresh: () => 
        set((state) => ({ recordRefreshTrigger: state.recordRefreshTrigger + 1 })),
    
    // 로딩 상태 설정
    setIsLoading: (loading: boolean) => 
        set({ isLoading: loading }),
    
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