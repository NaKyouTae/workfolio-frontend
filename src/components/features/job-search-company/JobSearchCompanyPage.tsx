import React, { useState, useEffect, useCallback } from 'react';
import { JobSearchCompany, JobSearch, JobSearchCompany_Status } from '@/generated/common';
import { JobSearchCompanyListResponse } from '@/generated/job_search_company';
import HttpMethod from '@/enums/HttpMethod';
import DateUtil from '@/utils/DateUtil';
import { useUser } from '@/hooks/useUser';
import { createSampleJobSearchCompanies } from '@/utils/sampleData';
import JobSearchCompanyCreateModal from './JobSearchCompanyCreateModal';
import JobSearchCompanyUpdateModal from './JobSearchCompanyUpdateModal';
import JobSearchUpdateModal from '../job-search/JobSearchUpdateModal';
import styles from './JobSearchCompanyPage.module.css';
import InterviewPage from '../interview/InterviewPage';

interface JobSearchCompanyPageProps {
  jobSearch: JobSearch;
  onBack?: () => void;
  onJobSearchDelete?: () => void;
}

const JobSearchCompanyPage: React.FC<JobSearchCompanyPageProps> = ({ jobSearch, onBack, onJobSearchDelete }) => {
  const { isLoggedIn } = useUser();
  const [jobSearchCompanies, setJobSearchCompanies] = useState<JobSearchCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<JobSearchCompany | undefined>();
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());
  const [isJobSearchEditModalOpen, setIsJobSearchEditModalOpen] = useState(false);

  // 이직 회사 목록 조회
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

  const deleteJobSearchCompany = async (id: string) => {
    if (!confirm('정말로 이 이직 회사를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/job-search-companies/${id}`, {
        method: HttpMethod.DELETE,
      });

      if (response.ok) {
        alert('이직 회사가 성공적으로 삭제되었습니다.');
        fetchJobSearchCompanies();
      } else {
        const errorData = await response.json();
        alert(`이직 회사 삭제에 실패했습니다: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error deleting job search company:', error);
      alert('이직 회사 삭제 중 오류가 발생했습니다.');
    }
  };

  const deleteJobSearch = async (id: string) => {
    if (!confirm('정말로 이 이직을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/job-searches/${id}`, {
        method: HttpMethod.DELETE,
      });

      if (response.ok) {
        alert('이직이 성공적으로 삭제되었습니다.');
        // 이직 홈으로 이동
        if (onBack) {
          onBack();
        }
        // 이직 리스트 갱신
        if (onJobSearchDelete) {
          onJobSearchDelete();
        }
      } else {
        const errorData = await response.json();
        alert(`이직 삭제에 실패했습니다: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error deleting job search:', error);
      alert('이직 삭제 중 오류가 발생했습니다.');
    }
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
          <div style={{ flex: 1 }}>
            <h2 className={styles.title}>{jobSearch.title}</h2>
            {!isLoggedIn && (
              <p style={{ fontSize: '12px', color: '#999', margin: '3px 0 0 0' }}>
                📋 샘플 데이터를 표시하고 있습니다.
              </p>
            )}
            
            {/* 이직 상세 정보 */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: '20px', 
              marginTop: '10px',
              fontSize: '14px',
              color: '#666'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>시작일:</span>
                <span>{jobSearch.startedAt ? DateUtil.formatTimestamp(jobSearch.startedAt) : '-'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>종료일:</span>
                <span>{jobSearch.endedAt ? DateUtil.formatTimestamp(jobSearch.endedAt) : '진행중'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>상태:</span>
                <span style={{ 
                  padding: '2px 8px', 
                  borderRadius: '4px', 
                  backgroundColor: jobSearch.endedAt ? '#e9ecef' : '#d4edda',
                  color: jobSearch.endedAt ? '#6c757d' : '#155724',
                  fontSize: '12px'
                }}>
                  {jobSearch.endedAt ? '완료' : '진행중'}
                </span>
              </div>
            </div>

            {/* 회사 정보 */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: '20px', 
              marginTop: '8px',
              fontSize: '14px',
              color: '#666'
            }}>
              {jobSearch.prevCompany && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontWeight: 'bold' }}>이전 회사:</span>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: '#f8f9fa',
                    color: '#495057',
                    fontSize: '12px'
                  }}>
                    {jobSearch.prevCompany.name}
                  </span>
                </div>
              )}
              {jobSearch.nextCompany && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontWeight: 'bold' }}>이후 회사:</span>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: '#f8f9fa',
                    color: '#495057',
                    fontSize: '12px'
                  }}>
                    {jobSearch.nextCompany.name}
                  </span>
                </div>
              )}
            </div>

            {/* 메모 */}
            {jobSearch.memo && (
              <div style={{ 
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  color: '#666', 
                  marginBottom: '5px' 
                }}>
                  메모
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#333',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-wrap'
                }}>
                  {jobSearch.memo}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.buttonGroup}>          
          <button
            onClick={() => setIsJobSearchEditModalOpen(true)}
            disabled={!isLoggedIn}
            className={`${styles.button} ${styles.editButton}`}
            style={{ 
              width: '70px', 
              height: '30px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '14px',
              backgroundColor: !isLoggedIn ? '#6c757d' : '#28a745',
              cursor: !isLoggedIn ? 'not-allowed' : 'pointer'
            }}
          >
            수정
          </button>
          <button
            onClick={() => deleteJobSearch(jobSearch.id)}
            disabled={!isLoggedIn}
            style={{ 
              width: '70px', 
              height: '30px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '14px',
              backgroundColor: !isLoggedIn ? '#6c757d' : '#dc3545',
              cursor: !isLoggedIn ? 'not-allowed' : 'pointer'
            }}
          >
            삭제
          </button>
        </div>
      </div>

      {/* 이직 회사 관리 섹션 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '0 20px'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333',
          margin: 0
        }}>
          이직 회사 관리
        </h3>
        <div style={{ display: 'flex', gap: '10px' }}>
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
            style={{ 
              width: '70px', 
              height: '30px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '14px'
            }}
          >
            새로고침
          </button>
          <button
            onClick={collapseAllCompanies}
            className={`${styles.button} ${styles.collapseButton}`}
            style={{ 
              width: '70px', 
              height: '30px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '14px'
            }}
          >
            모두 축소
          </button>
        </div>
      </div>

      {/* 이직 회사 테이블 */}
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
                  등록된 이직 회사가 없습니다
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
                          <button
                            onClick={() => deleteJobSearchCompany(company.id || '')}
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                          >
                            삭제
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

      {/* 이직 회사 생성 모달 */}
      <JobSearchCompanyCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchJobSearchCompanies}
        jobSearchId={jobSearch.id}
      />

      {/* 이직 회사 수정 모달 */}
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

      {/* 이직 수정 모달 */}
      <JobSearchUpdateModal
        isOpen={isJobSearchEditModalOpen}
        onClose={() => setIsJobSearchEditModalOpen(false)}
        editingJobSearch={jobSearch}
        companies={[]}
        onSuccess={() => {
          // 이직 수정 후 이직 리스트 갱신
          if (onJobSearchDelete) {
            onJobSearchDelete();
          }
        }}
      />
    </div>
  );
};

export default JobSearchCompanyPage;