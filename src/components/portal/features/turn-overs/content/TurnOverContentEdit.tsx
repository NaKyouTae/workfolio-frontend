import React, { useEffect, useState } from 'react';
import { TurnOverDetail, TurnOverRetrospective_EmploymentType } from '@/generated/common';
import { TurnOverUpsertRequest, TurnOverUpsertRequest_TurnOverChallengeRequest, TurnOverUpsertRequest_TurnOverGoalRequest, TurnOverUpsertRequest_TurnOverRetrospectiveRequest } from '@/generated/turn_over';
import TurnOverContentForm from './TurnOverContentForm';

interface TurnOverContentEditProps {
  selectedTurnOver: TurnOverDetail | null;
  onSave?: (data: TurnOverUpsertRequest) => void;
  onCancel?: () => void;
}

const TurnOverContentEdit: React.FC<TurnOverContentEditProps> = ({
  selectedTurnOver,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [turnOverRequest, setTurnOverRequest] = useState<TurnOverUpsertRequest | null>(null);

  // selectedTurnOver가 변경될 때만 초기화
  useEffect(() => {
    setName(selectedTurnOver?.name || '');
    
    setTurnOverRequest({
      id: selectedTurnOver?.id || undefined,
      name: selectedTurnOver?.name || '제목 없음',
      turnOverGoal: {
        id: selectedTurnOver?.turnOverGoal?.id || undefined,
        reason: selectedTurnOver?.turnOverGoal?.reason || '',
        goal: selectedTurnOver?.turnOverGoal?.goal || '',
        selfIntroductions: selectedTurnOver?.turnOverGoal?.selfIntroductions || [],
        interviewQuestions: selectedTurnOver?.turnOverGoal?.interviewQuestions || [],
        checkList: selectedTurnOver?.turnOverGoal?.checkList || [],
        memos: selectedTurnOver?.turnOverGoal?.memos || [],
        attachments: selectedTurnOver?.turnOverGoal?.attachments || [],
      } as TurnOverUpsertRequest_TurnOverGoalRequest,
      turnOverChallenge: {
        id: selectedTurnOver?.turnOverChallenge?.id || undefined,
        memos: selectedTurnOver?.turnOverChallenge?.memos || [],
        attachments: selectedTurnOver?.turnOverChallenge?.attachments || [],
        jobApplications: selectedTurnOver?.turnOverChallenge?.jobApplications || [],
      } as TurnOverUpsertRequest_TurnOverChallengeRequest,
      turnOverRetrospective: {
        id: selectedTurnOver?.turnOverRetrospective?.id || undefined,
        name: selectedTurnOver?.turnOverRetrospective?.name || '',
        salary: selectedTurnOver?.turnOverRetrospective?.salary || 0,
        position: selectedTurnOver?.turnOverRetrospective?.position || '',
        jobTitle: selectedTurnOver?.turnOverRetrospective?.jobTitle || '',
        rank: selectedTurnOver?.turnOverRetrospective?.rank || '',
        reason: selectedTurnOver?.turnOverRetrospective?.reason || '',
        score: selectedTurnOver?.turnOverRetrospective?.score || 0,
        joinedAt: selectedTurnOver?.turnOverRetrospective?.joinedAt || 0,
        reviewSummary: selectedTurnOver?.turnOverRetrospective?.reviewSummary || '',
        department: selectedTurnOver?.turnOverRetrospective?.department || '',
        memos: selectedTurnOver?.turnOverRetrospective?.memos || [],
        attachments: selectedTurnOver?.turnOverRetrospective?.attachments || [],
        workType: selectedTurnOver?.turnOverRetrospective?.workType || '',
        employmentType: selectedTurnOver?.turnOverRetrospective?.employmentType || TurnOverRetrospective_EmploymentType.EMPLOYMENT_TYPE_UNKNOWN,
      } as TurnOverUpsertRequest_TurnOverRetrospectiveRequest,
    } as TurnOverUpsertRequest);
  }, [selectedTurnOver]);

  const handleTurnOverRequestChange = (data: TurnOverUpsertRequest) => {
    setTurnOverRequest(data);
  };

  return (
    <TurnOverContentForm
      name={name}
      turnOverRequest={turnOverRequest}
      onNameChange={setName}
      onTurnOverRequestChange={handleTurnOverRequestChange}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
};

export default TurnOverContentEdit;
