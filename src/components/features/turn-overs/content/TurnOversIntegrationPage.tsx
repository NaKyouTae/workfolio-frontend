import React, { useMemo } from 'react';
import { useTurnOver } from '@/hooks/useTurnOver';
import { TurnOverDetail } from '@/generated/common';
import styles from './TurnOversIntegrationPage.module.css';

interface TurnOversIntegrationPageProps {
  onSelectTurnOver?: (id: string) => void;
}

const TurnOversIntegrationPage: React.FC<TurnOversIntegrationPageProps> = ({ onSelectTurnOver }) => {
  const { turnOvers, isLoading } = useTurnOver();

  // 통계 계산
  const statistics = useMemo(() => {
    const totalTurnOvers = turnOvers.length;
    
    // 진행 중인 지원 수 계산
    let ongoingApplications = 0;
    turnOvers.forEach(turnOver => {
      if (turnOver.turnOverChallenge?.jobApplications) {
        turnOver.turnOverChallenge.jobApplications.forEach(app => {
          // 진행 중인 지원인지 확인 (endedAt이 없거나 미래인 경우)
          if (!app.endedAt || app.endedAt > Date.now()) {
            ongoingApplications++;
          }
        });
      }
    });

    // 평균 이직 기간 계산 (완료된 이직 활동만)
    const completedTurnOvers = turnOvers.filter(
      turnOver => turnOver.turnOverRetrospective
    );
    
    let avgDuration = 0;
    if (completedTurnOvers.length > 0) {
      const totalMonths = completedTurnOvers.reduce((sum, turnOver) => {
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
            const duration = (lastApp.endedAt - firstApp.startedAt) / (1000 * 60 * 60 * 24 * 30);
            return sum + duration;
          }
        }
        return sum;
      }, 0);
      
      avgDuration = Math.round(totalMonths / completedTurnOvers.length);
    }

    return {
      totalTurnOvers,
      ongoingApplications,
      avgDuration
    };
  }, [turnOvers]);

  // 정렬 (최근 순)
  const sortedTurnOvers = useMemo(() => {
    return [...turnOvers].sort((a, b) => b.createdAt - a.createdAt);
  }, [turnOvers]);

  // 이직 활동 상태 계산
  const getTurnOverStatus = (turnOver: TurnOverDetail) => {
    if (turnOver.turnOverRetrospective) {
      return { label: '완료', className: styles.statusCompleted };
    }
    return { label: '진행 중', className: styles.statusOngoing };
  };

  // 이직 활동 통계 계산
  const getTurnOverStats = (turnOver: TurnOverDetail) => {
    const jobApplications = turnOver.turnOverChallenge?.jobApplications || [];
    const totalApplications = jobApplications.length;
    
    const ongoingApps = jobApplications.filter(app => 
      !app.endedAt || app.endedAt > Date.now()
    ).length;
    
    const completedApps = totalApplications - ongoingApps;
    
    const acceptedApps = jobApplications.filter(app => 
      app.applicationStages?.some(stage => stage.status === 3) // ACCEPTED
    ).length;

    return {
      totalApplications,
      ongoingApps,
      completedApps,
      acceptedApps
    };
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월`;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>내 이직 관리</h1>
      </div>

      {/* 내 이직 현황 */}
      <section className={styles.statisticsSection}>
        <h2 className={styles.sectionTitle}>내 이직 현황</h2>
        <div className={styles.statisticsCards}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>전체 이직 활동</div>
            <div className={styles.statValue}>
              <span className={styles.statNumber}>{statistics.totalTurnOvers}</span>
              <span className={styles.statUnit}>개</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statLabel}>진행 중인 지원</div>
            <div className={styles.statValue}>
              <span className={styles.statNumber}>{statistics.ongoingApplications}</span>
              <span className={styles.statUnit}>개</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statLabel}>평균 이직 기간</div>
            <div className={styles.statValue}>
              <span className={styles.statNumber}>{statistics.avgDuration}</span>
              <span className={styles.statUnit}>개월</span>
            </div>
          </div>
        </div>
      </section>

      {/* 전체 이직 활동 */}
      <section className={styles.turnOversSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            전체 이직 활동 <span className={styles.count}>{turnOvers.length}개</span>
          </h2>
          <div className={styles.sortInfo}>최근 이직 순 ▼</div>
        </div>

        {sortedTurnOvers.length === 0 ? (
          <div className={styles.emptyState}>
            <p>등록된 이직 활동이 없습니다.</p>
          </div>
        ) : (
          <div className={styles.turnOversList}>
            {sortedTurnOvers.map((turnOver) => {
              const status = getTurnOverStatus(turnOver);
              const stats = getTurnOverStats(turnOver);

              return (
                <div 
                  key={turnOver.id} 
                  className={styles.turnOverCard}
                  onClick={() => onSelectTurnOver?.(turnOver.id)}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitleRow}>
                      <h3 className={styles.cardTitle}>{turnOver.name}</h3>
                      <span className={`${styles.statusBadge} ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className={styles.cardActions}>
                      <button className={styles.actionButton}>편집</button>
                      <button className={styles.actionButton}>복제</button>
                      <button className={styles.actionButton}>삭제</button>
                    </div>
                  </div>

                  <div className={styles.cardContent}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>총 지원 회사:</span>
                      <span className={styles.infoValue}>{stats.totalApplications}개</span>
                    </div>
                    
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>진행 중인 지원:</span>
                      <span className={styles.infoValue}>{stats.ongoingApps}개</span>
                    </div>
                    
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>만족도 평가 지원:</span>
                      <span className={styles.infoValue}>{stats.completedApps}개</span>
                    </div>
                    
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>최종 합격 회사:</span>
                      <span className={styles.infoValue}>{stats.acceptedApps}개</span>
                    </div>

                    {turnOver.turnOverGoal && (
                      <>
                        <div className={styles.divider} />
                        <div className={styles.goalSection}>
                          <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>이직 목표:</span>
                            <span className={styles.infoValue}>
                              {turnOver.turnOverGoal.goal || '-'}
                            </span>
                          </div>
                          <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>이직 원고:</span>
                            <span className={styles.infoValue}>
                              {turnOver.turnOverGoal.reason || '-'}
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {turnOver.turnOverRetrospective && (
                      <>
                        <div className={styles.divider} />
                        <div className={styles.retrospectiveSection}>
                          <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>최종 선택:</span>
                            <span className={styles.infoValue}>
                              {turnOver.turnOverRetrospective.name || '-'}
                            </span>
                          </div>
                          <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>입사일:</span>
                            <span className={styles.infoValue}>
                              {turnOver.turnOverRetrospective.joinedAt 
                                ? formatDate(turnOver.turnOverRetrospective.joinedAt)
                                : '-'}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.updateDate}>
                      최근 기록: {formatDate(turnOver.updatedAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default TurnOversIntegrationPage;

