import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { TurnOverRetrospectiveDetail } from '@/generated/common';
import styles from './TurnOverRetrospectiveView.module.css';
import MemoView from './common/MemoView';
import AttachmentView from '@/components/portal/features/common/AttachmentView';
import FinalChoiceView from './common/FinalChoiceView';
import NegotiationView from './common/NegotiationView';
import SatisfactionView from './common/SatisfactionView';
import { FloatingNavigationItem } from '../TurnOverFloatingActions';
import { TurnOverViewRef } from './TurnOverGoalView';

import Image from 'next/image';

interface TurnOverRetrospectiveViewProps {
  turnOverRetrospective: TurnOverRetrospectiveDetail | null;
}

const TurnOverRetrospectiveView = forwardRef<TurnOverViewRef, TurnOverRetrospectiveViewProps>(({ turnOverRetrospective }, ref) => {
  const [activeSection, setActiveSection] = useState<string>('finalChoice');
  
  // 각 섹션에 대한 ref
  const finalChoiceRef = useRef<HTMLDivElement>(null);
  const negotiationRef = useRef<HTMLDivElement>(null);
  const satisfactionRef = useRef<HTMLDivElement>(null);
  const memoRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);

  // 섹션으로 스크롤하는 함수
  const scrollToSection = (sectionId: string) => {
    const refMap: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      finalChoice: finalChoiceRef,
      negotiation: negotiationRef,
      satisfaction: satisfactionRef,
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
        id: 'finalChoice',
        label: '최종 선택',
        isActive: activeSection === 'finalChoice',
        onClick: () => scrollToSection('finalChoice'),
      },
      {
        id: 'negotiation',
        label: '처우 협의',
        isActive: activeSection === 'negotiation',
        onClick: () => scrollToSection('negotiation'),
      },
      {
        id: 'satisfaction',
        label: '만족도 평가',
        isActive: activeSection === 'satisfaction',
        onClick: () => scrollToSection('satisfaction'),
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

  if (!turnOverRetrospective) {
    return (
        <div className="empty-cont">
            <Image
                src="/assets/img/ico/ic-empty.svg" 
                alt="empty" 
                width={1}
                height={1}
            />
            <div>
                <p>회고 내용이 없습니다.</p>
            </div>
        </div>
    );
  }

  return (
    <>
        {/* 최종 선택 */}
        <div ref={finalChoiceRef} className="cont-box">
            <FinalChoiceView
            name={turnOverRetrospective.name}
            position={turnOverRetrospective.position}
            reason={turnOverRetrospective.reason}
            />
        </div>

        {/* 처우 협의 */}
        <div ref={negotiationRef} className="cont-box">
            <NegotiationView
            position={turnOverRetrospective.position}
            department={turnOverRetrospective.department}
            rank={turnOverRetrospective.rank}
            jobTitle={turnOverRetrospective.jobTitle}
            salary={turnOverRetrospective.salary}
            workType={turnOverRetrospective.workType}
            employmentType={turnOverRetrospective.employmentType}
            joinedAt={turnOverRetrospective.joinedAt}
            />
        </div>

        {/* 만족도 평가 */}
        <div ref={satisfactionRef} className="cont-box">
            <SatisfactionView
            score={turnOverRetrospective.score}
            reviewSummary={turnOverRetrospective.reviewSummary}
            />
        </div>

        {/* 메모 */}
        <div ref={memoRef} className="cont-box">
            <MemoView memos={turnOverRetrospective.memos || []} />
        </div>

        {/* 첨부 */}
        <div ref={attachmentRef} className="cont-box">
            <AttachmentView attachments={turnOverRetrospective.attachments || []} />
        </div>
    </>
  );
});

TurnOverRetrospectiveView.displayName = 'TurnOverRetrospectiveView';

export default TurnOverRetrospectiveView;

