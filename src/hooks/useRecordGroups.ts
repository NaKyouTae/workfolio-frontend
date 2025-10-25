import { useCallback, useEffect, useMemo } from 'react';
import { RecordGroup } from '@/generated/common';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { createSampleRecordGroups } from '@/utils/sampleRecordData';
import HttpMethod from '@/enums/HttpMethod';
import { RecordGroupDetailResponse } from '@/generated/record_group';
import { useShallow } from 'zustand/react/shallow';

export const useRecordGroups = () => {
    // Zustand의 선택적 구독 - useShallow로 한 번에 구독
    const { 
        ownedRecordGroups, 
        sharedRecordGroups, 
        isLoading,
        setOwnedRecordGroups,
        setSharedRecordGroups,
        setIsLoading,
        initializeGroups
    } = useRecordGroupStore(
        useShallow((state) => ({
            ownedRecordGroups: state.ownedRecordGroups,
            sharedRecordGroups: state.sharedRecordGroups,
            isLoading: state.isLoading,
            setOwnedRecordGroups: state.setOwnedRecordGroups,
            setSharedRecordGroups: state.setSharedRecordGroups,
            setIsLoading: state.setIsLoading,
            initializeGroups: state.initializeGroups,
        }))
    );

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
                setOwnedRecordGroups(sampleRecordGroups);
                setSharedRecordGroups([]);
                initializeGroups(sampleRecordGroups.map((group: RecordGroup) => group.id));
                return;
            }

            // 🔥 모든 데이터를 가져올 때까지 병렬로 fetch
            const [ownedRes, sharedRes] = await Promise.all([
                fetch('/api/record-groups/owned', { method: HttpMethod.GET }),
                fetch('/api/record-groups/shared', { method: HttpMethod.GET })
            ]);
            
            const ownedData = await ownedRes.json();
            const sharedData = await sharedRes.json();
            
            const ownedGroups = ownedData.groups || [];
            const sharedGroups = sharedData.groups || [];

            // 소유한 그룹 + 공유받은 그룹 모두 기본적으로 체크된 상태로 초기화
            const allGroupIds = [
                ...ownedGroups.map((group: RecordGroup) => group.id),
                ...sharedGroups.map((group: RecordGroup) => group.id)
            ];
            
            // 🔥 체크 상태를 먼저 설정한 후 데이터 설정
            // 이렇게 하면 setOwnedRecordGroups/setSharedRecordGroups에서
            // 자동으로 체크에 추가되지 않음 (이미 체크되어 있으므로)
            initializeGroups(allGroupIds);
            setOwnedRecordGroups(ownedGroups);
            setSharedRecordGroups(sharedGroups);
        } catch (error) {
            console.error('Error fetching record groups:', error);
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 마운트 시 한 번만 실행 - Zustand store 함수들은 안정적

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

    // 초기 로드 (한 번만 실행)
    useEffect(() => {
        fetchRecordGroups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 의도적으로 빈 배열 - 마운트 시 한 번만 실행

    // ownedRecordGroups와 sharedRecordGroups를 통합 (메모이제이션)
    const allRecordGroups = useMemo(() => {
        return [...ownedRecordGroups, ...sharedRecordGroups];
    }, [ownedRecordGroups, sharedRecordGroups]);

    // 🔥 반환 객체를 메모이제이션하여 불필요한 리렌더링 방지
    // 함수들은 useCallback으로 안정적이므로 의존성에 포함
    return useMemo(() => ({
        ownedRecordGroups,
        sharedRecordGroups,
        allRecordGroups,
        isLoading,
        refreshRecordGroups: fetchRecordGroups,
        fetchRecordGroupDetails
    }), [ownedRecordGroups, sharedRecordGroups, allRecordGroups, isLoading, fetchRecordGroups, fetchRecordGroupDetails]);
};
