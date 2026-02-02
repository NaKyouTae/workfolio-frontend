'use client';

import { useParams } from 'next/navigation';
import PublicResumePage from '@/components/portal/features/public-resume/PublicResumePage';
import { DEFAULT_RESUME_TEMPLATE_SLUG } from '@/components/portal/features/public-resume/templates/resumeTemplateSlugs';

export default function PublicResumePageRoute() {
  const params = useParams();
  const publicId = params.publicId as string;

  return (
    <PublicResumePage
      publicId={publicId}
      templateSlug={DEFAULT_RESUME_TEMPLATE_SLUG}
    />
  );
}
