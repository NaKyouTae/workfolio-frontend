import React, { useEffect, useState, useMemo } from "react";
import { RecordGroup, Record } from "@workfolio/shared/generated/common";
import { resolveRecordGroupColor } from "@workfolio/shared/models/ColorModel";
import { useRecordGroupStore } from "@workfolio/shared/store/recordGroupStore";
import { useShallow } from "zustand/react/shallow";
import { isLoggedIn } from "@workfolio/shared/utils/authUtils";
import { useIsDemo } from "@/hooks/useIsDemo";
import HttpMethod from "@workfolio/shared/enums/HttpMethod";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import DemoBanner from "./DemoBanner";
import RecordCreateModal from "../modal/RecordCreateModal";
import { RECORD_TEMPLATES, RecordTemplateType, detectTemplateType } from "../templates/recordTemplates";

dayjs.extend(isoWeek);
// ============================================
// TODO: 샘플 데이터 관련 코드 - 추후 제거 예정
// ============================================
import { createSampleRecordGroups, createSampleRecords } from "@/utils/sampleRecordData";
// ============================================

// timestamp(number 또는 string) → "YYYY.MM.DD" 문자열로 변환
const formatTimestamp = (value: number | string): string => {
    const ts = typeof value === "string" ? parseInt(value, 10) : value;
    if (!ts || isNaN(ts)) return "-";
    const d = dayjs(ts);
    if (d.isValid() && d.year() >= 2000 && d.year() <= 2100) {
        return d.format("YYYY.MM.DD");
    }
    return "-";
};

interface RecordDashboardProps {
    allRecordGroups: RecordGroup[];
}

const RECENT_RECORDS_LIMIT = 3;


const RecordDashboard: React.FC<RecordDashboardProps> = ({ allRecordGroups }) => {
    const [allRecords, setAllRecords] = useState<Record[]>([]);
    const [quickTemplateType, setQuickTemplateType] = useState<RecordTemplateType | null>(null);

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
            if (!isLoggedIn()) {
                if (sampleRecords.length > 0) {
                    setAllRecords(sampleRecords);
                } else {
                    const sampleRecordGroups = createSampleRecordGroups();
                    const records = createSampleRecords(sampleRecordGroups) as unknown as Record[];
                    setAllRecords(records);
                }
                return;
            }

            try {
                const now = dayjs();
                const groupIds = allRecordGroups.map((g) => g.id).join(",");
                if (!groupIds) {
                    setAllRecords([]);
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
            }
        };

        fetchAllRecords();
    }, [allRecordGroups, sampleRecords]);

    // startedAt/createdAt → 숫자로 파싱
    const parseTs = (value: number | string): number => {
        const n = typeof value === "string" ? parseInt(value, 10) : value;
        return isNaN(n) ? 0 : n;
    };

    const dashboardData = useMemo(() => {
        const checkedGroupIds = new Set(filteredRecordGroups.map((g) => g.id));

        const filteredRecords = allRecords.filter(
            (r) => r.recordGroup?.id && checkedGroupIds.has(r.recordGroup.id)
        );

        const now = dayjs();
        const startOfWeek = now.startOf("week").valueOf();
        const endOfWeek = now.endOf("week").valueOf();
        const startOfMonth = now.startOf("month").valueOf();
        const endOfMonth = now.endOf("month").valueOf();
        const prevMonthStart = now.subtract(1, "month").startOf("month").valueOf();
        const prevMonthEnd = now.subtract(1, "month").endOf("month").valueOf();

        // 최근 기록: startedAt 기준 내림차순 정렬 후 상위 N개
        const sorted = [...filteredRecords].sort((a, b) => {
            const tsA = parseTs(a.startedAt || a.createdAt);
            const tsB = parseTs(b.startedAt || b.createdAt);
            return tsB - tsA;
        });

        // 템플릿 유형별 통계
        const stats: { [key: string]: number } = {};
        filteredRecords.forEach((r) => {
            const type = detectTemplateType(r.description || "");
            stats[type] = (stats[type] || 0) + 1;
        });

        // === 1. 이번 달 기록 요약 ===
        const thisMonthRecords = filteredRecords.filter((r) => {
            const ts = parseTs(r.startedAt || r.createdAt);
            return ts >= startOfMonth && ts <= endOfMonth;
        });
        const thisWeekRecords = filteredRecords.filter((r) => {
            const ts = parseTs(r.startedAt || r.createdAt);
            return ts >= startOfWeek && ts <= endOfWeek;
        });
        const lastMonthRecords = filteredRecords.filter((r) => {
            const ts = parseTs(r.startedAt || r.createdAt);
            return ts >= prevMonthStart && ts <= prevMonthEnd;
        });
        const monthDiff = thisMonthRecords.length - lastMonthRecords.length;

        // === 2. 히트맵 (최근 3개월) ===
        const heatmapStart = now.subtract(2, "month").startOf("month");
        const heatmapEnd = now.endOf("month");
        const heatmapData: { date: string; count: number }[] = [];
        const dayCountMap: { [key: string]: number } = {};
        filteredRecords.forEach((r) => {
            const ts = parseTs(r.startedAt || r.createdAt);
            if (ts > 0) {
                const d = dayjs(ts);
                if (d.isAfter(heatmapStart.subtract(1, "day")) && d.isBefore(heatmapEnd.add(1, "day"))) {
                    const key = d.format("YYYY-MM-DD");
                    dayCountMap[key] = (dayCountMap[key] || 0) + 1;
                }
            }
        });
        let cursor = heatmapStart;
        while (cursor.isBefore(heatmapEnd) || cursor.isSame(heatmapEnd, "day")) {
            const key = cursor.format("YYYY-MM-DD");
            heatmapData.push({ date: key, count: dayCountMap[key] || 0 });
            cursor = cursor.add(1, "day");
        }
        const heatmapMax = Math.max(1, ...heatmapData.map((d) => d.count));

        // === 5. 기록장별 활동 비율 ===
        const groupStats: { id: string; title: string; color: string; count: number }[] = [];
        const groupCountMap: { [key: string]: number } = {};
        filteredRecords.forEach((r) => {
            if (r.recordGroup?.id) {
                groupCountMap[r.recordGroup.id] = (groupCountMap[r.recordGroup.id] || 0) + 1;
            }
        });
        filteredRecordGroups.forEach((g) => {
            groupStats.push({
                id: g.id,
                title: g.title,
                color: resolveRecordGroupColor(g.color),
                count: groupCountMap[g.id] || 0,
            });
        });

        return {
            totalRecords: filteredRecords.length,
            recentRecords: sorted.slice(0, RECENT_RECORDS_LIMIT),
            templateStats: stats,
            thisMonthCount: thisMonthRecords.length,
            thisWeekCount: thisWeekRecords.length,
            monthDiff,
            heatmapData,
            heatmapMax,
            groupStats,
        };
    }, [filteredRecordGroups, allRecords]);

    const {
        totalRecords, recentRecords, templateStats,
        thisMonthCount, thisWeekCount, monthDiff,
        heatmapData, heatmapMax,
        groupStats,
    } = dashboardData;

    const isDemo = useIsDemo();

    // 히트맵 색상 계산
    const getHeatmapColor = (count: number) => {
        if (count === 0) return "var(--gray002)";
        const ratio = count / heatmapMax;
        if (ratio <= 0.25) return "var(--yellow002)";
        if (ratio <= 0.5) return "var(--yellow003)";
        if (ratio <= 0.75) return "var(--yellow004)";
        return "#f59e0b";
    };

    // 히트맵을 월별로 그룹핑
    const heatmapMonths = useMemo(() => {
        const months: { label: string; days: typeof heatmapData }[] = [];
        let currentMonth = "";
        let currentDays: typeof heatmapData = [];
        heatmapData.forEach((d) => {
            const m = dayjs(d.date).format("YYYY-MM");
            if (m !== currentMonth) {
                if (currentDays.length > 0) {
                    months.push({ label: dayjs(currentMonth + "-01").format("M월"), days: currentDays });
                }
                currentMonth = m;
                currentDays = [];
            }
            currentDays.push(d);
        });
        if (currentDays.length > 0) {
            months.push({ label: dayjs(currentMonth + "-01").format("M월"), days: currentDays });
        }
        return months;
    }, [heatmapData]);

    return (
        <div className="contents">
            <div className="page-title">
                <div>
                    <h2>내 기록 관리</h2>
                </div>
            </div>
            <div className="page-cont">
                {isDemo === true && <DemoBanner />}

                        {/* 빠른 기록 */}
                        <div className="cont-box">
                            <div className="cont-tit">
                                <div>
                                    <h3>빠른 기록</h3>
                                </div>
                            </div>
                            <ul className="quick-record-list">
                                {RECORD_TEMPLATES.map((template) => (
                                    <li
                                        key={template.type}
                                        onClick={() => setQuickTemplateType(template.type)}
                                    >
                                        <p>{template.label}</p>
                                        <span>{template.description}</span>
                                    </li>
                                ))}
                            </ul>
                            {quickTemplateType && (
                                <RecordCreateModal
                                    isOpen={true}
                                    onClose={() => setQuickTemplateType(null)}
                                    allRecordGroups={allRecordGroups}
                                    templateType={quickTemplateType}
                                />
                            )}
                        </div>

                        {/* 이번 달 요약 */}
                        <div className="cont-box">
                            <div className="cont-tit">
                                <div>
                                    <h3>이번 달 요약</h3>
                                </div>
                            </div>
                            <ul className="stats-summary">
                                <li>
                                    <p>이번 달</p>
                                    <div>{thisMonthCount}<span>건</span></div>
                                </li>
                                <li>
                                    <p>이번 주</p>
                                    <div>{thisWeekCount}<span>건</span></div>
                                </li>
                                <li>
                                    <p>지난달 대비</p>
                                    <div className={monthDiff > 0 ? "positive" : monthDiff < 0 ? "negative" : ""}>
                                        {monthDiff > 0 ? `+${monthDiff}` : monthDiff === 0 ? "0" : `${monthDiff}`}<span>건</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* 기록장별 활동 / 기록 히트맵 (1:2) */}
                        <div className="dashboard-row-1-2">
                            {/* 기록장별 활동 */}
                            <div className="cont-box">
                                <div className="cont-tit">
                                    <div>
                                        <h3>기록장별 활동</h3>
                                    </div>
                                </div>
                                {groupStats.length === 0 ? (
                                    <p className="empty-text">기록장이 없습니다.</p>
                                ) : (
                                    <div className="dash-group-stats">
                                        <div className="dash-group-donut">
                                            <svg viewBox="0 0 120 120" className="dash-donut-svg">
                                                {(() => {
                                                    const total = groupStats.reduce((sum, g) => sum + g.count, 0);
                                                    if (total === 0) {
                                                        return (
                                                            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--gray002)" strokeWidth="20" />
                                                        );
                                                    }
                                                    let offset = 0;
                                                    const circumference = 2 * Math.PI * 50;
                                                    return groupStats.map((g) => {
                                                        const ratio = g.count / total;
                                                        const dashLength = ratio * circumference;
                                                        const el = (
                                                            <circle
                                                                key={g.id}
                                                                cx="60"
                                                                cy="60"
                                                                r="50"
                                                                fill="none"
                                                                stroke={g.color}
                                                                strokeWidth="20"
                                                                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                                                                strokeDashoffset={-offset}
                                                                transform="rotate(-90 60 60)"
                                                            />
                                                        );
                                                        offset += dashLength;
                                                        return el;
                                                    });
                                                })()}
                                                <text x="60" y="56" textAnchor="middle" fontSize="18" fontWeight="600" fill="var(--black)">
                                                    {groupStats.reduce((sum, g) => sum + g.count, 0)}
                                                </text>
                                                <text x="60" y="72" textAnchor="middle" fontSize="10" fill="var(--gray005)">
                                                    총 기록
                                                </text>
                                            </svg>
                                        </div>
                                        <ul className="dash-group-legend">
                                            {groupStats.map((g) => (
                                                <li key={g.id}>
                                                    <span className="dash-group-dot" style={{ backgroundColor: g.color }} />
                                                    <span className="dash-group-name">{g.title}</span>
                                                    <span className="dash-group-count">{g.count}건</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* 기록 히트맵 */}
                            <div className="cont-box">
                                <div className="cont-tit">
                                    <div>
                                        <h3>기록 히트맵</h3>
                                        <p>최근 3개월</p>
                                    </div>
                                </div>
                                <div className="dash-heatmap">
                                    {heatmapMonths.map((month) => (
                                        <div key={month.label} className="dash-heatmap-month">
                                            <span className="dash-heatmap-label">{month.label}</span>
                                            <div className="dash-heatmap-grid">
                                                {month.days.map((d) => (
                                                    <div
                                                        key={d.date}
                                                        className="dash-heatmap-cell"
                                                        style={{ backgroundColor: getHeatmapColor(d.count) }}
                                                        title={`${d.date}: ${d.count}건`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="dash-heatmap-legend">
                                        <span>적음</span>
                                        <div className="dash-heatmap-cell" style={{ backgroundColor: "var(--gray002)" }} />
                                        <div className="dash-heatmap-cell" style={{ backgroundColor: "var(--yellow002)" }} />
                                        <div className="dash-heatmap-cell" style={{ backgroundColor: "var(--yellow003)" }} />
                                        <div className="dash-heatmap-cell" style={{ backgroundColor: "var(--yellow004)" }} />
                                        <div className="dash-heatmap-cell" style={{ backgroundColor: "#f59e0b" }} />
                                        <span>많음</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 기록 유형 분포 / 최근 기록 */}
                        <div className="dashboard-row">
                            {/* 기록 유형 분포 */}
                            <div className="cont-box">
                                <div className="cont-tit">
                                    <div>
                                        <h3>기록 유형 분포</h3>
                                    </div>
                                </div>
                                <ul className="template-stats">
                                    {RECORD_TEMPLATES.map((template) => (
                                        <li key={template.type}>
                                            <span className="template-stats-label">{template.label}</span>
                                            <div className="template-stats-bar">
                                                <div
                                                    className="template-stats-fill"
                                                    style={{ width: `${totalRecords > 0 ? Math.min(100, ((templateStats[template.type] || 0) / totalRecords) * 100) : 0}%` }}
                                                />
                                            </div>
                                            <span className="template-stats-count">{templateStats[template.type] || 0}건</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 최근 기록 */}
                            <div className="cont-box">
                                <div className="cont-tit">
                                    <div>
                                        <h3>최근 기록</h3>
                                    </div>
                                    {recentRecords.length > 0 && (
                                        <div className="cont-tit-meta">
                                            <span>{recentRecords[0].recordGroup?.title}</span>
                                            <span>{formatTimestamp(recentRecords[0].startedAt || recentRecords[0].createdAt)}</span>
                                        </div>
                                    )}
                                </div>
                                {recentRecords.length === 0 ? (
                                    <p className="empty-text">이번 달 작성한 기록이 없습니다.</p>
                                ) : (
                                    <ul className="summary-list">
                                        {recentRecords.map((record) => (
                                            <li key={record.id}>
                                                <div className="info">
                                                    <div>
                                                        <div>
                                                            <span
                                                                className="record-group-color-dot"
                                                                style={{ backgroundColor: resolveRecordGroupColor(record.recordGroup?.color) }}
                                                            />
                                                            <p>{record.title}</p>
                                                        </div>
                                                    </div>
                                                    <ul>
                                                        <li>{record.recordGroup?.title}</li>
                                                        <li>{formatTimestamp(record.startedAt || record.createdAt)}</li>
                                                    </ul>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
            </div>
        </div>
    );
};

export default RecordDashboard;
