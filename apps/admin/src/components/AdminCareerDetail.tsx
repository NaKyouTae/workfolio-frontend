"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ResumeDetail,
    Career,
    Career_EmploymentType,
    Education,
    Education_EducationStatus,
    Activity,
    Activity_ActivityType,
    Project,
    LanguageSkill,
    LanguageSkill_Language,
    LanguageSkill_LanguageLevel,
    Attachment,
    Attachment_AttachmentType,
    Attachment_AttachmentCategory,
} from "@workfolio/shared/generated/common";
import LoadingScreen from "@workfolio/shared/ui/LoadingScreen";
import styles from "./AdminDetailPage.module.css";

const formatDate = (timestamp?: number | string) => {
    if (!timestamp || timestamp === 0) return "-";
    const numTimestamp = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
    if (isNaN(numTimestamp) || numTimestamp === 0) return "-";
    const date = new Date(numTimestamp);
    if (isNaN(date.getTime())) return "-";
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
};

const formatPeriod = (startedAt?: number, endedAt?: number) => {
    const start = formatDate(startedAt);
    const end = formatDate(endedAt);
    if (start === "-" && end === "-") return "-";
    if (end === "-") return start;
    return `${start} ~ ${end}`;
};

const getEmploymentTypeLabel = (type?: Career_EmploymentType) => {
    switch (type) {
        case Career_EmploymentType.FULL_TIME: return "정규직";
        case Career_EmploymentType.CONTRACT: return "계약직";
        case Career_EmploymentType.INTERN: return "인턴";
        case Career_EmploymentType.FREELANCER: return "프리랜서";
        default: return "";
    }
};

const getEducationStatusLabel = (status?: Education_EducationStatus) => {
    switch (status) {
        case Education_EducationStatus.GRADUATED: return "졸업";
        case Education_EducationStatus.GRADUATING: return "졸업예정";
        case Education_EducationStatus.ENROLLED: return "재학";
        case Education_EducationStatus.DROPPED_OUT: return "중퇴";
        case Education_EducationStatus.COMPLETED: return "수료";
        case Education_EducationStatus.ON_LEAVE: return "휴학";
        default: return "";
    }
};

const getActivityTypeLabel = (type?: Activity_ActivityType) => {
    switch (type) {
        case Activity_ActivityType.EXTERNAL: return "대외활동";
        case Activity_ActivityType.CERTIFICATION: return "자격증";
        case Activity_ActivityType.AWARD: return "대회";
        case Activity_ActivityType.EDUCATION: return "교육";
        case Activity_ActivityType.ETC: return "기타";
        default: return "";
    }
};

const getActivityTypeBgColor = (type?: Activity_ActivityType) => {
    switch (type) {
        case Activity_ActivityType.EXTERNAL: return "#FDEAE9";
        case Activity_ActivityType.CERTIFICATION: return "#ECFAEE";
        case Activity_ActivityType.AWARD: return "#E6F2FF";
        case Activity_ActivityType.EDUCATION: return "#FFF5E9";
        case Activity_ActivityType.ETC: return "#ECEDEF";
        default: return "#ECEDEF";
    }
};

const getActivityTypeColor = (type?: Activity_ActivityType) => {
    switch (type) {
        case Activity_ActivityType.EXTERNAL: return "#ff3b30";
        case Activity_ActivityType.CERTIFICATION: return "#34c759";
        case Activity_ActivityType.AWARD: return "#007aff";
        case Activity_ActivityType.EDUCATION: return "#ff9500";
        case Activity_ActivityType.ETC: return "#515c66";
        default: return "#515c66";
    }
};

const getLanguageLabel = (language?: LanguageSkill_Language) => {
    switch (language) {
        case LanguageSkill_Language.ENGLISH: return "영어";
        case LanguageSkill_Language.JAPANESE: return "일본어";
        case LanguageSkill_Language.CHINESE: return "중국어";
        case LanguageSkill_Language.KOREAN: return "한국어";
        case LanguageSkill_Language.FRENCH: return "프랑스어";
        case LanguageSkill_Language.SPANISH: return "스페인어";
        case LanguageSkill_Language.GERMAN: return "독일어";
        case LanguageSkill_Language.RUSSIAN: return "러시아어";
        case LanguageSkill_Language.VIETNAMESE: return "베트남어";
        case LanguageSkill_Language.ITALIAN: return "이탈리아어";
        case LanguageSkill_Language.THAI: return "태국어";
        case LanguageSkill_Language.ARABIC: return "아랍어";
        case LanguageSkill_Language.PORTUGUESE: return "포르투갈어";
        case LanguageSkill_Language.INDONESIAN: return "인도네시아어";
        case LanguageSkill_Language.MONGOLIAN: return "몽골어";
        case LanguageSkill_Language.TURKISH: return "터키어";
        default: return "";
    }
};

const getLevelLabel = (level?: LanguageSkill_LanguageLevel) => {
    switch (level) {
        case LanguageSkill_LanguageLevel.DAILY_CONVERSATION: return "일상 회화 가능";
        case LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION: return "비즈니스 회화 가능";
        case LanguageSkill_LanguageLevel.NATIVE_LEVEL: return "원어민 수준";
        default: return "";
    }
};

const getAttachmentTypeLabel = (type?: Attachment_AttachmentType) => {
    switch (type) {
        case Attachment_AttachmentType.RESUME: return "이력서";
        case Attachment_AttachmentType.PORTFOLIO: return "포트폴리오";
        case Attachment_AttachmentType.CERTIFICATE: return "증명서";
        case Attachment_AttachmentType.CAREER_STATEMENT: return "경력기술서";
        case Attachment_AttachmentType.ETC: return "기타";
        default: return "";
    }
};

const formatPhoneNumber = (phone?: string) => {
    if (!phone) return "";
    const numbers = phone.replace(/[^0-9]/g, "");
    if (numbers.length === 11) {
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else if (numbers.length === 10) {
        if (numbers.startsWith("02")) {
            return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
        } else {
            return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
        }
    } else if (numbers.length === 9) {
        return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5)}`;
    }
    return phone;
};

/* ──── Section Components ──── */

function EducationSection({ educations }: { educations: Education[] }) {
    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>
                <h3>학력</h3>
                <p>({educations.length})</p>
            </div>
            {educations.length === 0 ? (
                <p className={styles.emptyText}>등록된 학력 정보가 없습니다.</p>
            ) : (
                <div className={styles.itemList}>
                    {educations.map((edu) => (
                        <div key={edu.id} className={styles.item}>
                            <div className={styles.itemInfo}>
                                <div className={styles.itemInfoTop}>
                                    <div className={styles.itemInfoTopLeft}>
                                        <h4 className={styles.itemName}>{edu.name || "-"}</h4>
                                    </div>
                                    <ul className={styles.itemInfoTopRight}>
                                        <li className={styles.fontBlack}>{formatPeriod(edu.startedAt, edu.endedAt)}</li>
                                        {edu.status !== undefined && getEducationStatusLabel(edu.status) && (
                                            <li>{getEducationStatusLabel(edu.status)}</li>
                                        )}
                                    </ul>
                                </div>
                                {edu.major && (
                                    <ul className={styles.itemMetaRow}>
                                        <li>{edu.major}</li>
                                    </ul>
                                )}
                            </div>
                            {edu.description && (
                                <div className={styles.itemDesc}>
                                    <p className={styles.itemDescText}>{edu.description}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function CareerSection({ careers }: { careers: Career[] }) {
    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>
                <h3>경력</h3>
                <p>({careers.length})</p>
            </div>
            {careers.length === 0 ? (
                <p className={styles.emptyText}>등록된 경력 정보가 없습니다.</p>
            ) : (
                <div className={styles.itemList}>
                    {careers.map((career) => (
                        <div key={career.id} className={styles.item}>
                            <div className={styles.itemInfo}>
                                <div className={styles.itemInfoTop}>
                                    <div className={styles.itemInfoTopLeft}>
                                        <h4 className={styles.itemName}>{career.name || "-"}</h4>
                                        {career.position && <p className={styles.itemSub}>{career.position}</p>}
                                    </div>
                                    <ul className={styles.itemInfoTopRight}>
                                        <li className={styles.fontBlack}>
                                            {formatDate(career.startedAt)} ~ {career.isWorking ? "재직중" : formatDate(career.endedAt)}
                                        </li>
                                        {career.employmentType !== undefined && getEmploymentTypeLabel(career.employmentType) && (
                                            <li>{getEmploymentTypeLabel(career.employmentType)}</li>
                                        )}
                                    </ul>
                                </div>
                                <ul className={styles.itemMetaRow}>
                                    {career.department && <li>{career.department}</li>}
                                    {career.jobTitle && <li>{career.jobTitle}</li>}
                                    {career.salary > 0 && <li>연봉 {career.salary.toLocaleString("ko-KR")}만 원</li>}
                                </ul>
                            </div>
                            {(career.description || (career.salaries && career.salaries.length > 0)) && (
                                <div className={styles.itemDesc}>
                                    {career.description && <p className={styles.itemDescText}>{career.description}</p>}
                                    {career.salaries && career.salaries.length > 0 && (
                                        <ul className={styles.subList}>
                                            {[...career.salaries]
                                                .sort((a, b) => (b.negotiationDate || 0) - (a.negotiationDate || 0))
                                                .map((salary) => (
                                                    <li key={salary.id} className={styles.subItem}>
                                                        <p>{salary.negotiationDate ? formatDate(salary.negotiationDate) : "-"}</p>
                                                        <div className={styles.subItemContent}>
                                                            {salary.amount && salary.amount > 0 && (
                                                                <p>연봉 {Number(salary.amount).toLocaleString("ko-KR")}만 원</p>
                                                            )}
                                                            {salary.memo && <span>{salary.memo}</span>}
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ProjectSection({ projects }: { projects: Project[] }) {
    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>
                <h3>프로젝트</h3>
                <p>({projects.length})</p>
            </div>
            {projects.length === 0 ? (
                <p className={styles.emptyText}>등록된 프로젝트 정보가 없습니다.</p>
            ) : (
                <div className={styles.itemList}>
                    {projects.map((project) => (
                        <div key={project.id} className={styles.item}>
                            <div className={styles.itemInfo}>
                                <div className={styles.itemInfoTop}>
                                    <div className={styles.itemInfoTopLeft}>
                                        <h4 className={styles.itemName}>{project.title || "-"}</h4>
                                    </div>
                                    <ul className={styles.itemInfoTopRight}>
                                        <li className={styles.fontBlack}>{formatPeriod(project.startedAt, project.endedAt)}</li>
                                    </ul>
                                </div>
                                <ul className={styles.itemMetaRow}>
                                    {project.role && <li>{project.role}</li>}
                                    {project.affiliation && <li>{project.affiliation}</li>}
                                </ul>
                            </div>
                            {project.description && (
                                <div className={styles.itemDesc}>
                                    <p className={styles.itemDescText}>{project.description}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ActivitySection({ activities }: { activities: Activity[] }) {
    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>
                <h3>활동</h3>
                <p>({activities.length})</p>
            </div>
            {activities.length === 0 ? (
                <p className={styles.emptyText}>등록된 활동 정보가 없습니다.</p>
            ) : (
                <div className={styles.itemList}>
                    {activities.map((activity) => (
                        <div key={activity.id} className={styles.item}>
                            <div className={styles.itemInfo}>
                                <div className={styles.itemInfoTop}>
                                    <div className={styles.itemInfoTopLeft}>
                                        <h4 className={styles.itemName}>{activity.name || "-"}</h4>
                                        {activity.type !== undefined && getActivityTypeLabel(activity.type) && (
                                            <span
                                                className={styles.badge}
                                                style={{
                                                    backgroundColor: getActivityTypeBgColor(activity.type),
                                                    color: getActivityTypeColor(activity.type),
                                                }}
                                            >
                                                {getActivityTypeLabel(activity.type)}
                                            </span>
                                        )}
                                    </div>
                                    <ul className={styles.itemInfoTopRight}>
                                        <li className={styles.fontBlack}>{formatPeriod(activity.startedAt, activity.endedAt)}</li>
                                    </ul>
                                </div>
                                <ul className={styles.itemMetaRow}>
                                    {activity.organization && <li>{activity.organization}</li>}
                                    {activity.certificateNumber && <li>취득번호 {activity.certificateNumber}</li>}
                                </ul>
                            </div>
                            {activity.description && (
                                <div className={styles.itemDesc}>
                                    <p className={styles.itemDescText}>{activity.description}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function LanguageSection({ languageSkills }: { languageSkills: LanguageSkill[] }) {
    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>
                <h3>언어</h3>
                <p>({languageSkills.length})</p>
            </div>
            {languageSkills.length === 0 ? (
                <p className={styles.emptyText}>등록된 언어 정보가 없습니다.</p>
            ) : (
                <div className={styles.itemList}>
                    {languageSkills.map((ls) => (
                        <div key={ls.id} className={styles.item}>
                            <div className={styles.itemInfo}>
                                <div className={styles.itemInfoTop}>
                                    <div className={styles.itemInfoTopLeft}>
                                        <h4 className={styles.itemName}>{getLanguageLabel(ls.language) || "-"}</h4>
                                        {ls.level !== undefined && getLevelLabel(ls.level) && (
                                            <p className={styles.itemSub}>{getLevelLabel(ls.level)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {ls.languageTests && ls.languageTests.length > 0 && (
                                <div className={styles.itemDesc}>
                                    <ul className={styles.subList}>
                                        {[...ls.languageTests]
                                            .sort((a, b) => (b.acquiredAt || 0) - (a.acquiredAt || 0))
                                            .map((test) => (
                                                <li key={test.id} className={styles.subItem}>
                                                    <p>{test.acquiredAt ? formatDate(test.acquiredAt) : "-"}</p>
                                                    <div className={styles.subItemContent}>
                                                        <p>{test.name || "-"}</p>
                                                        {test.score && <span>{test.score}</span>}
                                                    </div>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function AttachmentSection({ attachments }: { attachments: Attachment[] }) {
    const handleClick = (attachment: Attachment) => {
        if (attachment.category === Attachment_AttachmentCategory.URL || (attachment.category as unknown as string) === "URL") {
            window.open(attachment.url, "_blank");
        } else if (attachment.fileUrl) {
            window.open(attachment.fileUrl, "_blank");
        }
    };

    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>
                <h3>첨부</h3>
                <p>({attachments.length})</p>
            </div>
            {attachments.length === 0 ? (
                <p className={styles.emptyText}>등록된 첨부 정보가 없습니다.</p>
            ) : (
                <div className={styles.attachmentList}>
                    {attachments.map((att) => {
                        const isUrl = att.category === Attachment_AttachmentCategory.URL || (att.category as unknown as string) === "URL";
                        return (
                            <div
                                key={att.id}
                                className={styles.attachmentItem}
                                onClick={() => handleClick(att)}
                            >
                                <span className={styles.attachmentIcon}>{isUrl ? "🔗" : "📄"}</span>
                                <div className={styles.attachmentInfo}>
                                    <p className={styles.attachmentName}>
                                        {isUrl ? (att.url || "-") : (att.fileName || "-")}
                                    </p>
                                    <p className={styles.attachmentType}>
                                        {getAttachmentTypeLabel(att.type)}{isUrl ? " · URL" : " · 파일"}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ──── Main Component ──── */

export default function AdminCareerDetail({ id }: { id: string }) {
    const router = useRouter();
    const [detail, setDetail] = useState<ResumeDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/careers/${id}`, { credentials: "include" });
                if (!res.ok) throw new Error("Failed to fetch career detail");
                const data = await res.json();
                setDetail(data);
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
                    <h2>이력 상세</h2>
                    <p>{detail.title || "-"}</p>
                </div>
                <button className={styles.backButton} onClick={() => router.push("/dashboard/careers")}>
                    목록으로
                </button>
            </div>

            {/* 기본 정보 - 인풋 스타일 */}
            <div className={styles.basicInfoSection}>
                <div className={styles.basicInfoGrid}>
                    <div className={styles.inputField}>
                        <label className={styles.inputLabel}>이름</label>
                        <input className={styles.inputValue} value={detail.name || "-"} readOnly tabIndex={-1} />
                    </div>
                    <div className={styles.inputField}>
                        <label className={styles.inputLabel}>포지션</label>
                        <input className={styles.inputValue} value={detail.position || "-"} readOnly tabIndex={-1} />
                    </div>
                    <div className={styles.inputField}>
                        <label className={styles.inputLabel}>연락처</label>
                        <input className={styles.inputValue} value={formatPhoneNumber(detail.phone) || "-"} readOnly tabIndex={-1} />
                    </div>
                    <div className={styles.inputField}>
                        <label className={styles.inputLabel}>이메일</label>
                        <input className={styles.inputValue} value={detail.email || "-"} readOnly tabIndex={-1} />
                    </div>
                    <div className={styles.inputField}>
                        <label className={styles.inputLabel}>생성일</label>
                        <input className={styles.inputValue} value={formatDate(detail.createdAt)} readOnly tabIndex={-1} />
                    </div>
                    <div className={styles.inputField}>
                        <label className={styles.inputLabel}>수정일</label>
                        <input className={styles.inputValue} value={formatDate(detail.updatedAt)} readOnly tabIndex={-1} />
                    </div>
                    <div className={`${styles.inputField} ${styles.basicInfoFull}`}>
                        <label className={styles.inputLabel}>자기소개</label>
                        <textarea className={styles.inputValueTextarea} value={detail.description || "-"} readOnly tabIndex={-1} rows={4} />
                    </div>
                </div>
            </div>

            {/* 섹션들 */}
            <div className={styles.sectionsWrap}>
                <EducationSection educations={detail.educations || []} />
                <CareerSection careers={detail.careers || []} />
                <ProjectSection projects={detail.projects || []} />
                <ActivitySection activities={(detail.activities || []) as Activity[]} />
                <LanguageSection languageSkills={detail.languageSkills || []} />
                <AttachmentSection attachments={detail.attachments || []} />
            </div>
        </div>
    );
}
