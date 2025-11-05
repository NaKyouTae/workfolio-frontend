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
  onTurnOverSelect?: (id: string) => void;
  onSave?: (data: TurnOverUpsertRequest) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TurnOversContent  : React.FC<TurnOversContentProps> = ({ selectedTurnOver, isNewTurnOver = false, 
  onTurnOverSelect, onSave, onDuplicate, onDelete }) => {
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

  const handleTurnOverSelect = (id: string) => {
    console.log('handleTurnOverSelect', id);
    if (onTurnOverSelect) {
      onTurnOverSelect(id);
    }
    handleModeChange('view');
  };

  const handleTurnOverEdit = (id: string) => {
    console.log('handleTurnOverEdit', id);
    if (onTurnOverSelect) {
      onTurnOverSelect(id);
    }
    handleModeChange('edit');
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

  const handleDuplicate = (id: string) => {
    if (onDuplicate) {
      onDuplicate(id);
    }
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {viewMode === 'home' && <TurnOversIntegrationPage 
        onSelectTurnOver={handleTurnOverSelect} 
        onEdit={handleTurnOverEdit} 
        onDuplicate={handleDuplicate} 
        onDelete={handleDelete} 
      />}
      {viewMode === 'view' && selectedTurnOver && (
        <TurnOversContentView 
          selectedTurnOver={selectedTurnOver} 
          onEdit={handleTurnOverEdit}
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
