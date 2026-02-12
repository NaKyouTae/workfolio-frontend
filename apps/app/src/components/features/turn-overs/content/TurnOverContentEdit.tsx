import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { TurnOverDetail, TurnOverRetrospective_EmploymentType } from '@workfolio/shared/generated/common';
import { TurnOverUpsertRequest, TurnOverUpsertRequest_TurnOverChallengeRequest, TurnOverUpsertRequest_TurnOverGoalRequest, TurnOverUpsertRequest_TurnOverRetrospectiveRequest } from '@workfolio/shared/generated/turn_over';
import TurnOverContentForm from './TurnOverContentForm';

interface TurnOverContentEditProps {
  selectedTurnOver: TurnOverDetail | null;
  onSave?: (data: TurnOverUpsertRequest) => void;
  onCancel?: () => void;
}

// selectedTurnOver에서 TurnOverUpsertRequest를 생성하는 헬퍼 함수
const createTurnOverRequestFromDetail = (selectedTurnOver: TurnOverDetail | null): TurnOverUpsertRequest | null => {
  if (!selectedTurnOver) {
    return null;
  }

  return {
    id: selectedTurnOver.id || undefined,
    name: selectedTurnOver.name || '제목 없음',
    startedAt: selectedTurnOver.startedAt || undefined,
    endedAt: selectedTurnOver.endedAt || undefined,
    turnOverGoal: {
      id: selectedTurnOver.turnOverGoal?.id || undefined,
      reason: selectedTurnOver.turnOverGoal?.reason || '',
      goal: selectedTurnOver.turnOverGoal?.goal || '',
      selfIntroductions: selectedTurnOver.turnOverGoal?.selfIntroductions || [],
      interviewQuestions: selectedTurnOver.turnOverGoal?.interviewQuestions || [],
      checkList: selectedTurnOver.turnOverGoal?.checkList || [],
      memos: selectedTurnOver.turnOverGoal?.memos || [],
      attachments: selectedTurnOver.turnOverGoal?.attachments || [],
    } as TurnOverUpsertRequest_TurnOverGoalRequest,
    turnOverChallenge: {
      id: selectedTurnOver.turnOverChallenge?.id || undefined,
      memos: selectedTurnOver.turnOverChallenge?.memos || [],
      attachments: selectedTurnOver.turnOverChallenge?.attachments || [],
      jobApplications: selectedTurnOver.turnOverChallenge?.jobApplications || [],
    } as TurnOverUpsertRequest_TurnOverChallengeRequest,
    turnOverRetrospective: {
      id: selectedTurnOver.turnOverRetrospective?.id || undefined,
      name: selectedTurnOver.turnOverRetrospective?.name || '',
      salary: selectedTurnOver.turnOverRetrospective?.salary || 0,
      position: selectedTurnOver.turnOverRetrospective?.position || '',
      jobTitle: selectedTurnOver.turnOverRetrospective?.jobTitle || '',
      rank: selectedTurnOver.turnOverRetrospective?.rank || '',
      reason: selectedTurnOver.turnOverRetrospective?.reason || '',
      score: selectedTurnOver.turnOverRetrospective?.score || 0,
      joinedAt: selectedTurnOver.turnOverRetrospective?.joinedAt || 0,
      reviewSummary: selectedTurnOver.turnOverRetrospective?.reviewSummary || '',
      department: selectedTurnOver.turnOverRetrospective?.department || '',
      memos: selectedTurnOver.turnOverRetrospective?.memos || [],
      attachments: selectedTurnOver.turnOverRetrospective?.attachments || [],
      workType: selectedTurnOver.turnOverRetrospective?.workType || '',
      employmentType: selectedTurnOver.turnOverRetrospective?.employmentType || TurnOverRetrospective_EmploymentType.EMPLOYMENT_TYPE_UNKNOWN,
    } as TurnOverUpsertRequest_TurnOverRetrospectiveRequest,
  } as TurnOverUpsertRequest;
};

// 깊은 비교 함수 (컴포넌트 외부로 이동하여 재생성 방지)
const deepEqual = (obj1: unknown, obj2: unknown): boolean => {
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
  
  const obj1Record = obj1 as Record<string, unknown>;
  const obj2Record = obj2 as Record<string, unknown>;
  
  const keys1 = Object.keys(obj1Record);
  const keys2 = Object.keys(obj2Record);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    
    const val1 = obj1Record[key];
    const val2 = obj2Record[key];
    
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

const TurnOverContentEdit: React.FC<TurnOverContentEditProps> = ({
  selectedTurnOver,
  onSave,
  onCancel,
}) => {
  // 초기값을 selectedTurnOver에서 바로 계산하여 깜빡임 방지
  const initialRequest = useMemo(() => createTurnOverRequestFromDetail(selectedTurnOver), [selectedTurnOver]);
  const initialName = useMemo(() => selectedTurnOver?.name || '', [selectedTurnOver]);
  
  const [name, setName] = useState(initialName);
  const [turnOverRequest, setTurnOverRequest] = useState<TurnOverUpsertRequest | null>(initialRequest);
  const prevTurnOverRequestRef = useRef<TurnOverUpsertRequest | null>(initialRequest);
  const selectedTurnOverIdRef = useRef<string | undefined>(selectedTurnOver?.id);

  // selectedTurnOver가 변경될 때만 초기화
  useEffect(() => {
    const currentId = selectedTurnOver?.id;
    
    // selectedTurnOver의 id가 변경된 경우 또는 데이터가 변경된 경우 초기화
    if (currentId !== selectedTurnOverIdRef.current) {
      selectedTurnOverIdRef.current = currentId;
      const newRequest = createTurnOverRequestFromDetail(selectedTurnOver);
      const newName = selectedTurnOver?.name || '';
      
      setName(newName);
      setTurnOverRequest(newRequest);
      prevTurnOverRequestRef.current = newRequest;
    } else if (currentId && selectedTurnOver) {
      // 같은 id이지만 데이터가 변경되었을 수 있으므로 깊은 비교 후 업데이트
      const newRequest = createTurnOverRequestFromDetail(selectedTurnOver);
      const currentRequest = prevTurnOverRequestRef.current;
      
      // 깊은 비교를 통해 실제로 변경되었는지 확인
      if (!currentRequest || !deepEqual(currentRequest, newRequest)) {
        const newName = selectedTurnOver?.name || '';
        setName(newName);
        setTurnOverRequest(newRequest);
        prevTurnOverRequestRef.current = newRequest;
      }
    }
  }, [selectedTurnOver]);

  // 실제로 값이 변경되었을 때만 업데이트
  const handleTurnOverRequestChange = useCallback((data: TurnOverUpsertRequest) => {
    const prev = prevTurnOverRequestRef.current;
    
    // 깊은 비교를 통해 실제로 변경되었을 때만 업데이트
    if (!prev || !deepEqual(prev, data)) {
      prevTurnOverRequestRef.current = data;
      setTurnOverRequest(data);
    }
  }, []);

  // turnOverRequest가 준비되지 않았으면 렌더링하지 않음 (깜빡임 방지)
  if (!turnOverRequest || !selectedTurnOver) {
    return null;
  }

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
