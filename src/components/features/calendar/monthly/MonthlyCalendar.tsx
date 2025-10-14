import React, { useState } from 'react'
import { createDateModel, DateModel } from "@/models/DateModel"
import { Record } from '@/generated/common'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { useCalendarDays } from '@/hooks/useCalendar'
import { CalendarDay } from '@/models/CalendarTypes'
import RecordUpdateModal from '../../modal/RecordUpdateModal'
import RecordDetail from '../../modal/RecordDetail'
import MonthlyCalendarItem from './MonthlyCalendarItem'
import { useRecords } from '@/hooks/useRecords'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import HttpMethod from '@/enums/HttpMethod'

dayjs.locale('ko')
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

interface MonthlyCalendarProps {
    initialDate: Date
}

/**
 * Table 태그를 사용한 MonthlyCalendarV1 컴포넌트
 */
export default function MonthlyCalendar({ initialDate }: MonthlyCalendarProps) {
    const [date] = useState<DateModel>(() => {
        const d = new Date(initialDate)
        return createDateModel(d.getFullYear(), d.getMonth(), d.getDate(), true)
    })

    // 모달 상태
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
    const [detailPosition, setDetailPosition] = useState<{top: number, left: number, width: number} | null>(null)

    // 커스텀 훅 사용
    const calendarDays = useCalendarDays(date)
    const { records } = useRecords('monthly', initialDate.getMonth() + 1, initialDate.getFullYear())
    const { triggerRecordRefresh } = useRecordGroupStore()

    // 레코드 클릭 핸들러
    const handleRecordClick = (record: Record, event: React.MouseEvent<HTMLTableCellElement>) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const calendarContainer = event.currentTarget.closest('.days')?.getBoundingClientRect()
        
        if (calendarContainer) {
            const viewportHeight = window.innerHeight
            const viewportWidth = window.innerWidth
            const detailHeight = 300 // CSS에서 설정한 max-height
            const detailWidth = Math.min(400, Math.max(200, rect.width * 1.5)) // 최소 200px, 최대 400px
            
            // 세로 위치 계산
            let top = rect.bottom - calendarContainer.top + 25 // 5px에서 2px로 줄임
            const spaceBelow = viewportHeight - (rect.bottom + detailHeight)
            const spaceAbove = rect.top - detailHeight
            
            // 아래쪽 공간이 부족하고 위쪽에 공간이 있으면 위쪽에 표시
            if (spaceBelow < 0 && spaceAbove > 0) {
                top = rect.top - calendarContainer.top - detailHeight + 150 // 5px에서 2px로 줄임
            }
            
            // 여전히 위쪽도 공간이 부족하면 가능한 공간에 맞춰 조정
            if (top < 0) {
                top = 5
            }
            
            // 가로 위치 계산
            let left = rect.left - calendarContainer.left
            const spaceRight = viewportWidth - rect.left
            const spaceLeft = rect.left
            
            // 오른쪽 공간이 부족하면 왼쪽으로 이동
            if (spaceRight < detailWidth && spaceLeft > detailWidth) {
                left = rect.right - calendarContainer.left - detailWidth
            }
            
            // 여전히 화면을 벗어나면 중앙 정렬
            if (left < 0) {
                left = Math.max(5, (calendarContainer.width - detailWidth) / 2)
            }
            
            // 오른쪽 경계도 확인
            if (left + detailWidth > calendarContainer.width) {
                left = Math.max(5, calendarContainer.width - detailWidth - 5)
            }
            
            setDetailPosition({
                top: Math.max(5, top),
                left: Math.max(5, left),
                width: detailWidth
            })
        }
        
        setSelectedRecord(record)
        setIsDetailModalOpen(true)
    }

    // 상세 모달 닫기 핸들러
    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false)
        setSelectedRecord(null)
        setDetailPosition(null)
    }

    // 수정 모달 열기 핸들러
    const handleOpenUpdateModal = () => {
        setIsDetailModalOpen(false)
        setIsUpdateModalOpen(true)
    }

    // 수정 모달 닫기 핸들러
    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false)
        setSelectedRecord(null)
    }

    // 삭제 핸들러
    const handleDeleteRecord = async () => {
        if (!selectedRecord) return;
        
        try {
            const response = await fetch(`/api/records/${selectedRecord.id}`, {
                method: HttpMethod.DELETE,
            });
            
            if (response.ok) {
                // 삭제 성공 시 모달 닫기 및 레코드 재조회
                handleCloseDetailModal();
                triggerRecordRefresh();
            } else {
                console.error('Failed to delete record');
            }
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    }

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
                            <td key={`empty-${j}`}></td>
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
                            <td className="record" key={`empty-${currentDay}`}></td>
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
                        <MonthlyCalendarItem
                            key={`event-${item.startDayIndex}`}
                            record={item.record}
                            startDayIndex={item.startDayIndex}
                            colSpan={item.colSpan}
                            isContinuation={isContinuation}
                            continuesToNextWeek={continuesToNextWeek}
                            onRecordClick={handleRecordClick}
                        />
                    )
                    
                    currentDay += item.colSpan
                }
                
                // 마지막 일정 이후의 빈 td들
                while (currentDay < 7) {
                    tds.push(
                        <td className="record" key={`empty-after-${currentDay}`}></td>
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
        <>
            <table className="week">
                <thead>
                    <tr>
                        {weekdays.map((day) => (
                            <th
                                key={day} 
                                className={`${day === '일' ? 'holiday' : ''}`}
                            >
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
            </table>
            <div className="days">
                {weeks.map((week, weekIndex) => (
                    <div className="weekly" key={weekIndex}>
                        {/* 구조만 표현하는 테이블 (today 배경색용) */}
                        <table className="structure-table">
                            <tbody>
                                <tr>
                                    {week.map((day, dayIndex) => (
                                        <td key={dayIndex}
                                        className={`day ${dayIndex === 0 ? 'holiday' : ''} ${day?.isCurrentMonth && day?.id === today ? 'today' : ''}`}
                                        >
                                            {day && (
                                                <div>
                                                    <p>{day.day}</p>
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                        
                        {/* 레코드를 렌더링하는 테이블 */}
                        <table className="records-table">
                            <tbody>
                                <tr>
                                    {week.map((day, dayIndex) => (
                                        <td key={dayIndex}
                                        className={`day ${dayIndex === 0 ? 'holiday' : ''} ${day?.isCurrentMonth && day?.id === today ? 'today' : ''}`}
                                        >
                                            {day && (
                                                <div>
                                                    <p>{day.day}</p>
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
            
            {/* RecordDetail Modal */}
            <RecordDetail
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                record={selectedRecord}
                onEdit={handleOpenUpdateModal}
                onDelete={handleDeleteRecord}
                position={detailPosition || undefined}
            />
            
            {/* RecordUpdateModal */}
            <RecordUpdateModal
                isOpen={isUpdateModalOpen}
                onClose={handleCloseUpdateModal}
                onDelete={handleDeleteRecord}
                record={selectedRecord}
            />
        </>
    )
}
