import React from 'react';
import { JobSearchCreateRequest, JobSearchUpdateRequest } from '@/generated/job_search';
import { Company } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';

interface JobSearchFormProps {
  formData: JobSearchCreateRequest | JobSearchUpdateRequest;
  onFormChange: (field: string, value: string | number | undefined) => void;
  companies: Company[];
}

const JobSearchForm: React.FC<JobSearchFormProps> = ({ formData, onFormChange, companies }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
          제목 *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onFormChange('title', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            fontSize: '14px',
            outline: 'none'
          }}
          placeholder="구직 제목을 입력하세요"
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            시작일 *
          </label>
          <input
            type="date"
            value={formData.startedAt ? DateUtil.formatTimestamp(formData.startedAt) : ''}
            onChange={(e) => onFormChange('startedAt', e.target.value ? DateUtil.parseToTimestamp(e.target.value) : undefined)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none'
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            종료일
          </label>
          <input
            type="date"
            value={formData.endedAt ? DateUtil.formatTimestamp(formData.endedAt) : ''}
            onChange={(e) => onFormChange('endedAt', e.target.value ? DateUtil.parseToTimestamp(e.target.value) : undefined)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            이전 회사
          </label>
          <select
            value={formData.prevCompanyId || ''}
            onChange={(e) => onFormChange('prevCompanyId', e.target.value || undefined)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'white'
            }}
          >
            <option value="">선택하세요</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            이후 회사
          </label>
          <select
            value={formData.nextCompanyId || ''}
            onChange={(e) => onFormChange('nextCompanyId', e.target.value || undefined)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'white'
            }}
          >
            <option value="">선택하세요</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
          메모
        </label>
        <textarea
          value={formData.memo || ''}
          onChange={(e) => onFormChange('memo', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            fontSize: '14px',
            outline: 'none',
            minHeight: '100px',
            resize: 'vertical'
          }}
          placeholder="구직 관련 메모를 입력하세요"
        />
      </div>
    </div>
  );
};

export default JobSearchForm;
