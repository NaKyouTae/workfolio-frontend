import React, { useState, useEffect } from 'react';
import TurnOversContentView from './content/TurnOverContentView';
import TurnOversContentEdit from './content/TurnOverContentEdit';
import { TurnOverDetail } from '@/generated/common';
import TurnOversIntegrationPage from './content/TurnOversIntegrationPage';

type ViewMode = 'home' | 'view' | 'edit';

interface TurnOversContentProps {
  selectedTurnOver: TurnOverDetail | null;
}

const TurnOversContent  : React.FC<TurnOversContentProps> = ({ selectedTurnOver }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('home');

  // selectedTurnOver 변경 시 모드 자동 업데이트
  useEffect(() => {
    if (selectedTurnOver) {
      setViewMode('view'); // 선택되면 view 모드로
    } else {
      setViewMode('home'); // 선택 해제되면 home 모드로
    }
  }, [selectedTurnOver]);

  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <div style={{ width: '100%' }}>
      {viewMode === 'home' && <TurnOversIntegrationPage onSelectTurnOver={() => handleModeChange('view')} />}
      {viewMode === 'view' && selectedTurnOver && (
        <TurnOversContentView 
          selectedTurnOverId={selectedTurnOver.id} 
          onEdit={() => handleModeChange('edit')}
        />
      )}
      {viewMode === 'edit' && selectedTurnOver && (
        <TurnOversContentEdit 
          selectedTurnOver={selectedTurnOver}
          onCancel={() => handleModeChange('view')}
        />
      )}
    </div>
  );
};

export default TurnOversContent;
