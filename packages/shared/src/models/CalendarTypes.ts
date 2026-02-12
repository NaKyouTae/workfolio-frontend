import { DateModel } from "./DateModel"
import { Record } from '../generated/common'

// Calendar view type definition
export type CalendarViewType = 'weekly' | 'monthly' | 'list';

export interface CalendarEvent {
    record: Record
    startDate: string
    endDate: string
    linePosition: number
    isMultiDay: boolean
    displayText: string
    timeText?: string
}

export interface CalendarDay {
    id: string
    day: number
    isCurrentMonth: boolean
}

export interface CalendarProps {
    date: DateModel
    recordType: CalendarViewType
    onTypeChange: (type: CalendarViewType) => void
    onPreviousMonth: () => void
    onNextMonth: () => void
    onTodayMonth: () => void
}

export interface EventElementProps {
    event: CalendarEvent
    isTimeType: boolean
    borderRadiusClass: string
    isStartingFromPreviousWeek: boolean
    shouldShowContinuationIndicator: boolean
    weekCount: number
    style: React.CSSProperties
}
