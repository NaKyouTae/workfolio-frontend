import React from 'react';
import styles from './CareerContentEdit.module.css';
import { useConfirm } from '@/hooks/useConfirm';

interface EditFloatingNavigationProps {
  onSave: () => void;
  onCancel?: () => void;
}

const EditFloatingNavigation: React.FC<EditFloatingNavigationProps> = ({
  onSave,
  onCancel
}) => {
  const { confirm } = useConfirm();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancel = async () => {
    const result = await confirm({
      icon: '/assets/img/ico/ic-warning.png',
      title: '이력서 작성을 취소하시겠어요?',
      description: '지금까지 입력한 내용이 저장되지 않아요.\n지금 나가면 처음부터 다시 작성해야 할 수 있어요.',
      confirmText: '취소하기',
      cancelText: '돌아가기',
    });

    if (result) {
      onCancel?.();
    }
  };

  return (
    <div className={styles.floatingNav}>
      <div className={styles.navContent}>
        {/* 목차 */}
        <nav className={styles.tocList}>
          <button 
            onClick={() => scrollToSection('basic-info')} 
            className={styles.tocItem}
          >
            기본 정보
          </button>
          <button 
            onClick={() => scrollToSection('education')} 
            className={styles.tocItem}
          >
            학력
          </button>
          <button 
            onClick={() => scrollToSection('career')} 
            className={styles.tocItem}
          >
            경력
          </button>
          <button 
            onClick={() => scrollToSection('project')} 
            className={styles.tocItem}
          >
            프로젝트
          </button>
          <button 
            onClick={() => scrollToSection('activity')} 
            className={styles.tocItem}
          >
            활동
          </button>
          <button 
            onClick={() => scrollToSection('language')} 
            className={styles.tocItem}
          >
            언어
          </button>
          <button 
            onClick={() => scrollToSection('attachment')} 
            className={styles.tocItem}
          >
            첨부
          </button>
        </nav>
      </div>
      {/* 저장/취소 버튼 */}
      <div className={styles.floatingActions}>
        <button
            onClick={onSave}
            className={styles.floatingSaveButton}
            >
            저장하기
            </button>
            <button
            onClick={handleCancel}
            className={styles.floatingCancelButton}
            >
            취소
        </button>
      </div>
    </div>
  );
};

export default EditFloatingNavigation;

