import React from 'react';
import { TurnOverGoalDetail } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import styles from './TurnOverGoalView.module.css';
import MemoView from './common/MemoView';
import AttachmentView from '@/components/features/common/AttachmentView';

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
          {turnOverGoal.selfIntroductions && turnOverGoal.selfIntroductions.length > 0 ? (
            turnOverGoal.selfIntroductions.map((item, index) => (
              <div key={item.id} className={styles.qaItem}>
                <div className={styles.qaHeader}>
                  <span className={styles.qaNumber}>{index + 1}</span>
                  <div className={styles.qaQuestion}>
                    <strong>문항 제목 들어가는 영역</strong>
                  </div>
                </div>
                <div className={styles.qaContent}>
                  <p className={styles.question}>{item.question}</p>
                  <p className={styles.answer}>{item.content}</p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState text="등록된 자기소개서가 없습니다." />
          )}
        </div>
      </div>

      {/* 면접 예상 질문 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>면접 예상 질문</h2>
        </div>
        <div className={styles.sectionContent}>
          {turnOverGoal.interviewQuestions && turnOverGoal.interviewQuestions.length > 0 ? (
            turnOverGoal.interviewQuestions.map((item, index) => (
              <div key={item.id} className={styles.qaItem}>
                <div className={styles.qaHeader}>
                  <span className={styles.qaNumber}>{index + 1}</span>
                  <div className={styles.qaQuestion}>
                    <strong>질문 제목 들어가는 영역</strong>
                  </div>
                </div>
                <div className={styles.qaContent}>
                  <p className={styles.question}>{item.question}</p>
                  <p className={styles.answer}>{item.answer}</p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState text="등록된 면접 예상 질문이 없습니다." />
          )}
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
          {turnOverGoal.checkList && turnOverGoal.checkList.length > 0 ? (
            <div className={styles.checkList}>
              {turnOverGoal.checkList.map((item) => (
                <div key={item.id} className={styles.checkItem}>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                    className={styles.checkbox}
                  />
                  <label className={styles.checkLabel}>
                    {item.content}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="등록된 체크리스트가 없습니다." />
          )}
        </div>
      </div>

      {/* 첨부 */}
      <AttachmentView attachments={turnOverGoal.attachments || []} />
    </div>
  );
};

export default TurnOverGoalView;

