import React, { useState, useEffect, useRef } from 'react'
import { Record, Record_RecordType, RecordGroup } from '@/generated/common'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import timezone from 'dayjs/plugin/timezone'
import RecordDetail from '../../modal/RecordDetail'
import RecordUpdateModal from '../../modal/RecordUpdateModal'
import RecordCreateModal from '../../modal/RecordCreateModal'
import HttpMethod from '@/enums/HttpMethod'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import { isRecordType } from '@/utils/calendarUtils'
import { CalendarDay } from '@/models/CalendarTypes'

dayjs.locale('ko')
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

interface WeeklyCalendarProps {
    initialDate: Date
    records: Record[]
}

interface WeeklyEvent {
    record: Record
    startTime: string
    endTime: string
    duration: number // minutes
    dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
    isAllDay: boolean
    color: string
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ 
    initialDate,
    records
}) => {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
    const [detailPosition, setDetailPosition] = useState<{top: number, left: number, width: number} | null>(null)
    const [clickedElement, setClickedElement] = useState<HTMLElement | null>(null)
    const [currentTime, setCurrentTime] = useState(new Date())
    
    // 현재 시간 업데이트 (1분마다)
    useEffect(() => {
        const updateCurrentTime = () => {
            setCurrentTime(new Date())
        }
        
        const interval = setInterval(updateCurrentTime, 60000) // 1분마다 업데이트
        
        return () => clearInterval(interval)
    }, [])

    // 스크롤 이벤트로 모달 위치 업데이트
    useEffect(() => {
        const handleScroll = () => {
            if (clickedElement && isDetailModalOpen) {
                const rect = clickedElement.getBoundingClientRect()
                const calendarContainer = clickedElement.closest('.weekly-calendar')?.getBoundingClientRect()
                
                if (calendarContainer) {
                    const detailWidth = Math.min(400, Math.max(200, rect.width * 1.5))
                    const detailHeight = 300
                    const viewportHeight = window.innerHeight
                    
                    // 화면 하단 여백 체크
                    const spaceBelow = viewportHeight - (rect.bottom + detailHeight)
                    const spaceAbove = rect.top - detailHeight
                    
                    let top
                    
                    // 하단에 공간이 부족하고 위쪽에 공간이 있으면 위에 표시
                    if (spaceBelow < 0 && spaceAbove > 0) {
                        top = rect.top - calendarContainer.top - detailHeight + 120
                    } else {
                        // 기본적으로 하단에 표시
                        top = rect.bottom - calendarContainer.top
                    }
                    
                    // 가로 위치: 화면 경계 내에서 중앙 정렬
                    let left = rect.left - calendarContainer.left + (rect.width / 2) - (detailWidth / 2)
                    
                    // 화면 왼쪽 경계 체크
                    if (left < 0) {
                        left = 10
                    }
                    
                    // 화면 오른쪽 경계 체크
                    if (left + detailWidth > calendarContainer.width) {
                        left = calendarContainer.width - detailWidth - 60
                    }
                    
                    left = Math.max(10, left)
                    
                    setDetailPosition({
                        top: Math.max(5, top),
                        left: left,
                        width: detailWidth
                    })
                }
            }
        }

        const gridElement = weeklyGridRef.current
        if (gridElement) {
            gridElement.addEventListener('scroll', handleScroll)
            return () => gridElement.removeEventListener('scroll', handleScroll)
        }
    }, [clickedElement, isDetailModalOpen])
    
    const weeklyGridRef = useRef<HTMLDivElement>(null)

    const { triggerRecordRefresh } = useRecordGroupStore()
    
    // initialDate 기준으로 현재 주 데이터만 추출
    const currentWeekStart = dayjs(initialDate).startOf('week')
    const currentWeekDays = Array.from({ length: 7 }, (_, i) => {
        const day = currentWeekStart.add(i, 'day')
        return {
            id: `day-${i}`,
            day: day.date(),
            isCurrentMonth: day.month() === initialDate.getMonth(),
            date: day.toDate()
        }
    })
    
    // weeks에 현재 주 데이터만 넣기
    const weeks: (CalendarDay & { date: Date } | null)[][] = [currentWeekDays]

    // renderRecords 함수 - MonthlyCalendar 스타일
    const renderRecords = (week: (CalendarDay & { date: Date } | null)[]) => {
        // 현재 주의 모든 일정을 수집
        const weekRecords: Array<{
            record: Record;
            startDayIndex: number;
            colSpan: number;
        }> = []

        week.forEach((day, dayIndex) => {
            if (!day) return

            const dayDate = dayjs(day.date)

            const filtedRecords = records.filter(record => isRecordType(record.type, Record_RecordType.MULTI_DAY) || isRecordType(record.type, Record_RecordType.DAY))

            // 해당 날짜의 레코드 필터링 (MULTI_DAY, DAY 타입만)
            const dayRecords = filtedRecords.filter(record => {
                const recordStartDate = dayjs(parseInt(record.startedAt.toString()))
                const recordEndDate = dayjs(parseInt(record.endedAt.toString()))

                // MULTI_DAY, DAY 타입만 필터링
                const isSpecialType = isRecordType(record.type, Record_RecordType.MULTI_DAY) || 
                                    isRecordType(record.type, Record_RecordType.DAY)

                // 일정이 해당 날짜를 포함하는지 확인
                const isInDate = (dayDate.isAfter(recordStartDate, 'day') || dayDate.isSame(recordStartDate, 'day')) &&
                               (dayDate.isBefore(recordEndDate, 'day') || dayDate.isSame(recordEndDate, 'day'))

                return isSpecialType && isInDate
            })

            dayRecords.forEach(record => {
                const recordStartDate = dayjs(parseInt(record.startedAt.toString()))
                const recordEndDate = dayjs(parseInt(record.endedAt.toString()))
                
                // 일정이 시작되는 날짜인지 확인
                const isStartDate = dayDate.isSame(recordStartDate, 'day')
                
                if (isStartDate) {
                    // 일정이 현재 주에서 몇 일 동안 지속되는지 계산
                    let colSpan = 1
                    
                    // 현재 주의 마지막 날짜
                    const lastDayOfWeek = week.findLast(day => day !== null)
                    const lastDayDate = lastDayOfWeek ? dayjs(lastDayOfWeek.date) : dayDate
                    
                    // 일정이 현재 주에서 끝나는지 확인
                    const endsInCurrentWeek = recordEndDate.isSame(lastDayDate, 'day') || recordEndDate.isBefore(lastDayDate, 'day')
                    
                    if (endsInCurrentWeek) {
                        // 현재 주에서 끝나는 경우
                        colSpan = recordEndDate.diff(recordStartDate, 'day') + 1
                    } else {
                        // 다음 주로 이어지는 경우
                        colSpan = lastDayDate.diff(recordStartDate, 'day') + 1
                        colSpan = Math.min(colSpan, 7 - dayIndex)
                    }

                    // colSpan이 1 이상인 경우만 추가
                    if (colSpan > 0) {
                        weekRecords.push({
                            record,
                            startDayIndex: dayIndex,
                            colSpan
                        })
                    }
                } else {
                    // 일정이 현재 주 이전에 시작되어 현재 주에서 계속되는 경우
                    const firstDayOfWeek = week.find(day => day !== null)
                    const firstDayDate = firstDayOfWeek ? dayjs(firstDayOfWeek.date) : dayDate
                    
                    const startedBeforeCurrentWeek = recordStartDate.isBefore(firstDayDate, 'day')
                    const endsInOrAfterCurrentWeek = recordEndDate.isSame(firstDayDate, 'day') || recordEndDate.isAfter(firstDayDate, 'day')
                    
                    // 중복 체크
                    const alreadyExists = weekRecords.some(existing => existing.record.id === record.id)
                    
                    if (startedBeforeCurrentWeek && endsInOrAfterCurrentWeek && !alreadyExists) {
                        const lastDayOfWeek = week.findLast(day => day !== null)
                        const lastDayDate = lastDayOfWeek ? dayjs(lastDayOfWeek.date) : dayDate
                        
                        const endsInCurrentWeek = recordEndDate.isSame(lastDayDate, 'day') || recordEndDate.isBefore(lastDayDate, 'day')
                        
                        let colSpan = 1
                        if (endsInCurrentWeek) {
                            colSpan = recordEndDate.diff(firstDayDate, 'day') + 1
                        } else {
                            colSpan = lastDayDate.diff(firstDayDate, 'day') + 1
                        }
                        
                        if (colSpan > 0) {
                            weekRecords.push({
                                record,
                                startDayIndex: 0,
                                colSpan
                            })
                        }
                    }
                }
            })
        })

        // 일정들을 시작일 순으로 정렬
        weekRecords.sort((a, b) => a.startDayIndex - b.startDayIndex)

        // 최대 5개의 행을 생성
        const maxRows = 5
        const rows = []

        // 일정들을 행별로 그룹화
        const rowGroups: Array<Array<{ record: Record; startDayIndex: number; colSpan: number }>> = []
        
        for (let i = 0; i < weekRecords.length; i++) {
            const item = weekRecords[i]
            let placed = false
            
            // 기존 행들 중에 배치할 수 있는 곳 찾기
            for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
                if (!rowGroups[rowIndex]) {
                    rowGroups[rowIndex] = []
                }
                
                // 현재 행에 추가할 수 있는지 확인 (겹치는지 체크)
                let canAddToCurrentRow = true
                for (const existingItem of rowGroups[rowIndex]) {
                    const existingEnd = existingItem.startDayIndex + existingItem.colSpan - 1
                    const newEnd = item.startDayIndex + item.colSpan - 1
                    
                    if (!(newEnd < existingItem.startDayIndex || item.startDayIndex > existingEnd)) {
                        canAddToCurrentRow = false
                        break
                    }
                }
                
                if (canAddToCurrentRow) {
                    rowGroups[rowIndex].push(item)
                    placed = true
                    break
                }
            }
            
            // 배치할 수 없으면 첫 번째 빈 행에 추가
            if (!placed) {
                for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
                    if (!rowGroups[rowIndex]) {
                        rowGroups[rowIndex] = []
                    }
                    if (rowGroups[rowIndex].length === 0) {
                        rowGroups[rowIndex].push(item)
                        break
                    }
                }
            }
        }

        // 행 그룹들을 렌더링
        for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
            const rowItems = rowGroups[rowIndex] || []
            
            if (rowItems.length === 0) {
                // 빈 행
                rows.push(
                    <tr key={`empty-row-${rowIndex}`} style={{ height: '18px' }}>
                        {Array.from({ length: 7 }, (_, j) => (
                            <td key={`empty-${j}`} className="record"></td>
                        ))}
                    </tr>
                )
            } else {
                // 일정이 있는 행
                const cells = []
                let currentDay = 0
                
                while (currentDay < 7) {
                    const item = rowItems.find(item => item.startDayIndex === currentDay)
                    
                    if (item) {
                        cells.push(
                            <td key={currentDay} colSpan={item.colSpan} className="record">
                                <p
                                    style={{ backgroundColor: getRecordGroupColor(item.record.recordGroup) }}
                                    onClick={(e) => handleRecordClick(item.record, e)}
                                >
                                    {item.record.title}
                                </p>
                            </td>
                        )
                        currentDay += item.colSpan // colSpan만큼 건너뛰기
                    } else {
                        cells.push(<td key={currentDay} className="record"></td>)
                        currentDay++
                    }
                }
                
                rows.push(<tr key={`row-${rowIndex}`}>{cells}</tr>)
            }
        }

        return rows
    }




    // 컴포넌트 마운트 시 currentTime 위치로 스크롤
    useEffect(() => {
        if (weeklyGridRef.current) {
            const now = dayjs(currentTime)
            const hours = now.hour()
            const minutes = now.minute()
            const totalMinutes = hours * 60 + minutes
            
            // currentTime 위치 계산 (1시간 = 4.8rem, 30분 = 2.4rem)
            const hourSlot = Math.floor(totalMinutes / 60) * 4.8
            const minuteOffset = (totalMinutes % 60) * (2.4 / 30)
            const currentTimePosition = hourSlot + minuteOffset
            
            // 화면 높이 계산 (대략 24시간 * 4.8rem = 115.2rem)
            const totalHeight = 24 * 4.8
            const viewportHeight = 40 // 대략적인 뷰포트 높이 (rem 단위)
            
            // 현재 시간을 화면 중앙에 오도록 계산
            let scrollTop = currentTimePosition - (viewportHeight / 2)
            
            // 너무 이른 시간 (0-6시)일 때는 맨 위로
            if (hours < 6) {
                scrollTop = 0
            }
            // 너무 늦은 시간 (18-23시)일 때는 맨 아래로
            else if (hours >= 18) {
                scrollTop = totalHeight - viewportHeight
            }
            // 그 외에는 중앙에 배치
            else {
                scrollTop = Math.max(0, Math.min(scrollTop, totalHeight - viewportHeight))
            }
            
            weeklyGridRef.current.scrollTop = scrollTop * 16 // rem을 px로 변환
        }
    }, [currentTime])

    // 주간 날짜 생성 (일요일부터 토요일까지)
    const getWeekDays = (date: Date) => {
        const startOfWeek = dayjs(date).startOf('week')
        return Array.from({ length: 7 }, (_, i) => {
            const day = startOfWeek.add(i, 'day')
            return {
                date: day.toDate(),
                dayOfWeek: day.day(),
                displayDate: day.format('D'),
                displayDay: day.format('ddd'),
                isToday: day.isSame(dayjs(), 'day')
            }
        })
    }

    // 시간 슬롯 생성 (00:00부터 23:00까지)
    const getTimeSlots = () => {
        const slots = []
        for (let hour = 0; hour <= 23; hour++) {
            const time = dayjs().hour(hour).minute(0)
            slots.push({
                hour,
                displayTime: time.format('A hh:mm'),
                isAM: hour < 12,
                subSlots: [
                    { minute: 0, displayTime: time.format('A hh:mm') },
                    { minute: 30, displayTime: time.add(30, 'minute').format('A hh:mm') }
                ]
            })
        }
        return slots
    }

    // 레코드 그룹 색상 매핑
    const getRecordGroupColor = (recordGroup: RecordGroup | undefined) => {
        if (!recordGroup) return '#e0e0e0'
        return recordGroup.color || '#e0e0e0'
    }

    // 레코드를 주간 이벤트로 변환
    const convertRecordsToEvents = (records: Record[]): WeeklyEvent[] => {
        return records.map(record => {
            const startTimestamp = parseInt(record.startedAt.toString())
            const endTimestamp = parseInt(record.endedAt.toString())
            const startDate = dayjs(startTimestamp)
            const endDate = dayjs(endTimestamp)
            
            const isAllDay = isRecordType(record.type, Record_RecordType.DAY) || 
                            isRecordType(record.type, Record_RecordType.MULTI_DAY)
            
            return {
                record,
                startTime: startDate.format('HH:mm'),
                endTime: endDate.format('HH:mm'),
                duration: endDate.diff(startDate, 'minute'),
                dayOfWeek: startDate.day(),
                isAllDay,
                color: getRecordGroupColor(record.recordGroup)
            }
        })
    }


    // 시간 이벤트 필터링
    const getTimedEvents = (events: WeeklyEvent[]) => {
        return events.filter(event => !event.isAllDay)
    }

    // 특정 날짜의 이벤트 필터링 (TIME 타입만)
    const getEventsForDay = (events: WeeklyEvent[]) => {
        return events.filter(event => isRecordType(event.record.type, Record_RecordType.TIME))
    }

    // 이벤트가 특정 30분 슬롯에 속하는지 확인 (날짜도 비교)
    const isEventInSubSlot = (event: WeeklyEvent, slotHour: number, subSlotMinute: number, dayOfWeek: number) => {
        // TIME 타입이 아니면 false
        if (!isRecordType(event.record.type, Record_RecordType.TIME)) {
            return false
        }
        
        // 날짜가 맞지 않으면 false
        if (event.dayOfWeek !== dayOfWeek) {
            return false
        }
        
        // 시간이 해당 슬롯에 속하는지 확인
        const [eventHours, eventMinutes] = event.startTime.split(':').map(Number)
        return eventHours === slotHour && eventMinutes >= subSlotMinute && eventMinutes < subSlotMinute + 30
    }

    // 이벤트 위치 계산 (시간 기반) - 30분에 2.4rem
    const calculateEventPosition = (event: WeeklyEvent, slotHour: number, subSlotMinute: number) => {
        const [hours, minutes] = event.startTime.split(':').map(Number)
        const totalMinutes = hours * 60 + minutes
        const slotStartMinutes = slotHour * 60 + subSlotMinute
        const minutesFromSlotStart = totalMinutes - slotStartMinutes
        const top = (minutesFromSlotStart / 30) * 2.4 // 30분에 2.4rem
        const height = Math.max((event.duration / 30) * 2.4, 0.8) // 최소 0.8rem (20px)
        
        return { top, height }
    }

    // 현재 시간 표시선 위치 계산
    const calculateCurrentTimePosition = () => {
        const now = dayjs(currentTime)
        const currentWeekStart = dayjs(initialDate).startOf('week')
        const currentWeekEnd = dayjs(initialDate).endOf('week')
        
        // 현재 시간이 이번 주에 속하는지 확인
        if (now.isBefore(currentWeekStart) || now.isAfter(currentWeekEnd)) {
            return null
        }
        
        const hours = now.hour()
        const minutes = now.minute()
        const totalMinutes = hours * 60 + minutes
        
        // 시간 슬롯 구조에 맞는 정확한 계산
        // 1시간 = 4.8rem, 30분 = 2.4rem
        // 각 시간 슬롯의 시작점에서 현재 시간까지의 거리 계산
        const hourSlot = Math.floor(totalMinutes / 60) * 4.8 // 시간 슬롯 시작점
        const minuteOffset = (totalMinutes % 60) * (2.4 / 30) // 30분 단위 내에서의 분 오프셋
        
        const top = hourSlot + minuteOffset
        
        return {
            top,
            isVisible: true
        }
    }

    const weekDays = getWeekDays(initialDate)
    const timeSlots = getTimeSlots()
    const allEvents = convertRecordsToEvents(records)
    const timedEvents = getTimedEvents(allEvents)
    const currentTimePosition = calculateCurrentTimePosition()

    const handleRecordClick = (record: Record, event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const calendarContainer = event.currentTarget.closest('.weekly-calendar')?.getBoundingClientRect()
        
        if (calendarContainer) {
            const detailWidth = Math.min(400, Math.max(200, rect.width * 1.5))
            const detailHeight = 300
            const viewportHeight = window.innerHeight
            
            // 화면 하단 여백 체크 (레코드 하단 + 모달 높이)
            const spaceBelow = viewportHeight - (rect.bottom + detailHeight)
            const spaceAbove = rect.top - detailHeight
            
            let top
            
            // 하단에 공간이 부족하고 위쪽에 공간이 있으면 위에 표시
            if (spaceBelow < 0 && spaceAbove > 0) {
                top = rect.top - calendarContainer.top - detailHeight + 120
            } else {
                // 기본적으로 하단에 표시
                top = rect.bottom - calendarContainer.top
            }
            
            // 가로 위치: 화면 경계 내에서 중앙 정렬
            let left = rect.left - calendarContainer.left + (rect.width / 2) - (detailWidth / 2)
            
            // 화면 왼쪽 경계 체크
            if (left < 0) {
                left = 10 // 왼쪽 여백 10px
            }
            
            // 화면 오른쪽 경계 체크
            if (left + detailWidth > calendarContainer.width) {
                left = calendarContainer.width - detailWidth - 60 // 오른쪽 여백 60px
            }
            
            // 최소 위치 보장 (왼쪽 여백)
            left = Math.max(10, left)
            
            setDetailPosition({
                top: Math.max(5, top),
                left: left,
                width: detailWidth
            })
        }
        
        setSelectedRecord(record)
        setClickedElement(event.currentTarget)
        setIsDetailModalOpen(true)
    }

    const handleCloseModal = () => {
        setSelectedRecord(null)
        setDetailPosition(null)
        setClickedElement(null)
        setIsDetailModalOpen(false)
    }


    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false)
    }

    const handleOpenUpdateModal = () => {
        setIsDetailModalOpen(false)
        setIsUpdateModalOpen(true)
    }

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false)
        setSelectedRecord(null)
        setClickedElement(null)
    }

    const handleDeleteRecord = async () => {
        if (!selectedRecord) return;
        
        try {
            const response = await fetch(`/api/records/${selectedRecord.id}`, {
                method: HttpMethod.DELETE,
            });
            
            if (response.ok) {
                handleCloseModal();
                triggerRecordRefresh();
            } else {
                console.error('Failed to delete record');
            }
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    }

    return (
        <div className="weekly-calendar">
            {/* 날짜 헤더 */}
            <div className="day-headers">
                <div className="time-labels-header">구분</div>
                <div className="week-columns">
                    {weekDays.map((day, dayIndex) => (
                        <div key={dayIndex} className="day-column">
                            <div className={`day-header ${day.isToday ? 'today' : ''} ${day.dayOfWeek === 0 ? 'sunday' : ''}`}>
                                <div className="day-number">{day.displayDate}({day.displayDay})</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 특별한 날 이벤트들 - MonthlyCalendar 스타일 */}
            <div className="weekly-days">
                <div className="time-labels-header">하루 종일</div>
                <div className="calendar-wrap">
                    <div className="days">
                        {weeks.map((week, weekIndex) => (
                            <div className="weekly" key={weekIndex}>
                                <table>
                                    <tbody>
                                        {renderRecords(week)}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 주간 그리드 */}
            <div className="weekly-grid" ref={weeklyGridRef}>
                {/* 시간 라벨 */}
                <div className="time-labels">
                    {timeSlots.map((slot, index) => (
                        <div key={index} className="time-label">
                            {slot.displayTime}
                        </div>
                    ))}
                </div>

                {/* 주간 컬럼들 */}
                <div className="week-columns">
                    {weekDays.map((day, dayIndex) => {
                        const dayEvents = getEventsForDay(timedEvents)
                        return (
                            <div key={dayIndex} className="day-column">
                                {/* 현재 시간 표시선 - 각 컬럼에 표시 */}
                                {currentTimePosition && (
                                    <div 
                                        className="current-time-line-column"
                                        style={{
                                            top: `${currentTimePosition.top}rem`
                                        }}
                                    />
                                )}
                                
                                {/* 시간 슬롯들 */}
                                <div className="time-slots">
                                    {timeSlots.map((slot, slotIndex) => (
                                        <div key={slotIndex} className="time-slot">
                                            {/* 30분 단위 서브 슬롯들 */}
                                            {slot.subSlots.map((subSlot, subIndex) => (
                                                <div key={subIndex} className="sub-slot">
                                                    {/* 이벤트 렌더링 */}
                                                    {dayEvents.map((event, eventIndex) => {
                                                        if (isEventInSubSlot(event, slot.hour, subSlot.minute, day.dayOfWeek)) {
                                                            const position = calculateEventPosition(event, slot.hour, subSlot.minute)
                                                            return (
                                                                <div
                                                                    key={eventIndex}
                                                                    className="timed-event"
                                                                    style={{
                                                                        top: `${position.top}rem`,
                                                                        height: `${position.height}rem`,
                                                                        backgroundColor: event.color
                                                                    }}
                                                                    onClick={(e) => handleRecordClick(event.record, e)}
                                                                >
                                                                    <div className="event-title">{event.record.title}</div>
                                                                    <div className="event-time">
                                                                        {event.startTime} - {event.endTime}
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        return null
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* 레코드 상세 모달 */}
            <RecordDetail
                isOpen={isDetailModalOpen}
                onClose={handleCloseModal}
                record={selectedRecord}
                onEdit={handleOpenUpdateModal}
                onDelete={handleDeleteRecord}
                position={detailPosition || undefined}
            />

            {/* RecordUpdateModal */}
            <RecordUpdateModal
                isOpen={isUpdateModalOpen}
                onClose={handleCloseUpdateModal}
                onDelete={handleDeleteRecord}
                record={selectedRecord}
            />

            {/* RecordCreateModal */}
            <RecordCreateModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
            />
        </div>
    )
}

export default WeeklyCalendar
