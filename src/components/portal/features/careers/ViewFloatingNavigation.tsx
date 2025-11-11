import React, { useState } from 'react';

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
  const [activeSection, setActiveSection] = useState<string>('basic-info');

  const sections = [
    { id: 'basic-info', label: '기본 정보' },
    { id: 'education', label: '학력' },
    { id: 'career', label: '경력' },
    { id: 'project', label: '프로젝트' },
    { id: 'activity', label: '활동' },
    { id: 'language', label: '언어' },
    { id: 'attachment', label: '첨부' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  return (
    <nav>
        <ul className="nav-wrap">
          {sections.map((section) => (
            <li
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={activeSection === section.id ? 'active' : ''}
            >
              {section.label}
            </li>
          ))}
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

