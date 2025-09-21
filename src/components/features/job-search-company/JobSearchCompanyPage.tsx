import React, { useState, useEffect, useCallback } from 'react';
import { JobSearchCompany, JobSearch, JobSearchCompany_Status } from '@/generated/common';
import { JobSearchCompanyListResponse } from '@/generated/job_search_company';
import HttpMethod from '@/enums/HttpMethod';
import DateUtil from '@/utils/DateUtil';
import InterviewPage from '../interview/InterviewPage';
import { useUser } from '@/hooks/useUser';
import { createSampleJobSearchCompanies } from '@/utils/sampleData';
import JobSearchCompanyCreateModal from './JobSearchCompanyCreateModal';
import JobSearchCompanyUpdateModal from './JobSearchCompanyUpdateModal';

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

  // 상태별 색상 반환
  const getStatusColor = (status: JobSearchCompany_Status) => {
    switch (status) {
      case JobSearchCompany_Status.INTERESTED: return { bg: '#e3f2fd', color: '#1976d2' };
      case JobSearchCompany_Status.APPLIED: return { bg: '#fff3e0', color: '#f57c00' };
      case JobSearchCompany_Status.INTERVIEWING: return { bg: '#f3e5f5', color: '#7b1fa2' };
      case JobSearchCompany_Status.PASSED: return { bg: '#e8f5e8', color: '#388e3c' };
      case JobSearchCompany_Status.REJECTED: return { bg: '#ffebee', color: '#d32f2f' };
      case JobSearchCompany_Status.ABANDONED: return { bg: '#f5f5f5', color: '#757575' };
      case JobSearchCompany_Status.UNKNOWN: 
      case JobSearchCompany_Status.UNRECOGNIZED:
      default: return { bg: '#f5f5f5', color: '#757575' };
    }
  };

  // 상태별 한국어 텍스트 반환
  const getStatusText = (status: JobSearchCompany_Status) => {
    switch (status) {
      case JobSearchCompany_Status.INTERESTED: return '관심있음';
      case JobSearchCompany_Status.APPLIED: return '지원함';
      case JobSearchCompany_Status.INTERVIEWING: return '면접중';
      case JobSearchCompany_Status.PASSED: return '최종합격';
      case JobSearchCompany_Status.REJECTED: return '불합격';
      case JobSearchCompany_Status.ABANDONED: return '포기';
      case JobSearchCompany_Status.UNKNOWN: 
      case JobSearchCompany_Status.UNRECOGNIZED:
      default: return '알 수 없음';
    }
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

  return (
    <div style={{ padding: '20px' }}>
      {/* 헤더 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px', 
        paddingBottom: '15px', 
        borderBottom: '2px solid #e0e0e0' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '70px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}
          >
            ← 뒤로
          </button>
          <div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#333', 
              margin: 0 
            }}>
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
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!isLoggedIn}
            style={{
              backgroundColor: !isLoggedIn ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !isLoggedIn ? 'not-allowed' : 'pointer',
              width: '70px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}
          >
            추가
          </button>
          <button
            onClick={fetchJobSearchCompanies}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
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
            style={{
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '80px',
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

      {/* 구직 회사 테이블 */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333', width: '50px' }}></th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>회사명</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>상태</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>업종</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>규모</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>위치</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>지원일</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>마감일</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>링크</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>설명</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>메모</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>작업</th>
            </tr>
          </thead>
          <tbody>
            {jobSearchCompanies.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ padding: '40px', textAlign: 'center', color: '#666', fontSize: '16px' }}>
                  등록된 구직 회사가 없습니다
                </td>
              </tr>
            ) : (
              jobSearchCompanies.map((company) => {
                const statusColor = getStatusColor(company.status);
                const isExpanded = expandedCompanies.has(company.id);
                return (
                  <React.Fragment key={company.id}>
                    <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => toggleCompanyExpansion(company.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            color: '#666',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title={isExpanded ? '면접 정보 숨기기' : '면접 정보 보기'}
                        >
                          {isExpanded ? '▼' : '▶'}
                        </button>
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold' }}>{company.name}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: statusColor.bg,
                        color: statusColor.color,
                        fontWeight: 'bold'
                      }}>
                        {getStatusText(company.status)}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{company.industry || '-'}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{company.businessSize || '-'}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{company.location || '-'}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      {DateUtil.formatTimestamp(company.appliedAt)}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      {DateUtil.formatTimestamp(company.closedAt)}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
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
                    <td style={{ padding: '12px', fontSize: '14px', maxWidth: '200px' }}>
                      <div 
                        style={{ 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'
                        }}
                        title={company.description || ''}
                      >
                        {company.description || '-'}
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', maxWidth: '200px' }}>
                      <div 
                        style={{ 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'
                        }}
                        title={company.memo || ''}
                      >
                        {company.memo || '-'}
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button
                          onClick={() => openEditModal(company)}
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
                    {isExpanded && (
                      <tr>
                        <td colSpan={12} style={{ padding: '0', backgroundColor: '#f8f9fa' }}>
                          <div style={{ padding: '20px', borderTop: '1px solid #e9ecef' }}>
                            <InterviewPage jobSearchCompany={company} />
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
