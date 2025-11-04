import React from 'react';
import { TurnOverUpsertRequest_MemoRequest } from '@/generated/turn_over';
import styles from './MemoEdit.module.css';

interface MemoEditProps {
  memos: TurnOverUpsertRequest_MemoRequest[];
  onMemosChange: (memos: TurnOverUpsertRequest_MemoRequest[]) => void;
}

const MemoEdit: React.FC<MemoEditProps> = ({ memos, onMemosChange }) => {
  const addMemo = () => {
    onMemosChange([...memos, { content: '' }]);
  };

  const removeMemo = (index: number) => {
    onMemosChange(memos.filter((_, i) => i !== index));
  };

  const updateMemo = (index: number, content: string) => {
    const updated = [...memos];
    updated[index].content = content;
    onMemosChange(updated);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>메모</h2>
        <button className={styles.addButton} onClick={addMemo}>
          + 추가
        </button>
      </div>
      <div className={styles.sectionContent}>
        {memos.length === 0 ? (
          <div className={styles.emptyContent}>
            <p>메모를 추가해 주세요.</p>
          </div>
        ) : (
          memos.map((item, index) => (
            <div className={styles.memoItem} key={index}>
              <div className={styles.dragHandle}>⋮⋮</div>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <label className={styles.inputLabel}>내용</label>
                <textarea
                  className={styles.textarea}
                  placeholder="내용을 입력해 주세요."
                  rows={3}
                  value={item.content}
                  onChange={(e) => updateMemo(index, e.target.value)}
                />
              </div>
              <button className={styles.deleteButton} onClick={() => removeMemo(index)}>
                −
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemoEdit;

