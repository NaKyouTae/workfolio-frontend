import React from 'react';
import { TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest } from '@/generated/turn_over';
import { DateUtil } from '@/utils/DateUtil';
import styles from '../TurnOverChallengeEdit.module.css';
import ApplicationStageEdit from './ApplicationStageEdit';

interface JobApplicationEditProps {
  jobApplications: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest[];
  onUpdate: (jobApplications: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest[]) => void;
}

/**
 * 지원 기록 편집 컴포넌트
 */
const JobApplicationEdit: React.FC<JobApplicationEditProps> = ({
  jobApplications,
  onUpdate,
}) => {
  const addJobApplication = () => {
    onUpdate([
      ...jobApplications,
      {
        name: '',
        position: '',
        jobPostingTitle: '',
        jobPostingUrl: '',
        startedAt: undefined,
        endedAt: undefined,
        applicationSource: '',
        memo: '',
        applicationStages: [],
      } as TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest,
    ]);
  };

  const removeJobApplication = (index: number) => {
    onUpdate(jobApplications.filter((_, i) => i !== index));
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

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>지원 기록</h2>
        <button className={styles.addButton} onClick={addJobApplication}>
          + 추가
        </button>
      </div>
      <div className={styles.sectionContent}>
        {jobApplications.length === 0 ? (
          <div className={styles.emptyContent}>
            <p>지원 기록을 추가해 주세요.</p>
          </div>
        ) : (
          jobApplications.map((app, index) => (
            <div key={index} className={styles.applicationCard}>
              <div className={styles.cardHeader}>
                <div className={styles.dragHandle}>⋮⋮</div>
                <div className={styles.cardInputs}>
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>회사명</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="회사명을 입력해 주세요."
                        value={app.name}
                        onChange={(e) => updateJobApplication(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>직무</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="직무를 입력해 주세요."
                        value={app.position}
                        onChange={(e) => updateJobApplication(index, 'position', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>공고명</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="공고명을 입력해 주세요."
                        value={app.jobPostingTitle}
                        onChange={(e) => updateJobApplication(index, 'jobPostingTitle', e.target.value)}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>공고 URL</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="공고 URL을 입력해 주세요."
                        value={app.jobPostingUrl}
                        onChange={(e) => updateJobApplication(index, 'jobPostingUrl', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>모집 기간</label>
                      <div className={styles.dateRange}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="YYYY. MM. DD."
                          value={app.startedAt ? DateUtil.formatTimestamp(app.startedAt) : ''}
                          onChange={(e) => updateJobApplication(index, 'startedAt', DateUtil.normalizeTimestamp(e.target.value))}
                        />
                        <span className={styles.dateSeparator}>-</span>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="YYYY. MM. DD."
                          value={app.endedAt ? DateUtil.formatTimestamp(app.endedAt) : ''}
                          onChange={(e) => updateJobApplication(index, 'endedAt', DateUtil.normalizeTimestamp(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>지원 경로</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="예: 원티드, 링크드인, 잡코리아 등"
                        value={app.applicationSource}
                        onChange={(e) => updateJobApplication(index, 'applicationSource', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>메모</label>
                    <textarea
                      className={styles.textarea}
                      placeholder="예: 지원 사유, 회사 장단점 등"
                      value={app.memo}
                      onChange={(e) => updateJobApplication(index, 'memo', e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* 채용 절차 - 각 지원 기록 내부에 포함 */}
                  <ApplicationStageEdit
                    applicationStages={app.applicationStages || []}
                    onUpdate={(stages) => updateApplicationStages(index, stages)}
                  />
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => removeJobApplication(index)}
                >
                  −
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobApplicationEdit;

