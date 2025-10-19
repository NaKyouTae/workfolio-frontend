import React, { useState } from 'react';
import RecordGroupsSharedHeader from './RecordGroupsSharedHeader';
import RecordGroups from '../RecordGroups';
import { CreateRecordGroupRequest } from '@/generated/record_group';
import HttpMethod from '@/enums/HttpMethod';
import { useRecordGroups } from '@/hooks/useRecordGroups';
import NewRecordGroupItem from '../NewRecordGroupItem';
import { RecordGroup_RecordGroupType } from '@/generated/common';

interface RecordGroupSectionProps {
    defaultExpanded?: boolean;
}

const RecordGroupsShared: React.FC<RecordGroupSectionProps> = ({
    defaultExpanded = true,
}) => {
    const { 
        sharedRecordGroups, 
        refreshRecordGroups 
    } = useRecordGroups();
    
    const [isGroupsExpanded, setIsGroupsExpanded] = useState(defaultExpanded);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);

    const handleToggleGroups = () => {
        setIsGroupsExpanded(!isGroupsExpanded);
    };

    const createRecordGroup = async (title: string, color: string) => {
        try {
            const message = CreateRecordGroupRequest.create({
                title: title,
                color: color,
                type: RecordGroup_RecordGroupType.SHARED,
                priority: sharedRecordGroups.length + 1,
            });
            
            const response = await fetch('/api/record-groups', {
                method: HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: message.title,
                    color: message.color,
                    type: message.type,
                    priority: message.priority.toString(),
                })
            });

            if (response.ok) {
                setIsCreatingGroup(false);
                
                // 레코드 그룹 생성 성공 시 레코드 그룹 다시 조회
                refreshRecordGroups();
            } else {
                console.error('Failed to create group');
            }
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    // 그룹 생성 요청 핸들러
    const handleCreateGroupRequest = () => {
        setIsCreatingGroup(true);
    };

    return (
        <div className="record-group">
            <RecordGroupsSharedHeader 
                isGroupsExpanded={isGroupsExpanded}
                onToggleGroups={handleToggleGroups}
                onCreateGroup={handleCreateGroupRequest}
            />
            {isGroupsExpanded && (
                <ul className="record-group-list">
                    {isCreatingGroup && (
                        <NewRecordGroupItem
                            placeholder="새 공유 기록장 이름"
                            onSave={createRecordGroup}
                            onCancel={() => setIsCreatingGroup(false)}
                        />
                    )}
                    <RecordGroups 
                        recordGroups={sharedRecordGroups} 
                        onUpdateRecordGroups={() => refreshRecordGroups()}
                    />
                </ul>
            )}
        </div>
    );
};

export default RecordGroupsShared; 