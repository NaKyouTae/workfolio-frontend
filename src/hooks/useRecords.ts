import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Record } from "@/generated/common";
import { useRecordGroupStore } from "@/store/recordGroupStore";
import HttpMethod from "@/enums/HttpMethod";
import { CalendarViewType } from "@/models/CalendarTypes";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { useShallow } from "zustand/react/shallow";
import { isLoggedIn } from "@/utils/authUtils";
// ============================================
// TODO: 샘플 데이터 관련 코드 - 추후 제거 예정
// ============================================
import { createSampleRecordGroups, createSampleRecords } from "@/utils/sampleRecordData";
// ============================================

dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

export const useRecords = (
    recordType: CalendarViewType = "weekly",
    month?: number,
    year?: number,
    initialDate?: Date
) => {
    const [records, setRecords] = useState<Record[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [forceRefreshTrigger, setForceRefreshTrigger] = useState(0);

    // ✅ checkedGroups Set을 직접 구독하여 변경사항을 즉시 감지
    const { checkedGroups, recordRefreshTrigger, sampleRecords, setSampleRecords } =
        useRecordGroupStore(
            useShallow((state) => ({
                checkedGroups: state.checkedGroups,
                recordRefreshTrigger: state.recordRefreshTrigger,
                sampleRecords: state.sampleRecords,
                setSampleRecords: state.setSampleRecords,
            }))
        );

    // checkedGroups Set을 배열로 변환 및 메모이제이션
    const checkedGroupIds = useMemo(() => {
        return Array.from(checkedGroups);
    }, [checkedGroups]);
    const checkedGroupIdsString = useMemo(() => checkedGroupIds.join(","), [checkedGroupIds]);

    // 마지막 API 호출 파라미터를 추적하여 중복 호출 방지
    const lastFetchParamsRef = useRef<string>("");

    // 강제 새로고침 함수
    const refreshRecords = useCallback(() => {
        lastFetchParamsRef.current = "";
        setForceRefreshTrigger((prev) => prev + 1);
    }, []);

    // API 파라미터를 useMemo로 메모이제이션
    const apiParams = useMemo(() => {
        if (recordType === "weekly") {
            // dayjs를 사용하여 timezone 이슈 해결
            const targetDate = initialDate ? dayjs(initialDate) : dayjs();
            const startOfWeek = targetDate.startOf("week"); // 일요일
            const endOfWeek = startOfWeek.add(6, "day"); // 토요일

            return {
                type: "weekly" as const,
                startDate: startOfWeek.format("YYYY-MM-DD"),
                endDate: endOfWeek.format("YYYY-MM-DD"),
                groupIds: checkedGroupIdsString,
            };
        } else {
            const currentDate = new Date();
            const targetMonthValue = month || currentDate.getMonth() + 1;
            const targetYearValue = year || currentDate.getFullYear();

            return {
                type: "monthly" as const,
                month: targetMonthValue,
                year: targetYearValue,
                groupIds: checkedGroupIdsString,
            };
        }
    }, [recordType, initialDate, month, year, checkedGroupIdsString]);

    // ============================================
    // TODO: 샘플 데이터 관련 함수 - 추후 제거 예정
    // ============================================
    // 샘플 레코드 데이터를 한 번만 생성하고 캐시에서 재사용
    const getSampleRecords = useCallback((): Record[] => {
        // 캐시된 샘플 레코드가 없으면 생성
        if (sampleRecords.length === 0) {
            const sampleRecordGroups = createSampleRecordGroups();
            const newSampleRecords = createSampleRecords(sampleRecordGroups) as unknown as Record[];
            setSampleRecords(newSampleRecords);
            return newSampleRecords;
        }

        // 캐시된 샘플 레코드 사용 (재생성하지 않음)
        // 체크된 그룹에 해당하는 샘플 레코드만 필터링
        if (checkedGroupIds.length === 0) {
            return sampleRecords;
        }

        return sampleRecords.filter((record: Record) =>
            checkedGroupIds.includes(record.recordGroup?.id || "")
        );
    }, [checkedGroupIds, sampleRecords, setSampleRecords]);
    // ============================================

    // 통합된 데이터 로드 useEffect
    useEffect(() => {
        setIsLoading(true);

        // 로그인하지 않은 경우 샘플 데이터만 사용하고 API 호출하지 않음
        if (!isLoggedIn()) {
            // ============================================
            // TODO: 샘플 데이터 관련 코드 - 추후 제거 예정
            // 로그인하지 않은 경우에만 샘플 데이터 사용
            // ============================================
            const sampleRecords = getSampleRecords();

            // 체크된 그룹이 없으면 샘플 데이터만 표시
            if (checkedGroupIds.length === 0) {
                setRecords(sampleRecords);
                setIsLoading(false);
                return;
            }

            setRecords(sampleRecords);
            setIsLoading(false);
            return;
            // ============================================
        }

        // 체크된 그룹이 없으면 빈 배열 반환
        if (checkedGroupIds.length === 0) {
            setRecords([]);
            setIsLoading(false);
            return;
        }

        // 중복 호출 방지: 동일한 파라미터로 이미 호출했다면 스킵
        const currentParamsKey = JSON.stringify(apiParams) + `-refresh:${forceRefreshTrigger}`;

        if (lastFetchParamsRef.current === currentParamsKey && forceRefreshTrigger === 0) {
            setIsLoading(false);
            return;
        }
        lastFetchParamsRef.current = currentParamsKey;

        // API 호출 (토큰이 있으면 clientFetch가 자동으로 처리)
        const apiUrl =
            apiParams.type === "weekly"
                ? `/api/records/weekly?startDate=${apiParams.startDate}&endDate=${apiParams.endDate}&recordGroupIds=${apiParams.groupIds}`
                : `/api/records/monthly?year=${apiParams.year}&month=${apiParams.month}&recordGroupIds=${apiParams.groupIds}`;

        fetch(apiUrl, { method: HttpMethod.GET })
            .then((res) => {
                if (!res.ok) {
                    // 401이면 clientFetch가 이미 토큰 재발급을 시도했을 것
                    if (res.status === 401) {
                        return null;
                    }
                    // 다른 에러도 빈 배열 반환
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                // 로그인한 경우 API 데이터만 사용 (샘플 데이터 병합하지 않음)
                if (data) {
                    let apiRecords: Record[] = [];
                    if (data && Array.isArray(data.records)) {
                        apiRecords = data.records;
                    } else if (data && Array.isArray(data)) {
                        apiRecords = data;
                    }
                    setRecords(apiRecords);
                } else {
                    // API 데이터가 없으면 빈 배열
                    setRecords([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching records from API:", error);
                // 에러 발생 시 빈 배열
                setRecords([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [apiParams, checkedGroupIds, forceRefreshTrigger, getSampleRecords]);

    // recordRefreshTrigger 변경 시 새로고침 (로그인한 경우에만)
    // 로그인하지 않은 경우 샘플 데이터는 재생성하지 않음
    useEffect(() => {
        if (recordRefreshTrigger > 0 && isLoggedIn()) {
            refreshRecords();
        }
        // 로그인하지 않은 경우 checkedGroupIds 변경 시 필터링만 수행
    }, [recordRefreshTrigger, refreshRecords]);

    // 키워드로 레코드 검색
    const searchRecordsByKeyword = useCallback(
        async (keyword: string, recordGroupIds?: string[]) => {
            if (!keyword || keyword.trim() === "") {
                return null;
            }

            // 로그인하지 않은 경우 샘플 데이터만 사용
            if (!isLoggedIn()) {
                // ============================================
                // TODO: 샘플 데이터 관련 코드 - 추후 제거 예정
                // 로그인하지 않은 경우에만 샘플 데이터 사용
                // ============================================
                const sampleRecordGroups = createSampleRecordGroups();
                const sampleRecords = createSampleRecords(
                    sampleRecordGroups
                ) as unknown as Record[];

                const keywordLower = keyword.toLowerCase().trim();
                let filteredSampleRecords = sampleRecords.filter((record: Record) => {
                    const titleMatch = record.title?.toLowerCase().includes(keywordLower) || false;
                    const descriptionMatch =
                        record.description?.toLowerCase().includes(keywordLower) || false;
                    return titleMatch || descriptionMatch;
                });

                // recordGroupIds로 필터링 (있는 경우)
                if (recordGroupIds && recordGroupIds.length > 0) {
                    filteredSampleRecords = filteredSampleRecords.filter(
                        (record: Record) =>
                            record.recordGroup?.id && recordGroupIds.includes(record.recordGroup.id)
                    );
                }

                return {
                    records: filteredSampleRecords,
                };
                // ============================================
            }

            try {
                let url = `/api/records/keywords?keyword=${encodeURIComponent(keyword)}`;

                // recordGroupIds가 있으면 쿼리 파라미터로 추가
                if (recordGroupIds && recordGroupIds.length > 0) {
                    const groupIdsParam = recordGroupIds
                        .map((id) => `recordGroupIds=${encodeURIComponent(id)}`)
                        .join("&");
                    url += `&${groupIdsParam}`;
                }

                const response = await fetch(url, {
                    method: HttpMethod.GET,
                });

                if (!response.ok) {
                    // API 실패 시 빈 배열 반환
                    return {
                        records: [],
                    };
                }

                const data = await response.json();
                const apiRecords = data.records || [];

                // 로그인한 경우 API 데이터만 사용 (샘플 데이터 병합하지 않음)
                return {
                    records: apiRecords,
                };
            } catch (error) {
                console.error("Error searching records by keyword:", error);
                // 에러 발생 시 빈 배열 반환
                return {
                    records: [],
                };
            }
        },
        []
    );

    return {
        records,
        isLoading,
        refreshRecords,
        searchRecordsByKeyword,
    };
};
