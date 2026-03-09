import React, { useEffect, useState, useMemo } from "react";
import { RecordGroup, Record } from "@workfolio/shared/generated/common";
import { resolveRecordGroupColor } from "@workfolio/shared/models/ColorModel";
import { useRecordGroupStore } from "@workfolio/shared/store/recordGroupStore";
import { useShallow } from "zustand/react/shallow";
import { isLoggedIn } from "@workfolio/shared/utils/authUtils";
import HttpMethod from "@workfolio/shared/enums/HttpMethod";
import dayjs from "dayjs";
import EmptyState from "@workfolio/shared/ui/EmptyState";
// ============================================
// TODO: 샘플 데이터 관련 코드 - 추후 제거 예정
// ============================================
import { createSampleRecordGroups, createSampleRecords } from "@/utils/sampleRecordData";
// ============================================

// timestamp(number 또는 string) → "YYYY.MM.DD" 문자열로 변환
// 기존 캘린더 코드와 동일하게 parseInt 처리 후 dayjs에 전달
const formatTimestamp = (value: number | string): string => {
    const ts = typeof value === "string" ? parseInt(value, 10) : value;
    if (!ts || isNaN(ts)) return "-";
    // 기존 캘린더 코드와 동일: dayjs(parseInt(record.startedAt.toString()))
    const d = dayjs(ts);
    if (d.isValid() && d.year() >= 2000 && d.year() <= 2100) {
        return d.format("YYYY.MM.DD");
    }
    return "-";
};

interface RecordDashboardProps {
    allRecordGroups: RecordGroup[];
}

interface GroupSummary {
    group: RecordGroup;
    recordCount: number;
    lastRecordDate: string | null;
}

const RecordDashboard: React.FC<RecordDashboardProps> = ({ allRecordGroups }) => {
    const [allRecords, setAllRecords] = useState<Record[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { sampleRecords, checkedGroups } = useRecordGroupStore(
        useShallow((state) => ({
            sampleRecords: state.sampleRecords,
            checkedGroups: state.checkedGroups,
        }))
    );

    // 체크된 기록장 필터링
    const filteredRecordGroups = useMemo(
        () => allRecordGroups.filter((group) => checkedGroups.has(group.id)),
        [allRecordGroups, checkedGroups]
    );

    // 전체 기록 조회 (대시보드용)
    useEffect(() => {
        const fetchAllRecords = async () => {
            setIsLoading(true);

            if (!isLoggedIn()) {
                if (sampleRecords.length > 0) {
                    setAllRecords(sampleRecords);
                } else {
                    const sampleRecordGroups = createSampleRecordGroups();
                    const records = createSampleRecords(sampleRecordGroups) as unknown as Record[];
                    setAllRecords(records);
                }
                setIsLoading(false);
                return;
            }

            try {
                const now = dayjs();
                const groupIds = allRecordGroups.map((g) => g.id).join(",");
                if (!groupIds) {
                    setAllRecords([]);
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(
                    `/api/records/monthly?year=${now.year()}&month=${now.month() + 1}&recordGroupIds=${groupIds}`,
                    { method: HttpMethod.GET }
                );

                if (response.ok) {
                    const data = await response.json();
                    const records = data.records || data || [];
                    setAllRecords(Array.isArray(records) ? records : []);
                } else {
                    setAllRecords([]);
                }
            } catch {
                setAllRecords([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllRecords();
    }, [allRecordGroups, sampleRecords]);

    // 대시보드 요약 데이터 계산
    // startedAt/createdAt → 숫자로 파싱 (문자열일 수 있음)
    const parseTs = (value: number | string): number => {
        const n = typeof value === "string" ? parseInt(value, 10) : value;
        return isNaN(n) ? 0 : n;
    };

    const { totalGroups, totalRecords, lastRecordDate, groupSummaries } = useMemo(() => {
        // 체크된 기록장의 ID 목록
        const checkedGroupIds = new Set(filteredRecordGroups.map((g) => g.id));

        // 체크된 기록장에 해당하는 기록만 필터링
        const filteredRecords = allRecords.filter(
            (r) => r.recordGroup?.id && checkedGroupIds.has(r.recordGroup.id)
        );

        const groupSummaries: GroupSummary[] = filteredRecordGroups.map((group) => {
            const groupRecords = filteredRecords.filter(
                (r) => r.recordGroup?.id === group.id
            );
            const dates = groupRecords
                .map((r) => parseTs(r.startedAt || r.createdAt))
                .filter((v) => v > 0)
                .sort((a, b) => b - a);

            return {
                group,
                recordCount: groupRecords.length,
                lastRecordDate: dates.length > 0
                    ? formatTimestamp(dates[0])
                    : null,
            };
        });

        const allDates = filteredRecords
            .map((r) => parseTs(r.startedAt || r.createdAt))
            .filter((v) => v > 0)
            .sort((a, b) => b - a);

        return {
            totalGroups: filteredRecordGroups.length,
            totalRecords: filteredRecords.length,
            lastRecordDate: allDates.length > 0
                ? formatTimestamp(allDates[0])
                : null,
            groupSummaries,
        };
    }, [filteredRecordGroups, allRecords]);

    return (
        <div className="contents">
            <div className="page-title">
                <div>
                    <h2>내 기록 관리</h2>
                </div>
            </div>
            <div className="page-cont">
                {/* 내 기록 현황 */}
                <div className="cont-box">
                    <div className="cont-tit">
                        <div>
                            <h3>내 기록 현황</h3>
                        </div>
                    </div>
                    {/* isLoading ? (
                        <ul className="stats-summary">
                            <li><p>총 기록장</p><div>-</div></li>
                            <li><p>총 기록 수</p><div>-</div></li>
                            <li><p>마지막 기록 일자</p><div>-</div></li>
                        </ul>
                    ) : */ }
                    {(
                        <ul className="stats-summary">
                            <li>
                                <p>총 기록장</p>
                                <div>{totalGroups}<span>개</span></div>
                            </li>
                            <li>
                                <p>총 기록 수</p>
                                <div>{totalRecords}<span>건</span></div>
                            </li>
                            <li>
                                <p>마지막 기록 일자</p>
                                <div>{lastRecordDate || "-"}</div>
                            </li>
                        </ul>
                    )}
                </div>

                {/* 그룹별 기록 현황 */}
                <div className="cont-box">
                    <div className="cont-tit">
                        <div>
                            <h3>기록장별 기록 현황</h3>
                            <p>{totalGroups}개</p>
                        </div>
                    </div>
                    {/* isLoading ? (
                        <div className="summary-empty">
                            <p>불러오는 중...</p>
                        </div>
                    ) : */ groupSummaries.length === 0 ? (
                        <EmptyState text="등록된 기록장이 없습니다." />
                    ) : (
                        <ul className="summary-list">
                            {groupSummaries.map(({ group, recordCount, lastRecordDate }) => (
                                <li key={group.id}>
                                    <div className="info">
                                        <div>
                                            <div>
                                                <span
                                                    className="record-group-color-dot"
                                                    style={{ backgroundColor: resolveRecordGroupColor(group.color) }}
                                                />
                                                <p>{group.title}</p>
                                            </div>
                                        </div>
                                        <ul>
                                            <li>기록 수 {recordCount}건</li>
                                            <li>마지막 기록 {lastRecordDate || "-"}</li>
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecordDashboard;
