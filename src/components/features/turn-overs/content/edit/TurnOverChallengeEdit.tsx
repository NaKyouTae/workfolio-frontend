import React, { useState } from 'react';
import { ApplicationStage, ApplicationStage_ApplicationStageStatus, JobApplicationDetail, TurnOverChallengeDetail } from '@/generated/common';
import styles from './TurnOverChallengeEdit.module.css';
import { DateUtil } from '@/utils/DateUtil';
import { TurnOverUpsertRequest_MemoRequest } from '@/generated/turn_over';
import { AttachmentRequest } from '@/generated/attachment';
import MemoEdit from './common/MemoEdit';
import AttachmentEdit from './common/AttachmentEdit';

interface TurnOverChallengeEditProps {
  turnOverChallenge: TurnOverChallengeDetail | null;
  onSave?: (data: TurnOverChallengeDetail) => void;
}


const TurnOverChallengeEdit: React.FC<TurnOverChallengeEditProps> = ({ turnOverChallenge }) => {
  const [jobApplications, setJobApplications] = useState<JobApplicationDetail[]>(turnOverChallenge?.jobApplications || []);
  const [applicationStages, setApplicationStages] = useState<ApplicationStage[]>(turnOverChallenge?.jobApplications.map((jobApplication) => ({
    id: jobApplication.id,
    name: jobApplication.name,
    stageDate: jobApplication.startedAt ? DateUtil.normalizeTimestamp(jobApplication.startedAt) : undefined,
    status: ApplicationStage_ApplicationStageStatus.PENDING,
    memo: jobApplication.memo,
    createdAt: jobApplication.createdAt,
    updatedAt: jobApplication.updatedAt,
  })) || []);
  const [memos, setMemos] = useState<TurnOverUpsertRequest_MemoRequest[]>(
    turnOverChallenge?.memos || []
  );
  const [attachments, setAttachments] = useState<AttachmentRequest[]>(
    turnOverChallenge?.attachments || []
  );

  const addJobApplication = () => {
    setJobApplications([
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
        createdAt: DateUtil.normalizeTimestamp(Date.now()),
        updatedAt: DateUtil.normalizeTimestamp(Date.now()),
        id: '',
        applicationStages: [],
      },
    ]);
  };

  const removeJobApplication = (index: number) => {
    setJobApplications(jobApplications.filter((_, i) => i !== index));
  };

  const addApplicationStage = () => {
    setApplicationStages([
      ...applicationStages,
      {
        name: '',
        startedAt: undefined,
        status: ApplicationStage_ApplicationStageStatus.PENDING,
        memo: '',
        createdAt: DateUtil.normalizeTimestamp(Date.now()),
        updatedAt: DateUtil.normalizeTimestamp(Date.now()),
        id: '',        
      },
    ]);
  };

  const removeApplicationStage = (index: number) => {
    setApplicationStages(applicationStages.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      {/* 지원 기록 */}
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
                          onChange={(e) => {
                            const updated = [...jobApplications];
                            updated[index].name = e.target.value;
                            setJobApplications(updated);
                          }}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>직무</label>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="직무를 입력해 주세요."
                          value={app.position}
                          onChange={(e) => {
                            const updated = [...jobApplications];
                            updated[index].position = e.target.value;
                            setJobApplications(updated);
                          }}
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
                          onChange={(e) => {
                            const updated = [...jobApplications];
                            updated[index].jobPostingTitle = e.target.value;
                            setJobApplications(updated);
                          }}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>공고 URL</label>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="공고 URL을 입력해 주세요."
                          value={app.jobPostingUrl}
                          onChange={(e) => {
                            const updated = [...jobApplications];
                            updated[index].jobPostingUrl = e.target.value;
                            setJobApplications(updated);
                          }}
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
                            onChange={(e) => {
                              const updated = [...jobApplications];
                              updated[index].startedAt = DateUtil.normalizeTimestamp(e.target.value);
                              setJobApplications(updated);
                            }}
                          />
                          <span className={styles.dateSeparator}>-</span>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="YYYY. MM. DD."
                            value={app.endedAt ? DateUtil.formatTimestamp(app.endedAt) : ''}
                            onChange={(e) => {
                              const updated = [...jobApplications];
                              updated[index].endedAt = DateUtil.normalizeTimestamp(e.target.value);
                              setJobApplications(updated);
                            }}
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
                          onChange={(e) => {
                            const updated = [...jobApplications];
                            updated[index].applicationSource = e.target.value;
                            setJobApplications(updated);
                          }}
                        />
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>메모</label>
                      <textarea
                        className={styles.textarea}
                        placeholder="예: 지원 사유, 회사 장단점 등"
                        value={app.memo}
                        onChange={(e) => {
                          const updated = [...jobApplications];
                          updated[index].memo = e.target.value;
                          setJobApplications(updated);
                        }}
                        rows={3}
                      />
                    </div>
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

      {/* 채용 절차 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>채용 절차</h2>
          <button className={styles.addButton} onClick={addApplicationStage}>
            + 추가
          </button>
        </div>
        <div className={styles.sectionContent}>
          {applicationStages.length === 0 ? (
            <div className={styles.emptyContent}>
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
                          onChange={(e) => {
                            const updated = [...applicationStages];
                            updated[index].name = e.target.value;
                            setApplicationStages(updated);
                          }}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>진행 일자</label>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="YYYY. MM. DD."
                          value={stage.startedAt ? DateUtil.formatTimestamp(stage.startedAt) : ''}
                          onChange={(e) => {
                            const updated = [...applicationStages];
                            updated[index].startedAt = DateUtil.normalizeTimestamp(e.target.value);
                            setApplicationStages(updated);
                          }}
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
                            onChange={() => {
                              const updated = [...applicationStages];
                              updated[index].status = ApplicationStage_ApplicationStageStatus.PENDING;
                              setApplicationStages(updated);
                            }}
                          />
                          대기
                        </label>
                        <label className={styles.radioLabel}>
                          <input
                            type="radio"
                            name={`status-${index}`}
                            value="passed"
                            checked={stage.status === ApplicationStage_ApplicationStageStatus.PASSED}
                            onChange={() => {
                              const updated = [...applicationStages];
                              updated[index].status = ApplicationStage_ApplicationStageStatus.PASSED;
                              setApplicationStages(updated);
                            }}
                          />
                          합격
                        </label>
                        <label className={styles.radioLabel}>
                          <input
                            type="radio"
                            name={`status-${index}`}
                            value="failed"
                              checked={stage.status === ApplicationStage_ApplicationStageStatus.FAILED}
                            onChange={() => {
                              const updated = [...applicationStages];
                              updated[index].status = ApplicationStage_ApplicationStageStatus.FAILED;
                              setApplicationStages(updated);
                            }}
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
                        onChange={(e) => {
                          const updated = [...applicationStages];
                          updated[index].memo = e.target.value;
                          setApplicationStages(updated);
                        }}
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

      {/* 메모 */}
      <MemoEdit memos={memos} onMemosChange={setMemos} />

      {/* 첨부 */}
      <AttachmentEdit attachments={attachments} onAttachmentsChange={setAttachments} />
    </div>
  );
};

export default TurnOverChallengeEdit;

