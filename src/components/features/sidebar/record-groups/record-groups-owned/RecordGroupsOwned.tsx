import React, { useState } from 'react';
import RecordGroupsOwnedHeader from './RecordGroupsOwnedHeader';
import RecordGroups from '../RecordGroups';
import { CreateRecordGroupRequest } from '@/generated/record_group';
import { RecordGroupColor } from '@/enums/RecordGroupColor';
import HttpMethod from '@/enums/HttpMethod';
import { useRecordGroups } from '@/hooks/useRecordGroups';
import NewRecordGroupItem from '../NewRecordGroupItem';

interface RecordGroupSectionProps {
    defaultExpanded?: boolean;
}

const RecordGroupsOwned: React.FC<RecordGroupSectionProps> = ({
    defaultExpanded = true,
}) => {
    const { 
        ownedRecordGroups, 
        refreshRecordGroups 
    } = useRecordGroups();
    
    const [isGroupsExpanded, setIsGroupsExpanded] = useState(defaultExpanded);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);

    const handleToggleGroups = () => {
        setIsGroupsExpanded(!isGroupsExpanded);
    };

    // 새 그룹 생성 함수
    const createRecordGroup = async (title: string) => {
        try {
            const message = CreateRecordGroupRequest.create({
                title: title,
                color: RecordGroupColor.RED,
                priority: 1,
            });
            
            const response = await fetch('/api/record-groups', {
                method: HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: message.title,
                    color: message.color,
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
            <RecordGroupsOwnedHeader 
                isGroupsExpanded={isGroupsExpanded}
                onToggleGroups={handleToggleGroups}
                onCreateGroup={handleCreateGroupRequest}
            />
            {isGroupsExpanded && (
                <ul className="record-group-list">
                    {isCreatingGroup && (
                        <NewRecordGroupItem
                            placeholder="새 기록장 이름"
                            onSave={createRecordGroup}
                            onCancel={() => setIsCreatingGroup(false)}
                        />
                    )}
                    <RecordGroups 
                        key="owned-record-groups"
                        recordGroups={ownedRecordGroups} 
                        onUpdateRecordGroups={() => refreshRecordGroups()}
                    />
                </ul>
            )}
        </div>
    );
};

export default RecordGroupsOwned; 