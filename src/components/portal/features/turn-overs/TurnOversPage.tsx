import React, { useState } from 'react';
import TurnOversSidebar from './TurnOversSidebar';
import TurnOversContent from './TurnOversContent';
import { TurnOverDetail } from '@/generated/common';
import { useTurnOver } from '@/hooks/useTurnOver';
import { TurnOverUpsertRequest } from '@/generated/turn_over';

const TurnOversPage: React.FC = () => {
  const [selectedTurnOver, setSelectedTurnOver] = useState<TurnOverDetail | null>(null);
  const [isNewTurnOver, setIsNewTurnOver] = useState(false);
  const { turnOvers, refreshTurnOvers, upsertTurnOver, getTurnOverDetail, duplicateTurnOver, deleteTurnOver } = useTurnOver();
  
  const onGoHome = () => {
    setSelectedTurnOver(null);
    setIsNewTurnOver(false);
  };
  
  const onTurnOverSelect = async (id: string) => {
    const turnOverDetail = await getTurnOverDetail(id);
    if (turnOverDetail) {
      setSelectedTurnOver(turnOverDetail);
      setIsNewTurnOver(false);
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
            onTurnOverSelect={onTurnOverSelect} 
            onSave={onSave} 
            onDuplicate={onDuplicate} 
            onDelete={onDelete} 
        />
    </main>
  );
};

export default TurnOversPage;
