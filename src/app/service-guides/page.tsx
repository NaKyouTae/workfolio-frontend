'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ServiceGuidesPageWrapper() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/service-guides/notices');
  }, [router]);

  return null;
}

