import React, { useState, useEffect, useCallback } from 'react';
import { JobSearch, Career } from '@/generated/common';
import { JobSearchListResponse } from '@/generated/job_search';
import HttpMethod from '@/enums/HttpMethod';
import { useUser } from '@/hooks/useUser';
import { createSampleJobSearches, createSampleCareers } from '@/utils/sampleData';
import JobSearchCreateModal from './JobSearchCreateModal';
import JobSearchUpdateModal from './JobSearchUpdateModal';
import JobSearchSidebar from './JobSearchSidebar';
import JobSearchHome from './JobSearchHome';
import styles from './JobSearchPage.module.css';

const JobSearchPage: React.FC = () => {
  const { isLoggedIn } = useUser();
  const [jobSearches, setJobSearches] = useState<JobSearch[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingJobSearch, setEditingJobSearch] = useState<JobSearch | null>(null);
  const [selectedJobSearch, setSelectedJobSearch] = useState<JobSearch | null>(null);

  // 회사 목록 조회
  const fetchCareers = useCallback(async () => {
    try {
      if (isLoggedIn) {
        // 로그인된 경우 서버에서 데이터 조회
        const response = await fetch('/api/careers', {
          method: HttpMethod.GET,
        });

        if (response.ok) {
          const data = await response.json();
          setCareers(data.careers || []);
        } else {
          console.error('Failed to fetch careers');
        }
      } else {
        // 로그인하지 않은 경우 샘플 데이터 사용
        console.log('Using sample careers data for non-logged-in user');
        const sampleData = createSampleCareers();
        setCareers(sampleData);
      }
    } catch (error) {
      console.error('Error fetching careers:', error);
    }
  }, [isLoggedIn]);

  // 이직 목록 조회
  const fetchJobSearches = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (isLoggedIn) {
        // 로그인된 경우 서버에서 데이터 조회
        const response = await fetch('/api/job-searches', {
          method: HttpMethod.GET,
        });

        if (response.ok) {
          const data: JobSearchListResponse = await response.json();
          setJobSearches(data.jobSearches || []);
        } else {
          console.error('Failed to fetch job searches');
        }
      } else {
        // 로그인하지 않은 경우 샘플 데이터 사용
        console.log('Using sample job search data for non-logged-in user');
        const sampleData = createSampleJobSearches();
        setJobSearches(sampleData);
      }
    } catch (error) {
      console.error('Error fetching job searches:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchCareers();
    fetchJobSearches();
  }, [fetchCareers, fetchJobSearches]);


  // 이직 상세 보기
  const viewJobSearchDetail = (jobSearch: JobSearch) => {
    setSelectedJobSearch(jobSearch);
  };

  // 이직 홈으로 이동
  const goHome = () => {
    setSelectedJobSearch(null);
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          로딩 중...
        </div>
      </div>
    );
  }

  return (
    <main style={{ display: 'flex', height: 'calc(100vh - 6.4rem)', backgroundColor: '#f8f9fa' }}>
      {/* 사이드바 */}
      <JobSearchSidebar
        jobSearches={jobSearches}
        selectedJobSearch={selectedJobSearch}
        onJobSearchSelect={viewJobSearchDetail}
        onAddJobSearch={() => setIsCreateModalOpen(true)}
        onGoHome={goHome}
      />

      {/* 메인 콘텐츠 영역 */}
      <JobSearchHome
        selectedJobSearch={selectedJobSearch}
        careers={careers}
        onBack={goHome}
        onJobSearchDelete={fetchJobSearches}
      />

      {/* 이직 생성 모달 */}
      <JobSearchCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        careers={careers}
        onSuccess={fetchJobSearches}
      />

      {/* 이직 수정 모달 */}
      <JobSearchUpdateModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingJobSearch(null);
        }}
        editingJobSearch={editingJobSearch}
        careers={careers}
        onSuccess={fetchJobSearches}
      />
    </main>
  );
};

export default JobSearchPage;