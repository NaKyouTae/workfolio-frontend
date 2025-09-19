import React, { useState, useEffect } from 'react';
import { Interview, Company } from '@/generated/common';
import { InterviewListResponse, InterviewCreateRequest } from '@/generated/interview';
import HttpMethod from '@/enums/HttpMethod';
import DateUtil from '@/utils/DateUtil';

const InterviewManagement: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  
  // 인터뷰 생성 폼 상태
  const [createForm, setCreateForm] = useState<InterviewCreateRequest>({
    title: '',
    startedAt: 0,
    endedAt: undefined,
    prevCompanyId: '',
    nextCompanyId: undefined,
    memo: undefined
  });

  // 인터뷰 목록 조회
  const fetchInterviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/workers/interviews', {
        method: HttpMethod.GET,
      });

      if (response.ok) {
        const data: InterviewListResponse = await response.json();
        setInterviews(data.interviews || []);
      } else {
        console.error('Failed to fetch interviews');
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 회사 목록 조회
  const fetchCompanies = async () => {
    try {
      setIsLoadingCompanies(true);
      const response = await fetch('/api/workers/companies', {
        method: HttpMethod.GET,
      });

      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companies || []);
      } else {
        console.error('Failed to fetch companies');
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
    fetchCompanies();
  }, []);

  // 인터뷰 생성 함수
  const createInterview = async () => {
    try {
      setIsCreating(true);
      
      // 필수 필드 검증
      if (!createForm.title || !createForm.startedAt || !createForm.prevCompanyId) {
        alert('제목, 시작일, 이전 회사는 필수 입력 항목입니다.');
        return;
      }

      const response = await fetch('/api/workers/interviews', {
        method: HttpMethod.POST,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      });

      if (response.ok) {
        // 성공 시 목록 새로고침
        await fetchInterviews();
        // 모달 닫기 및 폼 초기화
        setIsCreateModalOpen(false);
        setCreateForm({
          title: '',
          startedAt: 0,
          endedAt: undefined,
          prevCompanyId: '',
          nextCompanyId: undefined,
          memo: undefined
        });
        alert('인터뷰가 성공적으로 생성되었습니다.');
      } else {
        const errorData = await response.json();
        alert(`인터뷰 생성 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      alert('인터뷰 생성 중 오류가 발생했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  // 폼 입력 핸들러
  const handleFormChange = (field: keyof InterviewCreateRequest, value: string | number | undefined) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 날짜를 timestamp로 변환
  const dateToTimestamp = (dateString: string) => {
    return new Date(dateString).getTime();
  };

  // timestamp를 날짜 문자열로 변환 (폼용)
  const timestampToDateString = (timestamp: number) => {
    if (timestamp === 0) return '';
    return new Date(timestamp).toISOString().split('T')[0];
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px', 
          paddingBottom: '15px', 
          borderBottom: '2px solid #e0e0e0' 
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#333', 
            margin: 0 
          }}>
            인터뷰 관리
          </h2>
        </div>
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

  const renderAddButton = (title: string, backgroundColor: string = "#007bff", onClick: () => void) => (
    <div style={{ display: 'inline-block' }}>
      <button
        onClick={onClick}
        style={{
          backgroundColor: backgroundColor,
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '70px',
          height: '30px',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'nowrap'
        }}
        title={title}
      >
        {title}
      </button>
    </div>
  );

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
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#333', 
          margin: 0 
        }}>
          인터뷰 관리
        </h2>
         <div style={{ display: 'flex', gap: '8px' }}>
           {renderAddButton('추가', '#007bff', () => setIsCreateModalOpen(true))}
           {renderAddButton('새로고침', '#6c757d', () => fetchInterviews())}
         </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div>
        {interviews.length === 0 ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
            fontSize: '18px',
            color: '#666',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            등록된 인터뷰가 없습니다
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {interviews.map((interview) => (
              <div
                key={interview.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'box-shadow 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: '#333', 
                    margin: 0,
                    flex: 1
                  }}>
                    {interview.title || '제목 없음'}
                  </h3>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666',
                    backgroundColor: '#f8f9fa',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    ID: {interview.id}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>시작일</div>
                    <div style={{ fontSize: '14px', color: '#333' }}>
                      {DateUtil.formatTimestamp(interview.startedAt)}
                    </div>
                  </div>
                  
                  {interview.endedAt && (
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>종료일</div>
                      <div style={{ fontSize: '14px', color: '#333' }}>
                        {DateUtil.formatTimestamp(interview.endedAt)}
                      </div>
                    </div>
                  )}

                  {interview.prevCompany && (
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>이전 회사</div>
                      <div style={{ fontSize: '14px', color: '#333' }}>
                        {interview.prevCompany.name}
                      </div>
                    </div>
                  )}

                  {interview.nextCompany && (
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>다음 회사</div>
                      <div style={{ fontSize: '14px', color: '#333' }}>
                        {interview.nextCompany.name}
                      </div>
                    </div>
                  )}
                </div>

                {interview.memo && (
                  <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '12px', 
                    borderRadius: '4px',
                    borderLeft: '3px solid #007bff'
                  }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>메모</div>
                    <div style={{ fontSize: '14px', color: '#333', whiteSpace: 'pre-wrap' }}>
                      {interview.memo}
                    </div>
                  </div>
                )}

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #e9ecef',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  <span>생성: {DateUtil.formatTimestamp(interview.createdAt)}</span>
                  <span>수정: {DateUtil.formatTimestamp(interview.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 인터뷰 생성 모달 */}
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
            maxHeight: '80vh',
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
                인터뷰 추가
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

            <form onSubmit={(e) => { e.preventDefault(); createInterview(); }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 제목 */}
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
                    placeholder="인터뷰 제목을 입력하세요"
                    required
                  />
                </div>

                {/* 시작일 */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    시작일 *
                  </label>
                  <input
                    type="date"
                    value={timestampToDateString(createForm.startedAt)}
                    onChange={(e) => handleFormChange('startedAt', dateToTimestamp(e.target.value))}
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

                {/* 종료일 */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    종료일
                  </label>
                  <input
                    type="date"
                    value={createForm.endedAt ? timestampToDateString(createForm.endedAt) : ''}
                    onChange={(e) => handleFormChange('endedAt', e.target.value ? dateToTimestamp(e.target.value) : undefined)}
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

                {/* 이전 회사 */}
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
                      backgroundColor: 'white'
                    }}
                    required
                    disabled={isLoadingCompanies}
                  >
                    <option value="">회사를 선택하세요</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  {isLoadingCompanies && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      회사 목록을 불러오는 중...
                    </div>
                  )}
                </div>

                {/* 다음 회사 */}
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
                      backgroundColor: 'white'
                    }}
                    disabled={isLoadingCompanies}
                  >
                    <option value="">회사를 선택하세요 (선택사항)</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  {isLoadingCompanies && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      회사 목록을 불러오는 중...
                    </div>
                  )}
                </div>

                {/* 메모 */}
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
                    placeholder="인터뷰 관련 메모를 입력하세요"
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
    </div>
  );
};

export default InterviewManagement;
