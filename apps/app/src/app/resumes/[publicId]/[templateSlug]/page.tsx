'use client';

import { useParams } from 'next/navigation';
import PublicResumePage from '@/components/features/public-resume/PublicResumePage';
import { getResumeTemplateSlugFromUrlPath } from '@/components/features/public-resume/templates/resumeTemplateConfig';

/** /resumes/:publicId/:templateSlug → 해당 템플릿으로 렌더 */
export default function PublicResumeTemplatePageRoute() {
  const params = useParams();
  const publicId = params.publicId as string;
  const templateSlug = getResumeTemplateSlugFromUrlPath(params.templateSlug as string);

  return <PublicResumePage publicId={publicId} templateSlug={templateSlug} />;
}
