import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react';
import { TurnOverUpsertRequest, TurnOverUpsertRequest_MemoRequest, TurnOverUpsertRequest_TurnOverChallengeRequest, TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest } from '@/generated/turn_over';
import { AttachmentRequest } from '@/generated/attachment';
import MemoEdit from '@/components/portal/features/turn-overs/content/edit/common/MemoEdit';
import AttachmentEdit from '@/components/portal/features/common/AttachmentEdit';
import { FloatingNavigationItem } from '@/components/portal/ui/FloatingNavigation';
import JobApplicationEdit from './common/JobApplicationEdit';
import { TurnOverEditRef } from './TurnOverGoalEdit';

interface TurnOverChallengeEditProps {
  turnOverRequest: TurnOverUpsertRequest | null;
  onSave?: (data: TurnOverUpsertRequest) => void;
  onTurnOverRequestChange?: (data: TurnOverUpsertRequest) => void;
}

const TurnOverChallengeEdit = forwardRef<TurnOverEditRef, TurnOverChallengeEditProps>(({ turnOverRequest, onSave, onTurnOverRequestChange }, ref) => {
  const [activeSection, setActiveSection] = useState<string>('jobApplication');
  
  // 초기값을 turnOverRequest에서 바로 계산하여 깜빡임 방지
  const initialJobApplications = useMemo(() => turnOverRequest?.turnOverChallenge?.jobApplications || [], [turnOverRequest?.id]);
  const initialMemos = useMemo(() => turnOverRequest?.turnOverChallenge?.memos || [], [turnOverRequest?.id]);
  const initialAttachments = useMemo(() => turnOverRequest?.turnOverChallenge?.attachments || [], [turnOverRequest?.id]);
  
  const [jobApplications, setJobApplications] = useState<TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest[]>(initialJobApplications);
  const [memos, setMemos] = useState<TurnOverUpsertRequest_MemoRequest[]>(initialMemos);
  const [attachments, setAttachments] = useState<AttachmentRequest[]>(initialAttachments);

  // 각 섹션에 대한 ref
  const jobApplicationRef = useRef<HTMLDivElement>(null);
  const memoRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);

  // turnOverRequest의 id가 변경될 때만 state 업데이트
  const turnOverRequestIdRef = useRef<string | undefined>(turnOverRequest?.id);
  
  useEffect(() => {
    // turnOverRequest의 id가 변경된 경우에만 state 초기화
    if (turnOverRequest?.id !== turnOverRequestIdRef.current) {
      turnOverRequestIdRef.current = turnOverRequest?.id;
      if (turnOverRequest?.turnOverChallenge) {
        setJobApplications(turnOverRequest.turnOverChallenge.jobApplications || []);
        setMemos(turnOverRequest.turnOverChallenge.memos || []);
        setAttachments(turnOverRequest.turnOverChallenge.attachments || []);
      }
    }
  }, [turnOverRequest]);

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

  // 네비게이션 항목 정의
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

  const handleSave = () => {
    if (onSave && turnOverRequest) {
      onSave({
        ...turnOverRequest,
        turnOverChallenge: {
          id: turnOverRequest?.turnOverChallenge?.id || undefined,
          memos: memos,
          attachments: attachments,
          jobApplications: jobApplications,
        } as TurnOverUpsertRequest_TurnOverChallengeRequest,
      } as TurnOverUpsertRequest);
    }
  };

  const handleUpdateAttachments = (attachments: AttachmentRequest[]) => {
    setAttachments(attachments);
  };

  // jobApplications가 변경될 때마다 turnOverRequest만 업데이트 (저장하지 않음)
  const prevJobApplicationsRef = useRef<string>('');
  
  useEffect(() => {
    if (!turnOverRequest) return;
    
    // jobApplications의 상태를 문자열로 변환하여 비교
    const currentKey = JSON.stringify(jobApplications.map(app => ({ id: app.id, status: app.status, name: app.name })));
    
    // 이전 값과 다를 때만 업데이트
    if (currentKey !== prevJobApplicationsRef.current) {
      prevJobApplicationsRef.current = currentKey;
      
      // turnOverRequest만 업데이트 (저장하지 않음)
      if (onTurnOverRequestChange) {
        onTurnOverRequestChange({
          ...turnOverRequest,
          turnOverChallenge: {
            id: turnOverRequest?.turnOverChallenge?.id || undefined,
            memos: memos,
            attachments: attachments,
            jobApplications: [...jobApplications], // 새 배열로 복사하여 참조 변경 보장
          } as TurnOverUpsertRequest_TurnOverChallengeRequest,
        } as TurnOverUpsertRequest);
      }
    }
  }, [jobApplications, turnOverRequest, memos, attachments, onTurnOverRequestChange]);

  // ref를 통해 getNavigationItems와 handleSave 함수를 노출
  useImperativeHandle(ref, () => ({
    getNavigationItems,
    handleSave,
  }));

  return (
    <>
        {/* 지원 기록 (채용 절차 포함) */}
        <div ref={jobApplicationRef} className="cont-box">
            <JobApplicationEdit
                jobApplications={jobApplications}
                onUpdate={setJobApplications}
            />
        </div>

        {/* 메모 */}
        <div ref={memoRef} className="cont-box">
            <MemoEdit memos={memos} onMemosChange={setMemos} />
        </div>

        {/* 첨부 */}
        <div ref={attachmentRef} className="cont-box">
            <AttachmentEdit attachments={attachments} onUpdate={handleUpdateAttachments} />
        </div>
    </>
  );
});

TurnOverChallengeEdit.displayName = 'TurnOverChallengeEdit';

export default TurnOverChallengeEdit;

