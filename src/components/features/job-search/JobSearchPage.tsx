import React, { useState, useEffect, useCallback } from 'react';
import { JobSearch, Company } from '@/generated/common';
import { JobSearchListResponse } from '@/generated/job_search';
import HttpMethod from '@/enums/HttpMethod';
import DateUtil from '@/utils/DateUtil';
import JobSearchCompanyPage from '../job-search-company/JobSearchCompanyPage';
import { useUser } from '@/hooks/useUser';
import { createSampleJobSearches, createSampleCompanies } from '@/utils/sampleData';
import JobSearchCreateModal from './JobSearchCreateModal';
import JobSearchUpdateModal from './JobSearchUpdateModal';
import styles from './JobSearchPage.module.css';

const JobSearchPage: React.FC = () => {
  const { isLoggedIn } = useUser();
  const [jobSearches, setJobSearches] = useState<JobSearch[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingJobSearch, setEditingJobSearch] = useState<JobSearch | null>(null);
  const [selectedJobSearch, setSelectedJobSearch] = useState<JobSearch | null>(null);

  // 회사 목록 조회
  const fetchCompanies = useCallback(async () => {
    try {
      if (isLoggedIn) {
        // 로그인된 경우 서버에서 데이터 조회
        const response = await fetch('/api/workers/companies', {
          method: HttpMethod.GET,
        });

        if (response.ok) {
          const data = await response.json();
          setCompanies(data.companies || []);
        } else {
          console.error('Failed to fetch companies');
        }
      } else {
        // 로그인하지 않은 경우 샘플 데이터 사용
        console.log('Using sample company data for non-logged-in user');
        const sampleData = createSampleCompanies();
        setCompanies(sampleData);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  }, [isLoggedIn]);

  // 구직 목록 조회
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
    fetchCompanies();
    fetchJobSearches();
  }, [fetchCompanies, fetchJobSearches]);

  // 수정 모달 열기
  const openEditModal = (jobSearch: JobSearch) => {
    setEditingJobSearch(jobSearch);
    setIsEditModalOpen(true);
  };

  // 구직 상세 보기
  const viewJobSearchDetail = (jobSearch: JobSearch) => {
    setSelectedJobSearch(jobSearch);
  };

  // 뒤로가기
  const goBack = () => {
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

  // 구직 상세 페이지 표시
  if (selectedJobSearch) {
    return (
      <JobSearchCompanyPage
        jobSearch={selectedJobSearch}
        onBack={goBack}
      />
    );
  }

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          구직 관리
        </h1>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={`${styles.button} ${styles.addButton}`}
          >
            구직 추가
          </button>
        </div>
      </div>

      {/* 구직 목록 */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.tableHeaderCell}>제목</th>
              <th className={styles.tableHeaderCell}>시작일</th>
              <th className={styles.tableHeaderCell}>종료일</th>
              <th className={styles.tableHeaderCell}>이전 회사</th>
              <th className={styles.tableHeaderCell}>이후 회사</th>
              <th className={styles.tableHeaderCell}>메모</th>
              <th className={styles.tableHeaderCell}>작업</th>
            </tr>
          </thead>
          <tbody>
            {jobSearches.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyCell}>
                  등록된 구직이 없습니다
                </td>
              </tr>
            ) : (
              jobSearches.map((jobSearch) => (
                <tr key={jobSearch.id} className={styles.tableRow}>
                  <td className={styles.titleCell}>{jobSearch.title}</td>
                  <td className={styles.tableCell}>
                    {DateUtil.formatTimestamp(jobSearch.startedAt)}
                  </td>
                  <td className={styles.tableCell}>
                    {jobSearch.endedAt ? DateUtil.formatTimestamp(jobSearch.endedAt) : '-'}
                  </td>
                  <td className={styles.tableCell}>
                    {jobSearch.prevCompany?.name || '-'}
                  </td>
                  <td className={styles.tableCell}>
                    {jobSearch.nextCompany?.name || '-'}
                  </td>
                  <td className={styles.memoCell}>
                    <div 
                      className={styles.memoText}
                      title={jobSearch.memo || ''}
                    >
                      {jobSearch.memo || '-'}
                    </div>
                  </td>
                  <td className={styles.actionCell}>
                    <div className={styles.actionButtonGroup}>
                      <button
                        onClick={() => viewJobSearchDetail(jobSearch)}
                        className={`${styles.actionButton} ${styles.detailButton}`}
                      >
                        상세
                      </button>
                      <button
                        onClick={() => openEditModal(jobSearch)}
                        className={`${styles.actionButton} ${styles.editButton}`}
                      >
                        수정
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 구직 생성 모달 */}
      <JobSearchCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        companies={companies}
        onSuccess={fetchJobSearches}
      />

      {/* 구직 수정 모달 */}
      <JobSearchUpdateModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingJobSearch(null);
        }}
        editingJobSearch={editingJobSearch}
        companies={companies}
        onSuccess={fetchJobSearches}
      />
    </div>
  );
};

export default JobSearchPage;