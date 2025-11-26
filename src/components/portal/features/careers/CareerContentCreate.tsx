import React, { useState, useCallback } from 'react';
import { 
  Attachment_AttachmentCategory,
  Resume_Gender, 
} from '@/generated/common';
import { 
  ResumeUpdateRequest_CareerRequest,
  ResumeUpdateRequest_EducationRequest,
  ResumeUpdateRequest_ActivityRequest,
  ResumeUpdateRequest_LanguageSkillRequest,
  ResumeUpdateRequest_ProjectRequest,
  ResumeUpdateRequest
} from '@/generated/resume';
import { AttachmentRequest } from '@/generated/attachment';
import { DateUtil } from '@/utils/DateUtil';
import { useResumeDetails } from '@/hooks/useResumeDetails';
import CareerContentForm from './CareerContentForm';
import { useUser } from '@/hooks/useUser';
import { normalizeEnumValue } from '@/utils/commonUtils';
import { isLoggedIn } from '@/utils/authUtils';
import LoginModal from '@/components/portal/ui/LoginModal';

interface CareerContentCreateProps {
  onCancel?: () => void;
  onSuccess?: (resumeId?: string) => void;
}

const CareerContentCreate: React.FC<CareerContentCreateProps> = ({ 
  onCancel,
  onSuccess
}) => {

  const { user } = useUser();

  // 기본 정보
  const [title, setTitle] = useState(`${user?.nickName}님의 이력서`);
  const [isDefault, setIsDefault] = useState(false);
  const [name, setName] = useState(user?.nickName || '');
  const [birthDate, setBirthDate] = useState<number | undefined>(() => {
    const normalized = DateUtil.normalizeTimestamp(user?.birthDate);
    return normalized === 0 ? undefined : normalized;
  });
  const [gender, setGender] = useState<Resume_Gender | undefined>(normalizeEnumValue<Resume_Gender>(user?.gender, Resume_Gender));
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [position, setPosition] = useState('');
  const [description, setDescription] = useState('');
  // 각 섹션 데이터
  const [careers, setCareers] = useState<ResumeUpdateRequest_CareerRequest[]>([
    {
      career: {
        name: '',
        position: '',
        department: '',
        jobTitle: '',
        rank: '',
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
  const [attachments, setAttachments] = useState<AttachmentRequest[]>([
    {
      type: undefined,
      category: Attachment_AttachmentCategory.FILE,
      url: '',
      fileName: '',
      fileUrl: '',
      fileData: undefined,
      isVisible: true,
      priority: 0,
    },
  ]);

  const { updateResume } = useResumeDetails();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSaveAll = useCallback(async () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    
    const updateRequest: ResumeUpdateRequest = {
      id: '',
      title: title || '제목없는 이력서',
      name,
      phone,
      email,
      birthDate,
      gender,
      position,
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
      onSuccess?.(result.id);
    }
  }, [activities, attachments, birthDate, careers, description, educations, email, gender, isDefault, position, languages, name, onSuccess, phone, projects, title, updateResume]);

  return (
    <>
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
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default CareerContentCreate;
