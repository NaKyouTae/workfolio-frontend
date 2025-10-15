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
import styles from './InterviewPage.module.css';

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
  const [expandedInterviews, setExpandedInterviews] = useState<Set<string>>(new Set());

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

  // 면접 확장/축소 토글
  const toggleInterviewExpansion = (interviewId: string) => {
    setExpandedInterviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(interviewId)) {
        newSet.delete(interviewId);
      } else {
        newSet.add(interviewId);
      }
      return newSet;
    });
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
        <h2 className={styles.title}>면접 관리 - {jobSearchCompany.name}</h2>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={`${styles.button} ${styles.addButton}`}
          >
            면접 추가
          </button>
        </div>
      </div>

      {/* 면접 목록 */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.expandHeaderCell}></th>
              <th className={styles.tableHeaderCell}>제목</th>
              <th className={styles.tableHeaderCell}>유형</th>
              <th className={styles.tableHeaderCell}>시작일</th>
              <th className={styles.tableHeaderCell}>종료일</th>
              <th className={styles.tableHeaderCell}>작업</th>
            </tr>
          </thead>
          <tbody>
            {interviews.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyCell}>
                  등록된 면접이 없습니다
                </td>
              </tr>
            ) : (
              interviews.map((interview) => {
                const isExpanded = expandedInterviews.has(interview.id || '');
                return (
                  <React.Fragment key={interview.id}>
                    <tr className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        <button
                          onClick={() => toggleInterviewExpansion(interview.id || '')}
                          className={styles.expandButton}
                          title={isExpanded ? '메모 숨기기' : '메모 보기'}
                        >
                          {isExpanded ? '▼' : '▶'}
                        </button>
                      </td>
                      <td className={styles.titleCell}>{interview.title}</td>
                      <td className={styles.typeCell}>
                        <span className={styles.typeBadge}>
                          {getTypeText(interview.type)}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        {interview.startedAt ? DateUtil.formatTimestamp(interview.startedAt) : '-'}
                      </td>
                      <td className={styles.tableCell}>
                        {interview.endedAt ? DateUtil.formatTimestamp(interview.endedAt) : '-'}
                      </td>
                      <td className={styles.actionCell}>
                        <div className={styles.actionButtonGroup}>
                          <button
                            onClick={() => openEditModal(interview)}
                            className={`${styles.actionButton} ${styles.editButton}`}
                          >
                            수정
                          </button>
                          <button
                            onClick={() => deleteInterview(interview.id || '')}
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className={styles.expandedRow}>
                        <td colSpan={6} className={styles.expandedCell}>
                          <div className={styles.expandedContent}>
                            <div className={styles.memoSection}>
                              <h4 className={styles.memoTitle}>메모</h4>
                              <div className={styles.memoContent}>
                                {interview.memo || '메모가 없습니다.'}
                              </div>
                            </div>
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