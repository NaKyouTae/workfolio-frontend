import React, {
    useState,
    useCallback,
    forwardRef,
    useImperativeHandle,
    useEffect,
    useRef,
} from "react";
import { useSearchParams } from "next/navigation";
import { useRecordGroupStore } from "@workfolio/shared/store/recordGroupStore";
import { useRecords } from "@/hooks/useRecords";
import { CalendarViewType } from "@workfolio/shared/models/CalendarTypes";
import { useSystemConfigStore } from "@workfolio/shared/store/systemConfigStore";
import { RecordGroup, SystemConfig_SystemConfigType } from "@workfolio/shared/generated/common";
import { parseCalendarViewType } from "@workfolio/shared/utils/commonUtils";
import { RecordGroupDetailResponse } from "@workfolio/shared/generated/record_group";
import { ListRecordResponse } from "@workfolio/shared/generated/record";
import dayjs from "dayjs";
import CalendarHeader from "./calendar/CalendarHeader";
import ListCalendar from "./calendar/list/ListCalendar";
import MonthlyCalendar from "./calendar/monthly/MonthlyCalendar";
import WeeklyCalendar from "./calendar/weekly/WeeklyCalendar";
import GroupCalendar from "./calendar/group/GroupCalendar";
import RecordSearch from "./search/RecordSearch";
import WeeklyCalendarSkeleton from "@workfolio/shared/ui/skeleton/WeeklyCalendarSkeleton";
import MonthlyCalendarSkeleton from "@workfolio/shared/ui/skeleton/MonthlyCalendarSkeleton";
import ListCalendarSkeleton from "@workfolio/shared/ui/skeleton/ListCalendarSkeleton";

export interface RecordContentsRef {
    refreshRecords: () => void;
}

interface RecordContentsProps {
    recordGroupsData: {
        ownedRecordGroups: RecordGroup[];
        sharedRecordGroups: RecordGroup[];
        allRecordGroups: RecordGroup[];
        isLoading: boolean;
        refreshRecordGroups: () => void;
        fetchRecordGroupDetails: (
            recordGroupId: string
        ) => Promise<RecordGroupDetailResponse | null>;
    };
}

const RecordContentsComponent = forwardRef<RecordContentsRef, RecordContentsProps>(
    ({ recordGroupsData }, ref) => {
        const searchParams = useSearchParams();

        // 시스템 설정 store에서 가져오기 (이미 RecordsPage에서 로드됨)
        const { getSystemConfig } = useSystemConfigStore();
        const systemConfig = getSystemConfig(SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE);

        // URL에서 초기 상태 읽기
        const urlView = searchParams.get("view") as CalendarViewType | null;
        const urlDateString = searchParams.get("date");
        const urlDate = urlDateString ? dayjs(urlDateString).toDate() : dayjs().toDate();
        // urlView가 있으면 사용, 없으면 systemConfig 사용, 그것도 없으면 'monthly'
        const initialRecordType: CalendarViewType =
            urlView || parseCalendarViewType(systemConfig?.value, "monthly");
        const [recordType, setRecordType] = useState<CalendarViewType>(initialRecordType);

        // systemConfig가 로드되면 recordType 동기화 및 초기 URL 설정 (URL에 view가 없을 때만)
        useEffect(() => {
            // URL에 view가 없고 systemConfig가 로드되었을 때만 업데이트
            if (!urlView && systemConfig?.value) {
                const configRecordType = parseCalendarViewType(systemConfig.value, "monthly");

                // recordType 업데이트
                if (configRecordType !== recordType) {
                    setRecordType(configRecordType);
                }

                // 초기 URL이 아직 설정되지 않았으면 지금 설정
                if (!isInitialURLSet.current) {
                    updateURL(configRecordType, date);
                    isInitialURLSet.current = true;
                } else {
                    // 이미 초기 URL이 설정되었지만 systemConfig 값과 다르면 업데이트
                    updateURL(configRecordType, date);
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [systemConfig?.value, urlView]); // systemConfig.value와 urlView를 의존성으로 사용
        const [date, setDate] = useState<Date>(urlDate);
        const [searchResults, setSearchResults] = useState<ListRecordResponse | null>(null);
        const [searchKeyword, setSearchKeyword] = useState<string>("");

        // 초기 URL 설정 여부 추적
        const isInitialURLSet = useRef(false);
        // 네비게이션 버튼으로 변경 중인지 추적 (URL 동기화 스킵용)
        const isNavigating = useRef(false);

        // store에서 체크된 RecordGroup 정보 가져오기
        const { getCheckedRecordGroups } = useRecordGroupStore();
        const checkedRecordGroups = getCheckedRecordGroups();

        // props로 받은 recordGroupsData 사용
        const { allRecordGroups } = recordGroupsData;

        // records hook 사용 - recordType에 따라 적절한 파라미터 전달
        const isMonthlyBased = recordType === "monthly" || recordType === "list" || recordType === "group";
        const { records, refreshRecords, searchRecordsByKeyword, isLoading } = useRecords(
            recordType === "group" ? "list" : recordType,
            isMonthlyBased ? date.getMonth() + 1 : undefined,
            isMonthlyBased ? date.getFullYear() : undefined,
            recordType === "weekly" ? date : undefined
        );

        // URL 업데이트를 위한 상태
        const [pendingURLUpdate, setPendingURLUpdate] = useState<{
            view: CalendarViewType;
            date: Date;
        } | null>(null);

        // URL 업데이트 함수 - 상태만 설정
        const updateURL = useCallback((newView: CalendarViewType, newDate: Date) => {
            setPendingURLUpdate({ view: newView, date: newDate });
        }, []);

        // useEffect로 URL 업데이트 실행 (RSC fetch 없이 URL만 업데이트)
        useEffect(() => {
            if (pendingURLUpdate) {
                const params = new URLSearchParams(searchParams.toString());
                params.set("view", pendingURLUpdate.view);

                // 월간, 목록 캘린더의 경우 월만 변경하고 일자는 오늘 날짜로 설정
                let dateToUse = dayjs(pendingURLUpdate.date);
                if (pendingURLUpdate.view === "monthly" || pendingURLUpdate.view === "list" || pendingURLUpdate.view === "group") {
                    const today = dayjs();
                    dateToUse = dayjs(pendingURLUpdate.date)
                        .year(today.year())
                        .month(today.month())
                        .date(today.date());
                }

                params.set("date", dateToUse.format("YYYY-MM-DD"));

                // 🔥 router.push 대신 window.history.replaceState 사용
                // Next.js RSC fetch를 트리거하지 않고 URL만 업데이트
                const newUrl = `${window.location.pathname}?${params.toString()}`;
                window.history.replaceState(
                    { ...window.history.state, as: newUrl, url: newUrl },
                    "",
                    newUrl
                );

                setPendingURLUpdate(null);
            }
        }, [pendingURLUpdate, searchParams]);

        // ref를 통해 외부에서 refreshRecords 호출 가능하도록 설정
        useImperativeHandle(
            ref,
            () => ({
                refreshRecords: () => {
                    refreshRecords();
                },
            }),
            [refreshRecords]
        );

        // 이벤트 핸들러들
        const handleTypeChange = useCallback(
            (type: CalendarViewType) => {
                isNavigating.current = true;
                setRecordType(type);
                updateURL(type, date);
            },
            [date, updateURL]
        );

        const handlePreviousMonth = useCallback(() => {
            isNavigating.current = true;
            setDate((prev) => {
                let newDate;
                if (recordType === "weekly") {
                    // 주 단위로 변경 (7일 전)
                    newDate = dayjs(prev).subtract(7, "day").toDate();
                } else {
                    // 월 단위로 변경
                    newDate = dayjs(prev).subtract(1, "month").toDate();
                }
                updateURL(recordType, newDate);
                return newDate;
            });
        }, [recordType, updateURL]);

        const handleNextMonth = useCallback(() => {
            isNavigating.current = true;
            setDate((prev) => {
                let newDate;
                if (recordType === "weekly") {
                    // 주 단위로 변경 (7일 후)
                    newDate = dayjs(prev).add(7, "day").toDate();
                } else {
                    // 월 단위로 변경
                    newDate = dayjs(prev).add(1, "month").toDate();
                }
                updateURL(recordType, newDate);
                return newDate;
            });
        }, [recordType, updateURL]);

        const handleTodayMonth = useCallback(() => {
            isNavigating.current = true;
            const today = dayjs().toDate();
            setDate(today);
            updateURL(recordType, today);
        }, [recordType, updateURL]);

        const handleSearchChange = useCallback(
            async (keyword: string) => {
                // 키워드 검색 API 호출 (엔터 키를 눌렀을 때 호출됨)
                if (keyword && keyword.trim() !== "") {
                    // 체크된 recordGroupIds 추출
                    const recordGroupIds = checkedRecordGroups
                        .map((group) => group.id)
                        .filter(Boolean) as string[];

                    const result = await searchRecordsByKeyword(
                        keyword,
                        recordGroupIds.length > 0 ? recordGroupIds : undefined
                    );

                    if (result) {
                        setSearchResults(result);
                        setSearchKeyword(keyword.trim());
                    } else {
                        setSearchResults(null);
                        setSearchKeyword("");
                    }
                } else {
                    setSearchResults(null);
                    setSearchKeyword("");
                }
            },
            [searchRecordsByKeyword, checkedRecordGroups]
        );

        const handleCloseSearch = useCallback(() => {
            setSearchResults(null);
            setSearchKeyword("");
        }, []);

        // URL 파라미터 변경 시 상태 업데이트 (외부에서 URL이 변경된 경우만)
        useEffect(() => {
            // 네비게이션 버튼으로 변경 중이면 스킵 (중복 상태 업데이트 방지)
            if (isNavigating.current) {
                isNavigating.current = false;
                return;
            }

            const urlView = searchParams.get("view") as CalendarViewType;
            const urlDateString = searchParams.get("date");

            if (urlView && urlView !== recordType) {
                setRecordType(urlView);
            }

            if (urlDateString) {
                const newDate = dayjs(urlDateString).toDate();
                // 날짜를 일 단위로 비교 (밀리초 차이 무시)
                const isSameDate = dayjs(newDate).isSame(dayjs(date), "day");
                if (!isSameDate) {
                    setDate(newDate);
                }
            }
            // recordType과 date는 의도적으로 의존성에서 제외 (무한 루프 방지)
            // searchParams 변경 시에만 동기화
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [searchParams]);

        // 초기 로딩 시 URL 파라미터 설정
        useEffect(() => {
            // 이미 초기 URL을 설정했으면 스킵
            if (isInitialURLSet.current) return;

            const urlView = searchParams.get("view");
            const urlDate = searchParams.get("date");

            // URL에 view나 date가 없으면 초기값으로 설정
            if (!urlView || !urlDate) {
                // URL에 view가 없으면 systemConfig가 로드될 때까지 기다렸다가 설정
                // systemConfig가 아직 로드되지 않았으면 나중에 설정하도록 스킵
                if (!urlView && !systemConfig?.value) {
                    // systemConfig가 로드될 때까지 기다림 (다른 useEffect에서 처리)
                    return;
                }

                // URL에 view가 없으면 systemConfig를 우선 사용, 그것도 없으면 현재 recordType 사용
                let viewToUse: CalendarViewType = recordType;
                if (!urlView) {
                    if (systemConfig?.value) {
                        viewToUse = parseCalendarViewType(systemConfig.value, "monthly");
                    }
                } else {
                    viewToUse = urlView as CalendarViewType;
                }
                updateURL(viewToUse, date);
                isInitialURLSet.current = true;
            } else {
                isInitialURLSet.current = true;
            }
        }, [searchParams, recordType, date, updateURL, systemConfig?.value]);

        // 검색 필터링된 레코드
        const filteredRecords = Array.isArray(records) ? records : [];

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
                    onCloseSearch={handleCloseSearch}
                    searchResults={searchResults}
                />

                {/* 검색 결과가 있으면 검색 결과 표시, 없으면 캘린더 표시 */}
                {searchResults ? (
                    <RecordSearch
                        searchResults={searchResults}
                        allRecordGroups={allRecordGroups}
                        keyword={searchKeyword}
                    />
                ) : (
                    <div className="calendar-wrap">
                        {isLoading ? (
                            // 로딩 중일 때 스켈레톤 UI 표시
                            recordType === "monthly" ? (
                                <MonthlyCalendarSkeleton />
                            ) : recordType === "weekly" ? (
                                <WeeklyCalendarSkeleton />
                            ) : recordType === "group" ? (
                                <ListCalendarSkeleton />
                            ) : (
                                <ListCalendarSkeleton />
                            )
                        ) : // 데이터 로드 완료 후 실제 캘린더 표시
                        recordType === "monthly" ? (
                            <MonthlyCalendar
                                key={`monthly-${date.getTime()}`}
                                initialDate={date}
                                records={filteredRecords}
                                allRecordGroups={allRecordGroups}
                            />
                        ) : recordType === "weekly" ? (
                            <WeeklyCalendar
                                key={`weekly-${date.getTime()}`}
                                initialDate={date}
                                records={filteredRecords}
                                allRecordGroups={allRecordGroups}
                            />
                        ) : recordType === "group" ? (
                            <GroupCalendar
                                key={`group-${date.getTime()}`}
                                initialDate={date}
                                records={filteredRecords}
                                recordGroups={checkedRecordGroups}
                                allRecordGroups={allRecordGroups}
                            />
                        ) : (
                            <ListCalendar
                                key={`list-${date.getTime()}`}
                                initialDate={date}
                                records={filteredRecords}
                                recordGroups={checkedRecordGroups}
                                allRecordGroups={allRecordGroups}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    }
);

RecordContentsComponent.displayName = "RecordContentsComponent";

export default React.memo(RecordContentsComponent);
