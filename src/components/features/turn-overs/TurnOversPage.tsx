import React, { useState } from 'react';
import TurnOversSidebar from './TurnOversSidebar';
import TurnOversContent from './TurnOversContent';
import { TurnOver, TurnOverDetail } from '@/generated/common';
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
  
  const onTurnOverSelect = async (turnOver: TurnOver) => {
    const turnOverDetail = await getTurnOverDetail(turnOver.id);
    if (turnOverDetail) {
      setSelectedTurnOver(turnOverDetail);
      setIsNewTurnOver(false);
    }
  };

  const onSave = (data: TurnOverUpsertRequest) => {
    upsertTurnOver(data).then((success) => {
      if (success) {
        refreshTurnOvers();
        setIsNewTurnOver(false);
      }
    });
  };

  const onDuplicate = () => {
    if (selectedTurnOver) {
      duplicateTurnOver(selectedTurnOver.id).then((success) => {
        if (success) {
          refreshTurnOvers();
          setSelectedTurnOver(null);
        }
      });
    }
  };

  const onDelete = () => {
    if (selectedTurnOver) {
      deleteTurnOver(selectedTurnOver.id).then((success) => {
        if (success) {
          refreshTurnOvers();
          setSelectedTurnOver(null);
          onGoHome();
        }
      });
    }
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
    <main style={{ display: 'flex', height: 'calc(100vh - 6.4rem)', backgroundColor: '#f8f9fa' }}>
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
        onSave={onSave} 
        onDuplicate={onDuplicate} 
        onDelete={onDelete} 
      />
    </main>
  );
};

export default TurnOversPage;
