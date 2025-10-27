import React from 'react';
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
} from '@/generated/resume';
import styles from './CareerContentForm.module.css';

// Import edit components
import BasicInfoEdit from './edit/BasicInfoEdit';
import CareerEdit from './edit/CareerEdit';
import ProjectEdit from './edit/ProjectEdit';
import EducationEdit from './edit/EducationEdit';
import ActivityEdit from './edit/ActivityEdit';
import LanguageSkillEdit from './edit/LanguageSkillEdit';
import AttachmentEdit from './edit/AttachmentEdit';
import EditFloatingNavigation from './EditFloatingNavigation';
import Input from '@/components/ui/Input';

interface CareerContentFormProps {
  // 기본 정보
  title: string;
  isDefault: boolean;
  name: string;
  birthDate: number | undefined;
  gender: Resume_Gender | undefined;
  phone: string;
  email: string;
  job: string;
  description: string;
  
  // 각 섹션 데이터
  careers: ResumeUpdateRequest_CareerRequest[];
  projects: ResumeUpdateRequest_ProjectRequest[];
  educations: ResumeUpdateRequest_EducationRequest[];
  activities: ResumeUpdateRequest_ActivityRequest[];
  languages: ResumeUpdateRequest_LanguageSkillRequest[];
  attachments: ResumeUpdateRequest_AttachmentRequest[];
  
  // 핸들러
  onTitleChange: (title: string) => void;
  onIsDefaultChange: (isDefault: boolean) => void;
  onNameChange: (name: string) => void;
  onBirthDateChange: (birthDate: number | undefined) => void;
  onGenderChange: (gender: Resume_Gender | undefined) => void;
  onPhoneChange: (phone: string) => void;
  onEmailChange: (email: string) => void;
  onJobChange: (job: string) => void;
  onDescriptionChange: (description: string) => void;
  onCareersChange: (careers: ResumeUpdateRequest_CareerRequest[]) => void;
  onProjectsChange: (projects: ResumeUpdateRequest_ProjectRequest[]) => void;
  onEducationsChange: (educations: ResumeUpdateRequest_EducationRequest[]) => void;
  onActivitiesChange: (activities: ResumeUpdateRequest_ActivityRequest[]) => void;
  onLanguagesChange: (languages: ResumeUpdateRequest_LanguageSkillRequest[]) => void;
  onAttachmentsChange: (attachments: ResumeUpdateRequest_AttachmentRequest[]) => void;
  
  // 저장/취소 핸들러
  onSave: () => void;
  onCancel?: () => void;
}

const CareerContentForm: React.FC<CareerContentFormProps> = ({
  title,
  isDefault,
  name,
  birthDate,
  gender,
  phone,
  email,
  job,
  description,
  careers,
  projects,
  educations,
  activities,
  languages,
  attachments,
  onTitleChange,
  onIsDefaultChange,
  onNameChange,
  onBirthDateChange,
  onGenderChange,
  onPhoneChange,
  onEmailChange,
  onJobChange,
  onDescriptionChange,
  onCareersChange,
  onProjectsChange,
  onEducationsChange,
  onActivitiesChange,
  onLanguagesChange,
  onAttachmentsChange,
  onSave,
  onCancel
}) => {
  return (
    <div className={styles.container}>
      <div style={{ 
        padding: '20px 30px', 
        backgroundColor: '#fff', 
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ul>
            <li>
                <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => onIsDefaultChange(e.target.checked)}
                    id="isDefault"
                />
                <label htmlFor="isDefault"><p>기본</p></label>
            </li>
          </ul>
          <div style={{ flex: 1 }}>
            <Input
              type="text"
              label="제목"
              placeholder="이력서 제목"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', position: 'relative', gap: '20px', justifyContent: 'space-between' }}>
        <div className={styles.content}>
          {/* 기본 정보 섹션 */}
          <div id="basic-info">
            <BasicInfoEdit
              name={name}
              birthDate={birthDate}
              gender={gender}
              phone={phone}
              email={email}
              job={job}
              description={description}
              onNameChange={onNameChange}
              onBirthDateChange={onBirthDateChange}
              onGenderChange={onGenderChange}
              onPhoneChange={onPhoneChange}
              onEmailChange={onEmailChange}
              onJobChange={onJobChange}
              onDescriptionChange={onDescriptionChange}
            />
          </div>

          {/* 학력 섹션 */}
          <div id="education">
            <EducationEdit
              educations={educations}
              onUpdate={onEducationsChange}
            />
          </div>

          {/* 경력 섹션 */}
          <div id="career">
            <CareerEdit
              careers={careers}
              onUpdate={onCareersChange}
            />
          </div>

          {/* 프로젝트 섹션 */}
          <div id="project">
            <ProjectEdit
              projects={projects}
              onUpdate={onProjectsChange}
            />
          </div>

          {/* 활동 섹션 */}
          <div id="activity">
            <ActivityEdit
              activities={activities}
              onUpdate={onActivitiesChange}
            />
          </div>

          {/* 어학 섹션 */}
          <div id="language">
            <LanguageSkillEdit
              languageSkills={languages}
              onUpdate={onLanguagesChange}
            />
          </div>

          {/* 첨부 섹션 */}
          <div id="attachment">
            <AttachmentEdit
              attachments={attachments}
              onUpdate={onAttachmentsChange}
            />
          </div>
        </div>

        {/* 오른쪽 플로팅 네비게이션 */}
        <EditFloatingNavigation
          onSave={onSave}
          {...(onCancel && { onCancel })}
        />
      </div>
    </div>
  );
};

export default CareerContentForm;
