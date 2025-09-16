import React, { useEffect } from 'react'
import RecordGroupSection from '../components/layout/RecordGroupSection';
import RecordGroupButton from '../components/layout/RecordGroupButton';
import RecordGroupMiddle from '../components/layout/RecordGroupMiddle';
import { RecordGroup } from '../../../generated/common';
import HttpMethod from '@/enums/HttpMethod';
import { useRecordGroupStore } from '@/store/recordGroupStore';

const BodyLeft = () => {
    const { 
        ownedRecordGroups, 
        sharedRecordGroups, 
        setOwnedRecordGroups, 
        setSharedRecordGroups, 
        initializeGroups 
    } = useRecordGroupStore();
    
    useEffect(() => {
        const fetchRecordGroups = async () => {
            try {
                // 소유한 레코드 그룹과 공유받은 레코드 그룹을 병렬로 조회
                const [ownedRes, sharedRes] = await Promise.all([
                    fetch('/api/record-groups/owned', { method: HttpMethod.GET }),
                    fetch('/api/record-groups/shared', { method: HttpMethod.GET })
                ]);

                const ownedData = await ownedRes.json();
                const sharedData = await sharedRes.json();

                console.log('Owned groups:', ownedData);
                console.log('Shared groups:', sharedData);
                
                // 소유한 레코드 그룹 설정
                const ownedGroups = ownedData.groups || ownedData || [];
                if (ownedGroups.length > 0) {
                    setOwnedRecordGroups(ownedGroups);
                }
                
                // 공유받은 레코드 그룹 설정
                const sharedGroups = sharedData.groups || sharedData || [];
                if (sharedGroups.length > 0) {
                    setSharedRecordGroups(sharedGroups);
                }
                
                // 모든 그룹을 기본적으로 체크된 상태로 초기화
                const allGroups = [...ownedGroups, ...sharedGroups];
                if (allGroups.length > 0) {
                    initializeGroups(allGroups.map((group: RecordGroup) => group.id));
                }
            } catch (error) {
                console.error('Error fetching record groups:', error);
            }
        }
        fetchRecordGroups();
    }, [setOwnedRecordGroups, setSharedRecordGroups, initializeGroups]);
    
    return (
        <div style={{ 
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            margin: 0,
            boxSizing: 'border-box'
        }}>
            <RecordGroupButton />
            <RecordGroupMiddle title="내 기록 전체보기" />
            <span className="record-group-separator"></span>
            <RecordGroupSection 
                title="내 기록장"
                defaultExpanded={true}
                recordGroups={ownedRecordGroups}
            />
            <span className="record-group-separator"></span>
            <RecordGroupSection 
                title="공유 기록장"
                defaultExpanded={true}
                recordGroups={sharedRecordGroups}
            />
        </div>
    );
};

export default BodyLeft;
