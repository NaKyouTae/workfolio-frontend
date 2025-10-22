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
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<number>(0);
  const [gender, setGender] = useState<Resume_Gender>(Resume_Gender.MALE);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
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
      setName(selectedResumeDetail.worker?.name || '');
      setBirthDate(selectedResumeDetail.brithDate || 0);
      setGender(selectedResumeDetail.gender || Resume_Gender.MALE);
      setEmail(selectedResumeDetail.email || '');
      setPhone(selectedResumeDetail.phone || '');

      // 데이터가 없으면 빈 배열로 초기화 (각 컴포넌트가 자동으로 항목 추가)
      setCareers([]);
      setEducations([]);
      setActivities([]);
      setLanguages([]);
      setAttachments([]);
    }
  }, [selectedResumeDetail]);

  const handleSaveAll = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const updateRequest: ResumeUpdateRequest = {
        id: selectedResumeDetail?.id || '',
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
        body: JSON.stringify(ResumeUpdateRequest.toJSON(updateRequest)),
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
  }, [selectedResumeDetail, name, birthDate, gender, email, phone, careers, educations, activities, languages, attachments, onSave]);

  return (
    <div className={styles.container}>
      {/* 이력서 제목 상단에 노란색 안내 메시지 */}
      <div className={styles.warningBanner}>
        <span className={styles.warningIcon}>⚠</span>
        <span className={styles.warningText}>
          이력서 제목을 입력해 주세요.
        </span>
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
