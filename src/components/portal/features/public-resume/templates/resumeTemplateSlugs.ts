/**
 * URL path별 공개 이력서 UI 템플릿 식별자
 * - 세로형: vertical-1 (기본), vertical-2
 * - 가로형: horizontal-1, horizontal-2
 */
export const RESUME_TEMPLATE_SLUGS = [
  'vertical-1',
  'vertical-2',
  'horizontal-1',
  'horizontal-2',
] as const;

export type ResumeTemplateSlug = (typeof RESUME_TEMPLATE_SLUGS)[number];

export const DEFAULT_RESUME_TEMPLATE_SLUG: ResumeTemplateSlug = 'vertical-1';

export function isValidResumeTemplateSlug(
  slug: string | undefined
): slug is ResumeTemplateSlug {
  return (
    slug !== undefined &&
    (RESUME_TEMPLATE_SLUGS as readonly string[]).includes(slug)
  );
}

export function isHorizontalTemplate(slug: ResumeTemplateSlug): boolean {
  return slug === 'horizontal-1' || slug === 'horizontal-2';
}
