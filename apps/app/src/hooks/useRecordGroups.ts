import { useCallback, useMemo } from "react";
import { RecordGroup, RecordGroup_RecordGroupType, Record } from "@workfolio/shared/generated/common";
import { useRecordGroupStore } from "@workfolio/shared/store/recordGroupStore";
import HttpMethod from "@workfolio/shared/enums/HttpMethod";
import {
    RecordGroupDetailResponse,
    RecordGroupPriorityUpdateRequest,
    RecordGroupPriorityUpdateRequest_PriorityItem,
    SharedRecordGroupPriorityUpdateRequest,
    SharedRecordGroupPriorityUpdateRequest_PriorityItem,
} from "@workfolio/shared/generated/record_group";
import { useShallow } from "zustand/react/shallow";
import { isLoggedIn } from "@workfolio/shared/utils/authUtils";
// ============================================
// TODO: 샘플 데이터 관련 코드 - 추후 제거 예정
// ============================================
import { createSampleRecordGroups, createSampleRecords } from "@/utils/sampleRecordData";
// ============================================

export const useRecordGroups = () => {
    // Zustand의 선택적 구독 - useShallow로 한 번에 구독
    const {
        ownedRecordGroups,
        sharedRecordGroups,
        isLoading,
        isSampleDataInitialized,
        setOwnedRecordGroups,
        setSharedRecordGroups,
        setIsLoading,
        initializeGroups,
        setSampleDataInitialized,
        setSampleRecords,
    } = useRecordGroupStore(
        useShallow((state) => ({
            ownedRecordGroups: state.ownedRecordGroups,
            sharedRecordGroups: state.sharedRecordGroups,
            isLoading: state.isLoading,
            isSampleDataInitialized: state.isSampleDataInitialized,
            setOwnedRecordGroups: state.setOwnedRecordGroups,
            setSharedRecordGroups: state.setSharedRecordGroups,
            setIsLoading: state.setIsLoading,
            initializeGroups: state.initializeGroups,
            setSampleDataInitialized: state.setSampleDataInitialized,
            setSampleRecords: state.setSampleRecords,
        }))
    );

    // ============================================
    // TODO: 샘플 데이터 관련 함수 - 추후 제거 예정
    // ============================================
    const getSampleRecordGroups = useCallback(() => {
        const sampleRecordGroups = createSampleRecordGroups();
        const ownedGroups = sampleRecordGroups.filter(
            (group: RecordGroup) => group.type === RecordGroup_RecordGroupType.PRIVATE
        );
        const sharedGroups = sampleRecordGroups.filter(
            (group: RecordGroup) => group.type === RecordGroup_RecordGroupType.SHARED
        );
        return { ownedGroups, sharedGroups };
    }, []);
    // ============================================

    // 레코드 그룹 조회 함수
    const fetchRecordGroups = useCallback(
        async (forceRefresh: boolean = false) => {
            setIsLoading(true);

            // 로그인하지 않은 경우 샘플 데이터만 사용하고 API 호출하지 않음
            if (!isLoggedIn()) {
                // ============================================
                // TODO: 샘플 데이터 관련 코드 - 추후 제거 예정
                // 로그인하지 않은 경우에만 샘플 데이터 사용
                // 페이지 접근 시에만 리프레시 (이미 초기화되어 있고 강제 리프레시가 아니면 스킵)
                // ============================================
                if (isSampleDataInitialized && !forceRefresh) {
                    setIsLoading(false);
                    return;
                }

                const { ownedGroups: sampleOwnedGroups, sharedGroups: sampleSharedGroups } =
                    getSampleRecordGroups();
                const sampleAllGroupIds = [
                    ...sampleOwnedGroups.map((group: RecordGroup) => group.id),
                    ...sampleSharedGroups.map((group: RecordGroup) => group.id),
                ];

                // 샘플 데이터 설정
                initializeGroups(sampleAllGroupIds);
                setOwnedRecordGroups(sampleOwnedGroups);
                setSharedRecordGroups(sampleSharedGroups);

                // 샘플 레코드도 함께 생성하여 캐시에 저장 (동일한 그룹 객체 사용)
                const sampleRecords = createSampleRecords(
                    [...sampleOwnedGroups, ...sampleSharedGroups]
                ) as unknown as Record[];
                setSampleRecords(sampleRecords);

                setSampleDataInitialized(true);
                // ============================================
                setIsLoading(false);
                return;
            }

            try {
                // API 호출 (토큰이 있으면 clientFetch가 자동으로 처리)
                // 🔥 모든 데이터를 가져올 때까지 병렬로 fetch
                const [ownedRes, sharedRes] = await Promise.all([
                    fetch("/api/record-groups/owned", { method: HttpMethod.GET }),
                    fetch("/api/record-groups/shared", { method: HttpMethod.GET }),
                ]);

                // 응답 상태 확인
                if (!ownedRes.ok || !sharedRes.ok) {
                    // 401이면 clientFetch가 이미 처리했을 것
                    if (ownedRes.status === 401 || sharedRes.status === 401) {
                        setIsLoading(false);
                        return;
                    }
                    // 다른 에러도 빈 배열로 설정
                    setOwnedRecordGroups([]);
                    setSharedRecordGroups([]);
                    setIsLoading(false);
                    return;
                }

                const ownedData = await ownedRes.json();
                const sharedData = await sharedRes.json();

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ownedGroups = (ownedData.groups || []).map((g: any) => RecordGroup.fromJSON(g));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const sharedGroups = (sharedData.groups || []).map((g: any) => RecordGroup.fromJSON(g));

                // 로그인한 경우 API 데이터만 사용 (샘플 데이터 병합하지 않음)
                const allGroupIds = [
                    ...ownedGroups.map((group: RecordGroup) => group.id),
                    ...sharedGroups.map((group: RecordGroup) => group.id),
                ];

                // 🔥 체크 상태를 먼저 설정한 후 데이터 설정
                initializeGroups(allGroupIds);
                setOwnedRecordGroups(ownedGroups);
                setSharedRecordGroups(sharedGroups);
            } catch (error) {
                // 에러 발생 시 빈 배열로 설정
                console.error("Error fetching record groups:", error);
                setOwnedRecordGroups([]);
                setSharedRecordGroups([]);
            } finally {
                setIsLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [getSampleRecordGroups, isSampleDataInitialized, setSampleDataInitialized, setSampleRecords] // Zustand store 함수들은 안정적
    );

    // 레코드 그룹 상세 정보 조회 함수 (공유된 워커 목록 포함)
    const fetchRecordGroupDetails = useCallback(async (recordGroupId: string) => {
        try {
            const response = await fetch(`/api/record-groups/details/${recordGroupId}`, {
                method: HttpMethod.GET,
            });

            if (response.ok) {
                const data = await response.json();
                return data as RecordGroupDetailResponse;
            } else {
                console.error("Failed to fetch record group details");
                return null;
            }
        } catch (error) {
            console.error("Error fetching record group details:", error);
            return null;
        }
    }, []);

    // 초기 로드는 RecordsPage에서 명시적으로 호출하도록 변경
    // useEffect를 제거하여 페이지 접근 시에만 리프레시되도록 함

    // ownedRecordGroups와 sharedRecordGroups를 통합 (메모이제이션)
    const allRecordGroups = useMemo(() => {
        return [...ownedRecordGroups, ...sharedRecordGroups];
    }, [ownedRecordGroups, sharedRecordGroups]);

    // 기록장 탈퇴 API 호출 함수
    const leaveRecordGroup = useCallback(
        async (recordGroupId: string, targetWorkerId: string): Promise<boolean> => {
            try {
                const response = await fetch(
                    `/api/worker-record-groups?recordGroupId=${recordGroupId}&targetWorkerId=${targetWorkerId}`,
                    {
                        method: HttpMethod.DELETE,
                    }
                );

                if (response.ok) {
                    // 탈퇴 성공 시 레코드 그룹 목록 새로고침
                    await fetchRecordGroups();
                    return true;
                } else {
                    const errorData = await response.json();
                    console.error("기록장 탈퇴 실패:", errorData);
                    return false;
                }
            } catch (error) {
                console.error("Error leaving record group:", error);
                return false;
            }
        },
        [fetchRecordGroups]
    );

    // 기록장 삭제 API 호출 함수
    const deleteRecordGroup = useCallback(
        async (recordGroupId: string): Promise<boolean> => {
            try {
                const response = await fetch(`/api/record-groups/${recordGroupId}`, {
                    method: HttpMethod.DELETE,
                });

                if (response.ok) {
                    // 삭제 성공 시 레코드 그룹 목록 새로고침
                    await fetchRecordGroups();
                    return true;
                } else {
                    const errorData = await response.json();
                    console.error("기록장 삭제 실패:", errorData);
                    return false;
                }
            } catch (error) {
                console.error("Error deleting record group:", error);
                return false;
            }
        },
        [fetchRecordGroups]
    );

    // 기록장 우선순위 업데이트 API 호출 함수 (개인 기록장용)
    const updatePriorities = useCallback(
        async (
            type: RecordGroup_RecordGroupType,
            recordGroups: RecordGroup[]
        ): Promise<boolean> => {
            try {
                const priorities: RecordGroupPriorityUpdateRequest_PriorityItem[] =
                    recordGroups.map((group, index) => ({
                        recordGroupId: group.id || "",
                        priority: index + 1, // 1부터 시작하는 우선순위
                    }));

                const request: RecordGroupPriorityUpdateRequest = {
                    type,
                    priorities,
                };

                const response = await fetch("/api/record-groups/priorities", {
                    method: HttpMethod.PUT,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(request),
                });

                if (response.ok) {
                    // 우선순위 업데이트 성공 시 레코드 그룹 목록 새로고침
                    await fetchRecordGroups();
                    return true;
                } else {
                    const errorData = await response.json();
                    console.error("우선순위 업데이트 실패:", errorData);
                    return false;
                }
            } catch (error) {
                console.error("Error updating record group priorities:", error);
                return false;
            }
        },
        [fetchRecordGroups]
    );

    // 공유 기록장 우선순위 업데이트 API 호출 함수
    const updateSharedPriorities = useCallback(
        async (recordGroups: RecordGroup[]): Promise<boolean> => {
            try {
                const priorities: SharedRecordGroupPriorityUpdateRequest_PriorityItem[] =
                    recordGroups.map((group, index) => ({
                        recordGroupId: group.id || "",
                        priority: index + 1, // 1부터 시작하는 우선순위
                    }));

                const request: SharedRecordGroupPriorityUpdateRequest = {
                    priorities,
                };

                const response = await fetch("/api/worker-record-groups/shared/priorities", {
                    method: HttpMethod.PUT,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(request),
                });

                if (response.ok) {
                    // 우선순위 업데이트 성공 시 레코드 그룹 목록 새로고침
                    await fetchRecordGroups();
                    return true;
                } else {
                    const errorData = await response.json();
                    console.error("공유 기록장 우선순위 업데이트 실패:", errorData);
                    return false;
                }
            } catch (error) {
                console.error("Error updating shared record group priorities:", error);
                return false;
            }
        },
        [fetchRecordGroups]
    );

    // 🔥 반환 객체를 메모이제이션하여 불필요한 리렌더링 방지
    // 함수들은 useCallback으로 안정적이므로 의존성에 포함
    return useMemo(
        () => ({
            ownedRecordGroups,
            sharedRecordGroups,
            allRecordGroups,
            isLoading,
            refreshRecordGroups: fetchRecordGroups,
            fetchRecordGroupDetails,
            leaveRecordGroup,
            deleteRecordGroup,
            updatePriorities,
            updateSharedPriorities,
        }),
        [
            ownedRecordGroups,
            sharedRecordGroups,
            allRecordGroups,
            isLoading,
            fetchRecordGroups,
            fetchRecordGroupDetails,
            leaveRecordGroup,
            deleteRecordGroup,
            updatePriorities,
            updateSharedPriorities,
        ]
    );
};
