import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Record, Record_RecordType, RecordGroup } from '@/generated/common'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import timezone from 'dayjs/plugin/timezone'
import RecordCreateModal from '../../modal/RecordCreateModal'
import RecordDetail from '../../modal/RecordDetail'
import RecordUpdateModal from '../../modal/RecordUpdateModal'
import HttpMethod from '@/enums/HttpMethod'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import { isRecordType } from '@/utils/calendarUtils'
import { useConfirm } from '@/hooks/useConfirm'
import { isLoggedIn } from '@/utils/authUtils'
import LoginModal from '@/components/portal/ui/LoginModal'

dayjs.locale('ko')
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

interface WeeklyCalendarProps {
    initialDate: Date
    records: Record[]
    allRecordGroups: RecordGroup[]
}

interface WeeklyCalendarDay {
    date: Date
    dayOfWeek: number
    displayDate: string
    displayDay: string
    isToday: boolean
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

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = React.memo(({ 
    initialDate,
    records,
    allRecordGroups,
}) => {
    const { confirm } = useConfirm();
    
    // 주간 날짜 생성 (일요일부터 토요일까지) - useCallback으로 메모이제이션
    const getWeekDays = useCallback((date: Date): WeeklyCalendarDay[] => {
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
    }, [])

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
    const [detailPosition, setDetailPosition] = useState<{top: number, left?: number, right?: number, width: number} | null>(null)
    const [currentTime, setCurrentTime] = useState(dayjs().toDate())
    const [selectedDateForCreate, setSelectedDateForCreate] = useState<string | null>(null)
    const [showLoginModal, setShowLoginModal] = useState(false)
    
    const weeklyGridRef = useRef<HTMLDivElement>(null)

    const { triggerRecordRefresh } = useRecordGroupStore()
    
    // weekDays를 useMemo로 메모이제이션
    const weekDays = useMemo(() => getWeekDays(initialDate), [initialDate, getWeekDays])
    
    // 현재 시간 업데이트 (1분마다)
    useEffect(() => {
        const updateCurrentTime = () => {
            setCurrentTime(dayjs().toDate())
        }
        
        const interval = setInterval(updateCurrentTime, 60000) // 1분마다 업데이트
        
        return () => clearInterval(interval)
    }, [])
    
    // 모달 위치 계산 공통 함수
    const calculateModalPosition = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect()
        const calendarContainer = element.closest('.weekly')?.getBoundingClientRect()
        
        if (!calendarContainer) return null
        
        const detailWidth = Math.min(400, Math.max(200, rect.width * 1.5))
        const detailHeight = 300
        const viewportHeight = window.innerHeight
        
        // 화면 하단 여백 체크
        const spaceBelow = viewportHeight - (rect.bottom + detailHeight)
        const spaceAbove = rect.top - detailHeight
        
        let top
        
        // 하단에 공간이 부족하고 위쪽에 공간이 있으면 위에 표시
        if (spaceBelow < 0 && spaceAbove > 0) {
            top = rect.top - calendarContainer.top - detailHeight + 123
        } else {
            // 기본적으로 하단에 표시
            top = rect.bottom - calendarContainer.top
        }
        
        // 가로 위치: record의 좌측 기준선과 동일하게 위치
        let left = rect.left - calendarContainer.left
        
        // weekly 컨테이너 경계 체크
        const containerRight = calendarContainer.width
        const minLeft = 20
        
        // 컨테이너 왼쪽 경계 체크
        if (left < minLeft) {
            left = minLeft
        }
        
        // 세로 위치도 컨테이너 경계 체크
        const containerTop = 0
        const containerBottom = calendarContainer.height + 15
        
        // 컨테이너 상단 경계 체크
        if (top < containerTop) {
            top = 10
        }
        
        // 컨테이너 하단 경계 체크
        if (top + detailHeight > containerBottom) {
            top = containerBottom - detailHeight
        }
        
        // 최소 위치 보장 (컨테이너 내부)
        top = Math.max(10, Math.min(top, containerBottom - detailHeight))
        
        // 오른쪽 영역을 넘어가는지 체크
        const isOverflowingRight = left + detailWidth > containerRight - 150
        
        if (isOverflowingRight) {
            // 오른쪽 영역을 넘어가면 record의 우측 기준선과 일치
            const recordRight = rect.right - calendarContainer.left
            return {
                top: top,
                right: containerRight - recordRight,
                width: detailWidth
            }
        } else {
            // 정상 범위면 record의 좌측 기준선과 일치
            return {
                top: top,
                left: left,
                width: detailWidth
            }
        }
    }
    
    // weeks에 현재 주 데이터만 넣기 (useMemo로 메모이제이션된 weekDays 사용)
    const weeks: (WeeklyCalendarDay | null)[][] = [weekDays]

    // renderRecords 함수 - MonthlyCalendar 스타일
    const renderRecords = (week: (WeeklyCalendarDay | null)[]) => {
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

        // 일정들을 행별로 그룹화
        const rowGroups: Array<Array<{ record: Record; startDayIndex: number; colSpan: number }>> = []
        
        for (let i = 0; i < weekRecords.length; i++) {
            const item = weekRecords[i]
            let placed = false
            
            // 기존 행들 중에 배치할 수 있는 곳 찾기
            for (let rowIndex = 0; rowIndex < rowGroups.length; rowIndex++) {
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
            
            // 배치할 수 없으면 새로운 행에 추가
            if (!placed) {
                rowGroups.push([item])
            }
        }

        // 완성된 행의 개수 + 1만큼만 행을 생성
        const maxRows = Math.max(1, rowGroups.length + 1)
        const rows = []

        // 행 그룹들을 렌더링
        for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
            const rowItems = rowGroups[rowIndex] || []
            
            if (rowItems.length === 0) {
                // 빈 행
                rows.push(
                    <tr key={`empty-row-${rowIndex}`}>
                        {Array.from({ length: 7 }, (_, j) => {
                            const dayInfo = weekDays[j]
                            const isToday = dayInfo?.isToday || false
                            const className = `record${isToday ? ' today' : ''}`
                            return (
                                <td 
                                    key={`empty-${j}`} 
                                    className={className}
                                    onClick={() => {
                                        // 빈 행 클릭 시 09:00 기본 시간으로 레코드 생성
                                        // slotIndex = 9 (09:00), subIndex = 0 (정각)
                                        handleSubSlotClick(j, 9, 0)
                                    }}
                                    style={{ cursor: 'pointer' }}
                                ></td>
                            )
                        })}
                    </tr>
                )
            } else {
                // 일정이 있는 행
                const cells = []
                let currentDay = 0
                
                while (currentDay < 7) {
                    const item = rowItems.find(item => item.startDayIndex === currentDay)
                    
                    if (item) {
                        const dayInfo = weekDays[currentDay]
                        const isToday = dayInfo?.isToday || false
                        const className = `record${isToday ? ' today' : ''}`
                        
                        cells.push(
                            <td key={currentDay} colSpan={item.colSpan} className={className}>
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
                        const dayInfo = weekDays[currentDay]
                        const isToday = dayInfo?.isToday || false
                        const className = `record${isToday ? ' today' : ''}`
                        const dayIndex = currentDay
                        
                        cells.push(
                            <td 
                                key={currentDay} 
                                className={className}
                                onClick={() => {
                                    // 빈 셀 클릭 시 09:00 기본 시간으로 레코드 생성
                                    handleSubSlotClick(dayIndex, 9, 0)
                                }}
                                style={{ cursor: 'pointer' }}
                            ></td>
                        )
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
            
            // currentTime 위치 계산 (1시간 = 4.4rem, 30분 = 2.2rem)
            const hourSlot = Math.floor(totalMinutes / 60) * 4.4
            const minuteOffset = (totalMinutes % 60) * (2.2 / 30)
            const currentTimePosition = hourSlot + minuteOffset
            
            // rem을 px로 변환 (1rem = 16px)
            const currentTimePositionPx = currentTimePosition * 16
            
            // 실제 뷰포트 높이와 전체 높이 계산 (px 단위)
            const viewportHeight = weeklyGridRef.current.clientHeight // px 단위
            const totalHeight = 24 * 4.4 * 16 // 24시간 * 4.4rem * 16px = 1689.6px
            
            // 스크롤 가능한 최대 위치
            const maxScrollTop = totalHeight - viewportHeight
            
            let scrollTop
            
            // 현재 시간을 화면 중앙에 배치하도록 스크롤 위치 계산
            scrollTop = currentTimePositionPx - (viewportHeight / 2)
            
            // 스크롤 위치 제한
            if (scrollTop < 0) {
                // 너무 이른 시간일 때는 맨 위로
                scrollTop = 0
            } else if (scrollTop > maxScrollTop) {
                // 너무 늦은 시간일 때는 맨 아래로
                scrollTop = maxScrollTop
            }
            
            // DOM이 완전히 렌더링된 후 스크롤 적용
            const applyScroll = () => {
                if (weeklyGridRef.current) {
                    // 여러 방법으로 스크롤 시도
                    const element = weeklyGridRef.current
                    
                    // 1. scrollTo 메서드 시도
                    element.scrollTo({
                        top: scrollTop,
                        behavior: 'auto'
                    })
                    
                    // 2. scrollTop 직접 할당 시도
                    element.scrollTop = scrollTop
                    
                    // 3. scrollIntoView 시도 (마지막 수단)
                    if (Math.abs(element.scrollTop - scrollTop) > 1) {
                        const targetElement = element.querySelector(`li:nth-child(${Math.floor(scrollTop / 70) + 1})`)
                        if (targetElement) {
                            targetElement.scrollIntoView({ block: 'start' })
                        }
                    }
                }
            }
            
            // 여러 시점에서 스크롤 시도
            setTimeout(applyScroll, 50)
            setTimeout(applyScroll, 200)
            setTimeout(applyScroll, 500)
        }
    }, [currentTime]) // currentTime 의존성 추가
    
    // 시간 슬롯 생성 (00:00부터 23:00까지) - useMemo로 최적화
    const timeSlots = useMemo(() => {
        const slots = []
        for (let hour = 0; hour <= 23; hour++) {
            const time = dayjs().hour(hour).minute(0)
            slots.push({
                hour,
                displayTime: time.format('HH:mm'),
                isAM: hour < 12,
                subSlots: [
                    { minute: 0, displayTime: time.format('HH:mm') },
                    { minute: 30, displayTime: time.add(30, 'minute').format('HH:mm') }
                ]
            })
        }
        return slots
    }, [])

    // 레코드 그룹 색상 매핑 - useCallback으로 최적화
    const getRecordGroupColor = useCallback((recordGroup: RecordGroup | undefined) => {
        if (!recordGroup) return '#e0e0e0'
        return recordGroup.color || '#e0e0e0'
    }, [])

    // 레코드를 주간 이벤트로 변환 - useMemo로 최적화
    const allEvents = useMemo(() => {
        return records.map(record => {
            // startedAt과 endedAt이 문자열인 경우와 숫자인 경우 모두 처리
            const startTimestamp = typeof record.startedAt === 'string' 
                ? parseInt(record.startedAt) 
                : record.startedAt
            const endTimestamp = typeof record.endedAt === 'string' 
                ? parseInt(record.endedAt) 
                : record.endedAt
            
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
    }, [records, getRecordGroupColor])

    // 시간 이벤트 필터링 (현재 주 범위 내의 이벤트만) - useMemo로 최적화
    const timedEvents = useMemo(() => {
        const currentWeekStart = dayjs(initialDate).startOf('week')
        const currentWeekEnd = dayjs(initialDate).endOf('week')
        
        return allEvents.filter(event => {
            // startedAt이 문자열인 경우와 숫자인 경우 모두 처리
            const startTimestamp = typeof event.record.startedAt === 'string' 
                ? parseInt(event.record.startedAt) 
                : event.record.startedAt
            const eventDate = dayjs(startTimestamp)
            // 현재 주 범위 내의 이벤트만 필터링
            return !event.isAllDay && 
                   (eventDate.isAfter(currentWeekStart, 'day') || eventDate.isSame(currentWeekStart, 'day')) && 
                   (eventDate.isBefore(currentWeekEnd, 'day') || eventDate.isSame(currentWeekEnd, 'day'))
        })
    }, [allEvents, initialDate])

    // 현재 시간 표시선 위치 계산 - useMemo로 최적화
    const currentTimePosition = useMemo(() => {
        const now = dayjs(currentTime)
        
        const hours = now.hour()
        const minutes = now.minute()
        const totalMinutes = hours * 60 + minutes
        
        // 시간 슬롯 구조에 맞는 정확한 계산 (1시간 = 4.4rem, 30분 = 2.2rem)
        // 각 시간 슬롯의 시작점에서 현재 시간까지의 거리 계산
        const hourSlot = Math.floor(totalMinutes / 60) * 4.4 // 시간 슬롯 시작점
        const minuteOffset = (totalMinutes % 60) * (2.2 / 30) // 30분 단위 내에서의 분 오프셋
        
        const top = hourSlot + minuteOffset
        
        return {
            top,
            isVisible: true
        }
    }, [currentTime])

    const handleRecordClick = (record: Record, event: React.MouseEvent<HTMLDivElement>) => {
        // 이전 모달 상태 초기화
        setIsUpdateModalOpen(false)
        setIsCreateModalOpen(false)
        setSelectedDateForCreate(null)
        
        const position = calculateModalPosition(event.currentTarget)
        if (position) {
            setDetailPosition(position)
        }
        
        setSelectedRecord(record)
        setIsDetailModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsDetailModalOpen(false)
        setIsUpdateModalOpen(false)
        setIsCreateModalOpen(false)
        setSelectedRecord(null)
        setSelectedDateForCreate(null)
        setDetailPosition(null)
    }


    const handleCloseCreateModal = () => {
        setIsDetailModalOpen(false)
        setIsUpdateModalOpen(false)
        setIsCreateModalOpen(false)
        setSelectedRecord(null)
        setSelectedDateForCreate(null)
        setDetailPosition(null)
    }

    const handleSubSlotClick = (dayIndex: number, slotIndex: number, subIndex: number) => {
        // 로그인 체크 - 팝업을 열기 전에 체크
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }
        
        // 이전 모달 상태 초기화
        setIsDetailModalOpen(false)
        setIsUpdateModalOpen(false)
        setSelectedRecord(null)
        setDetailPosition(null)
        
        const day = weekDays[dayIndex]
        const slot = timeSlots[slotIndex]
        const subSlot = slot.subSlots[subIndex]
        
        // 클릭한 날짜와 시간 계산
        const clickedDate = dayjs(day.date)
        const clickedHour = slot.hour
        const clickedMinute = subSlot.minute
        
        // 시작 시간 설정 (30분 간격)
        const startTime = clickedDate.hour(clickedHour).minute(clickedMinute).second(0).millisecond(0)
        
        // ISO 문자열로 변환하여 전달
        const selectedDateTime = startTime.toISOString()
        
        setSelectedDateForCreate(selectedDateTime)
        setIsCreateModalOpen(true)
    }


    const handleOpenUpdateModal = () => {
        setIsDetailModalOpen(false)
        setIsCreateModalOpen(false)
        setSelectedDateForCreate(null)
        setIsUpdateModalOpen(true)
    }

    const handleCloseUpdateModal = () => {
        setIsDetailModalOpen(false)
        setIsUpdateModalOpen(false)
        setIsCreateModalOpen(false)
        setSelectedRecord(null)
        setSelectedDateForCreate(null)
        setDetailPosition(null)
    }

    const handleDeleteRecord = async () => {
        
        if (!selectedRecord) return;
        
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }
        
        const result = await confirm({
            title: '레코드 삭제',
            icon: '/assets/img/ico/ic-delete.svg',
            description: `삭제하면 레코드에 저장된 내용이 모두 사라져요.\n한 번 삭제하면 되돌릴 수 없어요.`,
            confirmText: '삭제하기',
            cancelText: '돌아가기',
        });
        
        if (!result) return;
        
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
        <div className="weekly">
            <table className="week">
                <thead>
                    <tr>
                        <th>구분</th>
                        {weekDays.map((day, dayIndex) => (
                            <th key={dayIndex} className={`${day.dayOfWeek === 0 ? 'holiday' : ''}`}>
                                <span>{day.displayDate}</span>({day.displayDay})
                            </th>
                        ))}
                    </tr>
                </thead>
            </table>
            
            <div className="all">
                <div>하루 종일</div>
                {weeks.map((week, weekIndex) => (
                    <table key={weekIndex}>
                        <tbody>
                            {renderRecords(week)}
                        </tbody>
                    </table>
                ))}
            </div>
            
            <div className="time" ref={weeklyGridRef}>
                <ul>
                    {timeSlots.map((slot, index) => (
                        <li key={index}>
                            {slot.displayTime}
                        </li>
                    ))}
                </ul>

                <table>
                    <tbody>
                        <tr>
                            {weekDays.map((day, dayIndex) => {
                                // 각 요일에 해당하는 이벤트들만 필터링 (날짜 기반)
                                const dayEvents = timedEvents.filter(event => {
                                    // startedAt이 문자열인 경우와 숫자인 경우 모두 처리
                                    const startTimestamp = typeof event.record.startedAt === 'string' 
                                        ? parseInt(event.record.startedAt) 
                                        : event.record.startedAt
                                    const eventDate = dayjs(startTimestamp)
                                    const dayDate = dayjs(day.date)
                                    // 정확한 날짜 비교 (년월일)
                                    return eventDate.isSame(dayDate, 'day')
                                })
                                return (
                                    <td key={dayIndex} className={`${day.isToday ? 'today' : ''}`}>
                                        {/* 현재 시간 표시선 - 각 컬럼에 표시 */}
                                        <div 
                                            className="current-time"
                                            style={{
                                                top: `${currentTimePosition.top}rem`
                                            }}
                                        />

                                        <ul>
                                            {timeSlots.map((slot, slotIndex) => (
                                                <li key={slotIndex}>
                                                    {/* 30분 단위 서브 슬롯들 */}
                                                    {slot.subSlots.map((subSlot, subIndex) => (
                                                        <div key={subIndex}></div>
                                                    ))}
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        {/* 이벤트들을 그룹화하여 배치 - 각 요일에 해당하는 일정만 */}
                                        <div 
                                            className="record-wrap"
                                            onClick={(e) => {
                                                // 이벤트가 아닌 영역을 클릭한 경우에만 subSlot 클릭 처리
                                                if (e.target === e.currentTarget) {
                                                    // 클릭한 위치에 해당하는 시간 슬롯 계산
                                                    const rect = e.currentTarget.getBoundingClientRect()
                                                    const clickY = e.clientY - rect.top
                                                    
                                                    // 실제 DOM에서 시간 슬롯 요소들을 찾아서 높이 계산
                                                    const timeSlotElements = e.currentTarget.parentElement?.querySelectorAll('ul li')
                                                    if (timeSlotElements && timeSlotElements.length > 0) {
                                                        const firstSlot = timeSlotElements[0] as HTMLElement
                                                        const slotHeight = firstSlot.offsetHeight
                                                        const subSlotHeight = slotHeight / 2
                                                        
                                                        const slotIndex = Math.floor(clickY / slotHeight)
                                                        const subIndex = Math.floor((clickY % slotHeight) / subSlotHeight)
                                                        
                                                        // 유효한 범위인지 확인
                                                        if (slotIndex >= 0 && slotIndex < timeSlots.length && subIndex >= 0 && subIndex < 2) {
                                                            handleSubSlotClick(dayIndex, slotIndex, subIndex)
                                                        }
                                                    }
                                                }
                                            }}
                                        >
                                            {(() => {
                                                // 겹치는 이벤트들을 그룹화하는 개선된 알고리즘
                                                const eventGroups: WeeklyEvent[][] = []
                                                const processedEvents = new Set<WeeklyEvent>()
                                                
                                                // 이벤트들을 시작 시간 순으로 정렬
                                                const sortedEvents = [...dayEvents].sort((a, b) => 
                                                    dayjs(a.record.startedAt).valueOf() - dayjs(b.record.startedAt).valueOf()
                                                )
                                                
                                                sortedEvents.forEach(event => {
                                                    if (processedEvents.has(event)) return
                                                    
                                                    // 현재 이벤트와 겹치는 모든 이벤트들을 재귀적으로 찾기
                                                    const findOverlappingEvents = (currentEvent: WeeklyEvent, visited: Set<WeeklyEvent>): WeeklyEvent[] => {
                                                        if (visited.has(currentEvent)) return []
                                                        
                                                        visited.add(currentEvent)
                                                        const overlapping: WeeklyEvent[] = [currentEvent]
                                                        
                                                        const currentStartTimestamp = typeof currentEvent.record.startedAt === 'string' 
                                                            ? parseInt(currentEvent.record.startedAt) 
                                                            : currentEvent.record.startedAt
                                                        const currentEndTimestamp = typeof currentEvent.record.endedAt === 'string' 
                                                            ? parseInt(currentEvent.record.endedAt) 
                                                            : currentEvent.record.endedAt
                                                        const currentStart = dayjs(currentStartTimestamp)
                                                        const currentEnd = dayjs(currentEndTimestamp)
                                                        
                                                        // 다른 모든 이벤트들과 겹침 확인
                                                        dayEvents.forEach(otherEvent => {
                                                            if (otherEvent === currentEvent || visited.has(otherEvent) || processedEvents.has(otherEvent)) return
                                                            
                                                            const otherStartTimestamp = typeof otherEvent.record.startedAt === 'string' 
                                                                ? parseInt(otherEvent.record.startedAt) 
                                                                : otherEvent.record.startedAt
                                                            const otherEndTimestamp = typeof otherEvent.record.endedAt === 'string' 
                                                                ? parseInt(otherEvent.record.endedAt) 
                                                                : otherEvent.record.endedAt
                                                            const otherStart = dayjs(otherStartTimestamp)
                                                            const otherEnd = dayjs(otherEndTimestamp)
                                                            
                                                            // 정확한 겹침 감지: 두 이벤트가 실제로 시간적으로 겹치는지 확인
                                                            // A 이벤트: [startA, endA], B 이벤트: [startB, endB]
                                                            // 겹치는 조건: startA < endB && startB < endA
                                                            const isOverlapping = currentStart.isBefore(otherEnd) && otherStart.isBefore(currentEnd)
                                                            
                                                            if (isOverlapping) {
                                                                const recursiveOverlapping = findOverlappingEvents(otherEvent, visited)
                                                                overlapping.push(...recursiveOverlapping)
                                                            }
                                                        })
                                                        
                                                        return overlapping
                                                    }
                                                    
                                                    const group = findOverlappingEvents(event, new Set())
                                                    
                                                    // 그룹이 2개 이상의 이벤트를 포함하는 경우만 추가 (실제로 겹치는 경우)
                                                    if (group.length > 1) {
                                                        eventGroups.push(group)
                                                        group.forEach(e => processedEvents.add(e))
                                                    }
                                                })
                                                
                                                // 겹치지 않는 단일 이벤트들도 처리
                                                const singleEvents = dayEvents.filter(event => !processedEvents.has(event))
                                                
                                                return [
                                                    // 그룹화된 이벤트들
                                                    ...eventGroups.map((group, groupIndex) => {
                                                        // 그룹의 시작 시간과 종료 시간 계산
                                                        const groupStart = Math.min(...group.map(e => {
                                                            const startTimestamp = typeof e.record.startedAt === 'string' 
                                                                ? parseInt(e.record.startedAt) 
                                                                : e.record.startedAt
                                                            return dayjs(startTimestamp).valueOf()
                                                        }))
                                                        const groupEnd = Math.max(...group.map(e => {
                                                            const endTimestamp = typeof e.record.endedAt === 'string' 
                                                                ? parseInt(e.record.endedAt) 
                                                                : e.record.endedAt
                                                            return dayjs(endTimestamp).valueOf()
                                                        }))
                                                        
                                                        const groupStartTime = dayjs(groupStart)
                                                        const groupEndTime = dayjs(groupEnd)
                                                        
                                                        // 그룹의 위치 계산
                                                        const startHour = groupStartTime.hour()
                                                        const startMinute = groupStartTime.minute()
                                                        const duration = groupEndTime.diff(groupStartTime, 'minute')
                                                        
                                                        const top = (startHour * 4.4) + (startMinute / 30) * 2.2
                                                        const height = Math.max((duration / 30) * 2.2, 0.8)
                                                        
                                                        return (
                                                            <div
                                                                key={groupIndex}
                                                                className="record-group"
                                                                style={{
                                                                    top: `${top}rem`,
                                                                    height: `${height}rem`,
                                                                    pointerEvents: 'none'
                                                                }}
                                                            >
                                                                {group.map((event, eventIndex) => {
                                                                    const eventStartTimestamp = typeof event.record.startedAt === 'string' 
                                                                        ? parseInt(event.record.startedAt) 
                                                                        : event.record.startedAt
                                                                    const eventEndTimestamp = typeof event.record.endedAt === 'string' 
                                                                        ? parseInt(event.record.endedAt) 
                                                                        : event.record.endedAt
                                                                    const eventStart = dayjs(eventStartTimestamp)
                                                                    const eventEnd = dayjs(eventEndTimestamp)
                                                                    const eventDuration = eventEnd.diff(eventStart, 'minute')
                                                                    const eventHeight = Math.max((eventDuration / 30) * 2.2, 0.8)
                                                                    
                                                                    // 그룹 내 이벤트 개수로 width 계산 (5개 초과시 정확히 나누기, 5개 이하시 최소 20% 보장)
                                                                    const eventWidth = group.length > 5 
                                                                        ? `${100 / group.length}%`  // 5개 초과시 정확히 나누기
                                                                        : `${Math.max(100 / group.length, 20)}%`  // 5개 이하시 최소 20% 보장
                                                                    
                                                                    // 각 이벤트의 시작 시간에 따른 top 위치 계산
                                                                    const startHour = eventStart.hour()
                                                                    const startMinute = eventStart.minute()
                                                                    const eventTop = (startHour * 4.4) + (startMinute / 30) * 2.2
                                                                    
                                                                    // 그룹의 시작 시간과의 차이 계산
                                                                    const groupStartTime = dayjs(Math.min(...group.map(e => {
                                                                        const startTimestamp = typeof e.record.startedAt === 'string' 
                                                                            ? parseInt(e.record.startedAt) 
                                                                            : e.record.startedAt
                                                                        return dayjs(startTimestamp).valueOf()
                                                                    })))
                                                                    const groupStartHour = groupStartTime.hour()
                                                                    const groupStartMinute = groupStartTime.minute()
                                                                    const groupStartTop = (groupStartHour * 4.4) + (groupStartMinute / 30) * 2.2
                                                                    
                                                                    // 이벤트의 상대적 top 위치 (그룹 내에서의 위치)
                                                                    const relativeTop = eventTop - groupStartTop
                                                                    
                                                                    // 이벤트의 left 위치 계산 (가로 분배)
                                                                    const leftPosition = (eventIndex * 100) / group.length
                                                                    
                                                                    return (
                                                                        <div
                                                                            key={eventIndex}
                                                                            className="record"
                                                                            style={{
                                                                                top: `${relativeTop}rem`,
                                                                                left: `${leftPosition}%`,
                                                                                width: eventWidth,
                                                                                height: `${eventHeight}rem`,
                                                                                pointerEvents: 'auto'
                                                                            }}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                handleRecordClick(event.record, e)
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    backgroundColor: event.color,
                                                                                }}
                                                                            >
                                                                                <span>{event.startTime}</span>
                                                                                <p>{event.record.title}</p>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        )
                                                    }),
                                                    
                                                    // 단일 이벤트들
                                                    ...singleEvents.map((event, eventIndex) => {
                                                        const eventStartTimestamp = typeof event.record.startedAt === 'string' 
                                                            ? parseInt(event.record.startedAt) 
                                                            : event.record.startedAt
                                                        const eventEndTimestamp = typeof event.record.endedAt === 'string' 
                                                            ? parseInt(event.record.endedAt) 
                                                            : event.record.endedAt
                                                        const eventStart = dayjs(eventStartTimestamp)
                                                        const eventEnd = dayjs(eventEndTimestamp)
                                                        const eventDuration = eventEnd.diff(eventStart, 'minute')
                                                        
                                                        const startHour = eventStart.hour()
                                                        const startMinute = eventStart.minute()
                                                        const top = (startHour * 4.4) + (startMinute / 30) * 2.2
                                                        const height = Math.max((eventDuration / 30) * 2.2, 0.8)
                                                        
                                                        return (
                                                            <div
                                                                key={`single-${eventIndex}`}
                                                                className="record"
                                                                style={{
                                                                    top: `${top}rem`,
                                                                    height: `${height}rem`,
                                                                    pointerEvents: 'auto'
                                                                }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleRecordClick(event.record, e)
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        backgroundColor: event.color,
                                                                    }}
                                                                >
                                                                    <span>{event.startTime}</span>
                                                                    <p>{event.record.title}</p>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                ]
                                            })()}
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>
                    </tbody>
                </table>
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
                allRecordGroups={allRecordGroups}
            />

            {/* RecordCreateModal */}
            <RecordCreateModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                selectedDate={selectedDateForCreate}
                allRecordGroups={allRecordGroups}
            />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    )
})

WeeklyCalendar.displayName = 'WeeklyCalendar'

export default WeeklyCalendar
