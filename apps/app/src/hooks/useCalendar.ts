import { useMemo } from 'react'
import { Record } from '@workfolio/shared/generated/common'
import { DateModel } from '@workfolio/shared/models/DateModel'
import { generateCalendarDays, generateCalendarEvents } from '@workfolio/shared/utils/calendarUtils'
import { CalendarEvent } from '@workfolio/shared/models/CalendarTypes'
import { getSingleDayEventsForDate } from '@workfolio/shared/utils/calendarUtils'
import { getMultiDayEvents } from '@workfolio/shared/utils/calendarUtils'

/**
 * 캘린더 날짜들을 관리하는 훅
 */
export const useCalendarDays = (date: DateModel) => {
    return useMemo(() => generateCalendarDays(date), [date])
}

/**
 * 캘린더 이벤트들을 관리하는 훅
 */
export const useCalendarEvents = (
    records: Record[] | undefined,
    checkedGroups: Set<string>
) => {
    return useMemo(() => generateCalendarEvents(records, checkedGroups), [records, checkedGroups])
}

/**
 * 특정 날짜의 단일일 이벤트들을 관리하는 훅
 */
export const useSingleDayEvents = (events: CalendarEvent[], dateId: string) => {
    return useMemo(() => getSingleDayEventsForDate(events, dateId), [events, dateId])
}

/**
 * 모든 단일일 이벤트들을 날짜별로 그룹화하는 훅
 */
export const useSingleDayEventsByDate = (events: CalendarEvent[]) => {
    return useMemo(() => {
        const eventsByDate = new Map<string, CalendarEvent[]>()
        events.forEach(event => {
            if (!event.isMultiDay) {
                if (!eventsByDate.has(event.startDate)) {
                    eventsByDate.set(event.startDate, [])
                }
                eventsByDate.get(event.startDate)!.push(event)
            }
        })
        return eventsByDate
    }, [events])
}

/**
 * 멀티데이 이벤트들을 관리하는 훅
 */
export const useMultiDayEvents = (events: CalendarEvent[]) => {
    return useMemo(() => getMultiDayEvents(events), [events])
}
