"use client";

import React from 'react';
import Header from "@/components/layouts/Header";
import JobSearchPage from '@/components/features/job-search/JobSearchPage';

const JobSearch = () => {
  return (
    <>
      <Header />
      <JobSearchPage />
    </>
  );
};

export default JobSearch;
