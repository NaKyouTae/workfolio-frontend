import React, { useState, useEffect } from 'react';
import { JobSearchCompany, JobSearch } from '@/generated/common';
import { JobSearchCompanyListResponse, JobSearchCompanyCreateRequest, JobSearchCompanyUpdateRequest } from '@/generated/job_search_company';
import HttpMethod from '@/enums/HttpMethod';
import DateUtil from '@/utils/DateUtil';
import InterviewManagementDetail from './InterviewManagementDetail';

interface JobSearchCompanyManagementProps {
  jobSearch: JobSearch;
  onBack: () => void;
}

const JobSearchCompanyManagement: React.FC<JobSearchCompanyManagementProps> = ({ jobSearch, onBack }) => {
  const [jobSearchCompanies, setJobSearchCompanies] = useState<JobSearchCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingCompany, setEditingCompany] = useState<JobSearchCompany | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<JobSearchCompany | null>(null);

  // 폼 상태
  const [createForm, setCreateForm] = useState<JobSearchCompanyCreateRequest>({
    name: '',
    status: '',
    appliedAt: 0,
    closedAt: 0,
    endedAt: undefined,
    link: undefined,
    industry: undefined,
    location: undefined,
    businessSize: undefined,
    description: undefined,
    memo: undefined,
    jobSearchId: jobSearch.id
  });

  // 구직 회사 목록 조회
  const fetchJobSearchCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/workers/job-search-companies?jobSearchId=${jobSearch.id}`, {
        method: HttpMethod.GET,
      });

      if (response.ok) {
        const data: JobSearchCompanyListResponse = await response.json();
        setJobSearchCompanies(data.jobSearchCompanies || []);
      } else {
        console.error('Failed to fetch job search companies');
      }
    } catch (error) {
      console.error('Error fetching job search companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobSearchCompanies();
  }, [jobSearch.id]);

  // 폼 입력 핸들러
  const handleFormChange = (field: keyof JobSearchCompanyCreateRequest, value: string | number | undefined) => {
    setCreateForm((prev: JobSearchCompanyCreateRequest) => ({
      ...prev,
      [field]: value
    }));
  };

  // 구직 회사 생성
  const createJobSearchCompany = async () => {
    try {
      setIsCreating(true);
      
      // 필수 필드 검증
      if (!createForm.name || !createForm.status) {
        alert('회사명과 상태는 필수 입력 항목입니다.');
        return;
      }

      const response = await fetch('/api/workers/job-search-companies', {
        method: HttpMethod.POST,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      });

      if (response.ok) {
        // 성공 시 목록 새로고침
        await fetchJobSearchCompanies();
        setIsCreateModalOpen(false);
        setCreateForm({
          name: '',
          status: '',
          appliedAt: 0,
          closedAt: 0,
          endedAt: undefined,
          link: undefined,
          industry: undefined,
          location: undefined,
          businessSize: undefined,
          description: undefined,
          memo: undefined,
          jobSearchId: jobSearch.id
        });
        alert('구직 회사가 성공적으로 생성되었습니다.');
      } else {
        const errorData = await response.json();
        alert(`구직 회사 생성 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error creating job search company:', error);
      alert('구직 회사 생성 중 오류가 발생했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  // 구직 회사 수정
  const updateJobSearchCompany = async () => {
    if (!editingCompany) return;

    try {
      setIsUpdating(true);
      
      const updateData: JobSearchCompanyUpdateRequest = {
        id: editingCompany.id,
        name: createForm.name,
        website: createForm.website,
        industry: createForm.industry,
        size: createForm.size,
        location: createForm.location,
        description: createForm.description,
        status: createForm.status,
        applicationDate: createForm.applicationDate,
        notes: createForm.notes
      };

      const response = await fetch('/api/workers/job-search-companies', {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        // 성공 시 목록 새로고침
        await fetchJobSearchCompanies();
        setIsEditModalOpen(false);
        setEditingCompany(null);
        setCreateForm({
          name: '',
          status: '',
          appliedAt: 0,
          closedAt: 0,
          endedAt: undefined,
          link: undefined,
          industry: undefined,
          location: undefined,
          businessSize: undefined,
          description: undefined,
          memo: undefined,
          jobSearchId: jobSearch.id
        });
        alert('구직 회사가 성공적으로 수정되었습니다.');
      } else {
        const errorData = await response.json();
        alert(`구직 회사 수정 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error updating job search company:', error);
      alert('구직 회사 수정 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 수정 모달 열기
  const openEditModal = (company: JobSearchCompany) => {
    setEditingCompany(company);
    setCreateForm({
      name: company.name,
      status: company.status,
      appliedAt: company.appliedAt,
      closedAt: company.closedAt,
      endedAt: company.endedAt,
      link: company.link,
      industry: company.industry,
      location: company.location,
      businessSize: company.businessSize,
      description: company.description,
      memo: company.memo,
      jobSearchId: jobSearch.id
    });
    setIsEditModalOpen(true);
  };

  // 회사 상세 보기
  const viewCompanyDetail = (company: JobSearchCompany) => {
    setSelectedCompany(company);
  };

  // 뒤로가기
  const goBack = () => {
    setSelectedCompany(null);
  };

  // 날짜를 timestamp로 변환
  const dateToTimestamp = (dateString: string) => {
    return new Date(dateString).getTime();
  };

  // timestamp를 날짜 문자열로 변환 (폼용)
  const timestampToDateString = (timestamp: number | undefined) => {
    if (!timestamp) return '';
    return new Date(timestamp).toISOString().split('T')[0];
  };

  // 상태별 색상 반환
  const getStatusColor = (status: string) => {
    switch (status) {
      case '관심있음': return { bg: '#e3f2fd', color: '#1976d2' };
      case '지원함': return { bg: '#fff3e0', color: '#f57c00' };
      case '면접중': return { bg: '#f3e5f5', color: '#7b1fa2' };
      case '최종합격': return { bg: '#e8f5e8', color: '#388e3c' };
      case '불합격': return { bg: '#ffebee', color: '#d32f2f' };
      case '포기': return { bg: '#f5f5f5', color: '#757575' };
      default: return { bg: '#f5f5f5', color: '#757575' };
    }
  };

  // 선택된 회사가 있으면 면접 관리 컴포넌트 표시
  if (selectedCompany) {
    return (
      <InterviewManagementDetail 
        jobSearchCompany={selectedCompany} 
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
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              backgroundColor: '#007bff',
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
        </div>
      </div>

      {/* 구직 회사 테이블 */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
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
                <td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#666', fontSize: '16px' }}>
                  등록된 구직 회사가 없습니다
                </td>
              </tr>
            ) : (
              jobSearchCompanies.map((company) => {
                const statusColor = getStatusColor(company.status);
                return (
                  <tr key={company.id} style={{ borderBottom: '1px solid #e9ecef' }}>
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
                        {company.status}
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
                          onClick={() => viewCompanyDetail(company)}
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 구직 회사 생성 모달 */}
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
                구직 회사 추가
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

            <form onSubmit={(e) => { e.preventDefault(); createJobSearchCompany(); }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 기본 정보 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      회사명 *
                    </label>
                    <input
                      type="text"
                      value={createForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="회사명을 입력하세요"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      상태 *
                    </label>
                    <select
                      value={createForm.status}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white'
                      }}
                      required
                    >
                      <option value="관심있음">관심있음</option>
                      <option value="지원함">지원함</option>
                      <option value="면접중">면접중</option>
                      <option value="최종합격">최종합격</option>
                      <option value="불합격">불합격</option>
                      <option value="포기">포기</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      웹사이트
                    </label>
                    <input
                      type="url"
                      value={createForm.website || ''}
                      onChange={(e) => handleFormChange('website', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      업종
                    </label>
                    <input
                      type="text"
                      value={createForm.industry || ''}
                      onChange={(e) => handleFormChange('industry', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="IT, 금융, 제조업 등"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      규모
                    </label>
                    <input
                      type="text"
                      value={createForm.size || ''}
                      onChange={(e) => handleFormChange('size', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="대기업, 중견기업, 스타트업 등"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      위치
                    </label>
                    <input
                      type="text"
                      value={createForm.location || ''}
                      onChange={(e) => handleFormChange('location', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="서울, 경기, 부산 등"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    지원일
                  </label>
                  <input
                    type="date"
                    value={createForm.applicationDate ? timestampToDateString(createForm.applicationDate) : ''}
                    onChange={(e) => handleFormChange('applicationDate', e.target.value ? dateToTimestamp(e.target.value) : undefined)}
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

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    회사 설명
                  </label>
                  <textarea
                    value={createForm.description || ''}
                    onChange={(e) => handleFormChange('description', e.target.value)}
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
                    placeholder="회사에 대한 간단한 설명을 입력하세요"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    메모
                  </label>
                  <textarea
                    value={createForm.notes || ''}
                    onChange={(e) => handleFormChange('notes', e.target.value)}
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
                    placeholder="추가 메모나 특이사항을 입력하세요"
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

      {/* 구직 회사 수정 모달 */}
      {isEditModalOpen && editingCompany && (
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
                구직 회사 수정
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingCompany(null);
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

            <form onSubmit={(e) => { e.preventDefault(); updateJobSearchCompany(); }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 기본 정보 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      회사명 *
                    </label>
                    <input
                      type="text"
                      value={createForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="회사명을 입력하세요"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      상태 *
                    </label>
                    <select
                      value={createForm.status}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white'
                      }}
                      required
                    >
                      <option value="관심있음">관심있음</option>
                      <option value="지원함">지원함</option>
                      <option value="면접중">면접중</option>
                      <option value="최종합격">최종합격</option>
                      <option value="불합격">불합격</option>
                      <option value="포기">포기</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      웹사이트
                    </label>
                    <input
                      type="url"
                      value={createForm.website || ''}
                      onChange={(e) => handleFormChange('website', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      업종
                    </label>
                    <input
                      type="text"
                      value={createForm.industry || ''}
                      onChange={(e) => handleFormChange('industry', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="IT, 금융, 제조업 등"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      규모
                    </label>
                    <input
                      type="text"
                      value={createForm.size || ''}
                      onChange={(e) => handleFormChange('size', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="대기업, 중견기업, 스타트업 등"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      위치
                    </label>
                    <input
                      type="text"
                      value={createForm.location || ''}
                      onChange={(e) => handleFormChange('location', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="서울, 경기, 부산 등"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    지원일
                  </label>
                  <input
                    type="date"
                    value={createForm.applicationDate ? timestampToDateString(createForm.applicationDate) : ''}
                    onChange={(e) => handleFormChange('applicationDate', e.target.value ? dateToTimestamp(e.target.value) : undefined)}
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

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    회사 설명
                  </label>
                  <textarea
                    value={createForm.description || ''}
                    onChange={(e) => handleFormChange('description', e.target.value)}
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
                    placeholder="회사에 대한 간단한 설명을 입력하세요"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    메모
                  </label>
                  <textarea
                    value={createForm.notes || ''}
                    onChange={(e) => handleFormChange('notes', e.target.value)}
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
                    placeholder="추가 메모나 특이사항을 입력하세요"
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
                    setEditingCompany(null);
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

export default JobSearchCompanyManagement;
