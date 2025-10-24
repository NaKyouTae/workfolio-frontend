import React from 'react';
import styles from './CareerContentEdit.module.css';

interface FloatingNavigationProps {
  isLoading: boolean;
  onSave: () => void;
  onCancel?: () => void;
}

const FloatingNavigation: React.FC<FloatingNavigationProps> = ({
  isLoading,
  onSave,
  onCancel
}) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            disabled={isLoading}
            className={styles.floatingSaveButton}
            >
            {isLoading ? '저장 중...' : '이력 저장'}
            </button>
            <button
            onClick={() => onCancel?.()}
            className={styles.floatingCancelButton}
            >
            취소
        </button>
      </div>
    </div>
  );
};

export default FloatingNavigation;

