import React, { useState } from 'react'
import { createDateModel, DateModel } from "@/models/DateModel"
import { Record } from "../../../../../../generated/common"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import CalendarWeekdays from '../CalendarWeekdays'
import { CalendarDayItem } from '../CalendarDayItem'
import { ContinuousEventElements } from '../ContinuousEventElements'
import { useCalendarDays, useCalendarEvents, useSingleDayEventsByDate, useMultiDayEvents } from '../hooks'
import styles from '@/styles/MonthlyCalendarV2.module.css'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/SEOUL')

interface MonthlyCalendarProps {
    initialDate: Date
    records: Record[]
}

/**
 * 모듈화된 MonthlyCalendarV2 컴포넌트
 */
export default function MonthlyCalendar({ initialDate, records }: MonthlyCalendarProps) {
    const [date, setDate] = useState<DateModel>(() => {
        const d = new Date(initialDate)
        return createDateModel(d.getFullYear(), d.getMonth(), d.getDate(), true)
    })
    const { checkedGroups } = useRecordGroupStore()

    // 커스텀 훅 사용
    const calendarDays = useCalendarDays(date)
    const calendarEvents = useCalendarEvents(records, checkedGroups)
    const singleDayEventsByDate = useSingleDayEventsByDate(calendarEvents)
    const multiDayEvents = useMultiDayEvents(calendarEvents)

    // 오늘 날짜 확인
    const today = dayjs().format('YYYYMMDD')

    return (
        <div className={styles.calendarContainer}>
            <CalendarWeekdays />
            <div className={styles.calendarContent}>
                <div className={`${styles.monthlyCalendar} ${styles.calendarDaysContainer}`}>
                    {calendarDays.map((day, index) => {
                        const singleDayEvents = day ? (singleDayEventsByDate.get(day.id) || []) : []
                        
                        return (
                            <CalendarDayItem
                                key={index}
                                day={day}
                                index={index}
                                singleDayEvents={singleDayEvents}
                                multiDayEvents={multiDayEvents} 
                                today={today}
                            />
                        )
                    })}
                    
                    {/* 연속된 멀티데이 이벤트들을 캘린더 컨테이너에 직접 배치 */}
                    <ContinuousEventElements
                        events={multiDayEvents}
                        calendarDays={calendarDays}
                    />
                </div>
            </div>
        </div>
    )
}