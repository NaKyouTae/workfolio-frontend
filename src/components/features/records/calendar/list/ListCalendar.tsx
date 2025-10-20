import React, { useState } from 'react'
import { Record, Record_RecordType, RecordGroup } from '@/generated/common'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import timezone from 'dayjs/plugin/timezone'
import HttpMethod from '@/enums/HttpMethod'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import RecordCreateModal from '../../modal/RecordCreateModal'
import RecordDetail from '../../modal/RecordDetail'
import RecordUpdateModal from '../../modal/RecordUpdateModal'

dayjs.locale('ko')
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

interface ListRecord extends Record {
    displayDate: string
    displayTime: string
    dayOfWeek: string
    isWeekend: boolean
    isFirstRecordOfDay: boolean
    isMultiDayStart?: boolean
    isMultiDayEnd?: boolean
    isMultiDayMiddle?: boolean
    currentDay: dayjs.Dayjs
}

interface ListCalendarProps {
    initialDate: Date
    records: Record[]
    recordGroups: RecordGroup[]
    allRecordGroups: RecordGroup[]
    editableRecordGroups: RecordGroup[]
}

const ListCalendar: React.FC<ListCalendarProps> = React.memo(({ 
    initialDate,
    records,
    allRecordGroups,
    editableRecordGroups,
}) => {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [detailPosition, setDetailPosition] = useState<{top: number, left: number, width: number} | null>(null)

    const { triggerRecordRefresh } = useRecordGroupStore()  

    const dateFormat = "MM.DD. ddd"

    // initialDate를 기준으로 월의 모든 날짜 생성
    const initialDayjs = dayjs(initialDate)
    const currentMonth = initialDayjs.month()
    const currentYear = initialDayjs.year()
    const daysInMonth = initialDayjs.daysInMonth()
    
    // initialDate 기준 월의 모든 날짜 배열 생성
    const allDaysInMonth = Array.from({ length: daysInMonth }, (_, i) => {
        const date = initialDayjs.year(currentYear).month(currentMonth).date(i + 1)
        return {
            date: date.format('YYYY-MM-DD'),
            displayDate: date.format(dateFormat),
            dayOfWeek: date.format('ddd'),
            isWeekend: date.day() === 0 || date.day() === 6,
            dayjs: date
        }
    })

    // 레코드를 날짜별로 그룹화 (records가 배열인지 확인)
    const recordsByDate = (Array.isArray(records) ? records : []).reduce((acc, record) => {
        
        // 문자열 타임스탬프를 숫자로 변환 후 처리
        const startTimestamp = parseInt(record.startedAt.toString());
        const endTimestamp = parseInt(record.endedAt.toString());
        
        // 숫자로 변환된 타임스탬프로 날짜 생성
        const startDate = dayjs(startTimestamp);
        const endDate = dayjs(endTimestamp);
        
        // 멀티데이 레코드인 경우 시작일부터 종료일까지 모든 날짜에 추가
        if (Record_RecordType[record.type] == Record_RecordType.MULTI_DAY.toString()) { // MULTI_DAY
            let currentDate = startDate.clone();

            // 종료일까지 포함하여 모든 날짜에 레코드 추가
            while (currentDate.isSame(endDate, 'day') || currentDate.isBefore(endDate, 'day')) {
                const dateKey = currentDate.format('YYYY-MM-DD');
                if (!acc[dateKey]) {
                    acc[dateKey] = []
                }
                acc[dateKey].push(record)
                currentDate = currentDate.add(1, 'day')
            }
        } else {
            // 단일일 레코드는 시작 날짜에만 추가
            const dateKey = startDate.format('YYYY-MM-DD')
            if (!acc[dateKey]) {
                acc[dateKey] = []
            }
            acc[dateKey].push(record)
        }
        
        return acc
    }, {} as { [key: string]: Record[] })

    // 모든 날짜에 대해 레코드가 있으면 표시, 없으면 빈 행 표시
    const listRecords: (ListRecord | { isEmpty: true; date: string; displayDate: string; dayOfWeek: string; isWeekend: boolean })[] = []
    
    allDaysInMonth.forEach(dayInfo => {
        const recordsForDay = recordsByDate[dayInfo.date] || []

        if (recordsForDay.length === 0) {
            // 레코드가 없는 날은 빈 행 표시
            listRecords.push({
                isEmpty: true,
                date: dayInfo.date,
                displayDate: dayInfo.displayDate,
                dayOfWeek: dayInfo.dayOfWeek,
                isWeekend: dayInfo.isWeekend,
                currentDay: dayInfo.dayjs
            })
        } else {
            // 레코드가 있는 날은 각 레코드마다 행 생성
            recordsForDay.forEach((record: Record, index: number) => {
                // 문자열 타임스탬프를 숫자로 변환 후 처리
                const startTimestamp = parseInt(record.startedAt.toString());
                const endTimestamp = parseInt(record.endedAt.toString());
                const startDate = dayjs(startTimestamp);
                const endDate = dayjs(endTimestamp);
                const currentDay = dayjs(dayInfo.date);
            
                let displayTime = ''
                let isMultiDayStart = false
                let isMultiDayEnd = false
                let isMultiDayMiddle = false
                
                if (Record_RecordType[record.type] == Record_RecordType.DAY.toString()) {
                    displayTime = '하루 종일'
                } else if (Record_RecordType[record.type] == Record_RecordType.TIME.toString()) { // TIME
                    displayTime = startDate.format('A hh:mm')
                } else if (Record_RecordType[record.type] == Record_RecordType.MULTI_DAY.toString()) { // MULTI_DAY
                    isMultiDayStart = currentDay.isSame(startDate, 'day')
                    isMultiDayEnd = currentDay.isSame(endDate, 'day')
                    isMultiDayMiddle = !isMultiDayStart && !isMultiDayEnd
                    displayTime = '하루 종일'
                }

                listRecords.push({
                    ...record,
                    displayDate: dayInfo.displayDate,
                    displayTime,
                    dayOfWeek: startDate.format('ddd'),
                    isWeekend: currentDay.day() === 0 || currentDay.day() === 6,
                    isFirstRecordOfDay: index === 0, // 같은 날짜의 첫 번째 레코드인지 표시
                    isMultiDayStart,
                    isMultiDayEnd,
                    isMultiDayMiddle,
                    currentDay,
                })
            })
        }
    })

    const handleRecordClick = (record: Record, event: React.MouseEvent<HTMLSpanElement>) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const tableContainer = event.currentTarget.closest('table')?.getBoundingClientRect()
        
        if (tableContainer) {
            const viewportHeight = window.innerHeight
            const detailHeight = 300 // CSS에서 설정한 max-height
            const detailWidth = Math.min(400, Math.max(200, rect.width * 1.5)) // 최소 200px, 최대 400px
            
            // 세로 위치 계산
            let top = rect.bottom - tableContainer.top + 10
            const spaceBelow = viewportHeight - (rect.bottom + detailHeight)
            const spaceAbove = rect.top - detailHeight
            
            // 아래쪽 공간이 부족하고 위쪽에 공간이 있으면 위쪽에 표시
            if (spaceBelow < 0 && spaceAbove > 0) {
                top = rect.top - tableContainer.top - detailHeight + 115
            }
            
            // 여전히 위쪽도 공간이 부족하면 가능한 공간에 맞춰 조정
            if (top < 0) {
                top = 5
            }
            
            // 가로 위치 계산
            const left = rect.left - tableContainer.left - 5
            
            setDetailPosition({
                top: Math.max(5, top),
                left: Math.max(5, left),
                width: detailWidth
            })
        }
        
        setSelectedRecord(record)
        setIsDetailModalOpen(true)
    }

    const handleCloseModal = () => {
        setSelectedRecord(null)
        setDetailPosition(null)
        setIsDetailModalOpen(false)
    }

    // 레코드 생성 모달 열기 핸들러
    const handleOpenCreateModal = (date?: string) => {
        setSelectedDate(date || null)
        setIsCreateModalOpen(true)
    }

    // 레코드 생성 모달 닫기 핸들러
    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false)
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

    const handleDeleteRecord = async () => {
        if (!selectedRecord) return;
        
        try {
            const response = await fetch(`/api/records/${selectedRecord.id}`, {
                method: HttpMethod.DELETE,
            });
            
            if (response.ok) {
                // 삭제 성공 시 모달 닫기 및 레코드 재조회
                handleCloseModal();
                triggerRecordRefresh();
            } else {
                console.error('Failed to delete record');
            }
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    }

    return (
        <>
            <table className="list">
                <colgroup>
                    <col style={{width: '8rem'}} />
                    <col style={{width: '4rem'}} />
                    <col style={{width: '8rem'}} />
                    <col style={{width: '16rem'}} />
                    <col style={{width: 'auto'}} />
                </colgroup>
                <thead>
                    <tr>
                        <th>일자</th>
                        <th>추가</th>
                        <th>시간</th>
                        <th>캘린더</th>
                        <th>내용</th>
                    </tr>
                </thead>
                <tbody>
                    {listRecords.map((item, index) => {
                        // 빈 날짜인 경우
                        if ('isEmpty' in item) {
                            return (
                                <tr
                                    key={`empty-${item.date}`}
                                >
                                    <td className={`${item.isWeekend ? 'holiday' : ''}`}>{item.displayDate}</td>
                                    <td><button onClick={() => handleOpenCreateModal(item.date)}><i className="ic-add" /></button></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            )
                        }

                        // 레코드가 있는 경우
                        const record = item as ListRecord
                        return (
                            <tr key={`${record.id}-${index}`}>
                                <td className={`${record.isWeekend ? 'holiday' : ''}`}>{record.isFirstRecordOfDay ? item.displayDate : ''}</td>
                                <td>
                                    {record.isFirstRecordOfDay ? (
                                        <button onClick={() => {
                                            handleOpenCreateModal(record.currentDay.format('YYYY-MM-DD'));
                                        }}>
                                            <i className="ic-add" />
                                        </button>
                                    ) : ''}
                                </td>
                                <td>
                                    <p className={record.isMultiDayMiddle ? 'multi-day-middle' : ''}>
                                        {record.displayTime}
                                    </p>
                                </td>
                                <td>
                                    <div>
                                        <div 
                                            style={{ 
                                                backgroundColor: record.recordGroup?.color || '#e0e0e0',
                                                opacity: record.isMultiDayMiddle ? 0.6 : 1
                                            }} 
                                        />
                                        <p>{record.recordGroup?.title || '기본'}</p>
                                    </div>
                                </td>
                                <td>
                                    <p className={`text-left ${record.isMultiDayMiddle ? 'multi-day-middle' : ''}`}>
                                        <span onClick={(e) => handleRecordClick(record as Record, e)}>{record.title}</span>
                                    </p>
                                </td> 
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            {/* 레코드 상세 모달 */}
            <RecordDetail
                isOpen={isDetailModalOpen}
                onClose={handleCloseModal}
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
                allRecordGroups={allRecordGroups}
            />

            {/* RecordCreateModal */}
            <RecordCreateModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                selectedDate={selectedDate}
                editableRecordGroups={editableRecordGroups}
            />
        </>
    )
});

ListCalendar.displayName = 'ListCalendar';

export default ListCalendar
