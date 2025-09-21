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
      <div style={{ padding: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
          fontSize: '18px',
          color: '#666'
        }}>
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
    <div style={{ padding: '20px' }}>
      {/* 헤더 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid #e9ecef'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#333' }}>
          구직 관리
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            구직 추가
          </button>
        </div>
      </div>

      {/* 구직 목록 */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>제목</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>시작일</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>종료일</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>이전 회사</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>이후 회사</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>메모</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>작업</th>
            </tr>
          </thead>
          <tbody>
            {jobSearches.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#666', fontSize: '16px' }}>
                  등록된 구직이 없습니다
                </td>
              </tr>
            ) : (
              jobSearches.map((jobSearch) => (
                <tr key={jobSearch.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold' }}>{jobSearch.title}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {DateUtil.formatTimestamp(jobSearch.startedAt)}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {jobSearch.endedAt ? DateUtil.formatTimestamp(jobSearch.endedAt) : '-'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {jobSearch.prevCompany?.name || '-'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {jobSearch.nextCompany?.name || '-'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', maxWidth: '200px' }}>
                    <div 
                      style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap'
                      }}
                      title={jobSearch.memo || ''}
                    >
                      {jobSearch.memo || '-'}
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button
                        onClick={() => viewJobSearchDetail(jobSearch)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        상세
                      </button>
                      <button
                        onClick={() => openEditModal(jobSearch)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
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