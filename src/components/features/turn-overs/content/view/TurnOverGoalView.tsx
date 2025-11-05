import React from 'react';
import { TurnOverGoalDetail } from '@/generated/common';
import styles from './TurnOverGoalView.module.css';
import MemoView from './common/MemoView';
import AttachmentView from '@/components/features/common/AttachmentView';
import SelfIntroductionView from './common/SelfIntroductionView';
import InterviewQuestionView from './common/InterviewQuestionView';
import CheckListView from './common/CheckListView';

interface TurnOverGoalViewProps {
  turnOverGoal: TurnOverGoalDetail | null;
}

const TurnOverGoalView: React.FC<TurnOverGoalViewProps> = ({ turnOverGoal }) => {
  if (!turnOverGoal) {
    return (
      <div className={styles.emptyState}>
        <p>목표 정보가 없습니다.</p>
      </div>
    );
  }
    
  return (
    <div className={styles.container}>
      {/* 이직 방향 설정 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            이직 방향 설정
            <span className={styles.helpIcon}>?</span>
          </h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.field}>
            <label className={styles.label}>이직 사유</label>
            <div className={styles.textContent}>
              {turnOverGoal.reason || '-'}
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>이직 목표</label>
            <div className={styles.textContent}>
              {turnOverGoal.goal || '-'}
            </div>
          </div>
        </div>
      </div>

      {/* 공통 자기소개서 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>공통 자기소개서</h2>
        </div>
        <div className={styles.sectionContent}>
          <SelfIntroductionView selfIntroductions={turnOverGoal.selfIntroductions || []} />
        </div>
      </div>

      {/* 면접 예상 질문 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>면접 예상 질문</h2>
        </div>
        <div className={styles.sectionContent}>
          <InterviewQuestionView interviewQuestions={turnOverGoal.interviewQuestions || []} />
        </div>
      </div>

      {/* 메모 */}
      <MemoView memos={turnOverGoal.memos || []} />

      {/* 체크리스트 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>체크리스트</h2>
        </div>
        <div className={styles.sectionContent}>
          <CheckListView checkList={turnOverGoal.checkList || []} />
        </div>
      </div>

      {/* 첨부 */}
      <AttachmentView attachments={turnOverGoal.attachments || []} />
    </div>
  );
};

export default TurnOverGoalView;

