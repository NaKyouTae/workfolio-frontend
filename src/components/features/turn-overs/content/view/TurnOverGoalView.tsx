import React, { useState, useRef } from 'react';
import { TurnOverGoalDetail } from '@/generated/common';
import styles from './TurnOverGoalView.module.css';
import MemoView from './common/MemoView';
import AttachmentView from '@/components/features/common/AttachmentView';
import TurnOverDirectionView from './common/TurnOverDirectionView';
import SelfIntroductionView from './common/SelfIntroductionView';
import InterviewQuestionView from './common/InterviewQuestionView';
import CheckListView from './common/CheckListView';
import TurnOverFloatingActions, { FloatingNavigationItem } from '../TurnOverFloatingActions';

interface TurnOverGoalViewProps {
  turnOverGoal: TurnOverGoalDetail | null;
}

const TurnOverGoalView: React.FC<TurnOverGoalViewProps> = ({ turnOverGoal }) => {
  const [activeSection, setActiveSection] = useState<string>('direction');
  
  // 각 섹션에 대한 ref
  const directionRef = useRef<HTMLDivElement>(null);
  const selfIntroductionRef = useRef<HTMLDivElement>(null);
  const interviewQuestionRef = useRef<HTMLDivElement>(null);
  const memoRef = useRef<HTMLDivElement>(null);
  const checkListRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);

  if (!turnOverGoal) {
    return (
      <div className={styles.emptyState}>
        <p>목표 정보가 없습니다.</p>
      </div>
    );
  }

  // 섹션으로 스크롤하는 함수
  const scrollToSection = (sectionId: string) => {
    const refMap: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      direction: directionRef,
      selfIntroduction: selfIntroductionRef,
      interviewQuestion: interviewQuestionRef,
      memo: memoRef,
      checkList: checkListRef,
      attachment: attachmentRef,
    };

    const ref = refMap[sectionId];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

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
        id: 'checkList',
        label: '체크리스트',
        isActive: activeSection === 'checkList',
        onClick: () => scrollToSection('checkList'),
      },
      {
        id: 'attachment',
        label: '첨부',
        isActive: activeSection === 'attachment',
        onClick: () => scrollToSection('attachment'),
      },
    ];
  };
    
  return (
    <div className={styles.container}>
      <div className={styles.contentInner}>
        {/* 이직 방향 설정 */}
        <div ref={directionRef}>
          <TurnOverDirectionView
            reason={turnOverGoal.reason}
            goal={turnOverGoal.goal}
          />
        </div>

        {/* 공통 자기소개서 */}
        <div ref={selfIntroductionRef}>
          <SelfIntroductionView selfIntroductions={turnOverGoal.selfIntroductions || []} />
        </div>

        {/* 면접 예상 질문 */}
        <div ref={interviewQuestionRef}>
          <InterviewQuestionView interviewQuestions={turnOverGoal.interviewQuestions || []} />
        </div>

        {/* 메모 */}
        <div ref={memoRef}>
          <MemoView memos={turnOverGoal.memos || []} />
        </div>

        {/* 체크리스트 */}
        <div ref={checkListRef}>
          <CheckListView checkList={turnOverGoal.checkList || []} />
        </div>

        {/* 첨부 */}
        <div ref={attachmentRef}>
          <AttachmentView attachments={turnOverGoal.attachments || []} />
        </div>
      </div>

      {/* Floating Navigation */}
      <TurnOverFloatingActions navigationItems={getNavigationItems()} />
    </div>
  );
};

export default TurnOverGoalView;
