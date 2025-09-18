import React from 'react'
import RecordGroupsOwned from '@/components/features/sidebar/record-groups/record-groups-owned/RecordGroupsOwned';
import RecordGroupsShared from '@/components/features/sidebar/record-groups/record-groups-shard/RecordGroupsShared';
import SidebarButton from '@/components/features/sidebar/SidebarButton';
import SidebarConfig from '@/components/features/sidebar/SidebarConfig';

const Sidebar = () => {
    const defaultExpanded = true;
    return (
        <aside>
            <SidebarButton />
            <div className="aside-cont">
                <SidebarConfig />
                <RecordGroupsOwned defaultExpanded={defaultExpanded} />
                <RecordGroupsShared defaultExpanded={defaultExpanded} />
            </div>
        </aside>
    );
};

export default Sidebar;
