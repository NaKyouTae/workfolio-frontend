import React, { useState } from 'react'
import { createDateModel, DateModel } from "@/models/DateModel"
import { Record } from '../../../../../../generated/common'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { useCalendarDays } from '../hooks'
import { CalendarDay } from '../types'

dayjs.locale('ko')
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

interface MonthlyCalendarV1Props {
    initialDate: Date
    records: Record[]
}

/**
 * Table 태그를 사용한 MonthlyCalendarV1 컴포넌트
 */
export default function MonthlyCalendarV1({ initialDate, records }: MonthlyCalendarV1Props) {
    const [date] = useState<DateModel>(() => {
        const d = new Date(initialDate)
        return createDateModel(d.getFullYear(), d.getMonth(), d.getDate(), true)
    })

    // 커스텀 훅 사용
    const calendarDays = useCalendarDays(date)

    // 주별로 날짜들을 그룹화
    const weeks: (CalendarDay | null)[][] = []
    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(calendarDays.slice(i, i + 7))
    }

    // 일정을 렌더링하는 함수
    const renderRecords = (week: (CalendarDay | null)[]) => {
        // 현재 날짜를 기준으로 년월 정보 가져오기
        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1

        // 해당 주의 모든 일정을 수집
        const weekRecords: Array<{
            record: Record;
            startDayIndex: number;
            colSpan: number;
        }> = []

        week.forEach((day, dayIndex) => {
            if (!day) return

            const dayDate = dayjs(`${year}-${String(month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`)

            // 해당 날짜의 레코드 필터링
            const dayRecords = records.filter(record => {
                const recordStartDate = dayjs(parseInt(record.startedAt.toString()))
                const recordEndDate = dayjs(parseInt(record.endedAt.toString()))

                // 일정이 해당 날짜를 포함하는지 확인
                return (dayDate.isAfter(recordStartDate, 'day') || dayDate.isSame(recordStartDate, 'day')) &&
                       (dayDate.isBefore(recordEndDate, 'day') || dayDate.isSame(recordEndDate, 'day'))
            })


            dayRecords.forEach(record => {
                const recordStartDate = dayjs(parseInt(record.startedAt.toString()))
                const recordEndDate = dayjs(parseInt(record.endedAt.toString()))
                
                // 일정이 시작되는 날짜인지 확인
                const isStartDate = dayDate.isSame(recordStartDate, 'day')
                
                if (isStartDate) {
                    // 일정이 현재 주에서 몇 일 동안 지속되는지 계산
                    let colSpan = 1
                    
                    // 현재 주의 마지막 날짜 (null이 아닌 마지막 날짜 찾기)
                    const lastDayOfWeek = week.findLast(day => day !== null)
                    const lastDayDate = lastDayOfWeek ? 
                        dayjs(`${year}-${String(month).padStart(2, '0')}-${String(lastDayOfWeek.day).padStart(2, '0')}`) : dayDate
                    
                    // 일정이 현재 주에서 끝나는지 확인
                    const endsInCurrentWeek = recordEndDate.isSame(lastDayDate, 'day') || recordEndDate.isBefore(lastDayDate, 'day')
                    
                    if (endsInCurrentWeek) {
                        // 현재 주에서 끝나는 경우: 시작일부터 종료일까지의 일수 계산 (마감일 포함)
                        // dayjs의 diff 계산 문제를 해결하기 위해 날짜만 비교
                        const startDateOnly = recordStartDate.startOf('day')
                        const endDateOnly = recordEndDate.startOf('day')
                        colSpan = endDateOnly.diff(startDateOnly, 'day') + 1
                    } else {
                        // 다음 주로 이어지는 경우: 시작일부터 현재 주의 마지막 날까지의 일수 계산 (마감일 포함)
                        // dayjs의 diff 계산 문제를 해결하기 위해 날짜만 비교
                        const startDateOnly = recordStartDate.startOf('day')
                        const endDateOnly = lastDayDate.startOf('day')
                        colSpan = endDateOnly.diff(startDateOnly, 'day') + 1
                        
                        // 다음 주로 이어지는 일정임을 표시하기 위한 특별한 처리
                        // colSpan이 7을 넘지 않도록 제한 (한 주는 7일)
                        colSpan = Math.min(colSpan, 7 - dayIndex)
                    }

                    // colSpan이 1 이상인 경우만 추가
                    if (colSpan > 0) {
                        weekRecords.push({
                            record,
                            startDayIndex: dayIndex,
                            colSpan
                        })
                    }
                } else {
                    // 일정이 현재 주 이전에 시작되어 현재 주에서 계속되는 경우
                    const recordStartDate = dayjs(parseInt(record.startedAt.toString()))
                    const recordEndDate = dayjs(parseInt(record.endedAt.toString()))
                    
                    // 현재 주의 첫 번째 날짜
                    const firstDayOfWeek = week.find(day => day !== null)
                    const firstDayDate = firstDayOfWeek ? 
                        dayjs(`${year}-${String(month).padStart(2, '0')}-${String(firstDayOfWeek.day).padStart(2, '0')}`) : 
                        dayDate
                    
                    // 일정이 현재 주 이전에 시작되었고, 현재 주에서 끝나거나 다음 주로 이어지는지 확인
                    const startedBeforeCurrentWeek = recordStartDate.isBefore(firstDayDate, 'day')
                    const endsInOrAfterCurrentWeek = recordEndDate.isSame(firstDayDate, 'day') || recordEndDate.isAfter(firstDayDate, 'day')
                    
                    // 중복 체크: 이미 같은 record가 추가되었는지 확인
                    const alreadyExists = weekRecords.some(existing => existing.record.id === record.id)
                    
                    if (startedBeforeCurrentWeek && endsInOrAfterCurrentWeek && !alreadyExists) {
                        // 현재 주에서의 실제 종료일 계산 (null이 아닌 마지막 날짜 찾기)
                        const lastDayOfWeek = week.findLast(day => day !== null)
                        const lastDayDate = lastDayOfWeek ? 
                            dayjs(`${year}-${String(month).padStart(2, '0')}-${String(lastDayOfWeek.day).padStart(2, '0')}`) : dayDate
                        
                        // 일정이 현재 주에서 끝나는지 확인
                        const endsInCurrentWeek = recordEndDate.isSame(lastDayDate, 'day') || recordEndDate.isBefore(lastDayDate, 'day')
                        
                        let colSpan = 1
                        if (endsInCurrentWeek) {
                            // 현재 주에서 끝나는 경우: 첫 번째 날부터 종료일까지의 일수 계산 (마감일 포함)
                            // dayjs의 diff 계산 문제를 해결하기 위해 날짜만 비교
                            const startDateOnly = firstDayDate.startOf('day')
                            const endDateOnly = recordEndDate.startOf('day')
                            colSpan = endDateOnly.diff(startDateOnly, 'day') + 1
                        } else {
                            // 다음 주로 이어지는 경우: 첫 번째 날부터 현재 주의 마지막 날까지의 일수 계산 (마감일 포함)
                            // dayjs의 diff 계산 문제를 해결하기 위해 날짜만 비교
                            const startDateOnly = firstDayDate.startOf('day')
                            const endDateOnly = lastDayDate.startOf('day')
                            colSpan = endDateOnly.diff(startDateOnly, 'day') + 1
                        }
                        
                        // colSpan이 1 이상이고 유효한 범위인 경우만 추가
                        // 주간 경계를 넘나드는 일정은 각 주마다 표시되어야 하므로 중복 체크 제거
                        if (colSpan > 0) {
                            weekRecords.push({
                                record,
                                startDayIndex: 0, // 주의 첫 번째 날부터 시작
                                colSpan
                            })
                        }
                    }
                }
            })
        })

        // 일정들을 시작일 순으로 정렬
        weekRecords.sort((a, b) => a.startDayIndex - b.startDayIndex)

        // 최소 5개, 최대 5개의 tr을 생성
        const maxRows = 5
        const rows = []

        // 일정들을 행별로 그룹화
        const rowGroups: Array<Array<{ record: Record; startDayIndex: number; colSpan: number }>> = []
        
        for (let i = 0; i < weekRecords.length; i++) {
            const item = weekRecords[i]
            let placed = false
            
            // 기존 행들 중에 배치할 수 있는 곳 찾기
            for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
                if (!rowGroups[rowIndex]) {
                    rowGroups[rowIndex] = []
                }
                
                // 현재 행에 추가할 수 있는지 확인 (겹치는지 체크)
                let canAddToCurrentRow = true
                for (const existingItem of rowGroups[rowIndex]) {
                    // 겹치는지 확인: 기존 일정의 범위와 새 일정의 범위가 겹치는지
                    const existingEnd = existingItem.startDayIndex + existingItem.colSpan - 1
                    const newEnd = item.startDayIndex + item.colSpan - 1
                    
                    if (!(newEnd < existingItem.startDayIndex || item.startDayIndex > existingEnd)) {
                        canAddToCurrentRow = false
                        break
                    }
                }
                
                if (canAddToCurrentRow) {
                    rowGroups[rowIndex].push(item)
                    placed = true
                    break
                }
            }
            
            // 배치할 수 없으면 첫 번째 빈 행에 추가
            if (!placed) {
                for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
                    if (!rowGroups[rowIndex]) {
                        rowGroups[rowIndex] = []
                    }
                    if (rowGroups[rowIndex].length === 0) {
                        rowGroups[rowIndex].push(item)
                        break
                    }
                }
            }
        }

        // 행 그룹들을 렌더링
        for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
            const rowItems = rowGroups[rowIndex] || []
            
            if (rowItems.length === 0) {
                // 빈 행
                rows.push(
                    <tr key={`empty-row-${rowIndex}`}>
                        {Array.from({ length: 7 }, (_, j) => (
                            <td key={`empty-${j}`} style={{ height: '18px' }}>&nbsp;</td>
                        ))}
                    </tr>
                )
            } else {
                // 일정이 있는 행
                const tds = []
                let currentDay = 0
                
                // 일정들을 시작일 순으로 정렬
                rowItems.sort((a, b) => a.startDayIndex - b.startDayIndex)
                
                for (const item of rowItems) {
                    // 시작일 이전의 빈 td들
                    while (currentDay < item.startDayIndex) {
                        tds.push(
                            <td key={`empty-${currentDay}`} style={{ height: '18px' }}>&nbsp;</td>
                        )
                        currentDay++
                    }
                    
                    // 일정이 이전 주에서 이어지는지, 다음 주로 이어지는지 확인
                    const recordStartDate = dayjs(parseInt(item.record.startedAt.toString()))
                    const recordEndDate = dayjs(parseInt(item.record.endedAt.toString()))
                    
                    // 현재 주의 첫 번째와 마지막 날짜
                    const firstDayOfWeek = week.find(day => day !== null)
                    const lastDayOfWeek = week.findLast(day => day !== null)
                    const firstDayDate = firstDayOfWeek ? 
                        dayjs(`${year}-${String(month).padStart(2, '0')}-${String(firstDayOfWeek.day).padStart(2, '0')}`) : 
                        recordStartDate
                    const lastDayDate = lastDayOfWeek ? 
                        dayjs(`${year}-${String(month).padStart(2, '0')}-${String(lastDayOfWeek.day).padStart(2, '0')}`) : 
                        recordStartDate
                    
                    const isContinuation = recordStartDate.isBefore(firstDayDate, 'day')
                    const continuesToNextWeek = recordEndDate.isAfter(lastDayDate, 'day')
                    
                    // 일정 td
                    tds.push(
                        <td 
                            key={`event-${item.startDayIndex}`}
                            colSpan={item.colSpan} 
                            className="calendar-record-item" 
                            style={{
                                backgroundColor: item.record.recordGroup?.color || '#e0e0e0',
                                height: '18px',
                                margin: '1px 0',
                                borderRadius: isContinuation && continuesToNextWeek ? '0' : 
                                             isContinuation ? '0 3px 3px 0' : 
                                             continuesToNextWeek ? '3px 0 0 3px' : '3px',
                                fontSize: '10px',
                                textAlign: 'center',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: 'white',
                                padding: '0 4px',
                                position: 'relative',
                            }}
                            title={
                                isContinuation && continuesToNextWeek ? `${item.record.title} (이전 주에서 이어짐, 다음 주로 이어짐)` :
                                isContinuation ? `${item.record.title} (이전 주에서 이어짐)` :
                                continuesToNextWeek ? `${item.record.title} (다음 주로 이어짐)` : 
                                item.record.title
                            }
                        >
                            {isContinuation && (
                                <span style={{
                                    position: 'absolute',
                                    left: '2px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: '8px',
                                    opacity: 0.8
                                }}>
                                    ←
                                </span>
                            )}
                            {continuesToNextWeek && (
                                <span style={{
                                    position: 'absolute',
                                    right: '2px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: '8px',
                                    opacity: 0.8
                                }}>
                                    →
                                </span>
                            )}
                            <span style={{
                                display: 'block',
                                paddingLeft: isContinuation ? '12px' : '0',
                                paddingRight: continuesToNextWeek ? '12px' : '0'
                            }}>
                                {item.record.title}
                            </span>
                        </td>
                    )
                    
                    currentDay += item.colSpan
                }
                
                // 마지막 일정 이후의 빈 td들
                while (currentDay < 7) {
                    tds.push(
                        <td key={`empty-after-${currentDay}`} style={{ height: '18px' }}>&nbsp;</td>
                    )
                    currentDay++
                }
                
                rows.push(
                    <tr key={`row-${rowIndex}`}>
                        {tds}
                    </tr>
                )
            }
        }

        return rows
    }

    const today = dayjs().format('YYYYMMDD')
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div className="calendar-monthly" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div className="calendar-weekdays" style={{ display: 'flex', width: '100%' }}>
                    {weekdays.map((day) => (
                        <div 
                            key={day} 
                            className={`${day === '일' ? 'holiday' : ''}`}
                            style={{ 
                                flex: '1', 
                                textAlign: 'center', 
                                padding: '8px 0',
                                border: '1px solid #ddd'
                            }}
                        >
                            {day}
                        </div>
                    ))}
                </div>
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} style={{ position: 'relative', width: '100%' }}>
                        <table style={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            tableLayout: 'fixed',
                            borderCollapse: 'collapse',
                            borderBottom: '1px solid #e6e6e6',
                        }}>
                            <tbody>
                                <tr>
                                    {week.map((day, dayIndex) => (
                                        <td key={dayIndex}>&nbsp;</td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                        <table style={{ 
                            position: 'relative',
                            tableLayout: 'fixed',
                            width: '100%',
                            height: '100%',
                            color: '#222',
                            borderSpacing: '0 4px',
                        }}>
                            <tbody>
                                <tr>
                                    {week.map((day, dayIndex) => (
                                        <td key={dayIndex}
                                        className={`${dayIndex === 0 ? 'holiday' : ''} ${day?.isCurrentMonth && day?.id === today ? 'today' : ''}`}
                                        >
                                            {day && (
                                                <div>
                                                    <p>a{day.day}</p>
                                                    <span></span>
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                {renderRecords(week)}
                            </tbody>
                        </table> 
                    </div>
                ))}
            </div>
        </div>
    )
}
