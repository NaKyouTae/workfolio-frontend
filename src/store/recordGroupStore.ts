import { create } from 'zustand';

interface RecordGroupState {
    checkedGroups: Set<string>;
    toggleGroup: (id: string) => void;
    initializeGroups: (groupIds: string[]) => void;
}

export const useRecordGroupStore = create<RecordGroupState>((set) => ({
    checkedGroups: new Set<string>(),
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
        set(() => ({
            checkedGroups: new Set(groupIds)
        }))
})); 