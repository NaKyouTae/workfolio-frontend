'use client';

import React from 'react';
import Header from '@/components/portal/layouts/Header';
import CustomerServicePage from '@/components/portal/features/notices/CustomerServicePage';

export default function NoticesPageWrapper() {
  return (
    <>
      <Header />
      <CustomerServicePage />
    </>
  );
}

