import React, { useState } from 'react';
import { TurnOverGoalDetail } from '@/generated/common';
import styles from './TurnOverGoalEdit.module.css';
import { TurnOverUpsertRequest_MemoRequest, TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest, TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest, TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest } from '@/generated/turn_over';
import { AttachmentRequest } from '@/generated/attachment';
import MemoEdit from './common/MemoEdit';
import AttachmentEdit from './common/AttachmentEdit';

interface TurnOverGoalEditProps {
  turnOverGoal: TurnOverGoalDetail | null;
  onSave?: (data: TurnOverGoalDetail) => void;
}

const TurnOverGoalEdit: React.FC<TurnOverGoalEditProps> = ({ turnOverGoal }) => {
  const [reason, setReason] = useState(turnOverGoal?.reason || '');
  const [goal, setGoal] = useState(turnOverGoal?.goal || '');
  const [selfIntroductions, setSelfIntroductions] = useState<TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest[]>(
    turnOverGoal?.selfIntroductions || []
  );
  const [interviewQuestions, setInterviewQuestions] = useState<TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest[]>(
    turnOverGoal?.interviewQuestions || []
  );
  const [checkList, setCheckList] = useState<TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest[]>(
    turnOverGoal?.checkList || []
  );
  const [memos, setMemos] = useState<TurnOverUpsertRequest_MemoRequest[]>(
    turnOverGoal?.memos || []
  );
  const [attachments, setAttachments] = useState<AttachmentRequest[]>(
    turnOverGoal?.attachments || []
  );

  // 자기소개서 추가
  const addSelfIntroduction = () => {
    setSelfIntroductions([...selfIntroductions, { question: '', content: '' }]);
  };

  // 자기소개서 삭제
  const removeSelfIntroduction = (index: number) => {
    setSelfIntroductions(selfIntroductions.filter((_, i) => i !== index));
  };

  // 면접 질문 추가
  const addInterviewQuestion = () => {
    setInterviewQuestions([...interviewQuestions, { question: '', answer: '' }]);
  };

  // 면접 질문 삭제
  const removeInterviewQuestion = (index: number) => {
    setInterviewQuestions(interviewQuestions.filter((_, i) => i !== index));
  };

  // 체크리스트 추가
  const addCheckListItem = () => {
    setCheckList([...checkList, { checked: false, content: '' }]);
  };

  // 체크리스트 삭제
  const removeCheckListItem = (index: number) => {
    setCheckList(checkList.filter((_, i) => i !== index));
  };

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
            <textarea
              className={styles.textarea}
              placeholder="왜 이직을 고민하게 되었나요? (예: 성장 기회 부족, 새로운 환경 필요 등)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>이직 목표</label>
            <textarea
              className={styles.textarea}
              placeholder="이직을 통해 이루고 싶은 목표는 무엇인가요? (예: 직무 전환, 연봉 인상, 원격 근무 가능한 회사 등)"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* 공통 자기소개서 */}
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
                        onChange={(e) => {
                          const updated = [...selfIntroductions];
                          updated[index].question = e.target.value;
                          setSelfIntroductions(updated);
                        }}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>내용</label>
                      <textarea
                        className={styles.textarea}
                        placeholder="내용을 입력해 주세요."
                        value={item.content}
                        onChange={(e) => {
                          const updated = [...selfIntroductions];
                          updated[index].content = e.target.value;
                          setSelfIntroductions(updated);
                        }}
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

      {/* 면접 예상 질문 */}
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
                        onChange={(e) => {
                          const updated = [...interviewQuestions];
                          updated[index].question = e.target.value;
                          setInterviewQuestions(updated);
                        }}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>답변</label>
                      <textarea
                        className={styles.textarea}
                        placeholder="답변을 입력해 주세요."
                        value={item.answer}
                        onChange={(e) => {
                          const updated = [...interviewQuestions];
                          updated[index].answer = e.target.value;
                          setInterviewQuestions(updated);
                        }}
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

      {/* 메모 */}
      <MemoEdit memos={memos} onMemosChange={setMemos} />

      {/* 체크리스트 */}
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
                  onChange={(e) => {
                    const updated = [...checkList];
                    updated[index].checked = e.target.checked;
                    setCheckList(updated);
                  }}
                />
                <input
                  type="text"
                  className={styles.checkInput}
                  placeholder="내용을 입력해 주세요."
                  value={item.content}
                  onChange={(e) => {
                    const updated = [...checkList];
                    updated[index].content = e.target.value;
                    setCheckList(updated);
                  }}
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

      {/* 첨부 */}
      <AttachmentEdit attachments={attachments} onAttachmentsChange={setAttachments} />
    </div>
  );
};

export default TurnOverGoalEdit;

