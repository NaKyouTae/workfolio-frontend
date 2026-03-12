import React, { useState, useMemo } from 'react';
import { ResumeDetail } from '@workfolio/shared/generated/common';
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

/** 섹션별 액션 플랜 가이드 */
const ACTION_PLAN_GUIDE: Record<string, { priority: number; tip: string }> = {
  '기본 정보': { priority: 1, tip: '이름을 입력하면 이력서의 첫인상이 완성돼요' },
  '직무': { priority: 2, tip: '희망 직무를 설정하면 이력서 방향이 명확해져요' },
  '자기소개': { priority: 3, tip: '간단한 자기소개를 작성해 나만의 강점을 어필하세요' },
  '경력': { priority: 4, tip: '경력 사항을 추가하면 경력 타임라인이 자동으로 만들어져요' },
  '학력': { priority: 5, tip: '최종 학력을 추가해 이력서를 보완하세요' },
  '프로젝트': { priority: 6, tip: '대표 프로젝트를 추가하면 역량을 구체적으로 보여줄 수 있어요' },
  '활동/자격': { priority: 7, tip: '자격증이나 대외활동을 추가해 차별화된 이력서를 만들어 보세요' },
  '어학': { priority: 8, tip: '어학 능력을 추가하면 글로벌 역량을 어필할 수 있어요' },
};

interface ActionPlanItem {
  resumeId: string;
  resumeTitle: string;
  percent: number;
  nextStep: string;
  tip: string;
}

/** 완성도가 낮은 이력서별 다음 할 일 생성 */
const buildActionPlans = (resumes: ResumeDetail[]): ActionPlanItem[] => {
  return resumes
    .map(resume => {
      const { percent, missing } = calculateCompleteness(resume);
      if (percent >= 100 || missing.length === 0) return null;

      // 우선순위가 가장 높은(번호가 낮은) 미완성 섹션 선택
      const sorted = missing
        .map(m => ({ label: m, ...(ACTION_PLAN_GUIDE[m] || { priority: 99, tip: '' }) }))
        .sort((a, b) => a.priority - b.priority);

      const next = sorted[0];
      return {
        resumeId: resume.id,
        resumeTitle: resume.title,
        percent,
        nextStep: `${next.label} 작성`,
        tip: next.tip,
      };
    })
    .filter((item): item is ActionPlanItem => item !== null)
    .sort((a, b) => a.percent - b.percent) // 완성도 낮은 순
    .slice(0, 3);
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

  // 액션 플랜 (완성도 낮은 이력서 대상)
  const actionPlans = useMemo(() => buildActionPlans(resumeDetails), [resumeDetails]);

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
    const actions: { label: string; description: string; action: 'create' | 'edit'; resumeId?: string }[] = [];

    if (resumeDetails.length === 0) {
      actions.push({ label: '이직 이력서 추가', description: '이직 활동을 기록해 보세요', action: 'create' });
      return actions;
    }

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
                    <h2>내 이력서</h2>
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

                {/* 다음 할 일 (액션 플랜) */}
                {actionPlans.length > 0 && (
                    <div className="cont-box">
                        <div className="cont-tit">
                            <div><h3>다음 할 일</h3></div>
                        </div>
                        <ul className="action-plan-list">
                            {actionPlans.map(plan => (
                                <li key={plan.resumeId} onClick={() => {
                                    if (!isLoggedIn()) { setShowLoginModal(true); return; }
                                    const resume = resumeDetails.find(r => r.id === plan.resumeId);
                                    if (resume) onEdit(resume);
                                }}>
                                    <div className="action-plan-header">
                                        <span className="action-plan-resume">{plan.resumeTitle}</span>
                                        <span className="action-plan-percent">{plan.percent}%</span>
                                    </div>
                                    <div className="action-plan-progress">
                                        <div className="career-completeness-bar">
                                            <div className="career-completeness-fill" style={{ width: `${plan.percent}%` }} />
                                        </div>
                                    </div>
                                    <p className="action-plan-next">{plan.nextStep}</p>
                                    <span className="action-plan-tip">{plan.tip}</span>
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

            </div>
        </div>
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default CareerIntegration;
