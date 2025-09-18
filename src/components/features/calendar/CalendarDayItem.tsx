import React from 'react'
import { CalendarDay, CalendarEvent } from './types'
import { SingleDayEventElement } from './EventElement'
import { assignEventLinesForDate } from './utils'
import { Record_RecordType } from "../../../../../generated/common"
import styles from '@/styles/MonthlyCalendarV2.module.css'

interface CalendarDayItemProps {
    day: CalendarDay | null
    index: number
    singleDayEvents: CalendarEvent[]
    multiDayEvents: CalendarEvent[]
    today: string
}

/**
 * 캘린더 날짜 아이템 컴포넌트
 */
export const CalendarDayItem: React.FC<CalendarDayItemProps> = ({
    day,
    index,
    singleDayEvents,
    multiDayEvents,
    today
}) => {
    if (day === null) {
        return (
            <div 
                className={`${styles.calendarDaysItem} ${
                    index % 7 === 6 ? styles.calendarDaysItemNoBorderRight : styles.calendarDaysItemBorderRight
                } ${
                    index >= 35 ? styles.calendarDaysItemNoBorderBottom : styles.calendarDaysItemBorderBottom
                }`}
            >
                <div className={styles.emptyDay}></div>
            </div>
        )
    }

    return (
        <div 
            className={`${styles.calendarDaysItem} ${
                index % 7 === 6 ? styles.calendarDaysItemNoBorderRight : styles.calendarDaysItemBorderRight
            } ${
                index >= 35 ? styles.calendarDaysItemNoBorderBottom : styles.calendarDaysItemBorderBottom
            }`}
        >
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
            
            {/* 통합 그리디 알고리즘으로 이벤트 배치 */}
            {(() => {
                const { visibleEvents, remainingCount } = assignEventLinesForDate(
                    singleDayEvents,
                    multiDayEvents,
                    day.id,
                    3 // maxVisibleEvents
                )
                
                return (
                    <>
                        {/* 모든 이벤트를 통합하여 렌더링 */}
                        {visibleEvents.map(event => {
                            const isTimeType = Record_RecordType[event.record.type] === Record_RecordType.TIME.toString()
                            
                            return (
                                <SingleDayEventElement
                                    key={`event-${event.record.id}-${day.id}`}
                                    event={event}
                                    isTimeType={isTimeType}
                                    style={{
                                        top: `${event.linePosition * 20 + 23}px`,
                                        backgroundColor: isTimeType ? 'none' : (event.record.recordGroup?.color || '#e0e0e0')
                                    }}
                                />
                            )
                        })}
                        
                        {/* 남은 이벤트 개수 표시 */}
                        {remainingCount > 0 && (
                            <div className={styles.remainingEventsCount}>
                                +{remainingCount}
                            </div>
                        )}
                    </>
                )
            })()}
        </div>
    )
}
