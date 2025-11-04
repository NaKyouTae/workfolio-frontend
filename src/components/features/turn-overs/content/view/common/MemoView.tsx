import React from 'react';
import { Memo } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import styles from './MemoView.module.css';

interface MemoViewProps {
  memos: Memo[];
}

const MemoView: React.FC<MemoViewProps> = ({ memos }) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>메모</h2>
      </div>
      <div className={styles.sectionContent}>
        {memos && memos.length > 0 ? (
          <div className={styles.memoList}>
            {memos.map((memo, index) => (
              <div className={styles.memoItem} key={memo.id || index}>
                <p className={styles.memoText}>{memo.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState text="등록된 메모가 없습니다." />
        )}
      </div>
    </div>
  );
};

export default MemoView;

