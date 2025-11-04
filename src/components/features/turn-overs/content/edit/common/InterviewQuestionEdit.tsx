import React from 'react';
import { TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest } from '@/generated/turn_over';
import styles from '../TurnOverGoalEdit.module.css';

interface InterviewQuestionEditProps {
  interviewQuestions: TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest[];
  onUpdate: (interviewQuestions: TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest[]) => void;
}

/**
 * 면접 예상 질문 편집 컴포넌트
 */
const InterviewQuestionEdit: React.FC<InterviewQuestionEditProps> = ({
  interviewQuestions,
  onUpdate,
}) => {
  const addInterviewQuestion = () => {
    onUpdate([...interviewQuestions, { question: '', answer: '' }]);
  };

  const removeInterviewQuestion = (index: number) => {
    onUpdate(interviewQuestions.filter((_, i) => i !== index));
  };

  const updateInterviewQuestion = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...interviewQuestions];
    updated[index][field] = value;
    onUpdate(updated);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>면접 예상 질문</h2>
        <button className={styles.addButton} onClick={addInterviewQuestion}>
          + 질문 추가
        </button>
      </div>
      <div className={styles.sectionContent}>
        {interviewQuestions.length === 0 ? (
          <div className={styles.emptyContent}>
            <p>질문을 추가해 주세요.</p>
          </div>
        ) : (
          interviewQuestions.map((item, index) => (
            <div key={index} className={styles.qaItem}>
              <div className={styles.qaHeader}>
                <div className={styles.dragHandle}>⋮⋮</div>
                <div className={styles.qaInputs}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>질문</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="질문을 입력해 주세요."
                      value={item.question}
                      onChange={(e) => updateInterviewQuestion(index, 'question', e.target.value)}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>답변</label>
                    <textarea
                      className={styles.textarea}
                      placeholder="답변을 입력해 주세요."
                      value={item.answer}
                      onChange={(e) => updateInterviewQuestion(index, 'answer', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => removeInterviewQuestion(index)}
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

export default InterviewQuestionEdit;

