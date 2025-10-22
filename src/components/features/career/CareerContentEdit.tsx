import React, { useState, useCallback, useEffect } from 'react';
import { Resume_Gender, ResumeDetail } from '@/generated/common';
import { 
  ResumeUpdateRequest, 
  ResumeUpdateRequest_CareerRequest,
  ResumeUpdateRequest_EducationRequest,
  ResumeUpdateRequest_ActivityRequest,
  ResumeUpdateRequest_LanguageSkillRequest,
  ResumeUpdateRequest_AttachmentRequest
} from '@/generated/resume';
import HttpMethod from '@/enums/HttpMethod';
import styles from './CareerContentEdit.module.css';

// Import edit components
import BasicInfoEdit from './edit/BasicInfoEdit';
import CareerEdit from './edit/CareerEdit';
import EducationEdit from './edit/EducationEdit';
import ActivityEdit from './edit/ActivityEdit';
import LanguageSkillEdit from './edit/LanguageSkillEdit';
import AttachmentEdit from './edit/AttachmentEdit';
import Input from '@/components/ui/Input';

interface CareerContentEditProps {
  selectedResumeDetail: ResumeDetail | null;
  onSave?: () => void;
  onCancel?: () => void;
}

const CareerContentEdit: React.FC<CareerContentEditProps> = ({ 
  selectedResumeDetail,
  onSave,
  onCancel 
}) => {
  // 기본 정보
  const [title, setTitle] = useState(selectedResumeDetail?.title || '');
  const [name, setName] = useState(selectedResumeDetail?.worker?.name || '');
  const [birthDate, setBirthDate] = useState<number>(selectedResumeDetail?.brithDate || 0);
  const [gender, setGender] = useState<Resume_Gender>(selectedResumeDetail?.gender || Resume_Gender.MALE);
  const [email, setEmail] = useState(selectedResumeDetail?.email || '');
  const [phone, setPhone] = useState(selectedResumeDetail?.phone || '');
  
  // 각 섹션 데이터
  const [careers, setCareers] = useState<ResumeUpdateRequest_CareerRequest[]>([]);
  const [educations, setEducations] = useState<ResumeUpdateRequest_EducationRequest[]>([]);
  const [activities, setActivities] = useState<ResumeUpdateRequest_ActivityRequest[]>([]);
  const [languages, setLanguages] = useState<ResumeUpdateRequest_LanguageSkillRequest[]>([]);
  const [attachments, setAttachments] = useState<ResumeUpdateRequest_AttachmentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (selectedResumeDetail) {
      setTitle(selectedResumeDetail.title || '');
      setName(selectedResumeDetail.worker?.name || '');
      setBirthDate(selectedResumeDetail.brithDate || 0);
      setGender(selectedResumeDetail.gender || Resume_Gender.MALE);
      setEmail(selectedResumeDetail.email || '');
      setPhone(selectedResumeDetail.phone || '');

      console.log('===============================');
      console.log(selectedResumeDetail);
      console.log('===============================');

      // 데이터가 없으면 빈 배열로 초기화 (각 컴포넌트가 자동으로 항목 추가)
      setCareers(selectedResumeDetail.careers || []);
      setEducations(selectedResumeDetail.educations || []);
      setActivities(selectedResumeDetail.activities || []);
      setLanguages(selectedResumeDetail.languageSkills || []);
      setAttachments(selectedResumeDetail.attachments || []);
    }
  }, [selectedResumeDetail]);

  const handleSaveAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const updateRequest: ResumeUpdateRequest = {
        id: selectedResumeDetail?.id || '',
        title,
        name,
        phone,
        email,
        birthDate,
        gender,
        isPublic: selectedResumeDetail?.isPublic || false,
        isDefault: selectedResumeDetail?.isDefault || false,
        careers,
        educations,
        activities,
        languages,
        attachments,
      };

      const response = await fetch('/api/resumes', {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateRequest),
      });

      if (response.ok) {
        onSave?.();
      } else {
        const error = await response.json();
        alert(`이력서 수정 실패: ${error.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error updating resume:', error);
      alert('이력서 수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedResumeDetail, title, name, birthDate, gender, email, phone, careers, educations, activities, languages, attachments, onSave]);

  return (
    <div className={styles.container}>
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
          <Input
            type="text"
            label="제목"
            placeholder="이력서 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          {/* 액션 링크들 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px'
          }}>
            <button
              onClick={onSave}
              style={{
                background: '#4caf50',
                border: '1px solid #4caf50',
                color: '#fff',
                cursor: 'pointer',
                padding: '6px 12px',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#45a049';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4caf50';
              }}
            >
              완료
            </button>
            <button
              onClick={onCancel}
              style={{
                background: '#f44336',
                border: '1px solid #f44336',
                color: '#fff',
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
              취소
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* 기본 정보 섹션 */}
        <BasicInfoEdit
          name={name}
          birthDate={birthDate}
          gender={gender}
          phone={phone}
          email={email}
          onNameChange={setName}
          onBirthDateChange={setBirthDate}
          onGenderChange={setGender}
          onPhoneChange={setPhone}
          onEmailChange={setEmail}
        />

        {/* 학력 섹션 */}
        <EducationEdit
          educations={educations}
          onUpdate={setEducations}
        />

        {/* 경력 섹션 */}
        <CareerEdit
          careers={careers}
          onUpdate={setCareers}
        />

        {/* 활동 섹션 */}
        <ActivityEdit
          activities={activities}
          onUpdate={setActivities}
        />

        {/* 어학 섹션 */}
        <LanguageSkillEdit
          languageSkills={languages}
          onUpdate={setLanguages}
        />

        {/* 첨부 섹션 */}
        <AttachmentEdit
          attachments={attachments}
          onUpdate={setAttachments}
        />

        {/* 하단 저장 버튼 */}
        <div className={styles.buttonContainer}>
          <button
            onClick={onCancel}
            className={styles.cancelButton}
          >
            취소
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isLoading}
            className={styles.saveButton}
          >
            {isLoading ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerContentEdit;
