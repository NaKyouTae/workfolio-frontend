import React, { useState } from 'react'
import { Record, Record_RecordType, RecordGroup } from '@/generated/common'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import timezone from 'dayjs/plugin/timezone'

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
}

interface ListCalendarProps {
    initialDate: Date
    records: Record[]
    recordGroups: RecordGroup[]
    onAddRecord: (date: Date) => void
    onRecordClick: (record: Record) => void
}

const ListCalendar: React.FC<ListCalendarProps> = ({ 
    initialDate,
    records, 
    onAddRecord, 
    onRecordClick 
}) => {
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)

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
                isWeekend: dayInfo.isWeekend
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
                
                if (record.type === 2) { // DAY
                    displayTime = '하루 종일'
                } else if (record.type === 1) { // TIME
                    if (startDate.isSame(endDate, 'day')) {
                        displayTime = `${startDate.format('A hh:mm')} ~ ${endDate.format('A hh:mm')}`
                    } else {
                        displayTime = `${startDate.format('MM/DD A hh:mm')} ~ ${endDate.format('MM/DD A hh:mm')}`
                    }
                } else if (record.type === 3) { // MULTI_DAY
                    isMultiDayStart = currentDay.isSame(startDate, 'day')
                    isMultiDayEnd = currentDay.isSame(endDate, 'day')
                    isMultiDayMiddle = !isMultiDayStart && !isMultiDayEnd
                    
                    if (isMultiDayStart) {
                        displayTime = `${startDate.format('MM/DD')} ~ ${endDate.format('MM/DD')}`
                    } else if (isMultiDayEnd) {
                        displayTime = '종료'
                    } else {
                        displayTime = '계속'
                    }
                }

                listRecords.push({
                    ...record,
                    displayDate: startDate.format(dateFormat),
                    displayTime,
                    dayOfWeek: startDate.format('ddd'),
                    isWeekend: startDate.day() === 0 || startDate.day() === 6,
                    isFirstRecordOfDay: index === 0, // 같은 날짜의 첫 번째 레코드인지 표시
                    isMultiDayStart,
                    isMultiDayEnd,
                    isMultiDayMiddle
                })
            })
        }
    })

    // 레코드 그룹 색상 매핑
    const getRecordGroupColor = (recordGroup: RecordGroup | undefined) => {
        if (!recordGroup) return '#f0f0f0'
        return recordGroup.color || '#f0f0f0'
    }

    const handleRecordClick = (record: Record) => {
        setSelectedRecord(record)
        onRecordClick(record)
    }

    const handleCloseModal = () => {
        setSelectedRecord(null)
    }

    return (
        <table className="list">
            <colgroup>
                <col style={{width: '8rem'}} />
                <col style={{width: '4rem'}} />
                <col style={{width: '16rem'}} />
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
                                <td className={`$${item.isWeekend ? 'holiday' : ''}`}>{item.displayDate}</td>
                                <td><button onClick={() => onAddRecord(dayjs(item.date).toDate())}><i className="ic-add" /></button></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        )
                    }

                    // 레코드가 있는 경우
                    const record = item as ListRecord
                    return (
                        <tr
                            key={`${record.id}-${index}`}
                            onClick={() => handleRecordClick(record as Record)}
                        >
                            <td className={`${record.isWeekend ? 'holiday' : ''}`}>{record.isFirstRecordOfDay ? record.displayDate : ''}</td>
                            <td>
                                {record.isFirstRecordOfDay ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            // 문자열 타임스탬프를 숫자로 변환 후 처리
                                            const startTimestamp = parseInt(record.startedAt.toString());
                                            const startDate = dayjs(startTimestamp);
                                            onAddRecord(startDate.toDate())
                                        }}
                                    >
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
                                            backgroundColor: getRecordGroupColor(record.recordGroup),
                                            opacity: record.isMultiDayMiddle ? 0.6 : 1
                                        }} 
                                    />
                                    <p>{record.recordGroup?.title || '기본'}</p>
                                </div>
                            </td>
                            <td>
                                <p className={`text-left ${record.isMultiDayMiddle ? 'multi-day-middle' : ''}`}>
                                    {record.isMultiDayStart && '▶ '}
                                    {record.title}
                                    {record.isMultiDayEnd && ' ◀'}
                                </p>
                            </td> 
                        </tr>
                    )
                })}
            </tbody>

            {/* 레코드 상세 모달 */}
            {selectedRecord && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="record-modal-wrap" onClick={(e) => e.stopPropagation()}>
                        <div className="record-modal-tit">
                            <div>
                                <div style={{ backgroundColor: getRecordGroupColor(selectedRecord.recordGroup) }} />
                                <h2>{selectedRecord.title}</h2>
                            </div>
                            <button onClick={handleCloseModal}><i className="ic-close" /></button>
                        </div>

                        <div className="record-modal-cont">
                            <ul className="record-info">
                                <li>
                                    <span>일시</span>
                                    <p>
                                        {(() => {
                                            // 문자열 타임스탬프를 숫자로 변환 후 처리
                                            const startTimestamp = parseInt(selectedRecord.startedAt.toString());
                                            const endTimestamp = parseInt(selectedRecord.endedAt.toString());
                                            const startDate = dayjs(startTimestamp);
                                            const endDate = dayjs(endTimestamp);
                                            
                                            return `${startDate.format('YYYY. MM. DD. A hh:mm')} ~ ${endDate.format('YYYY. MM. DD. A hh:mm')}`;
                                        })()}
                                    </p>
                                </li>
                                {selectedRecord.description && (
                                    <li>
                                        <span>메모</span>
                                        <p>
                                            {selectedRecord.description}
                                        </p>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="record-modal-btn">
                            <button className="xsm line gray">수정</button>
                            <button className="xsm gray">삭제</button>
                        </div>
                    </div>
                </div>
            )}

        </table>
    )
}

export default ListCalendar
