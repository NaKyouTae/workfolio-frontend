import type { ResumeDetail } from '@workfolio/shared/generated/common';
import type { ResumeTemplateSlug } from './resumeTemplateSlugs';
import BasicTemplate from './basic/BasicTemplate';

/** 모든 URL 템플릿 렌더러가 받는 공통 props */
export interface TemplateRendererProps {
  resumeDetail: ResumeDetail;
  previewMode: 'url' | 'pdf';
}

/** PDF 문서 컴포넌트 props */
export interface PdfDocumentProps {
  resumeDetail: ResumeDetail;
}

/**
 * 템플릿 등록 정보
 * - PDF와 URL 템플릿은 동일 slug로 한 세트 관리
 * - 각 slug 폴더에 URL 렌더러 + PDF 렌더러 + 공통 form 데이터 준비 함수 배치
 */
export interface TemplateRegistration {
  /** URL/웹 렌더링 컴포넌트 (직접 import — CSS가 메인 번들에 포함되어 FOUC 방지) */
  UrlComponent: React.FC<TemplateRendererProps>;
  /** PDF 문서 컴포넌트 동적 로더 (@react-pdf/renderer용) */
  loadPdfDocument: () => Promise<{ default: React.FC<PdfDocumentProps> }>;
}

/**
 * slug → 템플릿 등록 매핑
 *
 * 새 템플릿 추가 절차:
 *   1. templates/{slug}/ 폴더에 prepareData + URL 컴포넌트 + PDF 컴포넌트 생성
 *   2. 여기에 한 줄 추가
 *   3. resumeTemplateSlugs.ts에 slug 등록
 */
export const TEMPLATE_MAP: Record<ResumeTemplateSlug, TemplateRegistration> = {
  basic: {
    UrlComponent: BasicTemplate,
    loadPdfDocument: () => import('./basic/BasicPdfDocument'),
  },
};
