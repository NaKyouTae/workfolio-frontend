import React, {useEffect, useState, useCallback} from 'react'
import {Record, RecordGroup} from "../../../generated/common"
import MonthlyCalendarV2 from '../components/layout/MonthlyCalendarV2'
import ListCalendar from '../components/layout/ListCalendar'
import CalendarHeader from '../components/layout/CalendarHeader'
import { createSampleRecordGroups, createSampleRecords } from '../../utils/sampleData'
import HttpMethod from '../../enums/HttpMethod'

const BodyRight = () => {
    const [records, setRecords] = useState<Record[]>([])
    const [recordGroups, setRecordGroups] = useState<RecordGroup[]>([])
    const [recordType, setRecordType] = useState<'weekly' | 'monthly' | 'list'>('list')
    const [searchTerm, setSearchTerm] = useState('')
    const [date, setDate] = useState<Date>(new Date())
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    // 레코드 조회 함수
    const fetchRecords = useCallback(async (month?: number, year?: number, search?: string) => {
        setLoading(true)
        setError(null)
        
        try {
            const currentDate = new Date()
            const targetMonth = month || currentDate.getMonth() + 1
            const targetYear = year || currentDate.getFullYear()
            
            let apiUrl = `/api/records?month=${targetMonth}&year=${targetYear}`
            if (search) {
                apiUrl += `&search=${encodeURIComponent(search)}`
            }
            
            const res = await fetch(apiUrl, { method: HttpMethod.GET })
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`)
            }
            
            const data = await res.json()
            
            if (data && data.records) {
                setRecords(data.records)
            } else {
                setRecords([])
            }
        } catch (error) {
            console.error('Error fetching records:', error)
            setError('레코드를 불러오는 중 오류가 발생했습니다.')
            // 에러 발생 시 샘플 데이터 사용
            const sampleRecordGroups = createSampleRecordGroups()
            const sampleRecords = createSampleRecords(sampleRecordGroups)
            setRecordGroups(sampleRecordGroups)
            setRecords(sampleRecords)
        } finally {
            setLoading(false)
        }
    }, [])

    // 레코드 그룹 조회 함수
    const fetchRecordGroups = useCallback(async () => {
        try {
            const res = await fetch('/api/record-groups', { method: HttpMethod.GET })
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`)
            }
            
            const data = await res.json()
            
            if (data && data.recordGroups) {
                setRecordGroups(data.recordGroups)
            } else {
                // 에러 발생 시 샘플 데이터 사용
                const sampleRecordGroups = createSampleRecordGroups()
                setRecordGroups(sampleRecordGroups)
            }
        } catch (error) {
            console.error('Error fetching record groups:', error)
            // 에러 발생 시 샘플 데이터 사용
            const sampleRecordGroups = createSampleRecordGroups()
            setRecordGroups(sampleRecordGroups)
        }
    }, [])

    useEffect(() => {
        fetchRecordGroups()
        fetchRecords()
    }, [fetchRecordGroups, fetchRecords])

    // 이벤트 핸들러들
    const handleTypeChange = useCallback((type: 'weekly' | 'monthly' | 'list') => {
        setRecordType(type)
    }, [])

    const handlePreviousMonth = useCallback(() => {
        setDate(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() - 1)
            // 날짜 변경 시 해당 월의 레코드 조회
            fetchRecords(newDate.getMonth() + 1, newDate.getFullYear(), searchTerm)
            return newDate
        })
    }, [fetchRecords, searchTerm])

    const handleNextMonth = useCallback(() => {
        setDate(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() + 1)
            // 날짜 변경 시 해당 월의 레코드 조회
            fetchRecords(newDate.getMonth() + 1, newDate.getFullYear(), searchTerm)
            return newDate
        })
    }, [fetchRecords, searchTerm])

    const handleTodayMonth = useCallback(() => {
        const today = new Date()
        setDate(today)
        // 오늘로 이동 시 해당 월의 레코드 조회
        fetchRecords(today.getMonth() + 1, today.getFullYear(), searchTerm)
    }, [fetchRecords, searchTerm])

    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term)
        // 검색어 변경 시 해당 월의 레코드 조회
        fetchRecords(date.getMonth() + 1, date.getFullYear(), term)
    }, [fetchRecords, date])

    const handleAddRecordForDate = useCallback((date: Date) => {
        // TODO: 특정 날짜에 레코드 추가 로직 구현
        console.log('Add record for date:', date)
    }, [])

    const handleRecordClick = useCallback((record: Record) => {
        // TODO: 레코드 클릭 로직 구현
        console.log('Record clicked:', record)
    }, [])

    // 검색 필터링된 레코드 (API에서 이미 필터링되므로 클라이언트에서는 추가 필터링 불필요)
    const filteredRecords = records

    console.log("================")
    console.log(filteredRecords)
    console.log("================")
    
    return (
        <div style={{
            width: '100%',
            height: '97%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
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
            <div style={{ flex: 1, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        fontSize: '16px',
                        color: '#666'
                    }}>
                        로딩 중...
                    </div>
                ) : error ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        fontSize: '16px',
                        color: '#dc3545'
                    }}>
                        <div>{error}</div>
                        <button
                            onClick={() => fetchRecords(date.getMonth() + 1, date.getFullYear(), searchTerm)}
                            style={{
                                marginTop: '10px',
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            다시 시도
                        </button>
                    </div>
                ) : recordType === 'list' ? (
                    <ListCalendar
                        records={filteredRecords}
                        recordGroups={recordGroups}
                        onAddRecord={handleAddRecordForDate}
                        onRecordClick={handleRecordClick}
                    />
                ) : (
                    <MonthlyCalendarV2 
                        initialDate={date} 
                        records={filteredRecords}
                    />
                )}
            </div>
        </div>
    );
};

export default BodyRight;
