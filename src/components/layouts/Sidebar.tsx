import React from 'react'
import RecordGroupsOwned from '@/components/features/sidebar/record-groups/record-groups-owned/RecordGroupsOwned';
import RecordGroupsShared from '@/components/features/sidebar/record-groups/record-groups-shard/RecordGroupsShared';
import SidebarButton from '@/components/features/sidebar/SidebarButton';
import SidebarConfig from '@/components/features/sidebar/SidebarConfig';
import { RecordGroup } from '@/generated/common';
import { RecordGroupDetailResponse } from '@/generated/record_group';

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
    
    // props로 받은 recordGroupsData 사용
    const { 
        ownedRecordGroups, 
        sharedRecordGroups, 
        refreshRecordGroups 
    } = recordGroupsData;

    return (
        <aside>
            <SidebarButton editableRecordGroups={ownedRecordGroups} />
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
