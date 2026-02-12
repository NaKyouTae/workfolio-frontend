import React, { useState } from 'react';
import CareerContentView from './CareerContentView';
import { ResumeDetail } from '@workfolio/shared/generated/common';
import CareerIntegration from './CareerIntegration';
import CareerContentEdit from './CareerContentEdit';
import CareerContentCreate from './CareerContentCreate';
import { useConfirm } from '@workfolio/shared/hooks/useConfirm';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import LoginModal from '@workfolio/shared/ui/LoginModal';
import CareerContentViewSkeleton from '@workfolio/shared/ui/skeleton/CareerContentViewSkeleton';

import Footer from "@/components/layouts/Footer"

type ViewMode = 'home' | 'view' | 'edit';

interface CareerContentProps {
  selectedResumeDetail: ResumeDetail | null;
  resumeDetails: ResumeDetail[];
  isNewResume?: boolean;
  viewMode: ViewMode;
  isLoading?: boolean;
  onResumeSelect?: (id: string) => void;
  onResumeSelectAndEdit?: (id: string) => void;
  onSave?: () => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEnterEdit?: (fromMode: ViewMode) => void;
  onCancelEdit?: () => void;
  onSaveComplete?: (mode: ViewMode) => void;
  duplicateResume?: (resumeId?: string, onSuccess?: () => void) => Promise<void>;
  deleteResume?: (resumeId?: string, onSuccess?: () => void) => Promise<void>;
  exportPDF?: (resumeId?: string, onSuccess?: () => void) => Promise<void>;
  copyURL?: (publicId?: string, onSuccess?: () => void) => Promise<void>;
  changeDefault: (resumeId?: string) => Promise<void>;
  calculateTotalCareer?: (resume: ResumeDetail) => string;
}

const CareerContent: React.FC<CareerContentProps> = ({ 
  selectedResumeDetail,
  resumeDetails,
  isNewResume = false, 
  viewMode,
  isLoading = false,
  onResumeSelect,
  onResumeSelectAndEdit,
  onSave, 
  onDuplicate, 
  onDelete,
  onEnterEdit,
  onCancelEdit,
  onSaveComplete,
  duplicateResume,
  deleteResume,
  exportPDF,
  copyURL,
  changeDefault,
  calculateTotalCareer,
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
      if (isNewResume) {
        return 'edit';
      }
      return viewMode;
    }
    // selectedResumeDetail이 없으면 home 반환
    if (!selectedResumeDetail) {
      return 'home';
    }
    if (isNewResume) {
      return 'edit';
    }
    return viewMode;
  };

  const currentViewMode = getCurrentViewMode();

  const handleResumeSelect = (resume: ResumeDetail) => {
    if (onResumeSelect) {
      // CareerIntegration에서 ResumeDetail을 전달하므로 id만 추출
      onResumeSelect(resume.id);
    }
  };

  const handleResumeEdit = (resume: ResumeDetail) => {
    // 현재 모드 저장 (home 또는 view)
    const fromMode = currentViewMode === 'view' ? 'view' : 'home';
    
    // 다른 resume 선택 시
    if (!selectedResumeDetail || selectedResumeDetail.id !== resume.id) {
      // resume를 선택하면서 동시에 edit 모드로 전환
      if (onResumeSelectAndEdit) {
        onResumeSelectAndEdit(resume.id);
      }
    } else {
      // 이미 선택된 resume인 경우 바로 edit 모드로 전환
      if (onEnterEdit) {
        onEnterEdit(fromMode);
      }
    }
  };

  // 이미 선택된 상태에서 edit 모드로 전환
  const handleEditCurrentResume = () => {
    if (onEnterEdit) {
      onEnterEdit('view');
      if (selectedResumeDetail && onResumeSelectAndEdit) {
        onResumeSelectAndEdit(selectedResumeDetail.id);
      }
    }
  };

  const handleCancel = async () => {
    const result = await confirm({
      title: '이력서 편집을 취소하시겠어요?',
      icon: '/assets/img/ico/ic-warning.svg',
      description: '지금까지 입력한 내용이 저장되지 않아요.\n지금 나가면 처음부터 다시 작성해야 할 수 있어요.',
      confirmText: '취소하기',
      cancelText: '돌아가기',
    });

    if (result && onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleDuplicate = async (id: string) => {
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
      title: '이력서를 삭제하시겠어요?',
      icon: '/assets/img/ico/ic-delete.svg',
      description: '삭제하면 이력서에 저장된 내용이 모두 사라져요.\n한 번 삭제하면 되돌릴 수 없어요.',
      confirmText: '삭제하기',
      cancelText: '돌아가기',
    });

    if (result && onDelete) {
      onDelete(id);
    }
  };

  // 로딩 중이고 view 모드일 때 스켈레톤 UI 표시
  if (isLoading && currentViewMode === 'view') {
    return (
      <section>
        <CareerContentViewSkeleton />
        <Footer/>
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </section>
    );
  }

  return (
    <section>
        {currentViewMode === 'home' && (
          <CareerIntegration 
            resumeDetails={resumeDetails}
            onView={handleResumeSelect} 
            onEdit={handleResumeEdit} 
            duplicateResume={(resumeId) => handleDuplicate(resumeId || '')}
            deleteResume={(resumeId) => handleDelete(resumeId || '')}
            // exportPDF={exportPDF}
            // copyURL={copyURL}
            calculateTotalCareer={(resume) => calculateTotalCareer?.(resume) || '경력 없음'}
            changeDefault={(resumeId) => changeDefault?.(resumeId || '')}
            isLoading={isLoading && viewMode === 'home'}
          />
        )}
        {currentViewMode === 'view' && selectedResumeDetail && (
          <CareerContentView 
              selectedResumeDetail={selectedResumeDetail} 
              isLoading={isLoading}
              onEdit={handleEditCurrentResume}
              duplicateResume={duplicateResume}
              deleteResume={deleteResume}
              exportPDF={exportPDF}
              copyURL={copyURL}
              changeDefault={changeDefault}
          />
        )}
        {currentViewMode === 'edit' && isNewResume && (
          <CareerContentCreate 
              onCancel={handleCancel}
              onSuccess={() => {
                // 저장 후 home 모드로 돌아가기
                if (onSave) {
                  onSave();
                }
                if (onSaveComplete) {
                  onSaveComplete('home');
                }
              }}
          />
        )}
        {currentViewMode === 'edit' && !isNewResume && selectedResumeDetail && (
          <CareerContentEdit 
              selectedResumeDetail={selectedResumeDetail}
              onCancel={handleCancel}
              onSave={() => {
                // 저장 후 view 모드로 돌아가기 (이전 모드는 CareerPage에서 관리)
                if (onSave) {
                  onSave();
                }
                if (onSaveComplete) {
                  onSaveComplete('view');
                }
              }}
          />
        )}
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </section>
  );
};

export default CareerContent;

