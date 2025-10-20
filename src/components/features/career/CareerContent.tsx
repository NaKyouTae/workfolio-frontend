import React, { useState } from 'react';
import CareerContentHeader from './CareerContentHeader';
import { Resume } from '@/generated/common';
import CareerContentView from './CareerContentView';
import CareerContentEdit from './CareerContentEdit';

interface CareerContentProps {
  isLoggedIn: boolean;
  selectedResume: Resume;
}

/**
 * 이력서 상세 콘텐츠를 관리하는 컴포넌트
 * 편집 모드와 읽기 모드를 전환합니다
 */
const CareerContent: React.FC<CareerContentProps> = ({ isLoggedIn, selectedResume }) => {
  // 편집 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  
  // 편집 모드 토글
  const handleToggleEditMode = () => {
    setIsEditMode(prev => !prev);
  };

  // 편집 완료 (저장 후 읽기 모드로 전환)
  const handleEditComplete = () => {
    setIsEditMode(false);
  };

  // 편집 취소 (읽기 모드로 전환)
  const handleEditCancel = () => {
    setIsEditMode(false);
  };

  // 복제 핸들러
  const handleDuplicate = () => {
    // TODO: 복제 기능 구현
    console.log('복제:', selectedResume);
    alert('복제 기능은 추후 구현될 예정입니다.');
  };

  // PDF 내보내기 핸들러
  const handleExportPDF = () => {
    // TODO: PDF 내보내기 기능 구현
    console.log('PDF 내보내기:', selectedResume);
    alert('PDF 내보내기 기능은 추후 구현될 예정입니다.');
  };

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* 전체 헤더 */}
      <CareerContentHeader 
        selectedResume={selectedResume}
        isLoggedIn={isLoggedIn}
        isEditMode={isEditMode}
        onEdit={handleToggleEditMode}
        onDuplicate={handleDuplicate}
        onExportPDF={handleExportPDF}
      />

      {/* 편집 모드에 따라 View 또는 Edit 컴포넌트 렌더링 */}
      {isEditMode ? (
        <CareerContentEdit 
          selectedResume={selectedResume}
          onSave={handleEditComplete}
          onCancel={handleEditCancel}
        />
      ) : (
        <CareerContentView 
          selectedResume={selectedResume}
        />
      )}
    </div>
  );
};

export default CareerContent;

