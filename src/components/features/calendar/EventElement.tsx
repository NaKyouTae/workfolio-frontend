import React from 'react'
import { CalendarEvent, EventElementProps } from './types'
import styles from '@/styles/MonthlyCalendarV2.module.css'

/**
 * 멀티데이 이벤트 엘리먼트 컴포넌트
 */
export const MultiDayEventElement: React.FC<EventElementProps> = ({
    event,
    isTimeType,
    borderRadiusClass,
    isStartingFromPreviousWeek,
    shouldShowContinuationIndicator,
    weekCount,
    style
}) => {
    return (
        <div
            className={`${styles.schedule} ${styles.scheduleMultiDay} ${isTimeType ? styles.timeEvent : ''} ${borderRadiusClass}`}
            style={style}
        >
            {isStartingFromPreviousWeek && (
                <span className={styles.startIndicator}>
                    &lt;
                </span>
            )}
            {weekCount === 0 && (
                <span className={styles.eventTitle}>
                    멀티 {event.displayText}
                </span>
            )}
            {shouldShowContinuationIndicator && (
                <span className={styles.continuationIndicator}>
                    &gt;
                </span>
            )}
        </div>
    )
}

/**
 * 단일일 이벤트 엘리먼트 컴포넌트
 */
interface SingleDayEventElementProps {
    event: CalendarEvent
    isTimeType: boolean
    style: React.CSSProperties
}

export const SingleDayEventElement: React.FC<SingleDayEventElementProps> = ({
    event,
    isTimeType,
    style
}) => {
    return (
        <div
            className={`${styles.schedule} ${styles.scheduleSingleDay} ${isTimeType ? styles.timeEvent : ''}`}
            style={style}
        >
            <span className={styles.eventTitle}>
                싱글 {event.displayText}
            </span>
        </div>
    )
}
