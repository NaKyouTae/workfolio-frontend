import React from 'react'
import { CalendarEvent, CalendarDay } from './types'
import { MultiDayEventElement } from './EventElement'
import { 
    getBorderRadiusClass,
    isContinuingToNextWeek,
    isStartingFromPreviousWeek,
    isLastDayOfWeek
} from './utils'
import { Record_RecordType } from "../../../../../generated/common"

interface ContinuousEventElementsProps {
    events: CalendarEvent[]
    calendarDays: (CalendarDay | null)[]
}

/**
 * 연속된 멀티데이 이벤트 엘리먼트들을 생성하는 컴포넌트
 */
export const ContinuousEventElements: React.FC<ContinuousEventElementsProps> = ({
    events,
    calendarDays
}) => {
    const elements = React.useMemo(() => {
        const result: React.ReactElement[] = []
        
        events.forEach(event => {
            const startDayIndex = calendarDays.findIndex(day => day?.id === event.startDate)
            const endDayIndex = calendarDays.findIndex(day => day?.id === event.endDate)
            
            if (startDayIndex === -1 || endDayIndex === -1) return
            
            // 주간별로 이벤트를 분할하여 처리
            let currentIndex = startDayIndex
            let weekCount = 0
            
            while (currentIndex <= endDayIndex) {
                const currentRow = Math.floor(currentIndex / 7)
                const currentColumn = currentIndex % 7
                
                // 현재 주에서 이벤트가 끝나는 위치 계산
                const weekEndIndex = Math.min(currentRow * 7 + 6, endDayIndex)
                const weekSpanDays = weekEndIndex - currentIndex + 1
                
                // 각 주별로 이벤트 엘리먼트 생성
                const isTimeType = Record_RecordType[event.record.type] === Record_RecordType.TIME.toString()
                
                const borderRadiusClass = getBorderRadiusClass(
                    isTimeType,
                    weekCount,
                    weekEndIndex,
                    endDayIndex
                )
                
                const isContinuing = isContinuingToNextWeek(weekEndIndex, endDayIndex)
                const isStarting = isStartingFromPreviousWeek(weekCount)
                const isLastDay = isLastDayOfWeek(currentIndex, weekEndIndex, endDayIndex)
                
                const shouldShowContinuationIndicator = isContinuing && isLastDay
                
                result.push(
                    <MultiDayEventElement
                        key={`continuous-${event.record.id}-week-${weekCount}`}
                        event={event}
                        isTimeType={isTimeType}
                        borderRadiusClass={borderRadiusClass}
                        isStartingFromPreviousWeek={isStarting}
                        shouldShowContinuationIndicator={shouldShowContinuationIndicator}
                        weekCount={weekCount}
                        style={{
                            top: `${currentRow * 100 + event.linePosition * 20 + 23}px`,
                            left: `${currentColumn * (100 / 7)}%`,
                            width: `calc(${weekSpanDays * (100 / 7)}% - 4px)`,
                            backgroundColor: isTimeType ? 'none' : (event.record.recordGroup?.color || '#e0e0e0')
                        }}
                    />
                )
                
                // 다음 주로 이동
                currentIndex = weekEndIndex + 1
                weekCount++
            }
        })
        
        return result
    }, [events, calendarDays])
    
    return <>{elements}</>
}
