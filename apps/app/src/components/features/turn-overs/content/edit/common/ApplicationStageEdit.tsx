import React from 'react';
import { ApplicationStage_ApplicationStageStatus } from '@workfolio/shared/generated/common';
import { TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest } from '@workfolio/shared/generated/turn_over';
import Input from '@workfolio/shared/ui/Input';
import DatePicker from '@workfolio/shared/ui/DatePicker';
import DraggableList from '@workfolio/shared/ui/DraggableList';
import DraggableItem from '@workfolio/shared/ui/DraggableItem';
import EmptyState from '@workfolio/shared/ui/EmptyState';
import { DateTime } from 'luxon';
import '@workfolio/shared/styles/component-edit.css';
import Image from 'next/image';
import DateUtil from '@workfolio/shared/utils/DateUtil';
import { compareEnumValue } from '@workfolio/shared/utils/commonUtils';

interface ApplicationStageEditProps {
  applicationStages: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest[];
  onUpdate: (stages: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest[]) => void;
  jobApplicationId?: string; // 고유 식별자 추가
}

interface ApplicationStageItemProps {
  stage: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest;
  index: number;
  jobApplicationId?: string; // 고유 식별자 추가
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
  jobApplicationId,
  onUpdate,
  onRemove,
}) => {
  const uniqueRadioName = `stage-status-${jobApplicationId || 'default'}-${index}`;
  
  return (
    <DraggableItem id={stage.id || `applicationStage-${index}`}>
        <div className="card">
            <ul className="edit-cont">
                <li>
                    <p>절차명</p>
                    <Input
                        type="text"
                        label="절차명"
                        placeholder="에: 서류 전형, 1차 면접 등"
                        value={stage.name || ''}
                        onChange={(e) => onUpdate(index, 'name', e.target.value)}
                    />
                </li>
                <li>
                    <p>진행 일자</p>
                    <DatePicker
                        value={DateUtil.formatTimestamp(stage.startedAt || 0)}
                        onChange={(date) => onUpdate(index, 'startedAt', DateTime.fromISO(date).toMillis())}
                        required={false}
                    />
                </li>
                <li className="full">
                    <p>진행 상태</p>
                    <ul className="input-list">
                        <li>
                            <input
                                id={`${uniqueRadioName}-pending`}
                                type="radio"
                                name={uniqueRadioName}
                                value="pending"
                                checked={compareEnumValue(stage.status, ApplicationStage_ApplicationStageStatus.PENDING, ApplicationStage_ApplicationStageStatus)}
                                onChange={() => onUpdate(index, 'status', ApplicationStage_ApplicationStageStatus.PENDING)}
                            />
                            <label htmlFor={`${uniqueRadioName}-pending`}><p>대기</p></label>
                        </li>
                        <li>
                            <input
                                id={`${uniqueRadioName}-scheduled`}
                                type="radio"
                                name={uniqueRadioName}
                                value="scheduled"
                                checked={compareEnumValue(stage.status, ApplicationStage_ApplicationStageStatus.SCHEDULED, ApplicationStage_ApplicationStageStatus)}
                                onChange={() => onUpdate(index, 'status', ApplicationStage_ApplicationStageStatus.SCHEDULED)}
                            />
                            <label htmlFor={`${uniqueRadioName}-scheduled`}><p>예정</p></label>
                        </li>
                        <li>
                            <input
                                id={`${uniqueRadioName}-passed`}
                                type="radio"
                                name={uniqueRadioName}
                                value="passed"
                                checked={compareEnumValue(stage.status, ApplicationStage_ApplicationStageStatus.PASSED, ApplicationStage_ApplicationStageStatus)}
                                onChange={() => onUpdate(index, 'status', ApplicationStage_ApplicationStageStatus.PASSED)}
                            />
                            <label htmlFor={`${uniqueRadioName}-passed`}><p>합격</p></label>
                        </li>
                        <li>
                            <input
                                id={`${uniqueRadioName}-failed`}
                                type="radio"
                                name={uniqueRadioName}
                                value="failed"
                                checked={compareEnumValue(stage.status, ApplicationStage_ApplicationStageStatus.FAILED, ApplicationStage_ApplicationStageStatus)}
                                onChange={() => onUpdate(index, 'status', ApplicationStage_ApplicationStageStatus.FAILED)}
                            />
                            <label htmlFor={`${uniqueRadioName}-failed`}><p>불합격</p></label>
                        </li>
                    </ul>
                </li>
                <li className="full">
                    <p>메모</p>
                    <textarea
                        placeholder="예) 제출 서류, 과제 내용, 면접 유형, 면접 질문 등"
                        value={stage.memo || ''}
                        onChange={(e) => onUpdate(index, 'memo', e.target.value)}
                    />
                </li>
            </ul>
            <div className="edit-btn">
                <button
                    onClick={() => onRemove(index)}
                    title="삭제"
                    type="button"
                    className="gray"
                >
                    <Image
                        src="/assets/img/ico/ic-minus.svg"
                        alt="삭제"
                        width={1}
                        height={1}
                    />
                </button>
            </div>
        </div>
    </DraggableItem>
  );
};

/**
 * 채용 절차 편집 컴포넌트 (subsection)
 */
const ApplicationStageEdit: React.FC<ApplicationStageEditProps> = ({
  applicationStages,
  onUpdate,
  jobApplicationId,
}) => {
  const addApplicationStage = () => {
    const newItem: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest = {
      name: '',
      startedAt: undefined,
      status: ApplicationStage_ApplicationStageStatus.PENDING,
      memo: '',
      isVisible: true,
      priority: applicationStages.length,
    };
    onUpdate([...applicationStages, newItem]);
  };

  const removeApplicationStage = (index: number) => {
    const updated = applicationStages.filter((_, i) => i !== index);
    // 재정렬 후 priority 업데이트
    const reordered = updated.map((item, idx) => ({
      ...item,
      priority: idx,
    }));
    onUpdate(reordered);
  };

  const updateStage = (
    index: number,
    field: keyof TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest,
    value: string | number | undefined
  ) => {
    const updated = applicationStages.map((stage, i) => {
      if (i !== index) return stage;
      
      return {
        ...stage,
        [field]: value,
      };
    });

    onUpdate(updated);
  };

  const handleReorder = (reordered: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest[]) => {
    // 드래그앤드롭 후 priority를 index로 업데이트
    const updatedWithPriority = reordered.map((item, idx) => ({
      ...item,
      priority: idx,
    }));
    onUpdate(updatedWithPriority);
  };

  return (
    <div className="card-sub">
        <div className="cont-sub-tit">
            <div>
                <h4>채용 절차</h4>
                {/* <p>{applicationStages.length}개</p> */}
            </div>
            <button onClick={addApplicationStage}>
                <i className="ic-add" />추가
            </button>
        </div>
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
                      jobApplicationId={jobApplicationId}
                      onUpdate={updateStage}
                      onRemove={removeApplicationStage}
                    />
                )}
            />
        )}
    </div>
  );
};

export default ApplicationStageEdit;
