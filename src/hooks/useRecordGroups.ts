import { useCallback, useEffect, useMemo } from 'react';
import { RecordGroup, RecordGroup_RecordGroupType } from '@/generated/common';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import HttpMethod from '@/enums/HttpMethod';
import { RecordGroupDetailResponse } from '@/generated/record_group';
import { useShallow } from 'zustand/react/shallow';
// ============================================
// TODO: 샘플 데이터 관련 코드 - 추후 제거 예정
// ============================================
import { createSampleRecordGroups } from '@/utils/sampleRecordData';
// ============================================

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

    // ============================================
    // TODO: 샘플 데이터 관련 함수 - 추후 제거 예정
    // ============================================
    const getSampleRecordGroups = useCallback(() => {
        const sampleRecordGroups = createSampleRecordGroups();
        const ownedGroups = sampleRecordGroups.filter((group: RecordGroup) => group.type === RecordGroup_RecordGroupType.PRIVATE);
        const sharedGroups = sampleRecordGroups.filter((group: RecordGroup) => group.type === RecordGroup_RecordGroupType.SHARED);
        return { ownedGroups, sharedGroups };
    }, []);
    // ============================================

    // 레코드 그룹 조회 함수
    const fetchRecordGroups = useCallback(async () => {
        setIsLoading(true);
        
        // ============================================
        // TODO: 샘플 데이터 관련 코드 - 추후 제거 예정
        // 항상 샘플 데이터를 먼저 로드
        // ============================================
        const { ownedGroups: sampleOwnedGroups, sharedGroups: sampleSharedGroups } = getSampleRecordGroups();
        const sampleAllGroupIds = [
            ...sampleOwnedGroups.map((group: RecordGroup) => group.id),
            ...sampleSharedGroups.map((group: RecordGroup) => group.id)
        ];
        
        // 샘플 데이터 먼저 설정
        initializeGroups(sampleAllGroupIds);
        setOwnedRecordGroups(sampleOwnedGroups);
        setSharedRecordGroups(sampleSharedGroups);
        // ============================================
        
        try {
            // API 호출 (토큰이 있으면 clientFetch가 자동으로 처리)
            // 🔥 모든 데이터를 가져올 때까지 병렬로 fetch
            const [ownedRes, sharedRes] = await Promise.all([
                fetch('/api/record-groups/owned', { method: HttpMethod.GET }),
                fetch('/api/record-groups/shared', { method: HttpMethod.GET })
            ]);
            
            // 응답 상태 확인
            if (!ownedRes.ok || !sharedRes.ok) {
                // 401이면 clientFetch가 이미 처리했을 것이므로, 샘플 데이터만 유지
                if (ownedRes.status === 401 || sharedRes.status === 401) {
                    console.log('⚠️ 401 Unauthorized - token refresh may have been attempted');
                    // 샘플 데이터는 이미 설정되어 있음
                    return;
                }
                // 다른 에러도 샘플 데이터만 유지
                return;
            }
            
            const ownedData = await ownedRes.json();
            const sharedData = await sharedRes.json();
            
            const ownedGroups = ownedData.groups || [];
            const sharedGroups = sharedData.groups || [];

            // API 데이터와 샘플 데이터 병합 (중복 제거: id 기준)
            const mergedOwnedGroups = [...sampleOwnedGroups];
            const mergedSharedGroups = [...sampleSharedGroups];
            const existingOwnedIds = new Set(sampleOwnedGroups.map(g => g.id));
            const existingSharedIds = new Set(sampleSharedGroups.map(g => g.id));
            
            ownedGroups.forEach((group: RecordGroup) => {
                if (!existingOwnedIds.has(group.id)) {
                    mergedOwnedGroups.push(group);
                }
            });
            
            sharedGroups.forEach((group: RecordGroup) => {
                if (!existingSharedIds.has(group.id)) {
                    mergedSharedGroups.push(group);
                }
            });

            // 소유한 그룹 + 공유받은 그룹 모두 기본적으로 체크된 상태로 초기화
            const allGroupIds = [
                ...mergedOwnedGroups.map((group: RecordGroup) => group.id),
                ...mergedSharedGroups.map((group: RecordGroup) => group.id)
            ];
            
            // 🔥 체크 상태를 먼저 설정한 후 데이터 설정
            // 이렇게 하면 setOwnedRecordGroups/setSharedRecordGroups에서
            // 자동으로 체크에 추가되지 않음 (이미 체크되어 있으므로)
            initializeGroups(allGroupIds);
            setOwnedRecordGroups(mergedOwnedGroups);
            setSharedRecordGroups(mergedSharedGroups);
        } catch (error) {
            console.error('Error fetching record groups:', error);
            // 에러 발생 시에도 샘플 데이터는 유지
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSampleRecordGroups]); // 마운트 시 한 번만 실행 - Zustand store 함수들은 안정적

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

    // 기록장 탈퇴 API 호출 함수
    const leaveRecordGroup = useCallback(async (
        recordGroupId: string,
        targetWorkerId: string
    ): Promise<boolean> => {
        try {
            const response = await fetch(
                `/api/worker-record-groups?recordGroupId=${recordGroupId}&targetWorkerId=${targetWorkerId}`,
                {
                    method: HttpMethod.DELETE,
                }
            );

            if (response.ok) {
                console.log('기록장 탈퇴 성공');
                // 탈퇴 성공 시 레코드 그룹 목록 새로고침
                await fetchRecordGroups();
                return true;
            } else {
                const errorData = await response.json();
                console.error('기록장 탈퇴 실패:', errorData);
                return false;
            }
        } catch (error) {
            console.error('Error leaving record group:', error);
            return false;
        }
    }, [fetchRecordGroups]);

    // 기록장 삭제 API 호출 함수
    const deleteRecordGroup = useCallback(async (
        recordGroupId: string
    ): Promise<boolean> => {
        try {
            const response = await fetch(`/api/record-groups/${recordGroupId}`, {
                method: HttpMethod.DELETE,
            });

            if (response.ok) {
                console.log('기록장 삭제 성공');
                // 삭제 성공 시 레코드 그룹 목록 새로고침
                await fetchRecordGroups();
                return true;
            } else {
                const errorData = await response.json();
                console.error('기록장 삭제 실패:', errorData);
                return false;
            }
        } catch (error) {
            console.error('Error deleting record group:', error);
            return false;
        }
    }, [fetchRecordGroups]);

    // 🔥 반환 객체를 메모이제이션하여 불필요한 리렌더링 방지
    // 함수들은 useCallback으로 안정적이므로 의존성에 포함
    return useMemo(() => ({
        ownedRecordGroups,
        sharedRecordGroups,
        allRecordGroups,
        isLoading,
        refreshRecordGroups: fetchRecordGroups,
        fetchRecordGroupDetails,
        leaveRecordGroup,
        deleteRecordGroup
    }), [ownedRecordGroups, sharedRecordGroups, allRecordGroups, isLoading, fetchRecordGroups, fetchRecordGroupDetails, leaveRecordGroup, deleteRecordGroup]);
};
