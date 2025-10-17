import React, {useState, useCallback, forwardRef, useImperativeHandle, useEffect} from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ListCalendar from '@/components/features/calendar/list/ListCalendar'
import CalendarHeader from '@/components/features/calendar/CalendarHeader'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import { useRecords } from '@/hooks/useRecords'
import MonthlyCalendar from '@/components/features/calendar/monthly/MonthlyCalendar'
import WeeklyCalendar from '@/components/features/calendar/weekly/WeeklyCalendar'
import { CalendarViewType } from '@/models/CalendarTypes'

export interface BodyRightRef {
    refreshRecords: () => void;
}

const BodyRight = forwardRef<BodyRightRef>((props, ref) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    
    // URL에서 초기 상태 읽기
    const urlView = searchParams.get('view') as CalendarViewType || 'monthly'
    const urlDate = searchParams.get('date') ? new Date(searchParams.get('date')!) : new Date()
    
    const [recordType, setRecordType] = useState<CalendarViewType>(urlView)
    const [searchTerm, setSearchTerm] = useState('')
    const [date, setDate] = useState<Date>(urlDate)
    
    // store에서 체크된 RecordGroup 정보 가져오기
    const { getCheckedRecordGroups } = useRecordGroupStore()
    const checkedRecordGroups = getCheckedRecordGroups()
    
    // records hook 사용
    const { records, refreshRecords } = useRecords(recordType, date.getMonth() + 1, date.getFullYear())

    // URL 업데이트를 위한 상태
    const [pendingURLUpdate, setPendingURLUpdate] = useState<{view: CalendarViewType, date: Date} | null>(null)
    
    // URL 업데이트 함수 - 상태만 설정
    const updateURL = useCallback((newView: CalendarViewType, newDate: Date) => {
        setPendingURLUpdate({ view: newView, date: newDate })
    }, [])
    
    // useEffect로 URL 업데이트 실행
    useEffect(() => {
        if (pendingURLUpdate) {
            const params = new URLSearchParams(searchParams.toString())
            params.set('view', pendingURLUpdate.view)
            
            // 월간, 목록 캘린더의 경우 월만 변경하고 일자는 오늘 날짜로 설정
            let dateToUse = pendingURLUpdate.date
            if (pendingURLUpdate.view === 'monthly' || pendingURLUpdate.view === 'list') {
                const today = new Date()
                dateToUse = new Date(today.getFullYear(), pendingURLUpdate.date.getMonth(), today.getDate())
            }
            
            params.set('date', dateToUse.toISOString().split('T')[0])
            router.push(`?${params.toString()}`, { scroll: false })
            setPendingURLUpdate(null)
        }
    }, [pendingURLUpdate, searchParams, router])

    // ref를 통해 외부에서 refreshRecords 호출 가능하도록 설정
    useImperativeHandle(ref, () => ({
        refreshRecords: () => {
            refreshRecords();
        }
    }), [refreshRecords]);


    // 이벤트 핸들러들
    const handleTypeChange = useCallback((type: CalendarViewType) => {
        setRecordType(type)
        updateURL(type, date)
    }, [date, updateURL])

    const handlePreviousMonth = useCallback(() => {
        setDate(prev => {
            const newDate = new Date(prev)
            if (recordType === 'weekly') {
                // 주 단위로 변경 (7일 전)
                newDate.setDate(prev.getDate() - 7)
            } else {
                // 월 단위로 변경
                newDate.setMonth(prev.getMonth() - 1)
            }
            updateURL(recordType, newDate)
            return newDate
        })
    }, [recordType, updateURL])

    const handleNextMonth = useCallback(() => {
        setDate(prev => {
            const newDate = new Date(prev)
            if (recordType === 'weekly') {
                // 주 단위로 변경 (7일 후)
                newDate.setDate(prev.getDate() + 7)
            } else {
                // 월 단위로 변경
                newDate.setMonth(prev.getMonth() + 1)
            }
            updateURL(recordType, newDate)
            return newDate
        })
    }, [recordType, updateURL])

    const handleTodayMonth = useCallback(() => {
        const today = new Date()
        setDate(today)
        updateURL(recordType, today)
    }, [recordType, updateURL])

    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term)
    }, [])

    // URL 파라미터 변경 시 상태 업데이트
    useEffect(() => {
        const urlView = searchParams.get('view') as CalendarViewType
        const urlDate = searchParams.get('date')
        
        if (urlView && urlView !== recordType) {
            setRecordType(urlView)
        }
        
        if (urlDate) {
            const newDate = new Date(urlDate)
            if (newDate.getTime() !== date.getTime()) {
                setDate(newDate)
            }
        }
    }, [searchParams, recordType, date])

    // 검색 필터링된 레코드
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
                {recordType === 'monthly' ? (
                    <MonthlyCalendar
                        key={`monthly-${date.getTime()}`}
                        initialDate={date}
                    />
                ) : recordType === 'weekly' ? (
                    <WeeklyCalendar
                        key={`weekly-${date.getTime()}`}
                        initialDate={date}
                    />
                ) : (
                    <ListCalendar
                        key={`list-${date.getTime()}`}
                        initialDate={date} 
                        records={filteredRecords}
                        recordGroups={checkedRecordGroups}
                    />
                )}
            </div>
        </div>
    );
});

BodyRight.displayName = 'BodyRight';

export default BodyRight;