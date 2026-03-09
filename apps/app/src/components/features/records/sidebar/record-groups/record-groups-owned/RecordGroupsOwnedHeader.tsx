import React from 'react';

interface RecordGroupsOwnedHeaderProps {
    isGroupsExpanded: boolean;
    onToggleGroups: () => void;
    onCreateGroup: () => void;
    groupCount: number;
}

const RecordGroupsOwnedHeader: React.FC<RecordGroupsOwnedHeaderProps> = ({
    isGroupsExpanded,
    onToggleGroups,
    onCreateGroup,
    groupCount,
}) => {

    return (
        <div className="record-group-title">
            <div>
                <button className={`trans${isGroupsExpanded ? ' active' : ''}`} onClick={onToggleGroups}>
                    <i className="ic-arrow-down-14" />
                </button>
                <p onClick={onToggleGroups} style={{ cursor: 'pointer' }}>내 기록장 <span style={{ color: 'var(--gray005)', fontWeight: 400 }}>{groupCount}</span></p>
            </div>
            <button className="trans" onClick={onCreateGroup}><i className="ic-add" /></button>
        </div>
    );
};

export default RecordGroupsOwnedHeader;
