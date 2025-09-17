import React, { useState, useEffect } from 'react';
import RecordGroupsOwnedHeader from './RecordGroupsOwnedHeader';
import RecordGroups from '../RecordGroups';
import { RecordGroup } from '../../../../../../../generated/common';
import { CreateRecordGroupRequest } from '../../../../../../../generated/create-record-group';
import { RecordGroupColor } from '@/enums/RecordGroupColor';
import HttpMethod from '@/enums/HttpMethod';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { createSampleRecordGroups } from '../../../../../../utils/sampleData';
import NewRecordGroupItem from '../NewRecordGroupItem';

interface RecordGroupSectionProps {
    defaultExpanded?: boolean;
}

const RecordGroupsOwned: React.FC<RecordGroupSectionProps> = ({
    defaultExpanded = true,
}) => {
    const { 
        ownedRecordGroups, 
        setOwnedRecordGroups, 
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

            if (response.ok) {
                const newGroup = await response.json();
                setOwnedRecordGroups([...ownedRecordGroups, newGroup]);
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
                    const sampleRecordGroups = createSampleRecordGroups();
                    setOwnedRecordGroups(sampleRecordGroups);
                    initializeGroups(sampleRecordGroups.map((group: RecordGroup) => group.id));
                    return;
                }

                // 소유한 레코드 그룹 조회
                const ownedRes = await fetch('/api/record-groups/owned', { 
                    method: HttpMethod.GET 
                });

                const ownedData = await ownedRes.json();
                
                // 소유한 레코드 그룹 설정
                const ownedGroups = ownedData.groups || [];
                if (ownedGroups.length > 0) {
                    setOwnedRecordGroups(ownedGroups);
                    // 소유한 그룹들을 기본적으로 체크된 상태로 초기화
                    const groupIds = ownedGroups.map((group: RecordGroup) => group.id);
                    initializeGroups(groupIds);
                }
            } catch (error) {
                console.error('Error fetching record groups:', error);
            }
        }
        fetchRecordGroups();
    }, [setOwnedRecordGroups, initializeGroups]);

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
                        recordGroups={ownedRecordGroups} 
                        onUpdateRecordGroups={setOwnedRecordGroups}
                    />
                </ul>
            )}
        </div>
    );
};

export default RecordGroupsOwned; 