import React, { useState } from 'react'
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
import { isLoggedIn } from '@workfolio/shared/utils/authUtils'
import LoginModal from '@workfolio/shared/ui/LoginModal'

dayjs.locale('ko')
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

interface RecordFeedProps {
    initialDate: Date
    records: Record[]
    allRecordGroups: RecordGroup[]
}

interface DayGroup {
    date: string
    displayDate: string
    dayOfWeek: string
    isWeekend: boolean
    isToday: boolean
    records: Record[]
}

const RecordFeed: React.FC<RecordFeedProps> = React.memo(({
    records,
    allRecordGroups,
}) => {
    const { confirm } = useConfirm()
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [showLoginModal, setShowLoginModal] = useState(false)

    const { triggerRecordRefresh } = useRecordGroupStore()

    const today = dayjs().format('YYYY-MM-DD')

    // records를 날짜별로 그룹화 (기록이 있는 날짜만)
    const dayGroups: DayGroup[] = React.useMemo(() => {
        const groupMap: { [key: string]: Record[] } = {}

        const recordsArray = Array.isArray(records) ? records : []

        recordsArray.forEach(record => {
            const startTimestamp = parseInt(record.startedAt.toString())
            const endTimestamp = parseInt(record.endedAt.toString())
            const startDate = dayjs(startTimestamp)
            const endDate = dayjs(endTimestamp)

            if (Record_RecordType[record.type] == Record_RecordType.MULTI_DAY.toString()) {
                let currentDate = startDate.clone()
                while (currentDate.isSame(endDate, 'day') || currentDate.isBefore(endDate, 'day')) {
                    const dateKey = currentDate.format('YYYY-MM-DD')
                    if (!groupMap[dateKey]) groupMap[dateKey] = []
                    groupMap[dateKey].push(record)
                    currentDate = currentDate.add(1, 'day')
                }
            } else {
                const dateKey = startDate.format('YYYY-MM-DD')
                if (!groupMap[dateKey]) groupMap[dateKey] = []
                groupMap[dateKey].push(record)
            }
        })

        // 날짜 내림차순 정렬 (최신 먼저)
        return Object.keys(groupMap)
            .sort((a, b) => b.localeCompare(a))
            .map(dateKey => {
                const d = dayjs(dateKey)
                return {
                    date: dateKey,
                    displayDate: d.format('M월 D일 dddd'),
                    dayOfWeek: d.format('ddd'),
                    isWeekend: d.day() === 0 || d.day() === 6,
                    isToday: dateKey === today,
                    records: groupMap[dateKey].sort((a, b) =>
                        parseInt(a.startedAt.toString()) - parseInt(b.startedAt.toString())
                    ),
                }
            })
    }, [records, today])

    const handleRecordClick = (record: Record) => {
        setSelectedRecord(record)
        setIsDetailModalOpen(true)
    }

    const handleCloseModal = () => {
        setSelectedRecord(null)
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

    const getRecordTimeDisplay = (record: Record): string => {
        const startTimestamp = parseInt(record.startedAt.toString())
        const endTimestamp = parseInt(record.endedAt.toString())
        const startDate = dayjs(startTimestamp)
        const endDate = dayjs(endTimestamp)

        if (Record_RecordType[record.type] == Record_RecordType.DAY.toString()) {
            return '하루 종일'
        }
        if (Record_RecordType[record.type] == Record_RecordType.MULTI_DAY.toString()) {
            return `${startDate.format('M/D')} - ${endDate.format('M/D')}`
        }
        return `${startDate.format('A h:mm')} - ${endDate.format('A h:mm')}`
    }

    return (
        <>
            <div className="record-feed">
                {dayGroups.length === 0 ? (
                    <div className="record-feed-empty">
                        <p>기록이 없습니다.</p>
                    </div>
                ) : (
                    dayGroups.map(group => (
                        <div key={group.date} className="record-feed-day">
                            <div className={`record-feed-day-header ${group.isToday ? 'today' : ''} ${group.isWeekend ? 'weekend' : ''}`}>
                                <span className="record-feed-day-date">{group.displayDate}</span>
                                <button
                                    className="record-feed-day-add"
                                    onClick={() => handleOpenCreateModal(group.date)}
                                >
                                    <i className="ic-add" />
                                </button>
                            </div>
                            <div className="record-feed-cards">
                                {group.records.map((record, index) => (
                                    <div
                                        key={`${record.id}-${index}`}
                                        className="record-feed-card"
                                        onClick={() => handleRecordClick(record)}
                                    >
                                        <span
                                            className="record-feed-card-color"
                                            style={{ backgroundColor: record.recordGroup?.color || '#e0e0e0' }}
                                        />
                                        <div className="record-feed-card-content">
                                            <div className="record-feed-card-header">
                                                <span className="record-feed-card-group">
                                                    {record.recordGroup?.title || '기본'}
                                                </span>
                                                <span className="record-feed-card-time">
                                                    {getRecordTimeDisplay(record)}
                                                </span>
                                            </div>
                                            <p className="record-feed-card-title">{record.title}</p>
                                            {record.description && (
                                                <p className="record-feed-card-desc">{record.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <RecordDetail
                isOpen={isDetailModalOpen}
                onClose={handleCloseModal}
                record={selectedRecord}
                onEdit={handleOpenUpdateModal}
                onDelete={handleDeleteRecord}
            />

            <RecordUpdateModal
                isOpen={isUpdateModalOpen}
                onClose={handleCloseUpdateModal}
                record={selectedRecord}
                allRecordGroups={allRecordGroups}
            />

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

RecordFeed.displayName = 'RecordFeed'

export default RecordFeed
