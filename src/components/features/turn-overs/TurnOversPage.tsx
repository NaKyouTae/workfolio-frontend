import React, { useState } from 'react';
import TurnOversSidebar from './TurnOversSidebar';
import TurnOversContent from './TurnOversContent';
import { TurnOver, TurnOverDetail } from '@/generated/common';
import { useTurnOver } from '@/hooks/useTurnOver';

const TurnOversPage: React.FC = () => {
  const [selectedTurnOver, setSelectedTurnOver] = useState<TurnOverDetail | null>(null);
  const { turnOvers, refreshTurnOvers, getTurnOverDetail, duplicateTurnOver, deleteTurnOver } = useTurnOver();
  
  const onGoHome = () => {
    setSelectedTurnOver(null);
  };
  
  const onTurnOverSelect = async (turnOver: TurnOver) => {
    const turnOverDetail = await getTurnOverDetail(turnOver.id);
    if (turnOverDetail) {
      setSelectedTurnOver(turnOverDetail);
    }
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

  return (
    <main style={{ display: 'flex', height: 'calc(100vh - 6.4rem)', backgroundColor: '#f8f9fa' }}>
      <TurnOversSidebar turnOvers={turnOvers} onGoHome={onGoHome} refreshTurnOvers={refreshTurnOvers} onTurnOverSelect={onTurnOverSelect} />
      <TurnOversContent selectedTurnOver={selectedTurnOver} onDuplicate={onDuplicate} onDelete={onDelete} />
    </main>
  );
};

export default TurnOversPage;
