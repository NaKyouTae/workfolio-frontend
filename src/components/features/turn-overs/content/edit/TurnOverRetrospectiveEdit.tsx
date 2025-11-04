import React, { useState } from 'react';
import { TurnOverRetrospectiveDetail } from '@/generated/common';
import styles from './TurnOverRetrospectiveEdit.module.css';
import { DateUtil } from '@/utils/DateUtil';
import { TurnOverUpsertRequest_MemoRequest } from '@/generated/turn_over';
import { AttachmentRequest } from '@/generated/attachment';
import MemoEdit from './common/MemoEdit';
import AttachmentEdit from './common/AttachmentEdit';

interface TurnOverRetrospectiveEditProps {
  turnOverRetrospective: TurnOverRetrospectiveDetail | null;
  onSave?: (data: TurnOverRetrospectiveDetail) => void;
}

const TurnOverRetrospectiveEdit: React.FC<TurnOverRetrospectiveEditProps> = ({
  turnOverRetrospective,
}) => {
  const [companyName, setCompanyName] = useState(turnOverRetrospective?.name || '');
  const [position, setPosition] = useState(turnOverRetrospective?.position || '');
  const [reason, setReason] = useState(turnOverRetrospective?.reason || '');
  const [joinDate, setJoinDate] = useState(turnOverRetrospective?.joinedAt ? DateUtil.normalizeTimestamp(turnOverRetrospective.joinedAt) : undefined);
  const [employmentType, setEmploymentType] = useState('선택');
  const [department, setDepartment] = useState(turnOverRetrospective?.department || '');
  const [jobTitle, setJobTitle] = useState(turnOverRetrospective?.jobTitle || '');
  const [rank, setRank] = useState(turnOverRetrospective?.rank || '');
  const [workType, setWorkType] = useState(turnOverRetrospective?.workType || '');
  const [score, setScore] = useState(turnOverRetrospective?.score || 5);
  const [reviewSummary, setReviewSummary] = useState(turnOverRetrospective?.reviewSummary || '');
  const [memos, setMemos] = useState<TurnOverUpsertRequest_MemoRequest[]>(
    turnOverRetrospective?.memos || []
  );
  const [attachments, setAttachments] = useState<AttachmentRequest[]>(
    turnOverRetrospective?.attachments || []
  );

  return (
    <div className={styles.container}>
      {/* 최종 선택 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>최종 선택</h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>회사명</label>
              <select className={styles.select} value={companyName} onChange={(e) => setCompanyName(e.target.value)}>
                <option value="">선택</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>직무</label>
              <input
                type="text"
                className={styles.input}
                placeholder="직무를 입력해 주세요."
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>선택 사유</label>
            <textarea
              className={styles.textarea}
              placeholder="선택 사유를 입력해 주세요."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* 자우 협의 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>자우 협의</h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>입사 일자</label>
              <input
                type="text"
                className={styles.input}
                placeholder="YYYY. MM. DD."
                value={joinDate}
                onChange={(e) => setJoinDate(DateUtil.normalizeTimestamp(e.target.value))}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>재직 형태</label>
              <select className={styles.select} value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                <option value="선택">선택</option>
                <option value="정규직">정규직</option>
                <option value="계약직">계약직</option>
                <option value="프리랜서">프리랜서</option>
                <option value="인턴">인턴</option>
              </select>
            </div>
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>부서</label>
              <input
                type="text"
                className={styles.input}
                placeholder="부서를 입력해 주세요."
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>직무</label>
              <input
                type="text"
                className={styles.input}
                placeholder="직무를 입력해 주세요."
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>직책</label>
              <input
                type="text"
                className={styles.input}
                placeholder="(예) 파트장, 팀장, 분부장 등"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>직급</label>
              <input
                type="text"
                className={styles.input}
                placeholder="(예) 사원, 대리, 과장 등"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>근무 형태(연봉)</label>
            <input
              type="text"
              className={styles.input}
              placeholder="(예) 재택, 출퇴근자유 등"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 만족도 평가 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>만족도 평가</h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>점수</label>
            <div className={styles.scoreGroup}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="score"
                    value={value}
                    checked={score === value}
                    onChange={() => setScore(value)}
                  />
                  {value}점
                </label>
              ))}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>한 줄 회고</label>
            <textarea
              className={styles.textarea}
              placeholder="회고 내용을 입력해 주세요."
              value={reviewSummary}
              onChange={(e) => setReviewSummary(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* 메모 */}
      <MemoEdit memos={memos} onMemosChange={setMemos} />

      {/* 첨부 */}
      <AttachmentEdit attachments={attachments} onAttachmentsChange={setAttachments} />
    </div>
  );
};

export default TurnOverRetrospectiveEdit;

