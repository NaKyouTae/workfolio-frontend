import React from 'react';
import { TurnOverChallengeDetail, ApplicationStage_ApplicationStageStatus } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import DateUtil from '@/utils/DateUtil';
import styles from './TurnOverChallengeView.module.css';
import MemoView from './common/MemoView';
import AttachmentView from '@/components/features/common/AttachmentView';

interface TurnOverChallengeViewProps {
  turnOverChallenge: TurnOverChallengeDetail | null;
}

const TurnOverChallengeView: React.FC<TurnOverChallengeViewProps> = ({ turnOverChallenge }) => {
  if (!turnOverChallenge) {
    return (
      <div className={styles.emptyState}>
        <p>도전 정보가 없습니다.</p>
      </div>
    );
  }

  const getStatusLabel = (status: ApplicationStage_ApplicationStageStatus) => {
    switch (status) {
      case ApplicationStage_ApplicationStageStatus.PASSED:
        return { label: '합격', className: styles.statusPassed };
      case ApplicationStage_ApplicationStageStatus.FAILED:
        return { label: '불합격', className: styles.statusFailed };
      case ApplicationStage_ApplicationStageStatus.PENDING:
        return { label: '대기', className: styles.statusPending };
      case ApplicationStage_ApplicationStageStatus.SCHEDULED:
        return { label: '예정', className: styles.statusScheduled };
      case ApplicationStage_ApplicationStageStatus.CANCELLED:
        return { label: '취소', className: styles.statusCancelled };
      default:
        return { label: '-', className: '' };
    }
  };

  return (
    <div className={styles.container}>
      {/* 지원 기록 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>지원 기록</h2>
        </div>
        <div className={styles.sectionContent}>
          {turnOverChallenge.jobApplications && turnOverChallenge.jobApplications.length > 0 ? (
            <div className={styles.applicationsList}>
              {turnOverChallenge.jobApplications.map((app, appIndex) => (
                <div key={app.id || `app-${appIndex}`} className={styles.applicationCard}>
                  {/* 카드 헤더 */}
                  <div className={styles.cardHeader}>
                    <div className={styles.companyInfo}>
                      <h3 className={styles.companyName}>{app.name}</h3>
                      <div className={styles.positionInfo}>
                        <span className={styles.position}>{app.position}</span>
                        <button className={styles.detailButton}>상세보기 ↗</button>
                      </div>
                    </div>
                  </div>

                  {/* 직무 정보 */}
                  <div className={styles.jobInfo}>
                    <span className={styles.jobTitle}>{app.jobPostingTitle}</span>
                    {app.jobPostingUrl && (
                      <a 
                        href={app.jobPostingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.jobLink}
                      >
                        🔗
                      </a>
                    )}
                  </div>

                  {/* 지원 단계 타임라인 */}
                  {app.applicationStages && app.applicationStages.length > 0 && (
                    <div className={styles.timeline}>
                      {app.applicationStages.map((stage, index) => {
                        const statusInfo = getStatusLabel(stage.status);
                        return (
                          <div key={stage.id || `stage-${app.id}-${index}`} className={styles.timelineItem}>
                            <div className={styles.timelineNode}>
                              <div className={`${styles.timelineDot} ${statusInfo.className}`} />
                              {index < (app.applicationStages?.length || 0) - 1 && (
                                <div className={styles.timelineLine} />
                              )}
                            </div>
                            <div className={styles.timelineContent}>
                              <div className={styles.stageName}>{stage.name}</div>
                              <div className={styles.stageInfo}>
                                <span className={`${styles.statusBadge} ${statusInfo.className}`}>
                                  {statusInfo.label}
                                </span>
                                {stage.startedAt && (
                                  <span className={styles.stageDate}>
                                    {DateUtil.formatTimestamp(stage.startedAt, 'MM.DD')}
                                  </span>
                                )}
                              </div>
                              {stage.memo && (
                                <div className={styles.stageMemo}>{stage.memo}</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 추가 정보 */}
                  <div className={styles.additionalInfo}>
                    {(app.startedAt || app.endedAt) && (
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>모집 기간</span>
                        <span className={styles.infoValue}>
                          {app.startedAt && DateUtil.formatTimestamp(app.startedAt, 'YY.MM.DD')}
                          {app.startedAt && app.endedAt && ' - '}
                          {app.endedAt && DateUtil.formatTimestamp(app.endedAt, 'YY.MM.DD')}
                        </span>
                      </div>
                    )}
                    {app.applicationSource && (
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>지원 경로</span>
                        <span className={styles.infoValue}>{app.applicationSource}</span>
                      </div>
                    )}
                    {app.memo && (
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>메모</span>
                        <span className={styles.infoValue}>{app.memo}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="등록된 지원 기록이 없습니다." />
          )}
        </div>
      </div>

      {/* 메모 */}
      <MemoView memos={turnOverChallenge.memos || []} />

      {/* 첨부 */}
      <AttachmentView attachments={turnOverChallenge.attachments || []} />
    </div>
  );
};

export default TurnOverChallengeView;

