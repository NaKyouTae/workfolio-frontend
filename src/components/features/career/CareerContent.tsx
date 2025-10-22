import React, { useState } from 'react';
import { ResumeDetail } from '@/generated/common';
import CareerContentView from './CareerContentView';
import CareerContentEdit from './CareerContentEdit';

interface CareerContentProps {
  selectedResumeDetail: ResumeDetail | null;
  onRefresh?: () => void;
}

/**
 * 이력서 상세 콘텐츠를 관리하는 컴포넌트
 * 편집 모드와 읽기 모드를 전환합니다
 */
const CareerContent: React.FC<CareerContentProps> = ({ selectedResumeDetail, onRefresh }) => {
  // 편집 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  
  // 편집 모드 토글
  const handleEdit = () => {
    setIsEditMode(prev => !prev);
  };

  // 편집 완료 (저장 후 읽기 모드로 전환)
  const handleEditComplete = async () => {
    setIsEditMode(false);
    // 이력서 목록 리프레시
    if (onRefresh) {
      await onRefresh();
    }
  };

  // 편집 취소 (읽기 모드로 전환)
  const handleEditCancel = () => {
    setIsEditMode(false);
  };

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {isEditMode ? (
        <CareerContentEdit 
          selectedResumeDetail={selectedResumeDetail}
          onSave={handleEditComplete}
          onCancel={handleEditCancel}
        />
      ) : (
        <CareerContentView 
          selectedResumeDetail={selectedResumeDetail}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default CareerContent;

