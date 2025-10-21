import React, { useState, useCallback, useEffect } from 'react';
import { Resume } from '@/generated/common';
import { 
  ResumeUpdateRequest, 
  ResumeUpdateRequest_CareerRequest,
  ResumeUpdateRequest_EducationRequest,
  ResumeUpdateRequest_ActivityRequest,
  ResumeUpdateRequest_LanguageSkillRequest,
  ResumeUpdateRequest_AttachmentRequest
} from '@/generated/resume';
import HttpMethod from '@/enums/HttpMethod';

interface CareerContentEditProps {
  selectedResume: Resume;
  onSave?: () => void;
  onCancel?: () => void;
}

/**
 * 이력서 상세 정보를 편집할 수 있는 컴포넌트
 * ResumeUpdateRequest 구조에 맞춰 모든 Edit 컴포넌트들을 포함합니다
 */
const CareerContentEdit: React.FC<CareerContentEditProps> = ({ 
  selectedResume,
  onSave,
  onCancel 
}) => {
  // ResumeUpdateRequest 구조에 맞춘 state
  const [careers, setCareers] = useState<ResumeUpdateRequest_CareerRequest[]>([]);
  const [educations, setEducations] = useState<ResumeUpdateRequest_EducationRequest[]>([]);
  const [activities, setActivities] = useState<ResumeUpdateRequest_ActivityRequest[]>([]);
  const [languages, setLanguages] = useState<ResumeUpdateRequest_LanguageSkillRequest[]>([]);
  const [attachments, setAttachments] = useState<ResumeUpdateRequest_AttachmentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // selectedResume로부터 초기 데이터 로드
  useEffect(() => {
    // TODO: selectedResume의 데이터를 ResumeUpdateRequest 구조로 변환하여 초기화
    // 현재는 빈 배열로 초기화
    setCareers([]);
    setEducations([]);
    setActivities([]);
    setLanguages([]);
    setAttachments([]);
  }, [selectedResume]);

  // 업데이트 핸들러들 (추후 각 Edit 컴포넌트에서 사용)
  // const handleCareerUpdate = useCallback((index: number, updatedCareer: ResumeUpdateRequest_CareerRequest) => {
  //   setCareers(prev => {
  //     const newCareers = [...prev];
  //     newCareers[index] = updatedCareer;
  //     return newCareers;
  //   });
  // }, []);

  // const handleEducationUpdate = useCallback((index: number, updatedEducation: ResumeUpdateRequest_EducationRequest) => {
  //   setEducations(prev => {
  //     const newEducations = [...prev];
  //     newEducations[index] = updatedEducation;
  //     return newEducations;
  //   });
  // }, []);

  // const handleActivityUpdate = useCallback((index: number, updatedActivity: ResumeUpdateRequest_ActivityRequest) => {
  //   setActivities(prev => {
  //     const newActivities = [...prev];
  //     newActivities[index] = updatedActivity;
  //     return newActivities;
  //   });
  // }, []);

  // const handleLanguageUpdate = useCallback((index: number, updatedLanguage: ResumeUpdateRequest_LanguageSkillRequest) => {
  //   setLanguages(prev => {
  //     const newLanguages = [...prev];
  //     newLanguages[index] = updatedLanguage;
  //     return newLanguages;
  //   });
  // }, []);

  // const handleAttachmentUpdate = useCallback((index: number, updatedAttachment: ResumeUpdateRequest_AttachmentRequest) => {
  //   setAttachments(prev => {
  //     const newAttachments = [...prev];
  //     newAttachments[index] = updatedAttachment;
  //     return newAttachments;
  //   });
  // }, []);

  // ResumeUpdateRequest를 생성하고 API 호출
  const handleSaveAll = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // ResumeUpdateRequest 생성
      const updateRequest: ResumeUpdateRequest = {
        id: selectedResume.id,
        title: selectedResume.title,
        // name은 Resume이 아닌 Worker에 있는 속성이므로 별도 처리 필요
        // name: selectedResume.worker?.name,
        phone: selectedResume.phone,
        email: selectedResume.email,
        birthDate: selectedResume.brithDate, // 오타 주의: brithDate
        gender: selectedResume.gender,
        isPublic: selectedResume.isPublic,
        isDefault: selectedResume.isDefault,
        careers: careers,
        educations: educations,
        activities: activities,
        languages: languages,
        attachments: attachments,
      };

      // API 호출
      const response = await fetch('/api/resumes', {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ResumeUpdateRequest.toJSON(updateRequest)),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Resume updated successfully:', result);
        onSave?.();
      } else {
        const error = await response.json();
        console.error('Failed to update resume:', error);
        alert(`이력서 수정 실패: ${error.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error updating resume:', error);
      alert('이력서 수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedResume, careers, educations, activities, languages, attachments, onSave]);

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

      {/* ResumeUpdateRequest 구조 설명 */}
      <div style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#333' }}>
          이력서 구조
        </h3>
        
        {/* Careers 섹션 */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#555' }}>
            경력 ({careers.length}개)
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            회사 정보, 성과(프로젝트), 급여 정보
          </p>
        </div>

        {/* Educations 섹션 */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#555' }}>
            학력 ({educations.length}개)
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            학교, 전공, 학위 정보
          </p>
        </div>

        {/* Activities 섹션 */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#555' }}>
            활동 ({activities.length}개)
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            자격증, 수상, 봉사활동, 대외활동 등
          </p>
        </div>

        {/* Languages 섹션 */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#555' }}>
            어학 ({languages.length}개)
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            언어 능력 및 시험 점수
          </p>
        </div>

        {/* Attachments 섹션 */}
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#555' }}>
            첨부파일 ({attachments.length}개)
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            포트폴리오, 증명서 등
          </p>
        </div>
      </div>

      {/* 편집 가능한 섹션들 - 추후 구현 */}
      <div style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        color: '#666',
        marginBottom: '20px'
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          각 섹션의 편집 컴포넌트는 ResumeUpdateRequest 구조에 맞춰 구현될 예정입니다.
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
          - Career: 회사 정보 + 성과(Achievement) + 급여<br />
          - Education: 학교 교육 정보<br />
          - Activity: 자격증, 수상, 봉사활동 등<br />
          - Language: 언어 능력<br />
          - Attachment: 첨부파일
        </p>
      </div>

      {/* 저장 버튼 */}
      <div style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center'
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
