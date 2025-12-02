import React, { useState } from 'react';
import TurnOversContentView from './content/TurnOverContentView';
import { TurnOverDetail } from '@/generated/common';
import TurnOversIntegration from './content/TurnOversIntegration';
import TurnOverContentEdit from './content/TurnOverContentEdit';
import TurnOverContentCreate from './content/TurnOverContentCreate';
import { TurnOverUpsertRequest } from '@/generated/turn_over';
import { useConfirm } from '@/hooks/useConfirm';
import { isLoggedIn } from '@/utils/authUtils';
import LoginModal from '@/components/portal/ui/LoginModal';
import LoadingScreen from '@/components/portal/ui/LoadingScreen';

import Footer from "@/components/portal/layouts/Footer"

type ViewMode = 'home' | 'view' | 'edit';

interface TurnOversContentProps {
  selectedTurnOver: TurnOverDetail | null;
  isNewTurnOver?: boolean;
  viewMode: ViewMode;
  isLoading?: boolean;
  onTurnOverSelect?: (id: string) => void;
  onTurnOverSelectAndEdit?: (id: string, fromMode: ViewMode) => void;
  onSave?: (data: TurnOverUpsertRequest) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEnterEdit?: (fromMode: ViewMode) => void;
  onCancelEdit?: () => void;
  onSaveComplete?: (mode: ViewMode) => void;
  onTurnOverUpdate?: () => void;
}

const TurnOversContent  : React.FC<TurnOversContentProps> = ({ 
  selectedTurnOver, 
  isNewTurnOver = false, 
  viewMode,
  isLoading = false,
  onTurnOverSelect,
  onTurnOverSelectAndEdit,
  onSave, 
  onDuplicate, 
  onDelete,
  onEnterEdit,
  onCancelEdit,
  onSaveComplete,
  onTurnOverUpdate,
}) => {
  const { confirm } = useConfirm();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 현재 표시할 모드 결정
  const getCurrentViewMode = (): ViewMode => {
    // viewMode가 'home'이면 무조건 home 반환 (깜빡임 방지)
    if (viewMode === 'home') {
      return 'home';
    }
    // viewMode가 명시적으로 설정되어 있으면 그것을 우선 (로딩 중에도 view 모드 유지)
    if (viewMode === 'view' || viewMode === 'edit') {
      if (isNewTurnOver) {
        return 'edit';
      }
      return viewMode;
    }
    // selectedTurnOver가 없으면 home 반환
    if (!selectedTurnOver) {
      return 'home';
    }
    if (isNewTurnOver) {
      return 'edit';
    }
    return viewMode;
  };

  const currentViewMode = getCurrentViewMode();

  const handleTurnOverSelect = (id: string) => {
    if (onTurnOverSelect) {
      onTurnOverSelect(id);
    }
  };

  const handleTurnOverEdit = (id: string) => {
    // 현재 모드 저장 (home 또는 view)
    const fromMode = currentViewMode === 'view' ? 'view' : 'home';
    
    // 다른 turnOver 선택 시
    if (!selectedTurnOver || selectedTurnOver.id !== id) {
      // turnOver를 선택하면서 동시에 edit 모드로 전환
      if (onTurnOverSelectAndEdit) {
        onTurnOverSelectAndEdit(id, fromMode);
      }
    } else {
      // 이미 선택된 turnOver인 경우 바로 edit 모드로 전환
      if (onEnterEdit) {
        onEnterEdit(fromMode);
      }
    }
  };

  // 이미 선택된 상태에서 edit 모드로 전환
  const handleEditCurrentTurnOver = () => {
    if (onEnterEdit) {
      onEnterEdit('view');
      if (selectedTurnOver && onTurnOverSelectAndEdit) {
        onTurnOverSelectAndEdit(selectedTurnOver.id, 'view');
      }
    }
  };

  const handleSave = async (data: TurnOverUpsertRequest, mode: ViewMode = 'view') => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    
    if (onSave) {
      // onSave가 완료된 후 onSaveComplete 호출
      await onSave(data);
    }
    if (onSaveComplete) {
      onSaveComplete(mode);
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

    if (result && onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleDuplicate = (id: string) => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    
    if (onDuplicate) {
      onDuplicate(id);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    
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

  const handleTurnOverUpdate = () => {
    if (onTurnOverUpdate) {
      onTurnOverUpdate();
    }
  };

  // 로딩 중이고 view 모드일 때 로딩 화면 표시
  if (isLoading && currentViewMode === 'view') {
    return (
      <section>
        <LoadingScreen />
        <Footer/>
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </section>
    );
  }

  return (
    <section>
        {currentViewMode === 'home' && (
          <TurnOversIntegration 
            onSelectTurnOver={handleTurnOverSelect} 
            onEdit={handleTurnOverEdit} 
            onDuplicate={handleDuplicate} 
            onDelete={handleDelete}
            isLoading={isLoading && viewMode === 'home'}
          />
        )}
        {currentViewMode === 'view' && selectedTurnOver && (
          <TurnOversContentView 
              selectedTurnOver={selectedTurnOver} 
              isLoading={isLoading}
              onEdit={handleEditCurrentTurnOver}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onUpdate={handleTurnOverUpdate}
              onShowLoginModal={() => setShowLoginModal(true)}
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
              onSave={(data) => {
                // 저장 후 view 모드로 돌아가기 (이전 모드는 TurnOversPage에서 관리)
                handleSave(data, 'view');
              }}
          />
        )}
        <Footer/>
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </section>
  );
};

export default TurnOversContent;
