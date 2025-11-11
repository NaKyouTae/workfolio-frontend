import React, { useState } from 'react';
import TurnOversContentView from './content/TurnOverContentView';
import { TurnOverDetail } from '@/generated/common';
import TurnOversIntegration from './content/TurnOversIntegration';
import TurnOverContentEdit from './content/TurnOverContentEdit';
import TurnOverContentCreate from './content/TurnOverContentCreate';
import { TurnOverUpsertRequest } from '@/generated/turn_over';
import { useConfirm } from '@/hooks/useConfirm';

import Footer from "@/components/portal/layouts/Footer"

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
  const { confirm } = useConfirm();

  // props 변경에 따라 모드 결정
  const getViewMode = (): ViewMode => {
    if (!selectedTurnOver) {
      return 'home';
    }
    if (isNewTurnOver) {
      return 'edit';
    }
    return viewMode; // 수동으로 설정된 모드 유지 (view 또는 edit)
  };

  const currentViewMode = getViewMode();

  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleTurnOverSelect = (id: string) => {
    console.log('handleTurnOverSelect', id);
    handleModeChange('view');
    if (onTurnOverSelect) {
      onTurnOverSelect(id);
    }
  };

  const handleTurnOverEdit = (id: string) => {
    console.log('handleTurnOverEdit', id);
    
    // 이미 선택된 turnOver인 경우 바로 edit 모드로 전환
    if (selectedTurnOver && selectedTurnOver.id === id) {
      console.log('Already selected, switching to edit mode directly');
      handleModeChange('edit');
    } else {
      // 다른 turnOver 선택 시 edit 모드로 설정하고 선택
      console.log('Selecting new turnOver with edit mode');
      handleModeChange('edit');
      if (onTurnOverSelect) {
        onTurnOverSelect(id);
      }
    }
  };

  // 이미 선택된 상태에서 edit 모드로 전환 (id 필요 없음)
  const handleEditCurrentTurnOver = () => {
    console.log('handleEditCurrentTurnOver');
    handleModeChange('edit');
  };

  const handleSave = (data: TurnOverUpsertRequest, mode: ViewMode = 'view') => {
    if (onSave) {
      onSave(data);
      handleModeChange(mode);
    }
  };

  const handleCancel = async () => {
    const result = await confirm({
      title: '이직 활동 기록을 취소하시겠어요?',
      icon: '/assets/img/ico/ic-warning.svg',
      description: '지금까지 입력한 내용이 저장되지 않아요.\n지금 나가면 처음부터 다시 작성해야 할 수 있어요.',
      confirmText: '취소하기',
      cancelText: '돌아가기',
    });

    if (result) {
      handleModeChange('home');
    }
  };

  const handleDuplicate = (id: string) => {
    if (onDuplicate) {
      onDuplicate(id);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await confirm({
      title: '이직 활동을 삭제하시겠어요?',
      icon: '/assets/img/ico/ic-delete.svg',
      description: '삭제하면 이직 활동에 저장된 내용이 모두 사라져요.\n한 번 삭제하면 되돌릴 수 없어요.',
      confirmText: '삭제하기',
      cancelText: '돌아가기',
    });

    if (result && onDelete) {
      onDelete(id);
    }
  };

  return (
    <section>
        {currentViewMode === 'home' && <TurnOversIntegration 
        onSelectTurnOver={handleTurnOverSelect} 
        onEdit={handleTurnOverEdit} 
        onDuplicate={handleDuplicate} 
        onDelete={handleDelete} 
        />}
        {currentViewMode === 'view' && selectedTurnOver && (
          <TurnOversContentView 
              selectedTurnOver={selectedTurnOver} 
              onEdit={handleEditCurrentTurnOver}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
          />
        )}
        {currentViewMode === 'edit' && isNewTurnOver && (
          <TurnOverContentCreate 
              onCancel={handleCancel}
              onSave={(data) => handleSave(data, 'home')}
          />
        )}
        {currentViewMode === 'edit' && !isNewTurnOver && selectedTurnOver && (
          <TurnOverContentEdit 
              selectedTurnOver={selectedTurnOver}
              onCancel={handleCancel}
              onSave={(data) => handleSave(data, 'view')}
          />
        )}
        <Footer/>
    </section>
  );
};

export default TurnOversContent;
