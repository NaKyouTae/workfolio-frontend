import React from 'react'
import { CalendarDay } from './types'
import { Record } from '../../../../../generated/common'
import dayjs from 'dayjs'

interface CalendarDayItemProps {
    day: CalendarDay | null
    weeks: (CalendarDay | null)[][]
    records: Record[]
    weekIndex?: number
    dayIndex?: number
}

/**
 * 캘린더 날짜 아이템 컴포넌트
 */
export const CalendarDayItemV2: React.FC<CalendarDayItemProps> = ({day, records, weeks, weekIndex = 0}) => {
    // 해당 날짜의 레코드 필터링 및 colSpan 계산
    const dayRecords = records.filter(record => {
        if (!day) return false
        
        const recordStartDate = dayjs(parseInt(record.startedAt.toString()))
        const recordEndDate = dayjs(parseInt(record.endedAt.toString()))
        
        // 현재 날짜를 기준으로 년월 정보 가져오기
        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1
        const dayDate = dayjs(`${year}-${String(month).padStart(2, '0')}-${String(day?.day).padStart(2, '0')}`)
        
        // 일정이 해당 날짜를 포함하는지 확인
        return (dayDate.isAfter(recordStartDate, 'day') || dayDate.isSame(recordStartDate, 'day')) && 
               (dayDate.isBefore(recordEndDate, 'day') || dayDate.isSame(recordEndDate, 'day'))
    }).map(record => {
        // 일정의 시작일과 종료일 계산
        const recordStartDate = dayjs(parseInt(record.startedAt.toString()))
        const recordEndDate = dayjs(parseInt(record.endedAt.toString()))
        
        // 현재 날짜를 기준으로 년월 정보 가져오기
        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1
        const dayDate = dayjs(`${year}-${String(month).padStart(2, '0')}-${String(day?.day).padStart(2, '0')}`)
        
        // 일정이 시작되는 날짜인지 확인
        const isStartDate = dayDate.isSame(recordStartDate, 'day')
        
        // 일정이 현재 주에서 몇 일 동안 지속되는지 계산
        let colSpan = 1
        if (isStartDate) {
            // 현재 주의 마지막 날짜
            const currentWeek = weeks[weekIndex] || []
            const lastDayOfWeek = currentWeek[currentWeek.length - 1]
            const lastDayDate = lastDayOfWeek ? 
                dayjs(`${year}-${String(month).padStart(2, '0')}-${String(lastDayOfWeek.day).padStart(2, '0')}`) : 
                dayDate
            
            // 일정이 현재 주에서 끝나는지 확인
            const endsInCurrentWeek = recordEndDate.isSame(lastDayDate, 'day') || recordEndDate.isBefore(lastDayDate, 'day')
            
            if (endsInCurrentWeek) {
                // 현재 주에서 끝나는 경우: 종료일까지의 일수 계산
                colSpan = recordEndDate.diff(recordStartDate, 'day') + 1
            } else {
                // 다음 주로 이어지는 경우: 현재 주의 마지막 날까지의 일수 계산
                colSpan = lastDayDate.diff(recordStartDate, 'day') + 1
            }
        }
        
        return {
            ...record,
            colSpan,
            isStartDate
        }
    }).filter(record => record.isStartDate) // 시작일인 일정만 표시

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
                        <td 
                            className="calendar-record-item-title" 
                            colSpan={record.colSpan}
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
                            }}
                        >
                            {record.title}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
