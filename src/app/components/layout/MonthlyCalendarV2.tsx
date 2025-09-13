// src/components/MonthlyCalendarV2.tsx
import React, { useMemo, useState, useCallback } from 'react'
import { createDateModel, DateModel } from "@/app/models/DateModel"
import { Record, Record_RecordType } from "../../../../generated/common"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import MonthlyCalendarHeader from './MonthlyCalendarHeader'
import MonthlyCalendarWeekdays from './MonthlyCalendarWeekdays'
import styles from '@/styles/MonthlyCalendarV2.module.css'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/SEOUL')

type RecordType = 'weekly' | 'monthly' | 'list';

interface MonthlyCalendarV2Props {
    initialDate: Date;
    records: Record[];
}

interface CalendarEvent {
    record: Record;
    startDate: string;
    endDate: string;
    linePosition: number;
    isMultiDay: boolean;
    displayText: string;
    timeText?: string;
}

const MonthlyCalendarV2: React.FC<MonthlyCalendarV2Props> = ({ initialDate, records }) => {
    const [date, setDate] = useState(initialDate)
    const [recordType, setRecordType] = useState<RecordType>('monthly')
    const { checkedGroups } = useRecordGroupStore()
    
    const getDaysInMonth = (year: number, month: number) => {
        const days: DateModel[] = []
        const lastDay = new Date(year, month + 1, 0).getDate()
        
        for (let day = 1; day <= lastDay; day++) {
            days.push(createDateModel(year, month + 1, day, true))
        }
        
        return days
    }
    
    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay()
    }
    
    const getDaysInPreviousMonth = (year: number, month: number) => {
        const prevMonth = month === 0 ? 11 : month - 1
        const prevYear = month === 0 ? year - 1 : year
        return new Date(prevYear, prevMonth + 1, 0).getDate()
    }
    
    const calculateCalendarDays = useCallback((year: number, month: number) => {
        const firstDayIndex = getFirstDayOfMonth(year, month)
        const prevMonthDaysCount = getDaysInPreviousMonth(year, month)
        const days = getDaysInMonth(year, month)
        
        const calendarDays: (DateModel | null)[] = Array(42).fill(null)
        
        // 이전 달 날짜 추가
        for (let i = 0; i < firstDayIndex; i++) {
            const day = prevMonthDaysCount - (firstDayIndex - i - 1)
            calendarDays[i] = createDateModel(year, month, day, false)
        }
        
        // 현재 달 날짜 추가
        days.forEach((day) => {
            calendarDays[firstDayIndex + day.day - 1] = day
        })
        
        const lastDayOfCurrentMonth = days.length
        const emptySpacesCount = 42 - (firstDayIndex + lastDayOfCurrentMonth)
        
        for (let i = 0; i < emptySpacesCount; i++) {
            calendarDays[firstDayIndex + lastDayOfCurrentMonth + i] = createDateModel(year, month + 2, i + 1, false)
        }
        
        return calendarDays
    }, [])
    
    // 캘린더 이벤트들을 생성하고 정렬하는 함수
    const calendarEvents = useMemo(() => {
        if (!records || records.length === 0) return []
        
        const events: CalendarEvent[] = []
        const dailyLineCounts = new Map<string, number>() // 각 날짜별 라인 수 추적
        const eventLineMap = new Map<string, number>() // 각 이벤트의 라인 위치 매핑
        
        // 시작 날짜 기준으로 정렬
        const sortedRecords = records
            .filter(record => record.recordGroup && checkedGroups.has(record.recordGroup.id))
            .sort((a, b) => Number(a.startedAt) - Number(b.startedAt))
        
        // 먼저 모든 이벤트의 날짜 범위를 계산하고 라인 위치를 결정
        sortedRecords.forEach(record => {
            const startDate = dayjs(Number(record.startedAt)).format('YYYYMMDD')
            const endDate = dayjs(Number(record.endedAt)).format('YYYYMMDD')
            const isMultiDay = startDate !== endDate

            // 시간 텍스트 생성
            let timeText = ''
            if (Record_RecordType[record.type] == Record_RecordType.TIME.toString()) {
                const time = dayjs(Number(record.startedAt)).format('HH:mm')
                timeText = `(${time})`
            }
            
            // 표시 텍스트 생성
            const displayText = timeText ? `${timeText} ${record.title}` : record.title
            
            // 멀티데이 이벤트인 경우 모든 날짜에 대해 라인 위치 계산
            if (isMultiDay) {
                const start = dayjs(startDate)
                const end = dayjs(endDate)
                let current = start
                let maxLinePosition = 0
                
                // 모든 날짜에서 사용 가능한 최소 라인 위치 찾기
                while (current.isSame(end) || current.isBefore(end)) {
                    const currentDate = current.format('YYYYMMDD')
                    const currentLineCount = dailyLineCounts.get(currentDate) || 0
                    maxLinePosition = Math.max(maxLinePosition, currentLineCount)
                    current = current.add(1, 'day')
                }
                
                // 모든 날짜에 같은 라인 위치 할당
                current = start
                while (current.isSame(end) || current.isBefore(end)) {
                    const currentDate = current.format('YYYYMMDD')
                    dailyLineCounts.set(currentDate, maxLinePosition + 1)
                    current = current.add(1, 'day')
                }
                
                eventLineMap.set(record.id, maxLinePosition)
            } else {
                // 단일일 이벤트
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
    }, [records, checkedGroups])
    
    // 단일일 이벤트들을 가져오는 함수
    const getSingleDayEventsForDate = useMemo(() => {
        return (dateId: string) => {
            return calendarEvents.filter(event => {
                return !event.isMultiDay && event.startDate === dateId
            })
        }
    }, [calendarEvents])
    
    const calendarDays = useMemo(() => {
        return calculateCalendarDays(date.getFullYear(), date.getMonth())
    }, [date, calculateCalendarDays])
    
    // 멀티데이 이벤트들을 가져오는 함수
    const getMultiDayEvents = useMemo(() => {
        return calendarEvents.filter(event => event.isMultiDay)
    }, [calendarEvents])
    
    // 연속된 이벤트 엘리먼트들을 생성하는 함수
    const createContinuousEventElements = useMemo(() => {
        const elements: React.ReactElement[] = []
        
        getMultiDayEvents.forEach(event => {
            const startDayIndex = calendarDays.findIndex(day => day?.id === event.startDate)
            const endDayIndex = calendarDays.findIndex(day => day?.id === event.endDate)
            
            if (startDayIndex === -1 || endDayIndex === -1) return
            
            // 주간별로 이벤트를 분할하여 처리
            let currentIndex = startDayIndex
            let weekCount = 0
            
            while (currentIndex <= endDayIndex) {
                const currentRow = Math.floor(currentIndex / 7)
                const currentColumn = currentIndex % 7
                
                // 현재 주에서 이벤트가 끝나는 위치 계산
                const weekEndIndex = Math.min(currentRow * 7 + 6, endDayIndex)
                const weekSpanDays = weekEndIndex - currentIndex + 1
                
                // 각 주별로 이벤트 엘리먼트 생성
                const isTimeType = Record_RecordType[event.record.type] == Record_RecordType.TIME.toString()

                // 이벤트가 다음 주로 계속되는지 확인
                const isContinuingToNextWeek = weekEndIndex < endDayIndex
                
                // 이벤트가 이전 주에서 시작되었는지 확인 (displayText가 없는 경우)
                const isStartingFromPreviousWeek = weekCount > 0
                
                // 현재 주의 마지막 날인지 확인
                // 1. 토요일인 경우 (currentIndex % 7 === 6)
                // 2. 이벤트의 전체 마지막 날인 경우 (weekEndIndex === endDayIndex)  
                // 3. 현재 주에서 이벤트가 끝나는 날인 경우 (weekEndIndex % 7 === 6)
                const isLastDayOfWeek = (currentIndex % 7 === 6) || (weekEndIndex === endDayIndex) || (weekEndIndex % 7 === 6)
                
                // 다음 주로 계속되면서 현재 주의 마지막 날인지 확인
                const shouldShowContinuationIndicator = isContinuingToNextWeek && isLastDayOfWeek
                
                // 디버깅 로그
                console.log(`Week ${weekCount}:`, {
                    currentIndex,
                    weekEndIndex,
                    endDayIndex,
                    isContinuingToNextWeek,
                    isLastDayOfWeek,
                    shouldShowContinuationIndicator,
                    currentColumn: currentIndex % 7,
                    weekEndColumn: weekEndIndex % 7,
                    isSaturday: currentIndex % 7 === 6,
                    isEventEnd: weekEndIndex === endDayIndex,
                    isWeekEndSaturday: weekEndIndex % 7 === 6
                })
                
                elements.push(
                    <div
                        key={`continuous-${event.record.id}-week-${weekCount}`}
                        className={`${styles.schedule} ${styles.scheduleMultiDay} ${isTimeType ? styles.timeEvent : ''}`}
                        style={{
                            top: `${currentRow * 100 + event.linePosition * 20 + 20}px`,
                            left: `${currentColumn * (100 / 7)}%`,
                            width: `calc(${weekSpanDays * (100 / 7)}% - 4px)`,
                            backgroundColor: isTimeType ? 'none' : (event.record.recordGroup?.color || '#e0e0e0')
                        }}
                    >
                        {isStartingFromPreviousWeek && (
                            <span className={styles.startIndicator}>
                                &lt;
                            </span>
                        )}
                        {weekCount === 0 && (
                            <span className={styles.eventTitle} >
                                {event.displayText}
                            </span>
                        )}
                        {shouldShowContinuationIndicator && (
                            <span className={styles.continuationIndicator}>
                                &gt;
                            </span>
                        )}
                    </div>
                )
                
                // 다음 주로 이동
                currentIndex = weekEndIndex + 1
                weekCount++
            }
        })
        
        return elements
    }, [getMultiDayEvents, calendarDays])
    
    const handlePreviousMonth = () => {
        setDate((prevDate) => {
            const newDate = new Date(prevDate)
            newDate.setMonth(newDate.getMonth() - 1)
            return newDate
        })
    }
    
    const handleTodayMonth = () => {
        setDate(() => {
            const newDate = new Date()
            newDate.setMonth(newDate.getMonth())
            return newDate
        })
    }
    
    const handleNextMonth = () => {
        setDate((prevDate) => {
            const newDate = new Date(prevDate)
            newDate.setMonth(newDate.getMonth() + 1)
            return newDate
        })
    }

    const handleTypeChange = (type: RecordType) => {
        setRecordType(type);
    };

    // 오늘 날짜 확인
    const today = dayjs().format('YYYYMMDD')

    return (
        <div className={styles.calendarContainer}>
            <MonthlyCalendarHeader 
                date={date}
                recordType={recordType}
                onTypeChange={handleTypeChange}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
                onTodayMonth={handleTodayMonth}
            />
            <MonthlyCalendarWeekdays />
            <div className={styles.calendarContent}>
                <div className={`${styles.monthlyCalendar} ${styles.calendarDaysContainer}`}>
                    {calendarDays.map((day, index) => (
                        <div 
                            key={index} 
                            className={`${styles.calendarDaysItem} ${
                                index % 7 === 6 ? styles.calendarDaysItemNoBorderRight : styles.calendarDaysItemBorderRight
                            } ${
                                index >= 35 ? styles.calendarDaysItemNoBorderBottom : styles.calendarDaysItemBorderBottom
                            }`}
                        >
                            {day !== null ? (
                                <>
                                    <div className={`${styles.calendarDays} ${
                                        index % 7 === 0 
                                            ? (day.isCurrentMonth ? styles.calendarDaysSunday : styles.calendarDaysSundayPreviousMonth)
                                            : (day.isCurrentMonth ? styles.calendarDaysCurrentMonth : styles.calendarDaysOtherMonth)
                                    }`}>
                                        {day.day}
                                        {/* 오늘 날짜에 동그라미 표시 */}
                                        {day.isCurrentMonth && day.id === today && (
                                            <div className={styles.todayCircle} />
                                        )}
                                    </div>
                                    
                                    {/* 단일일 이벤트들을 렌더링 */}
                                    {getSingleDayEventsForDate(day.id).map(event => {
                                        const isTimeType = Record_RecordType[event.record.type] == Record_RecordType.TIME.toString()
                                        
                                        return (
                                            <div 
                                                key={`single-${event.record.id}-${day.id}`}
                                                className={`${styles.schedule} ${styles.scheduleSingleDay} ${isTimeType ? styles.timeEvent : ''}`}
                                                style={{
                                                    top: `${event.linePosition * 20 + 20}px`,
                                                    backgroundColor: isTimeType ? 'none' : (event.record.recordGroup?.color || '#e0e0e0')
                                                }}
                                            >
                                                <span className={styles.eventTitle}>
                                                    {event.displayText}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </>
                            ) : (
                                <div className={styles.emptyDay}></div>
                            )}
                        </div>
                    ))}
                    
                    {/* 연속된 멀티데이 이벤트들을 캘린더 컨테이너에 직접 배치 */}
                    {createContinuousEventElements}
                </div>
            </div>
        </div>
    )
}

export default MonthlyCalendarV2
