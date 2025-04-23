// src/components/MonthlyCalendar.tsx
import React, {useMemo, useState} from 'react'
import {createDateModel, DateModel} from "@/app/models/DateModel"
import RecordCreateModal from "@/app/components/layout/RecordCreateModal"
import RecordList from "@/app/components/layout/RecordList"
import {Record} from "../../../../generated/common"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/SEOUL')

interface MonthlyCalendarProps {
    initialDate: Date; // 초기 날짜
    records: Record[]; // 날짜를 키로 하는 할 일 목록
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({initialDate, records}) => {
    const [date, setDate] = useState(initialDate)
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    const weekdays = ['일', '월', '화', '수', '목', '금', '토']
    
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
    
    const getRecordsByDateId = (dateId: string) => {
        if (records == null || records.length == 0) return []
        
        return records
            .map(record => {
                const startDate = dayjs(dayjs().toDate().setTime(record.startedAt)).format('YYYYMMDD')
                const endDate = dayjs(dayjs().toDate().setTime(record.endedAt)).format('YYYYMMDD')
                
                return {
                    ...record,
                    formattedStartDate: startDate,
                    formattedEndDate: endDate,
                    title: (startDate === dateId || endDate === dateId) ? record.title : ''
                }
            })
            // .filter(todo => todo.formattedStartDate <= dateId && todo.formattedEndDate >= dateId)
    }
    
    const getDaysInPreviousMonth = (year: number, month: number) => {
        const prevMonth = month === 0 ? 11 : month - 1
        const prevYear = month === 0 ? year - 1 : year
        return new Date(prevYear, prevMonth + 1, 0).getDate()
    }
    
    const calculateCalendarDays = (year: number, month: number) => {
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
    }
    
    const calendarDays = useMemo(() => {
        return calculateCalendarDays(date.getFullYear(), date.getMonth())
    }, [date]) // date가 변경될 때만 재계산
    
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
    
    const handleDoubleClick = () => {
        setIsModalOpen(true) // 모달 열기
    }
    
    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <div style={{flexShrink: 0}}>
                <div className="calendar-header">
                    <div className="calendar-title">
                        {`${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}`}
                    </div>
                    <div style={{
                        marginLeft: '10px',
                        display: 'flex',
                        background: '#f5f5f5',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}>
                        <button className="calendar-navigation-button" onClick={handlePreviousMonth}>&lt;</button>
                        <button className="calendar-navigation-button" onClick={handleNextMonth}>&gt;</button>
                        <button className="calendar-navigation-button" onClick={handleTodayMonth}>오늘</button>
                    </div>
                </div>
                <div className="calendar-days-header" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '0px',
                    marginBottom: '0px',
                    borderTop: '1px solid #e0e0e0'
                }}>
                    {weekdays.map((day, index) => (
                        <div key={day} style={{
                            textAlign: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: day === '일' ? 'red' : day === '토' ? 'blue' : 'black',
                            padding: '10px',
                            borderRight: index === 6 ? 'none' : '1px solid #e0e0e0',
                            borderBottom: '1px solid #e0e0e0'
                        }}>
                            {day}
                        </div>
                    ))}
                </div>
            </div>
            <div style={{
                flex: 1,
                display: 'flex',
                minHeight: 0
            }}>
                <div className="calendar-days-container" >
                    {calendarDays.map((day, index) => (
                        <div 
                            key={index} 
                            className={"calendar-days-item"} 
                            onDoubleClick={handleDoubleClick}
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
                                    {getRecordsByDateId(day.id).map(todo => {
                                        return (
                                            <div className={"calendar-days-record"}>
                                                {todo.formattedStartDate <= day.id && todo.formattedEndDate >= day.id
                                                    ? <RecordList key={todo.title} record={todo}/>
                                                    : <div></div>}
                                            </div>
                                        );
                                    })}
                                </>
                            ) : (
                                <div style={{color: '#888'}}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <RecordCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
        </div>
    )
}

export default MonthlyCalendar

