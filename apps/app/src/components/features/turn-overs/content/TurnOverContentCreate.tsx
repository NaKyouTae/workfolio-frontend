import React, { useState, useCallback } from 'react';
import { TurnOverRetrospective_EmploymentType } from '@workfolio/shared/generated/common';
import { 
  TurnOverUpsertRequest,
  TurnOverUpsertRequest_TurnOverGoalRequest,
  TurnOverUpsertRequest_TurnOverChallengeRequest,
  TurnOverUpsertRequest_TurnOverRetrospectiveRequest,
  TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest,
  TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest,
  TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest,
  TurnOverUpsertRequest_MemoRequest,
  TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest,
  TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest,
} from '@workfolio/shared/generated/turn_over';
import { AttachmentRequest } from '@workfolio/shared/generated/attachment';
import { Attachment_AttachmentCategory } from '@workfolio/shared/generated/common';
import { JobApplication_JobApplicationStatus, ApplicationStage_ApplicationStageStatus } from '@workfolio/shared/generated/common';
import TurnOverContentForm from './TurnOverContentForm';

interface TurnOverContentCreateProps {
  onCancel?: () => void;
  onSave?: (data: TurnOverUpsertRequest) => void;
  onSuccess?: () => void;
}

const TurnOverContentCreate: React.FC<TurnOverContentCreateProps> = ({ 
  onCancel,
  onSave,
  onSuccess
}) => {

  // 기본 정보
  const [name, setName] = useState('');

  // 각 섹션 데이터 - 한 개씩만 초기화
  const [turnOverRequest, setTurnOverRequest] = useState<TurnOverUpsertRequest>({
    name: '',
    turnOverGoal: {
      reason: '',
      goal: '',
      selfIntroductions: [
        {
          question: '',
          content: '',
          isVisible: true,
          priority: 0,
        } as TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest,
      ],
      interviewQuestions: [
        {
          question: '',
          answer: '',
          isVisible: true,
          priority: 0,
        } as TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest,
      ],
      checkList: [
        {
          checked: false,
          content: '',
          isVisible: true,
          priority: 0,
        } as TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest,
      ],
      memos: [
        {
          content: '',
          isVisible: true,
          priority: 0,
        } as TurnOverUpsertRequest_MemoRequest,
      ],
      attachments: [
        {
          type: undefined,
          category: Attachment_AttachmentCategory.FILE,
          url: '',
          fileName: '',
          fileUrl: '',
          fileData: undefined,
          isVisible: true,
          priority: 0,
        } as AttachmentRequest,
      ],
    } as TurnOverUpsertRequest_TurnOverGoalRequest,
    turnOverChallenge: {
      jobApplications: [
        {
          name: '',
          position: '',
          jobPostingTitle: '',
          jobPostingUrl: '',
          startedAt: undefined,
          endedAt: undefined,
          applicationSource: '',
          memo: '',
          status: JobApplication_JobApplicationStatus.PENDING,
          isVisible: true,
          priority: 0,
          applicationStages: [
            {
              name: '',
              status: ApplicationStage_ApplicationStageStatus.PENDING,
              date: undefined,
              memo: '',
              isVisible: true,
              priority: 0,
            } as TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest,
          ],
        } as TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest,
      ],
      memos: [
        {
          content: '',
          isVisible: true,
          priority: 0,
        } as TurnOverUpsertRequest_MemoRequest,
      ],
      attachments: [
        {
          type: undefined,
          category: Attachment_AttachmentCategory.FILE,
          url: '',
          fileName: '',
          fileUrl: '',
          fileData: undefined,
          isVisible: true,
          priority: 0,
        } as AttachmentRequest,
      ],
    } as TurnOverUpsertRequest_TurnOverChallengeRequest,
    turnOverRetrospective: {
      name: '',
      salary: 0,
      position: '',
      jobTitle: '',
      rank: '',
      reason: '',
      score: 5,
      reviewSummary: '',
      department: '',
      workType: '',
      employmentType: TurnOverRetrospective_EmploymentType.EMPLOYMENT_TYPE_UNKNOWN,
      memos: [
        {
          content: '',
          isVisible: true,
          priority: 0,
        } as TurnOverUpsertRequest_MemoRequest,
      ],
      attachments: [
        {
          type: undefined,
          category: Attachment_AttachmentCategory.FILE,
          url: '',
          fileName: '',
          fileUrl: '',
          fileData: undefined,
          isVisible: true,
          priority: 0,
        } as AttachmentRequest,
      ],
    } as TurnOverUpsertRequest_TurnOverRetrospectiveRequest,
  });

  const handleSave = useCallback(async (data: TurnOverUpsertRequest) => {
    if (onSave) {
      // TurnOversPage의 onSave를 호출하여 sidebar 데이터 갱신
      await onSave(data);
      onSuccess?.();
    }
  }, [onSave, onSuccess]);

  const handleTurnOverRequestChange = useCallback((data: TurnOverUpsertRequest) => {
    setTurnOverRequest(data);
  }, []);

  return (
    <TurnOverContentForm
      name={name}
      turnOverRequest={turnOverRequest}
      onNameChange={setName}
      onTurnOverRequestChange={handleTurnOverRequestChange}
      onSave={handleSave}
      onCancel={onCancel}
    />
  );
};

export default TurnOverContentCreate;

