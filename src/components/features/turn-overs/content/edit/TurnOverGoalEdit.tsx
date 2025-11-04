import React, { useState, useEffect } from 'react';
import styles from './TurnOverGoalEdit.module.css';
import { TurnOverUpsertRequest, TurnOverUpsertRequest_MemoRequest, TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest, TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest, TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest } from '@/generated/turn_over';
import { AttachmentRequest } from '@/generated/attachment';
import MemoEdit from './common/MemoEdit';
import AttachmentEdit from '@/components/features/common/AttachmentEdit';
import EditFloatingActions, { FloatingNavigationItem } from '../EditFloatingActions';
import SelfIntroductionEdit from './common/SelfIntroductionEdit';
import InterviewQuestionEdit from './common/InterviewQuestionEdit';
import CheckListEdit from './common/CheckListEdit';

interface TurnOverGoalEditProps {
  turnOverRequest: TurnOverUpsertRequest | null;
  onSave?: (data: TurnOverUpsertRequest) => void;
  onCancel?: () => void;
}

const TurnOverGoalEdit: React.FC<TurnOverGoalEditProps> = ({ turnOverRequest, onSave, onCancel }) => {
  const [activeSection, setActiveSection] = useState<string>('basic');
  const [reason, setReason] = useState('');
  const [goal, setGoal] = useState('');
  const [selfIntroductions, setSelfIntroductions] = useState<TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest[]>([]);
  const [checkList, setCheckList] = useState<TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest[]>([]);
  const [memos, setMemos] = useState<TurnOverUpsertRequest_MemoRequest[]>([]);
  const [attachments, setAttachments] = useState<AttachmentRequest[]>([]);

  // turnOverRequest가 변경될 때마다 state 업데이트
  useEffect(() => {
    if (turnOverRequest?.turnOverGoal) {
      setReason(turnOverRequest.turnOverGoal.reason || '');
      setGoal(turnOverRequest.turnOverGoal.goal || '');
      setSelfIntroductions(turnOverRequest.turnOverGoal.selfIntroductions || []);
      setInterviewQuestions(turnOverRequest.turnOverGoal.interviewQuestions || []);
      setCheckList(turnOverRequest.turnOverGoal.checkList || []);
      setMemos(turnOverRequest.turnOverGoal.memos || []);
      setAttachments(turnOverRequest.turnOverGoal.attachments || []);
    }
  }, [turnOverRequest]);

  // 네비게이션 항목 정의 (각 탭에 따라 다른 네비게이션 표시 가능)
  const getNavigationItems = (): FloatingNavigationItem[] => {
    return [
      {
        id: 'basic',
        label: '기본 정보',
        isActive: activeSection === 'basic',
        onClick: () => setActiveSection('basic'),
      },
      {
        id: 'memo',
        label: '메모',
        isActive: activeSection === 'memo',
        onClick: () => setActiveSection('memo'),
      },
      {
        id: 'attachment',
        label: '첨부',
        isActive: activeSection === 'attachment',
        onClick: () => setActiveSection('attachment'),
      },
    ];
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...turnOverRequest,
        turnOverGoal: {
          id: turnOverRequest?.turnOverGoal?.id || undefined,
          reason: reason,
          goal: goal,
          selfIntroductions: selfIntroductions,
          interviewQuestions: interviewQuestions,
          checkList: checkList,
          memos: memos,
          attachments: attachments,
        },
      } as TurnOverUpsertRequest);
    }
  };

  const handleUpdateAttachments = (attachments: AttachmentRequest[]) => {
    setAttachments(attachments);
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
      <SelfIntroductionEdit 
        selfIntroductions={selfIntroductions}
        onUpdate={setSelfIntroductions}
      />

      {/* 면접 예상 질문 */}
      <InterviewQuestionEdit
        interviewQuestions={interviewQuestions}
        onUpdate={setInterviewQuestions}
      />

      {/* 메모 */}
      <MemoEdit memos={memos} onMemosChange={setMemos} />

      {/* 체크리스트 */}
      <CheckListEdit
        checkList={checkList}
        onUpdate={setCheckList}
      />

      {/* 첨부 */}
      <AttachmentEdit attachments={attachments} onUpdate={handleUpdateAttachments} />

      {/* Floating Action Buttons */}
      <EditFloatingActions 
        navigationItems={getNavigationItems()}
        onSave={handleSave}
        onCancel={() => onCancel?.()}
      />
    </div>
  );
};

export default TurnOverGoalEdit;

