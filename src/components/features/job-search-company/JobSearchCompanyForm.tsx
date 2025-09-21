import React from 'react';
import DateUtil from '@/utils/DateUtil';
import { JobSearchCompanyCreateRequest, JobSearchCompanyUpdateRequest } from '@/generated/job_search_company';
import styles from './JobSearchCompanyForm.module.css';

interface JobSearchCompanyFormProps {
  formData: JobSearchCompanyCreateRequest | JobSearchCompanyUpdateRequest;
  onFormChange: (field: string, value: string | number | undefined) => void;
}

const JobSearchCompanyForm: React.FC<JobSearchCompanyFormProps> = ({
  formData,
  onFormChange,
}) => {
  return (
    <div className={styles.container}>
      {/* 기본 정보 */}
      <div className={styles.section}>
        <div className={styles.field}>
          <label className={styles.label}>
            회사명 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            className={styles.input}
            placeholder="회사명을 입력하세요"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            상태 <span className={styles.required}>*</span>
          </label>
          <select
            value={formData.status}
            onChange={(e) => onFormChange('status', e.target.value)}
            className={styles.select}
            required
          >
            <option value="INTERESTED">관심있음</option>
            <option value="APPLIED">지원함</option>
            <option value="INTERVIEWING">면접중</option>
            <option value="PASSED">최종합격</option>
            <option value="REJECTED">불합격</option>
            <option value="ABANDONED">포기</option>
          </select>
        </div>
      </div>

      {/* 날짜 정보 */}
      <div className={styles.section}>
        <div className={styles.field}>
          <label className={styles.label}>지원일</label>
          <input
            type="datetime-local"
            value={formData.appliedAt ? DateUtil.formatTimestamp(formData.appliedAt) : ''}
            onChange={(e) => onFormChange('appliedAt', e.target.value ? DateUtil.parseToTimestamp(e.target.value) : undefined)}
            className={styles.dateInput}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>마감일</label>
          <input
            type="datetime-local"
            value={formData.closedAt ? DateUtil.formatTimestamp(formData.closedAt) : ''}
            onChange={(e) => onFormChange('closedAt', e.target.value ? DateUtil.parseToTimestamp(e.target.value) : undefined)}
            className={styles.dateInput}
          />
        </div>
      </div>

      {/* 회사 정보 */}
      <div className={styles.section}>
        <div className={styles.field}>
          <label className={styles.label}>업종</label>
          <input
            type="text"
            value={formData.industry || ''}
            onChange={(e) => onFormChange('industry', e.target.value)}
            className={styles.input}
            placeholder="예: IT, 금융, 제조업"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>위치</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => onFormChange('location', e.target.value)}
            className={styles.input}
            placeholder="예: 서울, 경기, 부산"
          />
        </div>
      </div>

      {/* 규모 */}
      <div className={styles.section}>
        <div className={styles.field}>
          <label className={styles.label}>사업자 규모</label>
          <input
            type="text"
            value={formData.businessSize || ''}
            onChange={(e) => onFormChange('businessSize', e.target.value)}
            className={styles.input}
            placeholder="예: 대기업, 중견기업, 스타트업"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>링크</label>
          <input
            type="url"
            value={formData.link || ''}
            onChange={(e) => onFormChange('link', e.target.value)}
            className={styles.input}
            placeholder="회사 채용 공고 링크"
          />
        </div>
      </div>

      {/* 설명 및 메모 */}
      <div className={styles.fullWidthSection}>
        <div className={styles.field}>
          <label className={styles.label}>회사 설명</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => onFormChange('description', e.target.value)}
            className={styles.textarea}
            placeholder="회사에 대한 간단한 설명을 입력하세요"
            rows={4}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>메모</label>
          <textarea
            value={formData.memo || ''}
            onChange={(e) => onFormChange('memo', e.target.value)}
            className={styles.textarea}
            placeholder="추가 메모나 특이사항을 입력하세요"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default JobSearchCompanyForm;