import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { TurnOverGoalDetail } from '@/generated/common';
import styles from './TurnOverGoalView.module.css';
import MemoView from './common/MemoView';
import AttachmentView from '@/components/portal/features/common/AttachmentView';
import TurnOverDirectionView from './common/TurnOverDirectionView';
import SelfIntroductionView from './common/SelfIntroductionView';
import InterviewQuestionView from './common/InterviewQuestionView';
import CheckListView from './common/CheckListView';
import { FloatingNavigationItem } from '@/components/portal/ui/FloatingNavigation';

interface TurnOverGoalViewProps {
  turnOverGoal: TurnOverGoalDetail | null;
  onUpdate?: () => void;
}

export interface TurnOverViewRef {
  getNavigationItems: () => FloatingNavigationItem[];
}

const TurnOverGoalView = forwardRef<TurnOverViewRef, TurnOverGoalViewProps>(({ turnOverGoal, onUpdate }, ref) => {
  const [activeSection, setActiveSection] = useState<string>('direction');
  
  // 각 섹션에 대한 ref
  const directionRef = useRef<HTMLDivElement>(null);
  const selfIntroductionRef = useRef<HTMLDivElement>(null);
  const interviewQuestionRef = useRef<HTMLDivElement>(null);
  const memoRef = useRef<HTMLDivElement>(null);
  const checkListRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);

  // 섹션으로 스크롤하는 함수
  const scrollToSection = useCallback((sectionId: string) => {
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
      setActiveSection(sectionId);
      const element = ref.current;
      
      // page-cont 스크롤 컨테이너 찾기
      const scrollContainer = element.closest('.page-cont') as HTMLElement;
      
      if (scrollContainer) {
        // 스크롤 컨테이너 내에서의 상대 위치 계산
        const containerRect = scrollContainer.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const offset = sectionId === 'direction' ? 80 : 30; // 상단에서 100px 떨어진 위치로 스크롤
        
        const scrollTop = scrollContainer.scrollTop + (elementRect.top - containerRect.top) - offset;
        
        scrollContainer.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });
      } else {
        // page-cont를 찾지 못한 경우 window 스크롤 사용
        requestAnimationFrame(() => {
          const elementTop = element.getBoundingClientRect().top + (window.pageYOffset || window.scrollY);
          const offset = sectionId === 'direction' ? 80 : 30; // 상단에서 100px 떨어진 위치로 스크롤
          
          window.scrollTo({
            top: elementTop - offset,
            behavior: 'smooth',
          });
        });
      }
    }
  }, []);

  // 네비게이션 아이템 생성 함수
  const getNavigationItems = useCallback((): FloatingNavigationItem[] => {
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
  }, [activeSection, scrollToSection]);

  // ref를 통해 getNavigationItems 함수를 노출
  useImperativeHandle(ref, () => ({
    getNavigationItems,
  }));

  if (!turnOverGoal) {
    return (
      <div className={styles.emptyState}>
        <p>목표 정보가 없습니다.</p>
      </div>
    );
  }
    
  return (
    <>
        {/* 이직 방향 설정 */}
        <div ref={directionRef} className="cont-box">
            <TurnOverDirectionView
            reason={turnOverGoal.reason}
            goal={turnOverGoal.goal}
            />
        </div>

        {/* 공통 자기소개서 */}
        <div ref={selfIntroductionRef} className="cont-box">
            <SelfIntroductionView selfIntroductions={turnOverGoal.selfIntroductions || []} />
        </div>

        {/* 면접 예상 질문 */}
        <div ref={interviewQuestionRef} className="cont-box">
            <InterviewQuestionView interviewQuestions={turnOverGoal.interviewQuestions || []} />
        </div>

        {/* 메모 */}
        <div ref={memoRef} className="cont-box">
            <MemoView memos={turnOverGoal.memos || []} />
        </div>

        {/* 체크리스트 */}
        <div ref={checkListRef} className="cont-box">
            <CheckListView 
                checkList={turnOverGoal.checkList || []} 
                onUpdate={onUpdate}
            />
        </div>

        {/* 첨부 */}
        <div ref={attachmentRef} className="cont-box">
            <AttachmentView attachments={turnOverGoal.attachments || []} />
        </div>
    </>
  );
});

TurnOverGoalView.displayName = 'TurnOverGoalView';

export default TurnOverGoalView;
