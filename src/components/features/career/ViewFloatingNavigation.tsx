import React from 'react';
import styles from './CareerContentView.module.css';

interface ViewFloatingNavigationProps {
  onExportPDF: () => void;
  onCopyURL: () => void;
}

const ViewFloatingNavigation: React.FC<ViewFloatingNavigationProps> = ({
  onExportPDF,
  onCopyURL
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
            프로젝트/경험
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
      {/* PDF 내보내기 / URL 복사 버튼 */}
      <div className={styles.floatingActions}>
        <button
          onClick={onExportPDF}
          className={styles.floatingSaveButton}
        >
          PDF 내보내기
        </button>
        <button
          onClick={onCopyURL}
          className={styles.floatingCancelButton}
        >
          URL 복사하기
        </button>
      </div>
    </div>
  );
};

export default ViewFloatingNavigation;

