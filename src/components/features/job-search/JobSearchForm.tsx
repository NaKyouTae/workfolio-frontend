import React from 'react';
import { JobSearchCreateRequest, JobSearchUpdateRequest } from '@/generated/job_search';
import { Career } from '@/generated/common';
import DatePicker from '@/components/ui/DatePicker';
import styles from './JobSearchForm.module.css';

interface JobSearchFormProps {
  formData: JobSearchCreateRequest | JobSearchUpdateRequest;
  onFormChange: (field: string, value: string | number | undefined) => void;
  careers: Career[];
}

const JobSearchForm: React.FC<JobSearchFormProps> = ({ formData, onFormChange, careers }) => {
  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label className={styles.label}>
          제목 <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onFormChange('title', e.target.value)}
          className={styles.input}
          placeholder="이직 제목을 입력하세요"
          required
        />
      </div>

      <div className={styles.section}>
        <div className={styles.field}>
          <DatePicker
            label="시작일"
            required={true}
            value={formData.startedAt ? new Date(formData.startedAt).toISOString() : ''}
            onChange={(dateString) => onFormChange('startedAt', dateString ? new Date(dateString).getTime() : undefined)}
          />
        </div>

        <div className={styles.field}>
          <DatePicker
            label="종료일"
            required={false}
            value={formData.endedAt ? new Date(formData.endedAt).toISOString() : undefined}
            onChange={(dateString) => {
              if (!dateString || dateString.trim() === '') {
                onFormChange('endedAt', undefined);
              } else {
                onFormChange('endedAt', new Date(dateString).getTime());
              }
            }}
          />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.field}>
          <label className={styles.label}>이전 회사</label>
          <select
            value={formData.prevCareerId || ''}
            onChange={(e) => onFormChange('prevCareerId', e.target.value || undefined)}
            className={styles.select}
          >
            <option value="">이전 회사를 선택하세요</option>
            {careers.map((career) => (
              <option key={career.id} value={career.id}>
                {career.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>이후 회사</label>
          <select
            value={formData.nextCareerId || ''}
            onChange={(e) => onFormChange('nextCareerId', e.target.value || undefined)}
            className={styles.select}
          >
            <option value="">이후 회사를 선택하세요</option>
            {careers.map((career) => (
              <option key={career.id} value={career.id}>
                {career.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>메모</label>
        <textarea
          value={formData.memo || ''}
          onChange={(e) => onFormChange('memo', e.target.value)}
          className={styles.textarea}
          placeholder="이직에 대한 메모를 입력하세요"
          rows={4}
        />
      </div>
    </div>
  );
};

export default JobSearchForm;