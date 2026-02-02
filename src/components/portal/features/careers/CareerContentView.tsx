import React, { useState } from 'react';
import { ResumeDetail, Resume_Gender } from '@/generated/common';
import CareerView from './view/CareerView';
import ProjectView from './view/ProjectView';
import EducationView from './view/EducationView';
import ActivityView from './view/ActivityView';
import LanguageSkillView from './view/LanguageSkillView';
import AttachmentView from '@/components/portal/features/common/AttachmentView';
import FloatingNavigation from '@/components/portal/ui/FloatingNavigation';
import { buildPublicResumeUrl } from '@/components/portal/features/public-resume/templates/resumeTemplateConfig';
import { normalizeEnumValue } from '@/utils/commonUtils';
import DateUtil from '@/utils/DateUtil';
import { isLoggedIn } from '@/utils/authUtils';
import LoginModal from '@/components/portal/ui/LoginModal';
import CareerContentViewSkeleton from '@/components/portal/ui/skeleton/CareerContentViewSkeleton';
import { useNotification } from '@/hooks/useNotification';

interface CareerContentViewProps {
  selectedResumeDetail: ResumeDetail | null;
  isLoading?: boolean;
  onEdit: () => void;
  duplicateResume?: (resumeId?: string, onSuccess?: () => void) => Promise<void>;
  deleteResume?: (resumeId?: string, onSuccess?: () => void) => Promise<void>;
  exportPDF?: (resumeId?: string, onSuccess?: () => void) => Promise<void>;
  changeDefault?: (resumeId?: string) => Promise<void>;
}

/**
 * 이력서 상세 정보를 읽기 전용으로 표시하는 컴포넌트
 * 모든 View 컴포넌트들을 포함합니다
 */
const CareerContentView: React.FC<CareerContentViewProps> = ({
  selectedResumeDetail,
  isLoading = false,
  onEdit,
  duplicateResume,
  deleteResume,
  exportPDF,
  changeDefault,
}) => {
  // 비공개 정보 보기 상태
  const [showHidden, setShowHidden] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { showNotification } = useNotification();

  if (isLoading) {
    return <CareerContentViewSkeleton />;
  }

  // 편집 핸들러
  const handleEdit = () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    onEdit();
  };

  // 복제 핸들러
  const handleDuplicateResume = () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    if (duplicateResume) {
      duplicateResume(selectedResumeDetail?.id);
    }
  };

  // 삭제 핸들러
  const handleDeleteResume = () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    if (deleteResume) {
      deleteResume(selectedResumeDetail?.id);
    }
  };

  // 기본 이력 변경 핸들러
  const handleChangeDefault = () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    if (changeDefault && selectedResumeDetail?.id) {
      changeDefault(selectedResumeDetail.id);
    }
  };

  // PDF 내보내기 핸들러
  const handleExportPDF = () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    if (exportPDF) {
      exportPDF(selectedResumeDetail?.id);
    }
  };

  // URL 복사 핸들러 (선택된 템플릿 urlPath 있으면 해당 템플릿 URL로 생성)
  const handleCopyURL = async () => {
    if (!selectedResumeDetail?.publicId) {
      showNotification('공개 이력서 URL을 생성할 수 없습니다.', 'error');
      return;
    }
    // TODO: 선택된 URL 템플릿이 있으면 buildPublicResumeUrl(publicId, activeTemplate?.urlPath)
    const publicResumeUrl = buildPublicResumeUrl(selectedResumeDetail.publicId);

    try {
      await navigator.clipboard.writeText(publicResumeUrl);
      showNotification('공개 이력서 URL이 복사되었습니다.', 'success');
    } catch {
      showNotification('URL 복사에 실패했습니다.', 'error');
    }
  };

  // 비공개 정보 토글 핸들러
  const handleTogglePrivateInfo = () => {
    setShowHidden(prev => !prev);
  };

  // 성별 표시
  const getGenderLabel = (gender?: Resume_Gender) => {
    if (normalizeEnumValue(gender, Resume_Gender) === Resume_Gender.MALE) return '남';
    if (normalizeEnumValue(gender, Resume_Gender) === Resume_Gender.FEMALE) return '여';
    return '';
  };

  // 생년월일 형식화 (만 나이 포함)
  const formatBirthDate = (timestamp?: number) => {
    if (!timestamp) return '';
    
    // 타임스탬프가 밀리초 단위인지 초 단위인지 확인
    const birthDate = DateUtil.toDate(DateUtil.normalizeTimestamp(timestamp));
    
    const now = new Date();
    // 1단계: 현재 연도 - 출생 연도
    let age = now.getFullYear() - birthDate.getFullYear();

    // 2단계: 생일이 지났는지 확인
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

    // 생일이 지나지 않았으면 -1
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
      age = age - 1;
    }
    // 생일이 지났으면 그대로 유지

    return DateUtil.format(birthDate, `YYYY년 (만 ${age}세)`);
  };

  // 전화번호 포맷팅
  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return '';
    
    // 숫자만 추출
    const numbers = phone.replace(/[^0-9]/g, '');
    
    // 길이에 따라 포맷팅
    if (numbers.length === 11) {
      // 010-1234-5678
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else if (numbers.length === 10) {
      // 02-1234-5678 또는 031-123-4567
      if (numbers.startsWith('02')) {
        return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
      } else {
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
      }
    } else if (numbers.length === 9) {
      // 02-123-4567
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5)}`;
    }
    
    // 그 외의 경우 원본 반환
    return phone;
  };

  return (
    <div className="contents">
        <div className="page-title">
            <div>
                <div>
                    <input 
                        type="checkbox" 
                        className="input-resume" 
                        checked={selectedResumeDetail?.isDefault || false} 
                        onChange={() => {}}
                        onClick={handleChangeDefault}
                        id="isDefault" 
                        readOnly 
                    />
                    <label htmlFor="isDefault" onClick={handleChangeDefault}></label>
                    {
                        selectedResumeDetail?.title && (
                            <h2>{selectedResumeDetail?.title}</h2>
                        )
                    }
                </div>
                {selectedResumeDetail?.updatedAt && (
                  <p>
                    최종 수정일 : {DateUtil.formatTimestamp(selectedResumeDetail.updatedAt, 'YYYY. MM. DD.')}
                  </p>
                )}
            </div>
            <ul>
                <li onClick={handleEdit}>편집</li>
                <li onClick={handleDuplicateResume}>복제</li>
                <li onClick={handleDeleteResume}>삭제</li>
            </ul>
        </div>
        <div className="page-cont">
            <article>
                {/* 기본 정보 섹션 */}
                <div id="basic-info" className="cont-box resume-intro">
                    <div>
                        <div>
                            {
                            selectedResumeDetail?.name && (
                                <h3>{selectedResumeDetail?.name}</h3>
                            )
                            }
                            {
                            selectedResumeDetail?.position && (
                                <p>{selectedResumeDetail?.position}</p>
                            )
                            }    
                        </div>
                        <ul>
                            {
                            selectedResumeDetail?.birthDate && (
                                <li>{formatBirthDate(selectedResumeDetail.birthDate)}</li>
                            )
                            }
                            {
                            selectedResumeDetail?.gender && (
                                <li>{getGenderLabel(selectedResumeDetail.gender)}</li>
                            )
                            }
                            {
                            selectedResumeDetail?.phone && (
                                <li>{formatPhoneNumber(selectedResumeDetail.phone)}</li>
                            )
                            }
                            {
                            selectedResumeDetail?.email && (
                                <li>{selectedResumeDetail?.email}</li>
                            )
                            }
                        </ul>
                    </div>
                    {
                        selectedResumeDetail?.description && (
                        <p>{selectedResumeDetail?.description}</p>
                        )
                    }
                </div>

                {/* 학력 섹션 */}
                <div id="education" className="cont-box">
                    <EducationView educations={selectedResumeDetail?.educations || []} showHidden={showHidden} />
                </div>

                {/* 경력 섹션 */}
                <div id="career" className="cont-box">
                    <CareerView careers={selectedResumeDetail?.careers || []} showHidden={showHidden} />
                </div>

                {/* 프로젝트 섹션 */}
                <div id="project" className="cont-box">
                    <ProjectView projects={selectedResumeDetail?.projects || []} showHidden={showHidden} />
                </div>

                {/* 활동 섹션 */}
                <div id="activity" className="cont-box">
                    <ActivityView activities={selectedResumeDetail?.activities || []} showHidden={showHidden} />
                </div>

                {/* 언어 섹션 */}
                <div id="language" className="cont-box">
                    <LanguageSkillView languageSkills={selectedResumeDetail?.languageSkills || []} showHidden={showHidden} />
                </div>

                {/* 첨부 섹션 */}
                <div id="attachment" className="cont-box">
                    <AttachmentView attachments={selectedResumeDetail?.attachments || []} showHidden={showHidden} />
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
                actionButtons={[
                    {
                        label: showHidden ? '비공개 정보 숨기기' : '비공개 정보 보기',
                        onClick: handleTogglePrivateInfo,
                        className: 'line gray',
                    },
                    {
                        label: 'PDF 내보내기',
                        onClick: handleExportPDF,
                        className: 'dark-gray',
                    },
                    {
                        label: 'URL 공유하기',
                        onClick: handleCopyURL,
                        className: 'dark-gray',
                    },
                ]}
            />
        </div>

        {/* 스크롤 가능한 컨텐츠 */}
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default CareerContentView;

