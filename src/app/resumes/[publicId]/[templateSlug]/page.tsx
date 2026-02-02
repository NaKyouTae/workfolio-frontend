'use client';

import { useParams } from 'next/navigation';
import PublicResumePage from '@/components/portal/features/public-resume/PublicResumePage';
import {
  isValidResumeTemplateSlug,
  DEFAULT_RESUME_TEMPLATE_SLUG,
} from '@/components/portal/features/public-resume/templates/resumeTemplateSlugs';

export default function PublicResumeTemplatePageRoute() {
  const params = useParams();
  const publicId = params.publicId as string;
  const templateSlug = params.templateSlug as string | undefined;

  const slug = isValidResumeTemplateSlug(templateSlug)
    ? templateSlug
    : DEFAULT_RESUME_TEMPLATE_SLUG;

  return <PublicResumePage publicId={publicId} templateSlug={slug} />;
}
