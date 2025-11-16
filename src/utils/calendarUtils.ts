import dayjs from 'dayjs'
import { Record, Record_RecordType } from "@/generated/common"
import { CalendarEvent, CalendarDay } from '@/models/CalendarTypes'
import { DateModel } from '@/models/DateModel'

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
            // 이전 달의 날짜
            days.push({
                id: current.format('YYYYMMDD'),
                day: current.date(),
                isCurrentMonth: false
            })
        } else if (current.isAfter(endOfMonth, 'day')) {
            // 다음 달의 날짜
            days.push({
                id: current.format('YYYYMMDD'),
                day: current.date(),
                isCurrentMonth: false
            })
        } else {
            // 현재 달의 날짜
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
 * Record 타입이 특정 Record_RecordType과 일치하는지 확인하는 함수
 */
export const isRecordType = (recordType: Record_RecordType, targetType: Record_RecordType): boolean => {
    return Record_RecordType[recordType] == targetType.toString()
}

/**
 * 이벤트의 시간 텍스트를 생성하는 함수
 */
export const generateTimeText = (record: Record): string => {
    if (isRecordType(record.type, Record_RecordType.TIME)) {
        const time = dayjs(Number(record.startedAt)).format('HH:mm')
        return `(${time})`
    }
    return ''
}

/**
 * Record 타입에 따라 표시할 시간 문자열을 반환하는 함수
 * @param record Record 객체
 * @returns 시간 표시 문자열 ('하루 종일', '오전 10:00' 등)
 */
export const formatRecordDisplayTime = (record: Record): string => {
    const startTimestamp = parseInt(record.startedAt.toString());
    const startDate = dayjs(startTimestamp);

    if (isRecordType(record.type, Record_RecordType.DAY)) return '하루 종일';
    else if (isRecordType(record.type, Record_RecordType.TIME)) return startDate.format('A hh:mm');
    else if (isRecordType(record.type, Record_RecordType.MULTI_DAY)) return '하루 종일';
    
    return '';
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
        const isMultiDay = isRecordType(record.type, Record_RecordType.MULTI_DAY)
        
        const timeText = generateTimeText(record)
        const displayText = timeText ? `${timeText} ${record.title}` : record.title
        
        if (isMultiDay) {
            const start = dayjs(startDate)
            const end = dayjs(endDate)
            let current = start
            
            // 멀티데이 이벤트의 모든 날짜에서 사용 가능한 가장 낮은 라인 찾기
            let assignedLine = 0
            let found = false
            
            // 0부터 시작해서 사용 가능한 라인 찾기
            while (!found) {
                let canUseThisLine = true
                current = start
                
                // 모든 날짜에서 이 라인이 사용 가능한지 확인
                while (current.isSame(end) || current.isBefore(end)) {
                    const currentDate = current.format('YYYYMMDD')
                    const usedLines = new Set()
                    
                    // 해당 날짜에 이미 사용된 라인들 수집
                    for (const [recordId, linePos] of eventLineMap.entries()) {
                        const event = events.find(e => e.record.id === recordId)
                        if (event && event.startDate <= currentDate && event.endDate >= currentDate) {
                            usedLines.add(linePos)
                        }
                    }
                    
                    // 현재 라인이 이미 사용 중이면 다른 라인 시도
                    if (usedLines.has(assignedLine)) {
                        canUseThisLine = false
                        break
                    }
                    current = current.add(1, 'day')
                }
                
                if (canUseThisLine) {
                    found = true
                } else {
                    assignedLine++
                }
            }
            
            // 모든 날짜에 할당된 라인 위치 업데이트
            current = start
            while (current.isSame(end) || current.isBefore(end)) {
                const currentDate = current.format('YYYYMMDD')
                const currentLineCount = dailyLineCounts.get(currentDate) || 0
                dailyLineCounts.set(currentDate, Math.max(currentLineCount, assignedLine + 1))
                current = current.add(1, 'day')
            }
            
            eventLineMap.set(record.id, assignedLine)
        } else {
            // 단일일 이벤트의 경우 해당 날짜에서 사용 가능한 가장 낮은 라인 찾기
            const usedLines = new Set()
            
            // 해당 날짜에 이미 사용된 라인들 수집
            for (const [recordId, linePos] of eventLineMap.entries()) {
                const event = events.find(e => e.record.id === recordId)
                if (event && event.startDate === startDate) {
                    usedLines.add(linePos)
                }
            }
            
            // 사용 가능한 가장 낮은 라인 찾기
            let assignedLine = 0
            while (usedLines.has(assignedLine)) {
                assignedLine++
            }
            
            dailyLineCounts.set(startDate, assignedLine + 1)
            eventLineMap.set(record.id, assignedLine)
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
 * 특정 날짜의 멀티데이 이벤트들을 필터링하는 함수
 */
export const getMultiDayEventsForDate = (
    events: CalendarEvent[],
    dateId: string
): CalendarEvent[] => {
    return events.filter(event => 
        event.isMultiDay && 
        event.startDate <= dateId && 
        event.endDate >= dateId
    )
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

/**
 * 사용 가능한 라인 위치를 찾는 함수
 */
export const findAvailableLinePosition = (
    events: CalendarEvent[],
    maxLines: number = 3
): number => {
    const usedLines = new Set(events.map(event => event.linePosition))
    
    for (let i = 0; i < maxLines; i++) {
        if (!usedLines.has(i)) {
            return i
        }
    }
    
    return maxLines // 모든 라인이 사용 중이면 다음 라인 반환
}

/**
 * 우선순위 큐 (Min Heap) 구현
 */
class PriorityQueue<T> {
    private heap: T[] = []
    private compare: (a: T, b: T) => number

    constructor(compare: (a: T, b: T) => number) {
        this.compare = compare
    }

    push(item: T): void {
        this.heap.push(item)
        this.heapifyUp(this.heap.length - 1)
    }

    pop(): T | undefined {
        if (this.heap.length === 0) return undefined
        if (this.heap.length === 1) return this.heap.pop()

        const min = this.heap[0]
        this.heap[0] = this.heap.pop()!
        this.heapifyDown(0)
        return min
    }

    peek(): T | undefined {
        return this.heap[0]
    }

    size(): number {
        return this.heap.length
    }

    private heapifyUp(index: number): void {
        if (index === 0) return

        const parentIndex = Math.floor((index - 1) / 2)
        if (this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]]
            this.heapifyUp(parentIndex)
        }
    }

    private heapifyDown(index: number): void {
        const leftChild = 2 * index + 1
        const rightChild = 2 * index + 2
        let smallest = index

        if (leftChild < this.heap.length && this.compare(this.heap[leftChild], this.heap[smallest]) < 0) {
            smallest = leftChild
        }

        if (rightChild < this.heap.length && this.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
            smallest = rightChild
        }

        if (smallest !== index) {
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]]
            this.heapifyDown(smallest)
        }
    }
}

/**
 * 통합 그리디 알고리즘을 사용한 이벤트 라인 배치
 * 단일일/멀티데이 구분 없이 모든 이벤트를 통합하여 최적 배치
 */
export const assignEventLinesUsingUnifiedGreedy = (
    events: CalendarEvent[],
    maxLines: number = 3
): Map<string, number> => {
    const lineMap = new Map<string, number>()
    
    // 시작 시간 순으로 정렬 (그리디 알고리즘의 핵심)
    const sortedEvents = [...events].sort((a, b) => {
        // 시작 날짜가 같으면 원래 linePosition으로 정렬
        if (a.startDate === b.startDate) {
            return a.linePosition - b.linePosition
        }
        return a.startDate.localeCompare(b.startDate)
    })
    
    // 각 라인의 마지막 이벤트 종료 시간을 추적하는 우선순위 큐
    // [라인 번호, 마지막 이벤트 종료 날짜]
    const lineEndTimes = new PriorityQueue<[number, string]>((a, b) => {
        // 종료 날짜가 같으면 라인 번호로 정렬
        if (a[1] === b[1]) {
            return a[0] - b[0]
        }
        return a[1].localeCompare(b[1])
    })
    
    // 초기화: 모든 라인을 사용 가능한 상태로 설정
    for (let i = 0; i < maxLines; i++) {
        lineEndTimes.push([i, '0000-00-00']) // 가장 이른 날짜로 초기화
    }
    
    // 각 이벤트에 대해 라인 배정
    for (const event of sortedEvents) {
        const [assignedLine, lastEndTime] = lineEndTimes.pop()!
        
        // 현재 이벤트의 시작 날짜가 마지막 이벤트 종료 날짜보다 크거나 같으면
        // 같은 라인을 사용할 수 있음
        if (event.startDate >= lastEndTime) {
            lineMap.set(event.record.id, assignedLine)
            // 이 라인의 마지막 이벤트 종료 시간을 업데이트
            lineEndTimes.push([assignedLine, event.endDate])
        } else {
            // 같은 라인을 사용할 수 없으면 다음 라인 사용
            lineMap.set(event.record.id, assignedLine)
            lineEndTimes.push([assignedLine, event.endDate])
        }
    }
    
    return lineMap
}

/**
 * 특정 날짜의 모든 이벤트를 통합하여 그리디 배치하는 함수
 */
export const assignEventLinesForDate = (
    singleDayEvents: CalendarEvent[],
    multiDayEvents: CalendarEvent[],
    dateId: string,
    maxLines: number = 3
): { visibleEvents: CalendarEvent[], remainingCount: number } => {
    // 해당 날짜의 멀티데이 이벤트들 필터링
    const dayMultiDayEvents = multiDayEvents.filter(event => 
        event.isMultiDay && 
        event.startDate <= dateId && 
        event.endDate >= dateId
    )
    
    // 모든 이벤트 통합
    const allEvents = [...singleDayEvents, ...dayMultiDayEvents]
    
    if (allEvents.length === 0) {
        return { visibleEvents: [], remainingCount: 0 }
    }
    
    // 시작 시간 순으로 정렬
    const sortedEvents = [...allEvents].sort((a, b) => {
        if (a.startDate === b.startDate) {
            return a.linePosition - b.linePosition
        }
        return a.startDate.localeCompare(b.startDate)
    })
    
    // 사용 가능한 라인들 (0, 1, 2)
    const availableLines = new Set<number>()
    for (let i = 0; i < maxLines; i++) {
        availableLines.add(i)
    }
    
    const visibleEvents: CalendarEvent[] = []
    const remainingEvents: CalendarEvent[] = []
    const usedLines = new Set<number>()
    
    // 각 이벤트에 대해 라인 배정
    for (const event of sortedEvents) {
        // 사용 가능한 가장 낮은 라인 찾기
        let assignedLine = -1
        for (let i = 0; i < maxLines; i++) {
            if (!usedLines.has(i)) {
                assignedLine = i
                break
            }
        }
        
        if (assignedLine !== -1) {
            // 사용 가능한 라인에 배치
            const eventWithLine = {
                ...event,
                linePosition: assignedLine
            }
            visibleEvents.push(eventWithLine)
            usedLines.add(assignedLine)
        } else {
            // 배치할 수 없는 이벤트는 남은 이벤트로 카운트
            remainingEvents.push(event)
        }
    }
    
    // 라인 순으로 정렬
    visibleEvents.sort((a, b) => a.linePosition - b.linePosition)
    
    return { 
        visibleEvents, 
        remainingCount: remainingEvents.length 
    }
}
