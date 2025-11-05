import React from 'react';
import { TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest } from '@/generated/turn_over';
import { DateUtil } from '@/utils/DateUtil';
import Input from '@/components/ui/Input';
import DraggableList from '@/components/ui/DraggableList';
import DraggableItem from '@/components/ui/DraggableItem';
import EmptyState from '@/components/ui/EmptyState';
import ApplicationStageEdit from './ApplicationStageEdit';
import '@/styles/component-edit.css';

interface JobApplicationEditProps {
  jobApplications: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest[];
  onUpdate: (jobApplications: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest[]) => void;
}

interface JobApplicationItemProps {
  app: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest;
  index: number;
  onUpdate: (
    index: number,
    field: keyof TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest,
    value: string | number | undefined
  ) => void;
  onUpdateApplicationStages: (
    jobAppIndex: number,
    stages: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest['applicationStages']
  ) => void;
  onRemove: (index: number) => void;
}

const JobApplicationItem: React.FC<JobApplicationItemProps> = ({
  app,
  index,
  onUpdate,
  onUpdateApplicationStages,
  onRemove,
}) => {
  return (
    <DraggableItem
      id={app.id || `jobApplication-${index}`}
      className="edit-card-wrapper"
    >
      <div className="edit-card">
        <div className="edit-grid-container-1">
          <div className="edit-grid-container-2">
            <div className="edit-form-field">
              <Input
                type="text"
                label="회사명"
                placeholder="회사명을 입력해 주세요."
                value={app.name || ''}
                onChange={(e) => onUpdate(index, 'name', e.target.value)}
              />
            </div>
            <div className="edit-form-field">
              <Input
                type="text"
                label="직무"
                placeholder="직무를 입력해 주세요."
                value={app.position || ''}
                onChange={(e) => onUpdate(index, 'position', e.target.value)}
              />
            </div>
          </div>

          <div className="edit-grid-container-2">
            <div className="edit-form-field">
              <Input
                type="text"
                label="공고명"
                placeholder="공고명을 입력해 주세요."
                value={app.jobPostingTitle || ''}
                onChange={(e) => onUpdate(index, 'jobPostingTitle', e.target.value)}
              />
            </div>
            <div className="edit-form-field">
              <Input
                type="text"
                label="공고 URL"
                placeholder="공고 URL을 입력해 주세요."
                value={app.jobPostingUrl || ''}
                onChange={(e) => onUpdate(index, 'jobPostingUrl', e.target.value)}
              />
            </div>
          </div>

          <div className="edit-grid-container-2">
            <div className="edit-form-field">
              <label className="edit-label">모집 기간</label>
              <div className="edit-date-range">
                <input
                  type="text"
                  className="edit-input"
                  placeholder="YYYY. MM. DD."
                  value={app.startedAt ? DateUtil.formatTimestamp(app.startedAt) : ''}
                  onChange={(e) => onUpdate(index, 'startedAt', DateUtil.normalizeTimestamp(e.target.value))}
                />
                <span className="edit-date-separator">-</span>
                <input
                  type="text"
                  className="edit-input"
                  placeholder="YYYY. MM. DD."
                  value={app.endedAt ? DateUtil.formatTimestamp(app.endedAt) : ''}
                  onChange={(e) => onUpdate(index, 'endedAt', DateUtil.normalizeTimestamp(e.target.value))}
                />
              </div>
            </div>
            <div className="edit-form-field">
              <Input
                type="text"
                label="지원 경로"
                placeholder="예: 원티드, 링크드인, 잡코리아 등"
                value={app.applicationSource || ''}
                onChange={(e) => onUpdate(index, 'applicationSource', e.target.value)}
              />
            </div>
          </div>

          <div className="edit-form-field">
            <label className="edit-label">메모</label>
            <textarea
              className="edit-textarea"
              placeholder="예: 지원 사유, 회사 장단점 등"
              value={app.memo || ''}
              onChange={(e) => onUpdate(index, 'memo', e.target.value)}
              rows={3}
            />
          </div>

          {/* 채용 절차 - 각 지원 기록 내부에 포함 */}
          <ApplicationStageEdit
            applicationStages={app.applicationStages || []}
            onUpdate={(stages) => onUpdateApplicationStages(index, stages)}
          />
        </div>
      </div>

      <button
        onClick={() => onRemove(index)}
        style={{
          width: '60px',
          padding: '8px 4px',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          color: '#999',
          height: 'fit-content',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ffebee';
          e.currentTarget.style.borderColor = '#f44336';
          e.currentTarget.style.color = '#f44336';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#fff';
          e.currentTarget.style.borderColor = '#ddd';
          e.currentTarget.style.color = '#999';
        }}
      >
        삭제
      </button>
    </DraggableItem>
  );
};

/**
 * 지원 기록 편집 컴포넌트
 */
const JobApplicationEdit: React.FC<JobApplicationEditProps> = ({
  jobApplications,
  onUpdate,
}) => {
  const addJobApplication = () => {
    const newItem: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest = {
      name: '',
      position: '',
      jobPostingTitle: '',
      jobPostingUrl: '',
      startedAt: undefined,
      endedAt: undefined,
      applicationSource: '',
      memo: '',
      applicationStages: [],
      isVisible: true,
      priority: jobApplications.length,
    };
    onUpdate([...jobApplications, newItem]);
  };

  const removeJobApplication = (index: number) => {
    const updated = jobApplications.filter((_, i) => i !== index);
    // 재정렬 후 priority 업데이트
    const reordered = updated.map((item, idx) => ({
      ...item,
      priority: idx,
    }));
    onUpdate(reordered);
  };

  const updateJobApplication = (
    index: number,
    field: keyof TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest,
    value: string | number | undefined
  ) => {
    const updated = [...jobApplications];
    const app = updated[index];

    if (field === 'name' && typeof value === 'string') {
      app.name = value;
    } else if (field === 'position' && typeof value === 'string') {
      app.position = value;
    } else if (field === 'jobPostingTitle' && typeof value === 'string') {
      app.jobPostingTitle = value;
    } else if (field === 'jobPostingUrl' && typeof value === 'string') {
      app.jobPostingUrl = value;
    } else if (field === 'startedAt' && typeof value === 'number') {
      app.startedAt = value;
    } else if (field === 'endedAt' && typeof value === 'number') {
      app.endedAt = value;
    } else if (field === 'applicationSource' && typeof value === 'string') {
      app.applicationSource = value;
    } else if (field === 'memo' && typeof value === 'string') {
      app.memo = value;
    }

    onUpdate(updated);
  };

  const updateApplicationStages = (
    jobAppIndex: number,
    stages: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest['applicationStages']
  ) => {
    const updated = [...jobApplications];
    updated[jobAppIndex].applicationStages = stages;
    onUpdate(updated);
  };

  const handleReorder = (reordered: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest[]) => {
    // 드래그앤드롭 후 priority를 index로 업데이트
    const updatedWithPriority = reordered.map((item, idx) => ({
      ...item,
      priority: idx,
    }));
    onUpdate(updatedWithPriority);
  };

  return (
    <div className="edit-section">
      <div className="edit-section-header">
        <h3 className="edit-section-title-counter">
          지원 기록 | {jobApplications.length}개
        </h3>
        <div className="edit-add-button-container">
          <button
            onClick={addJobApplication}
            className="edit-add-button"
          >
            <span>+ 추가</span>
          </button>
        </div>
      </div>

      {jobApplications.length === 0 ? (
        <EmptyState text="지원 기록을 추가해 주세요." />
      ) : (
        <DraggableList
          items={jobApplications}
          onReorder={handleReorder}
          getItemId={(app, idx) => app.id || `jobApplication-${idx}`}
          renderItem={(app, index) => (
            <JobApplicationItem
              key={app.id || `jobApplication-${index}`}
              app={app}
              index={index}
              onUpdate={updateJobApplication}
              onUpdateApplicationStages={updateApplicationStages}
              onRemove={removeJobApplication}
            />
          )}
        />
      )}
    </div>
  );
};

export default JobApplicationEdit;
