import React from 'react';
import { Memo } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import styles from './MemoView.module.css';

interface MemoViewProps {
  memos: Memo[];
}

const MemoView: React.FC<MemoViewProps> = ({ memos }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        메모
      </h3>
      <div className={styles.listContainer}>
        {!(memos && memos.length > 0) ? (<EmptyState text="등록된 메모가 없습니다." />): (
          <div className={styles.item}>
            {memos.map((memo) => (
              <div className={styles.item} key={memo.id}>
                <p className={styles.text}>{memo.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoView;
