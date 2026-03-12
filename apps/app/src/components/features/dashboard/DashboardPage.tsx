import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useShallow } from "zustand/react/shallow";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { Record, ResumeDetail, TurnOverDetail, Activity_ActivityType, JobApplication_JobApplicationStatus } from "@workfolio/shared/generated/common";
import { resolveRecordGroupColor } from "@workfolio/shared/models/ColorModel";
import { useRecordGroupStore } from "@workfolio/shared/store/recordGroupStore";
import { isLoggedIn } from "@workfolio/shared/utils/authUtils";
import HttpMethod from "@workfolio/shared/enums/HttpMethod";
import LoginModal from "@workfolio/shared/ui/LoginModal";

import { useRecordGroups } from "@/hooks/useRecordGroups";
import { useResumeDetails } from "@/hooks/useResumeDetails";
import { useTurnOver } from "@/hooks/useTurnOver";
import { useUser } from "@/hooks/useUser";
import { useIsDemo } from "@/hooks/useIsDemo";
import DemoBanner from "@/components/features/records/dashboard/DemoBanner";
import RecordCreateModal from "@/components/features/records/modal/RecordCreateModal";
import Footer from "@/components/layouts/Footer";
import { RECORD_TEMPLATES, RecordTemplateType, detectTemplateType } from "@/components/features/records/templates/recordTemplates";
import { createSampleRecordGroups, createSampleRecords } from "@/utils/sampleRecordData";

dayjs.extend(isoWeek);

// ── Helpers ──

const formatTimestamp = (value: number | string): string => {
    const ts = typeof value === "string" ? parseInt(value, 10) : value;
    if (!ts || isNaN(ts)) return "-";
    const d = dayjs(ts);
    if (d.isValid() && d.year() >= 2000 && d.year() <= 2100) {
        return d.format("YYYY.MM.DD");
    }
    return "-";
};

const parseTs = (value: number | string): number => {
    const n = typeof value === "string" ? parseInt(value, 10) : value;
    return isNaN(n) ? 0 : n;
};

const getHeatmapColor = (count: number, max: number) => {
    if (count === 0) return "var(--gray002)";
    const ratio = count / max;
    if (ratio <= 0.25) return "var(--yellow002)";
    if (ratio <= 0.5) return "var(--yellow003)";
    if (ratio <= 0.75) return "var(--yellow004)";
    return "#f59e0b";
};

/** Resume completeness (from CareerIntegration) */
const calculateCompleteness = (resume: ResumeDetail): { percent: number; missing: string[] } => {
    const sections = [
        { filled: !!(resume.name && resume.name.trim()), label: "기본 정보" },
        { filled: !!(resume.position && resume.position.trim()), label: "직무" },
        { filled: resume.careers.length > 0, label: "경력" },
        { filled: resume.educations.length > 0, label: "학력" },
        { filled: resume.projects.length > 0, label: "프로젝트" },
        { filled: resume.activities.length > 0, label: "활동/자격" },
        { filled: resume.languageSkills.length > 0, label: "어학" },
        { filled: !!(resume.description && resume.description.trim()), label: "자기소개" },
    ];
    const filledCount = sections.filter((s) => s.filled).length;
    const missing = sections.filter((s) => !s.filled).map((s) => s.label);
    return { percent: Math.round((filledCount / sections.length) * 100), missing };
};

/** TurnOver completeness */
const calculateTurnOverCompleteness = (t: TurnOverDetail): { percent: number; missing: string[] } => {
    const sections = [
        { filled: !!(t.name && t.name.trim()), label: "이직 이름" },
        { filled: !!(t.turnOverGoal?.reason && t.turnOverGoal.reason.trim()), label: "이직 사유" },
        { filled: !!(t.turnOverGoal?.goal && t.turnOverGoal.goal.trim()), label: "이직 목표" },
        { filled: (t.turnOverGoal?.checkList?.length || 0) > 0, label: "체크리스트" },
        { filled: (t.turnOverChallenge?.jobApplications?.length || 0) > 0, label: "지원 현황" },
        { filled: !!(t.turnOverRetrospective?.name && t.turnOverRetrospective.name.trim()), label: "회고" },
        { filled: !!(t.turnOverRetrospective?.score && t.turnOverRetrospective.score > 0), label: "만족도" },
        { filled: !!(t.turnOverRetrospective?.salary && t.turnOverRetrospective.salary > 0), label: "연봉" },
    ];
    const filledCount = sections.filter((s) => s.filled).length;
    const missing = sections.filter((s) => !s.filled).map((s) => s.label);
    return { percent: Math.round((filledCount / sections.length) * 100), missing };
};

const RECENT_RECORDS_LIMIT = 3;

// ── Component ──

const DashboardPage: React.FC = React.memo(() => {
    const router = useRouter();
    const isDemo = useIsDemo();

    // ── Hooks ──
    const { allRecordGroups, refreshRecordGroups } = useRecordGroups();
    const { resumeDetails, fetchResumeDetails } = useResumeDetails();
    const { turnOvers, refreshTurnOvers } = useTurnOver();
    useUser();

    const { sampleRecords, checkedGroups, recordRefreshTrigger } = useRecordGroupStore(
        useShallow((state) => ({
            sampleRecords: state.sampleRecords,
            checkedGroups: state.checkedGroups,
            recordRefreshTrigger: state.recordRefreshTrigger,
        }))
    );

    // ── State ──
    const [allRecords, setAllRecords] = useState<Record[]>([]);
    const [quickTemplateType, setQuickTemplateType] = useState<RecordTemplateType | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showMissionModal, setShowMissionModal] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("dash-mission");
    const observerRef = useRef<IntersectionObserver | null>(null);

    // ── Nav scroll spy ──
    const NAV_SECTIONS = useMemo(() => [
        "dash-status", "dash-stats", "dash-records", "dash-career", "dash-turnover",
    ], []);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting);
                if (visible.length > 0) {
                    const top = visible.reduce((a, b) =>
                        a.boundingClientRect.top < b.boundingClientRect.top ? a : b
                    );
                    if (top.target.id) setActiveSection(top.target.id);
                }
            },
            { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
        );
        NAV_SECTIONS.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observerRef.current?.observe(el);
        });
        return () => observerRef.current?.disconnect();
    }, [NAV_SECTIONS]);

    const scrollTo = useCallback((id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, []);


    // ── Data fetching ──
    useEffect(() => {
        refreshRecordGroups();
        fetchResumeDetails();
        refreshTurnOvers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch all records (same as RecordDashboard)
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
    }, [allRecordGroups, sampleRecords, recordRefreshTrigger]);

    // ── Filtered record groups ──
    const filteredRecordGroups = useMemo(
        () => allRecordGroups.filter((group) => checkedGroups.has(group.id)),
        [allRecordGroups, checkedGroups]
    );

    // ── Dashboard data (records) ──
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

        // Recent records
        const sorted = [...filteredRecords].sort((a, b) => parseTs(b.createdAt) - parseTs(a.createdAt));

        // Template type stats
        const templateStats: { [key: string]: number } = {};
        filteredRecords.forEach((r) => {
            const type = detectTemplateType(r.description || "");
            templateStats[type] = (templateStats[type] || 0) + 1;
        });

        // Month/week stats
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

        // Heatmap (1 year)
        const heatmapStart = now.subtract(1, "year").startOf("day");
        const heatmapEnd = now.endOf("day");
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

        // Group stats
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

        // Streak calculation (consecutive days backwards from today)
        let streak = 0;
        const today = now.startOf("day");
        let checkDay = today;
        while (true) {
            const key = checkDay.format("YYYY-MM-DD");
            if (dayCountMap[key] && dayCountMap[key] > 0) {
                streak++;
                checkDay = checkDay.subtract(1, "day");
            } else {
                break;
            }
        }

        // Best streak calculation (scan all heatmap data)
        let bestStreak = 0;
        let tempStreak = 0;
        heatmapData.forEach((d) => {
            if (d.count > 0) {
                tempStreak++;
                if (tempStreak > bestStreak) bestStreak = tempStreak;
            } else {
                tempStreak = 0;
            }
        });

        return {
            totalRecords: filteredRecords.length,
            recentRecords: sorted.slice(0, RECENT_RECORDS_LIMIT),
            templateStats,
            thisMonthCount: thisMonthRecords.length,
            thisWeekCount: thisWeekRecords.length,
            monthDiff,
            heatmapData,
            heatmapMax,
            groupStats,
            streak,
            bestStreak,
        };
    }, [filteredRecordGroups, allRecords]);

    const {
        totalRecords, recentRecords, templateStats,
        thisMonthCount, thisWeekCount, monthDiff,
        heatmapData, heatmapMax, groupStats, streak, bestStreak,
    } = dashboardData;

    // ── Heatmap weeks (GitHub-style) ──
    const heatmapWeeks = useMemo(() => {
        if (heatmapData.length === 0) return { weeks: [] as ({ date: string; count: number } | null)[][], monthLabels: {} as { [key: number]: string } };
        const firstDay = dayjs(heatmapData[0].date);
        const startDow = firstDay.day(); // 0=Sun
        const padded: ({ date: string; count: number } | null)[] = [];
        for (let i = 0; i < startDow; i++) padded.push(null);
        padded.push(...heatmapData);
        while (padded.length % 7 !== 0) padded.push(null);
        const weeks: (typeof padded[number])[][] = [];
        for (let i = 0; i < padded.length; i += 7) {
            weeks.push(padded.slice(i, i + 7));
        }
        const monthLabels: { [key: number]: string } = {};
        let lastMonth = -1;
        weeks.forEach((week, wi) => {
            for (const cell of week) {
                if (cell) {
                    const m = dayjs(cell.date).month();
                    if (m !== lastMonth) {
                        monthLabels[wi] = `${m + 1}월`;
                        lastMonth = m;
                    }
                    break;
                }
            }
        });
        return { weeks, monthLabels };
    }, [heatmapData]);

    // ── Career stats (from CareerIntegration) ──
    const careerStats = useMemo(() => {
        const allCareers = resumeDetails.flatMap((r) => r.careers);

        let totalMonths = 0;
        allCareers.forEach((c) => {
            if (!c.startedAt) return;
            const start = dayjs(c.startedAt);
            const end = c.isWorking ? dayjs() : c.endedAt ? dayjs(c.endedAt) : dayjs();
            totalMonths += end.diff(start, "month");
        });
        const totalYears = Math.floor(totalMonths / 12);
        const remainMonths = totalMonths % 12;

        const turnoverCount = Math.max(0, allCareers.length - 1);

        const avgMonths = allCareers.length > 0 ? Math.round(totalMonths / allCareers.length) : 0;
        const avgYears = Math.floor(avgMonths / 12);
        const avgRemain = avgMonths % 12;

        const allActivities = resumeDetails.flatMap((r) => r.activities);
        const certCount = allActivities.filter((a) => a.type === Activity_ActivityType.CERTIFICATION).length;

        return {
            totalCareer: totalYears > 0 ? `${totalYears}년 ${remainMonths}개월` : totalMonths > 0 ? `${remainMonths}개월` : "-",
            turnoverCount,
            avgTenure: avgYears > 0 ? `${avgYears}년 ${avgRemain}개월` : avgMonths > 0 ? `${avgRemain}개월` : "-",
            certCount,
        };
    }, [resumeDetails]);

    // ── Resume summaries ──
    const resumeSummaries = useMemo(() => {
        return resumeDetails.map((r) => ({
            id: r.id,
            title: r.title,
            isDefault: r.isDefault,
            ...calculateCompleteness(r),
        }));
    }, [resumeDetails]);

    // ── Resume stats ──
    const resumeStats = useMemo(() => {
        const total = resumeSummaries.length;
        const avgCompleteness = total > 0
            ? Math.round(resumeSummaries.reduce((s, r) => s + r.percent, 0) / total)
            : 0;
        const totalProjects = resumeDetails.reduce((s, r) => s + r.projects.length, 0);
        const totalCareers = resumeDetails.reduce((s, r) => s + r.careers.length, 0);
        return { total, avgCompleteness, totalProjects, totalCareers };
    }, [resumeSummaries, resumeDetails]);

    // ── Career dashboard details (timeline, skills, projects) ──
    const careerDashboard = useMemo(() => {
        const allCareers = resumeDetails.flatMap((r) => r.careers);
        const allActivities = resumeDetails.flatMap((r) => r.activities);
        const allLanguageSkills = resumeDetails.flatMap((r) => r.languageSkills);
        const allProjects = resumeDetails.flatMap((r) => r.projects);

        // Timeline: career bars by year
        const now = dayjs();
        const careerBars = allCareers
            .filter((c) => c.startedAt)
            .map((c) => {
                const start = dayjs(c.startedAt);
                const end = c.isWorking ? now : c.endedAt ? dayjs(c.endedAt) : now;
                const diffMonths = end.diff(start, "month");
                const years = Math.floor(diffMonths / 12);
                const months = diffMonths % 12;
                const durationLabel = years > 0 ? `${years}년 ${months}개월` : `${months}개월`;
                const periodLabel = `${start.format("YYYY.MM")} - ${c.isWorking ? "재직중" : end.format("YYYY.MM")}`;
                return { name: c.name, position: c.position || "", startYear: start.year(), startMonth: start.month(), endYear: end.year(), endMonth: end.month(), durationLabel, periodLabel, isWorking: !!c.isWorking };
            })
            .sort((a, b) => (a.startYear * 12 + a.startMonth) - (b.startYear * 12 + b.startMonth));
        const timelineStartYear = careerBars.length > 0
            ? Math.min(...careerBars.map((c) => c.startYear))
            : now.year() - 5;
        const timelineEndYear = now.year();
        const timelineYears: number[] = [];
        for (let y = timelineStartYear; y <= timelineEndYear; y++) timelineYears.push(y);

        // Language skills
        const langMap: { [key: string]: string } = {
            "1": "영어", "2": "일본어", "3": "중국어", "4": "한국어", "5": "프랑스어",
            "6": "스페인어", "7": "독일어", "8": "러시아어", "9": "베트남어",
        };
        const languages = allLanguageSkills.map((ls) => ({
            language: langMap[String(ls.language)] || "기타",
            level: ls.level === 1 ? "일상 회화" : ls.level === 2 ? "비즈니스" : ls.level === 3 ? "원어민" : "-",
            tests: ls.languageTests.filter((t) => t.name).map((t) => `${t.name}${t.score ? " " + t.score : ""}`).join(", "),
        }));

        // Certifications, awards, competitions
        const certs = allActivities.filter((a) => a.type === Activity_ActivityType.CERTIFICATION);
        const awards = allActivities.filter((a) => a.type === Activity_ActivityType.AWARD || a.type === Activity_ActivityType.COMPETITION);

        // Projects - role distribution
        const roleCountMap: { [key: string]: number } = {};
        allProjects.forEach((p) => {
            const role = p.role || "기타";
            roleCountMap[role] = (roleCountMap[role] || 0) + 1;
        });
        const roleDistribution = Object.entries(roleCountMap)
            .sort((a, b) => b[1] - a[1])
            .map(([role, count]) => ({ role, count }));

        const ongoingProjects = allProjects.filter((p) => !p.endedAt);
        const avgProjectMonths = allProjects.length > 0
            ? Math.round(allProjects.reduce((sum, p) => {
                if (!p.startedAt) return sum;
                const start = dayjs(p.startedAt);
                const end = p.endedAt ? dayjs(p.endedAt) : now;
                return sum + end.diff(start, "month");
            }, 0) / allProjects.length)
            : 0;

        return { careerBars, timelineYears, timelineStartYear, timelineEndYear, languages, certs, awards, allProjects, ongoingProjects, avgProjectMonths, roleDistribution };
    }, [resumeDetails]);

    // ── Turnover stats (from TurnOversIntegration) ──
    const turnOverStats = useMemo(() => {
        const completedTurnOvers = turnOvers.filter(
            (t) => t.turnOverRetrospective?.name && t.turnOverRetrospective.name !== ""
        );

        let avgDuration = { months: 0, days: 0 };
        if (completedTurnOvers.length > 0) {
            const totalDays = completedTurnOvers.reduce((sum, t) => {
                if (t.turnOverChallenge?.jobApplications && t.turnOverChallenge.jobApplications.length > 0) {
                    const apps = t.turnOverChallenge.jobApplications;
                    const firstApp = apps.reduce(
                        (earliest, app) =>
                            !earliest.startedAt || (app.startedAt && app.startedAt < earliest.startedAt) ? app : earliest,
                        apps[0]
                    );
                    const lastApp = apps.reduce(
                        (latest, app) =>
                            !latest.endedAt || (app.endedAt && app.endedAt > latest.endedAt) ? app : latest,
                        apps[0]
                    );
                    if (firstApp.startedAt && lastApp.endedAt) {
                        const durationDays = (lastApp.endedAt - firstApp.startedAt) / (1000 * 60 * 60 * 24);
                        return sum + durationDays;
                    }
                }
                return sum;
            }, 0);

            const avgDays = totalDays / completedTurnOvers.length;
            avgDuration = { months: Math.floor(avgDays / 30), days: Math.round(avgDays % 30) };
        }

        const avgApplications =
            turnOvers.length > 0
                ? turnOvers.map((t) => t.turnOverChallenge?.jobApplications.length ?? 0).reduce((s, l) => s + l, 0) / turnOvers.length
                : 0;

        let avgSalaryIncreaseRate = 0;
        if (completedTurnOvers.length > 1) {
            const sorted = [...completedTurnOvers].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
            const rates: number[] = [];
            for (let i = 1; i < sorted.length; i++) {
                const cur = sorted[i].turnOverRetrospective?.salary ?? 0;
                const prev = sorted[i - 1].turnOverRetrospective?.salary ?? 0;
                if (prev > 0 && cur > 0) rates.push(((cur - prev) / prev) * 100);
            }
            if (rates.length > 0) avgSalaryIncreaseRate = rates.reduce((s, r) => s + r, 0) / rates.length;
        }

        return {
            total: turnOvers.length,
            completed: completedTurnOvers.length,
            ongoing: turnOvers.length - completedTurnOvers.length,
            avgDuration,
            avgApplications,
            avgSalaryIncreaseRate,
        };
    }, [turnOvers]);

    // ── Turnover dashboard details ──
    const turnOverDashboard = useMemo(() => {
        // Salary trend (per completed turnover)
        const salaryData = turnOvers
            .filter((t) => t.turnOverRetrospective?.salary && t.turnOverRetrospective.salary > 0)
            .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
            .map((t) => ({
                name: t.turnOverRetrospective?.name || t.name || "",
                salary: t.turnOverRetrospective?.salary || 0,
            }));
        const latestSalary = salaryData.length > 0 ? salaryData[salaryData.length - 1].salary : 0;
        const salaryChange = salaryData.length >= 2
            ? salaryData[salaryData.length - 1].salary - salaryData[salaryData.length - 2].salary
            : 0;

        // Application status counts
        const allApps = turnOvers.flatMap((t) => t.turnOverChallenge?.jobApplications || []);
        const statusCounts = {
            pending: allApps.filter((a) => a.status === JobApplication_JobApplicationStatus.PENDING).length,
            running: allApps.filter((a) => a.status === JobApplication_JobApplicationStatus.RUNNING).length,
            passed: allApps.filter((a) => a.status === JobApplication_JobApplicationStatus.PASSED).length,
            failed: allApps.filter((a) => a.status === JobApplication_JobApplicationStatus.FAILED).length,
            cancelled: allApps.filter((a) => a.status === JobApplication_JobApplicationStatus.CANCELLED || a.status === JobApplication_JobApplicationStatus.UNKNOWN).length,
        };
        const totalApps = allApps.length;
        const docPassRate = totalApps > 0 ? Math.round(((statusCounts.running + statusCounts.passed) / totalApps) * 100) : 0;
        const finalPassRate = totalApps > 0 ? Math.round((statusCounts.passed / totalApps) * 100) : 0;

        // Recent applications (latest 5)
        const recentApps = allApps
            .sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0))
            .slice(0, 5);

        // Satisfaction
        const satisfactions = turnOvers
            .filter((t) => t.turnOverRetrospective?.score && t.turnOverRetrospective.score > 0)
            .map((t) => ({
                name: t.turnOverRetrospective?.name || t.name || "",
                score: t.turnOverRetrospective?.score || 0,
            }));
        const avgSatisfaction = satisfactions.length > 0
            ? satisfactions.reduce((s, v) => s + v.score, 0) / satisfactions.length
            : 0;

        return { salaryData, latestSalary, salaryChange, statusCounts, totalApps, docPassRate, finalPassRate, recentApps, satisfactions, avgSatisfaction };
    }, [turnOvers]);

    // ── TurnOver summaries (completeness) ──
    const turnOverSummaries = useMemo(() => {
        return turnOvers.map((t) => ({
            id: t.id,
            name: t.name || "이직 활동",
            ...calculateTurnOverCompleteness(t),
        }));
    }, [turnOvers]);

    // ── "unreflected" records (records not yet reflected in resumes) ──
    const unreflectedCount = useMemo(() => {
        // Placeholder: count all records this month
        return thisMonthCount;
    }, [thisMonthCount]);

    // ── Today's Mission ──
    const mission = useMemo(() => {
        const dow = dayjs().isoWeekday(); // 1=Mon .. 7=Sun
        if (dow === 1) {
            return { text: "지난 주를 돌아보며 주간 회고를 작성해보세요", cta: "주간 회고 작성" };
        }
        if (dow === 5) {
            return { text: "이번 주 성과를 기록하고 마무리하세요", cta: "성과 기록하기" };
        }
        return { text: "오늘 가장 임팩트 있었던 일을 기록해보세요", cta: "기록 작성하기" };
    }, []);

    // ── Render ──
    return (
        <>
            <main>
                <section className="dashboard-fullwidth">
                    <div className="contents">
                        <div className="page-cont">
                            <article>
                            {isDemo === true && <DemoBanner />}

                            {/* 오늘의 미션 */}
                            {isDemo === false && (
                                <div className="cont-box dashboard-mission">
                                    <div className="cont-tit">
                                        <div>
                                            <h3>오늘의 미션</h3>
                                        </div>
                                    </div>
                                    <p>{mission.text}</p>
                                    <button
                                        type="button"
                                        className="btn-primary"
                                        onClick={() => setShowMissionModal(true)}
                                    >
                                        {mission.cta}
                                    </button>
                                </div>
                            )}

                            {/* ════════════════════════════════════════════
                                대분류 1: 현황
                               ════════════════════════════════════════════ */}
                            <div id="dash-status" className="dashboard-category">
                                <h2 className="dashboard-category-title">현황</h2>

                                {/* 빠른 기록 */}
                                <div className="cont-box no-separator">
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
                                </div>

                                {/* 이력서 현황 */}
                                <div className="cont-box">
                                    <div className="cont-tit">
                                        <div>
                                            <h3>이력서 현황</h3>
                                            <p>{resumeSummaries.length}개</p>
                                        </div>
                                        <div className="cont-tit-meta">
                                            <span>미반영 기록 {unreflectedCount}건</span>
                                            <Link href="/careers">이력서에 반영하기</Link>
                                        </div>
                                    </div>
                                    {resumeSummaries.length === 0 ? (
                                        <p className="empty-text">등록된 이력서가 없습니다.</p>
                                    ) : (
                                        <ul className="career-resume-grid">
                                            {resumeSummaries.slice(0, 5).map((item) => (
                                                <li key={item.id} onClick={() => router.push(`/careers/${item.id}`)}>
                                                    <div className="career-resume-card-top">
                                                        <span className="career-resume-card-title">
                                                            {item.isDefault && (
                                                                <img
                                                                    src="/assets/img/ico/ic-resume-check-ov.svg"
                                                                    alt="대표"
                                                                    width={12}
                                                                    height={12}
                                                                />
                                                            )}
                                                            {item.title}
                                                        </span>
                                                    </div>
                                                    <div className="career-resume-card-progress">
                                                        <div className="career-completeness-bar">
                                                            <div
                                                                className="career-completeness-fill"
                                                                style={{ width: `${item.percent}%` }}
                                                            />
                                                        </div>
                                                        <span className="career-resume-card-percent">{item.percent}%</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* 이직 현황 */}
                                <div className="cont-box">
                                    <div className="cont-tit">
                                        <div>
                                            <h3>이직 현황</h3>
                                            <p>{turnOverSummaries.length}개</p>
                                        </div>
                                        <div className="cont-tit-meta">
                                            <Link href="/turn-overs">이직 관리하기</Link>
                                        </div>
                                    </div>
                                    {turnOverSummaries.length === 0 ? (
                                        <p className="empty-text">등록된 이직 활동이 없습니다.</p>
                                    ) : (
                                        <ul className="career-resume-grid">
                                            {turnOverSummaries.slice(0, 5).map((item) => (
                                                <li key={item.id} onClick={() => router.push(`/turn-overs/${item.id}`)}>
                                                    <div className="career-resume-card-top">
                                                        <span className="career-resume-card-title">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <div className="career-resume-card-progress">
                                                        <div className="career-completeness-bar">
                                                            <div
                                                                className="career-completeness-fill"
                                                                style={{ width: `${item.percent}%` }}
                                                            />
                                                        </div>
                                                        <span className="career-resume-card-percent">{item.percent}%</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* ════════════════════════════════════════════
                                대분류 2: 통계
                               ════════════════════════════════════════════ */}
                            <div id="dash-stats" className="dashboard-category">
                                <h2 className="dashboard-category-title">통계</h2>

                                {/* 이번 달 요약 + 커리어 통계 + 이력서 통계 + 이직 현황 */}
                                <div className="dashboard-row-4col">
                                    <div className="cont-box">
                                        <div className="cont-tit">
                                            <div>
                                                <h3>이번 달 요약</h3>
                                            </div>
                                        </div>
                                        <ul className="stats-summary">
                                            <li>
                                                <p>이번 달 기록 수</p>
                                                <div>{thisMonthCount}<span>건</span></div>
                                            </li>
                                            <li>
                                                <p>이번 주 기록 수</p>
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

                                    <div className="cont-box">
                                        <div className="cont-tit">
                                            <div>
                                                <h3>커리어 통계</h3>
                                            </div>
                                        </div>
                                        <ul className="stats-summary">
                                            <li>
                                                <p>총 경력</p>
                                                <div>{careerStats.totalCareer}</div>
                                            </li>
                                            <li>
                                                <p>이직 횟수</p>
                                                <div>{careerStats.turnoverCount}<span>회</span></div>
                                            </li>
                                            <li>
                                                <p>평균 재직</p>
                                                <div>{careerStats.avgTenure}</div>
                                            </li>
                                            <li>
                                                <p>보유 자격증</p>
                                                <div>{careerStats.certCount}<span>개</span></div>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="cont-box">
                                        <div className="cont-tit">
                                            <div>
                                                <h3>이력서 통계</h3>
                                            </div>
                                        </div>
                                        <ul className="stats-summary">
                                            <li>
                                                <p>이력서 수</p>
                                                <div>{resumeStats.total}<span>개</span></div>
                                            </li>
                                            <li>
                                                <p>평균 완성도</p>
                                                <div>{resumeStats.avgCompleteness}<span>%</span></div>
                                            </li>
                                            <li>
                                                <p>등록 경력</p>
                                                <div>{resumeStats.totalCareers}<span>건</span></div>
                                            </li>
                                            <li>
                                                <p>등록 프로젝트</p>
                                                <div>{resumeStats.totalProjects}<span>건</span></div>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="cont-box">
                                        <div className="cont-tit">
                                            <div>
                                                <h3>이직 현황</h3>
                                            </div>
                                        </div>
                                        <ul className="stats-summary">
                                            <li>
                                                <p>총 이직 횟수</p>
                                                <div>
                                                    {turnOverStats.total}<span>회</span>
                                                </div>
                                            </li>
                                            <li>
                                                <p>평균 이직 기간</p>
                                                <div>
                                                    {turnOverStats.avgDuration.months > 0 && `${turnOverStats.avgDuration.months}개월 `}
                                                    {turnOverStats.avgDuration.days > 0 && `${turnOverStats.avgDuration.days}일`}
                                                    {turnOverStats.avgDuration.months === 0 && turnOverStats.avgDuration.days === 0 && "0일"}
                                                </div>
                                            </li>
                                            <li>
                                                <p>평균 지원 회사</p>
                                                <div>{turnOverStats.avgApplications.toFixed(1)}<span>개</span></div>
                                            </li>
                                            <li>
                                                <p>평균 연봉 상승률</p>
                                                <div>
                                                    {turnOverStats.avgSalaryIncreaseRate > 0 && <span className="salary-up">&#9650;</span>}
                                                    {turnOverStats.avgSalaryIncreaseRate < 0 && <span className="salary-down">&#9660;</span>}
                                                    {turnOverStats.avgSalaryIncreaseRate.toFixed(1)}<span>%</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* 연속 기록 + 기록 히트맵 */}
                                <div className="dashboard-row-streak">
                                    <div className="cont-box dash-streak">
                                        <div className="cont-tit">
                                            <div>
                                                <h3>연속 기록</h3>
                                            </div>
                                        </div>
                                        <div className="dash-streak-ring">
                                            <svg viewBox="0 0 100 100" className="dash-streak-ring-svg">
                                                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--gray002)" strokeWidth="6" />
                                                <circle
                                                    cx="50" cy="50" r="40" fill="none"
                                                    stroke={streak === 0 ? "var(--gray003)" : streak <= 2 ? "var(--yellow003)" : streak <= 6 ? "var(--yellow004)" : "#f59e0b"}
                                                    strokeWidth="6"
                                                    strokeDasharray={`${Math.min(1, streak / 7) * 2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                                                    strokeLinecap="round"
                                                    transform="rotate(-90 50 50)"
                                                />
                                                <text x="50" y="55" textAnchor="middle" fontSize="22" fontWeight="700" style={{ fill: "var(--black)" }}>
                                                    {streak}
                                                </text>
                                                <text x="50" y="68" textAnchor="middle" fontSize="9" style={{ fill: "var(--gray005)" }}>
                                                    일 연속
                                                </text>
                                            </svg>
                                        </div>
                                        {bestStreak > 0 && (
                                            <div className="dash-streak-best">
                                                <span className="dash-streak-best-label">최고 기록</span>
                                                <span className="dash-streak-best-value">{bestStreak}일</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="cont-box">
                                        <div className="cont-tit">
                                            <div>
                                                <h3>기록 히트맵</h3>
                                                <p>최근 1년</p>
                                            </div>
                                        </div>
                                        <div className="dash-heatmap">
                                            <div className="dash-heatmap-wrapper">
                                                <div className="dash-heatmap-day-labels">
                                                    <div className="dash-heatmap-month-spacer" />
                                                    <span></span>
                                                    <span>월</span>
                                                    <span></span>
                                                    <span>수</span>
                                                    <span></span>
                                                    <span>금</span>
                                                    <span></span>
                                                </div>
                                                <div className="dash-heatmap-body">
                                                    {heatmapWeeks.weeks.map((week, wi) => (
                                                        <div key={wi} className="dash-heatmap-col">
                                                            <div className="dash-heatmap-month-label">
                                                                {heatmapWeeks.monthLabels[wi] || ""}
                                                            </div>
                                                            {week.map((d, di) =>
                                                                d ? (
                                                                    <div
                                                                        key={di}
                                                                        className="dash-heatmap-cell"
                                                                        style={{ backgroundColor: getHeatmapColor(d.count, heatmapMax) }}
                                                                        title={`${d.date}: ${d.count}건`}
                                                                    />
                                                                ) : (
                                                                    <div key={di} className="dash-heatmap-cell dash-heatmap-cell-empty" />
                                                                )
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
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
                            </div>

                            {/* ════════════════════════════════════════════
                                대분류 2: 기록
                               ════════════════════════════════════════════ */}
                            <div id="dash-records" className="dashboard-category">
                                <h2 className="dashboard-category-title">기록</h2>

                                {/* 기록장별 활동 + 최근 기록 (가로 배치) */}
                                <div className="dashboard-row-record-top">
                                    {/* 기록장별 활동 (도넛 차트) */}
                                    <div className="cont-box">
                                        <div className="cont-tit">
                                            <div>
                                                <h3>기록장별 활동</h3>
                                            </div>
                                        </div>
                                        <div className="dash-group-stats-vertical">
                                            <div className="dash-group-donut-large">
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
                                            {groupStats.length === 0 ? (
                                                <p className="empty-text">기록장이 없습니다.</p>
                                            ) : (
                                                <ul className="dash-group-legend-horizontal">
                                                    {groupStats.map((g) => (
                                                        <li key={g.id}>
                                                            <span className="dash-group-dot" style={{ backgroundColor: g.color }} />
                                                            <span className="dash-group-name">{g.title}</span>
                                                            <span className="dash-group-count">{g.count}건</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
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
                                                {recentRecords.map((record) => {
                                                    const ts = parseTs(record.startedAt || record.createdAt);
                                                    const recordDate = ts ? dayjs(ts).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD");
                                                    return (
                                                        <li
                                                            key={record.id}
                                                            onClick={() => router.push(`/records?view=monthly&date=${recordDate}&recordId=${record.id}`)}
                                                            style={{ cursor: "pointer" }}
                                                        >
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
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                </div>

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
                                                        style={{
                                                            width: `${totalRecords > 0 ? Math.min(100, ((templateStats[template.type] || 0) / totalRecords) * 100) : 0}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="template-stats-count">{templateStats[template.type] || 0}건</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* ════════════════════════════════════════════
                                대분류 4: 이력
                               ════════════════════════════════════════════ */}
                            <div id="dash-career" className="dashboard-category">
                                <h2 className="dashboard-category-title">이력</h2>

                                {/* 커리어 타임라인 */}
                                <div className="cont-box">
                                    <div className="cont-tit">
                                        <div>
                                            <h3>커리어 타임라인</h3>
                                        </div>
                                    </div>
                                    <div className="dash-timeline">
                                        <div className="dash-timeline-header">
                                            <div className="dash-timeline-label-col" />
                                            <div className="dash-timeline-years">
                                                {careerDashboard.timelineYears.map((y) => (
                                                    <span key={y} className="dash-timeline-year-cell">{y}</span>
                                                ))}
                                            </div>
                                            <div className="dash-timeline-duration-col" />
                                        </div>
                                        {careerDashboard.careerBars.length === 0 ? (
                                            <p className="empty-text">경력을 추가해 보세요</p>
                                        ) : (
                                            careerDashboard.careerBars.map((bar, i) => {
                                                const totalMonths = careerDashboard.timelineYears.length * 12;
                                                const startOffset = (bar.startYear - careerDashboard.timelineStartYear) * 12 + bar.startMonth;
                                                const endOffset = (bar.endYear - careerDashboard.timelineStartYear) * 12 + bar.endMonth;
                                                const left = (startOffset / totalMonths) * 100;
                                                const width = Math.max(1, ((endOffset - startOffset) / totalMonths) * 100);
                                                return (
                                                    <div key={i} className="dash-timeline-row">
                                                        <div className="dash-timeline-label-col">
                                                            <span className="dash-timeline-company">{bar.name}</span>
                                                            <span className="dash-timeline-position">{bar.position}</span>
                                                        </div>
                                                        <div className="dash-timeline-bar-track">
                                                            {careerDashboard.timelineYears.map((y, yi) => (
                                                                <div key={y} className="dash-timeline-gridline" style={{ left: `${(yi / careerDashboard.timelineYears.length) * 100}%` }} />
                                                            ))}
                                                            <div className={`dash-timeline-bar${bar.isWorking ? " dash-timeline-bar-working" : ""}`} style={{ left: `${left}%`, width: `${width}%` }} title={`${bar.name} (${bar.position})`} />
                                                        </div>
                                                        <div className="dash-timeline-duration-col">
                                                            <span className="dash-timeline-duration">{bar.durationLabel}</span>
                                                            <span className="dash-timeline-period">{bar.periodLabel}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                {/* 스킬 & 자격 + 프로젝트 */}
                                <div className="dashboard-row">
                                    <div className="cont-box">
                                        <div className="cont-tit">
                                            <div>
                                                <h3>스킬 &amp; 자격</h3>
                                            </div>
                                        </div>
                                        <div className="dash-skills-section">
                                            <h4>어학</h4>
                                            {careerDashboard.languages.length === 0 ? (
                                                <p className="empty-text">등록된 어학 정보가 없습니다.</p>
                                            ) : (
                                                <div className="dash-chip-list">
                                                    {careerDashboard.languages.map((l, i) => (
                                                        <span key={i} className="dash-chip">
                                                            <strong>{l.language}</strong> {l.level}{l.tests && <> <span className="dash-chip-sub">| {l.tests}</span></>}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="dash-skills-section">
                                            <h4>자격증</h4>
                                            {careerDashboard.certs.length === 0 ? (
                                                <p className="empty-text">등록된 자격증이 없습니다.</p>
                                            ) : (
                                                <div className="dash-chip-list">
                                                    {careerDashboard.certs.map((c) => (
                                                        <span key={c.id} className="dash-chip">
                                                            <strong>{c.name}</strong>{c.organization && <> <span className="dash-chip-sub">{c.organization}</span></>}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="dash-skills-section">
                                            <h4>수상 &amp; 대회</h4>
                                            {careerDashboard.awards.length === 0 ? (
                                                <p className="empty-text">등록된 수상/대회 이력이 없습니다.</p>
                                            ) : (
                                                <div className="dash-chip-list">
                                                    {careerDashboard.awards.map((a) => (
                                                        <span key={a.id} className="dash-chip">
                                                            <strong>{a.name}</strong>{a.organization && <> <span className="dash-chip-sub">{a.organization}</span></>}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="cont-box">
                                        <div className="cont-tit">
                                            <div>
                                                <h3>프로젝트</h3>
                                            </div>
                                        </div>
                                        <div className="dash-project-summary">
                                            <span>전체 <strong>{careerDashboard.allProjects.length}</strong>개</span>
                                            <span>진행중 <strong>{careerDashboard.ongoingProjects.length}</strong>개</span>
                                            <span>평균 기간 <strong>{careerDashboard.avgProjectMonths > 0 ? `${careerDashboard.avgProjectMonths}개월` : "-"}</strong></span>
                                        </div>
                                        {careerDashboard.allProjects.length === 0 ? (
                                            <p className="empty-text">이력서에 프로젝트를 추가하면 통계가 표시됩니다.</p>
                                        ) : (
                                            <>
                                                <h4 className="dash-role-dist-title">역할 분포</h4>
                                                <ul className="dash-role-dist">
                                                    {(() => {
                                                        const maxCount = Math.max(...careerDashboard.roleDistribution.map((r) => r.count));
                                                        return careerDashboard.roleDistribution.map((r) => (
                                                            <li key={r.role}>
                                                                <span className="dash-role-name">{r.role}</span>
                                                                <div className="dash-role-bar">
                                                                    <div style={{ width: `${(r.count / maxCount) * 100}%` }} />
                                                                </div>
                                                                <span className="dash-role-count">{r.count}개</span>
                                                            </li>
                                                        ));
                                                    })()}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ════════════════════════════════════════════
                                대분류 5: 이직
                               ════════════════════════════════════════════ */}
                            <div id="dash-turnover" className="dashboard-category">
                                <h2 className="dashboard-category-title">이직</h2>

                                {/* 연봉 변화 추이 */}
                                <div className="cont-box">
                                    <div className="cont-tit">
                                        <div>
                                            <h3>연봉 변화 추이</h3>
                                        </div>
                                    </div>
                                    <div className="dash-salary-summary">
                                        <span>최근 연봉 <strong>{turnOverDashboard.latestSalary > 0 ? `${turnOverDashboard.latestSalary.toLocaleString()}만원` : "0원"}</strong></span>
                                        <span>연봉 변동 <strong className={turnOverDashboard.salaryChange > 0 ? "positive" : turnOverDashboard.salaryChange < 0 ? "negative" : ""}>{turnOverDashboard.salaryChange > 0 ? "+" : ""}{turnOverDashboard.salaryChange !== 0 ? `${turnOverDashboard.salaryChange.toLocaleString()}만원` : "0원"}</strong></span>
                                    </div>
                                    <div className="dash-salary-chart" style={{ width: "100%", height: "16rem" }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={turnOverDashboard.salaryData.length > 0
                                                    ? turnOverDashboard.salaryData
                                                    : [{ name: "-", salary: 0 }]}
                                                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                                            >
                                                <CartesianGrid strokeDasharray="4 4" stroke="var(--gray002)" />
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{ fontSize: 11, fill: "var(--gray005)" }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <YAxis
                                                    tickFormatter={(v: number) => `${v.toLocaleString()}만`}
                                                    tick={{ fontSize: 11, fill: "var(--gray005)" }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    width={60}
                                                    domain={turnOverDashboard.salaryData.length > 0 ? ["auto", "auto"] : [0, 10000]}
                                                />
                                                <Tooltip
                                                    formatter={(value) => [`${Number(value).toLocaleString()}만원`, "연봉"]}
                                                    contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid var(--gray002)" }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="salary"
                                                    stroke="var(--yellow004)"
                                                    strokeWidth={2}
                                                    dot={{ r: 4, fill: "var(--yellow004)", stroke: "var(--yellow004)" }}
                                                    activeDot={{ r: 6 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* 지원 현황 + 최근 지원 회사 + 이직 만족도 */}
                                <div className="dashboard-row-3col">
                                    <div className="cont-box">
                                        <div className="cont-tit">
                                            <div>
                                                <h3>지원 현황</h3>
                                                <p>{turnOverDashboard.totalApps}개</p>
                                            </div>
                                        </div>
                                        <ul className="dash-app-status">
                                            {[
                                                { label: "대기 중", count: turnOverDashboard.statusCounts.pending, color: "#8E8E93" },
                                                { label: "진행 중", count: turnOverDashboard.statusCounts.running, color: "#FF9500" },
                                                { label: "최종 합격", count: turnOverDashboard.statusCounts.passed, color: "#34C759" },
                                                { label: "불합격", count: turnOverDashboard.statusCounts.failed, color: "#FF3B30" },
                                                { label: "포기", count: turnOverDashboard.statusCounts.cancelled, color: "#8E8E93" },
                                            ].map((item) => (
                                                <li key={item.label}>
                                                    <span className="dash-app-label">{item.label}</span>
                                                    <div className="dash-app-bar">
                                                        <div style={{ width: `${turnOverDashboard.totalApps > 0 ? (item.count / turnOverDashboard.totalApps) * 100 : 0}%`, backgroundColor: item.color }} />
                                                    </div>
                                                    <span className="dash-app-count">{item.count}개</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="dash-app-rates">
                                            <span>서류 통과율 <strong>{turnOverDashboard.docPassRate}%</strong></span>
                                            <span>최종 합격률 <strong>{turnOverDashboard.finalPassRate}%</strong></span>
                                        </div>
                                    </div>

                                    <div className="cont-box">
                                        <div className="cont-tit">
                                            <div>
                                                <h3>최근 지원 회사</h3>
                                                <p>{turnOverDashboard.recentApps.length}건</p>
                                            </div>
                                        </div>
                                        {turnOverDashboard.recentApps.length === 0 ? (
                                            <p className="empty-text">지원 내역이 없습니다</p>
                                        ) : (
                                            <ul className="dash-recent-apps">
                                                {turnOverDashboard.recentApps.map((app, i) => (
                                                    <li key={i}>
                                                        <span className="dash-app-name">{app.name || "-"}</span>
                                                        <span className={`dash-app-badge status-${app.status}`}>
                                                            {app.status === JobApplication_JobApplicationStatus.PENDING && "서류 대기"}
                                                            {app.status === JobApplication_JobApplicationStatus.RUNNING && "진행 중"}
                                                            {app.status === JobApplication_JobApplicationStatus.PASSED && "최종 합격"}
                                                            {app.status === JobApplication_JobApplicationStatus.FAILED && "불합격"}
                                                            {(app.status === JobApplication_JobApplicationStatus.CANCELLED || app.status === JobApplication_JobApplicationStatus.UNKNOWN) && "포기"}
                                                        </span>
                                                        <span className="dash-app-time">
                                                            {app.startedAt ? (() => {
                                                                const diff = dayjs().diff(dayjs(app.startedAt), "minute");
                                                                if (diff < 1) return "방금 전";
                                                                if (diff < 60) return `${diff}분 전`;
                                                                const hours = Math.floor(diff / 60);
                                                                if (hours < 24) return `${hours}시간 전`;
                                                                const days = Math.floor(hours / 24);
                                                                return `${days}일 전`;
                                                            })() : "-"}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="cont-box">
                                        <div className="cont-tit">
                                            <div>
                                                <h3>이직 만족도</h3>
                                            </div>
                                        </div>
                                        {turnOverDashboard.satisfactions.length === 0 ? (
                                            <p className="empty-text">작성된 만족도가 없습니다</p>
                                        ) : (
                                            <ul className="dash-satisfaction-list">
                                                {turnOverDashboard.satisfactions.map((s, i) => (
                                                    <li key={i}>
                                                        <span>{s.name}</span>
                                                        <div className="dash-satisfaction-score">
                                                            <span className="dash-stars">
                                                                {[1, 2, 3, 4, 5].map((n) => (
                                                                    <span key={n} style={{ color: n <= s.score ? "#f59e0b" : "var(--gray003)" }}>★</span>
                                                                ))}
                                                            </span>
                                                            <strong>{s.score.toFixed(1)}</strong>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <div className="dash-satisfaction-avg">
                                            <span>평균 만족도</span>
                                            <span className="dash-stars">
                                                {[1, 2, 3, 4, 5].map((n) => (
                                                    <span key={n} style={{ color: n <= Math.round(turnOverDashboard.avgSatisfaction) ? "#f59e0b" : "var(--gray003)" }}>★</span>
                                                ))}
                                            </span>
                                            <strong>{turnOverDashboard.avgSatisfaction.toFixed(1)}점</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </article>
                            <nav>
                                <ul className="nav-wrap">
                                    <li className={activeSection === "dash-status" ? "active" : ""} onClick={() => scrollTo("dash-status")}>현황</li>
                                    <li className={activeSection === "dash-stats" ? "active" : ""} onClick={() => scrollTo("dash-stats")}>통계</li>
                                    <li className={activeSection === "dash-records" ? "active" : ""} onClick={() => scrollTo("dash-records")}>기록</li>
                                    <li className={activeSection === "dash-career" ? "active" : ""} onClick={() => scrollTo("dash-career")}>이력</li>
                                    <li className={activeSection === "dash-turnover" ? "active" : ""} onClick={() => scrollTo("dash-turnover")}>이직</li>
                                </ul>
                            </nav>
                        </div>
                    </div>

                    <Footer />
                </section>
            </main>

            {/* Modals */}
            {(quickTemplateType || showMissionModal) && (
                <RecordCreateModal
                    isOpen={true}
                    onClose={() => {
                        setQuickTemplateType(null);
                        setShowMissionModal(false);
                    }}
                    allRecordGroups={allRecordGroups}
                />
            )}

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </>
    );
});

DashboardPage.displayName = "DashboardPage";

export default DashboardPage;
