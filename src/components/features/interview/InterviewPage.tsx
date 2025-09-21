import React, { useState, useEffect, useCallback } from 'react';
import { Interview, Interview_Type } from '@/generated/common';
import { InterviewListResponse } from '@/generated/interview';
import { JobSearchCompany } from '@/generated/common';
import HttpMethod from '@/enums/HttpMethod';
import DateUtil from '@/utils/DateUtil';
import { useUser } from '@/hooks/useUser';
import { createSampleInterviews } from '@/utils/sampleData';
import InterviewCreateModal from './InterviewCreateModal';
import InterviewUpdateModal from './InterviewUpdateModal';

interface InterviewPageProps {
  jobSearchCompany: JobSearchCompany;
}

const InterviewPage: React.FC<InterviewPageProps> = ({ jobSearchCompany }) => {
  const { isLoggedIn } = useUser();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | undefined>(undefined);

  // 면접 목록 조회
  const fetchInterviews = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (isLoggedIn) {
        // 로그인된 경우 서버에서 데이터 조회
        const response = await fetch(`/api/interviews?jobSearchCompanyId=${jobSearchCompany.id}`, {
          method: HttpMethod.GET,
        });

        if (response.ok) {
          const data: InterviewListResponse = await response.json();
          setInterviews(data.interviews || []);
        } else {
          console.error('Failed to fetch interviews');
        }
      } else {
        // 로그인하지 않은 경우 샘플 데이터 사용
        console.log('Using sample data for non-logged-in user');
        const sampleData = createSampleInterviews(jobSearchCompany.id, jobSearchCompany.id || '');
        setInterviews(sampleData);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, jobSearchCompany.id]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // 수정 모달 열기
  const openEditModal = (interview: Interview) => {
    setEditingInterview(interview);
    setIsEditModalOpen(true);
  };

  // 면접 삭제
  const deleteInterview = async (interviewId: string) => {
    if (!confirm('정말로 이 면접을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/interviews/${interviewId}`, {
        method: HttpMethod.DELETE,
      });

      if (response.ok) {
        alert('면접이 성공적으로 삭제되었습니다.');
        fetchInterviews();
      } else {
        const errorData = await response.json();
        alert(`면접 삭제에 실패했습니다: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error deleting interview:', error);
      alert('면접 삭제 중 오류가 발생했습니다.');
    }
  };

  // 면접 유형 텍스트 변환
  const getTypeText = (type: Interview_Type) => {
    const typeValue = Interview_Type[type as unknown as keyof typeof Interview_Type];

    switch (typeValue) {
      case Interview_Type.ONLINE: return '온라인';
      case Interview_Type.OFFLINE: return '오프라인';
      case Interview_Type.UNKNOWN: return '알 수 없음';
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
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid #e9ecef'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#333' }}>
          면접 관리 - {jobSearchCompany.name}
        </h2>
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
            면접 추가
          </button>
        </div>
      </div>

      {/* 면접 목록 */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>제목</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>유형</th>
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
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold' }}>{interview.title}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: '#e9ecef',
                      color: '#495057',
                      fontWeight: 'bold'
                    }}>
                      {getTypeText(interview.type)}
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
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
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
                      <button
                        onClick={() => deleteInterview(interview.id || '')}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 면접 생성 모달 */}
      <InterviewCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        jobSearchCompany={jobSearchCompany}
        onSuccess={fetchInterviews}
      />

      {/* 면접 수정 모달 */}
      <InterviewUpdateModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingInterview(undefined);
        }}
        editingInterview={editingInterview || undefined}
        onSuccess={fetchInterviews}
      />
    </div>
  );
};

export default InterviewPage;