import React, { useEffect, useState } from 'react'
import RecordGroupSection from '../components/layout/RecordGroupSection';
import RecordGroupButton from '../components/layout/RecordGroupButton';
import RecordGroupMiddle from '../components/layout/RecordGroupMiddle';
import { RecordGroup } from '../../../generated/common';
import { CreateRecordGroupRequest } from '../../../generated/create-record-group';
import { RecordGroupColor } from '@/enums/RecordGroupColor';
import HttpMethod from '@/enums/HttpMethod';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { createSampleRecordGroups } from '../../utils/sampleData';

const BodyLeft = () => {
    const { 
        ownedRecordGroups, 
        sharedRecordGroups, 
        setOwnedRecordGroups, 
        setSharedRecordGroups, 
        initializeGroups 
    } = useRecordGroupStore();
    
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    
    
    // 새 그룹 생성 함수
    const createRecordGroup = async (title: string) => {
        try {
            // 토큰이 없으면 로그인 페이지로 리다이렉트
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                window.location.href = '/login';
                return;
            }

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
                setOwnedRecordGroups([...ownedRecordGroups, newGroup]);
                setIsCreatingGroup(false);
            } else {
                console.error('Failed to create group');
            }
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };
    
    // 전역 이벤트 리스너로 새 그룹 추가 요청 감지
    useEffect(() => {
        const handleCreateGroupRequest = () => {
            setIsCreatingGroup(true);
        };

        window.addEventListener('createRecordGroup', handleCreateGroupRequest);
        return () => {
            window.removeEventListener('createRecordGroup', handleCreateGroupRequest);
        };
    }, []);
    
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
                    setSharedRecordGroups([]);
                    initializeGroups(sampleRecordGroups.map((group: RecordGroup) => group.id));
                    return;
                }

                // 소유한 레코드 그룹과 공유받은 레코드 그룹을 병렬로 조회
                const [ownedRes, sharedRes] = await Promise.all([
                    fetch('/api/record-groups/owned', { method: HttpMethod.GET }),
                    fetch('/api/record-groups/shared', { method: HttpMethod.GET })
                ]);

                // 401 에러 체크
                if (ownedRes.status === 401 || sharedRes.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                const ownedData = await ownedRes.json();
                const sharedData = await sharedRes.json();
                
                // 소유한 레코드 그룹 설정
                const ownedGroups = ownedData.groups || [];
                if (ownedGroups.length > 0) {
                    setOwnedRecordGroups(ownedGroups);
                }
                
                // 공유받은 레코드 그룹 설정
                const sharedGroups = sharedData.groups || [];
                if (sharedGroups.length > 0) {
                    setSharedRecordGroups(sharedGroups);
                }
                
                // 모든 그룹을 기본적으로 체크된 상태로 초기화
                const allGroups = [...ownedGroups, ...sharedGroups];
                if (allGroups.length > 0) {
                    const groupIds = allGroups.map((group: RecordGroup) => group.id);
                    initializeGroups(groupIds);
                }
            } catch (error) {
                console.error('Error fetching record groups:', error);
            }
        }
        fetchRecordGroups();
    }, [setOwnedRecordGroups, setSharedRecordGroups, initializeGroups]);
    
    return (
        <aside>
            <RecordGroupButton />
            <div className="aside-cont">
                <RecordGroupMiddle title="내 기록 전체보기" />
                <RecordGroupSection 
                    title="내 기록장"
                    defaultExpanded={true}
                    recordGroups={ownedRecordGroups}
                    onUpdateRecordGroups={setOwnedRecordGroups}
                    isCreatingGroup={isCreatingGroup}
                    onCreateGroup={createRecordGroup}
                    onCancelCreateGroup={() => setIsCreatingGroup(false)}
                />
                <RecordGroupSection 
                    title="공유 기록장"
                    defaultExpanded={true}
                    recordGroups={sharedRecordGroups}
                    onUpdateRecordGroups={setSharedRecordGroups}
                />
            </div>
        </aside>
    );
};

export default BodyLeft;
