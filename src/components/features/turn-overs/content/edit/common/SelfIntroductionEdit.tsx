import React from 'react';
import { TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest } from '@/generated/turn_over';
import styles from '../TurnOverGoalEdit.module.css';

interface SelfIntroductionEditProps {
  selfIntroductions: TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest[];
  onUpdate: (selfIntroductions: TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest[]) => void;
}

/**
 * 공통 자기소개서 편집 컴포넌트
 */
const SelfIntroductionEdit: React.FC<SelfIntroductionEditProps> = ({
  selfIntroductions,
  onUpdate,
}) => {
  const addSelfIntroduction = () => {
    onUpdate([...selfIntroductions, { question: '', content: '' }]);
  };

  const removeSelfIntroduction = (index: number) => {
    onUpdate(selfIntroductions.filter((_, i) => i !== index));
  };

  const updateSelfIntroduction = (index: number, field: 'question' | 'content', value: string) => {
    const updated = [...selfIntroductions];
    updated[index][field] = value;
    onUpdate(updated);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>공통 자기소개서</h2>
        <button className={styles.addButton} onClick={addSelfIntroduction}>
          + 문항 추가
        </button>
      </div>
      <div className={styles.sectionContent}>
        {selfIntroductions.length === 0 ? (
          <div className={styles.emptyContent}>
            <p>문항을 추가해 주세요.</p>
          </div>
        ) : (
          selfIntroductions.map((item, index) => (
            <div key={index} className={styles.qaItem}>
              <div className={styles.qaHeader}>
                <div className={styles.dragHandle}>⋮⋮</div>
                <div className={styles.qaInputs}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>문항</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="문항을 입력해 주세요."
                      value={item.question}
                      onChange={(e) => updateSelfIntroduction(index, 'question', e.target.value)}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>내용</label>
                    <textarea
                      className={styles.textarea}
                      placeholder="내용을 입력해 주세요."
                      value={item.content}
                      onChange={(e) => updateSelfIntroduction(index, 'content', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => removeSelfIntroduction(index)}
                >
                  −
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelfIntroductionEdit;

