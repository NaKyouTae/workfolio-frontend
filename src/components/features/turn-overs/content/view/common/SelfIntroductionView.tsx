import React from 'react';
import { SelfIntroduction } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import styles from './SelfIntroductionView.module.css';

interface SelfIntroductionViewProps {
  selfIntroductions: SelfIntroduction[];
}

const SelfIntroductionView: React.FC<SelfIntroductionViewProps> = ({ selfIntroductions }) => {
  if (!selfIntroductions || selfIntroductions.length === 0) {
    return <EmptyState text="등록된 자기소개서가 없습니다." />;
  }

  return (
    <div className={styles.container}>
      {selfIntroductions.map((item, index) => (
        <div key={item.id || `self-intro-${index}`} className={styles.qaItem}>
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
      ))}
    </div>
  );
};

export default SelfIntroductionView;

