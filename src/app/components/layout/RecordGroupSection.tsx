import React, { useState } from 'react';
import RecordGroupHeader from './RecordGroupHeader';
import RecordGroups from './RecordGroups';
import { RecordGroup } from '../../../../generated/common';

interface RecordGroupSectionProps {
    title: string;
    defaultExpanded?: boolean;
    recordGroups: RecordGroup[];
    onUpdateRecordGroups: (updatedGroups: RecordGroup[]) => void;
    isCreatingGroup?: boolean;
    onCreateGroup?: (title: string) => void;
    onCancelCreateGroup?: () => void;
}

const RecordGroupSection: React.FC<RecordGroupSectionProps> = ({
    title,
    defaultExpanded = true,
    recordGroups,
    onUpdateRecordGroups,
    isCreatingGroup,
    onCreateGroup,
    onCancelCreateGroup,
}) => {
    const [isGroupsExpanded, setIsGroupsExpanded] = useState(defaultExpanded);

    const handleToggleGroups = () => {
        setIsGroupsExpanded(!isGroupsExpanded);
    };

    return (
        <div className="record-group">
            <RecordGroupHeader 
                title={title} 
                isGroupsExpanded={isGroupsExpanded}
                onToggleGroups={handleToggleGroups}
            />
            {isGroupsExpanded && (
                <ul className="record-group-list">
                    <RecordGroups 
                        recordGroups={recordGroups} 
                        onUpdateRecordGroups={onUpdateRecordGroups}
                        isCreatingGroup={isCreatingGroup}
                        onCreateGroup={onCreateGroup}
                        onCancelCreateGroup={onCancelCreateGroup}
                    />
                </ul>
            )}
        </div>
    );
};

export default RecordGroupSection; 