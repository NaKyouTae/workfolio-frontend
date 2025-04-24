import React from 'react';
import RecordGroupHeader from './RecordGroupHeader';
import RecordGroups from './RecordGroups';

interface RecordGroupSectionProps {
    title: string;
    isGroupsExpanded: boolean;
    onToggleGroups: () => void;
    onOpenModal: () => void;
}

const RecordGroupSection: React.FC<RecordGroupSectionProps> = ({
    title,
    isGroupsExpanded,
    onToggleGroups,
    onOpenModal
}) => {
    return (
        <div>
            <RecordGroupHeader 
                title={title}
                isGroupsExpanded={isGroupsExpanded}
                onToggleGroups={onToggleGroups}
                onOpenModal={onOpenModal}
            />
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