import { useState, useCallback, useEffect } from 'react';
import { Record } from '@/generated/common';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { createSampleRecordGroups, createSampleRecordsForMonthly, createSampleRecordsForWeekly } from '@/utils/sampleData';
import HttpMethod from '@/enums/HttpMethod';
import { CalendarViewType } from '@/models/CalendarTypes';

export const useRecords = (recordType: CalendarViewType = 'weekly', month?: number, year?: number, initialDate?: Date) => {
    const [records, setRecords] = useState<Record[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const { getCheckedGroupIds, recordRefreshTrigger } = useRecordGroupStore();
    const checkedGroupIds = getCheckedGroupIds();
    const checkedGroupIdsString = checkedGroupIds.join(',');


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
                const sampleRecordGroups = createSampleRecordGroups();
                
                // recordType에 따라 다른 샘플 데이터 사용
                const sampleRecords = recordType === 'weekly' 
                    ? createSampleRecordsForWeekly(sampleRecordGroups)
                    : createSampleRecordsForMonthly(sampleRecordGroups);
                
                const currentCheckedGroupIds = getCheckedGroupIds();
                
                const filteredRecords = sampleRecords.filter((record: unknown) => 
                    currentCheckedGroupIds.includes((record as { recordGroup?: { id?: string } }).recordGroup?.id || '')
                ) as unknown as Record[];
                
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
        const accessToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];
        
        if (!accessToken) {
            // 로그인하지 않은 경우 - 샘플 데이터 로드
            const sampleRecordGroups = createSampleRecordGroups();
            const sampleRecords = recordType === 'weekly' 
                ? createSampleRecordsForWeekly(sampleRecordGroups)
                : createSampleRecordsForMonthly(sampleRecordGroups);
            
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
    }, [checkedGroupIdsString, initialDate, recordType, month, year]);

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
