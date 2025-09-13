import dayjs from 'dayjs'
import { Record, Record_RecordType } from "../../../../../generated/common"
import { CalendarEvent, CalendarDay } from './types'
import { DateModel } from '@/app/models/DateModel'

/**
 * 캘린더 날짜들을 생성하는 함수
 */
export const generateCalendarDays = (date: DateModel): (CalendarDay | null)[] => {
    const year = date.year
    const month = date.month + 1 // DateModel의 month는 0부터 시작하므로 +1
    const firstDay = dayjs(`${year}-${month.toString().padStart(2, '0')}-01`)
    const startOfMonth = firstDay.startOf('month')
    const endOfMonth = firstDay.endOf('month')
    
    // 이전 달의 마지막 주 일요일부터 시작
    const startDate = startOfMonth.startOf('week')
    const endDate = endOfMonth.endOf('week')
    
    const days: (CalendarDay | null)[] = []
    let current = startDate
    
    while (current.isSame(endDate, 'day') || current.isBefore(endDate, 'day')) {
        if (current.isBefore(startOfMonth, 'day')) {
            days.push(null)
        } else if (current.isAfter(endOfMonth, 'day')) {
            days.push(null)
        } else {
            days.push({
                id: current.format('YYYYMMDD'),
                day: current.date(),
                isCurrentMonth: true
            })
        }
        current = current.add(1, 'day')
    }
    
    return days
}

/**
 * 이벤트의 시간 텍스트를 생성하는 함수
 */
export const generateTimeText = (record: Record): string => {
    if (Record_RecordType[record.type] === Record_RecordType.TIME.toString()) {
        const time = dayjs(Number(record.startedAt)).format('HH:mm')
        return `(${time})`
    }
    return ''
}

/**
 * 캘린더 이벤트들을 생성하는 함수
 */
export const generateCalendarEvents = (
    records: Record[] | undefined,
    checkedGroups: Set<string>
): CalendarEvent[] => {
    if (!records || records.length === 0) return []
    
    const events: CalendarEvent[] = []
    const dailyLineCounts = new Map<string, number>()
    const eventLineMap = new Map<string, number>()
    
    const sortedRecords = records
        .filter(record => record.recordGroup && checkedGroups.has(record.recordGroup.id))
        .sort((a, b) => Number(a.startedAt) - Number(b.startedAt))
    
    sortedRecords.forEach(record => {
        const startDate = dayjs(Number(record.startedAt)).format('YYYYMMDD')
        const endDate = dayjs(Number(record.endedAt)).format('YYYYMMDD')
        const isMultiDay = startDate !== endDate
        
        const timeText = generateTimeText(record)
        const displayText = timeText ? `${timeText} ${record.title}` : record.title
        
        if (isMultiDay) {
            const start = dayjs(startDate)
            const end = dayjs(endDate)
            let current = start
            let maxLinePosition = 0
            
            // 모든 날짜의 최대 라인 위치 계산
            while (current.isSame(end) || current.isBefore(end)) {
                const currentDate = current.format('YYYYMMDD')
                const currentLineCount = dailyLineCounts.get(currentDate) || 0
                maxLinePosition = Math.max(maxLinePosition, currentLineCount)
                current = current.add(1, 'day')
            }
            
            // 모든 날짜에 동일한 라인 위치 할당
            current = start
            while (current.isSame(end) || current.isBefore(end)) {
                const currentDate = current.format('YYYYMMDD')
                dailyLineCounts.set(currentDate, maxLinePosition + 1)
                current = current.add(1, 'day')
            }
            
            eventLineMap.set(record.id, maxLinePosition)
        } else {
            const currentLineCount = dailyLineCounts.get(startDate) || 0
            dailyLineCounts.set(startDate, currentLineCount + 1)
            eventLineMap.set(record.id, currentLineCount)
        }
        
        events.push({
            record,
            startDate,
            endDate,
            linePosition: eventLineMap.get(record.id) || 0,
            isMultiDay,
            displayText,
            timeText: timeText || undefined
        })
    })
    
    return events
}

/**
 * 특정 날짜의 단일일 이벤트들을 필터링하는 함수
 */
export const getSingleDayEventsForDate = (
    events: CalendarEvent[],
    dateId: string
): CalendarEvent[] => {
    return events.filter(event => !event.isMultiDay && event.startDate === dateId)
}

/**
 * 멀티데이 이벤트들을 필터링하는 함수
 */
export const getMultiDayEvents = (events: CalendarEvent[]): CalendarEvent[] => {
    return events.filter(event => event.isMultiDay)
}

/**
 * 이벤트의 border radius 클래스를 결정하는 함수
 */
export const getBorderRadiusClass = (
    isTimeType: boolean,
    weekCount: number,
    weekEndIndex: number,
    endDayIndex: number
): string => {
    if (isTimeType) return ''
    
    if (weekCount === 0) {
        return 'scheduleMultiDayStart'
    } else if (weekEndIndex === endDayIndex) {
        return 'scheduleMultiDayEnd'
    } else {
        return 'scheduleMultiDayContinue'
    }
}

/**
 * 이벤트가 다음 주로 계속되는지 확인하는 함수
 */
export const isContinuingToNextWeek = (weekEndIndex: number, endDayIndex: number): boolean => {
    return weekEndIndex < endDayIndex
}

/**
 * 이벤트가 이전 주에서 시작되었는지 확인하는 함수
 */
export const isStartingFromPreviousWeek = (weekCount: number): boolean => {
    return weekCount > 0
}

/**
 * 현재 주의 마지막 날인지 확인하는 함수
 */
export const isLastDayOfWeek = (
    currentIndex: number,
    weekEndIndex: number,
    endDayIndex: number
): boolean => {
    return (currentIndex % 7 === 6) || (weekEndIndex === endDayIndex) || (weekEndIndex % 7 === 6)
}
