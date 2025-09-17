import React from 'react'
import SidebarButton from '../components/layout/sidebar/SidebarButton';
import SidebarConfig from '../components/layout/sidebar/SidebarConfig';
import RecordGroupsOwned from '../components/layout/sidebar/record-groups/record-groups-owned/RecordGroupsOwned';
import RecordGroupsShared from '../components/layout/sidebar/record-groups/record-groups-shard/RecordGroupsShared';

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
