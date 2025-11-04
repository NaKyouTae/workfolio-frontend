import React, { useState, useEffect } from 'react';
import styles from './TurnOverChallengeEdit.module.css';
import { TurnOverUpsertRequest, TurnOverUpsertRequest_MemoRequest, TurnOverUpsertRequest_TurnOverChallengeRequest, TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest } from '@/generated/turn_over';
import { AttachmentRequest } from '@/generated/attachment';
import MemoEdit from '@/components/features/turn-overs/content/edit/common/MemoEdit';
import AttachmentEdit from '@/components/features/common/AttachmentEdit';
import EditFloatingActions, { FloatingNavigationItem } from '../EditFloatingActions';
import JobApplicationEdit from './common/JobApplicationEdit';

interface TurnOverChallengeEditProps {
  turnOverRequest: TurnOverUpsertRequest | null;
  onSave?: (data: TurnOverUpsertRequest) => void;
  onCancel?: () => void;
}


const TurnOverChallengeEdit: React.FC<TurnOverChallengeEditProps> = ({ turnOverRequest, onSave, onCancel }) => {
  const [activeSection, setActiveSection] = useState<string>('basic');
  const [jobApplications, setJobApplications] = useState<TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest[]>([]);
  const [memos, setMemos] = useState<TurnOverUpsertRequest_MemoRequest[]>([]);
  const [attachments, setAttachments] = useState<AttachmentRequest[]>([]);

  // turnOverChallenge가 변경될 때마다 state 업데이트
  useEffect(() => {
    if (turnOverRequest?.turnOverChallenge) {
      setJobApplications(turnOverRequest.turnOverChallenge.jobApplications || []);
      setMemos(turnOverRequest.turnOverChallenge.memos || []);
      setAttachments(turnOverRequest.turnOverChallenge.attachments || []);
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

  return (
    <div className={styles.container}>
      {/* 지원 기록 (채용 절차 포함) */}
      <JobApplicationEdit
        jobApplications={jobApplications}
        onUpdate={setJobApplications}
      />

      {/* 메모 */}
      <MemoEdit memos={memos} onMemosChange={setMemos} />

      {/* 첨부 */}
      <AttachmentEdit attachments={attachments} onUpdate={handleUpdateAttachments} />

      <EditFloatingActions 
        navigationItems={getNavigationItems()}
        onSave={handleSave}
        onCancel={() => onCancel?.()}
      />
    </div>
  );
};

export default TurnOverChallengeEdit;

