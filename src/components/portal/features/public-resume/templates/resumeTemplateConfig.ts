/**
 * 공개 이력서 URL 템플릿 데이터 ↔ 화면(slug) 매칭
 * - 백엔드 UITemplate.urlPath 와 프론트 ResumeTemplateSlug 를 연결
 * - 템플릿 메뉴에서 데이터와 화면 매칭, 공개 URL 생성에 사용
 */

import {
  type ResumeTemplateSlug,
  RESUME_TEMPLATE_SLUGS,
  DEFAULT_RESUME_TEMPLATE_SLUG,
  isValidResumeTemplateSlug,
} from './resumeTemplateSlugs';

/** URL 템플릿 1개에 대한 메타데이터 (메뉴/라벨/경로) */
export interface ResumeUrlTemplateConfig {
  slug: ResumeTemplateSlug;
  /** API에 저장할 path 세그먼트. 빈 문자열이면 기본(vertical-1) */
  urlPath: string;
  /** 템플릿 메뉴/선택 UI용 라벨 */
  label: string;
  /** 레이아웃 구분: 세로형 / 가로형 */
  layoutType: 'vertical' | 'horizontal';
}

/**
 * 슬러그별 설정 (단일 소스)
 * 백엔드 UITemplate.urlPath 에 이 urlPath 값을 넣으면 해당 화면과 매칭됨
 */
export const RESUME_URL_TEMPLATE_CONFIG: Record<
  ResumeTemplateSlug,
  ResumeUrlTemplateConfig
> = {
  'vertical-1': {
    slug: 'vertical-1',
    urlPath: '',
    label: '세로형 1',
    layoutType: 'vertical',
  },
  'vertical-2': {
    slug: 'vertical-2',
    urlPath: 'vertical-2',
    label: '세로형 2',
    layoutType: 'vertical',
  },
  'horizontal-1': {
    slug: 'horizontal-1',
    urlPath: 'horizontal-1',
    label: '가로형 1',
    layoutType: 'horizontal',
  },
  'horizontal-2': {
    slug: 'horizontal-2',
    urlPath: 'horizontal-2',
    label: '가로형 2',
    layoutType: 'horizontal',
  },
};

/** 슬러그로 설정 조회 */
export function getResumeTemplateConfig(
  slug: ResumeTemplateSlug
): ResumeUrlTemplateConfig {
  return RESUME_URL_TEMPLATE_CONFIG[slug];
}

/**
 * API UITemplate.urlPath → 화면용 ResumeTemplateSlug
 * 백엔드에 저장된 urlPath(빈 문자열 | "vertical-2" | "horizontal-1" | "horizontal-2")를 slug로 변환
 */
export function getResumeTemplateSlugFromUrlPath(
  urlPath: string | undefined | null
): ResumeTemplateSlug {
  if (urlPath == null || urlPath === '') {
    return DEFAULT_RESUME_TEMPLATE_SLUG;
  }
  const trimmed = urlPath.trim();
  return isValidResumeTemplateSlug(trimmed)
    ? trimmed
    : DEFAULT_RESUME_TEMPLATE_SLUG;
}

/**
 * 공개 이력서 전체 URL 생성
 * @param publicId 이력서 공개 ID
 * @param urlPath UITemplate.urlPath (빈 문자열이면 기본 템플릿)
 * @param origin optional base URL (default: window.location.origin)
 */
export function buildPublicResumeUrl(
  publicId: string,
  urlPath?: string | null,
  origin?: string
): string {
  const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : '');
  const slug = getResumeTemplateSlugFromUrlPath(urlPath);
  const config = RESUME_URL_TEMPLATE_CONFIG[slug];
  const pathSegment = config.urlPath ? `/${config.urlPath}` : '';
  return `${base}/resumes/${publicId}${pathSegment}`;
}

/**
 * UITemplate(URL 타입)이 어떤 화면(slug)과 매칭되는지 반환
 * 템플릿 메뉴에서 카드 클릭 시 미리보기 경로나, 구매 후 공개 URL 생성 시 사용
 */
export function getResumeTemplateSlugFromUITemplate(
  uiTemplate: { type?: string | number; urlPath?: string | null }
): ResumeTemplateSlug | null {
  if (uiTemplate.type !== 'URL' && uiTemplate.type !== 1) {
    return null;
  }
  return getResumeTemplateSlugFromUrlPath(uiTemplate.urlPath);
}

/** PDF 템플릿 url_path → 공개 이력서 레이아웃 slug (웹 미리보기용) */
const PDF_URL_PATH_TO_SLUG: Record<string, ResumeTemplateSlug> = {
  'pdf-vertical-1': 'vertical-1',
  'pdf-vertical-2': 'vertical-2',
  'pdf-horizontal-1': 'horizontal-1',
  'pdf-horizontal-2': 'horizontal-2',
};

/**
 * PDF 템플릿 urlPath → 레이아웃 slug (웹 미리보기 시 동일 레이아웃 적용)
 */
export function getResumeTemplateSlugFromPdfUrlPath(
  urlPath: string | undefined | null
): ResumeTemplateSlug | null {
  if (urlPath == null) return null;
  return PDF_URL_PATH_TO_SLUG[urlPath.trim()] ?? null;
}

/**
 * URL/PDF 템플릿 공통: 미리보기 페이지 경로 세그먼트 반환
 * - URL: vertical-1, vertical-2 등
 * - PDF: pdf-vertical-1, pdf-vertical-2 등
 * 미리보기 불가면 null
 */
export function getPreviewPathFromUITemplate(
  uiTemplate: { type?: string | number; urlPath?: string | null }
): string | null {
  if (uiTemplate.type === 'URL' || uiTemplate.type === 1) {
    const slug = getResumeTemplateSlugFromUrlPath(uiTemplate.urlPath);
    return slug ?? null;
  }
  if (uiTemplate.type === 'PDF' || uiTemplate.type === 2) {
    const path = uiTemplate.urlPath?.trim();
    return path && path in PDF_URL_PATH_TO_SLUG ? path : null;
  }
  return null;
}

/**
 * 미리보기 페이지 URL 파라미터(vertical-1 | pdf-vertical-1 등) → PublicResumePage에 넘길 slug
 */
export function getPreviewSlugFromParam(param: string | undefined): ResumeTemplateSlug {
  if (param == null) return DEFAULT_RESUME_TEMPLATE_SLUG;
  const trimmed = param.trim();
  if (isValidResumeTemplateSlug(trimmed)) return trimmed;
  return PDF_URL_PATH_TO_SLUG[trimmed] ?? DEFAULT_RESUME_TEMPLATE_SLUG;
}

/** 사용 가능한 모든 URL 템플릿 slug 목록 (displayOrder 등 정렬 시 참고용) */
export const RESUME_URL_TEMPLATE_SLUGS = RESUME_TEMPLATE_SLUGS;
