import React, { useState, useEffect } from 'react';
import RecordGroupsSharedHeader from './RecordGroupsSharedHeader';
import RecordGroups from '../RecordGroups';
import { RecordGroup } from '../../../../../../../generated/common';
import { CreateRecordGroupRequest } from '../../../../../../../generated/create-record-group';
import { RecordGroupColor } from '@/enums/RecordGroupColor';
import HttpMethod from '@/enums/HttpMethod';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import NewRecordGroupItem from '../NewRecordGroupItem';

interface RecordGroupSectionProps {
    defaultExpanded?: boolean;
}

const RecordGroupsShared: React.FC<RecordGroupSectionProps> = ({
    defaultExpanded = true,
}) => {
    const { 
        sharedRecordGroups, 
        setSharedRecordGroups, 
        initializeGroups 
    } = useRecordGroupStore();
    
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

            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }

            if (response.ok) {
                const newGroup = await response.json();
                setSharedRecordGroups([...sharedRecordGroups, newGroup]);
                setIsCreatingGroup(false);
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
    
    useEffect(() => {
        const fetchRecordGroups = async () => {
            try {
                // 토큰이 없으면 샘플 데이터 사용
                const accessToken = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('accessToken='))
                    ?.split('=')[1];
                
                if (!accessToken) {
                    setSharedRecordGroups([]);
                    return;
                }

                // 공유받은 레코드 그룹 조회
                const sharedRes = await fetch('/api/record-groups/shared', { 
                    method: HttpMethod.GET 
                });

                const sharedData = await sharedRes.json();
                
                // 공유받은 레코드 그룹 설정
                const sharedGroups = sharedData.groups || [];
                if (sharedGroups.length > 0) {
                    setSharedRecordGroups(sharedGroups);
                    // 공유받은 그룹들을 기본적으로 체크된 상태로 초기화
                    const groupIds = sharedGroups.map((group: RecordGroup) => group.id);
                    initializeGroups(groupIds);
                }
            } catch (error) {
                console.error('Error fetching record groups:', error);
            }
        }
        fetchRecordGroups();
    }, [setSharedRecordGroups, initializeGroups]);

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
                        onUpdateRecordGroups={setSharedRecordGroups}
                    />
                </ul>
            )}
        </div>
    );
};

export default RecordGroupsShared; 