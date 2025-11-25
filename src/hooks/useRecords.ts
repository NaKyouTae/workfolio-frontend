import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Record } from '@/generated/common';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import HttpMethod from '@/enums/HttpMethod';
import { CalendarViewType } from '@/models/CalendarTypes';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import { useShallow } from 'zustand/react/shallow';
// ============================================
// TODO: 샘플 데이터 관련 코드 - 추후 제거 예정
// ============================================
import { createSampleRecordGroups, createSampleRecords } from '@/utils/sampleRecordData';
// ============================================

dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

export const useRecords = (recordType: CalendarViewType = 'weekly', month?: number, year?: number, initialDate?: Date) => {
    const [records, setRecords] = useState<Record[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [forceRefreshTrigger, setForceRefreshTrigger] = useState(0);
    
    // ✅ checkedGroups Set을 직접 구독하여 변경사항을 즉시 감지
    const { checkedGroups, recordRefreshTrigger } = useRecordGroupStore(
        useShallow((state) => ({
            checkedGroups: state.checkedGroups,
            recordRefreshTrigger: state.recordRefreshTrigger
        }))
    );
    
    // checkedGroups Set을 배열로 변환 및 메모이제이션
    // recordRefreshTrigger도 의존성에 추가하여 강제 갱신
    const checkedGroupIds = useMemo(() => {
        return Array.from(checkedGroups);
    }, [checkedGroups, recordRefreshTrigger]);
    const checkedGroupIdsString = useMemo(() => checkedGroupIds.join(','), [checkedGroupIds]);
    
    // 마지막 API 호출 파라미터를 추적하여 중복 호출 방지
    const lastFetchParamsRef = useRef<string>('');

    // 강제 새로고침 함수
    const refreshRecords = useCallback(() => {
        lastFetchParamsRef.current = '';
        setForceRefreshTrigger(prev => prev + 1);
    }, []);

    // API 파라미터를 useMemo로 메모이제이션
    const apiParams = useMemo(() => {
        if (recordType === 'weekly') {
            // dayjs를 사용하여 timezone 이슈 해결
            const targetDate = initialDate ? dayjs(initialDate) : dayjs();
            const startOfWeek = targetDate.startOf('week'); // 일요일
            const endOfWeek = startOfWeek.add(6, 'day'); // 토요일
            
            return {
                type: 'weekly' as const,
                startDate: startOfWeek.format('YYYY-MM-DD'),
                endDate: endOfWeek.format('YYYY-MM-DD'),
                groupIds: checkedGroupIdsString
            };
        } else {
            const currentDate = new Date();
            const targetMonthValue = month || currentDate.getMonth() + 1;
            const targetYearValue = year || currentDate.getFullYear();
            
            return {
                type: 'monthly' as const,
                month: targetMonthValue,
                year: targetYearValue,
                groupIds: checkedGroupIdsString
            };
        }
    }, [recordType, initialDate, month, year, checkedGroupIdsString]);

    // ============================================
    // TODO: 샘플 데이터 관련 함수 - 추후 제거 예정
    // ============================================
    const getSampleRecords = useCallback((): Record[] => {
        const sampleRecordGroups = createSampleRecordGroups();
        const sampleRecords = createSampleRecords(sampleRecordGroups);
        
        // 체크된 그룹에 해당하는 샘플 레코드만 필터링
        if (checkedGroupIds.length === 0) {
            return sampleRecords as unknown as Record[];
        }
        
        return sampleRecords.filter((record: unknown) => 
            checkedGroupIds.includes((record as { recordGroup?: { id?: string } }).recordGroup?.id || '')
        ) as unknown as Record[];
    }, [checkedGroupIds]);
    // ============================================

    // 통합된 데이터 로드 useEffect
    useEffect(() => {
        setIsLoading(true);
        
        // ============================================
        // TODO: 샘플 데이터 관련 코드 - 추후 제거 예정
        // 항상 샘플 데이터를 먼저 로드
        // ============================================
        const sampleRecords = getSampleRecords();
        // ============================================
        
        // 체크된 그룹이 없으면 샘플 데이터만 표시
        if (checkedGroupIds.length === 0) {
            setRecords(sampleRecords);
            setIsLoading(false);
            return;
        }
        
        // 중복 호출 방지: 동일한 파라미터로 이미 호출했다면 스킵
        const currentParamsKey = JSON.stringify(apiParams) + `-refresh:${forceRefreshTrigger}`;
        
        if (lastFetchParamsRef.current === currentParamsKey && forceRefreshTrigger === 0) {
            // 중복 호출 방지이지만 샘플 데이터는 항상 표시
            setIsLoading(false);
            return;
        }
        lastFetchParamsRef.current = currentParamsKey;
        
        // API 호출 (토큰이 있으면 clientFetch가 자동으로 처리)
        const apiUrl = apiParams.type === 'weekly'
            ? `/api/records/weekly?startDate=${apiParams.startDate}&endDate=${apiParams.endDate}&recordGroupIds=${apiParams.groupIds}`
            : `/api/records/monthly?year=${apiParams.year}&month=${apiParams.month}&recordGroupIds=${apiParams.groupIds}`;
        
        // 먼저 샘플 데이터를 표시
        setRecords(sampleRecords);
        
        fetch(apiUrl, { method: HttpMethod.GET })
            .then(res => {
                if (!res.ok) {
                    // 401이면 clientFetch가 이미 토큰 재발급을 시도했을 것
                    // 재발급 후에도 401이면 clientFetch가 로그인 페이지로 리다이렉트했을 것
                    if (res.status === 401) {
                        // clientFetch가 이미 처리했으므로 샘플 데이터만 유지
                        return null;
                    }
                    // 다른 에러도 샘플 데이터만 유지
                    return null;
                }
                return res.json();
            })
            .then(data => {
                // API 데이터가 있으면 샘플 데이터와 병합
                if (data) {
                    let apiRecords: Record[] = [];
                if (data && Array.isArray(data.records)) {
                        apiRecords = data.records;
                } else if (data && Array.isArray(data)) {
                        apiRecords = data;
                    }
                    
                    // 샘플 데이터와 API 데이터 병합 (중복 제거: id 기준)
                    const mergedRecords = [...sampleRecords];
                    const existingIds = new Set(sampleRecords.map(r => r.id));
                    
                    apiRecords.forEach((apiRecord: Record) => {
                        if (!existingIds.has(apiRecord.id)) {
                            mergedRecords.push(apiRecord);
                        }
                    });
                    
                    setRecords(mergedRecords);
                } else {
                    // API 데이터가 없으면 샘플 데이터만 유지
                    setRecords(sampleRecords);
                }
            })
            .catch(error => {
                console.error('Error fetching records from API:', error);
                // 에러 발생 시에도 샘플 데이터는 유지
                setRecords(sampleRecords);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [apiParams, checkedGroupIds, forceRefreshTrigger, getSampleRecords]);

    // recordRefreshTrigger 변경 시 새로고침
    useEffect(() => {
        if (recordRefreshTrigger > 0) {
            refreshRecords();
        }
    }, [recordRefreshTrigger, refreshRecords]);

    // 키워드로 레코드 검색
    const searchRecordsByKeyword = useCallback(async (keyword: string, recordGroupIds?: string[]) => {
        if (!keyword || keyword.trim() === '') {
            return null;
        }

        // ============================================
        // TODO: 샘플 데이터 관련 코드 - 추후 제거 예정
        // 샘플 데이터 먼저 필터링
        // ============================================
            const sampleRecordGroups = createSampleRecordGroups();
            const sampleRecords = createSampleRecords(sampleRecordGroups) as unknown as Record[];
            
            const keywordLower = keyword.toLowerCase().trim();
        let filteredSampleRecords = sampleRecords.filter((record: Record) => {
                const titleMatch = record.title?.toLowerCase().includes(keywordLower) || false;
                const descriptionMatch = record.description?.toLowerCase().includes(keywordLower) || false;
                return titleMatch || descriptionMatch;
            });

            // recordGroupIds로 필터링 (있는 경우)
            if (recordGroupIds && recordGroupIds.length > 0) {
            filteredSampleRecords = filteredSampleRecords.filter((record: Record) => 
                    record.recordGroup?.id && recordGroupIds.includes(record.recordGroup.id)
                );
            }
        // ============================================

        try {
            let url = `/api/records/keywords?keyword=${encodeURIComponent(keyword)}`;
            
            // recordGroupIds가 있으면 쿼리 파라미터로 추가
            if (recordGroupIds && recordGroupIds.length > 0) {
                const groupIdsParam = recordGroupIds.map(id => `recordGroupIds=${encodeURIComponent(id)}`).join('&');
                url += `&${groupIdsParam}`;
            }

            const response = await fetch(url, {
                method: HttpMethod.GET,
            });

            if (!response.ok) {
                // API 실패 시 샘플 데이터만 반환
                return {
                    records: filteredSampleRecords
                };
            }

            const data = await response.json();
            const apiRecords = data.records || [];
            
            // 샘플 데이터와 API 데이터 병합 (중복 제거: id 기준)
            const mergedRecords = [...filteredSampleRecords];
            const existingIds = new Set(filteredSampleRecords.map(r => r.id));
            
            apiRecords.forEach((apiRecord: Record) => {
                if (!existingIds.has(apiRecord.id)) {
                    mergedRecords.push(apiRecord);
                }
            });
            
            return {
                records: mergedRecords
            };
        } catch (error) {
            console.error('Error searching records by keyword:', error);
            // 에러 발생 시 샘플 데이터만 반환
            return {
                records: filteredSampleRecords
            };
        }
    }, []);

    return {
        records,
        isLoading,
        refreshRecords,
        searchRecordsByKeyword
    };
};
