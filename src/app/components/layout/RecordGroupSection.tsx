import React, { useState } from 'react';
import RecordGroupHeader from './RecordGroupHeader';
import RecordGroups from './RecordGroups';

interface RecordGroupSectionProps {
    title: string;
    defaultExpanded?: boolean;
}

const RecordGroupSection: React.FC<RecordGroupSectionProps> = ({
    title,
    defaultExpanded = true,
}) => {
    const [isGroupsExpanded, setIsGroupsExpanded] = useState(defaultExpanded);

    const handleToggleGroups = () => {
        setIsGroupsExpanded(!isGroupsExpanded);
    };

    return (
        <div>
            <RecordGroupHeader 
                title={title} 
                isGroupsExpanded={isGroupsExpanded}
                onToggleGroups={handleToggleGroups}
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