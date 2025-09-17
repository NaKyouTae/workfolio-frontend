import React, { useState } from 'react'
import { createDateModel, DateModel } from "@/app/models/DateModel"
import { Record } from '../../../../generated/common'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import MonthlyCalendarWeekdays from './MonthlyCalendarWeekdays'
import { useCalendarDays } from './calendar/hooks'
import styles from '@/styles/MonthlyCalendarV2.module.css'
import { CalendarDay } from './calendar/types'
import { CalendarDayItemV2 } from './calendar/CalendarDayItemV2'

dayjs.locale('ko')
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

interface MonthlyCalendarV2Props {
    initialDate: Date
    records: Record[]
}

/**
 * Table 태그를 사용한 MonthlyCalendarV2 컴포넌트
 */
export default function MonthlyCalendarV2({ initialDate, records }: MonthlyCalendarV2Props) {
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
        <table className="calendar-monthly">
            <MonthlyCalendarWeekdays />
            <tbody>
                {weeks.map((week, weekIndex) => (
                    <tr key={weekIndex}>
                        {week.map((day, dayIndex) => (
                            <td 
                                key={dayIndex}
                                className={`${dayIndex === 0 ? 'holiday' : ''} ${day?.isCurrentMonth && day?.id === today ? 'today' : ''}`}
                            >
                                {/* 날짜 표시 */}
                                {day && (
                                    <div>
                                        <p>{day.day}</p>
                                        <span></span>
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
    )
}
