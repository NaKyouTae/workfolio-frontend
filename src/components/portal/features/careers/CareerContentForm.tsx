import React from 'react';
import { 
  Resume_Gender, 
} from '@/generated/common';
import { 
  ResumeUpdateRequest_CareerRequest,
  ResumeUpdateRequest_EducationRequest,
  ResumeUpdateRequest_ActivityRequest,
  ResumeUpdateRequest_LanguageSkillRequest,
  ResumeUpdateRequest_ProjectRequest,
} from '@/generated/resume';
import BasicInfoEdit from './edit/BasicInfoEdit';
import CareerEdit from './edit/CareerEdit';
import ProjectEdit from './edit/ProjectEdit';
import EducationEdit from './edit/EducationEdit';
import ActivityEdit from './edit/ActivityEdit';
import LanguageSkillEdit from './edit/LanguageSkillEdit';
import AttachmentEdit from '@/components/portal/features/common/AttachmentEdit';
import FloatingNavigation from '@/components/portal/ui/FloatingNavigation';
import Input from '@/components/portal/ui/Input';
import { AttachmentRequest } from '@/generated/attachment';

import Footer from "@/components/portal/layouts/Footer"

interface CareerContentFormProps {
  // 기본 정보
  title: string;
  isDefault: boolean;
  name: string;
  birthDate: number | undefined;
  gender: Resume_Gender | undefined;
  phone: string;
  email: string;
  position: string;
  description: string;
  
  // 각 섹션 데이터
  careers: ResumeUpdateRequest_CareerRequest[];
  projects: ResumeUpdateRequest_ProjectRequest[];
  educations: ResumeUpdateRequest_EducationRequest[];
  activities: ResumeUpdateRequest_ActivityRequest[];
  languages: ResumeUpdateRequest_LanguageSkillRequest[];
  attachments: AttachmentRequest[];
  
  // 핸들러
  onTitleChange: (title: string) => void;
  onIsDefaultChange: (isDefault: boolean) => void;
  onNameChange: (name: string) => void;
  onBirthDateChange: (birthDate: number | undefined) => void;
  onGenderChange: (gender: Resume_Gender | undefined) => void;
  onPhoneChange: (phone: string) => void;
  onEmailChange: (email: string) => void;
  onPositionChange: (position: string) => void;
  onDescriptionChange: (description: string) => void;
  onCareersChange: (careers: ResumeUpdateRequest_CareerRequest[]) => void;
  onProjectsChange: (projects: ResumeUpdateRequest_ProjectRequest[]) => void;
  onEducationsChange: (educations: ResumeUpdateRequest_EducationRequest[]) => void;
  onActivitiesChange: (activities: ResumeUpdateRequest_ActivityRequest[]) => void;
  onLanguagesChange: (languages: ResumeUpdateRequest_LanguageSkillRequest[]) => void;
  onAttachmentsChange: (attachments: AttachmentRequest[]) => void;
  
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
  position,
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
  onPositionChange,
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
    <section>
        <div className="contents">
            <div className="page-title">
                <div>
                    <div>
                        <input
                            type="checkbox"
                            checked={isDefault}
                            onChange={(e) => onIsDefaultChange(e.target.checked)}
                            id="isDefault"
                            className="input-resume"
                        />
                        <label htmlFor="isDefault"></label>
                        <Input
                            type="text"
                            label="제목"
                            placeholder="이력서 제목을 입력해 주세요."
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="page-cont">
                <article>
                    {/* 기본 정보 섹션 */}
                    <div id="basic-info" className="cont-box">
                        <BasicInfoEdit
                            name={name}
                            birthDate={birthDate}
                            gender={gender}
                            phone={phone}
                            email={email}
                            position={position}
                            description={description}
                            onNameChange={onNameChange}
                            onBirthDateChange={onBirthDateChange}
                            onGenderChange={onGenderChange}
                            onPhoneChange={onPhoneChange}
                            onEmailChange={onEmailChange}
                            onPositionChange={onPositionChange}
                            onDescriptionChange={onDescriptionChange}
                        />
                    </div>

                    {/* 학력 섹션 */}
                    <div id="education" className="cont-box">
                        <EducationEdit
                            educations={educations}
                            onUpdate={onEducationsChange}
                        />
                    </div>

                    {/* 경력 섹션 */}
                    <div id="career" className="cont-box">
                        <CareerEdit
                            careers={careers}
                            onUpdate={onCareersChange}
                        />
                    </div>

                    {/* 프로젝트 섹션 */}
                    <div id="project" className="cont-box">
                        <ProjectEdit
                            projects={projects}
                            onUpdate={onProjectsChange}
                        />
                    </div>

                    {/* 활동 섹션 */}
                    <div id="activity" className="cont-box">
                        <ActivityEdit
                            activities={activities}
                            onUpdate={onActivitiesChange}
                        />
                    </div>

                    {/* 어학 섹션 */}
                    <div id="language" className="cont-box">
                        <LanguageSkillEdit
                            languageSkills={languages}
                            onUpdate={onLanguagesChange}
                        />
                    </div>

                    {/* 첨부 섹션 */}
                    <div id="attachment" className="cont-box">
                        <AttachmentEdit
                            attachments={attachments}
                            onUpdate={onAttachmentsChange}
                        />
                    </div>
                </article>
                
                <FloatingNavigation
                    navigationItems={[
                        { id: 'basic-info', label: '기본 정보' },
                        { id: 'education', label: '학력' },
                        { id: 'career', label: '경력' },
                        { id: 'project', label: '프로젝트' },
                        { id: 'activity', label: '활동' },
                        { id: 'language', label: '언어' },
                        { id: 'attachment', label: '첨부' },
                    ]}
                    onSave={onSave}
                    onCancel={onCancel}
                    showCancelConfirm={!!onCancel}
                    cancelConfirmConfig={{
                        icon: '/assets/img/ico/ic-warning.svg',
                        title: '이력서 작성을 취소하시겠어요?',
                        description: '지금까지 입력한 내용이 저장되지 않아요.\n지금 나가면 처음부터 다시 작성해야 할 수 있어요.',
                        confirmText: '취소하기',
                        cancelText: '돌아가기',
                    }}
                />
            </div>
        </div>

        <Footer/>
    </section>
  );
};

export default CareerContentForm;
