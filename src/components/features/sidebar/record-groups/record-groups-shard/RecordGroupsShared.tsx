import React, { useState } from 'react';
import RecordGroupsSharedHeader from './RecordGroupsSharedHeader';
import RecordGroups from '../RecordGroups';
import { JoinRecordGroupRequest } from '@/generated/record_group';
import HttpMethod from '@/enums/HttpMethod';
import { useRecordGroups } from '@/hooks/useRecordGroups';
import { useUser } from '@/hooks/useUser';
import NewRecordGroupItem from '../NewRecordGroupItem';

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
    
    const { user } = useUser();
    
    const [isGroupsExpanded, setIsGroupsExpanded] = useState(defaultExpanded);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);

    const handleToggleGroups = () => {
        setIsGroupsExpanded(!isGroupsExpanded);
    };

    // 그룹 참여 함수
    const createRecordGroup = async (publicId: string) => {
        try {
            // 현재 사용자 ID 가져오기
            if (!user?.id) {
                console.error('User not found');
                return;
            }
            
            const targetWorkerId = user.id;
            
            const message = JoinRecordGroupRequest.create({
                publicId: publicId,
                targetWorkerId: targetWorkerId,
            });
            
            const response = await fetch('/api/record-groups/join', {
                method: HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    publicId: message.publicId,
                    targetWorkerId: message.targetWorkerId,
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.isSuccess) {
                    // 성공 시 레코드 그룹 다시 조회
                    refreshRecordGroups();
                    setIsCreatingGroup(false);
                } else {
                    console.error('Failed to join group');
                }
            } else {
                console.error('Failed to join group');
            }
        } catch (error) {
            console.error('Error joining group:', error);
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
                            placeholder="기록장 Public ID"
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