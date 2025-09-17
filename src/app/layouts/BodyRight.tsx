import React, {useEffect, useState, useCallback} from 'react'
import {Record} from "../../../generated/common"
import MonthlyCalendarV2 from '../components/layout/calendar/monthly/MonthlyCalendarV2'
import ListCalendar from '../components/layout/calendar/list/ListCalendar'
import CalendarHeader from '../components/layout/calendar/CalendarHeader'
import { createSampleRecordGroups, createSampleRecords } from '../../utils/sampleData'
import HttpMethod from '../../enums/HttpMethod'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import MonthlyCalendar from '../components/layout/calendar/monthly/MonthlyCalendar'

const BodyRight = () => {
    const [records, setRecords] = useState<Record[]>([])
    const [recordType, setRecordType] = useState<'weekly' | 'monthly' | 'list'>('monthly')
    const [searchTerm, setSearchTerm] = useState('')
    const [date, setDate] = useState<Date>(new Date())
    
    // store에서 체크된 RecordGroup 정보 가져오기
    const { getCheckedGroupIds, getCheckedRecordGroups } = useRecordGroupStore()
    const checkedGroupIds = getCheckedGroupIds()
    const checkedRecordGroups = getCheckedRecordGroups()
    const checkedGroupIdsString = checkedGroupIds.join(',') // 의존성 배열용 문자열
    
    // API 데이터 로딩 함수
    const loadApiData = useCallback(async (month?: number, year?: number) => {
        try {
            const currentDate = new Date()
            const targetMonth = month || currentDate.getMonth() + 1
            const targetYear = year || currentDate.getFullYear()
            
            // 현재 체크된 RecordGroup ID 가져오기
            const currentCheckedGroupIds = getCheckedGroupIds()
            
            // 체크된 RecordGroup ID가 없으면 빈 배열 반환
            if (currentCheckedGroupIds.length === 0) {
                setRecords([])
                return
            }
            
            // recordType에 따라 다른 API URL 구성
            let apiUrl: string
            if (recordType === 'weekly') {
                // 주간 레코드 조회 (현재 주차 계산)
                const firstDay = new Date(targetYear, targetMonth - 1, 1)
                const currentWeek = Math.ceil((firstDay.getDay() + new Date().getDate()) / 7)
                apiUrl = `/api/records/weekly?year=${targetYear}&month=${targetMonth}&week=${currentWeek}&recordGroupIds=${currentCheckedGroupIds.join(',')}`
            } else {
                // 월간 레코드 조회 (기본값)
                apiUrl = `/api/records/monthly?year=${targetYear}&month=${targetMonth}&recordGroupIds=${currentCheckedGroupIds.join(',')}`
            }
            
            const res = await fetch(apiUrl, { method: HttpMethod.GET })
            
            if (!res.ok) {
                if (res.status === 401) {
                    // 401 에러 시 로그인 페이지로 리다이렉트
                    window.location.href = '/login';
                    return;
                }
                throw new Error(`HTTP error! status: ${res.status}`)
            }
            
            const data = await res.json()
            
            if (data && Array.isArray(data.records)) {
                setRecords(data.records)
            } else if (data && Array.isArray(data)) {
                // data 자체가 배열인 경우
                setRecords(data)
            } else {
                console.warn("Invalid records data:", data)
                setRecords([])
            }
        } catch (error) {
            console.error('Error fetching records from API:', error)
            setRecords([])
        }
    }, [getCheckedGroupIds, recordType])
    
    // 레코드 조회 함수 (통합)
    const fetchRecords = useCallback(async (month?: number, year?: number) => {
        // 로그인 상태 확인
        const accessToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];
        
        // 로그인하지 않은 경우 - 샘플 데이터 로드 및 필터링
        if (!accessToken) {
            const sampleRecordGroups = createSampleRecordGroups()
            const sampleRecords = createSampleRecords(sampleRecordGroups)
            
            const currentCheckedGroupIds = getCheckedGroupIds()
            
            const filteredRecords = sampleRecords.filter((record: Record) => 
                currentCheckedGroupIds.includes(record.recordGroup?.id || '')
            )
            
            setRecords(filteredRecords)
            return
        }
        
        // 로그인한 경우 - API 데이터 로딩
        await loadApiData(month, year)
    }, [loadApiData, getCheckedGroupIds])


    // 체크박스 변경 시 데이터 로드 (로그인 상태에 따라 샘플데이터 또는 API)
    useEffect(() => {
        const accessToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];
        
        if (!accessToken) {
            // 로그인하지 않은 경우 - 샘플 데이터 로드
            const sampleRecordGroups = createSampleRecordGroups()
            const sampleRecords = createSampleRecords(sampleRecordGroups)
            
            const currentCheckedGroupIds = getCheckedGroupIds()
            
            const filteredRecords = sampleRecords.filter((record: Record) => 
                currentCheckedGroupIds.includes(record.recordGroup?.id || '')
            )
            
            setRecords(filteredRecords)
        } else {
            // 로그인한 경우 - API 데이터 로드
            loadApiData()
        }
    }, [checkedGroupIdsString, getCheckedGroupIds, loadApiData]) // 체크박스 변경 시에만 실행

    // 레코드 조회 useEffect - 의존성 배열 수정
    useEffect(() => {
        fetchRecords()
    }, [fetchRecords]) // fetchRecords 변경 시 자동 리로드


    // 이벤트 핸들러들
    const handleTypeChange = useCallback((type: 'weekly' | 'monthly' | 'list') => {
        setRecordType(type)
        // recordType 변경 시 자동으로 데이터 다시 로드 (useEffect에서 처리됨)
    }, [])

    const handlePreviousMonth = useCallback(() => {
        setDate(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() - 1)
            // 날짜 변경 시 해당 월의 레코드 조회
            fetchRecords(newDate.getMonth() + 1, newDate.getFullYear())
            return newDate
        })
    }, [fetchRecords])

    const handleNextMonth = useCallback(() => {
        setDate(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() + 1)
            // 날짜 변경 시 해당 월의 레코드 조회
            fetchRecords(newDate.getMonth() + 1, newDate.getFullYear())
            return newDate
        })
    }, [fetchRecords])

    const handleTodayMonth = useCallback(() => {
        const today = new Date()
        setDate(today)
        // 오늘로 이동 시 해당 월의 레코드 조회
        fetchRecords(today.getMonth() + 1, today.getFullYear())
    }, [fetchRecords])

    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term)
        // 검색어는 UI에서만 사용하고 API 호출에는 영향 없음
    }, [])

    const handleAddRecordForDate = useCallback((date: Date) => {
        // TODO: 특정 날짜에 레코드 추가 로직 구현
        console.log('Add record for date:', date)
    }, [])

    const handleRecordClick = useCallback((record: Record) => {
        // TODO: 레코드 클릭 로직 구현
        console.log('Record clicked:', record)
    }, [])

    // 검색 필터링된 레코드 (API에서 이미 필터링되므로 클라이언트에서는 추가 필터링 불필요)
    const filteredRecords = Array.isArray(records) ? records : []
    
    return (
        <div className="contents">
            {/* CalendarHeader - 상위에 위치 */}
            <CalendarHeader 
                date={date}
                recordType={recordType}
                onTypeChange={handleTypeChange}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
                onTodayMonth={handleTodayMonth}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
            />
            
            {/* Calendar - 하위에 위치, 토글에 따라 변경 */}
            <div className="calendar-wrap">
                {recordType === 'list' ? (
                    <ListCalendar
                        initialDate={date} 
                        records={filteredRecords}
                        recordGroups={checkedRecordGroups}
                        onAddRecord={handleAddRecordForDate}
                        onRecordClick={handleRecordClick}
                    />
                ) : recordType === 'monthly' ? (
                    <MonthlyCalendarV2 
                        initialDate={date} 
                        records={filteredRecords}
                    />
                ) : (
                    <MonthlyCalendar 
                        initialDate={date} 
                        records={filteredRecords}
                    />
                )}
            </div>
        </div>
    );
};

export default BodyRight;
