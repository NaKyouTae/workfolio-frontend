"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import {
    TurnOverDetail,
    TurnOverGoalDetail,
    TurnOverChallengeDetail,
    TurnOverRetrospectiveDetail,
    JobApplicationDetail,
    JobApplication_JobApplicationStatus,
    ApplicationStage,
    ApplicationStage_ApplicationStageStatus,
    TurnOverRetrospectiveDetail_EmploymentType,
    Attachment,
    Attachment_AttachmentCategory,
} from "@workfolio/shared/generated/common";
import { normalizeEnumValue } from "@workfolio/shared/utils/commonUtils";
import LoadingScreen from "@workfolio/shared/ui/LoadingScreen";
import styles from "./AdminDetailPage.module.css";

type TabType = "goal" | "challenge" | "retrospective";

const formatDate = (timestamp?: number | string) => {
    if (!timestamp || timestamp === 0) return "-";
    const numTimestamp = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
    if (isNaN(numTimestamp) || numTimestamp === 0) return "-";
    const date = new Date(numTimestamp);
    if (isNaN(date.getTime())) return "-";
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
};

const formatSalary = (amount: number) => {
    if (amount >= 10000) {
        const billions = Math.floor(amount / 10000);
        const remainder = amount % 10000;
        if (remainder === 0) return `${billions}억 원`;
        return `${billions}억 ${remainder.toLocaleString()}만 원`;
    }
    return `${amount.toLocaleString()}만 원`;
};

const getJobStatusLabel = (status: JobApplication_JobApplicationStatus) => {
    const s = normalizeEnumValue(status, JobApplication_JobApplicationStatus);
    switch (s) {
        case JobApplication_JobApplicationStatus.PENDING: return "대기";
        case JobApplication_JobApplicationStatus.RUNNING: return "진행 중";
        case JobApplication_JobApplicationStatus.PASSED: return "합격";
        case JobApplication_JobApplicationStatus.FAILED: return "불합격";
        case JobApplication_JobApplicationStatus.CANCELLED: return "취소";
        default: return "미확인";
    }
};

const getJobStatusStyle = (status: JobApplication_JobApplicationStatus) => {
    const s = normalizeEnumValue(status, JobApplication_JobApplicationStatus);
    switch (s) {
        case JobApplication_JobApplicationStatus.PENDING: return { background: "#ECFAEE", color: "#34C759" };
        case JobApplication_JobApplicationStatus.RUNNING: return { background: "#FFF5E9", color: "#FF9500" };
        case JobApplication_JobApplicationStatus.PASSED: return { background: "#E6F2FF", color: "#007AFF" };
        case JobApplication_JobApplicationStatus.FAILED: return { background: "#FDEAE9", color: "#FF3B30" };
        case JobApplication_JobApplicationStatus.CANCELLED: return { background: "#ECEDEF", color: "#515C66" };
        default: return { background: "#ECEDEF", color: "#515C66" };
    }
};

const getStageStatusLabel = (status: ApplicationStage_ApplicationStageStatus) => {
    const s = normalizeEnumValue(status, ApplicationStage_ApplicationStageStatus);
    switch (s) {
        case ApplicationStage_ApplicationStageStatus.PASSED: return "합격";
        case ApplicationStage_ApplicationStageStatus.FAILED: return "불합격";
        case ApplicationStage_ApplicationStageStatus.PENDING: return "대기";
        case ApplicationStage_ApplicationStageStatus.SCHEDULED: return "예정";
        case ApplicationStage_ApplicationStageStatus.CANCELLED: return "취소";
        default: return "없음";
    }
};

const getStageStatusColor = (status: ApplicationStage_ApplicationStageStatus) => {
    const s = normalizeEnumValue(status, ApplicationStage_ApplicationStageStatus);
    switch (s) {
        case ApplicationStage_ApplicationStageStatus.PASSED: return "#007AFF";
        case ApplicationStage_ApplicationStageStatus.FAILED: return "#FF3B30";
        case ApplicationStage_ApplicationStageStatus.PENDING: return "#34C759";
        case ApplicationStage_ApplicationStageStatus.SCHEDULED: return "#FF9500";
        default: return "#515C66";
    }
};

const getEmploymentTypeLabel = (type?: TurnOverRetrospectiveDetail_EmploymentType) => {
    switch (type) {
        case TurnOverRetrospectiveDetail_EmploymentType.FULL_TIME: return "정규직";
        case TurnOverRetrospectiveDetail_EmploymentType.CONTRACT: return "계약직";
        case TurnOverRetrospectiveDetail_EmploymentType.FREELANCER: return "프리랜서";
        case TurnOverRetrospectiveDetail_EmploymentType.INTERN: return "인턴";
        default: return "-";
    }
};

/* ── Section Components ── */

function GoalSection({ goal, startedAt }: { goal: TurnOverGoalDetail | undefined; startedAt?: number }) {
    if (!goal) return <p className={styles.emptyText}>등록된 목표 정보가 없습니다.</p>;

    return (
        <div className={styles.sectionsWrap}>
            {/* 이직 방향 설정 */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}><h3>이직 방향 설정</h3></div>
                <ul className={styles.viewBox}>
                    <li><p>시작일</p><span>{formatDate(startedAt)}</span></li>
                    <li><p>이직 사유</p><span>{goal.reason || "-"}</span></li>
                    <li><p>이직 목표</p><span>{goal.goal || "-"}</span></li>
                </ul>
            </div>

            {/* 자기소개서 */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <h3>공통 자기소개서</h3>
                    <p>{goal.selfIntroductions?.length || 0}</p>
                </div>
                {(!goal.selfIntroductions || goal.selfIntroductions.length === 0) ? (
                    <p className={styles.emptyText}>등록된 자기소개서가 없습니다.</p>
                ) : (
                    <div className={styles.qaList}>
                        {goal.selfIntroductions.map((item, i) => (
                            <div key={item.id || i} className={styles.qaItem}>
                                <p className={styles.qaQuestion}>{item.question || "-"}</p>
                                <p className={styles.qaAnswer}>{item.content || "-"}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 면접 예상 질문 */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <h3>면접 예상 질문</h3>
                    <p>{goal.interviewQuestions?.length || 0}</p>
                </div>
                {(!goal.interviewQuestions || goal.interviewQuestions.length === 0) ? (
                    <p className={styles.emptyText}>등록된 면접 예상 질문이 없습니다.</p>
                ) : (
                    <div className={styles.qaList}>
                        {goal.interviewQuestions.map((item, i) => (
                            <div key={item.id || i} className={styles.qaItem}>
                                <p className={styles.qaQuestion}>{item.question || "-"}</p>
                                <p className={styles.qaAnswer}>{item.answer || "-"}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 체크리스트 */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <h3>체크리스트</h3>
                    <p>{goal.checkList?.length || 0}</p>
                </div>
                {(!goal.checkList || goal.checkList.length === 0) ? (
                    <p className={styles.emptyText}>등록된 체크리스트가 없습니다.</p>
                ) : (
                    <div className={styles.checkList}>
                        {goal.checkList.map((item, i) => (
                            <div key={item.id || i} className={styles.checkItem}>
                                <span className={`${styles.checkBox} ${item.checked ? styles.checkBoxChecked : ""}`}>
                                    {item.checked ? "✓" : ""}
                                </span>
                                <p className={`${styles.checkContent} ${item.checked ? styles.checkContentChecked : ""}`}>
                                    {item.content || "-"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 메모 */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <h3>메모</h3>
                    <p>{goal.memos?.length || 0}</p>
                </div>
                {(!goal.memos || goal.memos.length === 0) ? (
                    <p className={styles.emptyText}>등록된 메모가 없습니다.</p>
                ) : (
                    <div className={styles.memoList}>
                        {goal.memos.map((memo) => (
                            <p key={memo.id} className={styles.memoItem}>{memo.content}</p>
                        ))}
                    </div>
                )}
            </div>

            {/* 첨부 */}
            <AttachmentSection attachments={goal.attachments} />
        </div>
    );
}

function ChallengeSection({ challenge }: { challenge: TurnOverChallengeDetail | undefined }) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    if (!challenge) return <p className={styles.emptyText}>등록된 도전 정보가 없습니다.</p>;

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    return (
        <div className={styles.sectionsWrap}>
            {/* 지원 기록 */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <h3>지원 기록</h3>
                    <p>{challenge.jobApplications?.length || 0}</p>
                </div>
                {(!challenge.jobApplications || challenge.jobApplications.length === 0) ? (
                    <p className={styles.emptyText}>등록된 지원 기록이 없습니다.</p>
                ) : (
                    <div className={styles.appTableWrap}>
                        <table className={styles.appTable}>
                            <thead>
                                <tr>
                                    <th>진행 상태</th>
                                    <th>회사명</th>
                                    <th>직무</th>
                                    <th>채용 절차</th>
                                    <th>공고문</th>
                                    <th>모집 기간</th>
                                    <th>지원 경로</th>
                                    <th>메모</th>
                                </tr>
                            </thead>
                            <tbody>
                                {challenge.jobApplications.map((app, index) => {
                                    const appId = app.id || `app-${index}`;
                                    const isExpanded = expandedRows.has(appId);
                                    const hasStages = app.applicationStages && app.applicationStages.length > 0;

                                    return (
                                        <Fragment key={appId}>
                                            <tr>
                                                <td>
                                                    <span className={styles.statusBadge} style={getJobStatusStyle(app.status)}>
                                                        {getJobStatusLabel(app.status)}
                                                    </span>
                                                </td>
                                                <td><p>{app.name || "-"}</p></td>
                                                <td><p>{app.position || "-"}</p></td>
                                                <td>
                                                    {hasStages ? (
                                                        <button className={styles.toggleButton} onClick={() => toggleRow(appId)}>
                                                            상세보기 {isExpanded ? "▲" : "▼"}
                                                        </button>
                                                    ) : "-"}
                                                </td>
                                                <td>
                                                    <p>
                                                        {app.jobPostingTitle || "-"}
                                                        {app.jobPostingUrl && (
                                                            <a href={app.jobPostingUrl} target="_blank" rel="noopener noreferrer" className={styles.linkIcon}>🔗</a>
                                                        )}
                                                    </p>
                                                </td>
                                                <td>
                                                    {app.startedAt ? formatDate(app.startedAt) : ""}
                                                    {app.startedAt && app.endedAt ? " ~ " : ""}
                                                    {app.endedAt ? formatDate(app.endedAt) : ""}
                                                    {!app.startedAt && !app.endedAt ? "-" : ""}
                                                </td>
                                                <td><p>{app.applicationSource || "-"}</p></td>
                                                <td><p>{app.memo || "-"}</p></td>
                                            </tr>
                                            {isExpanded && hasStages && (
                                                <tr>
                                                    <td colSpan={8} style={{ padding: 0 }}>
                                                        <ul className={styles.stageList}>
                                                            {app.applicationStages!.map((stage, si) => (
                                                                <li key={stage.id || si} className={styles.stageItem}>
                                                                    <span>{stage.name || "-"}</span>
                                                                    <span
                                                                        className={styles.stageBadge}
                                                                        style={{ background: getStageStatusColor(stage.status) }}
                                                                    >
                                                                        {getStageStatusLabel(stage.status)}
                                                                    </span>
                                                                    {stage.startedAt && (
                                                                        <span className={styles.stageDate}>{formatDate(stage.startedAt)}</span>
                                                                    )}
                                                                    {stage.memo && (
                                                                        <span className={styles.stageMemo}>{stage.memo}</span>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 메모 */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <h3>메모</h3>
                    <p>{challenge.memos?.length || 0}</p>
                </div>
                {(!challenge.memos || challenge.memos.length === 0) ? (
                    <p className={styles.emptyText}>등록된 메모가 없습니다.</p>
                ) : (
                    <div className={styles.memoList}>
                        {challenge.memos.map((memo) => (
                            <p key={memo.id} className={styles.memoItem}>{memo.content}</p>
                        ))}
                    </div>
                )}
            </div>

            {/* 첨부 */}
            <AttachmentSection attachments={challenge.attachments} />
        </div>
    );
}

function RetrospectiveSection({ retro, endedAt }: { retro: TurnOverRetrospectiveDetail | undefined; endedAt?: number }) {
    if (!retro) return <p className={styles.emptyText}>등록된 회고 정보가 없습니다.</p>;

    return (
        <div className={styles.sectionsWrap}>
            {/* 최종 선택 */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}><h3>최종 선택</h3></div>
                <div className={styles.choiceCard}>
                    <div>
                        <p className={styles.choiceName}>{retro.name || "-"}</p>
                        <p className={styles.choicePosition}>{retro.position || "-"}</p>
                    </div>
                    {endedAt && <p className={styles.choiceReason}>종료일: {formatDate(endedAt)}</p>}
                    {retro.reason && <p className={styles.choiceReason}>{retro.reason}</p>}
                </div>
            </div>

            {/* 처우 협의 */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}><h3>처우 협의</h3></div>
                <div className={styles.negotiationGrid}>
                    <div className={styles.negotiationItem}>
                        <p className={styles.negotiationLabel}>직무</p>
                        <p className={styles.negotiationValue}>{retro.position || "-"}</p>
                    </div>
                    <div className={styles.negotiationItem}>
                        <p className={styles.negotiationLabel}>부서</p>
                        <p className={styles.negotiationValue}>{retro.department || "-"}</p>
                    </div>
                    <div className={styles.negotiationItem}>
                        <p className={styles.negotiationLabel}>직급</p>
                        <p className={styles.negotiationValue}>{retro.rank || "-"}</p>
                    </div>
                    <div className={styles.negotiationItem}>
                        <p className={styles.negotiationLabel}>직책</p>
                        <p className={styles.negotiationValue}>{retro.jobTitle || "-"}</p>
                    </div>
                    <div className={styles.negotiationItem}>
                        <p className={styles.negotiationLabel}>재직 형태</p>
                        <p className={styles.negotiationValue}>{getEmploymentTypeLabel(retro.employmentType)}</p>
                    </div>
                    <div className={styles.negotiationItem}>
                        <p className={styles.negotiationLabel}>근무 형태</p>
                        <p className={styles.negotiationValue}>{retro.workType || "-"}</p>
                    </div>
                    <div className={styles.negotiationItem}>
                        <p className={styles.negotiationLabel}>계약 연봉</p>
                        <p className={styles.negotiationValue}>{retro.salary > 0 ? formatSalary(retro.salary) : "-"}</p>
                    </div>
                    <div className={styles.negotiationItem}>
                        <p className={styles.negotiationLabel}>입사 일자</p>
                        <p className={styles.negotiationValue}>{formatDate(retro.joinedAt)}</p>
                    </div>
                </div>
            </div>

            {/* 만족도 평가 */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}><h3>만족도 평가</h3></div>
                <div className={styles.scoreRow}>
                    <p className={styles.scoreNumber}>{retro.score || 0}점</p>
                    <div className={styles.stars}>
                        {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={i < (retro.score || 0) ? styles.starFilled : styles.starEmpty}>★</span>
                        ))}
                    </div>
                </div>
                {retro.reviewSummary && (
                    <div className={styles.reviewSummary}>{retro.reviewSummary}</div>
                )}
            </div>

            {/* 메모 */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <h3>메모</h3>
                    <p>{retro.memos?.length || 0}</p>
                </div>
                {(!retro.memos || retro.memos.length === 0) ? (
                    <p className={styles.emptyText}>등록된 메모가 없습니다.</p>
                ) : (
                    <div className={styles.memoList}>
                        {retro.memos.map((memo) => (
                            <p key={memo.id} className={styles.memoItem}>{memo.content}</p>
                        ))}
                    </div>
                )}
            </div>

            {/* 첨부 */}
            <AttachmentSection attachments={retro.attachments} />
        </div>
    );
}

function AttachmentSection({ attachments }: { attachments?: Attachment[] }) {
    const handleClick = (att: Attachment) => {
        const isUrl = att.category === Attachment_AttachmentCategory.URL || (att.category as unknown as string) === "URL";
        if (isUrl) {
            window.open(att.url, "_blank");
        } else if (att.fileUrl) {
            window.open(att.fileUrl, "_blank");
        }
    };

    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>
                <h3>첨부파일</h3>
                <p>{attachments?.length || 0}</p>
            </div>
            {(!attachments || attachments.length === 0) ? (
                <p className={styles.emptyText}>등록된 첨부파일이 없습니다.</p>
            ) : (
                <div className={styles.attachmentList}>
                    {attachments.map((att) => {
                        const isUrl = att.category === Attachment_AttachmentCategory.URL || (att.category as unknown as string) === "URL";
                        return (
                            <div key={att.id} className={styles.attachmentItem} onClick={() => handleClick(att)}>
                                <span className={styles.attachmentIcon}>{isUrl ? "🔗" : "📄"}</span>
                                <div className={styles.attachmentInfo}>
                                    <p className={styles.attachmentName}>{isUrl ? (att.url || "-") : (att.fileName || "-")}</p>
                                    <p className={styles.attachmentType}>{isUrl ? "URL" : "파일"}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ── Main Component ── */

interface TurnOverDetailResponse {
    turnOver?: TurnOverDetail;
}

export default function AdminTurnOverDetail({ id }: { id: string }) {
    const router = useRouter();
    const [detail, setDetail] = useState<TurnOverDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>("goal");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/turn-overs/${id}`, { credentials: "include" });
                if (!res.ok) throw new Error("Failed to fetch turn-over detail");
                const data: TurnOverDetailResponse = await res.json();
                setDetail(data.turnOver ?? null);
            } catch (e) {
                console.error(e);
                setError("상세 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <LoadingScreen />;
    if (error || !detail) return <div style={{ color: "#f87171" }}>{error || "데이터가 없습니다."}</div>;

    return (
        <div className={styles.wrapper}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h2>이직 상세</h2>
                    <p>{detail.name || "-"}</p>
                </div>
                <button className={styles.backButton} onClick={() => router.push("/dashboard/turnovers")}>목록으로</button>
            </div>

            {/* Basic Info */}
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <p className={styles.infoLabel}>기간</p>
                    <p className={styles.infoValue}>{formatDate(detail.startedAt)} ~ {formatDate(detail.endedAt)}</p>
                </div>
                <div className={styles.infoItem}>
                    <p className={styles.infoLabel}>작성자</p>
                    <p className={styles.infoValue}>{detail.worker?.nickName || "-"}</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className={styles.tabNav}>
                <button
                    className={`${styles.tabButton} ${activeTab === "goal" ? styles.tabButtonActive : ""}`}
                    onClick={() => setActiveTab("goal")}
                >
                    목표
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === "challenge" ? styles.tabButtonActive : ""}`}
                    onClick={() => setActiveTab("challenge")}
                >
                    도전
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === "retrospective" ? styles.tabButtonActive : ""}`}
                    onClick={() => setActiveTab("retrospective")}
                >
                    회고
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "goal" && (
                <GoalSection goal={detail.turnOverGoal} startedAt={detail.startedAt} />
            )}
            {activeTab === "challenge" && (
                <ChallengeSection challenge={detail.turnOverChallenge} />
            )}
            {activeTab === "retrospective" && (
                <RetrospectiveSection retro={detail.turnOverRetrospective} endedAt={detail.endedAt} />
            )}
        </div>
    );
}
