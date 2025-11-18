import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Record } from '@/generated/common';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { createSampleRecordGroups, createSampleRecords } from '@/utils/sampleRecordData';
import { ListRecordResponse } from '@/generated/record';
import HttpMethod from '@/enums/HttpMethod';
import { CalendarViewType } from '@/models/CalendarTypes';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import { useShallow } from 'zustand/react/shallow';

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

    // 통합된 데이터 로드 useEffect
    useEffect(() => {
        // 체크된 그룹이 없으면 조기 리턴 (API 호출 불필요)
        if (checkedGroupIds.length === 0) {
            setRecords([]);
            setIsLoading(false);
            return;
        }
        
        // 중복 호출 방지: 동일한 파라미터로 이미 호출했다면 스킵
        const currentParamsKey = JSON.stringify(apiParams) + `-refresh:${forceRefreshTrigger}`;
        
        if (lastFetchParamsRef.current === currentParamsKey && forceRefreshTrigger === 0) {
            return;
        }
        lastFetchParamsRef.current = currentParamsKey;
        
        setIsLoading(true);
        
        const accessToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];
        
        if (!accessToken) {
            // 로그인하지 않은 경우 - 샘플 데이터 로드
            const sampleRecordGroups = createSampleRecordGroups();
            const sampleRecords = createSampleRecords(sampleRecordGroups);
            
            const filteredRecords = sampleRecords.filter((record: unknown) => 
                checkedGroupIds.includes((record as { recordGroup?: { id?: string } }).recordGroup?.id || '')
            ) as unknown as Record[];
            
            setRecords(filteredRecords);
            setIsLoading(false);
            return;
        }
        
        // API 호출
        const apiUrl = apiParams.type === 'weekly'
            ? `/api/records/weekly?startDate=${apiParams.startDate}&endDate=${apiParams.endDate}&recordGroupIds=${apiParams.groupIds}`
            : `/api/records/monthly?year=${apiParams.year}&month=${apiParams.month}&recordGroupIds=${apiParams.groupIds}`;
        
        fetch(apiUrl, { method: HttpMethod.GET })
            .then(res => {
                if (!res.ok) {
                    if (res.status === 401) {
                        window.location.href = '/login';
                        return;
                    }
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data && Array.isArray(data.records)) {
                    setRecords(data.records);
                } else if (data && Array.isArray(data)) {
                    setRecords(data);
                } else {
                    console.warn("Invalid records data:", data);
                    setRecords([]);
                }
            })
            .catch(error => {
                console.error('Error fetching records from API:', error);
                setRecords([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [apiParams, checkedGroupIds, forceRefreshTrigger]);

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

        // 로그인 상태 확인
        const accessToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];

        // 로그인하지 않은 경우 샘플 데이터 사용
        if (!accessToken) {
            const sampleRecordGroups = createSampleRecordGroups();
            const sampleRecords = createSampleRecords(sampleRecordGroups) as unknown as Record[];
            
            // keyword로 필터링 (title, description에서 검색)
            const keywordLower = keyword.toLowerCase().trim();
            let filteredRecords = sampleRecords.filter((record: Record) => {
                const titleMatch = record.title?.toLowerCase().includes(keywordLower) || false;
                const descriptionMatch = record.description?.toLowerCase().includes(keywordLower) || false;
                return titleMatch || descriptionMatch;
            });

            // recordGroupIds로 필터링 (있는 경우)
            if (recordGroupIds && recordGroupIds.length > 0) {
                filteredRecords = filteredRecords.filter((record: Record) => 
                    record.recordGroup?.id && recordGroupIds.includes(record.recordGroup.id)
                );
            }

            // ListRecordResponse 형태로 반환
            const response: ListRecordResponse = {
                records: filteredRecords
            };
            
            return response;
        }

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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching records by keyword:', error);
            return null;
        }
    }, []);

    return {
        records,
        isLoading,
        refreshRecords,
        searchRecordsByKeyword
    };
};
