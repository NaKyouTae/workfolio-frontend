import React, { useState, useCallback } from 'react';
import { 
  Resume_Gender, 
} from '@/generated/common';
import { 
  ResumeUpdateRequest_CareerRequest,
  ResumeUpdateRequest_EducationRequest,
  ResumeUpdateRequest_ActivityRequest,
  ResumeUpdateRequest_LanguageSkillRequest,
  ResumeUpdateRequest_AttachmentRequest,
  ResumeUpdateRequest_ProjectRequest,
  ResumeUpdateRequest
} from '@/generated/resume';
import { DateUtil } from '@/utils/DateUtil';
import { useResumeDetails } from '@/hooks/useResumeDetails';
import CareerContentForm from './CareerContentForm';

interface CareerContentCreateProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

const CareerContentCreate: React.FC<CareerContentCreateProps> = ({ 
  onCancel,
  onSuccess
}) => {
  // 기본 정보
  const [title, setTitle] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<number | undefined>(() => {
    const normalized = DateUtil.normalizeTimestamp(undefined);
    return normalized === 0 ? undefined : normalized;
  });
  const [gender, setGender] = useState<Resume_Gender | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [job, setJob] = useState('');
  const [description, setDescription] = useState('');
  // 각 섹션 데이터
  const [careers, setCareers] = useState<ResumeUpdateRequest_CareerRequest[]>([
    {
      career: {
        name: '',
        position: '',
        department: '',
        jobGrade: '',
        job: '',
        salary: 0,
        priority: 0,
        description: '',
        isVisible: true,
      },
      salaries: [
        {
          amount: 0,
          memo: '',
          negotiationDate: undefined,
          isVisible: true,
          priority: 0,
        },
      ],
    },
  ]);
  const [projects, setProjects] = useState<ResumeUpdateRequest_ProjectRequest[]>([
    {
      title: '',
      affiliation: '',
      role: '',
      description: '',
      startedAt: undefined,
      endedAt: undefined,
      isVisible: true,
      priority: 0,
    },
  ]);
  const [educations, setEducations] = useState<ResumeUpdateRequest_EducationRequest[]>([
    {
      major: '',
      name: '',
      description: '',
      status: undefined,
      startedAt: undefined,
      endedAt: undefined,
      isVisible: true,
      priority: 0,
    }
  ]);
  const [activities, setActivities] = useState<ResumeUpdateRequest_ActivityRequest[]>([
    {
      type: undefined,
      name: '',
      organization: '',
      certificateNumber: '',
      startedAt: undefined,
      endedAt: undefined,
      description: '',
      isVisible: true,
      priority: 0,
    }
  ]);
  const [languages, setLanguages] = useState<ResumeUpdateRequest_LanguageSkillRequest[]>([
    {
      language: undefined,
      level: undefined,
      isVisible: true,
      priority: 0,
      languageTests: [
        {
          name: '',
          score: '',
          acquiredAt: undefined,
          isVisible: true,
          priority: 0,
        },
      ],
    }
  ]);
  const [attachments, setAttachments] = useState<ResumeUpdateRequest_AttachmentRequest[]>([
    {
      type: undefined,
      fileName: '',
      fileUrl: '',
      isVisible: true,
      priority: 0,
    }
  ]);

  const { updateResume } = useResumeDetails();

  const handleSaveAll = useCallback(async () => {
    const updateRequest: ResumeUpdateRequest = {
      id: '',
      title,
      name,
      phone,
      email,
      birthDate,
      gender,
      job,
      description,
      isPublic: false,
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
      onSuccess?.();
    }
  }, [activities, attachments, birthDate, careers, description, educations, email, gender, isDefault, job, languages, name, onSuccess, phone, projects, title, updateResume]);

  return (
    <CareerContentForm
      title={title}
      isDefault={isDefault}
      name={name}
      birthDate={birthDate}
      gender={gender}
      phone={phone}
      email={email}
      job={job}
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
      onJobChange={setJob}
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

export default CareerContentCreate;
