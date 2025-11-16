import React, {useState, useCallback, forwardRef, useImperativeHandle, useEffect, useRef, useMemo} from 'react'
import { useSearchParams } from 'next/navigation'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import { useRecords } from '@/hooks/useRecords'
import { CalendarViewType } from '@/models/CalendarTypes'
import { useSystemConfigStore } from '@/store/systemConfigStore'
import { RecordGroup, SystemConfig_SystemConfigType } from '@/generated/common'
import { parseCalendarViewType } from '@/utils/commonUtils'
import { RecordGroupDetailResponse } from '@/generated/record_group'
import { ListRecordResponse } from '@/generated/record'
import dayjs from 'dayjs'
import CalendarHeader from '../calendar/CalendarHeader'
import ListCalendar from '../calendar/list/ListCalendar'
import MonthlyCalendar from '../calendar/monthly/MonthlyCalendar'
import WeeklyCalendar from '../calendar/weekly/WeeklyCalendar'
import RecordSearch from '../search/RecordSearch'

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
    const [date, setDate] = useState<Date>(urlDate)
    const [searchResults, setSearchResults] = useState<ListRecordResponse | null>(null)
    
    // 초기 URL 설정 여부 추적
    const isInitialURLSet = useRef(false)
    // 네비게이션 버튼으로 변경 중인지 추적 (URL 동기화 스킵용)
    const isNavigating = useRef(false)
    
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
    const { records, refreshRecords, searchRecordsByKeyword } = useRecords(
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
    
    // useEffect로 URL 업데이트 실행 (RSC fetch 없이 URL만 업데이트)
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
            
            // 🔥 router.push 대신 window.history.replaceState 사용
            // Next.js RSC fetch를 트리거하지 않고 URL만 업데이트
            const newUrl = `${window.location.pathname}?${params.toString()}`
            window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl)
            
            setPendingURLUpdate(null)
        }
    }, [pendingURLUpdate, searchParams])

    // ref를 통해 외부에서 refreshRecords 호출 가능하도록 설정
    useImperativeHandle(ref, () => ({
        refreshRecords: () => {
            refreshRecords();
        }
    }), [refreshRecords]);


    // 이벤트 핸들러들
    const handleTypeChange = useCallback((type: CalendarViewType) => {
        isNavigating.current = true
        setRecordType(type)
        updateURL(type, date)
    }, [date, updateURL])

    const handlePreviousMonth = useCallback(() => {
        isNavigating.current = true
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
        isNavigating.current = true
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
        isNavigating.current = true
        const today = dayjs().toDate()
        setDate(today)
        updateURL(recordType, today)
    }, [recordType, updateURL])

    const handleSearchChange = useCallback(async (term: string) => {
        // 키워드 검색 API 호출 (엔터 키를 눌렀을 때 호출됨)
        if (term && term.trim() !== '') {
            // 체크된 recordGroupIds 추출
            const recordGroupIds = checkedRecordGroups.map(group => group.id).filter(Boolean) as string[];
            
            const result = await searchRecordsByKeyword(term, recordGroupIds.length > 0 ? recordGroupIds : undefined)

            console.log('result', result);
            if (result) {
                setSearchResults(result)
            } else {
                setSearchResults(null)
            }
        } else {
            setSearchResults(null)
        }
    }, [searchRecordsByKeyword, checkedRecordGroups])

    const handleCloseSearch = useCallback(() => {
        setSearchResults(null)
    }, [])

    // URL 파라미터 변경 시 상태 업데이트 (외부에서 URL이 변경된 경우만)
    useEffect(() => {
        // 네비게이션 버튼으로 변경 중이면 스킵 (중복 상태 업데이트 방지)
        if (isNavigating.current) {
            isNavigating.current = false
            return
        }
        
        const urlView = searchParams.get('view') as CalendarViewType
        const urlDateString = searchParams.get('date')
        
        if (urlView && urlView !== recordType) {
            setRecordType(urlView)
        }
        
        if (urlDateString) {
            const newDate = dayjs(urlDateString).toDate()
            // 날짜를 일 단위로 비교 (밀리초 차이 무시)
            const isSameDate = dayjs(newDate).isSame(dayjs(date), 'day')
            if (!isSameDate) {
                setDate(newDate)
            }
        }
    // recordType과 date는 의도적으로 의존성에서 제외 (무한 루프 방지)
    // searchParams 변경 시에만 동기화
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

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
                onSearchChange={handleSearchChange}
            />
            
            {/* 검색 결과가 있으면 검색 결과 표시, 없으면 캘린더 표시 */}
            {searchResults ? (
                <RecordSearch
                    searchResults={searchResults}
                    allRecordGroups={allRecordGroups}
                    onClose={handleCloseSearch}
                />
            ) : (
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
            )}
        </div>
    );
});

BodyRightComponent.displayName = 'BodyRightComponent';

export default React.memo(BodyRightComponent);