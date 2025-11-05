import React from 'react';
import { ApplicationStage_ApplicationStageStatus } from '@/generated/common';
import { TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest } from '@/generated/turn_over';
import { DateUtil } from '@/utils/DateUtil';
import Input from '@/components/ui/Input';
import DraggableList from '@/components/ui/DraggableList';
import DraggableItem from '@/components/ui/DraggableItem';
import EmptyState from '@/components/ui/EmptyState';
import '@/styles/component-edit.css';

interface ApplicationStageEditProps {
  applicationStages: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest[];
  onUpdate: (stages: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest[]) => void;
}

interface ApplicationStageItemProps {
  stage: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest;
  index: number;
  onUpdate: (
    index: number,
    field: keyof TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest,
    value: string | number | undefined
  ) => void;
  onRemove: (index: number) => void;
}

const ApplicationStageItem: React.FC<ApplicationStageItemProps> = ({
  stage,
  index,
  onUpdate,
  onRemove,
}) => {
  return (
    <DraggableItem
      id={stage.id || `applicationStage-${index}`}
      className="edit-card-wrapper"
    >
      <div className="edit-card">
        <div className="edit-grid-container-1">
          <div className="edit-grid-container-2">
            <div className="edit-form-field">
              <Input
                type="text"
                label="절차명"
                placeholder="예: 서류 전형, 1차 면접 등"
                value={stage.name || ''}
                onChange={(e) => onUpdate(index, 'name', e.target.value)}
              />
            </div>
            <div className="edit-form-field">
              <Input
                type="text"
                label="진행 일자"
                placeholder="YYYY. MM. DD."
                value={stage.startedAt ? DateUtil.formatTimestamp(stage.startedAt) : ''}
                onChange={(e) => onUpdate(index, 'startedAt', DateUtil.normalizeTimestamp(e.target.value))}
              />
            </div>
          </div>

          <div className="edit-form-field">
            <label className="edit-label">진행 상태</label>
            <div className="edit-radio-group">
              <label className="edit-radio-label">
                <input
                  type="radio"
                  name={`status-${index}`}
                  value="pending"
                  checked={stage.status === ApplicationStage_ApplicationStageStatus.PENDING}
                  onChange={() => onUpdate(index, 'status', ApplicationStage_ApplicationStageStatus.PENDING)}
                />
                대기
              </label>
              <label className="edit-radio-label">
                <input
                  type="radio"
                  name={`status-${index}`}
                  value="passed"
                  checked={stage.status === ApplicationStage_ApplicationStageStatus.PASSED}
                  onChange={() => onUpdate(index, 'status', ApplicationStage_ApplicationStageStatus.PASSED)}
                />
                합격
              </label>
              <label className="edit-radio-label">
                <input
                  type="radio"
                  name={`status-${index}`}
                  value="failed"
                  checked={stage.status === ApplicationStage_ApplicationStageStatus.FAILED}
                  onChange={() => onUpdate(index, 'status', ApplicationStage_ApplicationStageStatus.FAILED)}
                />
                불합격
              </label>
            </div>
          </div>

          <div className="edit-form-field">
            <label className="edit-label">메모</label>
            <textarea
              className="edit-textarea"
              placeholder="예: 채용 서류, 과제 내용, 면접 유형, 면접 질문 등"
              value={stage.memo || ''}
              onChange={(e) => onUpdate(index, 'memo', e.target.value)}
              rows={3}
            />
          </div>
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
 * 채용 절차 편집 컴포넌트 (subsection)
 */
const ApplicationStageEdit: React.FC<ApplicationStageEditProps> = ({
  applicationStages,
  onUpdate,
}) => {
  const addApplicationStage = () => {
    onUpdate([
      ...applicationStages,
      {
        name: '',
        startedAt: undefined,
        status: ApplicationStage_ApplicationStageStatus.PENDING,
        memo: '',
      } as TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest,
    ]);
  };

  const removeApplicationStage = (index: number) => {
    onUpdate(applicationStages.filter((_, i) => i !== index));
  };

  const updateStage = (
    index: number,
    field: keyof TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest,
    value: string | number | undefined
  ) => {
    const updated = [...applicationStages];
    const stage = updated[index];
    if (field === 'name' && typeof value === 'string') {
      stage.name = value;
    } else if (field === 'startedAt' && typeof value === 'number') {
      stage.startedAt = value;
    } else if (field === 'status' && typeof value === 'number') {
      stage.status = value;
    } else if (field === 'memo' && typeof value === 'string') {
      stage.memo = value;
    }
    onUpdate(updated);
  };

  const handleReorder = (reordered: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest[]) => {
    onUpdate(reordered);
  };

  return (
    <div style={{ 
      marginTop: '20px', 
      padding: '16px', 
      backgroundColor: '#f9fafb', 
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    }}>
      <div className="edit-section-header">
        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#333', margin: 0, width: '60%' }}>
          채용 절차 | {applicationStages.length}개
        </h4>
        <div className="edit-add-button-container">
          <button
            onClick={addApplicationStage}
            className="edit-add-button"
          >
            <span>+ 절차 추가</span>
          </button>
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        {applicationStages.length === 0 ? (
          <EmptyState text="채용 절차를 추가해 주세요." />
        ) : (
          <DraggableList
            items={applicationStages}
            onReorder={handleReorder}
            getItemId={(stage, idx) => stage.id || `applicationStage-${idx}`}
            renderItem={(stage, index) => (
              <ApplicationStageItem
                key={stage.id || `applicationStage-${index}`}
                stage={stage}
                index={index}
                onUpdate={updateStage}
                onRemove={removeApplicationStage}
              />
            )}
          />
        )}
      </div>
    </div>
  );
};

export default ApplicationStageEdit;
