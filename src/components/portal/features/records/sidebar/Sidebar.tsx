import React from 'react'
import { RecordGroup } from '@/generated/common';
import { RecordGroupDetailResponse } from '@/generated/record_group';
import RecordGroupsOwned from './record-groups/record-groups-owned/RecordGroupsOwned';
import RecordGroupsShared from './record-groups/record-groups-shard/RecordGroupsShared';
import SidebarButton from './SidebarButton';
import SidebarConfig from './SidebarConfig';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { useShallow } from 'zustand/react/shallow';

interface SidebarProps {
    onConfigToggle: () => void;
    recordGroupsData: {
        ownedRecordGroups: RecordGroup[];
        sharedRecordGroups: RecordGroup[];
        allRecordGroups: RecordGroup[];
        isLoading: boolean;
        refreshRecordGroups: () => void;
        fetchRecordGroupDetails: (recordGroupId: string) => Promise<RecordGroupDetailResponse | null>;
    };
}

const Sidebar: React.FC<SidebarProps> = React.memo(({ onConfigToggle, recordGroupsData }) => {
    const defaultExpanded = true;
    
    // Zustand store에서 직접 구독하여 자동 갱신
    const { ownedRecordGroups, sharedRecordGroups } = useRecordGroupStore(
        useShallow((state) => ({
            ownedRecordGroups: state.ownedRecordGroups,
            sharedRecordGroups: state.sharedRecordGroups,
        }))
    );
    
    // refreshRecordGroups는 props에서 가져옴
    const { refreshRecordGroups, allRecordGroups } = recordGroupsData;

    return (
        <aside>
            <SidebarButton 
                allRecordGroups={allRecordGroups}
            />
            <div className="aside-cont">
                <SidebarConfig onConfigToggle={onConfigToggle} />
                <RecordGroupsOwned 
                    defaultExpanded={defaultExpanded}
                    recordGroups={ownedRecordGroups}
                    onRefresh={refreshRecordGroups}
                />
                <RecordGroupsShared 
                    defaultExpanded={defaultExpanded}
                    recordGroups={sharedRecordGroups}
                    onRefresh={refreshRecordGroups}
                />
            </div>
        </aside>
    );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
