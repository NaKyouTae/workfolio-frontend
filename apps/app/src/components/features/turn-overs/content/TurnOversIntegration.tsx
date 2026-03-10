import React, { useMemo, useState } from 'react';
import { useTurnOver } from '@/hooks/useTurnOver';
import { TurnOverDetail, JobApplication_JobApplicationStatus, jobApplication_JobApplicationStatusFromJSON } from '@workfolio/shared/generated/common';
import styles from './TurnOversIntegration.module.css';
import { useIsDemo } from '@/hooks/useIsDemo';
import DemoBanner from '@/components/features/records/dashboard/DemoBanner';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface TurnOversIntegrationProps {
  onSelectTurnOver?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreate?: () => void;
  isLoading?: boolean;
}

const RECENT_APPLICATIONS_LIMIT = 5;

const formatSalary = (salary: number): string => {
  if (salary >= 10000) {
    const uk = Math.floor(salary / 10000);
    const remainder = salary % 10000;
    if (remainder === 0) return `${uk}억`;
    return `${uk}억 ${remainder.toLocaleString()}만`;
  }
  return `${salary.toLocaleString()}만`;
};

const formatRelativeTime = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  if (weeks < 5) return `${weeks}주 전`;
  return `${months}개월 전`;
};

const normalizeStatus = (status: JobApplication_JobApplicationStatus | string): JobApplication_JobApplicationStatus =>
  typeof status === 'string' ? jobApplication_JobApplicationStatusFromJSON(status) : status;

const getJobStatusLabel = (status: JobApplication_JobApplicationStatus | string): { label: string; className: string } => {
  switch (normalizeStatus(status)) {
    case JobApplication_JobApplicationStatus.PENDING:
      return { label: '서류 대기', className: 'statusPending' };
    case JobApplication_JobApplicationStatus.RUNNING:
      return { label: '진행 중', className: 'statusRunning' };
    case JobApplication_JobApplicationStatus.PASSED:
      return { label: '최종 합격', className: 'statusPassed' };
    case JobApplication_JobApplicationStatus.FAILED:
      return { label: '불합격', className: 'statusFailed' };
    case JobApplication_JobApplicationStatus.CANCELLED:
      return { label: '포기', className: 'statusCancelled' };
    default:
      return { label: '대기', className: 'statusPending' };
  }
};

const TurnOversIntegration: React.FC<TurnOversIntegrationProps> = ({ onSelectTurnOver, onCreate }) => {
  const isDemo = useIsDemo();
  const { turnOvers: liveTurnOvers, isLoading } = useTurnOver();
  // 로딩 중일 때 이전 데이터를 유지하여 깜빡임 방지
  const [stableTurnOvers, setStableTurnOvers] = useState<TurnOverDetail[]>(liveTurnOvers);
  if (!isLoading && liveTurnOvers !== stableTurnOvers) {
    setStableTurnOvers(liveTurnOvers);
  }
  const turnOvers = isLoading && stableTurnOvers.length > 0 ? stableTurnOvers : liveTurnOvers;

  // 통계 계산
  const statistics = useMemo(() => {
    const completedTurnOvers = turnOvers.filter(
      turnOver => turnOver.turnOverRetrospective?.name && turnOver.turnOverRetrospective.name !== ''
    );
    const ongoingTurnOvers = turnOvers.filter(
      turnOver => !turnOver.turnOverRetrospective?.name || turnOver.turnOverRetrospective.name === ''
    );

    let avgDuration = { months: 0, days: 0 };
    if (completedTurnOvers.length > 0) {
      const totalDays = completedTurnOvers.reduce((sum, turnOver) => {
        if (turnOver.turnOverChallenge?.jobApplications &&
            turnOver.turnOverChallenge.jobApplications.length > 0) {
          const apps = turnOver.turnOverChallenge.jobApplications;
          const firstApp = apps.reduce((earliest, app) =>
            (!earliest.startedAt || (app.startedAt && app.startedAt < earliest.startedAt))
              ? app : earliest
          , apps[0]);

          const lastApp = apps.reduce((latest, app) =>
            (!latest.endedAt || (app.endedAt && app.endedAt > latest.endedAt))
              ? app : latest
          , apps[0]);

          if (firstApp.startedAt && lastApp.endedAt) {
            const durationDays = (lastApp.endedAt - firstApp.startedAt) / (1000 * 60 * 60 * 24);
            return sum + durationDays;
          }
        }
        return sum;
      }, 0);

      const avgDays = totalDays / completedTurnOvers.length;
      avgDuration = {
        months: Math.floor(avgDays / 30),
        days: Math.round(avgDays % 30)
      };
    }

    const avgApplications = turnOvers.length > 0
      ? turnOvers.map(t => t.turnOverChallenge?.jobApplications.length ?? 0).reduce((s, l) => s + l, 0) / turnOvers.length
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

    return { total: turnOvers.length, completed: completedTurnOvers.length, ongoing: ongoingTurnOvers.length, avgDuration, avgApplications, avgSalaryIncreaseRate };
  }, [turnOvers]);

  // 지원 현황 집계
  const applicationStats = useMemo(() => {
    let total = 0, pending = 0, running = 0, passed = 0, failed = 0, cancelled = 0;
    turnOvers.forEach(t => {
      const apps = t.turnOverChallenge?.jobApplications ?? [];
      total += apps.length;
      apps.forEach(app => {
        switch (normalizeStatus(app.status)) {
          case JobApplication_JobApplicationStatus.RUNNING: running++; break;
          case JobApplication_JobApplicationStatus.PASSED: passed++; break;
          case JobApplication_JobApplicationStatus.FAILED: failed++; break;
          case JobApplication_JobApplicationStatus.CANCELLED: cancelled++; break;
          default: pending++; break;
        }
      });
    });
    const documentPassRate = total > 0 ? ((passed + running) / total * 100) : 0;
    const finalPassRate = total > 0 ? (passed / total * 100) : 0;
    return { total, pending, running, passed, failed, cancelled, documentPassRate, finalPassRate };
  }, [turnOvers]);

  // 최근 지원 회사 목록
  const recentApplications = useMemo(() => {
    const allApps: { name: string; status: JobApplication_JobApplicationStatus; timestamp: number; turnOverId: string }[] = [];
    turnOvers.forEach(t => {
      (t.turnOverChallenge?.jobApplications ?? []).forEach(app => {
        allApps.push({
          name: app.name || '(회사명 없음)',
          status: app.status,
          timestamp: app.updatedAt || app.createdAt || t.updatedAt || 0,
          turnOverId: t.id,
        });
      });
    });
    return allApps
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, RECENT_APPLICATIONS_LIMIT);
  }, [turnOvers]);

  // 이직 만족도 비교
  const satisfactionData = useMemo(() => {
    const completed = turnOvers.filter(
      t => t.turnOverRetrospective?.name && t.turnOverRetrospective.name !== ''
    );
    if (completed.length === 0) return null;

    const items = completed
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
      .map(t => ({
        id: t.id,
        name: t.turnOverRetrospective!.name,
        score: t.turnOverRetrospective!.score || 0,
      }));

    const avgScore = items.reduce((sum, item) => sum + item.score, 0) / items.length;

    return { items, avgScore };
  }, [turnOvers]);

  // 연봉 변화 추이 데이터
  const salaryTrend = useMemo(() => {
    const completedWithSalary = turnOvers
      .filter(t => t.turnOverRetrospective?.salary && t.turnOverRetrospective.salary > 0)
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    const points = completedWithSalary.map((t, i) => ({
      label: t.turnOverRetrospective?.name || t.name || `${i + 1}차`,
      salary: t.turnOverRetrospective!.salary,
    }));
    if (points.length > 0) {
      return [{ label: '시작', salary: 0 }, ...points];
    }
    return points;
  }, [turnOvers]);

  // 최근 연봉 & 변동
  const latestSalary = salaryTrend.length > 0 ? salaryTrend[salaryTrend.length - 1].salary : 0;
  const salaryChange = salaryTrend.length >= 2
    ? salaryTrend[salaryTrend.length - 1].salary - salaryTrend[salaryTrend.length - 2].salary
    : 0;

  // 지원 현황 바 차트 최대값
  const applicationBarMax = Math.max(applicationStats.pending, applicationStats.running, applicationStats.passed, applicationStats.failed, applicationStats.cancelled, 1);

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
      t.turnOverChallenge?.jobApplications?.some(a => normalizeStatus(a.status) === JobApplication_JobApplicationStatus.PASSED) &&
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

  // 별점 렌더링
  const renderStars = (score: number) => {
    const maxStars = 5;
    return (
      <span className={styles.stars}>
        {Array.from({ length: maxStars }, (_, i) => (
          <span key={i} className={i < Math.round(score) ? styles.starFilled : styles.starEmpty}>★</span>
        ))}
      </span>
    );
  };

  return (
    <div className="contents">
        <div className="page-title">
            <div>
                <h2>내 이직 관리</h2>
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

            {/* 핵심 통계 4개 */}
            <div className="cont-box">
                <div className="cont-tit">
                    <div>
                        <h3>내 이직 현황</h3>
                    </div>
                </div>
                <ul className={`stats-summary ${styles.statsSummary4}`}>
                    <li>
                        <p>총 이직 횟수</p>
                        <div>
                          {statistics.total}<span>회</span>
                          {statistics.total > 0 && (
                            <span className={styles.statSub}>
                              (완료 {statistics.completed} / 진행 {statistics.ongoing})
                            </span>
                          )}
                        </div>
                    </li>
                    <li>
                        <p>평균 이직 기간</p>
                        <div>
                          {statistics.avgDuration.months > 0 && `${statistics.avgDuration.months}개월 `}
                          {statistics.avgDuration.days > 0 && `${statistics.avgDuration.days}일`}
                          {statistics.avgDuration.months === 0 && statistics.avgDuration.days === 0 && '0일'}
                        </div>
                    </li>
                    <li>
                        <p>평균 지원 회사</p>
                        <div>{statistics.avgApplications.toFixed(1)}<span>개</span></div>
                    </li>
                    <li>
                        <p>평균 연봉 상승률</p>
                        <div>
                          {statistics.avgSalaryIncreaseRate > 0 && <span className={styles.salaryUp}>&#9650;</span>}
                          {statistics.avgSalaryIncreaseRate < 0 && <span className={styles.salaryDown}>&#9660;</span>}
                          {statistics.avgSalaryIncreaseRate.toFixed(1)}<span>%</span>
                        </div>
                    </li>
                </ul>
            </div>

            {/* 연봉 변화 추이 */}
            <div className={`cont-box ${styles.salarySection}`}>
                <div className="cont-tit">
                    <div>
                        <h3>연봉 변화 추이</h3>
                    </div>
                </div>
                <ul className={styles.salaryMetrics}>
                    <li>
                        <span>최근 연봉</span>
                        <strong>{latestSalary > 0 ? `${formatSalary(latestSalary)}원` : '0원'}</strong>
                    </li>
                    <li>
                        <span>연봉 변동</span>
                        <strong className={salaryChange > 0 ? styles.salaryUp : salaryChange < 0 ? styles.salaryDown : ''}>
                            {salaryChange > 0 && '+'}{salaryChange !== 0 ? `${formatSalary(Math.abs(salaryChange))}원` : '0원'}
                        </strong>
                    </li>
                </ul>
                <div className={styles.salaryChart}>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart
                            data={salaryTrend.length >= 2 ? salaryTrend : [{ label: '', salary: 0 }]}
                            margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--gray002)" />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 12, fill: 'var(--gray005)' }}
                                axisLine={{ stroke: 'var(--gray003)' }}
                                tickLine={false}
                            />
                            <YAxis
                                tickFormatter={(v: number) => `${v.toLocaleString()}만`}
                                tick={{ fontSize: 12, fill: 'var(--gray005)' }}
                                axisLine={false}
                                tickLine={false}
                                width={80}
                            />
                            <Tooltip
                                formatter={(value) => [`${formatSalary(Number(value))}원`, '연봉']}
                                contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid var(--gray003)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="salary"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 지원 현황 + 최근 지원 회사 + 이직 만족도 */}
            <div className={styles.dashboardRow3}>
                {/* 지원 현황 차트 */}
                <div className="cont-box">
                    <div className="cont-tit">
                        <div>
                            <h3>지원 현황</h3>
                            <p>{applicationStats.total}개</p>
                        </div>
                    </div>
                    <ul className={styles.applicationStats}>
                        {[
                          { label: '대기 중', count: applicationStats.pending, color: 'var(--gray004)' },
                          { label: '진행 중', count: applicationStats.running, color: 'var(--yellow004)' },
                          { label: '최종 합격', count: applicationStats.passed, color: '#22c55e' },
                          { label: '불합격', count: applicationStats.failed, color: '#ef4444' },
                          { label: '포기', count: applicationStats.cancelled, color: 'var(--gray003)' },
                        ].map(item => (
                            <li key={item.label}>
                                <span className={styles.applicationStatsLabel}>{item.label}</span>
                                <div className={styles.applicationStatsBar}>
                                    <div
                                        className={styles.applicationStatsFill}
                                        style={{
                                          width: `${applicationBarMax > 0 ? (item.count / applicationBarMax) * 100 : 0}%`,
                                          backgroundColor: item.color,
                                        }}
                                    />
                                </div>
                                <span className={styles.applicationStatsCount}>{item.count}개</span>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.passRates}>
                        <div>
                            <span>서류 통과율</span>
                            <strong>{applicationStats.documentPassRate.toFixed(0)}%</strong>
                        </div>
                        <div>
                            <span>최종 합격률</span>
                            <strong>{applicationStats.finalPassRate.toFixed(0)}%</strong>
                        </div>
                    </div>
                </div>

                {/* 최근 지원 회사 */}
                <div className="cont-box">
                    <div className="cont-tit">
                        <div>
                            <h3>최근 지원 회사</h3>
                            <p>{recentApplications.length}건</p>
                        </div>
                    </div>
                    {recentApplications.length === 0 ? (
                        <ul className={styles.recentApps}>
                            <li className={styles.recentAppEmpty}>지원 내역이 없습니다</li>
                        </ul>
                    ) : (
                        <ul className={`${styles.recentApps} ${styles.scrollBody}`}>
                            {recentApplications.map((app, index) => {
                                const statusInfo = getJobStatusLabel(app.status);
                                return (
                                    <li
                                      key={`${app.turnOverId}-${index}`}
                                      className={styles.recentAppItem}
                                      onClick={() => onSelectTurnOver?.(app.turnOverId)}
                                    >
                                        <div className={styles.recentAppInfo}>
                                            <span className={styles.recentAppName}>{app.name}</span>
                                            <span className={`${styles.recentAppStatus} ${styles[statusInfo.className]}`}>
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                        <span className={styles.recentAppTime}>{formatRelativeTime(app.timestamp)}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* 이직 만족도 */}
                <div className="cont-box">
                    <div className="cont-tit">
                        <div>
                            <h3>이직 만족도</h3>
                        </div>
                    </div>
                    {satisfactionData && satisfactionData.items.length > 0 ? (
                        <ul className={`${styles.satisfactionList} ${styles.scrollBody}`}>
                            {satisfactionData.items.map(item => (
                                <li
                                  key={item.id}
                                  className={styles.satisfactionItem}
                                  onClick={() => onSelectTurnOver?.(item.id)}
                                >
                                    <span className={styles.satisfactionName}>{item.name}</span>
                                    <div className={styles.satisfactionScore}>
                                        {renderStars(item.score)}
                                        <span className={styles.satisfactionScoreNum}>{item.score.toFixed(1)}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.emptyText}>작성된 만족도가 없습니다</p>
                    )}
                    <div className={styles.satisfactionAvg}>
                        <span>평균 만족도</span>
                        <div className={styles.satisfactionAvgValue}>
                            {renderStars(satisfactionData?.avgScore ?? 0)}
                            <strong>{(satisfactionData?.avgScore ?? 0).toFixed(1)}점</strong>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default TurnOversIntegration;
