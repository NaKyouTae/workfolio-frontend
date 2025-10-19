import { useState, useCallback, useEffect, useMemo } from 'react';
import { RecordGroup } from '@/generated/common';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { createSampleRecordGroups } from '@/utils/sampleData';
import HttpMethod from '@/enums/HttpMethod';
import { RecordGroupDetailResponse } from '@/generated/record_group';

export const useRecordGroups = () => {
    const { 
        ownedRecordGroups, 
        sharedRecordGroups, 
        setOwnedRecordGroups, 
        setSharedRecordGroups,
        initializeGroups 
    } = useRecordGroupStore();
    
    const [isLoading, setIsLoading] = useState(false);

    // 레코드 그룹 조회 함수
    const fetchRecordGroups = useCallback(async () => {
        setIsLoading(true);
        try {
            // 토큰이 없으면 샘플 데이터 사용
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                const sampleRecordGroups = createSampleRecordGroups();
                setOwnedRecordGroups(sampleRecordGroups as RecordGroup[]);
                setSharedRecordGroups([]);
                initializeGroups(sampleRecordGroups.map((group: { id: string; title: string; isPublic: boolean; publicId: string; color: string; priority: number; createdAt: number; updatedAt: number; }) => group.id));
                return;
            }

            // 소유한 레코드 그룹 조회
            const ownedRes = await fetch('/api/record-groups/owned', { 
                method: HttpMethod.GET 
            });
            const ownedData = await ownedRes.json();
            const ownedGroups = ownedData.groups || [];
            setOwnedRecordGroups(ownedGroups);

            // 공유받은 레코드 그룹 조회
            const sharedRes = await fetch('/api/record-groups/shared', { 
                method: HttpMethod.GET 
            });
            const sharedData = await sharedRes.json();
            const sharedGroups = sharedData.groups || [];
            setSharedRecordGroups(sharedGroups);

            // 소유한 그룹들을 기본적으로 체크된 상태로 초기화
            const groupIds = ownedGroups.map((group: RecordGroup) => group.id);
            initializeGroups(groupIds);
        } catch (error) {
            console.error('Error fetching record groups:', error);
        } finally {
            setIsLoading(false);
        }
    }, [setOwnedRecordGroups, setSharedRecordGroups, initializeGroups]);

    // 레코드 그룹 상세 정보 조회 함수 (공유된 워커 목록 포함)
    const fetchRecordGroupDetails = useCallback(async (recordGroupId: string) => {
        try {
            const response = await fetch(`/api/record-groups/details/${recordGroupId}`, {
                method: HttpMethod.GET
            });

            if (response.ok) {
                const data = await response.json();
                return data as RecordGroupDetailResponse;
            } else {
                console.error('Failed to fetch record group details');
                return null;
            }
        } catch (error) {
            console.error('Error fetching record group details:', error);
            return null;
        }
    }, []);

    // 초기 로드
    useEffect(() => {
        fetchRecordGroups();
    }, [fetchRecordGroups]);

    // ownedRecordGroups와 sharedRecordGroups를 통합 (메모이제이션)
    const allRecordGroups = useMemo(
        () => [...ownedRecordGroups, ...sharedRecordGroups],
        [ownedRecordGroups, sharedRecordGroups]
    );

    return {
        ownedRecordGroups,
        sharedRecordGroups,
        allRecordGroups,
        isLoading,
        refreshRecordGroups: fetchRecordGroups,
        fetchRecordGroupDetails
    };
};
