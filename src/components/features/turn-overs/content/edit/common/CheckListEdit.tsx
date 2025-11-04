import React from 'react';
import { TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest } from '@/generated/turn_over';
import styles from '../TurnOverGoalEdit.module.css';

interface CheckListEditProps {
  checkList: TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest[];
  onUpdate: (checkList: TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest[]) => void;
}

/**
 * 체크리스트 편집 컴포넌트
 */
const CheckListEdit: React.FC<CheckListEditProps> = ({
  checkList,
  onUpdate,
}) => {
  const addCheckListItem = () => {
    onUpdate([...checkList, { checked: false, content: '' }]);
  };

  const removeCheckListItem = (index: number) => {
    onUpdate(checkList.filter((_, i) => i !== index));
  };

  const updateCheckListChecked = (index: number, checked: boolean) => {
    const updated = [...checkList];
    updated[index].checked = checked;
    onUpdate(updated);
  };

  const updateCheckListContent = (index: number, content: string) => {
    const updated = [...checkList];
    updated[index].content = content;
    onUpdate(updated);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>체크리스트</h2>
        <button className={styles.addButton} onClick={addCheckListItem}>
          + 추가
        </button>
      </div>
      <div className={styles.sectionContent}>
        {checkList.length === 0 ? (
          <div className={styles.emptyContent}>
            <p>체크리스트를 추가해 주세요.</p>
          </div>
        ) : (
          checkList.map((item, index) => (
            <div key={index} className={styles.checkItem}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={item.checked}
                onChange={(e) => updateCheckListChecked(index, e.target.checked)}
              />
              <input
                type="text"
                className={styles.checkInput}
                placeholder="내용을 입력해 주세요."
                value={item.content}
                onChange={(e) => updateCheckListContent(index, e.target.value)}
              />
              <button
                className={styles.deleteButton}
                onClick={() => removeCheckListItem(index)}
              >
                −
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CheckListEdit;

