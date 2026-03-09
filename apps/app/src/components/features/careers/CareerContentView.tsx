import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ResumeDetail, Resume_Gender } from '@workfolio/shared/generated/common';
import CareerView from './view/CareerView';
import ProjectView from './view/ProjectView';
import EducationView from './view/EducationView';
import ActivityView from './view/ActivityView';
import LanguageSkillView from './view/LanguageSkillView';
import AttachmentView from '@/components/features/common/AttachmentView';
import FloatingNavigation from '@workfolio/shared/ui/FloatingNavigation';
import { buildPublicResumeUrl } from '@/components/features/public-resume/templates/resumeTemplateConfig';
import { normalizeEnumValue } from '@workfolio/shared/utils/commonUtils';
import DateUtil from '@workfolio/shared/utils/DateUtil';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import LoginModal from '@workfolio/shared/ui/LoginModal';
import CareerContentViewSkeleton from '@workfolio/shared/ui/skeleton/CareerContentViewSkeleton';
import { useNotification } from '@workfolio/shared/hooks/useNotification';
import { useConfirm } from '@workfolio/shared/hooks/useConfirm';
import { UITemplate, WorkerUITemplate } from '@workfolio/shared/types/uitemplate';
import TemplateSelectModal from '@/components/features/ui-templates/TemplateSelectModal';
import { downloadResumePdf } from '@/components/features/public-resume/pdf/generateResumePdf';
import styles from './CareerContentView.module.css';

interface CareerContentViewProps {
  selectedResumeDetail: ResumeDetail | null;
  isLoading?: boolean;
  onEdit: () => void;
  duplicateResume?: (resumeId?: string, onSuccess?: () => void) => Promise<void>;
  deleteResume?: (resumeId?: string, onSuccess?: () => void) => Promise<void>;
  exportPDF?: (resumeId?: string, onSuccess?: () => void) => Promise<void>;
  copyURL?: (resumeId?: string) => void;
  changeDefault?: (resumeId?: string) => Promise<void>;
  togglePublic?: (resumeId?: string, isPublic?: boolean) => Promise<boolean>;
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
  changeDefault,
  togglePublic,
}) => {
  // 비공개 정보 보기 상태
  const [showHidden, setShowHidden] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNoTemplateModal, setShowNoTemplateModal] = useState(false);
  const [showTemplateSelectModal, setShowTemplateSelectModal] = useState(false);
  const [templateSelectType, setTemplateSelectType] = useState<'URL' | 'PDF'>('PDF');
  const [defaultUrlTemplate, setDefaultUrlTemplate] = useState<UITemplate | null>(null);
  const [defaultPdfTemplate, setDefaultPdfTemplate] = useState<UITemplate | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const { showNotification } = useNotification();
  const { confirm } = useConfirm();
  const router = useRouter();

  const fetchDefaultTemplates = useCallback(async () => {
    try {
      const response = await fetch('/api/ui-templates/my/default');
      if (response.ok) {
        const data = await response.json();
        setDefaultUrlTemplate(data.defaultUrlUiTemplate ?? data.default_url_ui_template ?? null);
        setDefaultPdfTemplate(data.defaultPdfUiTemplate ?? data.default_pdf_ui_template ?? null);
      }
    } catch (err) {
      console.error('Error fetching default templates:', err);
    }
  }, []);

  const checkActiveTemplates = useCallback(async (type: 'URL' | 'PDF'): Promise<boolean> => {
    try {
      const response = await fetch(`/api/ui-templates/my/active?type=${type}`);
      if (response.ok) {
        const data = await response.json();
        const list = data.worker_ui_templates ?? data.workerUiTemplates ?? [];
        return Array.isArray(list) && list.length > 0;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const setDefaultTemplate = useCallback(async (uiTemplateId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/ui-templates/my/default/${uiTemplateId}`, {
        method: 'PUT',
      });
      if (response.ok) {
        await fetchDefaultTemplates();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [fetchDefaultTemplates]);

  useEffect(() => {
    if (isLoggedIn()) {
      fetchDefaultTemplates();
    }
  }, [fetchDefaultTemplates]);

  // if (isLoading) {
  //   return <CareerContentViewSkeleton />;
  // }

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

  // PDF 실제 다운로드 실행
  const executePdfDownload = async () => {
    if (!selectedResumeDetail) return;
    setIsPdfGenerating(true);
    try {
      await downloadResumePdf(selectedResumeDetail);
      showNotification('PDF 저장 완료', 'success');
    } catch (error) {
      console.error('PDF generation failed:', error);
      showNotification('PDF 내보내기에 실패했습니다.', 'error');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // PDF 내보내기 핸들러
  const handleExportPDF = async () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    const hasTemplates = await checkActiveTemplates('PDF');
    if (!hasTemplates) {
      setShowNoTemplateModal(true);
      return;
    }
    // 기본 PDF 템플릿이 없으면 선택 모달
    if (!defaultPdfTemplate) {
      setTemplateSelectType('PDF');
      setShowTemplateSelectModal(true);
      return;
    }
    // 기본 템플릿이 있으면 바로 다운로드
    await executePdfDownload();
  };

  // 공개/비공개 토글 핸들러 (헤더 배지 클릭)
  const handleTogglePublic = async () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    if (!selectedResumeDetail?.id || !togglePublic) return;

    const currentlyPublic = selectedResumeDetail.isPublic;

    if (currentlyPublic) {
      const result = await confirm({
        title: '이력서를 비공개하시겠어요?',
        description: '비공개로 전환하면 공유된 URL로\n이력서를 볼 수 없게 돼요.',
        confirmText: '비공개하기',
        cancelText: '돌아가기',
      });
      if (!result) return;
    }

    const success = await togglePublic(selectedResumeDetail.id, !currentlyPublic);
    if (success) {
      showNotification(
        currentlyPublic ? '이력서가 비공개로 전환되었습니다.' : '이력서가 공개로 전환되었습니다.',
        'success'
      );
    }
  };

  // URL 복사 실행
  const executeCopyURL = async (urlTemplate?: UITemplate | null) => {
    if (!selectedResumeDetail?.publicId) return;
    const urlPath = (urlTemplate ?? defaultUrlTemplate)?.urlPath ?? undefined;
    const publicResumeUrl = buildPublicResumeUrl(selectedResumeDetail.publicId, urlPath);

    try {
      await navigator.clipboard.writeText(publicResumeUrl);
      showNotification('공개 이력서 URL이 복사되었습니다.', 'success');
    } catch {
      showNotification('URL 복사에 실패했습니다.', 'error');
    }
  };

  // URL 복사 핸들러 (기본 설정된 URL 템플릿의 urlPath로 공개 이력서 URL 생성)
  const handleCopyURL = async () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    if (!selectedResumeDetail?.publicId) {
      showNotification('공개 이력서 URL을 생성할 수 없습니다.', 'error');
      return;
    }

    // isPublic이 false인 경우 공개 전환 확인
    if (!selectedResumeDetail.isPublic && togglePublic) {
      const result = await confirm({
        title: '이력서를 공개하시겠어요?',
        description: 'URL을 공유하려면 이력서를 공개 상태로\n전환해야 해요.',
        confirmText: '공개하기',
        cancelText: '돌아가기',
      });
      if (!result) return;

      const success = await togglePublic(selectedResumeDetail.id, true);
      if (!success) return;
    }

    const hasTemplates = await checkActiveTemplates('URL');
    if (!hasTemplates) {
      setShowNoTemplateModal(true);
      return;
    }

    // 기본 URL 템플릿이 없으면 선택 모달
    if (!defaultUrlTemplate) {
      setTemplateSelectType('URL');
      setShowTemplateSelectModal(true);
      return;
    }

    await executeCopyURL();
  };

  // 템플릿 선택 모달에서 선택 시 콜백
  const handleTemplateSelected = async (wt: WorkerUITemplate) => {
    setShowTemplateSelectModal(false);
    const success = await setDefaultTemplate(wt.uiTemplate.id);
    if (!success) {
      showNotification('기본 템플릿 설정에 실패했습니다.', 'error');
      return;
    }

    if (templateSelectType === 'PDF') {
      setDefaultPdfTemplate(wt.uiTemplate);
      await executePdfDownload();
    } else {
      setDefaultUrlTemplate(wt.uiTemplate);
      await executeCopyURL(wt.uiTemplate);
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
                    <span
                        className={`${styles.publicStatusBadge} ${selectedResumeDetail?.isPublic ? styles.public : styles.private}`}
                        onClick={handleTogglePublic}
                        title={selectedResumeDetail?.isPublic ? '클릭하여 비공개로 전환' : '클릭하여 공개로 전환'}
                    >
                        {selectedResumeDetail?.isPublic ? '공개' : '비공개'}
                    </span>
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
                        {selectedResumeDetail?.profileImageUrl && (
                            <div style={{ marginBottom: '16px' }}>
                                <img
                                    src={selectedResumeDetail.profileImageUrl}
                                    alt="인물 사진"
                                    style={{
                                        width: '100px',
                                        height: '130px',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                    }}
                                />
                            </div>
                        )}
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
                        label: isPdfGenerating ? 'PDF 생성 중...' : 'PDF 내보내기',
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

        {/* 템플릿 미보유 모달 */}
        {showNoTemplateModal && (
          <div className={styles.noTemplateOverlay} onClick={() => setShowNoTemplateModal(false)}>
            <div className={styles.noTemplateModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.noTemplateContent}>
                <p>보유한 템플릿이 없습니다.<br />무료 템플릿을 구매하러 가시겠습니까?</p>
              </div>
              <div className={styles.noTemplateFooter}>
                <button
                  type="button"
                  className={styles.noTemplateCancelButton}
                  onClick={() => setShowNoTemplateModal(false)}
                >
                  취소
                </button>
                <button
                  type="button"
                  className={styles.noTemplateConfirmButton}
                  onClick={() => {
                    setShowNoTemplateModal(false);
                    router.push('/templates');
                  }}
                >
                  템플릿 보기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 템플릿 선택 모달 (기본 템플릿 미설정 시) */}
        <TemplateSelectModal
          isOpen={showTemplateSelectModal}
          type={templateSelectType}
          onSelect={handleTemplateSelected}
          onClose={() => setShowTemplateSelectModal(false)}
        />
    </div>
  );
};

export default CareerContentView;

