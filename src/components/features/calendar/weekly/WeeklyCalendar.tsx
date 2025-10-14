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
import { useRecords } from '@/hooks/useRecords'
import { isRecordType } from '@/utils/calendarUtils'
import { CalendarDay } from '@/models/CalendarTypes'

dayjs.locale('ko')
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

interface WeeklyCalendarProps {
    initialDate: Date
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
    initialDate
}) => {
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

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
    const [detailPosition, setDetailPosition] = useState<{top: number, left?: number, right?: number, width: number} | null>(null)
    const [clickedElement, setClickedElement] = useState<HTMLElement | null>(null)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [weekDays, setWeekDays] = useState(() => getWeekDays(initialDate))
    
    // initialDate가 변경될 때 weekDays 업데이트
    useEffect(() => {
        setWeekDays(getWeekDays(initialDate))
    }, [initialDate])
    
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
                    
                    // 가로 위치: record의 좌측 기준선과 동일하게 위치
                    let left = rect.left - calendarContainer.left
                    
                    // weekly-calendar 컨테이너 경계 체크
                    const containerRight = calendarContainer.width
                    const minLeft = 20
                    
                    // 컨테이너 왼쪽 경계 체크
                    if (left < minLeft) {
                        left = minLeft
                    }
                    
                    // 오른쪽 영역을 넘어가는지 체크
                    const isOverflowingRight = left + detailWidth > containerRight - 150
                    
                    if (isOverflowingRight) {
                        // 오른쪽 영역을 넘어가면 record의 우측 기준선과 일치
                        const recordRight = rect.right - calendarContainer.left
                        setDetailPosition({
                            top: Math.max(5, top),
                            right: containerRight - recordRight,
                            width: detailWidth
                        })
                    } else {
                        // 정상 범위면 record의 좌측 기준선과 일치
                        setDetailPosition({
                            top: Math.max(5, top),
                            left: left,
                            width: detailWidth
                        })
                    }
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
    const { records } = useRecords('weekly', undefined, undefined, initialDate)
    
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

    // 시간 이벤트 필터링 (현재 주 범위 내의 이벤트만)
    const getTimedEvents = (events: WeeklyEvent[]) => {
        const currentWeekStart = dayjs(initialDate).startOf('week')
        const currentWeekEnd = dayjs(initialDate).endOf('week')
        
        return events.filter(event => {
            const eventDate = dayjs(event.record.startedAt)
            // 현재 주 범위 내의 이벤트만 필터링
            return !event.isAllDay && 
                   (eventDate.isAfter(currentWeekStart, 'day') || eventDate.isSame(currentWeekStart, 'day')) && 
                   (eventDate.isBefore(currentWeekEnd, 'day') || eventDate.isSame(currentWeekEnd, 'day'))
        })
    }

    // 현재 시간 표시선 위치 계산
    const calculateCurrentTimePosition = () => {
        const now = dayjs(currentTime)
        
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

    const timeSlots = getTimeSlots()
    const allEvents = convertRecordsToEvents(records)
    const timedEvents = getTimedEvents(allEvents)
    const currentTimePosition = calculateCurrentTimePosition()
    
    // records가 변경될 때 이벤트 데이터 업데이트
    useEffect(() => {
        // records 변경 시 자동으로 리렌더링됨
    }, [records])

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
            
            // 가로 위치: record의 좌측 기준선과 동일하게 위치
            let left = rect.left - calendarContainer.left
            
            // weekly-calendar 컨테이너 경계 체크
            const containerRight = calendarContainer.width
            const minLeft = 20
            
            // 컨테이너 왼쪽 경계 체크
            if (left < minLeft) {
                left = minLeft
            }
            
            // 세로 위치도 컨테이너 경계 체크
            const containerTop = 0
            const containerBottom = calendarContainer.height
            
            // 컨테이너 상단 경계 체크
            if (top < containerTop) {
                top = 10
            }
            
            // 컨테이너 하단 경계 체크
            if (top + detailHeight > containerBottom) {
                top = containerBottom - detailHeight - 10
            }
            
            // 최소 위치 보장 (컨테이너 내부)
            top = Math.max(10, Math.min(top, containerBottom - detailHeight - 10))
            
            // 오른쪽 영역을 넘어가는지 체크
            const isOverflowingRight = left + detailWidth > containerRight - 150
            
            if (isOverflowingRight) {
                // 오른쪽 영역을 넘어가면 record의 우측 기준선과 일치
                const recordRight = rect.right - calendarContainer.left
                setDetailPosition({
                    top: top,
                    right: containerRight - recordRight,
                    width: detailWidth
                })
            } else {
                // 정상 범위면 record의 좌측 기준선과 일치
            setDetailPosition({
                    top: top,
                    left: left,
                width: detailWidth
            })
            }
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
        setDetailPosition(null)
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
                        // 각 요일에 해당하는 이벤트들만 필터링 (날짜 기반)
                        const dayEvents = timedEvents.filter(event => {
                            const eventDate = dayjs(event.record.startedAt)
                            const dayDate = dayjs(day.date)
                            // 정확한 날짜 비교 (년월일)
                            return eventDate.isSame(dayDate, 'day')
                        })
                        return (
                            <div key={dayIndex} className="day-column">
                                {/* 현재 시간 표시선 - 각 컬럼에 표시 */}
                                <div 
                                    className="current-time-line-column"
                                    style={{
                                        top: `${currentTimePosition.top}rem`
                                    }}
                                />
                                
                                {/* 시간 슬롯들 */}
                                <div className="time-slots">
                                    {timeSlots.map((slot, slotIndex) => (
                                        <div key={slotIndex} className="time-slot">
                                            {/* 30분 단위 서브 슬롯들 */}
                                            {slot.subSlots.map((subSlot, subIndex) => (
                                                <div key={subIndex} className="sub-slot">
                                                    {/* 빈 sub-slot 구조 */}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                
                                {/* 이벤트들을 그룹화하여 배치 - 각 요일에 해당하는 일정만 */}
                                <div className="events-slots">
                                    {(() => {
                                        // 겹치는 이벤트들을 그룹화
                                        const eventGroups: WeeklyEvent[][] = []
                                        const processedEvents = new Set<WeeklyEvent>()
                                        
                                        dayEvents.forEach(event => {
                                            if (processedEvents.has(event)) return
                                            
                                            const eventStart = dayjs(event.record.startedAt)
                                            const eventEnd = dayjs(event.record.endedAt)
                                            
                                            // 이 이벤트와 겹치는 모든 이벤트들 찾기
                                            const overlappingEvents = dayEvents.filter(otherEvent => {
                                                if (otherEvent === event || processedEvents.has(otherEvent)) return false
                                                
                                                const otherStart = dayjs(otherEvent.record.startedAt)
                                                const otherEnd = dayjs(otherEvent.record.endedAt)
                                                
                                                // 시간이 겹치는지 확인
                                                return eventStart.isBefore(otherEnd) && otherStart.isBefore(eventEnd)
                                            })
                                            
                                            // 그룹 생성 (현재 이벤트 + 겹치는 이벤트들)
                                            const group = [event, ...overlappingEvents]
                                            eventGroups.push(group)
                                            
                                            // 처리된 이벤트들 마킹
                                            group.forEach(e => processedEvents.add(e))
                                        })
                                        
                                        return eventGroups.map((group, groupIndex) => {
                                            
                                            // 그룹의 시작 시간과 종료 시간 계산
                                            const groupStart = Math.min(...group.map(e => dayjs(e.record.startedAt).valueOf()))
                                            const groupEnd = Math.max(...group.map(e => dayjs(e.record.endedAt).valueOf()))
                                            
                                            const groupStartTime = dayjs(groupStart)
                                            const groupEndTime = dayjs(groupEnd)
                                            
                                            // 그룹의 위치 계산
                                            const startHour = groupStartTime.hour()
                                            const startMinute = groupStartTime.minute()
                                            const duration = groupEndTime.diff(groupStartTime, 'minute')
                                            
                                            const top = (startHour * 4.8) + (startMinute / 30) * 2.4
                                            const height = Math.max((duration / 30) * 2.4, 0.8)
                                            
                                            return (
                                                <div
                                                    key={groupIndex}
                                                    className="event-group"
                                                    style={{
                                                        position: 'absolute',
                                                        top: `${top}rem`,
                                                        left: '0',
                                                        width: '100%',
                                                        height: `${height}rem`,
                                                        display: 'flex',
                                                        flexDirection: 'row'
                                                    }}
                                                >
                                                    {group.map((event, eventIndex) => {
                                                        const eventStart = dayjs(event.record.startedAt)
                                                        const eventEnd = dayjs(event.record.endedAt)
                                                        const eventDuration = eventEnd.diff(eventStart, 'minute')
                                                        const eventHeight = Math.max((eventDuration / 30) * 2.4, 0.8)
                                                        
                                                        // 그룹 내 div 개수로 width 계산
                                                        const eventWidth = `${100 / group.length}%`
                                                        
                                                        // 각 이벤트의 시작 시간에 따른 top 위치 계산
                                                        const startHour = eventStart.hour()
                                                        const startMinute = eventStart.minute()
                                                        const eventTop = (startHour * 4.8) + (startMinute / 30) * 2.4
                                                        
                                                        // 그룹의 시작 시간과의 차이 계산
                                                        const groupStartTime = dayjs(Math.min(...group.map(e => dayjs(e.record.startedAt).valueOf())))
                                                        const groupStartHour = groupStartTime.hour()
                                                        const groupStartMinute = groupStartTime.minute()
                                                        const groupStartTop = (groupStartHour * 4.8) + (groupStartMinute / 30) * 2.4
                                                        
                                                        // 이벤트의 상대적 top 위치 (그룹 내에서의 위치)
                                                        const relativeTop = eventTop - groupStartTop
                                                        
                                                            return (
                                                                <div
                                                                    key={eventIndex}
                                                                    className="timed-event"
                                                                    style={{
                                                                    position: 'absolute',
                                                                    top: `${relativeTop}rem`,
                                                                    left: `${(eventIndex * 100) / group.length}%`,
                                                                    width: eventWidth,
                                                                    height: `${eventHeight}rem`,
                                                                    backgroundColor: event.color,
                                                                    margin: 0,
                                                                    padding: '4px 8px',
                                                                    boxSizing: 'border-box',
                                                                    borderRight: eventIndex < group.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none'
                                                                    }}
                                                                    onClick={(e) => handleRecordClick(event.record, e)}
                                                                >
                                                                    <div className="event-title">{event.record.title}</div>
                                                                    <div className="event-time">
                                                                        {event.startTime} - {event.endTime}
                                                                    </div>
                                                                </div>
                                                            )
                                                    })}
                                                </div>
                                            )
                                        })
                                    })()}
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
