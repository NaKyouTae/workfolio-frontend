import React from 'react';
import RecordGroupHeader from './RecordGroupHeader';
import RecordGroups from './RecordGroups';
interface RecordGroupSectionProps {
    title: string;
    isGroupsExpanded: boolean;
}

const RecordGroupSection: React.FC<RecordGroupSectionProps> = ({
    title,
    isGroupsExpanded,
}) => {
    return (
        <div>
            <RecordGroupHeader title={title} />
            <div style={{
                maxHeight: isGroupsExpanded ? '100%' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out'
            }}>
                <RecordGroups />
            </div>
        </div>
    );
};

export default RecordGroupSection; 