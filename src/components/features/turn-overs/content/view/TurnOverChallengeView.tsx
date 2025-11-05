import React from 'react';
import { TurnOverChallengeDetail } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import styles from './TurnOverChallengeView.module.css';
import MemoView from './common/MemoView';
import AttachmentView from '@/components/features/common/AttachmentView';
import JobApplicationView from './common/JobApplicationView';

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
                <JobApplicationView 
                  key={app.id || `app-${appIndex}`}
                  jobApplication={app}
                />
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

