import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  const prevTurnOverRequestRef = useRef<TurnOverUpsertRequest | null>(null);
  const selectedTurnOverIdRef = useRef<string | undefined>(undefined);

  // selectedTurnOver가 변경될 때만 초기화
  useEffect(() => {
    const currentId = selectedTurnOver?.id;
    
    // selectedTurnOver의 id가 변경된 경우에만 초기화
    if (currentId !== selectedTurnOverIdRef.current) {
      selectedTurnOverIdRef.current = currentId;
      setName(selectedTurnOver?.name || '');
      
      const newRequest: TurnOverUpsertRequest = {
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
      } as TurnOverUpsertRequest;
      
      setTurnOverRequest(newRequest);
      prevTurnOverRequestRef.current = newRequest;
    }
  }, [selectedTurnOver]);

  // 깊은 비교 함수
  const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (!obj1 || !obj2) return false;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      
      const val1 = obj1[key];
      const val2 = obj2[key];
      
      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (JSON.stringify(val1) !== JSON.stringify(val2)) return false;
      } else if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
        if (!deepEqual(val1, val2)) return false;
      } else if (val1 !== val2) {
        return false;
      }
    }
    
    return true;
  };

  // 실제로 값이 변경되었을 때만 업데이트
  const handleTurnOverRequestChange = useCallback((data: TurnOverUpsertRequest) => {
    const prev = prevTurnOverRequestRef.current;
    
    // 깊은 비교를 통해 실제로 변경되었을 때만 업데이트
    if (!prev || !deepEqual(prev, data)) {
      prevTurnOverRequestRef.current = data;
      setTurnOverRequest(data);
    }
  }, []);

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
