import React, { useState, useEffect, useCallback } from 'react';
import { JobSearch, Company } from '@/generated/common';
import { JobSearchListResponse, JobSearchUpsertRequest } from '@/generated/job_search';
import HttpMethod from '@/enums/HttpMethod';
import DateUtil from '@/utils/DateUtil';
import JobSearchCompanyPage from './JobSearchCompanyPage';
import { useUser } from '@/hooks/useUser';
import { createSampleJobSearches, createSampleCompanies } from '@/utils/sampleData';
import dayjs from 'dayjs';

const JobSearchManagement: React.FC = () => {
  const { isLoggedIn } = useUser();
  const [jobSearches, setJobSearches] = useState<JobSearch[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingJobSearch, setEditingJobSearch] = useState<JobSearch | null>(null);
  const [selectedJobSearch, setSelectedJobSearch] = useState<JobSearch | null>(null);

  // 폼 상태
  const [createForm, setCreateForm] = useState<JobSearchUpsertRequest>({
    title: '',
    startedAt: dayjs().unix(),
    endedAt: undefined,
    prevCompanyId: undefined,
    nextCompanyId: undefined,
    memo: ''
  });

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
        const response = await fetch('/api/workers/job-searches', {
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
        console.log('Using sample data for non-logged-in user');
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
    fetchJobSearches();
    fetchCompanies();
  }, [isLoggedIn, fetchJobSearches, fetchCompanies]);

  // 폼 입력 핸들러
  const handleFormChange = (field: keyof JobSearchUpsertRequest, value: string | number | undefined) => {
    setCreateForm((prev: JobSearchUpsertRequest) => ({
      ...prev,
      [field]: value
    }));
  };

  // 구직 생성
  const createJobSearch = async () => {
    try {
      setIsCreating(true);
      
      // 필수 필드 검증
      if (!createForm.title || !createForm.startedAt) {
        alert('제목, 시작일은 필수 입력 항목입니다.');
        return;
      }

      const response = await fetch('/api/workers/job-searches', {
        method: HttpMethod.POST,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      });

      if (response.ok) {
        // 성공 시 목록 새로고침
        await fetchJobSearches();
        setIsCreateModalOpen(false);
        setCreateForm({
          title: '',
          startedAt: 0,
          endedAt: undefined,
          prevCompanyId: '',
          nextCompanyId: undefined,
          memo: ''
        });
        alert('구직이 성공적으로 생성되었습니다.');
      } else {
        const errorData = await response.json();
        alert(`구직 생성 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error creating job search:', error);
      alert('구직 생성 중 오류가 발생했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  // 수정 모달 열기
  const openEditModal = (jobSearch: JobSearch) => {
    setEditingJobSearch(jobSearch);
    setCreateForm({
      title: jobSearch.title || '',
      startedAt: jobSearch.startedAt,
      endedAt: jobSearch.endedAt,
      prevCompanyId: jobSearch.prevCompany?.id || '',
      nextCompanyId: jobSearch.nextCompany?.id || '',
      memo: jobSearch.memo || ''
    });
    setIsEditModalOpen(true);
  };

  // 구직 수정
  const updateJobSearch = async () => {
    if (!editingJobSearch) return;

    try {
      setIsUpdating(true);
      
      const updateData: JobSearchUpsertRequest = {
        title: createForm.title,
        startedAt: createForm.startedAt,
        endedAt: createForm.endedAt,
        prevCompanyId: createForm.prevCompanyId,
        nextCompanyId: createForm.nextCompanyId,
        memo: createForm.memo
      };

      const response = await fetch(`/api/workers/job-searches/${editingJobSearch.id}`, {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        // 성공 시 목록 새로고침
        await fetchJobSearches();
        setIsEditModalOpen(false);
        setEditingJobSearch(null);
        setCreateForm({
          title: '',
          startedAt: 0,
          endedAt: undefined,
          prevCompanyId: undefined,
          nextCompanyId: undefined,
          memo: ''
        });
        alert('구직이 성공적으로 수정되었습니다.');
      } else {
        const errorData = await response.json();
        alert(`구직 수정 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error updating job search:', error);
      alert('구직 수정 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 구직 상세 보기
  const viewJobSearchDetail = (jobSearch: JobSearch) => {
    setSelectedJobSearch(jobSearch);
  };

  // 뒤로가기
  const goBack = () => {
    setSelectedJobSearch(null);
  };

  // 선택된 구직이 있으면 회사 관리 컴포넌트 표시
  if (selectedJobSearch) {
    return (
      <JobSearchCompanyPage 
        jobSearch={selectedJobSearch} 
        onBack={goBack}
      />
    );
  }

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
        <div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#333', 
            margin: 0 
          }}>
            구직 관리
          </h2>
          {!isLoggedIn && (
            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>
              📋 샘플 데이터를 표시하고 있습니다. 로그인하면 실제 구직 정보를 관리할 수 있습니다.
            </p>
          )}
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
            onClick={fetchJobSearches}
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
        </div>
      </div>

      {/* 구직 테이블 */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>제목</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>시작일</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>종료일</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>이전 회사</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>다음 회사</th>
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
                <tr 
                  key={jobSearch.id} 
                  style={{ 
                    borderBottom: '1px solid #e9ecef',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold' }}>{jobSearch.title}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {DateUtil.formatTimestamp(jobSearch.startedAt)}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {jobSearch.endedAt ? DateUtil.formatTimestamp(jobSearch.endedAt) : '-'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{jobSearch.prevCompany?.name || '-'}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{jobSearch.nextCompany?.name || '-'}</td>
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
                          fontSize: '12px',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#218838';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#28a745';
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
      {isCreateModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '30px',
            width: '500px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '1px solid #e9ecef'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#333' }}>
                구직 추가
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); createJobSearch(); }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    제목 *
                  </label>
                  <input
                    type="text"
                    value={createForm.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="구직 제목을 입력하세요"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      시작일 *
                    </label>
                    <input
                      type="date"
                      value={createForm.startedAt ? DateUtil.formatTimestamp(createForm.startedAt) : ''}
                      onChange={(e) => handleFormChange('startedAt', e.target.value ? DateUtil.parseToTimestamp(e.target.value) : 0)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      종료일
                    </label>
                    <input
                      type="date"
                      value={createForm.endedAt && createForm.endedAt !== 0 ? DateUtil.formatTimestamp(createForm.endedAt) : ''}
                      onChange={(e) => handleFormChange('endedAt', e.target.value ? DateUtil.parseToTimestamp(e.target.value) : undefined)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      이전 회사 (선택사항)
                    </label>
                    <select
                      value={createForm.prevCompanyId}
                      onChange={(e) => handleFormChange('prevCompanyId', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="">이전 회사를 선택하세요</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name} {company.isWorking ? '(현재 재직 중)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      다음 회사 (선택사항)
                    </label>
                    <select
                      value={createForm.nextCompanyId || ''}
                      onChange={(e) => handleFormChange('nextCompanyId', e.target.value || undefined)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="">다음 회사를 선택하세요 (선택사항)</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name} {company.isWorking ? '(현재 재직 중)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    메모
                  </label>
                  <textarea
                    value={createForm.memo || ''}
                    onChange={(e) => handleFormChange('memo', e.target.value || undefined)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                    placeholder="구직에 대한 메모를 입력하세요"
                  />
                </div>
              </div>

              {/* 버튼 영역 */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '30px',
                paddingTop: '20px',
                borderTop: '1px solid #e9ecef'
              }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: isCreating ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isCreating ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {isCreating ? '생성 중...' : '생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 구직 수정 모달 */}
      {isEditModalOpen && editingJobSearch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '30px',
            width: '500px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '1px solid #e9ecef'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#333' }}>
                구직 수정
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingJobSearch(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); updateJobSearch(); }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    제목 *
                  </label>
                  <input
                    type="text"
                    value={createForm.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="구직 제목을 입력하세요"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      시작일 *
                    </label>
                    <input
                      type="date"
                      value={createForm.startedAt ? DateUtil.formatTimestamp(createForm.startedAt) : ''}
                      onChange={(e) => handleFormChange('startedAt', e.target.value ? DateUtil.parseToTimestamp(e.target.value) : 0)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      종료일
                    </label>
                    <input
                      type="date"
                      value={createForm.endedAt && createForm.endedAt !== 0 ? DateUtil.formatTimestamp(createForm.endedAt) : ''}
                      onChange={(e) => handleFormChange('endedAt', e.target.value ? DateUtil.parseToTimestamp(e.target.value) : undefined)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      이전 회사 *
                    </label>
                    <select
                      value={createForm.prevCompanyId}
                      onChange={(e) => handleFormChange('prevCompanyId', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                      required
                    >
                      <option value="">이전 회사를 선택하세요</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name} {company.isWorking ? '(현재 재직 중)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      다음 회사
                    </label>
                    <select
                      value={createForm.nextCompanyId || ''}
                      onChange={(e) => handleFormChange('nextCompanyId', e.target.value || undefined)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="">다음 회사를 선택하세요 (선택사항)</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name} {company.isWorking ? '(현재 재직 중)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    메모
                  </label>
                  <textarea
                    value={createForm.memo || ''}
                    onChange={(e) => handleFormChange('memo', e.target.value || undefined)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                    placeholder="구직에 대한 메모를 입력하세요"
                  />
                </div>
              </div>

              {/* 버튼 영역 */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '30px',
                paddingTop: '20px',
                borderTop: '1px solid #e9ecef'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingJobSearch(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: isUpdating ? '#6c757d' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {isUpdating ? '수정 중...' : '수정'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobSearchManagement;
