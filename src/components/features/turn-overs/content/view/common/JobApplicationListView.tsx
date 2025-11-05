import React, { useState } from 'react';
import { JobApplicationDetail, ApplicationStage_ApplicationStageStatus } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import DateUtil from '@/utils/DateUtil';
import MemoDetailModal from '@/components/ui/MemoDetailModal';
import { useMemoDetail } from '@/hooks/useMemoDetail';
import '@/styles/component-view.css';

interface JobApplicationListViewProps {
  jobApplications: JobApplicationDetail[];
}

const JobApplicationListView: React.FC<JobApplicationListViewProps> = ({ jobApplications }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const { isOpen: isMemoOpen, memo: selectedMemo, openMemoDetail, closeMemoDetail } = useMemoDetail();

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getStatusLabel = (status: ApplicationStage_ApplicationStageStatus) => {
    switch (status) {
      case ApplicationStage_ApplicationStageStatus.PASSED:
        return '합격';
      case ApplicationStage_ApplicationStageStatus.FAILED:
        return '불합격';
      case ApplicationStage_ApplicationStageStatus.PENDING:
        return '대기';
      case ApplicationStage_ApplicationStageStatus.SCHEDULED:
        return '예정';
      case ApplicationStage_ApplicationStageStatus.CANCELLED:
        return '취소';
      default:
        return '-';
    }
  };

  const getStatusBadgeStyle = (status: ApplicationStage_ApplicationStageStatus) => {
    const baseStyle = {
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 600,
      display: 'inline-block',
    };
    
    switch (status) {
      case ApplicationStage_ApplicationStageStatus.PASSED:
        return { ...baseStyle, background: '#d1fae5', color: '#065f46' };
      case ApplicationStage_ApplicationStageStatus.FAILED:
        return { ...baseStyle, background: '#fee2e2', color: '#991b1b' };
      case ApplicationStage_ApplicationStageStatus.PENDING:
        return { ...baseStyle, background: '#fef3c7', color: '#92400e' };
      default:
        return { ...baseStyle, background: '#f3f4f6', color: '#6b7280' };
    }
  };

  if (!jobApplications || jobApplications.length === 0) {
    return (
      <div className="view-container">
        <h3 className="view-title">지원 기록</h3>
        <EmptyState text="등록된 지원 기록이 없습니다." />
      </div>
    );
  }

  return (
    <div className="view-container">
      <h3 className="view-title">지원 기록</h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          fontSize: '14px',
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>회사명</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>직무</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>채용 절차</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>공고문</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>모집 기간</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>지원 경로</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>메모</th>
            </tr>
          </thead>
          <tbody>
            {jobApplications.map((app, index) => {
              const isExpanded = expandedRows.has(app.id || `app-${index}`);
              const hasStages = app.applicationStages && app.applicationStages.length > 0;

              return (
                <React.Fragment key={app.id || `app-${index}`}>
                  <tr style={{ 
                    borderBottom: '1px solid #e5e7eb',
                    transition: 'background-color 0.2s'
                  }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#1a1a1a' }}>
                      {app.name}
                    </td>
                    <td style={{ padding: '12px', color: '#1a1a1a' }}>
                      {app.position}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {hasStages ? (
                        <button
                          onClick={() => toggleRow(app.id || `app-${index}`)}
                          style={{
                            padding: '4px 12px',
                            background: 'transparent',
                            border: '1px solid #e5e7eb',
                            borderRadius: '4px',
                            fontSize: '13px',
                            color: '#6b7280',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          상세보기 {isExpanded ? '▲' : '▼'}
                        </button>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '13px' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '12px', color: '#1a1a1a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {app.jobPostingTitle || '-'}
                        </span>
                        {app.jobPostingUrl && (
                          <a 
                            href={app.jobPostingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '16px',
                              textDecoration: 'none',
                              flexShrink: 0
                            }}
                          >
                            🔗
                          </a>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#1a1a1a', whiteSpace: 'nowrap' }}>
                      {app.startedAt && DateUtil.formatTimestamp(app.startedAt, 'YY.MM.DD.')}
                      {app.startedAt && app.endedAt && ' - '}
                      {app.endedAt && DateUtil.formatTimestamp(app.endedAt, 'YY.MM.DD.')}
                      {!app.startedAt && !app.endedAt && '-'}
                    </td>
                    <td style={{ padding: '12px', color: '#1a1a1a' }}>
                      {app.applicationSource || '-'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {app.memo ? (
                        <button
                          onClick={() => openMemoDetail(app.memo)}
                          style={{
                            padding: '4px 12px',
                            background: 'transparent',
                            border: '1px solid #e5e7eb',
                            borderRadius: '4px',
                            fontSize: '13px',
                            color: '#6b7280',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          상세보기
                        </button>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '13px' }}>-</span>
                      )}
                    </td>
                  </tr>
                  
                  {/* 확장된 채용 절차 행 */}
                  {isExpanded && hasStages && (
                    <tr>
                      <td colSpan={7} style={{ 
                        padding: '20px 12px', 
                        backgroundColor: '#f9fafb',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          overflowX: 'auto',
                          padding: '8px 0'
                        }}>
                          {app.applicationStages!.map((stage, stageIndex) => (
                            <React.Fragment key={stage.id || `stage-${stageIndex}`}>
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                minWidth: '120px',
                                gap: '8px'
                              }}>
                                <div style={{ 
                                  fontSize: '14px', 
                                  fontWeight: 600, 
                                  color: '#1a1a1a',
                                  textAlign: 'center',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {stage.name}
                                </div>
                                <div style={getStatusBadgeStyle(stage.status)}>
                                  {getStatusLabel(stage.status)}
                                </div>
                                {stage.startedAt && (
                                  <div style={{ 
                                    fontSize: '12px', 
                                    color: '#6b7280',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {DateUtil.formatTimestamp(stage.startedAt, 'YY.MM.DD.')}
                                  </div>
                                )}
                                {stage.memo && (
                                  <button
                                    onClick={() => openMemoDetail(stage.memo)}
                                    style={{
                                      padding: '2px 8px',
                                      background: 'transparent',
                                      border: '1px solid #e5e7eb',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      color: '#6b7280',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                      marginTop: '4px'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = '#f9fafb';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                  >
                                    메모
                                  </button>
                                )}
                              </div>
                              {stageIndex < app.applicationStages!.length - 1 && (
                                <div style={{ 
                                  fontSize: '18px', 
                                  color: '#d1d5db',
                                  flexShrink: 0
                                }}>
                                  →
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 메모 상세보기 모달 */}
      <MemoDetailModal
        isOpen={isMemoOpen}
        onClose={closeMemoDetail}
        memo={selectedMemo}
      />
    </div>
  );
};

export default JobApplicationListView;
