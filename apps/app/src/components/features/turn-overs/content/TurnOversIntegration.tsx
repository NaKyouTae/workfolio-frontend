import React, { useMemo, useState } from 'react';
import { useTurnOver } from '@/hooks/useTurnOver';
import { TurnOverDetail, ApplicationStage_ApplicationStageStatus, JobApplication_JobApplicationStatus } from '@workfolio/shared/generated/common';
import styles from './TurnOversIntegration.module.css';
import Dropdown from '@workfolio/shared/ui/Dropdown';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import LoginModal from '@workfolio/shared/ui/LoginModal';
import EmptyState from '@workfolio/shared/ui/EmptyState';
import SummaryListSkeleton from '@workfolio/shared/ui/skeleton/SummaryListSkeleton';
import StatsSummarySkeleton from '@workfolio/shared/ui/skeleton/StatsSummarySkeleton';

interface TurnOversIntegrationProps {
  onSelectTurnOver?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

const TurnOversIntegration: React.FC<TurnOversIntegrationProps> = ({ onSelectTurnOver, onEdit, onDuplicate, onDelete, isLoading: externalIsLoading = false }) => {
  const { turnOvers, isLoading: internalIsLoading } = useTurnOver();
  const isLoading = externalIsLoading || internalIsLoading;
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');
  const [showLoginModal, setShowLoginModal] = useState(false);

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
    // 평균 이직 기간 계산 (완료된 이직 활동만)
    const completedTurnOvers = turnOvers.filter(
      turnOver => turnOver.turnOverRetrospective
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
      ? turnOvers.map(turnOver => turnOver.turnOverChallenge?.jobApplications.length ?? 0).reduce((sum, length) => sum + length, 0) / turnOvers.length 
      : 0;
    
    // 연봉 상승률 계산: 이전 이직 활동의 최종 연봉을 이전 연봉으로 사용
    let avgSalaryIncreaseRate = 0;
    if (completedTurnOvers.length > 1) {
      // createdAt 기준으로 정렬하여 시간순으로 비교
      const sortedTurnOvers = [...completedTurnOvers].sort((a, b) => 
        (a.createdAt || 0) - (b.createdAt || 0)
      );
      
      const increaseRates: number[] = [];
      
      for (let i = 1; i < sortedTurnOvers.length; i++) {
        const currentTurnOver = sortedTurnOvers[i];
        const previousTurnOver = sortedTurnOvers[i - 1];
        
        const currentSalary = currentTurnOver.turnOverRetrospective?.salary ?? 0;
        const previousSalary = previousTurnOver.turnOverRetrospective?.salary ?? 0;
        
        // 이전 연봉이 0보다 크고 현재 연봉도 0보다 큰 경우만 계산
        if (previousSalary > 0 && currentSalary > 0) {
          const increaseRate = ((currentSalary - previousSalary) / previousSalary) * 100;
          increaseRates.push(increaseRate);
        }
      }
      
      if (increaseRates.length > 0) {
        avgSalaryIncreaseRate = increaseRates.reduce((sum, rate) => sum + rate, 0) / increaseRates.length;
      }
    }
    
    return {
      avgDuration,
      avgApplications,
      avgSalaryIncreaseRate
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
                {isLoading ? (
                    <StatsSummarySkeleton count={3} />
                ) : (
                    <ul className="stats-summary">
                        <li key="avgDuration">
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
                            <div>{statistics.avgSalaryIncreaseRate.toFixed(1)}<span>%</span></div>
                        </li>
                    </ul>
                )}
            </div>
            <div className="cont-box">
                <div className="cont-tit">
                    <div>
                        <h3>전체 이직 활동</h3>
                        <p>{turnOvers.length}개</p>
                    </div>
                    <div>
                        <Dropdown
                            options={[
                                { value: 'recent', label: '최근 수정일 순' },
                                { value: 'oldest', label: '오래된 순' },
                            ]}
                            selectedOption={sortOrder}
                            setValue={(value) => setSortOrder(value as 'recent' | 'oldest')}
                        />
                    </div>
                </div>
                {isLoading ? (
                    <SummaryListSkeleton count={3} />
                ) : sortedTurnOvers.length === 0 ? (
                    <EmptyState text="등록된 이직 활동이 없습니다." />
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
                                            if (!isLoggedIn()) {
                                                setShowLoginModal(true);
                                                return;
                                            }
                                            onEdit?.(turnOver.id);
                                        }}
                                        >
                                            편집
                                        </li>
                                        <li
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isLoggedIn()) {
                                                setShowLoginModal(true);
                                                return;
                                            }
                                            onDuplicate?.(turnOver.id);
                                        }}
                                        >
                                            복제
                                        </li>
                                        <li
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isLoggedIn()) {
                                                setShowLoginModal(true);
                                                return;
                                            }
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
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default TurnOversIntegration;

