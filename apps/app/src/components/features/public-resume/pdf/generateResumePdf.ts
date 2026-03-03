import type { ResumeDetail } from '@workfolio/shared/generated/common';
import type { ResumeTemplateSlug } from '../templates/resumeTemplateSlugs';
import { DEFAULT_RESUME_TEMPLATE_SLUG } from '../templates/resumeTemplateSlugs';

/**
 * ResumeDetail 데이터로 PDF Blob을 생성합니다.
 * slug별 PDF 문서 컴포넌트를 TEMPLATE_MAP에서 동적 로드하여 렌더링합니다.
 */
export async function generateResumePdf(
  resumeDetail: ResumeDetail,
  slug: ResumeTemplateSlug = DEFAULT_RESUME_TEMPLATE_SLUG,
): Promise<Blob> {
  const [{ pdf }, { createElement }, { TEMPLATE_MAP }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('react'),
    import('../templates/templateRegistry'),
  ]);

  const registration = TEMPLATE_MAP[slug];
  const { default: PdfDocument } = await registration.loadPdfDocument();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = createElement(PdfDocument, { resumeDetail }) as any;
  const blob = await pdf(element).toBlob();
  return blob;
}

/**
 * PDF Blob을 생성하고 브라우저에서 다운로드합니다.
 */
export async function downloadResumePdf(
  resumeDetail: ResumeDetail,
  fileName?: string,
  slug?: ResumeTemplateSlug,
): Promise<void> {
  const blob = await generateResumePdf(resumeDetail, slug);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || `${resumeDetail.name || '이력서'}_이력서.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
