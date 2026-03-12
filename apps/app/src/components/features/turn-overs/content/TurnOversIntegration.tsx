import React, { useMemo, useState, useCallback } from 'react';
import { useTurnOver } from '@/hooks/useTurnOver';
import { TurnOverDetail, CheckList, JobApplication_JobApplicationStatus } from '@workfolio/shared/generated/common';
import { CheckListCheckedUpdateRequest } from '@workfolio/shared/generated/turn_over';
import { useIsDemo } from '@/hooks/useIsDemo';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import { useNotification } from '@workfolio/shared/hooks/useNotification';
import LoginModal from '@workfolio/shared/ui/LoginModal';
import DemoBanner from '@/components/features/records/dashboard/DemoBanner';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';
import dayjs from 'dayjs';

/** 이직 활동 진척도 계산 */
export const calculateTurnOverProgress = (t: TurnOverDetail): number => {
  let filled = 0;
  const total = 5;
  // 1. 목표 설정
  if (t.turnOverGoal?.reason || t.turnOverGoal?.goal) filled++;
  // 2. 체크리스트 존재
  if (t.turnOverGoal?.checkList && t.turnOverGoal.checkList.length > 0) filled++;
  // 3. 지원 회사 등록
  if (t.turnOverChallenge?.jobApplications && t.turnOverChallenge.jobApplications.length > 0) filled++;
  // 4. 회고 작성
  if (t.turnOverRetrospective?.name && t.turnOverRetrospective.name.trim()) filled++;
  // 5. 만족도 평가
  if (t.turnOverRetrospective?.score && t.turnOverRetrospective.score > 0) filled++;
  return Math.round((filled / total) * 100);
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  [JobApplication_JobApplicationStatus.PENDING]: { label: '대기', className: 'status-pending' },
  [JobApplication_JobApplicationStatus.RUNNING]: { label: '진행', className: 'status-running' },
  [JobApplication_JobApplicationStatus.PASSED]: { label: '합격', className: 'status-passed' },
  [JobApplication_JobApplicationStatus.FAILED]: { label: '불합격', className: 'status-failed' },
  [JobApplication_JobApplicationStatus.CANCELLED]: { label: '취소', className: 'status-cancelled' },
};

interface TurnOversIntegrationProps {
  onSelectTurnOver?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreate?: () => void;
  isLoading?: boolean;
}

const TurnOversIntegration: React.FC<TurnOversIntegrationProps> = ({ onSelectTurnOver, onCreate }) => {
  const isDemo = useIsDemo();
  const { turnOvers: liveTurnOvers, isLoading, refreshTurnOvers } = useTurnOver();
  const { showNotification } = useNotification();
  const [showLoginModal, setShowLoginModal] = useState(false);
  // 로딩 중일 때 이전 데이터를 유지하여 깜빡임 방지
  const [stableTurnOvers, setStableTurnOvers] = useState<TurnOverDetail[]>(liveTurnOvers);
  // 낙관적 업데이트로 체크된 아이템 ID 추적
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  if (!isLoading && liveTurnOvers !== stableTurnOvers) {
    setStableTurnOvers(liveTurnOvers);
  }
  const turnOvers = isLoading && stableTurnOvers.length > 0 ? stableTurnOvers : liveTurnOvers;

  // 체크리스트 체크 핸들러
  const handleCheckItem = useCallback(async (item: CheckList) => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    if (!item.id) return;

    // 낙관적 업데이트
    setCheckedIds(prev => new Set(prev).add(item.id));

    try {
      const request: CheckListCheckedUpdateRequest = {
        id: item.id,
        checked: true,
      };
      const response = await fetch('/api/check-lists/checked', {
        method: HttpMethod.PUT,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        refreshTurnOvers();
      } else {
        setCheckedIds(prev => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
        showNotification('체크리스트 업데이트에 실패했습니다.', 'error');
      }
    } catch {
      setCheckedIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      showNotification('체크리스트 업데이트 중 오류가 발생했습니다.', 'error');
    }
  }, [refreshTurnOvers, showNotification]);

  // 지원 현황 통계
  const applicationStats = useMemo(() => {
    const allApps = turnOvers.flatMap(t => t.turnOverChallenge?.jobApplications || []);
    const counts: Record<number, number> = {};
    allApps.forEach(a => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return { total: allApps.length, counts };
  }, [turnOvers]);

  // 최근 지원 회사 (전체 이직 활동에서 최근 5개)
  const recentApplications = useMemo(() => {
    return turnOvers
      .flatMap(t =>
        (t.turnOverChallenge?.jobApplications || []).map(a => ({
          ...a,
          turnOverName: t.name,
          turnOverId: t.id,
        }))
      )
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, 5);
  }, [turnOvers]);

  // 다음 할 일 (미완료 체크리스트, 낙관적 업데이트 반영)
  const pendingChecklist = useMemo(() => {
    return turnOvers
      .flatMap(t =>
        (t.turnOverGoal?.checkList || [])
          .filter(c => !c.checked && !checkedIds.has(c.id))
          .map(c => ({
            ...c,
            turnOverName: t.name,
            turnOverId: t.id,
          }))
      )
      .slice(0, 5);
  }, [turnOvers, checkedIds]);

  // 상황별 추천 액션
  const recommendations = useMemo(() => {
    const items: { label: string; desc: string; action: () => void }[] = [];

    if (turnOvers.length === 0) {
      items.push({ label: '이직 이력서 추가', desc: '이직 활동을 기록해 보세요', action: () => onCreate?.() });
      return items;
    }

    // 목표 미작성 이력서
    const noGoal = turnOvers.find(t => !t.turnOverGoal?.reason && !t.turnOverGoal?.goal);
    if (noGoal) {
      items.push({ label: '이직 목표 설정', desc: `${noGoal.name || '이력서'}의 목표를 작성해 보세요`, action: () => onSelectTurnOver?.(noGoal.id) });
    }

    // 지원 회사 없는 이력서
    const noApps = turnOvers.find(t =>
      (t.turnOverGoal?.reason || t.turnOverGoal?.goal) &&
      (!t.turnOverChallenge?.jobApplications || t.turnOverChallenge.jobApplications.length === 0)
    );
    if (noApps) {
      items.push({ label: '지원 회사 추가', desc: `${noApps.name || '이력서'}에 지원 현황을 기록해 보세요`, action: () => onSelectTurnOver?.(noApps.id) });
    }

    // 합격했는데 회고 미작성
    const passedNoRetro = turnOvers.find(t =>
      t.turnOverChallenge?.jobApplications?.some(a => a.status === JobApplication_JobApplicationStatus.PASSED) &&
      (!t.turnOverRetrospective?.name || t.turnOverRetrospective.name === '')
    );
    if (passedNoRetro) {
      items.push({ label: '이직 회고 작성', desc: '합격을 축하해요! 회고를 남겨보세요', action: () => onSelectTurnOver?.(passedNoRetro.id) });
    }

    // 회고는 있지만 만족도 미입력
    const noScore = turnOvers.find(t =>
      t.turnOverRetrospective?.name && t.turnOverRetrospective.name !== '' && !t.turnOverRetrospective.score
    );
    if (noScore) {
      items.push({ label: '만족도 평가', desc: `${noScore.turnOverRetrospective!.name}의 만족도를 평가해 보세요`, action: () => onSelectTurnOver?.(noScore.id) });
    }

    // 체크리스트 미완료 항목
    const unchecked = turnOvers.find(t =>
      t.turnOverGoal?.checkList?.some(c => !c.checked)
    );
    if (unchecked) {
      const remaining = unchecked.turnOverGoal!.checkList!.filter(c => !c.checked).length;
      items.push({ label: '체크리스트 완료', desc: `${remaining}개 항목이 남아있어요`, action: () => onSelectTurnOver?.(unchecked.id) });
    }

    return items;
  }, [turnOvers, onCreate, onSelectTurnOver]);

  const hasData = turnOvers.length > 0;

  return (
    <div className="contents">
        <div className="page-title">
            <div>
                <h2>커리어 준비</h2>
            </div>
        </div>
        <div className="page-cont">
            {isDemo === true && (
                <DemoBanner
                    title="체계적인 이직 관리로 더 나은 커리어를"
                    description="샘플 데이터를 체험 중입니다. 로그인하면 나만의 이직 활동을 관리할 수 있어요."
                    features={["이직 활동 목표 설정 및 관리", "지원 회사별 진행 상황 추적", "이직 회고 및 성장 데이터 분석"]}
                />
            )}

            {/* 추천 액션 */}
            {isDemo === false && !isLoading && recommendations.length > 0 && (
                <div className="cont-box">
                    <div className="cont-tit">
                        <div>
                            <h3>추천</h3>
                        </div>
                    </div>
                    <ul className="quick-record-list">
                        {recommendations.map((rec, i) => (
                            <li key={i} onClick={rec.action}>
                                <p>{rec.label}</p>
                                <span>{rec.desc}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 진행 중인 이직 현황 */}
            {hasData && (
                <div className="cont-box">
                    <div className="cont-tit">
                        <div>
                            <h3>이직 현황</h3>
                            <p>{turnOvers.length}개</p>
                        </div>
                    </div>
                    <ul className="turnover-status-list">
                        {turnOvers.map(t => {
                            const progress = calculateTurnOverProgress(t);
                            const appCount = t.turnOverChallenge?.jobApplications?.length || 0;
                            const checkTotal = t.turnOverGoal?.checkList?.length || 0;
                            const checkDone = t.turnOverGoal?.checkList?.filter(c => c.checked).length || 0;
                            return (
                                <li key={t.id} onClick={() => onSelectTurnOver?.(t.id)}>
                                    <div className="turnover-status-header">
                                        <span className="turnover-status-name">{t.name || '이름 없음'}</span>
                                        <span className="turnover-status-percent">{progress}%</span>
                                    </div>
                                    <div className="career-resume-card-progress">
                                        <div className="career-completeness-bar">
                                            <div className="career-completeness-fill" style={{ width: `${progress}%` }} />
                                        </div>
                                    </div>
                                    <div className="turnover-status-meta">
                                        {appCount > 0 && <span>지원 {appCount}건</span>}
                                        {checkTotal > 0 && <span>체크리스트 {checkDone}/{checkTotal}</span>}
                                        {t.startedAt && <span>{dayjs(t.startedAt).format('YYYY.MM')}~</span>}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* 지원 현황 / 최근 지원 / 다음 할 일 - 3열 */}
            {(applicationStats.total > 0 || recentApplications.length > 0 || pendingChecklist.length > 0) && (
                <div className="dashboard-row-3col">
                    {/* 지원 현황 파이프라인 */}
                    <div className="cont-box">
                        <div className="cont-tit">
                            <div>
                                <h3>지원 현황</h3>
                                {applicationStats.total > 0 && <p>총 {applicationStats.total}건</p>}
                            </div>
                        </div>
                        {applicationStats.total > 0 ? (
                            <div className="turnover-pipeline">
                                {Object.entries(STATUS_LABELS).map(([statusKey, { label, className }]) => {
                                    const count = applicationStats.counts[Number(statusKey)] || 0;
                                    if (count === 0) return null;
                                    return (
                                        <div key={statusKey} className={`turnover-pipeline-item ${className}`}>
                                            <span className="turnover-pipeline-count">{count}</span>
                                            <span className="turnover-pipeline-label">{label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="empty-text">지원 내역이 없어요</p>
                        )}
                    </div>

                    {/* 최근 지원 회사 */}
                    <div className="cont-box">
                        <div className="cont-tit">
                            <div>
                                <h3>최근 지원</h3>
                            </div>
                        </div>
                        {recentApplications.length > 0 ? (
                            <ul className="summary-list turnover-summary">
                                {recentApplications.map(app => {
                                    const statusInfo = STATUS_LABELS[app.status] || { label: '알 수 없음', className: '' };
                                    return (
                                        <li key={app.id} onClick={() => onSelectTurnOver?.(app.turnOverId)}>
                                            <div className="turnover-app-row">
                                                <span className="turnover-app-name">{app.name || '회사명 없음'}</span>
                                                {app.position && <span className="turnover-app-position">{app.position}</span>}
                                            </div>
                                            <span className={`turnover-app-status ${statusInfo.className}`}>{statusInfo.label}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="empty-text">지원 내역이 없어요</p>
                        )}
                    </div>

                    {/* 다음 할 일 */}
                    <div className="cont-box">
                        <div className="cont-tit">
                            <div>
                                <h3>다음 할 일</h3>
                            </div>
                        </div>
                        {pendingChecklist.length > 0 ? (
                            <ul className="summary-list turnover-summary">
                                {pendingChecklist.map((item, index) => (
                                    <li key={item.id}>
                                        <div className="turnover-todo-row">
                                            <input
                                                id={`todo-check-${index}`}
                                                type="checkbox"
                                                checked={false}
                                                onChange={() => handleCheckItem(item)}
                                            />
                                            <label
                                                htmlFor={`todo-check-${index}`}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span
                                                className="turnover-todo-content"
                                                onClick={() => onSelectTurnOver?.(item.turnOverId)}
                                            >
                                                {item.content}
                                            </span>
                                        </div>
                                        <span
                                            className="turnover-todo-from"
                                            onClick={() => onSelectTurnOver?.(item.turnOverId)}
                                        >
                                            {item.turnOverName}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="empty-text">완료할 항목이 없어요</p>
                        )}
                    </div>
                </div>
            )}

        </div>
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default TurnOversIntegration;
