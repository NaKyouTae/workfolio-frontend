import React, {useState, useCallback, forwardRef, useImperativeHandle} from 'react'
import ListCalendar from '@/components/features/calendar/list/ListCalendar'
import CalendarHeader from '@/components/features/calendar/CalendarHeader'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import { useRecords } from '@/hooks/useRecords'
import MonthlyCalendar from '@/components/features/calendar/monthly/MonthlyCalendar'
import { CalendarViewType } from '@/models/CalendarTypes'

export interface BodyRightRef {
    refreshRecords: () => void;
}

const BodyRight = forwardRef<BodyRightRef>((props, ref) => {
    const [recordType, setRecordType] = useState<CalendarViewType>('list')
    const [searchTerm, setSearchTerm] = useState('')
    const [date, setDate] = useState<Date>(new Date())
    
    // store에서 체크된 RecordGroup 정보 가져오기
    const { getCheckedRecordGroups } = useRecordGroupStore()
    const checkedRecordGroups = getCheckedRecordGroups()
    
    // records hook 사용
    const { records, refreshRecords } = useRecords(recordType, date.getMonth() + 1, date.getFullYear())

    // ref를 통해 외부에서 refreshRecords 호출 가능하도록 설정
    useImperativeHandle(ref, () => ({
        refreshRecords: () => {
            refreshRecords();
        }
    }), [refreshRecords]);


    // 이벤트 핸들러들
    const handleTypeChange = useCallback((type: CalendarViewType) => {
        setRecordType(type)
    }, [])

    const handlePreviousMonth = useCallback(() => {
        setDate(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() - 1)
            return newDate
        })
    }, [])

    const handleNextMonth = useCallback(() => {
        setDate(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() + 1)
            return newDate
        })
    }, [])

    const handleTodayMonth = useCallback(() => {
        const today = new Date()
        setDate(today)
    }, [])

    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term)
    }, [])

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
                {recordType === 'list' ? (
                    <ListCalendar
                        initialDate={date} 
                        records={filteredRecords}
                        recordGroups={checkedRecordGroups}
                    />
                ) : recordType === 'monthly' ? (
                    <MonthlyCalendar
                        initialDate={date}
                    />
                ) : (
                    <ListCalendar
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