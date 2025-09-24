import React from 'react'
import { Record } from '@/generated/common'

interface MonthlyCalendarItemProps {
    record: Record
    startDayIndex: number
    colSpan: number
    isContinuation: boolean
    continuesToNextWeek: boolean
    onRecordClick: (record: Record, event: React.MouseEvent<HTMLTableCellElement>) => void
}

export default function MonthlyCalendarItem({
    record,
    startDayIndex,
    colSpan,
    isContinuation,
    continuesToNextWeek,
    onRecordClick
}: MonthlyCalendarItemProps) {
    return (
        <td 
            key={`event-${startDayIndex}`}
            colSpan={colSpan} 
            className="record" 
            onClick={(e) => onRecordClick(record, e)}
            title={
                isContinuation && continuesToNextWeek ? `${record.title} (이전 주에서 이어짐, 다음 주로 이어짐)` :
                isContinuation ? `${record.title} (이전 주에서 이어짐)` :
                continuesToNextWeek ? `${record.title} (다음 주로 이어짐)` : 
                record.title
            }
        >
            <p
                style={{
                    backgroundColor: record.recordGroup?.color || '#e0e0e0',
                }}
            >
                {record.title}
            </p>
        </td>
    )
}
