import React from 'react'
import { Record, Record_RecordType } from '@/generated/common'
import dayjs from 'dayjs'

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
    // TIME 타입인 경우 시간 표시
    const getDisplayTitle = () => {
        if (Record_RecordType[record.type] == Record_RecordType.TIME.toString()) {
            const startTime = dayjs(parseInt(record.startedAt.toString())).format('A h:mm')
            return `${startTime} ${record.title}`
        }
        return record.title
    }

    return (
        <td 
            key={`event-${startDayIndex}`}
            colSpan={colSpan} 
            className="record" 
            onClick={(e) => onRecordClick(record, e)}
            title={
                isContinuation && continuesToNextWeek ? `${getDisplayTitle()} (이전 주에서 이어짐, 다음 주로 이어짐)` :
                isContinuation ? `${getDisplayTitle()} (이전 주에서 이어짐)` :
                continuesToNextWeek ? `${getDisplayTitle()} (다음 주로 이어짐)` : 
                getDisplayTitle()
            }
        >
            <p
                style={{
                    backgroundColor: record.recordGroup?.color || '#e0e0e0',
                }}
            >
                {getDisplayTitle()}
            </p>
        </td>
    )
}
