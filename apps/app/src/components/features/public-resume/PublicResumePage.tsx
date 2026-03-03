'use client';

import React, { useEffect, useState } from 'react';
import { ResumeDetail } from '@workfolio/shared/generated/common';
import { PublicResumeDetailResponse } from '@/app/api/anonymous/resumes/[publicId]/route';
import { TEMPLATE_MAP } from './templates/templateRegistry';
import { DEFAULT_RESUME_TEMPLATE_SLUG, type ResumeTemplateSlug } from './templates/resumeTemplateSlugs';
import styles from './PublicResumePage.module.css';

interface PublicResumePageProps {
  /** 실제 공개 이력서 조회 시 사용. sampleData 사용 시 생략 가능 */
  publicId?: string;
  /** 미리보기 모드: 샘플 데이터로 렌더 (fetch 생략) */
  sampleData?: ResumeDetail;
  /** PDF 미리보기: A4 용지·페이지 구분선 표시 (URL 미리보기와 구분) */
  previewMode?: 'url' | 'pdf';
  /** 적용할 템플릿 slug. 생략 시 기본 템플릿 */
  templateSlug?: ResumeTemplateSlug;
}

const PublicResumePage: React.FC<PublicResumePageProps> = ({
  publicId,
  sampleData,
  previewMode = 'url',
  templateSlug = DEFAULT_RESUME_TEMPLATE_SLUG,
}) => {
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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner}></div>
          <p>이력서를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !resumeDetail) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper}>
          <div className={styles.errorIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#E0E0E0"/>
            </svg>
          </div>
          <h2>이력서를 찾을 수 없습니다</h2>
          <p>{error || '요청하신 이력서가 존재하지 않거나 비공개 상태입니다.'}</p>
          <p className={styles.errorHint}>이력서가 비공개로 설정되어 있다면, 이력서 소유자에게 공개 전환을 요청해 주세요.</p>
          <div className={styles.errorActions}>
            <button
              type="button"
              className={styles.refreshButton}
              onClick={() => window.location.reload()}
            >
              새로고침
            </button>
            <a href="https://workfolio.kr" className={styles.homeButton}>
              워크폴리오 홈으로 이동
            </a>
          </div>
        </div>
      </div>
    );
  }

  const TemplateComponent = TEMPLATE_MAP[templateSlug].UrlComponent;

  return <TemplateComponent resumeDetail={resumeDetail} previewMode={previewMode} />;
};

export default PublicResumePage;
