import React from 'react';
import styles from './CareerContentView.module.css';

interface ViewFloatingNavigationProps {
  showHidden: boolean;
  onTogglePrivateInfo: () => void;
  onExportPDF: () => void;
  onCopyURL: () => void;
}

const ViewFloatingNavigation: React.FC<ViewFloatingNavigationProps> = ({
  showHidden,
  onTogglePrivateInfo,
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
    <nav>
        <ul className="nav-wrap">
            <li onClick={() => scrollToSection('basic-info')} className="active">기본 정보</li>
            <li onClick={() => scrollToSection('education')}>학력</li>
            <li onClick={() => scrollToSection('career')}>경력</li>
            <li onClick={() => scrollToSection('project')}>프로젝트</li>
            <li onClick={() => scrollToSection('activity')}>활동</li>
            <li onClick={() => scrollToSection('language')}>언어</li>
            <li onClick={() => scrollToSection('attachment')}>첨부</li>
        </ul>
        <div className="nav-btn">
            <button className="line gray" onClick={onTogglePrivateInfo}>{showHidden ? '비공개 정보 숨기기' : '비공개 정보 보기'}</button>
            <button className="dark-gray" onClick={onExportPDF}>PDF 내보내기</button>
            <button className="dark-gray" onClick={onCopyURL}>URL 공유하기</button>
        </div>
    </nav>
  );
};

export default ViewFloatingNavigation;

