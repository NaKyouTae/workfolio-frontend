import React, { useState, useCallback } from 'react'
import { createDateModel, DateModel } from "@/app/models/DateModel"
import { Record } from "../../../../generated/common"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import MonthlyCalendarHeader from './MonthlyCalendarHeader'
import MonthlyCalendarWeekdays from './MonthlyCalendarWeekdays'
import { CalendarDayItem } from './calendar/CalendarDayItem'
import { ContinuousEventElements } from './calendar/ContinuousEventElements'
import { useCalendarDays, useCalendarEvents, useSingleDayEventsByDate, useMultiDayEvents } from './calendar/hooks'
import styles from '@/styles/MonthlyCalendarV2.module.css'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/SEOUL')

type RecordType = 'weekly' | 'monthly' | 'list'

interface MonthlyCalendarV2Props {
    initialDate: Date
    records: Record[]
}

/**
 * 모듈화된 MonthlyCalendarV2 컴포넌트
 */
export default function MonthlyCalendarV2({ initialDate, records }: MonthlyCalendarV2Props) {
    const [date, setDate] = useState<DateModel>(() => {
        const d = new Date(initialDate)
        return createDateModel(d.getFullYear(), d.getMonth(), d.getDate(), true)
    })
    const [recordType, setRecordType] = useState<RecordType>('monthly')
    const { checkedGroups } = useRecordGroupStore()

    // 커스텀 훅 사용
    const calendarDays = useCalendarDays(date)
    const calendarEvents = useCalendarEvents(records, checkedGroups)
    const singleDayEventsByDate = useSingleDayEventsByDate(calendarEvents)
    const multiDayEvents = useMultiDayEvents(calendarEvents)

    // 이벤트 핸들러들
    const handleTypeChange = useCallback((type: string) => {
        setRecordType(type as RecordType)
    }, [])

    const handlePreviousMonth = useCallback(() => {
        setDate(prev => {
            const newDate = dayjs(`${prev.year}-${(prev.month + 1).toString().padStart(2, '0')}-01`)
                .subtract(1, 'month')
            return createDateModel(newDate.year(), newDate.month(), newDate.date(), true)
        })
    }, [])

    const handleNextMonth = useCallback(() => {
        setDate(prev => {
            const newDate = dayjs(`${prev.year}-${(prev.month + 1).toString().padStart(2, '0')}-01`)
                .add(1, 'month')
            return createDateModel(newDate.year(), newDate.month(), newDate.date(), true)
        })
    }, [])

    const handleTodayMonth = useCallback(() => {
        const today = new Date()
        setDate(createDateModel(today.getFullYear(), today.getMonth(), today.getDate(), true))
    }, [])

    // 오늘 날짜 확인
    const today = dayjs().format('YYYYMMDD')

    // DateModel을 Date로 변환 (DateModel의 month는 0부터 시작)
    const dateAsDate = new Date(date.year, date.month, date.day)

    return (
        <div className={styles.calendarContainer}>
            <MonthlyCalendarHeader 
                date={dateAsDate}
                recordType={recordType}
                onTypeChange={handleTypeChange}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
                onTodayMonth={handleTodayMonth}
            />
            <MonthlyCalendarWeekdays />
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