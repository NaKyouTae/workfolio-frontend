import React from 'react';
import { ApplicationStage_ApplicationStageStatus } from '@/generated/common';
import { TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest } from '@/generated/turn_over';
import { DateUtil } from '@/utils/DateUtil';
import styles from '../TurnOverChallengeEdit.module.css';

interface ApplicationStageEditProps {
  applicationStages: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest[];
  onUpdate: (stages: TurnOverUpsertRequest_TurnOverChallengeRequest_JobApplicationRequest_ApplicationStageRequest[]) => void;
}

/**
 * 채용 절차 편집 컴포넌트
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

  return (
    <div className={styles.subsection}>
      <div className={styles.subsectionHeader}>
        <h3 className={styles.subsectionTitle}>채용 절차</h3>
        <button className={styles.addSubButton} onClick={addApplicationStage}>
          + 절차 추가
        </button>
      </div>
      <div className={styles.subsectionContent}>
        {applicationStages.length === 0 ? (
          <div className={styles.emptySubContent}>
            <p>채용 절차를 추가해 주세요.</p>
          </div>
        ) : (
          applicationStages.map((stage, index) => (
            <div key={index} className={styles.stageCard}>
              <div className={styles.cardHeader}>
                <div className={styles.dragHandle}>⋮⋮</div>
                <div className={styles.cardInputs}>
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>절차명</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="예: 서류 전형, 1차 면접 등"
                        value={stage.name}
                        onChange={(e) => updateStage(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>진행 일자</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="YYYY. MM. DD."
                        value={stage.startedAt ? DateUtil.formatTimestamp(stage.startedAt) : ''}
                        onChange={(e) => updateStage(index, 'startedAt', DateUtil.normalizeTimestamp(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>진행 상태</label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name={`status-${index}`}
                          value="pending"
                          checked={stage.status === ApplicationStage_ApplicationStageStatus.PENDING}
                          onChange={() => updateStage(index, 'status', ApplicationStage_ApplicationStageStatus.PENDING)}
                        />
                        대기
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name={`status-${index}`}
                          value="passed"
                          checked={stage.status === ApplicationStage_ApplicationStageStatus.PASSED}
                          onChange={() => updateStage(index, 'status', ApplicationStage_ApplicationStageStatus.PASSED)}
                        />
                        합격
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name={`status-${index}`}
                          value="failed"
                          checked={stage.status === ApplicationStage_ApplicationStageStatus.FAILED}
                          onChange={() => updateStage(index, 'status', ApplicationStage_ApplicationStageStatus.FAILED)}
                        />
                        불합격
                      </label>
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>메모</label>
                    <textarea
                      className={styles.textarea}
                      placeholder="예: 채용 서류, 과제 내용, 면접 유형, 면접 질문 등"
                      value={stage.memo}
                      onChange={(e) => updateStage(index, 'memo', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => removeApplicationStage(index)}
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

export default ApplicationStageEdit;

