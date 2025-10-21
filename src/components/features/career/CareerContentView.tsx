import React from 'react';
import { Resume } from '@/generated/common';
import CareerView from './view/CareerView';
import EducationView from './view/EducationView';

interface CareerContentViewProps {
  selectedResume: Resume;
}

/**
 * 이력서 상세 정보를 읽기 전용으로 표시하는 컴포넌트
 * 모든 View 컴포넌트들을 포함합니다
 */
const CareerContentView: React.FC<CareerContentViewProps> = ({ selectedResume }) => {
  return (
    <div style={{ 
      padding: '30px', 
      overflow: 'auto',
      backgroundColor: '#f8f9fa',
      flex: 1
    }}>
      <CareerView />
      <EducationView />
    </div>
  );
};

export default CareerContentView;

