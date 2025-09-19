import React, { useState, useEffect } from 'react';
import { Interview } from '@/generated/common';
import { InterviewListResponse, InterviewCreateRequest, InterviewUpdateRequest } from '@/generated/interview';
import { JobSearchCompany } from '@/generated/common';
import HttpMethod from '@/enums/HttpMethod';
import DateUtil from '@/utils/DateUtil';

interface InterviewManagementDetailProps {
  jobSearchCompany: JobSearchCompany;
  onBack: () => void;
}

const InterviewManagementDetail: React.FC<InterviewManagementDetailProps> = ({ jobSearchCompany, onBack }) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);

  // 폼 상태
  const [createForm, setCreateForm] = useState<InterviewCreateRequest>({
    title: '',
    type: 0,
    startedAt: undefined,
    endedAt: undefined,
    memo: '',
    jobSearchId: jobSearchCompany.jobSearch?.id || ''
  });

  // 면접 목록 조회
  const fetchInterviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/workers/interviews?jobSearchId=${jobSearchCompany.jobSearch?.id}`, {
        method: HttpMethod.GET,
      });

      if (response.ok) {
        const data: InterviewListResponse = await response.json();
        setInterviews(data.jobSearchCompanies || []);
      } else {
        console.error('Failed to fetch interviews');
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [jobSearchCompany.jobSearch?.id]);

  // 폼 입력 핸들러
  const handleFormChange = (field: keyof InterviewCreateRequest, value: string | number | undefined) => {
    setCreateForm((prev: InterviewCreateRequest) => ({
      ...prev,
      [field]: value
    }));
  };

  // 면접 생성
  const createInterview = async () => {
    try {
      setIsCreating(true);
      
      // 필수 필드 검증
      if (!createForm.title || !createForm.type) {
        alert('제목과 면접 유형은 필수 입력 항목입니다.');
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
        setIsCreateModalOpen(false);
        setCreateForm({
          title: '',
          type: 0,
          startedAt: undefined,
          endedAt: undefined,
          memo: '',
          jobSearchId: jobSearchCompany.jobSearch?.id || ''
        });
        alert('면접이 성공적으로 생성되었습니다.');
      } else {
        const errorData = await response.json();
        alert(`면접 생성 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      alert('면접 생성 중 오류가 발생했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  // 면접 수정
  const updateInterview = async () => {
    if (!editingInterview) return;

    try {
      setIsUpdating(true);
      
      const updateData: InterviewUpdateRequest = {
        id: editingInterview.id,
        title: createForm.title,
        type: createForm.type,
        startedAt: createForm.startedAt,
        endedAt: createForm.endedAt,
        memo: createForm.memo,
        jobSearchId: jobSearchCompany.jobSearch?.id || ''
      };

      const response = await fetch('/api/workers/interviews', {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        // 성공 시 목록 새로고침
        await fetchInterviews();
        setIsEditModalOpen(false);
        setEditingInterview(null);
        setCreateForm({
          title: '',
          type: 0,
          startedAt: undefined,
          endedAt: undefined,
          memo: '',
          jobSearchId: jobSearchCompany.jobSearch?.id || ''
        });
        alert('면접이 성공적으로 수정되었습니다.');
      } else {
        const errorData = await response.json();
        alert(`면접 수정 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error updating interview:', error);
      alert('면접 수정 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 수정 모달 열기
  const openEditModal = (interview: Interview) => {
    setEditingInterview(interview);
    setCreateForm({
      title: interview.title || '',
      type: interview.type,
      startedAt: interview.startedAt,
      endedAt: interview.endedAt,
      memo: interview.memo || '',
      jobSearchId: jobSearchCompany.jobSearch?.id || ''
    });
    setIsEditModalOpen(true);
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
              면접 관리
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#666', 
              margin: '5px 0 0 0' 
            }}>
              회사: {jobSearchCompany.name}
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
            onClick={fetchInterviews}
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

      {/* 테이블 뷰 */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>제목</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>면접 유형</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>시작일</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>종료일</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>메모</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>작업</th>
            </tr>
          </thead>
          <tbody>
            {interviews.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#666', fontSize: '16px' }}>
                  등록된 면접이 없습니다
                </td>
              </tr>
            ) : (
              interviews.map((interview) => (
                <tr key={interview.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold' }}>{interview.title || '-'}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2'
                    }}>
                      {interview.type === 0 ? '온라인' : interview.type === 1 ? '오프라인' : '하이브리드'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {interview.startedAt ? DateUtil.formatTimestamp(interview.startedAt) : '-'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {interview.endedAt ? DateUtil.formatTimestamp(interview.endedAt) : '-'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', maxWidth: '200px' }}>
                    <div 
                      style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap'
                      }}
                      title={interview.memo || ''}
                    >
                      {interview.memo || '-'}
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => openEditModal(interview)}
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 면접 생성 모달 */}
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
            width: '600px',
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
                면접 추가
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
                {/* 기본 정보 */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    제목 *
                  </label>
                  <input
                    type="text"
                    value={createForm.title || ''}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="면접 제목을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    면접 유형 *
                  </label>
                  <select
                    value={createForm.type}
                    onChange={(e) => handleFormChange('type', parseInt(e.target.value))}
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
                    <option value={0}>온라인</option>
                    <option value={1}>오프라인</option>
                    <option value={2}>하이브리드</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      시작일
                    </label>
                    <input
                      type="date"
                      value={createForm.startedAt ? timestampToDateString(createForm.startedAt) : ''}
                      onChange={(e) => handleFormChange('startedAt', e.target.value ? dateToTimestamp(e.target.value) : undefined)}
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
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    메모
                  </label>
                  <textarea
                    value={createForm.memo || ''}
                    onChange={(e) => handleFormChange('memo', e.target.value)}
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
                    placeholder="면접에 대한 메모를 입력하세요"
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

      {/* 면접 수정 모달 */}
      {isEditModalOpen && editingInterview && (
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
                면접 수정
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingInterview(null);
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

            <form onSubmit={(e) => { e.preventDefault(); updateInterview(); }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    제목 *
                  </label>
                  <input
                    type="text"
                    value={createForm.title || ''}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="면접 제목을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    면접 유형 *
                  </label>
                  <select
                    value={createForm.type}
                    onChange={(e) => handleFormChange('type', parseInt(e.target.value))}
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
                    <option value={0}>온라인</option>
                    <option value={1}>오프라인</option>
                    <option value={2}>하이브리드</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                      시작일
                    </label>
                    <input
                      type="date"
                      value={createForm.startedAt ? timestampToDateString(createForm.startedAt) : ''}
                      onChange={(e) => handleFormChange('startedAt', e.target.value ? dateToTimestamp(e.target.value) : undefined)}
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
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    메모
                  </label>
                  <textarea
                    value={createForm.memo || ''}
                    onChange={(e) => handleFormChange('memo', e.target.value)}
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
                    placeholder="면접에 대한 메모를 입력하세요"
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
                    setEditingInterview(null);
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

export default InterviewManagementDetail;
