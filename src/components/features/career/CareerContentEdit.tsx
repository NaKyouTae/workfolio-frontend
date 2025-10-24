import React, { useState, useCallback, useEffect } from 'react';
import { 
  Resume_Gender, 
  ResumeDetail,
  Career_EmploymentType,
  Education_EducationStatus,
  Activity_ActivityType,
  LanguageSkill_Language,
  LanguageSkill_LanguageLevel,
  Attachment_AttachmentType
} from '@/generated/common';
import { 
  ResumeUpdateRequest, 
  ResumeUpdateRequest_CareerRequest,
  ResumeUpdateRequest_EducationRequest,
  ResumeUpdateRequest_ActivityRequest,
  ResumeUpdateRequest_LanguageSkillRequest,
  ResumeUpdateRequest_AttachmentRequest,
  ResumeUpdateRequest_ProjectRequest
} from '@/generated/resume';
import HttpMethod from '@/enums/HttpMethod';
import { DateUtil } from '@/utils/DateUtil';
import { normalizeEnumValue } from '@/utils/commonUtils';
import styles from './CareerContentEdit.module.css';

// Import edit components
import BasicInfoEdit from './edit/BasicInfoEdit';
import CareerEdit from './edit/CareerEdit';
import ProjectEdit from './edit/ProjectEdit';
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
  const [name, setName] = useState(selectedResumeDetail?.name || '');
  const [birthDate, setBirthDate] = useState<number | undefined>(() => {
    const normalized = DateUtil.normalizeTimestamp(selectedResumeDetail?.birthDate);
    return normalized === 0 ? undefined : normalized;
  });
  const [gender, setGender] = useState<Resume_Gender | undefined>(normalizeEnumValue<Resume_Gender>(selectedResumeDetail?.gender, Resume_Gender));
  const [email, setEmail] = useState(selectedResumeDetail?.email || '');
  const [phone, setPhone] = useState(selectedResumeDetail?.phone || '');
  const [job, setJob] = useState(selectedResumeDetail?.job || '');
  const [description, setDescription] = useState(selectedResumeDetail?.description || '');
  // 각 섹션 데이터
  const [careers, setCareers] = useState<ResumeUpdateRequest_CareerRequest[]>([]);
  const [projects, setProjects] = useState<ResumeUpdateRequest_ProjectRequest[]>([]);
  const [educations, setEducations] = useState<ResumeUpdateRequest_EducationRequest[]>([]);
  const [activities, setActivities] = useState<ResumeUpdateRequest_ActivityRequest[]>([]);
  const [languages, setLanguages] = useState<ResumeUpdateRequest_LanguageSkillRequest[]>([]);
  const [attachments, setAttachments] = useState<ResumeUpdateRequest_AttachmentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (selectedResumeDetail) {
      setTitle(selectedResumeDetail.title || '');
      setName(selectedResumeDetail.name || '');
      const normalizedBirthDate = DateUtil.normalizeTimestamp(selectedResumeDetail.birthDate);
      setBirthDate(normalizedBirthDate === 0 ? undefined : normalizedBirthDate);
      setGender(normalizeEnumValue<Resume_Gender>(selectedResumeDetail.gender, Resume_Gender));
      setEmail(selectedResumeDetail.email || '');
      setPhone(selectedResumeDetail.phone || '');
      setJob(selectedResumeDetail.job || '');
      setDescription(selectedResumeDetail.description || '');
      // 데이터가 없으면 빈 배열로 초기화 (각 컴포넌트가 자동으로 항목 추가)
      // enum 필드들을 모두 숫자로 변환하여 저장
      // ResumeUpdateRequest 스키마에 맞게 필요한 필드만 포함
      // timestamp가 0인 경우 undefined로 처리
      const normalizeTimestampOrUndefined = (timestamp: number | string | undefined | null): number | undefined => {
        const normalized = DateUtil.normalizeTimestamp(timestamp);
        return normalized === 0 ? undefined : normalized;
      };

      setEducations((selectedResumeDetail.educations || []).map(education => ({
        id: education.id,
        major: education.major || '',
        name: education.name || '',
        description: education.description || '',
        status: normalizeEnumValue(education.status, Education_EducationStatus),
        startedAt: normalizeTimestampOrUndefined(education.startedAt),
        endedAt: normalizeTimestampOrUndefined(education.endedAt),
        isVisible: education.isVisible ?? false
      })));

      setCareers((selectedResumeDetail.careers || []).map(career => ({
        career: {
          id: career.id,
          name: career.name || '',
          startedAt: normalizeTimestampOrUndefined(career.startedAt),
          endedAt: normalizeTimestampOrUndefined(career.endedAt),
          isWorking: career.isWorking ?? false,
          position: career.position || '',
          employmentType: normalizeEnumValue(career.employmentType, Career_EmploymentType),
          department: career.department || '',
          jobGrade: career.jobGrade || '',
          job: career.job || '',
          salary: career.salary || 0,
          description: career.description || '',
          isVisible: career.isVisible ?? false
        },
        salaries: (career.salaries || []).map(salary => ({
          id: salary.id,
          amount: salary.amount || 0,
          memo: salary.memo || '',
          negotiationDate: normalizeTimestampOrUndefined(salary.negotiationDate),
          isVisible: salary.isVisible ?? false
        }))
      })));
      
      setProjects((selectedResumeDetail.projects || []).map(project => {
        const normalized: ResumeUpdateRequest_ProjectRequest = {
          title: project.title || '',
          role: project.role || '',
          description: project.description || '',
          isVisible: project.isVisible ?? false,
        };
        
        // id가 있으면 포함
        if (project.id) {
          normalized.id = project.id;
        }
        
        // startedAt이 있으면 포함
        const startedAt = normalizeTimestampOrUndefined(project.startedAt);
        if (startedAt !== undefined) {
          normalized.startedAt = startedAt;
        }
        
        // endedAt이 있으면 포함
        const endedAt = normalizeTimestampOrUndefined(project.endedAt);
        if (endedAt !== undefined) {
          normalized.endedAt = endedAt;
        }
        
        return normalized;
      }));
      
      setActivities((selectedResumeDetail.activities || []).map(activity => ({
        id: activity.id,
        type: normalizeEnumValue(activity.type, Activity_ActivityType),
        name: activity.name || '',
        organization: activity.organization || '',
        certificateNumber: activity.certificateNumber || '',
        startedAt: normalizeTimestampOrUndefined(activity.startedAt),
        endedAt: normalizeTimestampOrUndefined(activity.endedAt),
        description: activity.description || '',
        isVisible: activity.isVisible ?? false
      })));
      
      setLanguages((selectedResumeDetail.languageSkills || []).map(languageSkill => ({
        id: languageSkill.id,
        language: normalizeEnumValue(languageSkill.language, LanguageSkill_Language),
        level: normalizeEnumValue(languageSkill.level, LanguageSkill_LanguageLevel),
        isVisible: languageSkill.isVisible ?? false,
        languageTests: (languageSkill.languageTests || []).map(test => ({
          id: test.id,
          name: test.name || '',
          score: test.score || '',
          acquiredAt: normalizeTimestampOrUndefined(test.acquiredAt),
          isVisible: test.isVisible ?? false
        }))
      })));
      
      setAttachments((selectedResumeDetail.attachments || []).map(attachment => ({
        id: attachment.id,
        type: normalizeEnumValue(attachment.type, Attachment_AttachmentType),
        fileName: attachment.fileName || '',
        fileUrl: attachment.fileUrl || '',
        isVisible: attachment.isVisible ?? false
      })));
    }
  }, [selectedResumeDetail]);

  const handleSaveAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const updateRequest: ResumeUpdateRequest = {
        id: selectedResumeDetail?.id || '',
        publicId: selectedResumeDetail?.publicId || '',
        title,
        name,
        phone,
        email,
        birthDate,
        gender,
        job,
        description,
        isPublic: selectedResumeDetail?.isPublic || false,
        isDefault: selectedResumeDetail?.isDefault || false,
        careers,
        projects,
        educations,
        activities,
        languages,
        attachments,
      };

      console.log('=== PUT /api/resumes Request ===');
      console.log('Projects:', JSON.stringify(projects, null, 2));
      console.log('Full Request:', JSON.stringify(updateRequest, null, 2));
      console.log('================================');

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
        const errorText = await response.text();
        console.error('=== PUT /api/resumes Error ===');
        console.error('Status:', response.status);
        console.error('Response:', errorText);
        console.error('==============================');
        
        try {
          const error = JSON.parse(errorText);
          alert(`이력서 수정 실패: ${error.error || error.message || JSON.stringify(error)}`);
        } catch {
          alert(`이력서 수정 실패: ${errorText}`);
        }
      }
    } catch (error) {
      console.error('Error updating resume:', error);
      alert('이력서 수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedResumeDetail, title, name, birthDate, gender, email, phone, job, description, careers, projects, educations, activities, languages, attachments, onSave]);

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
          job={job}
          description={description}
          onNameChange={setName}
          onBirthDateChange={setBirthDate}
          onGenderChange={setGender}
          onPhoneChange={setPhone}
          onEmailChange={setEmail}
          onJobChange={setJob}
          onDescriptionChange={setDescription}
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

        {/* 프로젝트 섹션 */}
        <ProjectEdit
          projects={projects}
          onUpdate={setProjects}
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
