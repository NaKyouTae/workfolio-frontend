import React, { useMemo, useState } from 'react';
import { useTurnOver } from '@/hooks/useTurnOver';
import { TurnOverDetail, ApplicationStage_ApplicationStageStatus, JobApplication_JobApplicationStatus } from '@/generated/common';
import styles from './TurnOversIntegration.module.css';

interface TurnOversIntegrationProps {
  onSelectTurnOver?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TurnOversIntegration: React.FC<TurnOversIntegrationProps> = ({ onSelectTurnOver, onEdit, onDuplicate, onDelete }) => {
  const { turnOvers, isLoading } = useTurnOver();
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

  // ApplicationStage 상태 레이블 변환
  const getStatusLabel = (status: ApplicationStage_ApplicationStageStatus) => {
    switch (status) {
      case ApplicationStage_ApplicationStageStatus.PASSED:
        return '합격';
      case ApplicationStage_ApplicationStageStatus.FAILED:
        return '불합격';
      case ApplicationStage_ApplicationStageStatus.PENDING:
        return '대기';
      case ApplicationStage_ApplicationStageStatus.SCHEDULED:
        return '예정';
      default:
        return '진행 중';
    }
  };

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

  // 정렬된 이직 활동 목록
  const sortedTurnOvers = useMemo(() => {
    return [...turnOvers].sort((a, b) => {
      if (sortOrder === 'recent') {
        // 최근 수정일 순 (updatedAt 내림차순)
        return (b.updatedAt || 0) - (a.updatedAt || 0);
      } else {
        // 오래된 순 (createdAt 오름차순)
        return (a.createdAt || 0) - (b.createdAt || 0);
      }
    });
  }, [turnOvers, sortOrder]);

  // 이직 활동 상태 계산
  const getTurnOverStatus = (turnOver: TurnOverDetail) => {
    if (turnOver.turnOverRetrospective?.name && turnOver.turnOverRetrospective.name !== '') {
      return { label: '완료', className: styles.statusCompleted };
    }
    return { label: '진행 중', className: styles.statusOngoing };
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="contents">
        <div className="page-title">
            <div>
                <h2>내 이직 관리</h2>
            </div>
        </div>
        <div className="page-cont">
            <div className="cont-box">
                <div className="cont-tit">
                    <div>
                        <h3>내 이직 현황</h3>
                    </div>
                </div>
                <ul className="stats-summary">
                    <li>
                        <p>전체 이직 활동</p>
                        <div>{statistics.totalTurnOvers}<span>개</span></div>
                    </li>
                    <li>
                        <p>진행 중인 지원</p>
                        <div>{statistics.ongoingApplications}<span>개</span></div>
                    </li>
                    <li>
                        <p>평균 이직 기간</p>
                        <div>{statistics.avgDuration}<span>개월</span></div>
                    </li>
                </ul>
            </div>
            <div className="cont-box">
                <div className="cont-tit">
                    <div>
                        <h3>전체 이직 활동</h3>
                        <p>{turnOvers.length}개</p>
                    </div>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'recent' | 'oldest')}
                    >
                        <option value="recent">최근 수정일 순</option>
                        <option value="oldest">오래된 순</option>
                    </select>
                </div>
                {sortedTurnOvers.length === 0 ? (
                    <div className="empty">
                        <p>등록된 이직 활동이 없습니다.</p>
                    </div>
                ) : (
                    <ul className="summary-list">
                    {sortedTurnOvers.map((turnOver) => {
                        const status = getTurnOverStatus(turnOver);

                        return (
                        <li key={turnOver.id} onClick={() => onSelectTurnOver?.(turnOver.id)}>
                            <div className="info">
                                <div>
                                    <div>
                                        <p>{turnOver.name}</p>
                                    </div>
                                    <ul>
                                        <li><span className={`label ${status.className}`}>{status.label}</span></li>
                                        <li
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit?.(turnOver.id);
                                        }}
                                        >
                                            편집
                                        </li>
                                        <li
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDuplicate?.(turnOver.id);
                                        }}
                                        >
                                            복제
                                        </li>
                                        <li
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete?.(turnOver.id);
                                        }}
                                        >
                                            삭제
                                        </li>
                                    </ul>
                                </div>
                                <ul>
                                     <li>총 지원 회사 {turnOver.turnOverChallenge?.jobApplications.length ?? 0}개</li>
                                     <li>만족도 평가 {turnOver.turnOverRetrospective?.score ?? 0}점</li>
                                     <li>진행 중 회사 {turnOver.turnOverChallenge?.jobApplications.filter(app => 
                                       app.status === JobApplication_JobApplicationStatus.PENDING).length ?? 0}개</li>
                                     <li>최종 합격 회사 {turnOver.turnOverChallenge?.jobApplications.filter(app => app.status === JobApplication_JobApplicationStatus.PASSED).length ?? 0}개</li>
                                </ul>
                            </div>
                            <div className="desc">
                                {turnOver.turnOverGoal && !turnOver.turnOverRetrospective && (
                                    <ul>
                                        <li><p>이직 목표</p><span>{turnOver.turnOverGoal.goal || '-'}</span></li>
                                        {
                                          turnOver.turnOverChallenge && turnOver.turnOverChallenge.jobApplications.length > 0 && (() => {
                                            const lastApplication = turnOver.turnOverChallenge.jobApplications[turnOver.turnOverChallenge.jobApplications.length - 1];
                                            const hasStages = lastApplication?.applicationStages && lastApplication.applicationStages.length > 0;
                                            const lastStage = hasStages ? lastApplication.applicationStages[lastApplication.applicationStages.length - 1] : null;
                                            
                                            // 안전하게 문자열로 변환
                                            const companyName = String(lastApplication?.name || '지원 회사');
                                            const stageName = lastStage ? String(lastStage.name || '진행 단계') : null;
                                            const statusLabel = lastStage ? getStatusLabel(lastStage.status) : null;
                                            
                                            return (
                                              <li>
                                                <p>최근 기록</p>
                                                <span>
                                                  {companyName}
                                                  {stageName && statusLabel ? ` - ${stageName} (${statusLabel})` : ''}
                                                </span>
                                              </li>
                                            );
                                          })()
                                        }
                                    </ul>
                                )}

                                {turnOver.turnOverRetrospective && (
                                    <ul>
                                        <li><p>최종 선택</p><span>{turnOver.turnOverRetrospective.name || '-'}</span></li>
                                        <li><p>이직 회고</p><span>{turnOver.turnOverRetrospective.reason || '-'}</span></li>
                                    </ul>
                                )}
                            </div>
                        </li>
                        );
                    })}
                    </ul>
                )}
            </div>
        </div>
    </div>
  );
};

export default TurnOversIntegration;

