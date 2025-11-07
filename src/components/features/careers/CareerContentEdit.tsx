import React, { useState, useCallback, useEffect } from 'react';
import { 
  Resume_Gender, 
  ResumeDetail,
  Career_EmploymentType,
  Education_EducationStatus,
  Activity_ActivityType,
  LanguageSkill_Language,
  LanguageSkill_LanguageLevel,
  Attachment_AttachmentType,
} from '@/generated/common';
import { 
  ResumeUpdateRequest, 
  ResumeUpdateRequest_CareerRequest,
  ResumeUpdateRequest_EducationRequest,
  ResumeUpdateRequest_ActivityRequest,
  ResumeUpdateRequest_LanguageSkillRequest,
  ResumeUpdateRequest_ProjectRequest
} from '@/generated/resume';
import { DateUtil } from '@/utils/DateUtil';
import { normalizeEnumValue } from '@/utils/commonUtils';
import CareerContentForm from './CareerContentForm';
import { useResumeDetails } from '@/hooks/useResumeDetails';
import { AttachmentRequest } from '@/generated/attachment';

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
  const [isDefault, setIsDefault] = useState(selectedResumeDetail?.isDefault || false);
  const [name, setName] = useState(selectedResumeDetail?.name || '');
  const [birthDate, setBirthDate] = useState<number | undefined>(() => {
    const normalized = DateUtil.normalizeTimestamp(selectedResumeDetail?.birthDate);
    return normalized === 0 ? undefined : normalized;
  });
  const [gender, setGender] = useState<Resume_Gender | undefined>(normalizeEnumValue<Resume_Gender>(selectedResumeDetail?.gender, Resume_Gender));
  const [email, setEmail] = useState(selectedResumeDetail?.email || '');
  const [phone, setPhone] = useState(selectedResumeDetail?.phone || '');
  const [position, setPosition] = useState(selectedResumeDetail?.position || '');
  const [description, setDescription] = useState(selectedResumeDetail?.description || '');
  // 각 섹션 데이터
  const [careers, setCareers] = useState<ResumeUpdateRequest_CareerRequest[]>([]);
  const [projects, setProjects] = useState<ResumeUpdateRequest_ProjectRequest[]>([]);
  const [educations, setEducations] = useState<ResumeUpdateRequest_EducationRequest[]>([]);
  const [activities, setActivities] = useState<ResumeUpdateRequest_ActivityRequest[]>([]);
  const [languages, setLanguages] = useState<ResumeUpdateRequest_LanguageSkillRequest[]>([]);
  const [attachments, setAttachments] = useState<AttachmentRequest[]>([]);

  const { updateResume } = useResumeDetails();

  // 초기 데이터 로드
  useEffect(() => {
    if (selectedResumeDetail) {
      setTitle(selectedResumeDetail.title || '');
      setIsDefault(selectedResumeDetail.isDefault || false);
      setName(selectedResumeDetail.name || '');
      const normalizedBirthDate = DateUtil.normalizeTimestamp(selectedResumeDetail.birthDate);
      setBirthDate(normalizedBirthDate === 0 ? undefined : normalizedBirthDate);
      setGender(normalizeEnumValue<Resume_Gender>(selectedResumeDetail.gender, Resume_Gender));
      setEmail(selectedResumeDetail.email || '');
      setPhone(selectedResumeDetail.phone || '');
      setPosition(selectedResumeDetail.position || '');
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
        isVisible: education.isVisible ?? false,
        priority: education.priority || 0
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
          jobTitle: career.jobTitle || '',
          rank: career.rank || '',
          salary: career.salary || 0,
          description: career.description || '',
          isVisible: career.isVisible ?? false,
          priority: career.priority || 0
        },
        salaries: (career.salaries || []).map(salary => ({
          id: salary.id,
          amount: salary.amount || 0,
          memo: salary.memo || '',
          negotiationDate: normalizeTimestampOrUndefined(salary.negotiationDate),
          isVisible: salary.isVisible ?? false,
          priority: salary.priority || 0
        }))
      })));
      
      setProjects((selectedResumeDetail.projects || []).map(project => {
        const normalized: ResumeUpdateRequest_ProjectRequest = {
          title: project.title || '',
          role: project.role || '',
          affiliation: project.affiliation || '',
          description: project.description || '',
          isVisible: project.isVisible ?? false,
          priority: project.priority || 0
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
        isVisible: activity.isVisible ?? false,
        priority: activity.priority || 0
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
          isVisible: test.isVisible ?? false,
          priority: test.priority || 0
        })),
        priority: languageSkill.priority || 0
      })));

      setAttachments((selectedResumeDetail.attachments || []).map(attachment => ({
        id: attachment.id || '',
        type: normalizeEnumValue(attachment.type, Attachment_AttachmentType),
        category: attachment.category,
        url: attachment.url || '',
        fileName: attachment.fileName || '',
        fileUrl: attachment.fileUrl || '',
        isVisible: attachment.isVisible ?? false,
        priority: attachment.priority || 0,
      })));
    }
  }, [selectedResumeDetail]);

  const handleSaveAll = useCallback(async () => {
    try {
      const updateRequest: ResumeUpdateRequest = {
        id: selectedResumeDetail?.id || '',
        title: title || '제목 없음',
        name,
        phone,
        email,
        birthDate,
        gender,
        position,
        description,
        isPublic: selectedResumeDetail?.isPublic || false,
        isDefault,
        careers,
        projects,
        educations,
        activities,
        languages,
        attachments,
      };

      const result = await updateResume(updateRequest);

      if (result) {
        onSave?.();
      } else {
        alert('이력서 수정 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error updating resume:', error);
      alert('이력서 수정 중 오류가 발생했습니다.');
    }
  }, [selectedResumeDetail, title, name, birthDate, gender, email, phone, position, description, isDefault, careers, projects, educations, activities, languages, attachments, onSave]);

  return (
    <CareerContentForm
      title={title}
      isDefault={isDefault}
      name={name}
      birthDate={birthDate}
      gender={gender}
      phone={phone}
      email={email}
      position={position}
      description={description}
      careers={careers}
      projects={projects}
      educations={educations}
      activities={activities}
      languages={languages}
      attachments={attachments}
      onTitleChange={setTitle}
      onIsDefaultChange={setIsDefault}
      onNameChange={setName}
      onBirthDateChange={setBirthDate}
      onGenderChange={setGender}
      onPhoneChange={setPhone}
      onEmailChange={setEmail}
      onPositionChange={setPosition}
      onDescriptionChange={setDescription}
      onCareersChange={setCareers}
      onProjectsChange={setProjects}
      onEducationsChange={setEducations}
      onActivitiesChange={setActivities}
      onLanguagesChange={setLanguages}
      onAttachmentsChange={setAttachments}
      onSave={handleSaveAll}
      onCancel={onCancel}
    />
  );
};

export default CareerContentEdit;
