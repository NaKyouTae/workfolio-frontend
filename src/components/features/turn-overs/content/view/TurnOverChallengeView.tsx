import React, { useState, useRef } from 'react';
import { TurnOverChallengeDetail } from '@/generated/common';
import styles from './TurnOverChallengeView.module.css';
import MemoView from './common/MemoView';
import AttachmentView from '@/components/features/common/AttachmentView';
import JobApplicationListView from './common/JobApplicationListView';
import TurnOverFloatingActions, { FloatingNavigationItem } from '../TurnOverFloatingActions';

interface TurnOverChallengeViewProps {
  turnOverChallenge: TurnOverChallengeDetail | null;
}

const TurnOverChallengeView: React.FC<TurnOverChallengeViewProps> = ({ turnOverChallenge }) => {
  const [activeSection, setActiveSection] = useState<string>('jobApplication');
  
  // 각 섹션에 대한 ref
  const jobApplicationRef = useRef<HTMLDivElement>(null);
  const memoRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);

  if (!turnOverChallenge) {
    return (
      <div className={styles.emptyState}>
        <p>도전 정보가 없습니다.</p>
      </div>
    );
  }

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

  return (
    <div className={styles.container}>
      <div className={styles.contentInner}>
        {/* 지원 기록 */}
        <div ref={jobApplicationRef}>
          <JobApplicationListView jobApplications={turnOverChallenge.jobApplications || []} />
        </div>

        {/* 메모 */}
        <div ref={memoRef}>
          <MemoView memos={turnOverChallenge.memos || []} />
        </div>

        {/* 첨부 */}
        <div ref={attachmentRef}>
          <AttachmentView attachments={turnOverChallenge.attachments || []} />
        </div>
      </div>

      {/* Floating Navigation */}
      <TurnOverFloatingActions navigationItems={getNavigationItems()} />
    </div>
  );
};

export default TurnOverChallengeView;

