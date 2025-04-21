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
        <div style={{height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <div style={{padding: '5px'}}>
                <h2>{date.toLocaleDateString('ko-KR', {year: 'numeric', month: 'long'})}</h2>
                <div style={{marginBottom: '20px'}}>
                    <button onClick={handlePreviousMonth} style={{marginRight: '10px'}}>이전 달</button>
                    <button onClick={handleTodayMonth} style={{marginRight: '10px'}}>오늘</button>
                    <button onClick={handleNextMonth}>다음 달</button>
                </div>
                <div
                    style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginBottom: '10px'}}>
                    {weekdays.map((day) => (
                        <div key={day} style={{
                            textAlign: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: day === '일' ? 'red' : 'black'
                        }}>
                            {day}
                        </div>
                    ))}
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gridAutoRows: '100px',
                }}>
                    {calendarDays.map((day, index) => (
                        <div key={index} className={"calendar-days-containers"} onDoubleClick={handleDoubleClick}>
                            {day !== null ? (
                                <>
                                    <div className={"calendar-days"}
                                         style={{color: day.isCurrentMonth ? '#000' : '#888'}}>
                                        {day.day === 1 ? `${day.month}월 ${day.day}일` : `${day.day}일`}
                                    </div>
                                    {/* Todo들을 span 태그로 감싸서 colspan과 같은 효과를 낼 수 있도록 수정 */}
                                    {getRecordsByDateId(day.id).map(todo => {
                                        return (
                                            todo.formattedStartDate <= day.id && todo.formattedEndDate >= day.id
                                                ? <RecordList key={todo.title} record={todo} />
                                                : <div>tt</div>
                                        );
                                    })}
                                </>
                            ) : (
                                <div style={{color: '#888'}}></div> // 빈 공간을 위한 div
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

