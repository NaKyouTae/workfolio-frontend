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
import { useCalendarDays } from '@/hooks/useCalendar'
import { createDateModel, DateModel } from '@/models/DateModel'

dayjs.locale('ko')
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

interface WeeklyCalendarProps {
    initialDate: Date
    records: Record[]
    recordGroups: RecordGroup[]
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
    records,
    recordGroups
}) => {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
    const [detailPosition, setDetailPosition] = useState<{top: number, left: number, width: number} | null>(null)
    const weeklyGridRef = useRef<HTMLDivElement>(null)

    const { triggerRecordRefresh } = useRecordGroupStore()


    // 컴포넌트 마운트 시 07시 위치로 스크롤
    useEffect(() => {
        if (weeklyGridRef.current) {
            // 07시까지의 높이 계산: 7시간 * 4.8rem = 33.6rem
            const scrollTop = 19.2 * 16 // rem을 px로 변환 (1rem = 16px)
            weeklyGridRef.current.scrollTop = scrollTop
        }
    }, [])

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

    // 특별한 날 이벤트 필터링 (MULTI_DAY, DAY)
    const getSpecialDayEvents = (records: Record[]) => {
        const specialDayEvents: Array<{ record: Record; dayIndex: number; colSpan: number }> = []
        
        // 현재 주의 날짜들
        const weekDays = getWeekDays(initialDate)
        const firstDayDate = dayjs(weekDays[0].date)
        const lastDayDate = dayjs(weekDays[6].date)
        
        // MULTI_DAY와 DAY 타입 레코드만 필터링
        const specialRecords = records.filter(record => {
            const isMultiDay = isRecordType(record.type, Record_RecordType.MULTI_DAY)
            const isDay = isRecordType(record.type, Record_RecordType.DAY)
            return isMultiDay || isDay
        })
        
        specialRecords.forEach(record => {
            const recordStartDate = dayjs(parseInt(record.startedAt.toString()))
            const recordEndDate = dayjs(parseInt(record.endedAt.toString()))
            
            // 일정이 현재 주와 겹치는지 확인
            const isInCurrentWeek = !(recordEndDate.isBefore(firstDayDate, 'day') || recordStartDate.isAfter(lastDayDate, 'day'))
            
            if (isInCurrentWeek) {
                let startDayIndex = 0
                let colSpan = 1
                
                // 일정이 현재 주에서 시작하는지 확인
                if (recordStartDate.isSame(firstDayDate, 'day') || recordStartDate.isAfter(firstDayDate, 'day')) {
                    // 현재 주에서 시작하는 경우
                    startDayIndex = recordStartDate.diff(firstDayDate, 'day')
                    const endDateInWeek = recordEndDate.isAfter(lastDayDate, 'day') ? lastDayDate : recordEndDate
                    colSpan = endDateInWeek.diff(recordStartDate, 'day') + 1
                } else if (recordEndDate.isSame(lastDayDate, 'day') || recordEndDate.isBefore(lastDayDate, 'day')) {
                    // 현재 주에서 끝나는 경우
                    startDayIndex = 0
                    colSpan = recordEndDate.diff(firstDayDate, 'day') + 1
                } else {
                    // 현재 주를 포함하는 경우
                    startDayIndex = 0
                    colSpan = 7
                }
                
                // colSpan이 1 이상이고 7 이하인 경우만 추가
                if (colSpan > 0 && colSpan <= 7) {
                    specialDayEvents.push({
                        record,
                        dayIndex: startDayIndex,
                        colSpan
                    })
                }
            }
        })
        return specialDayEvents
    }

    // 시간 이벤트 필터링
    const getTimedEvents = (events: WeeklyEvent[]) => {
        return events.filter(event => !event.isAllDay)
    }

    // 특정 날짜의 이벤트 필터링 (TIME 타입만)
    const getEventsForDay = (events: WeeklyEvent[], dayOfWeek: number) => {
        return events.filter(event => 
            event.dayOfWeek === dayOfWeek && 
            isRecordType(event.record.type, Record_RecordType.TIME)
        )
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

    const weekDays = getWeekDays(initialDate)
    const timeSlots = getTimeSlots()
    const allEvents = convertRecordsToEvents(records)
    const specialDayEvents = getSpecialDayEvents(records)
    const timedEvents = getTimedEvents(allEvents)

    const handleRecordClick = (record: Record, event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const calendarContainer = event.currentTarget.closest('.weekly-calendar')?.getBoundingClientRect()
        
        if (calendarContainer) {
            const viewportHeight = window.innerHeight
            const viewportWidth = window.innerWidth
            const detailHeight = 300
            const detailWidth = Math.min(400, Math.max(200, rect.width * 1.5))
            
            // 세로 위치 계산
            let top = rect.bottom - calendarContainer.top
            const spaceBelow = viewportHeight - (rect.bottom + detailHeight)
            const spaceAbove = rect.top - detailHeight
            
            if (spaceBelow < 0 && spaceAbove > 0) {
                top = rect.top - calendarContainer.top - detailHeight + 125
            }
            
            if (top < 0) {
                top = 5
            }
            
            // 가로 위치 계산
            let left = rect.left - calendarContainer.left + 445
            const spaceRight = viewportWidth - rect.left
            const spaceLeft = rect.left
            
            if (spaceRight < detailWidth && spaceLeft > detailWidth) {
                left = rect.right - calendarContainer.left - detailWidth
            }
            
            if (left < 0) {
                left = Math.max(5, (calendarContainer.width - detailWidth) / 2)
            }
            
            if (left + detailWidth > calendarContainer.width) {
                left = Math.max(5, calendarContainer.width - detailWidth - 5)
            }
            
            setDetailPosition({
                top: Math.max(5, top),
                left: Math.max(5, left),
                width: detailWidth
            })
        }
        
        setSelectedRecord(record)
        setIsDetailModalOpen(true)
    }

    const handleCloseModal = () => {
        setSelectedRecord(null)
        setDetailPosition(null)
        setIsDetailModalOpen(false)
    }

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true)
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

            {/* 특별한 날 이벤트들 */}
            <div className="special-day-events-container">
                <div className="time-labels-header">하루 종일</div>
                <div className="week-columns">
                    {weekDays.map((day, dayIndex) => (
                        <div key={dayIndex} className="day-column">
                            <div className="special-day-events">
                                {specialDayEvents
                                    .filter(event => event.dayIndex <= dayIndex && event.dayIndex + event.colSpan > dayIndex)
                                    .map((event) => (
                                        <div
                                            key={`${event.record.id}-${dayIndex}`}
                                            className={`special-day-event ${isRecordType(event.record.type, Record_RecordType.MULTI_DAY) ? 'multi-day' : 'day'}`}
                                            style={{ 
                                                backgroundColor: getRecordGroupColor(event.record.recordGroup),
                                                gridColumn: event.dayIndex === dayIndex ? `span ${event.colSpan}` : '1'
                                            }}
                                            onClick={(e) => handleRecordClick(event.record, e)}
                                        >
                                            <div className="event-title">{event.record.title}</div>
                                            <div className="event-type">
                                                {isRecordType(event.record.type, Record_RecordType.MULTI_DAY) ? '여러날' : '하루'}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
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
                        const dayEvents = getEventsForDay(timedEvents, day.dayOfWeek)
                        return (
                            <div key={dayIndex} className="day-column">
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
