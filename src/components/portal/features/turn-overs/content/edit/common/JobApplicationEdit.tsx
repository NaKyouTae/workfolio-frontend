import React from 'react';
import { TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest } from '@/generated/turn_over';
import Input from '@/components/portal/ui/Input';
import DatePicker from '@/components/portal/ui/DatePicker';
import DraggableList from '@/components/portal/ui/DraggableList';
import DraggableItem from '@/components/portal/ui/DraggableItem';
import EmptyState from '@/components/portal/ui/EmptyState';
import ApplicationStageEdit from './ApplicationStageEdit';
import { DateTime } from 'luxon';
import '@/styles/component-edit.css';
import { JobApplication_JobApplicationStatus } from '@/generated/common';
import Image from 'next/image';

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
    <DraggableItem id={app.id || `jobApplication-${index}`}>
        <div className="card-wrap">
            <div className="card">
                <ul className="edit-cont">
                    <li>
                        <p>회사명</p>
                        <Input
                            type="text"
                            label="회사명"
                            placeholder="회사명을 입력해 주세요."
                            value={app.name || ''}
                            onChange={(e) => onUpdate(index, 'name', e.target.value)}
                        />
                    </li>
                    <li>
                        <p>직무</p>
                        <Input
                            type="text"
                            label="직무"
                            placeholder="직무를 입력해 주세요."
                            value={app.position || ''}
                            onChange={(e) => onUpdate(index, 'position', e.target.value)}
                        />
                    </li>
                    <li>
                        <p>공고명</p>
                        <Input
                            type="text"
                            label="공고명"
                            placeholder="공고명을 입력해 주세요."
                            value={app.jobPostingTitle || ''}
                            onChange={(e) => onUpdate(index, 'jobPostingTitle', e.target.value)}
                        />
                    </li>
                    <li>
                        <p>공고문</p>
                        <Input
                            type="text"
                            label="공고문"
                            placeholder="공고문 URL을 입력해 주세요."
                            value={app.jobPostingUrl || ''}
                            onChange={(e) => onUpdate(index, 'jobPostingUrl', e.target.value)}
                        />
                    </li>
                    <li>
                        <p>모집 기간</p>
                        <div>
                            <DatePicker
                                value={app.startedAt}
                                onChange={(date) => onUpdate(index, 'startedAt', DateTime.fromISO(date).toMillis())}
                                required={false}
                            />
                            <span>-</span>
                            <DatePicker
                                value={app.endedAt}
                                onChange={(date) => onUpdate(index, 'endedAt', DateTime.fromISO(date).toMillis())}
                                required={false}
                            />
                        </div>
                    </li>
                    <li>
                        <p>지원 경로</p>
                        <Input
                            type="text"
                            label="지원 경로"
                            placeholder="예: 원티드, 링크드인, 잡코리아 등"
                            value={app.applicationSource || ''}
                            onChange={(e) => onUpdate(index, 'applicationSource', e.target.value)}
                        />
                    </li>
                    <li className="full">
                        <p>최종 진행 상태</p>
                        <ul className="status-list">
                            <li>
                                <input
                                    id={`status-${index}-pending`}
                                    type="radio"
                                    name={`status-${index}`}
                                    value="pending"
                                    checked={app.status === JobApplication_JobApplicationStatus.PENDING}
                                    onChange={() => onUpdate(index, 'status', JobApplication_JobApplicationStatus.PENDING)}
                                />
                                <label htmlFor={`status-${index}-pending`}><p>대기</p></label>
                            </li>
                            <li>
                                <input
                                    id={`status-${index}-running`}
                                    type="radio"
                                    name={`status-${index}`}
                                    value="running"
                                    checked={app.status === JobApplication_JobApplicationStatus.RUNNING}
                                    onChange={() => onUpdate(index, 'status', JobApplication_JobApplicationStatus.RUNNING)}
                                />
                                <label htmlFor={`status-${index}-running`}><p>진행 중</p></label>
                            </li>
                            <li>
                                <input
                                    id={`status-${index}-passed`}
                                    type="radio"
                                    name={`status-${index}`}
                                    value="passed"
                                    checked={app.status === JobApplication_JobApplicationStatus.PASSED}
                                    onChange={() => onUpdate(index, 'status', JobApplication_JobApplicationStatus.PASSED)}
                                />
                                <label htmlFor={`status-${index}-passed`}><p>합격</p></label>
                            </li>
                            <li>
                                <input
                                    id={`status-${index}-failed`}
                                    type="radio"
                                    name={`status-${index}`}
                                    value="failed"
                                    checked={app.status === JobApplication_JobApplicationStatus.FAILED}
                                    onChange={() => onUpdate(index, 'status', JobApplication_JobApplicationStatus.FAILED)}
                                />
                                <label htmlFor={`status-${index}-failed`}><p>불합격</p></label>
                            </li>
                        </ul>
                    </li>
                    <li className="full">
                        <p>메모</p>
                        <textarea
                            placeholder="예: 지원 사유, 회사 장단점 등"
                            value={app.memo || ''}
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
            {/* 채용 절차 - 각 지원 기록 내부에 포함 */}
            <ApplicationStageEdit
                applicationStages={app.applicationStages || []}
                onUpdate={(stages) => onUpdateApplicationStages(index, stages)}
                jobApplicationId={app.id || `jobApp-${index}`}
            />
        </div>
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
      status: JobApplication_JobApplicationStatus.PENDING,
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
    const updated = jobApplications.map((app, i) => {
      if (i !== index) return app;
      
      return {
        ...app,
        [field]: value,
      };
    });

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
    <>
        <div className="cont-tit">
            <div>
                <h3>지원 기록</h3>
                {/* <p>{jobApplications.length}개</p> */}
            </div>
            <button onClick={addJobApplication}><i className="ic-add" />추가</button>
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
    </>
  );
};

export default JobApplicationEdit;
