// src/components/MonthlyCalendar.tsx
import React, {useMemo, useState, useCallback} from 'react'
import {createDateModel, DateModel} from "@/app/models/DateModel"
import RecordList from "@/app/components/layout/RecordList"
import {Record, Record_RecordType} from "../../../../generated/common"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import MonthlyCalendarHeader from './MonthlyCalendarHeader'
import MonthlyCalendarWeekdays from './MonthlyCalendarWeekdays'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/SEOUL')

type RecordType = 'weekly' | 'monthly' | 'list';

interface MonthlyCalendarProps {
    initialDate: Date; // 초기 날짜
    records: Record[]; // 날짜를 키로 하는 할 일 목록
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({initialDate, records}) => {
    const [date, setDate] = useState(initialDate)
    const [recordType, setRecordType] = useState<RecordType>('monthly')
    const { checkedGroups } = useRecordGroupStore()
    
    const getDaysInMonth = (year: number, month: number) => {
        const days: DateModel[] = []
        const lastDay = new Date(year, month + 1, 0).getDate()
        
        for (let day = 1; day <= lastDay; day++) {
            days.push(createDateModel(year, month + 1, day, true))
        }
        
        return days
    }
    
    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay() // 해당 월의 첫 번째 날의 요일
    }
    
    // MULTI_DAY 레코드가 연속된 날짜에 걸쳐 있는지 확인하는 함수
    const isMultiDayRecord = useMemo(() => {
        return (record: Record) => {
            const startDate = dayjs(Number(record.startedAt)).format('YYYYMMDD')
            const endDate = dayjs(Number(record.endedAt)).format('YYYYMMDD')
            return record.type === Record_RecordType.MULTI_DAY && startDate !== endDate
        }
    }, [])
    
    // MULTI_DAY 레코드의 연속된 날짜 범위를 계산하는 함수
    const getMultiDayDateRange = useMemo(() => {
        return (record: Record) => {
            const startDate = dayjs(Number(record.startedAt))
            const endDate = dayjs(Number(record.endedAt))
            const dates = []
            let current = startDate
            
            while (current.isSame(endDate) || current.isBefore(endDate)) {
                dates.push(current.format('YYYYMMDD'))
                current = current.add(1, 'day')
            }
            
            return dates
        }
    }, [])
    
    const getRecordsByDateId = useMemo(() => {
        return (dateId: string) => {
            if (records == null || records.length == 0) return []
            
            // API 응답 순서를 유지하면서 해당 날짜에 해당하는 레코드들만 필터링
            return records
                .filter(record => record.recordGroup && checkedGroups.has(record.recordGroup.id))
                .filter(record => {
                    const startDate = dayjs(Number(record.startedAt)).format('YYYYMMDD')
                    const endDate = dayjs(Number(record.endedAt)).format('YYYYMMDD')
                    
                    // 해당 날짜가 레코드의 시작일과 종료일 사이에 있는지 확인
                    return dateId >= startDate && dateId <= endDate
                })
                .map(record => {
                    const startDate = dayjs(Number(record.startedAt)).format('YYYYMMDD')
                    const endDate = dayjs(Number(record.endedAt)).format('YYYYMMDD')
                    
                    return {
                        ...record,
                        formattedStartDate: startDate,
                        formattedEndDate: endDate
                    }
                })
        }
    }, [records, checkedGroups])
    
    
    const getDaysInPreviousMonth = (year: number, month: number) => {
        const prevMonth = month === 0 ? 11 : month - 1
        const prevYear = month === 0 ? year - 1 : year
        return new Date(prevYear, prevMonth + 1, 0).getDate()
    }
    
    const calculateCalendarDays = useCallback((year: number, month: number) => {
        const firstDayIndex = getFirstDayOfMonth(year, month)
        const prevMonthDaysCount = getDaysInPreviousMonth(year, month)
        const days = getDaysInMonth(year, month)
        
        const calendarDays: (DateModel | null)[] = Array(42).fill(null) // 6주 기준으로 날짜 배열 생성
        
        // 이전 달 날짜 추가
        for (let i = 0; i < firstDayIndex; i++) {
            const day = prevMonthDaysCount - (firstDayIndex - i - 1)
            calendarDays[i] = createDateModel(year, month, day, false)
        }
        
        // 현재 달 날짜 추가
        days.forEach((day) => {
            calendarDays[firstDayIndex + day.day - 1] = day
        })
        
        const lastDayOfCurrentMonth = days.length // 다음 달 날짜 추가
        const emptySpacesCount = 42 - (firstDayIndex + lastDayOfCurrentMonth) // 빈 공간을 채우기 위해 다음 달 날짜 추가
        
        for (let i = 0; i < emptySpacesCount; i++) {
            calendarDays[firstDayIndex + lastDayOfCurrentMonth + i] = createDateModel(year, month + 2, i + 1, false)
        }
        
        return calendarDays
    }, [])
    
    const calendarDays = useMemo(() => {
        return calculateCalendarDays(date.getFullYear(), date.getMonth())
    }, [date, calculateCalendarDays]) // date와 calculateCalendarDays가 변경될 때만 재계산
    
    const handlePreviousMonth = () => {
        setDate((prevDate) => {
            const newDate = new Date(prevDate)
            newDate.setMonth(newDate.getMonth() - 1) // 이전 달로 변경
            return newDate
        })
    }
    
    const handleTodayMonth = () => {
        setDate(() => {
            const newDate = new Date()
            newDate.setMonth(newDate.getMonth()) // 이번 달로 변경
            return newDate
        })
    }
    
    const handleNextMonth = () => {
        setDate((prevDate) => {
            const newDate = new Date(prevDate)
            newDate.setMonth(newDate.getMonth() + 1) // 다음 달로 변경
            return newDate
        })
    }

    const handleTypeChange = (type: RecordType) => {
        setRecordType(type);
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <MonthlyCalendarHeader 
                date={date}
                recordType={recordType}
                onTypeChange={handleTypeChange}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
                onTodayMonth={handleTodayMonth}
            />
            <MonthlyCalendarWeekdays />
            <div style={{
                flex: 1,
                display: 'flex',
                minHeight: 0
            }}>
                <div className="calendar-days-container">
                    {calendarDays.map((day, index) => (
                        <div 
                            key={index} 
                            className={"calendar-days-item"} 
                            style={{
                                height: '100%',
                                borderRight: index % 7 === 6 ? 'none' : '1px solid #e0e0e0',
                                borderBottom: index >= 35 ? 'none' : '1px solid #e0e0e0'
                            }}
                        >
                            {day !== null ? (
                                <>
                                    <div className={"calendar-days"}
                                         style={{
                                             color: index % 7 === 0 
                                                 ? (day.isCurrentMonth ? '#ff0000' : '#ffb3b3') 
                                                 : (day.isCurrentMonth ? '#000' : '#888')
                                         }}>
                                        {day.day}
                                    </div>
                                    {getRecordsByDateId(day.id).map(record => {
                                        const isMultiDay = isMultiDayRecord(record)
                                        const multiDayDates = isMultiDay ? getMultiDayDateRange(record) : []
                                        const isStartDate = isMultiDay && multiDayDates[0] === day.id
                                        const isInRange = isMultiDay && multiDayDates.includes(day.id)
                                        
                                        if (isMultiDay && isStartDate) {
                                            // MULTI_DAY 레코드의 시작일에서만 실제 내용을 표시하고 연속된 라인 효과를 위한 스타일 적용
                                            return (
                                                <div 
                                                    key={`multi-start-${record.id}-${day.id}`}
                                                    className="calendar-days-record multi-day-start"
                                                    style={{
                                                        position: 'relative',
                                                        overflow: 'visible'
                                                    }}
                                                >
                                                    <div 
                                                        className="multi-day-continuous"
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            height: '17px',
                                                            zIndex: 1,
                                                            background: record.recordGroup?.color || '#e0e0e0',
                                                            borderRadius: '3px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            padding: '0 4px'
                                                        }}
                                                    >
                                                        <RecordList record={record}/>
                                                    </div>
                                                </div>
                                            )
                                        } else if (isMultiDay && isInRange) {
                                            // MULTI_DAY 레코드의 연속된 날짜에서는 빈 공간을 유지하여 연속된 라인 효과 생성
                                            return (
                                                <div 
                                                    key={`multi-continue-${record.id}-${day.id}`}
                                                    className="calendar-days-record multi-day-continue"
                                                    style={{
                                                        height: '17px',
                                                        position: 'relative',
                                                        zIndex: 0,
                                                        background: record.recordGroup?.color || '#e0e0e0',
                                                        borderRadius: '3px',
                                                        margin: '1px 0'
                                                    }}
                                                />
                                            )
                                        } else {
                                            // 일반 레코드 (TIME, DAY, 단일일 MULTI_DAY)
                                            return (
                                                <div key={`${record.id}-${day.id}`} className={"calendar-days-record"}>
                                                    <RecordList record={record}/>
                                                </div>
                                            )
                                        }
                                    })}
                                </>
                            ) : (
                                <div style={{color: '#888'}}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MonthlyCalendar

