import React, { useState, useCallback } from 'react';
import { Career, Certifications, Degrees, Education, Link } from '@/generated/common';
import { ResumeUpdateRequest } from '@/generated/resume';
import CareerEdit from './edit/CareerEdit';
import CertificationEdit from './edit/CertificationEdit';
import DegreesEdit from './edit/DegreesEdit';
import EducationEdit from './edit/EducationEdit';
import LinkEdit from './edit/LinkEdit';
import HttpMethod from '@/enums/HttpMethod';

interface CareerContentEditProps {
  onSave?: () => void;
  onCancel?: () => void;
}

/**
 * 이력서 상세 정보를 편집할 수 있는 컴포넌트
 * 모든 Edit 컴포넌트들을 포함합니다
 */
const CareerContentEdit: React.FC<CareerContentEditProps> = ({ 
  onSave,
  onCancel 
}) => {
  // 각 섹션의 변경된 데이터를 저장하는 state
  const [updatedCareers, setUpdatedCareers] = useState<Career[]>([]);
  const [updatedCertifications, setUpdatedCertifications] = useState<Certifications[]>([]);
  const [updatedDegrees, setUpdatedDegrees] = useState<Degrees[]>([]);
  const [updatedEducations, setUpdatedEducations] = useState<Education[]>([]);
  const [updatedLinks, setUpdatedLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 각 섹션의 데이터 업데이트 핸들러
  const handleCareerUpdate = useCallback((updatedCareer: Career) => {
    setUpdatedCareers(prev => 
      prev.map(career => career.id === updatedCareer.id ? updatedCareer : career)
    );
  }, []);

  const handleCertificationUpdate = useCallback((updatedCertification: Certifications) => {
    setUpdatedCertifications(prev => 
      prev.map(cert => cert.id === updatedCertification.id ? updatedCertification : cert)
    );
  }, []);

  const handleDegreeUpdate = useCallback((updatedDegree: Degrees) => {
    setUpdatedDegrees(prev => 
      prev.map(degree => degree.id === updatedDegree.id ? updatedDegree : degree)
    );
  }, []);

  const handleEducationUpdate = useCallback((updatedEducation: Education) => {
    setUpdatedEducations(prev => 
      prev.map(edu => edu.id === updatedEducation.id ? updatedEducation : edu)
    );
  }, []);

  const handleLinkUpdate = useCallback((updatedLink: Link) => {
    setUpdatedLinks(prev => 
      prev.map(link => link.id === updatedLink.id ? updatedLink : link)
    );
  }, []);

  // ResumeUpdateRequest를 생성하고 API 호출
  const handleSaveAll = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // ResumeUpdateRequest 메시지 생성
      const updateRequest = ResumeUpdateRequest.create({
        careers: updatedCareers.map(career => ({
          career: {
            id: career.id,
            name: career.name,
            startedAt: career.startedAt,
            endedAt: career.endedAt,
            isWorking: career.isWorking,
            employmentType: 1, // FULL_TIME으로 설정 (필요에 따라 수정)
          },
          projects: [] // 프로젝트 데이터가 있다면 추가
        })),
        certifications: updatedCertifications.map(cert => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          issuedAt: cert.issuedAt,
          number: cert.number || '',
          expirationPeriod: cert.expirationPeriod || 0,
        })),
        degrees: updatedDegrees.map(degree => ({
          id: degree.id,
          name: degree.name,
          major: degree.major,
          startedAt: degree.startedAt,
          endedAt: degree.endedAt,
        })),
        educations: updatedEducations.map(edu => ({
          id: edu.id,
          name: edu.name,
          startedAt: edu.startedAt,
          endedAt: edu.endedAt,
          agency: edu.agency || '',
        })),
        links: updatedLinks.map(link => ({
          id: link.id,
          url: link.url,
          isVisible: link.isVisible,
        })),
      });

      // API 호출
      const response = await fetch('/api/resume/update', {
        method: HttpMethod.POST,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ResumeUpdateRequest.toJSON(updateRequest)),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.isSuccess) {
          onSave?.();
        } else {
          console.error('Failed to update resume:', result.message);
        }
      } else {
        console.error('Failed to update resume');
      }
    } catch (error) {
      console.error('Error updating resume:', error);
    } finally {
      setIsLoading(false);
    }
  }, [updatedCareers, updatedCertifications, updatedDegrees, updatedEducations, updatedLinks, onSave]);

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
            각 섹션을 편집한 후 하단의 &apos;모든 변경사항 저장&apos; 버튼을 눌러주세요.
          </p>
        </div>
      </div>

      {/* CareerEdit - 회사 정보 편집 */}
      {updatedCareers.map((career) => (
        <div key={career.id} style={{ marginBottom: '20px' }}>
          <CareerEdit 
            career={career}
            onUpdate={handleCareerUpdate}
            onCancel={onCancel || (() => {})}
          />
        </div>
      ))}

      {/* CertificationEdit - 자격증 정보 편집 */}
      {updatedCertifications.map((certification) => (
        <div key={certification.id} style={{ marginBottom: '20px' }}>
          <CertificationEdit 
            certification={certification}
            onUpdate={handleCertificationUpdate}
            onCancel={onCancel || (() => {})}
          />
        </div>
      ))}

      {/* DegreesEdit - 학위 정보 편집 */}
      {updatedDegrees.map((degree) => (
        <div key={degree.id} style={{ marginBottom: '20px' }}>
          <DegreesEdit 
            degree={degree}
            onUpdate={handleDegreeUpdate}
            onCancel={onCancel || (() => {})}
          />
        </div>
      ))}

      {/* EducationEdit - 교육 정보 편집 */}
      {updatedEducations.map((education) => (
        <div key={education.id} style={{ marginBottom: '20px' }}>
          <EducationEdit 
            education={education}
            onUpdate={handleEducationUpdate}
            onCancel={onCancel || (() => {})}
          />
        </div>
      ))}

      {/* LinkEdit - 링크 정보 편집 */}
      {updatedLinks.map((link) => (
        <div key={link.id} style={{ marginBottom: '20px' }}>
          <LinkEdit 
            link={link}
            onUpdate={handleLinkUpdate}
            onCancel={onCancel || (() => {})}
          />
        </div>
      ))}

      {/* 저장 버튼 */}
      <div style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <button
          onClick={handleSaveAll}
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: isLoading ? '#ccc' : '#2196f3',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginRight: '12px'
          }}
        >
          {isLoading ? '저장 중...' : '모든 변경사항 저장'}
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '12px 24px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            backgroundColor: '#fff',
            color: '#333',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default CareerContentEdit;

