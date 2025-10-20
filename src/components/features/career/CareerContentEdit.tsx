import React from 'react';
import { Resume } from '@/generated/common';
import CompanyEdit from './edit/CompanyEdit';
import CertificationEdit from './edit/CertificationEdit';
import DegreesEdit from './edit/DegreesEdit';
import EducationEdit from './edit/EducationEdit';

interface CareerContentEditProps {
  selectedResume: Resume;
  onSave?: () => void;
  onCancel?: () => void;
}

/**
 * 이력서 상세 정보를 편집할 수 있는 컴포넌트
 * 모든 Edit 컴포넌트들을 포함합니다
 */
const CareerContentEdit: React.FC<CareerContentEditProps> = ({ 
  selectedResume,
  onSave,
  onCancel 
}) => {
  return (
    <div style={{ 
      padding: '30px', 
      overflow: 'auto',
      backgroundColor: '#f8f9fa',
      flex: 1
    }}>
      {/* 편집 모드 안내 */}
      <div style={{
        padding: '16px',
        marginBottom: '20px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '20px' }}>✏️</span>
        <div>
          <h4 style={{ margin: 0, fontSize: '16px', color: '#856404' }}>편집 모드</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#856404' }}>
            변경사항을 저장하려면 각 섹션의 &apos;저장&apos; 버튼을 눌러주세요. 
            편집을 완료하려면 상단의 &apos;완료&apos; 버튼을 클릭하세요.
          </p>
        </div>
      </div>

      {/* TODO: 실제 데이터를 전달하고 편집 기능 연결 필요 */}
      {/* CompanyEdit - 회사 정보 편집 */}
      {/* <CompanyEdit 
        career={selectedCareer}
        onUpdate={handleCareerUpdate}
        onCancel={onCancel}
      /> */}

      {/* CertificationEdit - 자격증 정보 편집 */}
      {/* <CertificationEdit 
        certification={selectedCertification}
        onUpdate={handleCertificationUpdate}
        onCancel={onCancel}
      /> */}

      {/* DegreesEdit - 학위 정보 편집 */}
      {/* <DegreesEdit 
        degree={selectedDegree}
        onUpdate={handleDegreeUpdate}
        onCancel={onCancel}
      /> */}

      {/* EducationEdit - 교육 정보 편집 */}
      {/* <EducationEdit 
        education={selectedEducation}
        onUpdate={handleEducationUpdate}
        onCancel={onCancel}
      /> */}

      <div style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        color: '#666'
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          편집 기능은 각 섹션별로 구현될 예정입니다.
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
          상단의 &apos;완료&apos; 버튼을 클릭하면 읽기 모드로 돌아갑니다.
        </p>
      </div>
    </div>
  );
};

export default CareerContentEdit;

