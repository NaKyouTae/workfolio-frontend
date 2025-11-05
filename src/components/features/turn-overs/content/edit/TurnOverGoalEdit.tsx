import React, { useState, useEffect, useRef } from 'react';
import styles from './TurnOverGoalEdit.module.css';
import { TurnOverUpsertRequest, TurnOverUpsertRequest_MemoRequest, TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest, TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest, TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest } from '@/generated/turn_over';
import { AttachmentRequest } from '@/generated/attachment';
import MemoEdit from './common/MemoEdit';
import AttachmentEdit from '@/components/features/common/AttachmentEdit';
import TurnOverFloatingActions, { FloatingNavigationItem } from '../TurnOverFloatingActions';
import SelfIntroductionEdit from './common/SelfIntroductionEdit';
import InterviewQuestionEdit from './common/InterviewQuestionEdit';
import CheckListEdit from './common/CheckListEdit';

interface TurnOverGoalEditProps {
  turnOverRequest: TurnOverUpsertRequest | null;
  onSave?: (data: TurnOverUpsertRequest) => void;
  onCancel?: () => void;
}

const TurnOverGoalEdit: React.FC<TurnOverGoalEditProps> = ({ turnOverRequest, onSave, onCancel }) => {
  const [activeSection, setActiveSection] = useState<string>('direction');
  const [reason, setReason] = useState('');
  const [goal, setGoal] = useState('');
  const [selfIntroductions, setSelfIntroductions] = useState<TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest[]>([]);
  const [checkList, setCheckList] = useState<TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest[]>([]);
  const [memos, setMemos] = useState<TurnOverUpsertRequest_MemoRequest[]>([]);
  const [attachments, setAttachments] = useState<AttachmentRequest[]>([]);

  // 각 섹션에 대한 ref
  const directionRef = useRef<HTMLDivElement>(null);
  const selfIntroductionRef = useRef<HTMLDivElement>(null);
  const interviewQuestionRef = useRef<HTMLDivElement>(null);
  const memoRef = useRef<HTMLDivElement>(null);
  const checklistRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);

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

  // 섹션으로 스크롤하는 함수
  const scrollToSection = (sectionId: string) => {
    const refMap: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      direction: directionRef,
      selfIntroduction: selfIntroductionRef,
      interviewQuestion: interviewQuestionRef,
      memo: memoRef,
      checklist: checklistRef,
      attachment: attachmentRef,
    };

    const ref = refMap[sectionId];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  // 네비게이션 항목 정의
  const getNavigationItems = (): FloatingNavigationItem[] => {
    return [
      {
        id: 'direction',
        label: '이직 방향',
        isActive: activeSection === 'direction',
        onClick: () => scrollToSection('direction'),
      },
      {
        id: 'selfIntroduction',
        label: '자기소개서',
        isActive: activeSection === 'selfIntroduction',
        onClick: () => scrollToSection('selfIntroduction'),
      },
      {
        id: 'interviewQuestion',
        label: '면접 질문',
        isActive: activeSection === 'interviewQuestion',
        onClick: () => scrollToSection('interviewQuestion'),
      },
      {
        id: 'memo',
        label: '메모',
        isActive: activeSection === 'memo',
        onClick: () => scrollToSection('memo'),
      },
      {
        id: 'checklist',
        label: '체크리스트',
        isActive: activeSection === 'checklist',
        onClick: () => scrollToSection('checklist'),
      },
      {
        id: 'attachment',
        label: '첨부',
        isActive: activeSection === 'attachment',
        onClick: () => scrollToSection('attachment'),
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
      <div className={styles.contentInner}>
      {/* 이직 방향 설정 */}
      <div ref={directionRef} className={styles.section}>
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
      <div ref={selfIntroductionRef}>
        <SelfIntroductionEdit 
          selfIntroductions={selfIntroductions}
          onUpdate={setSelfIntroductions}
        />
      </div>

      {/* 면접 예상 질문 */}
      <div ref={interviewQuestionRef}>
        <InterviewQuestionEdit
          interviewQuestions={interviewQuestions}
          onUpdate={setInterviewQuestions}
        />
      </div>

      {/* 메모 */}
      <div ref={memoRef}>
        <MemoEdit memos={memos} onMemosChange={setMemos} />
      </div>

      {/* 체크리스트 */}
      <div ref={checklistRef}>
        <CheckListEdit
          checkList={checkList}
          onUpdate={setCheckList}
        />
      </div>

      {/* 첨부 */}
      <div ref={attachmentRef}>
        <AttachmentEdit attachments={attachments} onUpdate={handleUpdateAttachments} />
      </div>
      </div>

      {/* Floating Action Buttons */}
      <TurnOverFloatingActions 
        navigationItems={getNavigationItems()}
        onSave={handleSave}
        onCancel={() => onCancel?.()}
      />
    </div>
  );
};

export default TurnOverGoalEdit;

