import React, { useState, useMemo } from 'react'
import { Record, Record_RecordType, RecordGroup } from '@workfolio/shared/generated/common'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import timezone from 'dayjs/plugin/timezone'
import HttpMethod from '@workfolio/shared/enums/HttpMethod'
import { useRecordGroupStore } from '@workfolio/shared/store/recordGroupStore'
import RecordCreateModal from '../../modal/RecordCreateModal'
import RecordDetail from '../../modal/RecordDetail'
import RecordUpdateModal from '../../modal/RecordUpdateModal'
import { useConfirm } from '@workfolio/shared/hooks/useConfirm'
import { formatRecordDisplayTime } from '@workfolio/shared/utils/calendarUtils'
import { isLoggedIn } from '@workfolio/shared/utils/authUtils'
import LoginModal from '@workfolio/shared/ui/LoginModal'

dayjs.locale('ko')
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

interface GroupCalendarProps {
    initialDate: Date
    records: Record[]
    recordGroups: RecordGroup[]
    allRecordGroups: RecordGroup[]
}

interface GroupedRecord {
    record: Record
    displayDate: string
    displayTime: string
    isMultiDayMiddle: boolean
}

interface RecordGroupSection {
    group: RecordGroup | null
    groupId: string
    groupTitle: string
    groupColor: string
    records: GroupedRecord[]
}

const GroupCalendar: React.FC<GroupCalendarProps> = React.memo(({
    initialDate,
    records,
    allRecordGroups,
}) => {
    const { confirm } = useConfirm()
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [detailPosition, setDetailPosition] = useState<{ top: number; left: number; width: number } | null>(null)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

    const { triggerRecordRefresh } = useRecordGroupStore()

    const dateFormat = 'MM.DD. ddd'

    // records를 RecordGroup 기준으로 그룹화
    const groupedSections = useMemo(() => {
        const initialDayjs = dayjs(initialDate)
        const currentMonth = initialDayjs.month()
        const currentYear = initialDayjs.year()

        // 그룹별로 레코드 분류
        const groupMap = new Map<string, { group: RecordGroup | null; records: GroupedRecord[] }>()

        const safeRecords = Array.isArray(records) ? records : []

        safeRecords.forEach((record) => {
            const groupId = record.recordGroup?.id || '__default__'

            if (!groupMap.has(groupId)) {
                groupMap.set(groupId, {
                    group: record.recordGroup || null,
                    records: [],
                })
            }

            const startTimestamp = parseInt(record.startedAt.toString())
            const endTimestamp = parseInt(record.endedAt.toString())
            const startDate = dayjs(startTimestamp)
            const endDate = dayjs(endTimestamp)

            const displayTime = formatRecordDisplayTime(record)

            // MULTI_DAY 처리: 해당 월에 속하는 각 날짜에 대해 항목 생성
            if (Record_RecordType[record.type] == Record_RecordType.MULTI_DAY.toString()) {
                let currentDate = startDate.clone()
                while (currentDate.isSame(endDate, 'day') || currentDate.isBefore(endDate, 'day')) {
                    if (currentDate.month() === currentMonth && currentDate.year() === currentYear) {
                        const isStart = currentDate.isSame(startDate, 'day')
                        const isEnd = currentDate.isSame(endDate, 'day')
                        groupMap.get(groupId)!.records.push({
                            record,
                            displayDate: currentDate.format(dateFormat),
                            displayTime,
                            isMultiDayMiddle: !isStart && !isEnd,
                        })
                    }
                    currentDate = currentDate.add(1, 'day')
                }
            } else {
                if (startDate.month() === currentMonth && startDate.year() === currentYear) {
                    groupMap.get(groupId)!.records.push({
                        record,
                        displayDate: startDate.format(dateFormat),
                        displayTime,
                        isMultiDayMiddle: false,
                    })
                }
            }
        })

        // RecordGroup sections 생성 및 정렬
        const sections: RecordGroupSection[] = []

        // allRecordGroups 순서대로 (priority 기준) 섹션 추가
        allRecordGroups.forEach((group) => {
            const data = groupMap.get(group.id)
            if (data && data.records.length > 0) {
                // 날짜 오름차순 정렬
                data.records.sort((a, b) => {
                    const aStart = parseInt(a.record.startedAt.toString())
                    const bStart = parseInt(b.record.startedAt.toString())
                    return aStart - bStart
                })
                sections.push({
                    group,
                    groupId: group.id,
                    groupTitle: group.title,
                    groupColor: group.color,
                    records: data.records,
                })
                groupMap.delete(group.id)
            }
        })

        // allRecordGroups에 없는 그룹 (기본 등)
        groupMap.forEach((data, groupId) => {
            if (data.records.length > 0) {
                data.records.sort((a, b) => {
                    const aStart = parseInt(a.record.startedAt.toString())
                    const bStart = parseInt(b.record.startedAt.toString())
                    return aStart - bStart
                })
                sections.push({
                    group: data.group,
                    groupId,
                    groupTitle: data.group?.title || '기본',
                    groupColor: data.group?.color || '#e0e0e0',
                    records: data.records,
                })
            }
        })

        return sections
    }, [records, allRecordGroups, initialDate])

    const toggleGroup = (groupId: string) => {
        setCollapsedGroups((prev) => {
            const next = new Set(prev)
            if (next.has(groupId)) {
                next.delete(groupId)
            } else {
                next.add(groupId)
            }
            return next
        })
    }

    const handleRecordClick = (record: Record, event: React.MouseEvent<HTMLSpanElement>) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const tableContainer = event.currentTarget.closest('table')?.getBoundingClientRect()

        if (tableContainer) {
            const viewportHeight = window.innerHeight
            const detailHeight = 300
            const detailWidth = Math.min(400, Math.max(200, rect.width * 1.5))

            let top = rect.bottom - tableContainer.top + 4
            const spaceBelow = viewportHeight - (rect.bottom + detailHeight)
            const spaceAbove = rect.top - detailHeight

            if (spaceBelow < 0 && spaceAbove > 0) {
                top = rect.top - tableContainer.top - detailHeight + 115
            }

            if (top < 0) {
                top = 4
            }

            const left = rect.left - tableContainer.left + 4

            setDetailPosition({
                top: Math.max(4, top),
                left: Math.max(4, left),
                width: detailWidth,
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

    const handleOpenCreateModal = (date?: string) => {
        if (!isLoggedIn()) {
            setShowLoginModal(true)
            return
        }
        setSelectedDate(date || null)
        setIsCreateModalOpen(true)
    }

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false)
    }

    const handleOpenUpdateModal = () => {
        setIsDetailModalOpen(false)
        setIsUpdateModalOpen(true)
    }

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false)
        setSelectedRecord(null)
    }

    const handleDeleteRecord = async () => {
        if (!selectedRecord) return

        if (!isLoggedIn()) {
            setShowLoginModal(true)
            return
        }

        const result = await confirm({
            title: '레코드 삭제',
            icon: '/assets/img/ico/ic-delete.svg',
            description: `삭제하면 레코드에 저장된 내용이 모두 사라져요.\n한 번 삭제하면 되돌릴 수 없어요.`,
            confirmText: '삭제하기',
            cancelText: '돌아가기',
        })

        if (!result) return

        try {
            const response = await fetch(`/api/records/${selectedRecord.id}`, {
                method: HttpMethod.DELETE,
            })

            if (response.ok) {
                handleCloseModal()
                triggerRecordRefresh()
            } else {
                console.error('Failed to delete record')
            }
        } catch (error) {
            console.error('Error deleting record:', error)
        }
    }

    return (
        <>
            {groupedSections.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                    이번 달에 기록이 없습니다.
                </div>
            ) : (
                groupedSections.map((section) => {
                    const isCollapsed = collapsedGroups.has(section.groupId)
                    return (
                        <div key={section.groupId} className="group-section" style={{ marginBottom: '1.6rem' }}>
                            {/* 그룹 헤더 */}
                            <div
                                onClick={() => toggleGroup(section.groupId)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    padding: '0.8rem 1.2rem',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    borderBottom: '1px solid var(--border-color, #e5e5e5)',
                                }}
                            >
                                <div
                                    style={{
                                        width: '1rem',
                                        height: '1rem',
                                        borderRadius: '50%',
                                        backgroundColor: section.groupColor,
                                        flexShrink: 0,
                                    }}
                                />
                                <strong style={{ fontSize: '1.4rem' }}>{section.groupTitle}</strong>
                                <span style={{ fontSize: '1.2rem', color: '#999' }}>
                                    {section.records.length}건
                                </span>
                                <i
                                    className={isCollapsed ? 'ic-arrow-down' : 'ic-arrow-up'}
                                    style={{ marginLeft: 'auto', fontSize: '1.2rem' }}
                                />
                            </div>

                            {/* 그룹 내 레코드 테이블 */}
                            {!isCollapsed && (
                                <table className="list">
                                    <colgroup>
                                        <col style={{ width: '8rem' }} />
                                        <col style={{ width: '4rem' }} />
                                        <col style={{ width: '8rem' }} />
                                        <col style={{ width: 'auto' }} />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>일자</th>
                                            <th>추가</th>
                                            <th>시간</th>
                                            <th>내용</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {section.records.map((item, index) => {
                                            const startTimestamp = parseInt(item.record.startedAt.toString())
                                            const currentDay = dayjs(startTimestamp)
                                            const today = dayjs().format('YYYY-MM-DD')
                                            const recordDateStr = currentDay.format('YYYY-MM-DD')
                                            const isToday = recordDateStr === today
                                            const isWeekend = currentDay.day() === 0 || currentDay.day() === 6

                                            // 같은 날짜의 첫 번째 레코드인지 확인
                                            const isFirstOfDay =
                                                index === 0 ||
                                                item.displayDate !== section.records[index - 1].displayDate

                                            return (
                                                <tr
                                                    key={`${item.record.id}-${index}`}
                                                    className={isToday ? 'today' : ''}
                                                >
                                                    <td className={isWeekend ? 'holiday' : ''}>
                                                        {isFirstOfDay ? item.displayDate : ''}
                                                    </td>
                                                    <td>
                                                        {isFirstOfDay ? (
                                                            <button
                                                                onClick={() =>
                                                                    handleOpenCreateModal(recordDateStr)
                                                                }
                                                            >
                                                                <i className="ic-add" />
                                                            </button>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </td>
                                                    <td>
                                                        <p
                                                            className={
                                                                item.isMultiDayMiddle
                                                                    ? 'multi-day-middle'
                                                                    : ''
                                                            }
                                                        >
                                                            {item.displayTime}
                                                        </p>
                                                    </td>
                                                    <td
                                                        onClick={(e) =>
                                                            handleRecordClick(item.record as Record, e)
                                                        }
                                                    >
                                                        <p
                                                            className={`text-left ${
                                                                item.isMultiDayMiddle
                                                                    ? 'multi-day-middle'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {item.record.title}
                                                        </p>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )
                })
            )}

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
                record={selectedRecord}
                allRecordGroups={allRecordGroups}
            />

            {/* RecordCreateModal */}
            <RecordCreateModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                selectedDate={selectedDate}
                allRecordGroups={allRecordGroups}
            />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </>
    )
})

GroupCalendar.displayName = 'GroupCalendar'

export default GroupCalendar
