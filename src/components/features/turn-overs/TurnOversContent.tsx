import React, { useState, useEffect } from 'react';
import TurnOversContentView from './content/TurnOverContentView';
import { TurnOverDetail } from '@/generated/common';
import TurnOversIntegrationPage from './content/TurnOversIntegrationPage';
import TurnOverContentEdit from './content/TurnOverContentEdit';
import { TurnOverUpsertRequest } from '@/generated/turn_over';

type ViewMode = 'home' | 'view' | 'edit';

interface TurnOversContentProps {
  selectedTurnOver: TurnOverDetail | null;
  isNewTurnOver?: boolean;
  onSave?: (data: TurnOverUpsertRequest) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

const TurnOversContent  : React.FC<TurnOversContentProps> = ({ selectedTurnOver, isNewTurnOver = false, onSave, onDuplicate, onDelete }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('home');

  // selectedTurnOver 변경 시 모드 자동 업데이트
  useEffect(() => {
    if (selectedTurnOver) {
      // 새로운 턴오버면 edit 모드로, 아니면 view 모드로
      setViewMode(isNewTurnOver ? 'edit' : 'view');
    } else {
      setViewMode('home'); // 선택 해제되면 home 모드로
    }
  }, [selectedTurnOver, isNewTurnOver]);

  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleSave = (data: TurnOverUpsertRequest) => {
    if (onSave) {
      onSave(data);
      handleModeChange('view');
    }
  };

  const handleCancel = () => {
    handleModeChange('view');
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
          selectedTurnOver={selectedTurnOver}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default TurnOversContent;
