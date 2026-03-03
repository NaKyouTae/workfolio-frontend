import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Resume_Gender, 
  ResumeDetail,
  Career_EmploymentType,
  Education_EducationStatus,
  Activity_ActivityType,
  LanguageSkill_Language,
  LanguageSkill_LanguageLevel,
  Attachment_AttachmentType,
  Attachment_AttachmentCategory,
} from '@workfolio/shared/generated/common';
import { 
  ResumeUpdateRequest, 
  ResumeUpdateRequest_CareerRequest,
  ResumeUpdateRequest_EducationRequest,
  ResumeUpdateRequest_ActivityRequest,
  ResumeUpdateRequest_LanguageSkillRequest,
  ResumeUpdateRequest_ProjectRequest
} from '@workfolio/shared/generated/resume';
import { DateUtil } from '@workfolio/shared/utils/DateUtil';
import { normalizeEnumValue } from '@workfolio/shared/utils/commonUtils';
import CareerContentForm from './CareerContentForm';
import { useResumeDetails } from '@/hooks/useResumeDetails';
import { AttachmentRequest } from '@workfolio/shared/generated/attachment';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import LoginModal from '@workfolio/shared/ui/LoginModal';

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
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(selectedResumeDetail?.profileImageUrl || null);
  const profileImageFileRef = useRef<File | null>(null);
  const profileImageRemovedRef = useRef(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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

      const mappedEducations = (selectedResumeDetail.educations || []).map(education => ({
        id: education.id,
        major: education.major || '',
        name: education.name || '',
        description: education.description || '',
        status: normalizeEnumValue(education.status, Education_EducationStatus),
        startedAt: normalizeTimestampOrUndefined(education.startedAt),
        endedAt: normalizeTimestampOrUndefined(education.endedAt),
        isVisible: education.isVisible ?? false,
        priority: education.priority || 0
      }));
      setEducations(mappedEducations.length > 0 ? mappedEducations : [{
        major: '', name: '', description: '', status: undefined,
        startedAt: undefined, endedAt: undefined, isVisible: true, priority: 0,
      }]);

      const mappedCareers = (selectedResumeDetail.careers || []).map(career => ({
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
        salaries: (career.salaries && career.salaries.length > 0)
          ? career.salaries.map(salary => ({
            id: salary.id,
            amount: salary.amount || 0,
            memo: salary.memo || '',
            negotiationDate: normalizeTimestampOrUndefined(salary.negotiationDate),
            isVisible: salary.isVisible ?? false,
            priority: salary.priority || 0
          }))
          : [{ amount: 0, memo: '', negotiationDate: undefined, isVisible: true, priority: 0 }]
      }));
      setCareers(mappedCareers.length > 0 ? mappedCareers : [{
        career: {
          name: '', position: '', department: '', jobTitle: '', rank: '',
          salary: 0, priority: 0, description: '', isVisible: true,
        },
        salaries: [{
          amount: 0, memo: '', negotiationDate: undefined, isVisible: true, priority: 0,
        }],
      }]);
      
      const mappedProjects = (selectedResumeDetail.projects || []).map(project => {
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
      });
      setProjects(mappedProjects.length > 0 ? mappedProjects : [{
        title: '', affiliation: '', role: '', description: '',
        startedAt: undefined, endedAt: undefined, isVisible: true, priority: 0,
      }]);
      
      const mappedActivities = (selectedResumeDetail.activities || []).map(activity => ({
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
      }));
      setActivities(mappedActivities.length > 0 ? mappedActivities : [{
        type: undefined, name: '', organization: '', certificateNumber: '',
        startedAt: undefined, endedAt: undefined, description: '', isVisible: true, priority: 0,
      }]);
      
      const mappedLanguages = (selectedResumeDetail.languageSkills || []).map(languageSkill => ({
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
      }));
      setLanguages(mappedLanguages.length > 0 ? mappedLanguages : [{
        language: undefined, level: undefined, isVisible: true, priority: 0,
        languageTests: [{ name: '', score: '', acquiredAt: undefined, isVisible: true, priority: 0 }],
      }]);

      const mappedAttachments = (selectedResumeDetail.attachments || []).map(attachment => ({
        id: attachment.id || '',
        type: normalizeEnumValue(attachment.type, Attachment_AttachmentType),
        category: attachment.category,
        url: attachment.url || '',
        fileName: attachment.fileName || '',
        fileUrl: attachment.fileUrl || '',
        isVisible: attachment.isVisible ?? false,
        priority: attachment.priority || 0,
      }));
      setAttachments(mappedAttachments.length > 0 ? mappedAttachments : [{
        type: undefined, category: Attachment_AttachmentCategory.FILE,
        url: '', fileName: '', fileUrl: '', fileData: undefined, isVisible: true, priority: 0,
      }]);

      setProfileImagePreview(selectedResumeDetail.profileImageUrl || null);
      profileImageFileRef.current = null;
      profileImageRemovedRef.current = false;
    }
  }, [selectedResumeDetail]);

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
      profileImageRemovedRef.current = false;
      const objectUrl = URL.createObjectURL(file);
      setProfileImagePreview(objectUrl);
    } else {
      profileImageFileRef.current = null;
      profileImageRemovedRef.current = true;
      setProfileImagePreview(null);
    }
  }, []);

  const handleSaveAll = useCallback(async () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    
    try {
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
        profileImageUrl: profileImageRemovedRef.current ? '' : (selectedResumeDetail?.profileImageUrl || ''),
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
        onSave?.();
      } else {
        // useNotification은 CareerContentForm에서 사용하므로 여기서는 직접 import 필요
        // 하지만 CareerContentForm이 이미 있으므로 그쪽에서 처리하도록 함
        console.error('이력서 수정 실패');
      }
    } catch (error) {
      console.error('Error updating resume:', error);
    }
  }, [selectedResumeDetail, title, name, birthDate, gender, email, phone, position, description, isDefault, careers, projects, educations, activities, languages, attachments, onSave, updateResume]);

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

export default CareerContentEdit;
