import React, { useState } from 'react';
import TurnOversSidebar from './TurnOversSidebar';
import TurnOversContent from './TurnOversContent';
import { TurnOverDetail } from '@/generated/common';
import { useTurnOver } from '@/hooks/useTurnOver';
import { TurnOverUpsertRequest } from '@/generated/turn_over';

type ViewMode = 'home' | 'view' | 'edit';

const TurnOversPage: React.FC = () => {
  const [selectedTurnOver, setSelectedTurnOver] = useState<TurnOverDetail | null>(null);
  const [isNewTurnOver, setIsNewTurnOver] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [previousMode, setPreviousMode] = useState<ViewMode>('home'); // edit로 들어가기 전 모드 저장
  const { turnOvers, refreshTurnOvers, upsertTurnOver, getTurnOverDetail, duplicateTurnOver, deleteTurnOver } = useTurnOver();
  
  const onGoHome = () => {
    setSelectedTurnOver(null);
    setIsNewTurnOver(false);
    setViewMode('home');
  };
  
  const onTurnOverSelect = async (id: string) => {
    const turnOverDetail = await getTurnOverDetail(id);
    if (turnOverDetail) {
      setSelectedTurnOver(turnOverDetail);
      setIsNewTurnOver(false);
      setViewMode('view');
    }
  };

  // edit 모드로 진입하면서 turnOver 선택
  const onTurnOverSelectAndEdit = async (id: string, fromMode: ViewMode) => {
    const turnOverDetail = await getTurnOverDetail(id);
    if (turnOverDetail) {
      setSelectedTurnOver(turnOverDetail);
      setIsNewTurnOver(false);
      setPreviousMode(fromMode);
      setViewMode('edit');
    }
  };

  const onSave = async (data: TurnOverUpsertRequest) => {
    const savedId = await upsertTurnOver(data);
    if (savedId) {
      await refreshTurnOvers();
      setIsNewTurnOver(false);
      
      // 저장된 데이터를 다시 조회하여 갱신
      const updatedTurnOverDetail = await getTurnOverDetail(savedId);
      if (updatedTurnOverDetail) {
        setSelectedTurnOver(updatedTurnOverDetail);
      }
    }
  };

  const onDuplicate = (id: string) => {
      duplicateTurnOver(id).then((success) => {
      if (success) {
        refreshTurnOvers();
        setSelectedTurnOver(null);
        onGoHome();
      }
    });
  };

  const onDelete = (id: string) => {
    deleteTurnOver(id).then((success) => {
      if (success) {
        refreshTurnOvers();
        setSelectedTurnOver(null);
        onGoHome();
      }
    });
  };

  const onTurnOverCreated = () => {
    // 새로운 빈 TurnOverDetail 생성
    const newTurnOver: TurnOverDetail = {
      id: '',
      name: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      turnOverGoal: undefined,
      turnOverChallenge: undefined,
      turnOverRetrospective: undefined,
    };
    
    setSelectedTurnOver(newTurnOver);
    setIsNewTurnOver(true);
    setViewMode('edit');
  };

  // edit 모드로 진입 (이전 모드 저장)
  const onEnterEdit = (fromMode: ViewMode) => {
    setPreviousMode(fromMode);
    setViewMode('edit');
  };

  // 취소 시 이전 모드로 복귀
  const onCancelEdit = () => {
    setViewMode(previousMode);
    if (previousMode === 'home') {
      setSelectedTurnOver(null);
      setIsNewTurnOver(false);
    }
  };

  // 저장 후 모드 변경
  const onSaveComplete = (mode: ViewMode) => {
    // mode가 'view'이고 previousMode가 'home'이면 home으로, 아니면 view로
    if (mode === 'view' && previousMode === 'home') {
      setViewMode('home');
      setSelectedTurnOver(null);
      setIsNewTurnOver(false);
    } else {
      setViewMode(mode);
    }
    // 저장 후에는 previousMode 초기화
    if (mode !== 'edit') {
      setPreviousMode(mode);
    }
  };

  return (
    <main>
        <TurnOversSidebar 
            turnOvers={turnOvers} 
            onGoHome={onGoHome} 
            refreshTurnOvers={refreshTurnOvers} 
            onTurnOverSelect={onTurnOverSelect} 
            onTurnOverCreated={onTurnOverCreated} 
        />
        <TurnOversContent 
            selectedTurnOver={selectedTurnOver} 
            isNewTurnOver={isNewTurnOver}
            viewMode={viewMode}
            onTurnOverSelect={onTurnOverSelect} 
            onTurnOverSelectAndEdit={onTurnOverSelectAndEdit}
            onSave={onSave} 
            onDuplicate={onDuplicate} 
            onDelete={onDelete}
            onEnterEdit={onEnterEdit}
            onCancelEdit={onCancelEdit}
            onSaveComplete={onSaveComplete}
        />
    </main>
  );
};

export default TurnOversPage;
