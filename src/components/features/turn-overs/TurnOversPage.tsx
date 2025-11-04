import React, { useState } from 'react';
import TurnOversSidebar from './TurnOversSidebar';
import TurnOversContent from './TurnOversContent';
import { TurnOver } from '@/generated/common';

const TurnOversPage: React.FC = () => {
  const [selectedTurnOver, setSelectedTurnOver] = useState<TurnOver | null>(null);
  
  const onGoHome = () => {
    setSelectedTurnOver(null);
  };
  
  return (
    <main style={{ display: 'flex', height: 'calc(100vh - 6.4rem)', backgroundColor: '#f8f9fa' }}>
      <TurnOversSidebar selectedTurnOver={selectedTurnOver} onGoHome={onGoHome} onTurnOverSelect={setSelectedTurnOver} />
      <TurnOversContent selectedTurnOver={selectedTurnOver} />
    </main>
  );
};

export default TurnOversPage;
