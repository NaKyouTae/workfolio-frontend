import { create } from "zustand";
import { RecordGroup, Record } from "../generated/common";

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

    // 샘플 데이터 초기화 여부 (페이지 접근 시에만 리프레시)
    isSampleDataInitialized: boolean;

    // 샘플 레코드 데이터 캐시 (한 번만 생성하고 재사용)
    sampleRecords: Record[];

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

    // 샘플 데이터 초기화 플래그 설정
    setSampleDataInitialized: (initialized: boolean) => void;

    // 샘플 레코드 데이터 설정
    setSampleRecords: (records: Record[]) => void;

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
    isSampleDataInitialized: false,
    sampleRecords: [],

    // 액션들
    setOwnedRecordGroups: (groups: RecordGroup[]) =>
        set((state) => {
            // 길이가 다르면 업데이트 필요
            if (state.ownedRecordGroups.length !== groups.length) {
                // 업데이트 로직 계속 진행
            } else {
                // 순서와 각 그룹의 속성이 모두 동일한지 확인
                let isSame = true;
                for (let i = 0; i < state.ownedRecordGroups.length; i++) {
                    const oldGroup = state.ownedRecordGroups[i];
                    const newGroup = groups[i];

                    // 순서가 다르거나 (id가 다름) 속성이 다르면 업데이트 필요
                    if (
                        !newGroup ||
                        oldGroup.id !== newGroup.id ||
                        oldGroup.title !== newGroup.title ||
                        oldGroup.color !== newGroup.color ||
                        oldGroup.type !== newGroup.type ||
                        oldGroup.priority !== newGroup.priority
                    ) {
                        isSame = false;
                        break;
                    }
                }

                if (isSame) {
                    return state;
                }
            }

            // 새로운 그룹(기존에 없던 그룹)만 체크에 추가
            const existingIds = new Set(state.ownedRecordGroups.map((g) => g.id));
            const newGroups = groups.filter((g) => !existingIds.has(g.id));

            if (newGroups.length === 0) {
                // 새로운 그룹이 없으면 checkedGroups는 변경하지 않음
                return { ownedRecordGroups: groups };
            }

            const newCheckedGroups = new Set(state.checkedGroups);
            newGroups.forEach((group) => newCheckedGroups.add(group.id));

            return {
                ownedRecordGroups: groups,
                checkedGroups: newCheckedGroups,
            };
        }),

    setSharedRecordGroups: (groups: RecordGroup[]) =>
        set((state) => {
            // 길이가 다르면 업데이트 필요
            if (state.sharedRecordGroups.length !== groups.length) {
                // 업데이트 로직 계속 진행
            } else {
                // 순서와 각 그룹의 속성이 모두 동일한지 확인
                let isSame = true;
                for (let i = 0; i < state.sharedRecordGroups.length; i++) {
                    const oldGroup = state.sharedRecordGroups[i];
                    const newGroup = groups[i];

                    // 순서가 다르거나 (id가 다름) 속성이 다르면 업데이트 필요
                    if (
                        !newGroup ||
                        oldGroup.id !== newGroup.id ||
                        oldGroup.title !== newGroup.title ||
                        oldGroup.color !== newGroup.color ||
                        oldGroup.type !== newGroup.type ||
                        oldGroup.priority !== newGroup.priority
                    ) {
                        isSame = false;
                        break;
                    }
                }

                if (isSame) {
                    return state;
                }
            }

            // 새로운 그룹(기존에 없던 그룹)만 체크에 추가
            const existingIds = new Set(state.sharedRecordGroups.map((g) => g.id));
            const newGroups = groups.filter((g) => !existingIds.has(g.id));

            if (newGroups.length === 0) {
                // 새로운 그룹이 없으면 checkedGroups는 변경하지 않음
                return { sharedRecordGroups: groups };
            }

            const newCheckedGroups = new Set(state.checkedGroups);
            newGroups.forEach((group) => newCheckedGroups.add(group.id));

            return {
                sharedRecordGroups: groups,
                checkedGroups: newCheckedGroups,
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
                recordRefreshTrigger: state.recordRefreshTrigger + 1,
            };
        }),

    initializeGroups: (groupIds: string[]) =>
        set((state) => {
            const newCheckedGroups = new Set(state.checkedGroups);
            groupIds.forEach((id) => newCheckedGroups.add(id));
            return { checkedGroups: newCheckedGroups };
        }),

    clearAllGroups: () => set({ checkedGroups: new Set() }),

    toggleAllGroups: () =>
        set((state) => {
            const allGroups = [...state.ownedRecordGroups, ...state.sharedRecordGroups];
            // undefined나 null인 id를 필터링
            const allGroupIds = allGroups
                .map((group) => group.id)
                .filter((id): id is string => !!id);
            const allChecked =
                allGroupIds.length > 0 && allGroupIds.every((id) => state.checkedGroups.has(id));

            // record 새로고침 트리거
            if (allChecked) {
                // 모든 그룹이 체크되어 있으면 모두 해제
                return {
                    checkedGroups: new Set(),
                    recordRefreshTrigger: state.recordRefreshTrigger + 1,
                };
            } else {
                // 일부 또는 모든 그룹이 해제되어 있으면 모두 체크
                return {
                    checkedGroups: new Set(allGroupIds),
                    recordRefreshTrigger: state.recordRefreshTrigger + 1,
                };
            }
        }),

    // 레코드 새로고침 액션
    triggerRecordRefresh: () =>
        set((state) => ({ recordRefreshTrigger: state.recordRefreshTrigger + 1 })),

    // 로딩 상태 설정
    setIsLoading: (loading: boolean) => set({ isLoading: loading }),

    // 샘플 데이터 초기화 플래그 설정
    setSampleDataInitialized: (initialized: boolean) =>
        set({ isSampleDataInitialized: initialized }),

    // 샘플 레코드 데이터 설정
    setSampleRecords: (records: Record[]) => set({ sampleRecords: records }),

    // 계산된 값들
    getAllRecordGroups: () => {
        const state = get();
        return [...state.ownedRecordGroups, ...state.sharedRecordGroups];
    },

    getCheckedRecordGroups: () => {
        const state = get();
        const allGroups = [...state.ownedRecordGroups, ...state.sharedRecordGroups];
        return allGroups.filter((group) => state.checkedGroups.has(group.id));
    },

    getCheckedGroupIds: () => {
        const state = get();
        return Array.from(state.checkedGroups);
    },
}));
