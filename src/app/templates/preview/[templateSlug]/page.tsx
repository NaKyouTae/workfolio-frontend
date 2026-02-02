'use client';

import { useParams } from 'next/navigation';
import PublicResumePage from '@/components/portal/features/public-resume/PublicResumePage';
import { getPreviewSlugFromParam } from '@/components/portal/features/public-resume/templates/resumeTemplateConfig';
import { createSampleResumeDetailForPreview } from '@/utils/sampleCareerData';

export default function TemplatePreviewPage() {
  const params = useParams();
  const templateSlugParam = params.templateSlug as string | undefined;

  const slug = getPreviewSlugFromParam(templateSlugParam);
  const isPdfPreview = typeof templateSlugParam === 'string' && templateSlugParam.startsWith('pdf-');

  const sampleData = createSampleResumeDetailForPreview();

  return (
    <PublicResumePage
      templateSlug={slug}
      sampleData={sampleData}
      previewMode={isPdfPreview ? 'pdf' : 'url'}
    />
  );
}
