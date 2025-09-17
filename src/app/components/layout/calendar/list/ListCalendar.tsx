import React, { useState } from 'react'
import { Record, RecordGroup } from '../../../../../../generated/common'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import timezone from 'dayjs/plugin/timezone'
import styles from './ListCalendar.module.css'

dayjs.locale('ko')
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

interface ListRecord extends Record {
    displayDate: string
    displayTime: string
    dayOfWeek: string
    isWeekend: boolean
    isFirstRecordOfDay: boolean
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
        const timestamp = parseInt(record.startedAt.toString());
        
        // 숫자로 변환된 타임스탬프로 날짜 생성
        const startDate = dayjs(timestamp);
        const dateKey = startDate.format('YYYY-MM-DD')
        
        if (!acc[dateKey]) {
            acc[dateKey] = []
        }
        acc[dateKey].push(record)
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
            
                let displayTime = ''
                if (record.type === 2) { // DAY
                    displayTime = '하루 종일'
                } else if (record.type === 1) { // TIME
                    if (startDate.isSame(endDate, 'day')) {
                        displayTime = `${startDate.format('A hh:mm')} ~ ${endDate.format('A hh:mm')}`
                    } else {
                        displayTime = `${startDate.format('MM/DD A hh:mm')} ~ ${endDate.format('MM/DD A hh:mm')}`
                    }
                }

                listRecords.push({
                    ...record,
                    displayDate: startDate.format(dateFormat),
                    displayTime,
                    dayOfWeek: startDate.format('ddd'),
                    isWeekend: startDate.day() === 0 || startDate.day() === 6,
                    isFirstRecordOfDay: index === 0 // 같은 날짜의 첫 번째 레코드인지 표시
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
        <div className={styles.container}>
            {/* 테이블 헤더 */}
            <div className={styles.tableHeader}>
                <div className={styles.headerCell}>일자</div>
                <div className={`${styles.headerCell} ${styles.headerCellCenter}`}>추가</div>
                <div className={styles.headerCell}>시간</div>
                <div className={styles.headerCell}>캘린더</div>
                <div className={styles.headerCell}>내용</div>
            </div>

            {/* 테이블 바디 */}
            <div className={styles.tableBody}>
                {listRecords.map((item) => {
                    // 빈 날짜인 경우
                    if ('isEmpty' in item) {
                        return (
                            <div
                                key={`empty-${item.date}`}
                                className={styles.tableRow}
                            >
                                <div className={`${styles.tableCell} ${item.isWeekend ? styles.weekendDate : ''}`}>
                                    {item.displayDate}
                                </div>
                                <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>
                                    <button
                                        className={styles.addButton}
                                        onClick={() => onAddRecord(dayjs(item.date).toDate())}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className={`${styles.tableCell} ${styles.emptyDate}`}>
                                    -
                                </div>
                                <div className={`${styles.tableCell} ${styles.emptyDate}`}>
                                    -
                                </div>
                                <div className={`${styles.tableCell} ${styles.emptyDate}`}>
                                    -
                                </div>
                            </div>
                        )
                    }

                    // 레코드가 있는 경우
                    const record = item as ListRecord
                    return (
                        <div
                            key={record.id}
                            className={`${styles.tableRow} ${styles.clickableRow}`}
                            onClick={() => handleRecordClick(record as Record)}
                        >
                            <div className={`${styles.tableCell} ${record.isWeekend ? styles.weekendDate : ''}`}>
                                {record.isFirstRecordOfDay ? record.displayDate : ''}
                            </div>
                            <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>
                                {record.isFirstRecordOfDay ? (
                                    <button
                                        className={styles.addButton}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            // 문자열 타임스탬프를 숫자로 변환 후 처리
                                            const startTimestamp = parseInt(record.startedAt.toString());
                                            const startDate = dayjs(startTimestamp);
                                            onAddRecord(startDate.toDate())
                                        }}
                                    >
                                        +
                                    </button>
                                ) : ''}
                            </div>
                            <div className={styles.tableCell}>
                                {record.displayTime}
                            </div>
                            <div className={styles.tableCell}>
                                <div className={styles.recordGroupInfo}>
                                    <div
                                        className={styles.recordGroupColorBox}
                                        style={{ backgroundColor: getRecordGroupColor(record.recordGroup) }}
                                    />
                                    <span>
                                        {record.recordGroup?.title || '기본'}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.tableCell}>
                                {record.title}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* 레코드 상세 모달 */}
            {selectedRecord && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalTitleGroup}>
                                <div
                                    className={styles.recordGroupColorBox}
                                    style={{ backgroundColor: getRecordGroupColor(selectedRecord.recordGroup) }}
                                />
                                <h3 className={styles.modalTitle}>
                                    ■ {selectedRecord.title}
                                </h3>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className={styles.modalCloseButton}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.modalField}>
                            <div className={styles.modalFieldLabel}>
                                일시
                            </div>
                            <div className={styles.modalFieldValue}>
                                {(() => {
                                    // 문자열 타임스탬프를 숫자로 변환 후 처리
                                    const startTimestamp = parseInt(selectedRecord.startedAt.toString());
                                    const endTimestamp = parseInt(selectedRecord.endedAt.toString());
                                    const startDate = dayjs(startTimestamp);
                                    const endDate = dayjs(endTimestamp);
                                    
                                    return `${startDate.format('YYYY. MM. DD. A hh:mm')} ~ ${endDate.format('YYYY. MM. DD. A hh:mm')}`;
                                })()}
                            </div>
                        </div>

                        {selectedRecord.description && (
                            <div className={styles.modalField}>
                                <div className={styles.modalFieldLabel}>
                                    메모
                                </div>
                                <div className={styles.modalFieldValue}>
                                    {selectedRecord.description}
                                </div>
                            </div>
                        )}

                        <div className={styles.modalActions}>
                            <button className={styles.modalButton}>
                                수정
                            </button>
                            <button className={`${styles.modalButton} ${styles.modalButtonSecondary}`}>
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default ListCalendar
