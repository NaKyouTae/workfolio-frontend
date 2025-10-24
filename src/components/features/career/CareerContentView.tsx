import React from 'react';
import { ResumeDetail } from '@/generated/common';
import CareerView from './view/CareerView';
import ProjectView from './view/ProjectView';
import EducationView from './view/EducationView';
import ActivityView from './view/ActivityView';
import LanguageSkillView from './view/LanguageSkillView';
import AttachmentView from './view/AttachmentView';

interface CareerContentViewProps {
  selectedResumeDetail: ResumeDetail | null;
  onEdit: () => void;
}

/**
 * 이력서 상세 정보를 읽기 전용으로 표시하는 컴포넌트
 * 모든 View 컴포넌트들을 포함합니다
 */
const CareerContentView: React.FC<CareerContentViewProps> = ({ selectedResumeDetail, onEdit }) => {

  // 복제 핸들러
  const handleDuplicate = () => {
    // TODO: 복제 기능 구현
    console.log('복제:', selectedResumeDetail);
    alert('복제 기능은 추후 구현될 예정입니다.');
  };

  // PDF 내보내기 핸들러
  const handleExportPDF = () => {
    // TODO: PDF 내보내기 기능 구현
    console.log('PDF 내보내기:', selectedResumeDetail);
    alert('PDF 내보내기 기능은 추후 구현될 예정입니다.');
  };

  return (
    <div>
      <div style={{ 
        padding: '20px 30px', 
        backgroundColor: '#fff', 
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#333', 
            margin: 0 
          }}>
            {selectedResumeDetail?.title}
          </h1>
          
          {/* 액션 링크들 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px'
          }}>
            <button
              onClick={onEdit}
              style={{
                background: 'none',
                border: 'none',
                color: '#2196f3',
                cursor: 'pointer',
                padding: '4px 8px',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              편집
            </button>
            <span style={{ color: '#ddd' }}>|</span>
            <button
              onClick={handleDuplicate}
              style={{
                background: 'none',
                border: 'none',
                color: '#2196f3',
                cursor: 'pointer',
                padding: '4px 8px',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              복제
            </button>
            <span style={{ color: '#ddd' }}>|</span>
            <button
              onClick={handleExportPDF}
              style={{
                background: 'none',
                border: 'none',
                color: '#2196f3',
                cursor: 'pointer',
                padding: '4px 8px',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              PDF 내보내기
            </button>
          </div>
        </div>
      </div>
      <div style={{ 
        padding: '30px', 
        overflow: 'auto',
        backgroundColor: '#f8f9fa',
        flex: 1
      }}>
        <EducationView educations={selectedResumeDetail?.educations || []} />
        <CareerView careers={selectedResumeDetail?.careers || []} />
        <ProjectView projects={selectedResumeDetail?.projects || []} />
        <ActivityView activities={selectedResumeDetail?.activities || []} />
        <LanguageSkillView languageSkills={selectedResumeDetail?.languageSkills || []} />
        <AttachmentView attachments={selectedResumeDetail?.attachments || []} />
      </div>
    </div>
  );
};

export default CareerContentView;

