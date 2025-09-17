import React from 'react'
import { CalendarDay } from './types'

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
