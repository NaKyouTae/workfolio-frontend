'use client';

import React from 'react';
import Header from '@/components/portal/layouts/Header';
import NoticesIntegration from '@/components/portal/features/notices/NoticesIntegration';

export default function NoticesPage() {
  return (
    <>
      <Header />
      <NoticesIntegration />
    </>
  );
}

