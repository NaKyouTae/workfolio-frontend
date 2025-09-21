import React, { useState, useEffect, useCallback } from 'react';
import { JobSearchCompany, JobSearch, JobSearchCompany_Status } from '@/generated/common';
import { JobSearchCompanyListResponse } from '@/generated/job_search_company';
import HttpMethod from '@/enums/HttpMethod';
import DateUtil from '@/utils/DateUtil';
import { useUser } from '@/hooks/useUser';
import { createSampleJobSearchCompanies } from '@/utils/sampleData';
import JobSearchCompanyCreateModal from './JobSearchCompanyCreateModal';
import JobSearchCompanyUpdateModal from './JobSearchCompanyUpdateModal';
import styles from './JobSearchCompanyPage.module.css';
import InterviewPage from '../interview/InterviewPage';

interface JobSearchCompanyPageProps {
  jobSearch: JobSearch;
  onBack: () => void;
}

const JobSearchCompanyPage: React.FC<JobSearchCompanyPageProps> = ({ jobSearch, onBack }) => {
  const { isLoggedIn } = useUser();
  const [jobSearchCompanies, setJobSearchCompanies] = useState<JobSearchCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<JobSearchCompany | undefined>();
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());

  // 구직 회사 목록 조회
  const fetchJobSearchCompanies = useCallback(async () => {
    try {
      setIsLoading(true);

      console.log('jobSearch.id', jobSearch.id);
      
      if (isLoggedIn) {
        // 로그인된 경우 서버에서 데이터 조회
        const response = await fetch(`/api/job-search-companies?jobSearchId=${jobSearch.id}`, {
          method: HttpMethod.GET,
        });

        if (response.ok) {
          const data: JobSearchCompanyListResponse = await response.json();
          setJobSearchCompanies(data.jobSearchCompanies || []);
        } else {
          console.error('Failed to fetch job search companies');
        }
      } else {
        // 로그인하지 않은 경우 샘플 데이터 사용
        console.log('Using sample data for non-logged-in user');
        const sampleData = createSampleJobSearchCompanies(jobSearch.id);
        setJobSearchCompanies(sampleData);
      }
    } catch (error) {
      console.error('Error fetching job search companies:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, jobSearch.id]);

  useEffect(() => {
    fetchJobSearchCompanies();
  }, [fetchJobSearchCompanies]);

  // 수정 모달 열기
  const openEditModal = (company: JobSearchCompany) => {
    setEditingCompany(company);
    setIsEditModalOpen(true);
  };

  // 회사 행 확장/축소 토글
  const toggleCompanyExpansion = (companyId: string) => {
    setExpandedCompanies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(companyId)) {
        newSet.delete(companyId);
      } else {
        newSet.add(companyId);
      }
      return newSet;
    });
  };

  // 모든 회사 행 축소
  const collapseAllCompanies = () => {
    setExpandedCompanies(new Set());
  };

  // 상태 색상 반환
  const getStatusColor = (status: JobSearchCompany_Status) => {
    switch (status) {
      case JobSearchCompany_Status.UNKNOWN: return styles.statusUnknown;
      case JobSearchCompany_Status.INTERESTED: return styles.statusInterested;
      case JobSearchCompany_Status.APPLIED: return styles.statusApplied;
      case JobSearchCompany_Status.INTERVIEWING: return styles.statusInterviewing;
      case JobSearchCompany_Status.PASSED: return styles.statusPassed;
      case JobSearchCompany_Status.REJECTED: return styles.statusRejected;
      case JobSearchCompany_Status.ABANDONED: return styles.statusClosed;
      case JobSearchCompany_Status.UNRECOGNIZED:
      default: return styles.statusUnknown;
    }
  };

  // 상태 텍스트 반환
  const getStatusText = (status: JobSearchCompany_Status) => {
    switch (status) {
      case JobSearchCompany_Status.UNKNOWN: return '알 수 없음';
      case JobSearchCompany_Status.INTERESTED: return '관심있음';
      case JobSearchCompany_Status.APPLIED: return '지원함';
      case JobSearchCompany_Status.INTERVIEWING: return '면접 중';
      case JobSearchCompany_Status.PASSED: return '합격';
      case JobSearchCompany_Status.REJECTED: return '불합격';
      case JobSearchCompany_Status.ABANDONED: return '포기';
      case JobSearchCompany_Status.UNRECOGNIZED:
      default: return '알 수 없음';
    }
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
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={onBack}
            className={`${styles.button} ${styles.refreshButton}`}
          >
            ← 뒤로
          </button>
          <div>
            <h2 className={styles.title}>
              구직 회사 관리
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#666', 
              margin: '5px 0 0 0' 
            }}>
              구직: {jobSearch.title}
            </p>
            {!isLoggedIn && (
              <p style={{ fontSize: '12px', color: '#999', margin: '3px 0 0 0' }}>
                📋 샘플 데이터를 표시하고 있습니다.
              </p>
            )}
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!isLoggedIn}
            className={`${styles.button} ${styles.addButton}`}
            style={{ 
              width: '70px', 
              height: '30px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '14px',
              backgroundColor: !isLoggedIn ? '#6c757d' : '#007bff',
              cursor: !isLoggedIn ? 'not-allowed' : 'pointer'
            }}
          >
            추가
          </button>
          <button
            onClick={fetchJobSearchCompanies}
            className={`${styles.button} ${styles.refreshButton}`}
          >
            새로고침
          </button>
          <button
            onClick={collapseAllCompanies}
            className={`${styles.button} ${styles.collapseButton}`}
          >
            모두 축소
          </button>
        </div>
      </div>

      {/* 구직 회사 테이블 */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.expandHeaderCell}></th>
              <th className={styles.tableHeaderCell}>회사명</th>
              <th className={styles.tableHeaderCell}>상태</th>
              <th className={styles.tableHeaderCell}>업종</th>
              <th className={styles.tableHeaderCell}>규모</th>
              <th className={styles.tableHeaderCell}>위치</th>
              <th className={styles.tableHeaderCell}>지원일</th>
              <th className={styles.tableHeaderCell}>마감일</th>
              <th className={styles.tableHeaderCell}>링크</th>
              <th className={styles.tableHeaderCell}>설명</th>
              <th className={styles.tableHeaderCell}>메모</th>
              <th className={styles.tableHeaderCell}>작업</th>
            </tr>
          </thead>
          <tbody>
            {jobSearchCompanies.length === 0 ? (
              <tr className={styles.emptyRow}>
                <td colSpan={12} className={styles.emptyCell}>
                  등록된 구직 회사가 없습니다
                </td>
              </tr>
            ) : (
              jobSearchCompanies.map((company) => {
                const isExpanded = expandedCompanies.has(company.id);
                return (
                  <React.Fragment key={company.id}>
                    <tr className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        <button
                          onClick={() => toggleCompanyExpansion(company.id)}
                          className={styles.expandButton}
                          title={isExpanded ? '면접 정보 숨기기' : '면접 정보 보기'}
                        >
                          {isExpanded ? '▼' : '▶'}
                        </button>
                      </td>
                      <td className={styles.companyNameCell}>{company.name}</td>
                      <td className={styles.statusCell}>
                        <span className={`${styles.statusBadge} ${getStatusColor(company.status)}`}>
                          {getStatusText(company.status)}
                        </span>
                      </td>
                      <td className={styles.tableCell}>{company.industry || '-'}</td>
                      <td className={styles.tableCell}>{company.businessSize || '-'}</td>
                      <td className={styles.tableCell}>{company.location || '-'}</td>
                      <td className={styles.tableCell}>
                        {DateUtil.formatTimestamp(company.appliedAt)}
                      </td>
                      <td className={styles.tableCell}>
                        {DateUtil.formatTimestamp(company.closedAt)}
                      </td>
                      <td className={styles.tableCell}>
                        {company.link ? (
                          <a 
                            href={company.link.startsWith('http') ? company.link : `https://${company.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#007bff', textDecoration: 'none' }}
                          >
                            링크
                          </a>
                        ) : '-'}
                      </td>
                      <td className={styles.descriptionCell}>
                        <div 
                          className={styles.descriptionText}
                          title={company.description || ''}
                        >
                          {company.description || '-'}
                        </div>
                      </td>
                      <td className={styles.memoCell}>
                        <div 
                          className={styles.memoText}
                          title={company.memo || ''}
                        >
                          {company.memo || '-'}
                        </div>
                      </td>
                      <td className={styles.actionCell}>
                        <div className={styles.actionButtonGroup}>
                          <button
                            onClick={() => openEditModal(company)}
                            className={`${styles.actionButton} ${styles.detailButton}`}
                          >
                            수정
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className={styles.expandedRow}>
                        <td colSpan={12} className={styles.expandedCell}>
                          <div className={styles.expandedContent}>
                            <InterviewPage
                              jobSearchCompany={company}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 구직 회사 생성 모달 */}
      <JobSearchCompanyCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchJobSearchCompanies}
        jobSearchId={jobSearch.id}
      />

      {/* 구직 회사 수정 모달 */}
      <JobSearchCompanyUpdateModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCompany(undefined);
        }}
        editingCompany={editingCompany}
        onSuccess={fetchJobSearchCompanies}
        jobSearchId={jobSearch.id}
      />
    </div>
  );
};

export default JobSearchCompanyPage;