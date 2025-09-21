import React from 'react';
import DateUtil from '@/utils/DateUtil';
import { JobSearchCompanyCreateRequest, JobSearchCompanyUpdateRequest } from '@/generated/job_search_company';

interface JobSearchCompanyFormProps {
  formData: JobSearchCompanyCreateRequest | JobSearchCompanyUpdateRequest;
  onFormChange: (field: string, value: string | number | undefined) => void;
}

const JobSearchCompanyForm: React.FC<JobSearchCompanyFormProps> = ({
  formData,
  onFormChange,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 기본 정보 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            회사명 *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none'
            }}
            placeholder="회사명을 입력하세요"
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            상태 *
          </label>
          <select
            value={formData.status}
            onChange={(e) => onFormChange('status', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'white'
            }}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            업종
          </label>
          <input
            type="text"
            value={formData.industry || ''}
            onChange={(e) => onFormChange('industry', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'white'
            }}
            placeholder="IT, 금융, 제조업 등"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            규모
          </label>
          <input
            type="text"
            value={formData.businessSize || ''}
            onChange={(e) => onFormChange('businessSize', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'white'
            }}
            placeholder="대기업, 중견기업, 스타트업 등"
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            위치
          </label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => onFormChange('location', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'white'
            }}
            placeholder="서울, 경기, 부산 등"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            링크
          </label>
          <input
            type="url"
            value={formData.link || ''}
            onChange={(e) => onFormChange('link', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'white'
            }}
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            지원일
          </label>
          <input
            type="date"
            value={formData.appliedAt ? DateUtil.formatTimestamp(formData.appliedAt) : ''}
            onChange={(e) => onFormChange('appliedAt', e.target.value ? DateUtil.parseToTimestamp(e.target.value) : undefined)}
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
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            마감일
          </label>
          <input
            type="date"
            value={formData.closedAt ? DateUtil.formatTimestamp(formData.closedAt) : ''}
            onChange={(e) => onFormChange('closedAt', e.target.value ? DateUtil.parseToTimestamp(e.target.value) : undefined)}
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

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
          회사 설명
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => onFormChange('description', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            fontSize: '14px',
            outline: 'none',
            minHeight: '80px',
            resize: 'vertical'
          }}
          placeholder="회사에 대한 간단한 설명을 입력하세요"
        />
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
            minHeight: '80px',
            resize: 'vertical'
          }}
          placeholder="추가 메모를 입력하세요"
        />
      </div>
    </div>
  );
};

export default JobSearchCompanyForm;
