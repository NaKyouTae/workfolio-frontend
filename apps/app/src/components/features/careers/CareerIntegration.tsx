import React, { useState, useMemo } from 'react';
import { ResumeDetail, Activity_ActivityType, LanguageSkill_Language, LanguageSkill_LanguageLevel } from '@workfolio/shared/generated/common';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import { useIsDemo } from '@/hooks/useIsDemo';
import LoginModal from '@workfolio/shared/ui/LoginModal';
import DemoBanner from '@/components/features/records/dashboard/DemoBanner';
import dayjs from 'dayjs';

interface CareerIntegrationProps {
  resumeDetails: ResumeDetail[];
  onView: (resume: ResumeDetail) => void;
  onEdit: (resume: ResumeDetail) => void;
  onCreate?: () => void;
  duplicateResume: (resumeId?: string) => Promise<void>;
  deleteResume: (resumeId?: string) => Promise<void>;
  calculateTotalCareer: (resume: ResumeDetail) => string;
  changeDefault: (resumeId?: string) => Promise<void>;
  isLoading?: boolean;
}

/** 언어 enum → 한글 */
const languageName = (lang?: LanguageSkill_Language): string => {
  const map: Record<number, string> = {
    [LanguageSkill_Language.ENGLISH]: '영어',
    [LanguageSkill_Language.JAPANESE]: '일본어',
    [LanguageSkill_Language.CHINESE]: '중국어',
    [LanguageSkill_Language.KOREAN]: '한국어',
    [LanguageSkill_Language.FRENCH]: '프랑스어',
    [LanguageSkill_Language.SPANISH]: '스페인어',
    [LanguageSkill_Language.GERMAN]: '독일어',
    [LanguageSkill_Language.RUSSIAN]: '러시아어',
    [LanguageSkill_Language.VIETNAMESE]: '베트남어',
    [LanguageSkill_Language.ITALIAN]: '이탈리아어',
    [LanguageSkill_Language.THAI]: '태국어',
    [LanguageSkill_Language.ARABIC]: '아랍어',
    [LanguageSkill_Language.PORTUGUESE]: '포르투갈어',
    [LanguageSkill_Language.INDONESIAN]: '인도네시아어',
    [LanguageSkill_Language.MONGOLIAN]: '몽골어',
    [LanguageSkill_Language.TURKISH]: '터키어',
  };
  return map[lang ?? 0] || '기타';
};

/** 레벨 enum → 한글 */
const levelName = (level?: LanguageSkill_LanguageLevel): string => {
  switch (level) {
    case LanguageSkill_LanguageLevel.DAILY_CONVERSATION: return '일상회화';
    case LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION: return '비즈니스';
    case LanguageSkill_LanguageLevel.NATIVE_LEVEL: return '원어민급';
    default: return '';
  }
};

/** 활동 유형 → 한글 */
const activityTypeName = (type?: Activity_ActivityType): string => {
  switch (type) {
    case Activity_ActivityType.CERTIFICATION: return '자격증';
    case Activity_ActivityType.AWARD: return '수상';
    case Activity_ActivityType.COMPETITION: return '대회';
    case Activity_ActivityType.EXTERNAL: return '대외활동';
    case Activity_ActivityType.EDUCATION: return '교육';
    default: return '기타';
  }
};

/** 이력서 완성도 계산 */
const calculateCompleteness = (resume: ResumeDetail): { percent: number; missing: string[] } => {
  const sections = [
    { filled: !!(resume.name && resume.name.trim()), label: '기본 정보' },
    { filled: !!(resume.position && resume.position.trim()), label: '직무' },
    { filled: resume.careers.length > 0, label: '경력' },
    { filled: resume.educations.length > 0, label: '학력' },
    { filled: resume.projects.length > 0, label: '프로젝트' },
    { filled: resume.activities.length > 0, label: '활동/자격' },
    { filled: resume.languageSkills.length > 0, label: '어학' },
    { filled: !!(resume.description && resume.description.trim()), label: '자기소개' },
  ];
  const filledCount = sections.filter(s => s.filled).length;
  const missing = sections.filter(s => !s.filled).map(s => s.label);
  return { percent: Math.round((filledCount / sections.length) * 100), missing };
};

const CareerIntegration: React.FC<CareerIntegrationProps> = ({
  resumeDetails,
  onView,
  onEdit,
  onCreate,
  calculateTotalCareer,
}) => {
  const isDemo = useIsDemo();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 이력서별 요약 (직무 + 경력 + 완성도 통합)
  const resumeSummaries = useMemo(() => {
    return resumeDetails.map(r => ({
      id: r.id,
      title: r.title,
      position: r.position || '',
      totalCareer: calculateTotalCareer(r),
      isDefault: r.isDefault,
      ...calculateCompleteness(r),
    }));
  }, [resumeDetails, calculateTotalCareer]);

  // 추천 액션 (버튼용)
  const suggestedActions = useMemo(() => {
    if (resumeDetails.length === 0) return [];

    const actions: { label: string; description: string; action: 'create' | 'edit'; resumeId?: string }[] = [];

    const hasDefault = resumeDetails.some(r => r.isDefault);
    if (!hasDefault && resumeDetails.length > 0) {
      actions.push({ label: '대표 이력서 설정', description: '대표 이력서가 없어요', action: 'edit', resumeId: resumeDetails[0].id });
    }

    const incomplete = resumeSummaries.find(c => c.percent < 50);
    if (incomplete) {
      actions.push({ label: `${incomplete.title} 보완`, description: `완성도 ${incomplete.percent}%`, action: 'edit', resumeId: incomplete.id });
    }

    const threeMonthsAgo = dayjs().subtract(3, 'month').valueOf();
    const stale = resumeDetails.find(r => (r.updatedAt || 0) < threeMonthsAgo);
    if (stale) {
      actions.push({ label: `${stale.title} 업데이트`, description: '3개월 이상 미수정', action: 'edit', resumeId: stale.id });
    }

    return actions.slice(0, 4);
  }, [resumeDetails, resumeSummaries]);

  // 전체 이력서 데이터 집계 (커리어 통계)
  const careerStats = useMemo(() => {
    const allCareers = resumeDetails.flatMap(r => r.careers);

    // 총 경력 계산 (월 단위)
    let totalMonths = 0;
    allCareers.forEach(c => {
      if (!c.startedAt) return;
      const start = dayjs(c.startedAt);
      const end = c.isWorking ? dayjs() : c.endedAt ? dayjs(c.endedAt) : dayjs();
      totalMonths += end.diff(start, 'month');
    });
    const totalYears = Math.floor(totalMonths / 12);
    const remainMonths = totalMonths % 12;

    // 이직 횟수 (경력 수 - 현재 재직 중인 회사)
    const turnoverCount = Math.max(0, allCareers.length - 1);

    // 평균 재직 기간
    const avgMonths = allCareers.length > 0 ? Math.round(totalMonths / allCareers.length) : 0;
    const avgYears = Math.floor(avgMonths / 12);
    const avgRemain = avgMonths % 12;

    // 자격증 수
    const allActivities = resumeDetails.flatMap(r => r.activities);
    const certCount = allActivities.filter(a => a.type === Activity_ActivityType.CERTIFICATION).length;

    return {
      totalCareer: totalYears > 0 ? `${totalYears}년 ${remainMonths}개월` : totalMonths > 0 ? `${remainMonths}개월` : '-',
      turnoverCount,
      avgTenure: avgYears > 0 ? `${avgYears}년 ${avgRemain}개월` : avgMonths > 0 ? `${avgRemain}개월` : '-',
      certCount,
    };
  }, [resumeDetails]);

  // 커리어 타임라인 (경력만, 시작일 오름차순)
  const careerTimeline = useMemo(() => {
    const allCareers = resumeDetails.flatMap(r => r.careers);
    const items = allCareers
      .filter(c => c.startedAt)
      .map(c => {
        const end = c.isWorking ? Date.now() : (c.endedAt || Date.now());
        return {
          name: c.name,
          position: c.position || c.jobTitle || '',
          startedAt: c.startedAt!,
          endedAt: end,
          isWorking: !!c.isWorking,
          durationMonths: dayjs(end).diff(dayjs(c.startedAt), 'month'),
        };
      });

    // 중복 제거 + 시작일 오름차순
    const unique = items.filter((item, idx, arr) =>
      arr.findIndex(i => i.name === item.name && i.startedAt === item.startedAt) === idx
    );
    unique.sort((a, b) => a.startedAt - b.startedAt);
    return unique;
  }, [resumeDetails]);

  // 타임라인 전체 범위 + 연도 눈금
  const tlRange = useMemo(() => {
    if (careerTimeline.length === 0) return { min: 0, max: 1, span: 1, years: [] as number[] };
    const min = Math.min(...careerTimeline.map(c => c.startedAt));
    const max = Math.max(...careerTimeline.map(c => c.endedAt));
    const startYear = dayjs(min).year();
    const endYear = dayjs(max).year();
    const years: number[] = [];
    for (let y = startYear; y <= endYear; y++) years.push(y);
    return { min, max, span: max - min || 1, years };
  }, [careerTimeline]);

  // 스킬 & 자격 요약
  const skillsSummary = useMemo(() => {
    const allLanguages = resumeDetails.flatMap(r => r.languageSkills);
    const allActivities = resumeDetails.flatMap(r => r.activities);

    // 언어 중복 제거 (같은 언어)
    const uniqueLangs = allLanguages.filter((lang, idx, arr) =>
      arr.findIndex(l => l.language === lang.language) === idx
    );

    const certs = allActivities.filter(a => a.type === Activity_ActivityType.CERTIFICATION);
    const awards = allActivities.filter(a => a.type === Activity_ActivityType.AWARD || a.type === Activity_ActivityType.COMPETITION);
    const others = allActivities.filter(a =>
      a.type !== Activity_ActivityType.CERTIFICATION &&
      a.type !== Activity_ActivityType.AWARD &&
      a.type !== Activity_ActivityType.COMPETITION
    );

    return { languages: uniqueLangs, certs, awards, others };
  }, [resumeDetails]);

  // 프로젝트 포트폴리오 요약
  const projectStats = useMemo(() => {
    const allProjects = resumeDetails.flatMap(r => r.projects);

    // 중복 제거
    const unique = allProjects.filter((p, idx, arr) =>
      arr.findIndex(i => i.title === p.title && i.startedAt === p.startedAt) === idx
    );

    const withDates = unique.filter(p => p.startedAt);
    let avgDurationMonths = 0;
    if (withDates.length > 0) {
      const totalMonths = withDates.reduce((sum, p) => {
        const end = p.endedAt ? dayjs(p.endedAt) : dayjs();
        return sum + end.diff(dayjs(p.startedAt), 'month');
      }, 0);
      avgDurationMonths = Math.round(totalMonths / withDates.length);
    }

    const ongoing = unique.filter(p => !p.endedAt).length;

    // 역할 분포
    const roleCounts: Record<string, number> = {};
    unique.forEach(p => {
      const role = p.role?.trim() || '미지정';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
    const roles = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return { total: unique.length, ongoing, avgDurationMonths, roles };
  }, [resumeDetails]);

  const handleActionClick = (action: typeof suggestedActions[0]) => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    if (action.action === 'create') {
      onCreate?.();
    } else if (action.resumeId) {
      const resume = resumeDetails.find(r => r.id === action.resumeId);
      if (resume) onEdit(resume);
    }
  };

  const handleResumeClick = (id: string) => {
    const resume = resumeDetails.find(r => r.id === id);
    if (resume) onView(resume);
  };

  return (
    <>
        <div className="contents">
            <div className="page-title">
                <div>
                    <h2>내 이력 관리</h2>
                </div>
            </div>
            <div className="page-cont">
                {isDemo === true && (
                    <DemoBanner
                        title="체계적인 이력 관리로 더 나은 커리어를"
                        description="샘플 데이터를 체험 중입니다. 로그인하면 나만의 이력서를 관리할 수 있어요."
                        features={["이력서 작성 및 관리", "기업 유형별 이력서 자동 생성", "URL 공유 및 PDF 다운로드"]}
                    />
                )}

                {/* 추천 액션 버튼 */}
                {suggestedActions.length > 0 && (
                    <div className="cont-box">
                        <div className="cont-tit">
                            <div><h3>추천</h3></div>
                        </div>
                        <ul className="quick-record-list">
                            {suggestedActions.map((action, idx) => (
                                <li key={idx} onClick={() => handleActionClick(action)}>
                                    <p>{action.label}</p>
                                    <span>{action.description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 내 이력서 */}
                {resumeSummaries.length > 0 && (
                    <div className="cont-box">
                        <div className="cont-tit">
                            <div>
                                <h3>내 이력서</h3>
                                <p>{resumeSummaries.length}개</p>
                            </div>
                        </div>
                        <ul className="career-resume-grid">
                            {resumeSummaries.slice(0, 5).map(item => (
                                <li key={item.id} onClick={() => handleResumeClick(item.id)}>
                                    <div className="career-resume-card-top">
                                        <span className="career-resume-card-title">
                                            {item.isDefault && <img src="/assets/img/ico/ic-resume-check-ov.svg" alt="대표" width={12} height={12} />}
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
                                    <div className="career-resume-card-meta">
                                        {item.position && <span>{item.position}</span>}
                                        {item.totalCareer && <span>{item.totalCareer}</span>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 커리어 통계 */}
                <div className="cont-box">
                    <div className="cont-tit">
                        <div><h3>커리어 통계</h3></div>
                    </div>
                    <ul className="stats-summary career-stats-4col">
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

                {/* 커리어 타임라인 */}
                <div className="cont-box">
                    <div className="cont-tit">
                        <div><h3>커리어 타임라인</h3></div>
                    </div>
                    {(() => {
                        const hasData = careerTimeline.length > 0;
                        const emptyYears: number[] = [];
                        if (!hasData) {
                            const currentYear = dayjs().year();
                            for (let y = currentYear - 9; y <= currentYear; y++) emptyYears.push(y);
                        }
                        const years = hasData ? tlRange.years : emptyYears;
                        const rangeMin = hasData ? tlRange.min : dayjs(`${emptyYears[0]}-01-01`).valueOf();
                        const rangeMax = hasData ? tlRange.max : dayjs(`${emptyYears[emptyYears.length - 1]}-12-31`).valueOf();
                        const rangeSpan = rangeMax - rangeMin || 1;

                        return (
                            <div className="career-gantt">
                                {/* 연도 헤더 */}
                                <div className="career-gantt-header">
                                    <div className="career-gantt-label" />
                                    <div className="career-gantt-track">
                                        {years.map(y => {
                                            const yStart = dayjs(`${y}-01-01`).valueOf();
                                            const left = Math.max(0, ((yStart - rangeMin) / rangeSpan) * 100);
                                            return (
                                                <span key={y} className="career-gantt-year" style={{ left: `${left}%` }}>{y}</span>
                                            );
                                        })}
                                    </div>
                                    <div className="career-gantt-dur-header" />
                                </div>
                                {hasData ? (
                                    careerTimeline.map((c, idx) => {
                                        const colors = ['var(--yellow004)', 'var(--yellow003)', '#f5c842', '#e6a800', '#ffd666', '#d4990a', '#ffce47', '#c48c00'];
                                        const left = ((c.startedAt - rangeMin) / rangeSpan) * 100;
                                        const width = Math.max(2, ((c.endedAt - c.startedAt) / rangeSpan) * 100);
                                        const yrs = Math.floor(c.durationMonths / 12);
                                        const mos = c.durationMonths % 12;
                                        const dur = yrs > 0 ? `${yrs}년${mos > 0 ? ` ${mos}개월` : ''}` : `${c.durationMonths}개월`;
                                        return (
                                            <div key={idx} className="career-gantt-row">
                                                <div className="career-gantt-label">
                                                    <span className="career-gantt-name">{c.name}</span>
                                                    {c.position && <span className="career-gantt-pos">{c.position}</span>}
                                                </div>
                                                <div className="career-gantt-track">
                                                    {years.map(y => {
                                                        const yStart = dayjs(`${y}-01-01`).valueOf();
                                                        const lineLeft = ((yStart - rangeMin) / rangeSpan) * 100;
                                                        return lineLeft > 0 && lineLeft < 100 ? (
                                                            <div key={y} className="career-gantt-gridline" style={{ left: `${lineLeft}%` }} />
                                                        ) : null;
                                                    })}
                                                    <div
                                                        className="career-gantt-bar"
                                                        style={{
                                                            left: `${left}%`,
                                                            width: `${width}%`,
                                                            backgroundColor: colors[idx % colors.length],
                                                        }}
                                                        title={`${c.name} · ${dayjs(c.startedAt).format('YYYY.MM')} ~ ${c.isWorking ? '현재' : dayjs(c.endedAt).format('YYYY.MM')}`}
                                                    />
                                                </div>
                                                <span className="career-gantt-dur">{dur}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="career-gantt-row">
                                        <div className="career-gantt-label">
                                            <span className="career-gantt-pos">경력을 추가해 보세요</span>
                                        </div>
                                        <div className="career-gantt-track">
                                            {years.map(y => {
                                                const yStart = dayjs(`${y}-01-01`).valueOf();
                                                const lineLeft = ((yStart - rangeMin) / rangeSpan) * 100;
                                                return lineLeft > 0 && lineLeft < 100 ? (
                                                    <div key={y} className="career-gantt-gridline" style={{ left: `${lineLeft}%` }} />
                                                ) : null;
                                            })}
                                        </div>
                                        <span className="career-gantt-dur" />
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>

                {/* 스킬 & 자격 / 프로젝트 포트폴리오 2열 */}
                <div className="career-dashboard-row2">
                    {/* 스킬 & 자격 */}
                    <div className="cont-box">
                        <div className="cont-tit">
                            <div><h3>스킬 & 자격</h3></div>
                        </div>
                        <div className="career-skills-body">
                            <div className="career-skills-section">
                                <p className="career-skills-section-title">어학</p>
                                {skillsSummary.languages.length > 0 ? (
                                    <ul className="career-skill-tags">
                                        {skillsSummary.languages.map((lang, idx) => (
                                            <li key={idx} className="career-skill-tag career-skill-tag-lang">
                                                <span>{languageName(lang.language)}</span>
                                                {lang.level !== undefined && lang.level !== LanguageSkill_LanguageLevel.LANGUAGE_LEVEL_UNKNOWN && (
                                                    <em>{levelName(lang.level)}</em>
                                                )}
                                                {lang.languageTests.length > 0 && (
                                                    <em className="career-skill-test">{lang.languageTests[0].name} {lang.languageTests[0].score}</em>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="career-empty-text">등록된 어학 정보가 없습니다.</p>
                                )}
                            </div>
                            <div className="career-skills-section">
                                <p className="career-skills-section-title">자격증</p>
                                {skillsSummary.certs.length > 0 ? (
                                    <ul className="career-skill-tags">
                                        {skillsSummary.certs.map((cert, idx) => (
                                            <li key={idx} className="career-skill-tag career-skill-tag-cert">
                                                <span>{cert.name}</span>
                                                {cert.organization && <em>{cert.organization}</em>}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="career-empty-text">등록된 자격증이 없습니다.</p>
                                )}
                            </div>
                            <div className="career-skills-section">
                                <p className="career-skills-section-title">수상 & 대회</p>
                                {skillsSummary.awards.length > 0 ? (
                                    <ul className="career-skill-tags">
                                        {skillsSummary.awards.map((award, idx) => (
                                            <li key={idx} className="career-skill-tag career-skill-tag-award">
                                                <span>{award.name}</span>
                                                <em>{activityTypeName(award.type)}</em>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="career-empty-text">등록된 수상/대회 이력이 없습니다.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 프로젝트 포트폴리오 */}
                    <div className="cont-box">
                        <div className="cont-tit">
                            <div><h3>프로젝트</h3></div>
                        </div>
                        <div className="career-project-body">
                            <ul className="career-project-metrics">
                                <li>
                                    <span>전체</span>
                                    <strong>{projectStats.total}개</strong>
                                </li>
                                <li>
                                    <span>진행중</span>
                                    <strong>{projectStats.ongoing}개</strong>
                                </li>
                                <li>
                                    <span>평균 기간</span>
                                    <strong>{projectStats.avgDurationMonths > 0 ? `${projectStats.avgDurationMonths}개월` : '-'}</strong>
                                </li>
                            </ul>
                            {projectStats.roles.length > 0 ? (
                                <div className="career-project-roles">
                                    <p className="career-skills-section-title">역할 분포</p>
                                    <ul className="career-project-role-list">
                                        {projectStats.roles.map(([role, count], idx) => (
                                            <li key={idx}>
                                                <span className="career-project-role-name">{role}</span>
                                                <div className="career-project-role-bar-wrap">
                                                    <div
                                                        className="career-project-role-bar"
                                                        style={{ width: `${(count / projectStats.total) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="career-project-role-count">{count}개</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="career-empty-text">이력서에 프로젝트를 추가하면 통계가 표시됩니다.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default CareerIntegration;
