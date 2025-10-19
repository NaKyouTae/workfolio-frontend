import React, {useState, useCallback, forwardRef, useImperativeHandle, useEffect, useRef, useMemo} from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ListCalendar from '@/components/features/calendar/list/ListCalendar'
import CalendarHeader from '@/components/features/calendar/CalendarHeader'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import { useRecords } from '@/hooks/useRecords'
import MonthlyCalendar from '@/components/features/calendar/monthly/MonthlyCalendar'
import WeeklyCalendar from '@/components/features/calendar/weekly/WeeklyCalendar'
import { CalendarViewType } from '@/models/CalendarTypes'
import { useSystemConfigStore } from '@/store/systemConfigStore'
import { RecordGroup, SystemConfig_SystemConfigType } from '@/generated/common'
import { parseCalendarViewType } from '@/utils/commonUtils'
import { RecordGroupDetailResponse } from '@/generated/record_group'
import dayjs from 'dayjs'

export interface BodyRightRef {
    refreshRecords: () => void;
}

interface BodyRightProps {
    recordGroupsData: {
        ownedRecordGroups: RecordGroup[];
        sharedRecordGroups: RecordGroup[];
        allRecordGroups: RecordGroup[];
        isLoading: boolean;
        refreshRecordGroups: () => void;
        fetchRecordGroupDetails: (recordGroupId: string) => Promise<RecordGroupDetailResponse | null>;
    };
}

const BodyRightComponent = forwardRef<BodyRightRef, BodyRightProps>(({ recordGroupsData }, ref) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    
    // 시스템 설정 store에서 가져오기 (이미 Contents에서 로드됨)
    const { getSystemConfig } = useSystemConfigStore();
    const systemConfig = getSystemConfig(SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE);
    
    // URL에서 초기 상태 읽기
    const urlView = searchParams.get('view') as CalendarViewType | null
    const urlDateString = searchParams.get('date')
    const urlDate = urlDateString ? dayjs(urlDateString).toDate() : dayjs().toDate()
    
    // urlView가 있으면 사용, 없으면 systemConfig 사용, 그것도 없으면 'monthly'
    const initialRecordType: CalendarViewType = urlView || parseCalendarViewType(systemConfig?.value, 'monthly')

    const [recordType, setRecordType] = useState<CalendarViewType>(initialRecordType)
    const [searchTerm, setSearchTerm] = useState('')
    const [date, setDate] = useState<Date>(urlDate)
    
    // 초기 URL 설정 여부 추적
    const isInitialURLSet = useRef(false)
    
    // store에서 체크된 RecordGroup 정보 가져오기
    const { getCheckedRecordGroups } = useRecordGroupStore()
    const checkedRecordGroups = getCheckedRecordGroups()
    
    // props로 받은 recordGroupsData 사용
    const { allRecordGroups, ownedRecordGroups } = recordGroupsData
    
    // 편집 가능한 record groups (owned + 일부 shared)
    const editableRecordGroups = useMemo(() => {
        // 현재는 owned만 편집 가능
        return ownedRecordGroups
    }, [ownedRecordGroups])
    
    // records hook 사용 - recordType에 따라 적절한 파라미터 전달
    const { records, refreshRecords } = useRecords(
        recordType, 
        recordType === 'monthly' || recordType === 'list' ? date.getMonth() + 1 : undefined,
        recordType === 'monthly' || recordType === 'list' ? date.getFullYear() : undefined,
        recordType === 'weekly' ? date : undefined
    )

    // URL 업데이트를 위한 상태
    const [pendingURLUpdate, setPendingURLUpdate] = useState<{view: CalendarViewType, date: Date} | null>(null)
    
    // URL 업데이트 함수 - 상태만 설정
    const updateURL = useCallback((newView: CalendarViewType, newDate: Date) => {
        setPendingURLUpdate({ view: newView, date: newDate })
    }, [])
    
    // useEffect로 URL 업데이트 실행
    useEffect(() => {
        if (pendingURLUpdate) {
            const params = new URLSearchParams(searchParams.toString())
            params.set('view', pendingURLUpdate.view)
            
            // 월간, 목록 캘린더의 경우 월만 변경하고 일자는 오늘 날짜로 설정
            let dateToUse = dayjs(pendingURLUpdate.date)
            if (pendingURLUpdate.view === 'monthly' || pendingURLUpdate.view === 'list') {
                const today = dayjs()
                dateToUse = dayjs(pendingURLUpdate.date)
                    .year(today.year())
                    .month(today.month())
                    .date(today.date())
            }
            
            params.set('date', dateToUse.format('YYYY-MM-DD'))
            router.push(`?${params.toString()}`, { scroll: false })
            setPendingURLUpdate(null)
        }
    }, [pendingURLUpdate, searchParams, router])

    // ref를 통해 외부에서 refreshRecords 호출 가능하도록 설정
    useImperativeHandle(ref, () => ({
        refreshRecords: () => {
            refreshRecords();
        }
    }), [refreshRecords]);


    // 이벤트 핸들러들
    const handleTypeChange = useCallback((type: CalendarViewType) => {
        setRecordType(type)
        updateURL(type, date)
    }, [date, updateURL])

    const handlePreviousMonth = useCallback(() => {
        setDate(prev => {
            let newDate
            if (recordType === 'weekly') {
                // 주 단위로 변경 (7일 전)
                newDate = dayjs(prev).subtract(7, 'day').toDate()
            } else {
                // 월 단위로 변경
                newDate = dayjs(prev).subtract(1, 'month').toDate()
            }
            updateURL(recordType, newDate)
            return newDate
        })
    }, [recordType, updateURL])

    const handleNextMonth = useCallback(() => {
        setDate(prev => {
            let newDate
            if (recordType === 'weekly') {
                // 주 단위로 변경 (7일 후)
                newDate = dayjs(prev).add(7, 'day').toDate()
            } else {
                // 월 단위로 변경
                newDate = dayjs(prev).add(1, 'month').toDate()
            }
            updateURL(recordType, newDate)
            return newDate
        })
    }, [recordType, updateURL])

    const handleTodayMonth = useCallback(() => {
        const today = dayjs().toDate()
        setDate(today)
        updateURL(recordType, today)
    }, [recordType, updateURL])

    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term)
    }, [])

    // URL 파라미터 변경 시 상태 업데이트
    useEffect(() => {
        const urlView = searchParams.get('view') as CalendarViewType
        const urlDateString = searchParams.get('date')
        
        if (urlView && urlView !== recordType) {
            setRecordType(urlView)
        }
        
        if (urlDateString) {
            const newDate = dayjs(urlDateString).toDate()
            if (newDate.getTime() !== date.getTime()) {
                setDate(newDate)
            }
        }
    }, [searchParams, recordType, date])

    // 초기 로딩 시 URL 파라미터 설정
    useEffect(() => {
        // 이미 초기 URL을 설정했으면 스킵
        if (isInitialURLSet.current) return
        
        const urlView = searchParams.get('view')
        const urlDate = searchParams.get('date')
        
        // URL에 view나 date가 없으면 초기값으로 설정
        if (!urlView || !urlDate) {
            updateURL(recordType, date)
            isInitialURLSet.current = true
        } else {
            isInitialURLSet.current = true
        }
    }, [searchParams, recordType, date, updateURL])

    // 검색 필터링된 레코드
    const filteredRecords = Array.isArray(records) ? records : []
    
    return (
        <div className="contents">
            {/* CalendarHeader - 상위에 위치 */}
            <CalendarHeader 
                date={date}
                recordType={recordType}
                onTypeChange={handleTypeChange}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
                onTodayMonth={handleTodayMonth}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
            />
            
            {/* Calendar - 하위에 위치, 토글에 따라 변경 */}
            <div className="calendar-wrap">
                {recordType === 'monthly' ? (
                    <MonthlyCalendar
                        key={`monthly-${date.getTime()}`}
                        initialDate={date}
                        records={filteredRecords}
                        allRecordGroups={allRecordGroups}
                        editableRecordGroups={editableRecordGroups}
                    />
                ) : recordType === 'weekly' ? (
                    <WeeklyCalendar
                        key={`weekly-${date.getTime()}`}
                        initialDate={date}
                        records={filteredRecords}
                        allRecordGroups={allRecordGroups}
                        editableRecordGroups={editableRecordGroups}
                    />
                ) : (
                    <ListCalendar
                        key={`list-${date.getTime()}`}
                        initialDate={date} 
                        records={filteredRecords}
                        recordGroups={checkedRecordGroups}
                        allRecordGroups={allRecordGroups}
                        editableRecordGroups={editableRecordGroups}
                    />
                )}
            </div>
        </div>
    );
});

BodyRightComponent.displayName = 'BodyRightComponent';

export default React.memo(BodyRightComponent);