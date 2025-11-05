import React from 'react';
import { CheckList } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import styles from './CheckListView.module.css';

interface CheckListViewProps {
  checkList: CheckList[];
}

const CheckListView: React.FC<CheckListViewProps> = ({ checkList }) => {
  if (!checkList || checkList.length === 0) {
    return <EmptyState text="등록된 체크리스트가 없습니다." />;
  }

  return (
    <div className={styles.checkList}>
      {checkList.map((item, index) => (
        <div key={item.id || `checklist-${index}`} className={styles.checkItem}>
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
  );
};

export default CheckListView;

