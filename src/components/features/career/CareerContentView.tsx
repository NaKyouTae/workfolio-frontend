import React from 'react';
import { ResumeDetail } from '@/generated/common';
import CareerView from './view/CareerView';
import EducationView from './view/EducationView';
import ActivityView from './view/ActivityView';
import LanguageSkillView from './view/LanguageSkillView';
import AttachmentView from './view/AttachmentView';

interface CareerContentViewProps {
  selectedResumeDetail: ResumeDetail | null;
}

/**
 * 이력서 상세 정보를 읽기 전용으로 표시하는 컴포넌트
 * 모든 View 컴포넌트들을 포함합니다
 */
const CareerContentView: React.FC<CareerContentViewProps> = ({ selectedResumeDetail }) => {
  return (
    <div style={{ 
      padding: '30px', 
      overflow: 'auto',
      backgroundColor: '#f8f9fa',
      flex: 1
    }}>
      <EducationView educations={selectedResumeDetail?.educations || []} />
      <CareerView careers={selectedResumeDetail?.careers || []} />
      <ActivityView activities={selectedResumeDetail?.activities || []} />
      <LanguageSkillView languageSkills={selectedResumeDetail?.languageSkills || []} />
      <AttachmentView attachments={selectedResumeDetail?.attachments || []} />
    </div>
  );
};

export default CareerContentView;

