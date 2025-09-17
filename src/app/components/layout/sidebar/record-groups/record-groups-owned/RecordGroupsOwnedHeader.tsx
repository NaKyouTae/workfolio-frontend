import React from 'react';

interface RecordGroupsOwnedHeaderProps {
    isGroupsExpanded: boolean;
    onToggleGroups: () => void;
}

const RecordGroupsOwnedHeader: React.FC<RecordGroupsOwnedHeaderProps> = ({
    isGroupsExpanded,
    onToggleGroups,
}) => {
    // const triggerRef = useRef<HTMLDivElement>(null);

    const handleCreateGroup = () => {
        // 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('createRecordGroup'));
    };
    
    return (
        <div className="record-group-title">
            <div>
                <p>내 기록장</p>
                <button className={`trans ${isGroupsExpanded ? 'active' : ''}`} onClick={onToggleGroups}>
                    <i className="ic-arrow-down-14" />
                </button>
            </div>
            <button className="trans" onClick={handleCreateGroup}><i className="ic-add" /></button>
        </div>
    );
};

export default RecordGroupsOwnedHeader; 