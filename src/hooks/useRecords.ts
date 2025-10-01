import { useState, useCallback, useEffect } from 'react';
import { Record } from '@/generated/common';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { createSampleRecordGroups, createSampleRecords, createSampleRecordsForMonthly, createSampleRecordsForWeekly } from '@/utils/sampleData';
import HttpMethod from '@/enums/HttpMethod';
import { CalendarViewType } from '@/models/CalendarTypes';

export const useRecords = (recordType: CalendarViewType = 'weekly', month?: number, year?: number) => {
    const [records, setRecords] = useState<Record[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const { getCheckedGroupIds, recordRefreshTrigger } = useRecordGroupStore();
    const checkedGroupIds = getCheckedGroupIds();
    const checkedGroupIdsString = checkedGroupIds.join(',');

    // Monthly API 데이터 로딩 함수
    const loadMonthlyApiData = useCallback(async (targetMonth?: number, targetYear?: number) => {
        try {
            const currentDate = new Date();
            const targetMonthValue = targetMonth || month || currentDate.getMonth() + 1;
            const targetYearValue = targetYear || year || currentDate.getFullYear();
            
            // 현재 체크된 RecordGroup ID 가져오기
            const currentCheckedGroupIds = getCheckedGroupIds();
            
            // 체크된 RecordGroup ID가 없으면 빈 배열 반환
            if (currentCheckedGroupIds.length === 0) {
                setRecords([]);
                return;
            }
            
            // 월간 레코드 조회
            const apiUrl = `/api/records/monthly?year=${targetYearValue}&month=${targetMonthValue}&recordGroupIds=${currentCheckedGroupIds.join(',')}`;
            
            const res = await fetch(apiUrl, { method: HttpMethod.GET });
            
            if (!res.ok) {
                if (res.status === 401) {
                    // 401 에러 시 로그인 페이지로 리다이렉트
                    window.location.href = '/login';
                    return;
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            
            if (data && Array.isArray(data.records)) {
                setRecords(data.records);
            } else if (data && Array.isArray(data)) {
                // data 자체가 배열인 경우
                setRecords(data);
            } else {
                console.warn("Invalid records data:", data);
                setRecords([]);
            }
        } catch (error) {
            console.error('Error fetching monthly records from API:', error);
            setRecords([]);
        }
    }, [getCheckedGroupIds, month, year]);

    // Weekly API 데이터 로딩 함수
    const loadWeeklyApiData = useCallback(async (startDate?: string, endDate?: string) => {
        try {
            // 현재 체크된 RecordGroup ID 가져오기
            const currentCheckedGroupIds = getCheckedGroupIds();
            
            // 체크된 RecordGroup ID가 없으면 빈 배열 반환
            if (currentCheckedGroupIds.length === 0) {
                setRecords([]);
                return;
            }
            
            // 주간 레코드 조회 - startDate와 endDate 파라미터 사용
            const apiUrl = `/api/records/weekly?startDate=${startDate}&endDate=${endDate}&recordGroupIds=${currentCheckedGroupIds.join(',')}`;
            
            const res = await fetch(apiUrl, { method: HttpMethod.GET });
            
            if (!res.ok) {
                if (res.status === 401) {
                    // 401 에러 시 로그인 페이지로 리다이렉트
                    window.location.href = '/login';
                    return;
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            
            if (data && Array.isArray(data.records)) {
                setRecords(data.records);
            } else if (data && Array.isArray(data)) {
                // data 자체가 배열인 경우
                setRecords(data);
            } else {
                console.warn("Invalid records data:", data);
                setRecords([]);
            }
        } catch (error) {
            console.error('Error fetching weekly records from API:', error);
            setRecords([]);
        }
    }, [getCheckedGroupIds]);

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
                
                const filteredRecords = sampleRecords.filter((record: Record) => 
                    currentCheckedGroupIds.includes(record.recordGroup?.id || '')
                );
                
                setRecords(filteredRecords);
                return;
            }
            
            // 로그인한 경우 - recordType에 따라 적절한 API 함수 호출
            if (recordType === 'weekly') {
                await loadWeeklyApiData(startDate, endDate);
            } else {
                await loadMonthlyApiData(targetMonth, targetYear);
            }
        } finally {
            setIsLoading(false);
        }
    }, [loadWeeklyApiData, loadMonthlyApiData, getCheckedGroupIds, recordType]);

    // 강제 새로고침 함수 (현재 설정으로)
    const refreshRecords = useCallback(async () => {
        await fetchRecords();
    }, [fetchRecords]);

    // 체크박스 변경 시 데이터 로드
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
            
            const filteredRecords = sampleRecords.filter((record: Record) => 
                currentCheckedGroupIds.includes(record.recordGroup?.id || '')
            );
            
            setRecords(filteredRecords);
        } else {
            // 로그인한 경우 - recordType에 따라 적절한 API 함수 호출
            if (recordType === 'weekly') {
                // Weekly의 경우 현재 주의 시작일과 종료일 계산
                const currentDate = new Date();
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                
                const startDateStr = startOfWeek.toISOString().split('T')[0];
                const endDateStr = endOfWeek.toISOString().split('T')[0];
                
                loadWeeklyApiData(startDateStr, endDateStr);
            } else {
                loadMonthlyApiData();
            }
        }
    }, [checkedGroupIdsString, getCheckedGroupIds, loadWeeklyApiData, loadMonthlyApiData, recordType]);

    // 레코드 조회 useEffect - month, year 변경 시에만 실행
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
            
            const filteredRecords = sampleRecords.filter((record: Record) => 
                currentCheckedGroupIds.includes(record.recordGroup?.id || '')
            );
            
            setRecords(filteredRecords);
        } else {
            // 로그인한 경우 - recordType에 따라 적절한 API 함수 호출
            if (recordType === 'weekly') {
                // Weekly의 경우 현재 주의 시작일과 종료일 계산
                const currentDate = new Date();
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                
                const startDateStr = startOfWeek.toISOString().split('T')[0];
                const endDateStr = endOfWeek.toISOString().split('T')[0];
                
                loadWeeklyApiData(startDateStr, endDateStr);
            } else {
                loadMonthlyApiData(month, year);
            }
        }
    }, [month, year, getCheckedGroupIds, loadWeeklyApiData, loadMonthlyApiData, recordType]);

    // recordRefreshTrigger 변경 시 새로고침
    useEffect(() => {
        if (recordRefreshTrigger > 0) {
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                // 로그인하지 않은 경우 - 샘플 데이터 로드
                const sampleRecordGroups = createSampleRecordGroups();
                const sampleRecords = createSampleRecords(sampleRecordGroups);
                
                const currentCheckedGroupIds = getCheckedGroupIds();
                
                const filteredRecords = sampleRecords.filter((record: Record) => 
                    currentCheckedGroupIds.includes(record.recordGroup?.id || '')
                );
                
                setRecords(filteredRecords);
            } else {
                // 로그인한 경우 - recordType에 따라 적절한 API 함수 호출
                if (recordType === 'weekly') {
                    // Weekly의 경우 현재 주의 시작일과 종료일 계산
                    const currentDate = new Date();
                    const startOfWeek = new Date(currentDate);
                    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    
                    const startDateStr = startOfWeek.toISOString().split('T')[0];
                    const endDateStr = endOfWeek.toISOString().split('T')[0];
                    
                    loadWeeklyApiData(startDateStr, endDateStr);
                } else {
                    loadMonthlyApiData(month, year);
                }
            }
        }
    }, [recordRefreshTrigger, month, year, getCheckedGroupIds, loadWeeklyApiData, loadMonthlyApiData, recordType]);

    return {
        records,
        isLoading,
        refreshRecords,
        fetchRecords,
        loadWeeklyApiData,
        loadMonthlyApiData
    };
};
