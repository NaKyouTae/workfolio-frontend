import React, { useState } from 'react';
import { JobApplicationDetail, JobApplication_JobApplicationStatus } from '@/generated/common';
import EmptyState from '@/components/portal/ui/EmptyState';
import DateUtil from '@/utils/DateUtil';
import ContentModal from '@/components/portal/ui/ContentModal';
import { useModal } from '@/hooks/useModal';
import ApplicationStageView from './ApplicationStageView';
import '@/styles/component-view.css';
import { normalizeEnumValue } from '@/utils/commonUtils';

interface JobApplicationViewProps {
  jobApplications: JobApplicationDetail[];
}

const JobApplicationView: React.FC<JobApplicationViewProps> = ({ jobApplications }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const { isOpen: isMemoOpen, content: selectedMemo, title: memoTitle, openModal, closeModal } = useModal();

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

  const getJobApplicationStatusLabel = (status: JobApplication_JobApplicationStatus) => {
    const normalizedStatus = normalizeEnumValue(status, JobApplication_JobApplicationStatus);
    switch (normalizedStatus) {
      case JobApplication_JobApplicationStatus.PENDING:
        return '대기';
      case JobApplication_JobApplicationStatus.RUNNING:
        return '진행 중';
      case JobApplication_JobApplicationStatus.PASSED:
        return '합격';
      case JobApplication_JobApplicationStatus.FAILED:
        return '불합격';
      case JobApplication_JobApplicationStatus.CANCELLED:
        return '취소';
      case JobApplication_JobApplicationStatus.UNKNOWN:
        return '미확인';
      default:
        return '미확인';
    }
  };

  const getJobApplicationStatusBadgeStyle = (status: JobApplication_JobApplicationStatus) => {
    switch (status) {
        case JobApplication_JobApplicationStatus.PENDING:
            return { background: '#ECFAEE', color: '#34C759' }; //대기
        case JobApplication_JobApplicationStatus.RUNNING:
            return { background: '#FFF5E9', color: '#FF9500' }; //진행 중
        case JobApplication_JobApplicationStatus.PASSED:
            return { background: '#E6F2FF', color: '#007AFF' }; //합격
        case JobApplication_JobApplicationStatus.FAILED:
            return { background: '#FDEAE9', color: '#FF3B30' }; //불합격
        case JobApplication_JobApplicationStatus.CANCELLED:
            return { background: '#ECEDEF', color: '#515C66' }; //취소
        case JobApplication_JobApplicationStatus.UNKNOWN:
            return { background: '#ECEDEF', color: '#515C66' }; //미확인
        default:
            return { background: '#ECEDEF', color: '#515C66' }; //미확인
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
    <>
        <div className="cont-tit">
            <div>
                <h3>지원 기록</h3>
            </div>
        </div>
        <div className="turnover-table">
            <table>
                <colgroup>
                    <col style={{width: '7.2rem'}} />
                    <col style={{width: '14rem'}} />
                    <col style={{width: '14rem'}} />
                    <col style={{width: '8rem'}} />
                    <col style={{width: 'auto'}} />
                    <col style={{width: '12rem'}} />
                    <col style={{width: '8rem'}} />
                    <col style={{width: '7.2rem'}} />
                </colgroup>
                <thead>
                    <tr>
                        <th>진행 상태</th>
                        <th>회사명</th>
                        <th>직무</th>
                        <th>채용 절차</th>
                        <th>공고문</th>
                        <th>모집 기간</th>
                        <th>지원 경로</th>
                        <th>메모</th>
                    </tr>
                </thead>
                <tbody>
                    {jobApplications.map((app, index) => {
                        const isExpanded = expandedRows.has(app.id || `app-${index}`);
                        const hasStages = app.applicationStages && app.applicationStages.length > 0;

                        return (
                        <React.Fragment key={app.id || `app-${index}`}>
                            <tr>
                                <td><span className="label" style={getJobApplicationStatusBadgeStyle(app.status)}>{getJobApplicationStatusLabel(app.status)}</span></td>
                                <td><p>{app.name}</p></td>
                                <td><p>{app.position}</p></td>
                                <td>
                                    {hasStages ? (
                                    <button onClick={() => toggleRow(app.id || `app-${index}`)}>
                                        상세보기 {isExpanded ? <i className="ic-arrow-up-14" /> : <i className="ic-arrow-down-14" />}
                                    </button>
                                    ) : (
                                    <>-</>
                                    )}
                                </td>
                                <td>
                                    <div>
                                        <p>{app.jobPostingTitle || '-'}</p>
                                        {app.jobPostingUrl && (
                                            <a href={app.jobPostingUrl} target="_blank" rel="noopener noreferrer"><i className="ic-link" /></a>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    {app.startedAt && DateUtil.formatTimestamp(app.startedAt, 'YY.MM.DD.')}
                                    {app.startedAt && app.endedAt && ' - '}
                                    {app.endedAt && DateUtil.formatTimestamp(app.endedAt, 'YY.MM.DD.')}
                                    {!app.startedAt && !app.endedAt && '-'}
                                </td>
                                <td><p>{app.applicationSource || '-'}</p></td>
                                <td>
                                    {app.memo ? (
                                    <a onClick={() => openModal(app.memo, '메모 상세보기')}>상세보기</a>
                                    ) : (
                                    <>-</>
                                    )}
                                </td>
                            </tr>
                            
                            {/* 확장된 채용 절차 행 */}
                            {isExpanded && hasStages && (
                            <tr className="stage-wrap">
                                <td colSpan={8}>
                                    <ul>
                                        {app.applicationStages!.map((stage, stageIndex) => (
                                          <ApplicationStageView
                                            key={stage.id || `stage-${stageIndex}`}
                                            stage={stage}
                                          />
                                        ))}
                                    </ul>
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
        <ContentModal
            isOpen={isMemoOpen}
            onClose={closeModal}
            content={selectedMemo}
            title={memoTitle}
        />
    </>
  );
};

export default JobApplicationView;
