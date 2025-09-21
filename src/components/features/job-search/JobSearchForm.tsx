import React from 'react';
import { JobSearchCreateRequest, JobSearchUpdateRequest } from '@/generated/job_search';
import { Company } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';
import styles from './JobSearchForm.module.css';

interface JobSearchFormProps {
  formData: JobSearchCreateRequest | JobSearchUpdateRequest;
  onFormChange: (field: string, value: string | number | undefined) => void;
  companies: Company[];
}

const JobSearchForm: React.FC<JobSearchFormProps> = ({ formData, onFormChange, companies }) => {
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
          placeholder="구직 제목을 입력하세요"
          required
        />
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

      <div className={styles.section}>
        <div className={styles.field}>
          <label className={styles.label}>이전 회사</label>
          <select
            value={formData.prevCompanyId || ''}
            onChange={(e) => onFormChange('prevCompanyId', e.target.value || undefined)}
            className={styles.select}
          >
            <option value="">이전 회사를 선택하세요</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>이후 회사</label>
          <select
            value={formData.nextCompanyId || ''}
            onChange={(e) => onFormChange('nextCompanyId', e.target.value || undefined)}
            className={styles.select}
          >
            <option value="">이후 회사를 선택하세요</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
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
          placeholder="구직에 대한 메모를 입력하세요"
          rows={4}
        />
      </div>
    </div>
  );
};

export default JobSearchForm;