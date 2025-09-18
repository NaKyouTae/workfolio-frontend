import { DateModel } from "@/models/DateModel"
import { Record } from "../../../../../generated/common"

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
    recordType: string
    onTypeChange: (type: string) => void
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
