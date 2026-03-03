/**
 * URL path별 공개 이력서 UI 템플릿 식별자
 * - 무료 기본 템플릿: basic
 */
export const RESUME_TEMPLATE_SLUGS = ['basic'] as const;

export type ResumeTemplateSlug = (typeof RESUME_TEMPLATE_SLUGS)[number];

export const DEFAULT_RESUME_TEMPLATE_SLUG: ResumeTemplateSlug = 'basic';

export function isValidResumeTemplateSlug(
  slug: string | undefined
): slug is ResumeTemplateSlug {
  return (
    slug !== undefined &&
    (RESUME_TEMPLATE_SLUGS as readonly string[]).includes(slug)
  );
}
