import React from 'react';
import { InterviewQuestion } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import styles from './InterviewQuestionView.module.css';

interface InterviewQuestionViewProps {
  interviewQuestions: InterviewQuestion[];
}

const InterviewQuestionView: React.FC<InterviewQuestionViewProps> = ({ interviewQuestions }) => {
  if (!interviewQuestions || interviewQuestions.length === 0) {
    return <EmptyState text="등록된 면접 예상 질문이 없습니다." />;
  }

  return (
    <div className={styles.container}>
      {interviewQuestions.map((item, index) => (
        <div key={item.id || `interview-q-${index}`} className={styles.qaItem}>
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
      ))}
    </div>
  );
};

export default InterviewQuestionView;

