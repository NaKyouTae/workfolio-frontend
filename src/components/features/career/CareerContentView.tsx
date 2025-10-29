import React, { useState } from 'react';
import { ResumeDetail, Resume_Gender } from '@/generated/common';
import CareerView from './view/CareerView';
import ProjectView from './view/ProjectView';
import EducationView from './view/EducationView';
import ActivityView from './view/ActivityView';
import LanguageSkillView from './view/LanguageSkillView';
import AttachmentView from './view/AttachmentView';
import ViewFloatingNavigation from './ViewFloatingNavigation';
import { normalizeEnumValue } from '@/utils/commonUtils';
import styles from './CareerContentView.module.css';
import DateUtil from '@/utils/DateUtil';

interface CareerContentViewProps {
  selectedResumeDetail: ResumeDetail | null;
  onEdit: () => void;
  duplicateResume?: (resumeId?: string, onSuccess?: () => void) => Promise<void>;
  deleteResume?: (resumeId?: string, onSuccess?: () => void) => Promise<void>;
  exportPDF?: (resumeId?: string, onSuccess?: () => void) => Promise<void>;
  copyURL?: (publicId?: string, onSuccess?: () => void) => Promise<void>;
}

/**
 * 이력서 상세 정보를 읽기 전용으로 표시하는 컴포넌트
 * 모든 View 컴포넌트들을 포함합니다
 */
const CareerContentView: React.FC<CareerContentViewProps> = ({ 
  selectedResumeDetail, 
  onEdit, 
  duplicateResume,
  deleteResume,
  exportPDF,
  copyURL,
}) => {
  // 비공개 정보 보기 상태
  const [showHidden, setShowHidden] = useState(false);

  // 복제 핸들러
  const handleDuplicateResume = () => {
    if (duplicateResume) {
      duplicateResume(selectedResumeDetail?.id);
    }
  };

  // 삭제 핸들러
  const handleDeleteResume = () => {
    if (deleteResume) {
      deleteResume(selectedResumeDetail?.id);
    }
  };

  // PDF 내보내기 핸들러
  const handleExportPDF = () => {
    if (exportPDF) {
      exportPDF(selectedResumeDetail?.id);
    }
  };

  // URL 복사 핸들러
  const handleCopyURL = () => {
    if (copyURL) {
      copyURL(selectedResumeDetail?.publicId);
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
    <div className={styles.container}>
      {/* 메인 컨텐츠 */}
      <div className={styles.mainContent}>
        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ul>
                  <li>
                      <input
                          type="checkbox"
                          checked={selectedResumeDetail?.isDefault || false}
                          readOnly
                          id="isDefault"
                      />
                      <label htmlFor="isDefault"><p>{selectedResumeDetail?.isDefault ? '기본' : ''}</p></label>
                  </li>
                </ul>
                {
                  selectedResumeDetail?.title && (
                    <h1 className={styles.title}>
                      {selectedResumeDetail?.title}
                    </h1>
                  )
                }
                {selectedResumeDetail?.updatedAt && (
                  <span style={{ fontSize: '14px', fontWeight: '400', color: '#999' }}>
                    최종 수정일 : {DateUtil.formatTimestamp(selectedResumeDetail.updatedAt, 'YYYY. MM. DD.')}
                  </span>
                )}
              </div>
            </div>

            {/* 액션 링크들 */}
            <div className={styles.actions}>
              <button
                onClick={onEdit}
                className={styles.actionButton}
              >
                편집
              </button>
              <span className={styles.divider}>|</span>
              <button
                onClick={handleDuplicateResume}
                className={styles.actionButton}
              >
                복제
              </button>
              <span className={styles.divider}>|</span>
              <button
                onClick={handleDeleteResume}
                className={styles.actionButton}
              >
                삭제
              </button>
            </div>
          </div>
        </div>

        {/* 스크롤 가능한 컨텐츠 */}
        <div className={styles.scrollContent}>
          <div className={styles.contentInner}>
            {/* 기본 정보 섹션 */}
            <div id="basic-info" className={styles.basicInfo}>
              <h2 className={styles.userName}>
                {
                  selectedResumeDetail?.name && (
                    <span>
                      {selectedResumeDetail?.name}
                    </span>
                  )
                }
                {
                  selectedResumeDetail?.job && (
                    <span style={{ color: selectedResumeDetail?.job ? 'inherit' : '#ddd' }}>{selectedResumeDetail?.job}</span>
                  )
                }                
              </h2>
              <div className={styles.userMeta}>
                {
                  selectedResumeDetail?.birthDate && (
                    <span style={{ color: selectedResumeDetail?.birthDate ? 'inherit' : '#ddd' }}>
                      {formatBirthDate(selectedResumeDetail.birthDate)}
                    </span>
                  )
                }
                {
                  selectedResumeDetail?.gender && (
                    <>
                      {selectedResumeDetail?.birthDate && <span>|</span>}
                      <span style={{ color: selectedResumeDetail?.gender ? 'inherit' : '#ddd' }}>
                        {getGenderLabel(selectedResumeDetail.gender)}
                      </span>
                    </>
                  )
                }
                {
                  selectedResumeDetail?.phone && (
                    <>
                      {selectedResumeDetail?.gender && <span>|</span>}
                      <span style={{ color: selectedResumeDetail?.phone ? 'inherit' : '#ddd' }}>
                        {formatPhoneNumber(selectedResumeDetail.phone)}
                      </span>
                    </>
                  )
                }
                {
                  selectedResumeDetail?.email && (
                    <>
                      {selectedResumeDetail?.phone && <span>|</span>}
                      <span style={{ color: selectedResumeDetail?.email ? 'inherit' : '#ddd' }}>
                        {selectedResumeDetail?.email}
                      </span>
                    </>
                  )
                }
              </div>

              {/* 자기소개 */}
              {
                selectedResumeDetail?.description && (
                  <div>
                    <h3 className={styles.introTitle}>
                      -----
                    </h3>
                    <p className={styles.introText} style={{ color: selectedResumeDetail?.description ? 'inherit' : '#ddd' }}>
                      {selectedResumeDetail?.description}
                    </p>
                  </div>
                )
              }
            </div>

            {/* 학력 섹션 */}
            <div id="education" className={styles.section}>
              <EducationView educations={selectedResumeDetail?.educations || []} showHidden={showHidden} />
            </div>

            {/* 경력 섹션 */}
            <div id="career" className={styles.section}>
              <CareerView careers={selectedResumeDetail?.careers || []} showHidden={showHidden} />
            </div>

            {/* 프로젝트 섹션 */}
            <div id="project" className={styles.section}>
              <ProjectView projects={selectedResumeDetail?.projects || []} showHidden={showHidden} />
            </div>

            {/* 활동 섹션 */}
            <div id="activity" className={styles.section}>
              <ActivityView activities={selectedResumeDetail?.activities || []} showHidden={showHidden} />
            </div>

            {/* 언어 섹션 */}
            <div id="language" className={styles.section}>
              <LanguageSkillView languageSkills={selectedResumeDetail?.languageSkills || []} showHidden={showHidden} />
            </div>

            {/* 첨부 섹션 */}
            <div id="attachment" className={styles.section}>
              <AttachmentView attachments={selectedResumeDetail?.attachments || []} showHidden={showHidden} />
            </div>
          </div>
          {/* 플로팅 네비게이션 */}
          <ViewFloatingNavigation 
            showHidden={showHidden}
            onTogglePrivateInfo={handleTogglePrivateInfo}
            onExportPDF={handleExportPDF}
            onCopyURL={handleCopyURL}
          />
        </div>
      </div>
    </div>
  );
};

export default CareerContentView;

