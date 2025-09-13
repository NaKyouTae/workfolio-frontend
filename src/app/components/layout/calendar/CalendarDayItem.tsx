import React from 'react'
import { CalendarDay, CalendarEvent } from './types'
import { SingleDayEventElement } from './EventElement'
import { Record_RecordType } from "../../../../../generated/common"
import styles from '@/styles/MonthlyCalendarV2.module.css'

interface CalendarDayItemProps {
    day: CalendarDay | null
    index: number
    singleDayEvents: CalendarEvent[]
    today: string
}

/**
 * 캘린더 날짜 아이템 컴포넌트
 */
export const CalendarDayItem: React.FC<CalendarDayItemProps> = ({
    day,
    index,
    singleDayEvents,
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
            
            {/* 단일일 이벤트들을 렌더링 */}
            {singleDayEvents.map(event => {
                const isTimeType = Record_RecordType[event.record.type] === Record_RecordType.TIME.toString()
                
                return (
                    <SingleDayEventElement
                        key={`single-${event.record.id}-${day.id}`}
                        event={event}
                        isTimeType={isTimeType}
                        style={{
                            top: `${event.linePosition * 20 + 23}px`,
                            backgroundColor: isTimeType ? 'none' : (event.record.recordGroup?.color || '#e0e0e0')
                        }}
                    />
                )
            })}
        </div>
    )
}
