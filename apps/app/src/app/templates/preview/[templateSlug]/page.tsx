'use client';

import { useParams } from 'next/navigation';
import PublicResumePage from '@/components/features/public-resume/PublicResumePage';
import { createSampleResumeDetailForPreview } from '@/utils/sampleCareerData';
import { getPreviewSlugFromParam } from '@/components/features/public-resume/templates/resumeTemplateConfig';

export default function TemplatePreviewPage() {
  const params = useParams();
  const templateSlugParam = params.templateSlug as string | undefined;

  const isPdfPreview = typeof templateSlugParam === 'string' && templateSlugParam.startsWith('pdf-');
  const templateSlug = getPreviewSlugFromParam(templateSlugParam);
  const sampleData = createSampleResumeDetailForPreview();

  return (
    <PublicResumePage
      sampleData={sampleData}
      previewMode={isPdfPreview ? 'pdf' : 'url'}
      templateSlug={templateSlug}
    />
  );
}
