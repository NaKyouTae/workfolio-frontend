"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Header from "@/components/portal/layouts/Header";
import CareerPage from '@/components/portal/features/careers/CareerPage';

const CareerEdit = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <>
      <Header />
      <CareerPage initialResumeId={id} initialEditMode={true} />
    </>
  );
};

export default CareerEdit;

