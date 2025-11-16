import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { TurnOverChallengeDetail } from '@/generated/common';
import MemoView from './common/MemoView';
import AttachmentView from '@/components/portal/features/common/AttachmentView';
import JobApplicationView from './common/JobApplicationView';
import { FloatingNavigationItem } from '@/components/portal/ui/FloatingNavigation';
import { TurnOverViewRef } from './TurnOverGoalView';

import Image from 'next/image';

interface TurnOverChallengeViewProps {
  turnOverChallenge: TurnOverChallengeDetail | null;
}

const TurnOverChallengeView = forwardRef<TurnOverViewRef, TurnOverChallengeViewProps>(({ turnOverChallenge }, ref) => {
  const [activeSection, setActiveSection] = useState<string>('jobApplication');
  
  // 각 섹션에 대한 ref
  const jobApplicationRef = useRef<HTMLDivElement>(null);
  const memoRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);

  // 섹션으로 스크롤하는 함수
  const scrollToSection = useCallback((sectionId: string) => {
    const refMap: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      jobApplication: jobApplicationRef,
      memo: memoRef,
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
        const offset = sectionId === 'jobApplication' ? 80 : 30; // 상단에서 100px 떨어진 위치로 스크롤
        
        const scrollTop = scrollContainer.scrollTop + (elementRect.top - containerRect.top) - offset;
        
        scrollContainer.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });
      } else {
        // page-cont를 찾지 못한 경우 window 스크롤 사용
        requestAnimationFrame(() => {
          const elementTop = element.getBoundingClientRect().top + (window.pageYOffset || window.scrollY);
          const offset = sectionId === 'jobApplication' ? 80 : 30; // 상단에서 100px 떨어진 위치로 스크롤
          
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
        id: 'jobApplication',
        label: '지원 기록',
        isActive: activeSection === 'jobApplication',
        onClick: () => scrollToSection('jobApplication'),
      },
      {
        id: 'memo',
        label: '메모',
        isActive: activeSection === 'memo',
        onClick: () => scrollToSection('memo'),
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

  if (!turnOverChallenge) {
    return (
        <div className="empty-cont">
            <Image
                src="/assets/img/ico/ic-empty.svg" 
                alt="empty" 
                width={1}
                height={1}
            />
            <div>
                <p>도전 내용이 없습니다.</p>
            </div>
        </div>
    );
  }

  return (
    <>
        {/* 지원 기록 */}
        <div ref={jobApplicationRef} className="cont-box">
            <JobApplicationView jobApplications={turnOverChallenge.jobApplications || []} />
        </div>

        {/* 메모 */}
        <div ref={memoRef} className="cont-box">
            <MemoView memos={turnOverChallenge.memos || []} />
        </div>

        {/* 첨부 */}
        <div ref={attachmentRef} className="cont-box">
            <AttachmentView attachments={turnOverChallenge.attachments || []} />
        </div>
    </>
  );
});

TurnOverChallengeView.displayName = 'TurnOverChallengeView';

export default TurnOverChallengeView;

