import React from 'react'
import { CalendarDay } from './types'
import { Record } from '../../../../../generated/common'
import dayjs from 'dayjs'

interface CalendarDayItemProps {
    day: CalendarDay | null
    weeks: (CalendarDay | null)[][]
    records: Record[]
}

/**
 * 캘린더 날짜 아이템 컴포넌트
 */
export const CalendarDayItemV2: React.FC<CalendarDayItemProps> = ({day, records}) => {
    // 해당 날짜의 레코드 필터링
    const dayRecords = records.filter(record => {
        if (!day) return false
        
        const recordDate = dayjs(parseInt(record.startedAt.toString())).format('YYYY-MM-DD')
        // 현재 날짜를 기준으로 년월 정보 가져오기
        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1
        const dayDate = dayjs(`${year}-${String(month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`).format('YYYY-MM-DD')
        
        return recordDate === dayDate
    })

    return (
        <table className="calendar-day-content">
            <tbody>
                {dayRecords.map((record, index) => (
                    <tr key={index} className="calendar-record-item" 
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: record.recordGroup?.color || '#e0e0e0',
                        }}
                    >
                        <td className="calendar-record-item-title" 
                            colSpan={3}
                            style={{
                                color: 'white',
                                width: '100%',
                                height: '100%',
                                padding: '0 4px',
                                margin: '1px 0',
                                borderRadius: '3px',
                                fontSize: '10px',
                                textAlign: 'center',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>{record.title}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
