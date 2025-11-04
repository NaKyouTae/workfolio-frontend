import React, { useState, useEffect } from 'react';
import TurnOversContentView from './content/TurnOverContentView';
import { TurnOverDetail } from '@/generated/common';
import TurnOversIntegrationPage from './content/TurnOversIntegrationPage';
import TurnOverContentEdit from './content/TurnOverContentEdit';

type ViewMode = 'home' | 'view' | 'edit';

interface TurnOversContentProps {
  selectedTurnOver: TurnOverDetail | null;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

const TurnOversContent  : React.FC<TurnOversContentProps> = ({ selectedTurnOver, onDuplicate, onDelete }) => {
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

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {viewMode === 'home' && <TurnOversIntegrationPage onSelectTurnOver={() => handleModeChange('view')} />}
      {viewMode === 'view' && selectedTurnOver && (
        <TurnOversContentView 
          selectedTurnOver={selectedTurnOver} 
          onEdit={() => handleModeChange('edit')}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      )}
      {viewMode === 'edit' && selectedTurnOver && (
        <TurnOverContentEdit 
          selectedTurnOverId={selectedTurnOver.id}
          onCancel={() => handleModeChange('view')}
          onSave={() => handleModeChange('view')}
        />
      )}
    </div>
  );
};

export default TurnOversContent;
