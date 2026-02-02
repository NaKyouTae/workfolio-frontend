'use client';

import { useParams } from 'next/navigation';
import PublicResumePage from '@/components/portal/features/public-resume/PublicResumePage';

export default function PublicResumePageRoute() {
  const params = useParams();
  const publicId = params.publicId as string;

  return <PublicResumePage publicId={publicId} />;
}
