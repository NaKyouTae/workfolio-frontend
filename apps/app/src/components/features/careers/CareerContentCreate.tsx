import React, { useState, useCallback, useRef } from 'react';
import { 
  Attachment_AttachmentCategory,
  Resume_Gender, 
} from '@workfolio/shared/generated/common';
import { 
  ResumeUpdateRequest_CareerRequest,
  ResumeUpdateRequest_EducationRequest,
  ResumeUpdateRequest_ActivityRequest,
  ResumeUpdateRequest_LanguageSkillRequest,
  ResumeUpdateRequest_ProjectRequest,
  ResumeUpdateRequest
} from '@workfolio/shared/generated/resume';
import { AttachmentRequest } from '@workfolio/shared/generated/attachment';
import { DateUtil } from '@workfolio/shared/utils/DateUtil';
import { useResumeDetails } from '@/hooks/useResumeDetails';
import CareerContentForm from './CareerContentForm';
import { useUser } from '@/hooks/useUser';
import { normalizeEnumValue } from '@workfolio/shared/utils/commonUtils';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import LoginModal from '@workfolio/shared/ui/LoginModal';

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

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const profileImageFileRef = useRef<File | null>(null);

  const { updateResume } = useResumeDetails();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const handleProfileImageChange = useCallback((file: File | null) => {
    if (file) {
      profileImageFileRef.current = file;
      const objectUrl = URL.createObjectURL(file);
      setProfileImagePreview(objectUrl);
    } else {
      profileImageFileRef.current = null;
      setProfileImagePreview(null);
    }
  }, []);

  const handleSaveAll = useCallback(async () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    
    let profileImageData: Uint8Array | undefined;
    if (profileImageFileRef.current) {
      const file = profileImageFileRef.current;
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(new Error('파일 읽기 실패'));
        reader.readAsArrayBuffer(file);
      });
      const base64String = uint8ArrayToBase64(new Uint8Array(arrayBuffer));
      profileImageData = base64String as unknown as Uint8Array;
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
      profileImageData,
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
        profileImagePreview={profileImagePreview}
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
        onProfileImageChange={handleProfileImageChange}
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
