import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { TurnOverChallengeDetail } from '@/generated/common';
import styles from './TurnOverChallengeView.module.css';
import MemoView from './common/MemoView';
import AttachmentView from '@/components/features/common/AttachmentView';
import JobApplicationListView from './common/JobApplicationListView';
import { FloatingNavigationItem } from '../TurnOverFloatingActions';
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
  const scrollToSection = (sectionId: string) => {
    const refMap: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      jobApplication: jobApplicationRef,
      memo: memoRef,
      attachment: attachmentRef,
    };

    const ref = refMap[sectionId];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  // 네비게이션 아이템 생성 함수
  const getNavigationItems = (): FloatingNavigationItem[] => {
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
  };

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
            <JobApplicationListView jobApplications={turnOverChallenge.jobApplications || []} />
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

