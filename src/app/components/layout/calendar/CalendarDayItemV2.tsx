import React from 'react'
import { CalendarDay, CalendarEvent } from './types'
import { SingleDayEventElement } from './EventElement'
import { assignEventLinesForDate } from './utils'
import { Record_RecordType } from "../../../../../generated/common"
import styles from '@/styles/MonthlyCalendarV2.module.css'

interface CalendarDayItemProps {
    day: CalendarDay | null
    weeks: (CalendarDay | null)[][]
}

/**
 * 캘린더 날짜 아이템 컴포넌트
 */
export const CalendarDayItemV2: React.FC<CalendarDayItemProps> = ({day}) => {
    return (
        <table>
            <tbody>
                <tr>
                    <td colSpan={7}>{day?.day}</td>
                </tr>
            </tbody>
        </table>
    )
}
