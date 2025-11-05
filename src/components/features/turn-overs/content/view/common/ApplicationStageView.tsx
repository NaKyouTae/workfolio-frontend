import React from 'react';
import { ApplicationStage, ApplicationStage_ApplicationStageStatus } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';
import styles from './ApplicationStageView.module.css';

interface ApplicationStageViewProps {
  applicationStages: ApplicationStage[];
  jobApplicationId: string;
}

const ApplicationStageView: React.FC<ApplicationStageViewProps> = ({ applicationStages, jobApplicationId }) => {
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
    <div className={styles.timeline}>
      {applicationStages.map((stage, index) => {
        const statusInfo = getStatusLabel(stage.status);
        return (
          <div key={stage.id || `stage-${jobApplicationId}-${index}`} className={styles.timelineItem}>
            <div className={styles.timelineNode}>
              <div className={`${styles.timelineDot} ${statusInfo.className}`} />
              {index < applicationStages.length - 1 && (
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
  );
};

export default ApplicationStageView;

