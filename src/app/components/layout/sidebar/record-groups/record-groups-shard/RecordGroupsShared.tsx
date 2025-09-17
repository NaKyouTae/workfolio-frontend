import React, { useState, useEffect } from 'react';
import RecordGroupsSharedHeader from './RecordGroupsSharedHeader';
import RecordGroups from '../RecordGroups';
import { RecordGroup } from '../../../../../../../generated/common';
import { JoinRecordGroupRequest } from '../../../../../../../generated/record_group';
import HttpMethod from '@/enums/HttpMethod';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { useUser } from '@/hooks/useUser';
import { createSampleRecordGroups } from '../../../../../../utils/sampleData';
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
                    // 성공 시 그룹 목록 새로고침
                    const sharedRes = await fetch('/api/record-groups/shared', { 
                        method: HttpMethod.GET 
                    });
                    if (sharedRes.ok) {
                        const sharedData = await sharedRes.json();
                        const sharedGroups = sharedData.groups || [];
                        setSharedRecordGroups(sharedGroups);
                    }
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
    
    useEffect(() => {
        const fetchRecordGroups = async () => {
            try {
                // 토큰이 없으면 샘플 데이터 사용
                const accessToken = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('accessToken='))
                    ?.split('=')[1];
                
                if (!accessToken) {
                    // 로그인이 안되어 있으면 샘플 데이터 사용
                    const sampleRecordGroups = createSampleRecordGroups();
                    setSharedRecordGroups(sampleRecordGroups);
                    initializeGroups(sampleRecordGroups.map((group: RecordGroup) => group.id));
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