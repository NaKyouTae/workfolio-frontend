import React from 'react';

interface RecordGroupsOwnedHeaderProps {
    isGroupsExpanded: boolean;
    onToggleGroups: () => void;
    onCreateGroup: () => void;
}

const RecordGroupsOwnedHeader: React.FC<RecordGroupsOwnedHeaderProps> = ({
    isGroupsExpanded,
    onToggleGroups,
    onCreateGroup,
}) => {
    
    return (
        <div className="record-group-title">
            <div>
                <p>내 기록장</p>
                <button className={`trans ${isGroupsExpanded ? 'active' : ''}`} onClick={onToggleGroups}>
                    <i className="ic-arrow-down-14" />
                </button>
            </div>
            <button className="trans" onClick={onCreateGroup}><i className="ic-add" /></button>
        </div>
    );
};

export default RecordGroupsOwnedHeader; 