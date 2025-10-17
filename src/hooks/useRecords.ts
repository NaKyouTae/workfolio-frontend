import { useState, useCallback, useEffect, useRef } from 'react';
import { Record } from '@/generated/common';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { createSampleRecordGroups, createSampleRecords } from '@/utils/sampleData';
import HttpMethod from '@/enums/HttpMethod';
import { CalendarViewType } from '@/models/CalendarTypes';

export const useRecords = (recordType: CalendarViewType = 'weekly', month?: number, year?: number, initialDate?: Date) => {
    const [records, setRecords] = useState<Record[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // 렌더링 횟수 체크를 위한 ref
    const renderCountRef = useRef(0);
    const lastParamsRef = useRef<string>('');
    
    // 렌더링 횟수 증가
    renderCountRef.current += 1;
    
    // 현재 파라미터 문자열 생성
    const currentParams = `${recordType}-${month}-${year}-${initialDate?.getTime()}`;
    
    // 파라미터 변경 감지 (디버깅용 - 프로덕션에서는 제거)
    useEffect(() => {
        // 개발 환경에서만 로그 출력
        if (process.env.NODE_ENV === 'development' && lastParamsRef.current !== currentParams) {
            console.log(`🔄 useRecords 파라미터 변경: ${currentParams}`);
            console.log(`📊 useRecords 렌더링 #${renderCountRef.current}`);
            lastParamsRef.current = currentParams;
        }
    }, [currentParams]);
    
    const { getCheckedGroupIds, recordRefreshTrigger } = useRecordGroupStore();
    const checkedGroupIds = getCheckedGroupIds();
    const checkedGroupIdsString = checkedGroupIds.join(',');


    // 샘플 데이터 캐싱을 위한 상태
    const [cachedSampleData, setCachedSampleData] = useState<Record[]>([]);
    const [lastCacheKey, setLastCacheKey] = useState<string>('');

    // 레코드 조회 함수 (통합)
    const fetchRecords = useCallback(async (targetMonth?: number, targetYear?: number, startDate?: string, endDate?: string) => {
        setIsLoading(true);
        try {
            // 로그인 상태 확인
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            // 로그인하지 않은 경우 - 샘플 데이터 로드 및 필터링
            if (!accessToken) {
                const currentCheckedGroupIds = getCheckedGroupIds();
                const cacheKey = `sample_${currentCheckedGroupIds.join(',')}`;
                
                // 캐시된 데이터가 있고 그룹 ID가 동일한 경우 재사용
                if (cachedSampleData.length > 0 && lastCacheKey === cacheKey) {
                    setRecords(cachedSampleData);
                    setIsLoading(false);
                    return;
                }
                
                const sampleRecordGroups = createSampleRecordGroups();
                const sampleRecords = createSampleRecords(sampleRecordGroups);
                
                const filteredRecords = sampleRecords.filter((record: unknown) => 
                    currentCheckedGroupIds.includes((record as { recordGroup?: { id?: string } }).recordGroup?.id || '')
                ) as unknown as Record[];
                
                // 캐시에 저장
                setCachedSampleData(filteredRecords);
                setLastCacheKey(cacheKey);
                setRecords(filteredRecords);
                return;
            }
            
            // 로그인한 경우 - recordType에 따라 적절한 API 함수 호출
            if (recordType === 'weekly') {
                // Weekly API 호출 로직을 직접 구현
                const currentCheckedGroupIds = getCheckedGroupIds();
                
                if (currentCheckedGroupIds.length === 0) {
                    setRecords([]);
                    return;
                }
                
                const apiUrl = `/api/records/weekly?startDate=${startDate}&endDate=${endDate}&recordGroupIds=${currentCheckedGroupIds.join(',')}`;
                const res = await fetch(apiUrl, { method: HttpMethod.GET });
                
                if (!res.ok) {
                    if (res.status === 401) {
                        window.location.href = '/login';
                        return;
                    }
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json();
                
                if (data && Array.isArray(data.records)) {
                    setRecords(data.records);
                } else if (data && Array.isArray(data)) {
                    setRecords(data);
                } else {
                    console.warn("Invalid records data:", data);
                    setRecords([]);
                }
            } else {
                // Monthly API 호출 로직을 직접 구현
                const currentCheckedGroupIds = getCheckedGroupIds();
                
                if (currentCheckedGroupIds.length === 0) {
                    setRecords([]);
                    return;
                }
                
                const currentDate = new Date();
                const targetMonthValue = targetMonth || month || currentDate.getMonth() + 1;
                const targetYearValue = targetYear || year || currentDate.getFullYear();
                
                const apiUrl = `/api/records/monthly?year=${targetYearValue}&month=${targetMonthValue}&recordGroupIds=${currentCheckedGroupIds.join(',')}`;
                const res = await fetch(apiUrl, { method: HttpMethod.GET });
                
                if (!res.ok) {
                    if (res.status === 401) {
                        window.location.href = '/login';
                        return;
                    }
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json();
                
                if (data && Array.isArray(data.records)) {
                    setRecords(data.records);
                } else if (data && Array.isArray(data)) {
                    setRecords(data);
                } else {
                    console.warn("Invalid records data:", data);
                    setRecords([]);
                }
            }
        } finally {
            setIsLoading(false);
        }
    }, [recordType, getCheckedGroupIds]);

    // 강제 새로고침 함수 (현재 설정으로)
    const refreshRecords = useCallback(async () => {
        await fetchRecords();
    }, [recordType, getCheckedGroupIds]);

    // 통합된 데이터 로드 useEffect
    useEffect(() => {
        // 날짜나 타입 변경 시 즉시 이전 데이터 제거 (깜빡임 방지)
        setRecords([]);
        setIsLoading(true);
        
        const accessToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];
        
        if (!accessToken) {
            // 로그인하지 않은 경우 - 샘플 데이터 로드
            const sampleRecordGroups = createSampleRecordGroups();
            const sampleRecords = createSampleRecords(sampleRecordGroups);
            
            const currentCheckedGroupIds = getCheckedGroupIds();
            
            const filteredRecords = sampleRecords.filter((record: unknown) => 
                currentCheckedGroupIds.includes((record as { recordGroup?: { id?: string } }).recordGroup?.id || '')
            ) as unknown as Record[];
            
            setRecords(filteredRecords);
        } else {
            // 로그인한 경우 - recordType에 따라 적절한 API 함수 호출
            if (recordType === 'weekly') {
                // Weekly의 경우 initialDate 기준으로 주의 시작일과 종료일 계산
                const targetDate = initialDate || new Date();
                const startOfWeek = new Date(targetDate);
                startOfWeek.setDate(targetDate.getDate() - targetDate.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                
                const startDateStr = startOfWeek.toISOString().split('T')[0];
                const endDateStr = endOfWeek.toISOString().split('T')[0];
                
                // Weekly API 호출
                const currentCheckedGroupIds = getCheckedGroupIds();
                
                if (currentCheckedGroupIds.length === 0) {
                    setRecords([]);
                    return;
                }
                
                const apiUrl = `/api/records/weekly?startDate=${startDateStr}&endDate=${endDateStr}&recordGroupIds=${currentCheckedGroupIds.join(',')}`;
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
                        console.error('Error fetching weekly records from API:', error);
                        setRecords([]);
                    });
            } else {
                // Monthly API 호출
                const currentCheckedGroupIds = getCheckedGroupIds();
                
                if (currentCheckedGroupIds.length === 0) {
                    setRecords([]);
                    return;
                }
                
                const currentDate = new Date();
                const targetMonthValue = month || currentDate.getMonth() + 1;
                const targetYearValue = year || currentDate.getFullYear();
                
                const apiUrl = `/api/records/monthly?year=${targetYearValue}&month=${targetMonthValue}&recordGroupIds=${currentCheckedGroupIds.join(',')}`;
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
                        console.error('Error fetching monthly records from API:', error);
                        setRecords([]);
                    });
            }
        }
    }, [checkedGroupIdsString, initialDate, recordType, month, year, getCheckedGroupIds, cachedSampleData, lastCacheKey]);

    // recordRefreshTrigger 변경 시 새로고침
    useEffect(() => {
        if (recordRefreshTrigger > 0) {
            refreshRecords();
        }
    }, [recordRefreshTrigger, refreshRecords]);

    return {
        records,
        isLoading,
        refreshRecords,
        fetchRecords
    };
};
