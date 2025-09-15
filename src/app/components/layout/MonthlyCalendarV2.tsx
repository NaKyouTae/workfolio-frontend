import React, { useState } from 'react'
import { createDateModel, DateModel } from "@/app/models/DateModel"
import { Record } from '../../../../generated/common'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import MonthlyCalendarWeekdays from './MonthlyCalendarWeekdays'
import { useCalendarDays } from './calendar/hooks'
import styles from '@/styles/MonthlyCalendarV2.module.css'
import { CalendarDay } from './calendar/types'
import { CalendarDayItemV2 } from './calendar/CalendarDayItemV2'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/SEOUL')


interface MonthlyCalendarV2Props {
    initialDate: Date
    records: Record[]
}

/**
 * Table 태그를 사용한 MonthlyCalendarV2 컴포넌트
 */
export default function MonthlyCalendarV2({ initialDate }: MonthlyCalendarV2Props) {
    const [date, setDate] = useState<DateModel>(() => {
        const d = new Date(initialDate)
        return createDateModel(d.getFullYear(), d.getMonth(), d.getDate(), true)
    })

    // 커스텀 훅 사용
    const calendarDays = useCalendarDays(date)

    // 오늘 날짜 확인
    const today = dayjs().format('YYYYMMDD')

    // 주별로 날짜들을 그룹화
    const weeks: (CalendarDay | null)[][] = []
    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(calendarDays.slice(i, i + 7))
    }

    return (
        <div className={styles.calendarContainer}>
            <MonthlyCalendarWeekdays />
            
            <div className={styles.calendarContent}>
                <table className={styles.calendarTable}>
                    <tbody>
                        {weeks.map((week, weekIndex) => (
                            <tr key={weekIndex} className={styles.calendarWeekRow}>
                                {week.map((day, dayIndex) => (
                                    <td key={dayIndex}
                                        className={`${styles.calendarDayCell} ${
                                            dayIndex === 6 ? styles.calendarDayCellLast : ''
                                        }`}
                                    >
                                        {/* 날짜 표시 */}
                                        {day && (
                                            <div className={`${styles.calendarDays} ${
                                                dayIndex === 0 
                                                    ? (day.isCurrentMonth ? styles.calendarDaysSunday : styles.calendarDaysSundayPreviousMonth)
                                                    : (day.isCurrentMonth ? styles.calendarDaysCurrentMonth : styles.calendarDaysOtherMonth)
                                            }`}>
                                                {day.day}
                                                {/* 오늘 날짜에 동그라미 표시 */}
                                                {day.isCurrentMonth && day.id === today && (
                                                    <div className={styles.todayCircle} />
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* 여기에 스케줄을 추가할 수 있습니다 */}
                                        <CalendarDayItemV2 key={dayIndex} weeks={weeks} day={day} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
