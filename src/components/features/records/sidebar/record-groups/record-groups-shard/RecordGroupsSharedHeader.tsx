import React from 'react';

interface RecordGroupsSharedHeaderProps {
    isGroupsExpanded: boolean;
    onToggleGroups: () => void;
    onCreateGroup: () => void;
}

const RecordGroupsSharedHeader: React.FC<RecordGroupsSharedHeaderProps> = ({
    isGroupsExpanded,
    onToggleGroups,
    onCreateGroup,
}) => {
    
    return (
        <div className="record-group-title">
            <div>
                <p>공유 기록장</p>
                <button className={`trans ${isGroupsExpanded ? 'active' : ''}`} onClick={onToggleGroups}>
                    <i className="ic-arrow-down-14" />
                </button>
            </div>
            <button className="trans" onClick={onCreateGroup}><i className="ic-add" /></button>
        </div>
    );
};

export default RecordGroupsSharedHeader; 