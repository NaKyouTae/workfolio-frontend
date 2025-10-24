import React from 'react';
import { InterviewCreateRequest, InterviewUpdateRequest } from '@/generated/interview';
import { Interview_Type } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';
import styles from './InterviewForm.module.css';

interface InterviewFormProps {
  formData: InterviewCreateRequest | InterviewUpdateRequest;
  onFormChange: (field: string, value: string | number | undefined) => void;
}

const InterviewForm: React.FC<InterviewFormProps> = ({ formData, onFormChange }) => {
  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label className={styles.label}>
          제목 <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => onFormChange('title', e.target.value)}
          className={styles.input}
          placeholder="면접 제목을 입력하세요"
          required
        />
      </div>

      <div className={styles.section}>
        <div className={styles.field}>
          <label className={styles.label}>
            면접 유형 <span className={styles.required}>*</span>
          </label>
          <select
            value={formData.type}
            onChange={(e) => onFormChange('type', parseInt(e.target.value))}
            className={styles.select}
            required
          >
            <option value={Interview_Type.UNKNOWN}>알 수 없음</option>
            <option value={Interview_Type.PAPER}>서류</option>
            <option value={Interview_Type.OFFLINE}>오프라인</option>
            <option value={Interview_Type.ONLINE}>온라인</option>
          </select>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.field}>
          <label className={styles.label}>시작일</label>
          <input
            type="datetime-local"
            value={formData.startedAt ? DateUtil.formatTimestamp(formData.startedAt) : ''}
            onChange={(e) => onFormChange('startedAt', e.target.value ? DateUtil.parseToTimestamp(e.target.value) : undefined)}
            className={styles.dateInput}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>종료일</label>
          <input
            type="datetime-local"
            value={formData.endedAt ? DateUtil.formatTimestamp(formData.endedAt) : ''}
            onChange={(e) => onFormChange('endedAt', e.target.value ? DateUtil.parseToTimestamp(e.target.value) : undefined)}
            className={styles.dateInput}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>메모</label>
        <textarea
          value={formData.memo || ''}
          onChange={(e) => onFormChange('memo', e.target.value)}
          className={styles.textarea}
          placeholder="면접에 대한 메모를 입력하세요"
          rows={4}
        />
      </div>
    </div>
  );
};

export default InterviewForm;