'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ResumeDetail, Resume_Gender } from '@/generated/common';
import { PublicResumeDetailResponse } from '@/app/api/anonymous/resumes/[publicId]/route';
import { normalizeEnumValue } from '@/utils/commonUtils';
import DateUtil from '@/utils/DateUtil';
import PublicCareerView from './view/PublicCareerView';
import PublicEducationView from './view/PublicEducationView';
import PublicProjectView from './view/PublicProjectView';
import PublicActivityView from './view/PublicActivityView';
import PublicLanguageSkillView from './view/PublicLanguageSkillView';
import { ResumeTemplateSlug } from './templates/resumeTemplateSlugs';
import styles from './PublicResumePage.module.css';
import vertical2Styles from './templates/vertical2.module.css';
import horizontal1Styles from './templates/horizontal1.module.css';
import horizontal2Styles from './templates/horizontal2.module.css';

interface PublicResumePageProps {
  /** 실제 공개 이력서 조회 시 사용. sampleData 사용 시 생략 가능 */
  publicId?: string;
  templateSlug?: ResumeTemplateSlug;
  /** 미리보기 모드: 샘플 데이터로 렌더 (fetch 생략) */
  sampleData?: ResumeDetail;
  /** PDF 미리보기: A4 용지·페이지 구분선 표시 (URL 미리보기와 구분) */
  previewMode?: 'url' | 'pdf';
}

function getTemplateStyles(templateSlug: ResumeTemplateSlug) {
  switch (templateSlug) {
    case 'vertical-2':
      return vertical2Styles;
    case 'horizontal-1':
      return horizontal1Styles;
    case 'horizontal-2':
      return horizontal2Styles;
    default:
      return null;
  }
}

/** 유료 템플릿: vertical-2, horizontal-1, horizontal-2 → 헤더/푸터(워크폴리오 브랜딩) 미노출 */
function isPaidTemplate(slug: ResumeTemplateSlug): boolean {
  return slug !== 'vertical-1';
}

const PublicResumePage: React.FC<PublicResumePageProps> = ({
  publicId,
  templateSlug = 'vertical-1',
  sampleData,
  previewMode = 'url',
}) => {
  const templateStyles = getTemplateStyles(templateSlug);
  const hideBranding = isPaidTemplate(templateSlug);
  const isVertical1 = templateSlug === 'vertical-1';
  const isVertical2 = templateSlug === 'vertical-2';
  const isHorizontal1 = templateSlug === 'horizontal-1';
  const isHorizontal2 = templateSlug === 'horizontal-2';
  const cn = (base: string, override?: string) =>
    override ? `${base} ${override}` : base;
  const [resumeDetail, setResumeDetail] = useState<ResumeDetail | null>(
    sampleData ?? null
  );
  const [isLoading, setIsLoading] = useState(!sampleData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sampleData) {
      setIsLoading(false);
      return;
    }
    const fetchResume = async () => {
      if (!publicId) return;
      try {
        setIsLoading(true);
        const response = await fetch(`/api/anonymous/resumes/${publicId}`);

        if (!response.ok) {
          throw new Error('이력서를 찾을 수 없습니다.');
        }

        const data: PublicResumeDetailResponse = await response.json();

        if (data.resume) {
          setResumeDetail(data.resume);
        } else {
          throw new Error('이력서를 찾을 수 없습니다.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '이력서를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [publicId, sampleData]);

  // 성별 표시
  const getGenderLabel = (gender?: Resume_Gender) => {
    if (normalizeEnumValue(gender, Resume_Gender) === Resume_Gender.MALE) return '남';
    if (normalizeEnumValue(gender, Resume_Gender) === Resume_Gender.FEMALE) return '여';
    return '';
  };

  // 생년월일 형식화 (만 나이 포함)
  const formatBirthDate = (timestamp?: number) => {
    if (!timestamp) return '';

    const birthDate = DateUtil.toDate(DateUtil.normalizeTimestamp(timestamp));
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();

    const currentMonth = now.getMonth();
    const currentDay = now.getDate();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
      age = age - 1;
    }

    return DateUtil.format(birthDate, `YYYY년 (만 ${age}세)`);
  };

  // 전화번호 포맷팅
  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return '';

    const numbers = phone.replace(/[^0-9]/g, '');

    if (numbers.length === 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else if (numbers.length === 10) {
      if (numbers.startsWith('02')) {
        return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
      } else {
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
      }
    } else if (numbers.length === 9) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5)}`;
    }

    return phone;
  };

  // 공개 기간 포맷팅
  const formatPublicPeriod = (startDate?: number, endDate?: number) => {
    if (!startDate && !endDate) return null;

    const formatDate = (timestamp?: number) => {
      if (!timestamp) return null;
      const date = DateUtil.toDate(DateUtil.normalizeTimestamp(timestamp));
      return DateUtil.format(date, 'YYYY.MM.DD');
    };

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    if (start && end) {
      return `${start} ~ ${end}`;
    } else if (start) {
      return `${start} ~`;
    } else if (end) {
      return `~ ${end}`;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className={cn(styles.container, templateStyles?.container)}>
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner}></div>
          <p>이력서를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !resumeDetail) {
    return (
      <div className={cn(styles.container, templateStyles?.container)}>
        <div className={styles.errorWrapper}>
          <div className={styles.errorIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#E0E0E0"/>
            </svg>
          </div>
          <h2>이력서를 찾을 수 없습니다</h2>
          <p>{error || '요청하신 이력서가 존재하지 않거나 비공개 상태입니다.'}</p>
          <a href="https://workfolio.kr" className={styles.homeButton}>
            워크폴리오 홈으로 이동
          </a>
        </div>
      </div>
    );
  }

  // 공개된 정보만 필터링 (isVisible === true일 때만 표시)
  const visibleCareers = resumeDetail.careers?.filter((c) => c.isVisible === true) || [];
  const visibleEducations = resumeDetail.educations?.filter((e) => e.isVisible === true) || [];
  const visibleProjects = resumeDetail.projects?.filter((p) => p.isVisible === true) || [];
  const visibleActivities = resumeDetail.activities?.filter((a) => a.isVisible === true) || [];
  const visibleLanguageSkills = resumeDetail.languageSkills?.filter((l) => l.isVisible === true) || [];

  const renderContactList = () => (
    <ul className={styles.contactList}>
      {resumeDetail.birthDate && (
        <li className={cn(styles.contactItem, templateStyles?.contactItem)}>
          <span className={cn(styles.contactIcon, templateStyles?.contactIcon)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" fill="currentColor"/>
            </svg>
          </span>
          {formatBirthDate(resumeDetail.birthDate)}
        </li>
      )}
      {resumeDetail.gender && getGenderLabel(resumeDetail.gender) && (
        <li className={cn(styles.contactItem, templateStyles?.contactItem)}>
          <span className={cn(styles.contactIcon, templateStyles?.contactIcon)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
            </svg>
          </span>
          {getGenderLabel(resumeDetail.gender)}
        </li>
      )}
      {resumeDetail.phone && (
        <li className={cn(styles.contactItem, templateStyles?.contactItem)}>
          <span className={cn(styles.contactIcon, templateStyles?.contactIcon)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
            </svg>
          </span>
          {formatPhoneNumber(resumeDetail.phone)}
        </li>
      )}
      {resumeDetail.email && (
        <li className={cn(styles.contactItem, templateStyles?.contactItem)}>
          <span className={cn(styles.contactIcon, templateStyles?.contactIcon)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
            </svg>
          </span>
          {resumeDetail.email}
        </li>
      )}
    </ul>
  );

  const isPdfPreview = previewMode === 'pdf';

  const content = (
    <div className={`${cn(styles.container, templateStyles?.container)}${isPdfPreview ? ` ${styles.containerPdf}` : ''}`}>
      <div className={`${cn(styles.resumeWrapper, templateStyles?.resumeWrapper)}${isPdfPreview ? ` ${styles.resumeWrapperPdf}` : ''}`}>
        {!hideBranding && (
          <div className={cn(styles.header, templateStyles?.header)}>
            <div className={styles.headerContent}>
              <a href="https://workfolio.kr" className={styles.logo}>
                <Image
                  src="/assets/img/logo/img-logo01.svg"
                  alt="워크폴리오"
                  width={140}
                  height={40}
                />
              </a>
            </div>
          </div>
        )}

        {/* 이력서 내용: 템플릿별 구조 분기 (PDF 미리보기 시 페이지 구분선) */}
        <div className={`${cn(styles.main, templateStyles?.main)}${isPdfPreview ? ` ${styles.mainPdfPages}` : ''}`}>
          {/* vertical-2: 1행에 이름+포지션 | 연락처, 다음 줄 소개, 그 다음 섹션들 */}
          {isVertical2 && (
            <>
              <div className={[cn(styles.profileSection, templateStyles?.profileSection), templateStyles?.profileRow].filter(Boolean).join(' ')}>
                <div className={templateStyles?.profileTitleBlock}>
                  {resumeDetail.name && (
                    <h1 className={cn(styles.name, templateStyles?.name)}>{resumeDetail.name}</h1>
                  )}
                  {resumeDetail.position && (
                    <p className={cn(styles.position, templateStyles?.position)}>{resumeDetail.position}</p>
                  )}
                  {resumeDetail.isPublic && formatPublicPeriod(resumeDetail.publicStartDate, resumeDetail.publicEndDate) && (
                    <p className={cn(styles.publicPeriod, templateStyles?.publicPeriod)}>
                      공개 기간: {formatPublicPeriod(resumeDetail.publicStartDate, resumeDetail.publicEndDate)}
                    </p>
                  )}
                </div>
                <div className={templateStyles?.contactBlock}>{renderContactList()}</div>
              </div>
              {resumeDetail.description && (
                <p className={cn(styles.description, templateStyles?.description)}>{resumeDetail.description}</p>
              )}
              {visibleEducations.length > 0 && (
                <div className={cn(styles.section, templateStyles?.section)}>
                  <PublicEducationView educations={visibleEducations} />
                </div>
              )}
              {visibleCareers.length > 0 && (
                <div className={cn(styles.section, templateStyles?.section)}>
                  <PublicCareerView careers={visibleCareers} />
                </div>
              )}
              {visibleProjects.length > 0 && (
                <div className={cn(styles.section, templateStyles?.section)}>
                  <PublicProjectView projects={visibleProjects} />
                </div>
              )}
              {visibleActivities.length > 0 && (
                <div className={cn(styles.section, templateStyles?.section)}>
                  <PublicActivityView activities={visibleActivities} />
                </div>
              )}
              {visibleLanguageSkills.length > 0 && (
                <div className={cn(styles.section, templateStyles?.section)}>
                  <PublicLanguageSkillView languageSkills={visibleLanguageSkills} />
                </div>
              )}
            </>
          )}

          {/* horizontal-1: 사이드바에 "연락처" / "소개" 라벨 + 블록 구조 */}
          {isHorizontal1 && (
            <>
              <div className={cn(styles.profileSection, templateStyles?.profileSection)}>
                <div className={cn(styles.profileHeader, templateStyles?.profileHeader)}>
                  <div className={styles.profileInfo}>
                    {resumeDetail.name && (
                      <h1 className={cn(styles.name, templateStyles?.name)}>{resumeDetail.name}</h1>
                    )}
                    {resumeDetail.position && (
                      <p className={cn(styles.position, templateStyles?.position)}>{resumeDetail.position}</p>
                    )}
                    {resumeDetail.isPublic && formatPublicPeriod(resumeDetail.publicStartDate, resumeDetail.publicEndDate) && (
                      <p className={cn(styles.publicPeriod, templateStyles?.publicPeriod)}>
                        공개 기간: {formatPublicPeriod(resumeDetail.publicStartDate, resumeDetail.publicEndDate)}
                      </p>
                    )}
                  </div>
                  <div className={templateStyles?.contactLabelBlock}>
                    <span className={templateStyles?.blockLabel}>연락처</span>
                    {renderContactList()}
                  </div>
                  {resumeDetail.description && (
                    <div className={templateStyles?.descriptionBlock}>
                      <span className={templateStyles?.blockLabel}>소개</span>
                      <p className={cn(styles.description, templateStyles?.description)}>{resumeDetail.description}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className={templateStyles?.mainContent}>
                {visibleEducations.length > 0 && (
                  <div className={cn(styles.section, templateStyles?.section)}>
                    <PublicEducationView educations={visibleEducations} />
                  </div>
                )}
                {visibleCareers.length > 0 && (
                  <div className={cn(styles.section, templateStyles?.section)}>
                    <PublicCareerView careers={visibleCareers} />
                  </div>
                )}
                {visibleProjects.length > 0 && (
                  <div className={cn(styles.section, templateStyles?.section)}>
                    <PublicProjectView projects={visibleProjects} />
                  </div>
                )}
                {visibleActivities.length > 0 && (
                  <div className={cn(styles.section, templateStyles?.section)}>
                    <PublicActivityView activities={visibleActivities} />
                  </div>
                )}
                {visibleLanguageSkills.length > 0 && (
                  <div className={cn(styles.section, templateStyles?.section)}>
                    <PublicLanguageSkillView languageSkills={visibleLanguageSkills} />
                  </div>
                )}
              </div>
            </>
          )}

          {/* horizontal-2: 사이드바에 ABOUT / CONTACT 라벨 구조 */}
          {isHorizontal2 && (
            <>
              <div className={cn(styles.profileSection, templateStyles?.profileSection)}>
                <div className={templateStyles?.profileTitleBlock}>
                  {resumeDetail.name && (
                    <h1 className={cn(styles.name, templateStyles?.name)}>{resumeDetail.name}</h1>
                  )}
                  {resumeDetail.position && (
                    <p className={cn(styles.position, templateStyles?.position)}>{resumeDetail.position}</p>
                  )}
                </div>
                <div className={templateStyles?.contactLabelBlock}>
                  <span className={templateStyles?.blockLabel}>CONTACT</span>
                  {renderContactList()}
                </div>
                {resumeDetail.description && (
                  <div className={templateStyles?.descriptionBlock}>
                    <span className={templateStyles?.blockLabel}>ABOUT</span>
                    <p className={cn(styles.description, templateStyles?.description)}>{resumeDetail.description}</p>
                  </div>
                )}
                {resumeDetail.isPublic && formatPublicPeriod(resumeDetail.publicStartDate, resumeDetail.publicEndDate) && (
                  <p className={cn(styles.publicPeriod, templateStyles?.publicPeriod)}>
                    공개 기간: {formatPublicPeriod(resumeDetail.publicStartDate, resumeDetail.publicEndDate)}
                  </p>
                )}
              </div>
              <div className={templateStyles?.mainContent}>
                {visibleEducations.length > 0 && (
                  <div className={cn(styles.section, templateStyles?.section)}>
                    <PublicEducationView educations={visibleEducations} />
                  </div>
                )}
                {visibleCareers.length > 0 && (
                  <div className={cn(styles.section, templateStyles?.section)}>
                    <PublicCareerView careers={visibleCareers} />
                  </div>
                )}
                {visibleProjects.length > 0 && (
                  <div className={cn(styles.section, templateStyles?.section)}>
                    <PublicProjectView projects={visibleProjects} />
                  </div>
                )}
                {visibleActivities.length > 0 && (
                  <div className={cn(styles.section, templateStyles?.section)}>
                    <PublicActivityView activities={visibleActivities} />
                  </div>
                )}
                {visibleLanguageSkills.length > 0 && (
                  <div className={cn(styles.section, templateStyles?.section)}>
                    <PublicLanguageSkillView languageSkills={visibleLanguageSkills} />
                  </div>
                )}
              </div>
            </>
          )}

          {/* vertical-1 기본: 기존 구조 + 헤더/푸터 */ }
          {(isVertical1) && (
            <>
              <div className={cn(styles.profileSection, templateStyles?.profileSection)}>
                <div className={cn(styles.profileHeader, templateStyles?.profileHeader)}>
                  <div className={styles.profileInfo}>
                    {resumeDetail.name && (
                      <h1 className={cn(styles.name, templateStyles?.name)}>{resumeDetail.name}</h1>
                    )}
                    {resumeDetail.position && (
                      <p className={cn(styles.position, templateStyles?.position)}>{resumeDetail.position}</p>
                    )}
                    {resumeDetail.isPublic && formatPublicPeriod(resumeDetail.publicStartDate, resumeDetail.publicEndDate) && (
                      <p className={cn(styles.publicPeriod, templateStyles?.publicPeriod)}>
                        공개 기간: {formatPublicPeriod(resumeDetail.publicStartDate, resumeDetail.publicEndDate)}
                      </p>
                    )}
                  </div>
                  {renderContactList()}
                </div>
                {resumeDetail.description && (
                  <p className={cn(styles.description, templateStyles?.description)}>{resumeDetail.description}</p>
                )}
              </div>
              {visibleEducations.length > 0 && (
                <div className={cn(styles.section, templateStyles?.section)}>
                  <PublicEducationView educations={visibleEducations} />
                </div>
              )}
              {visibleCareers.length > 0 && (
                <div className={cn(styles.section, templateStyles?.section)}>
                  <PublicCareerView careers={visibleCareers} />
                </div>
              )}
              {visibleProjects.length > 0 && (
                <div className={cn(styles.section, templateStyles?.section)}>
                  <PublicProjectView projects={visibleProjects} />
                </div>
              )}
              {visibleActivities.length > 0 && (
                <div className={cn(styles.section, templateStyles?.section)}>
                  <PublicActivityView activities={visibleActivities} />
                </div>
              )}
              {visibleLanguageSkills.length > 0 && (
                <div className={cn(styles.section, templateStyles?.section)}>
                  <PublicLanguageSkillView languageSkills={visibleLanguageSkills} />
                </div>
              )}
            </>
          )}
        </div>

        {!hideBranding && (
          <div className={cn(styles.footer, templateStyles?.footer)}>
            <p>
              <a href="https://workfolio.kr" target="_blank" rel="noopener noreferrer">
                워크폴리오
              </a>
              에서 나만의 이력서를 만들어보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );

  if (isPdfPreview) {
    return (
      <div className={styles.pdfPreviewFrame}>
        <div className={styles.pdfPreviewPaper}>
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default PublicResumePage;
