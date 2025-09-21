import React from 'react';
import { InterviewCreateRequest, InterviewUpdateRequest } from '@/generated/interview';
import { Interview_Type } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';

interface InterviewFormProps {
  formData: InterviewCreateRequest | InterviewUpdateRequest;
  onFormChange: (field: string, value: string | number | undefined) => void;
}

const InterviewForm: React.FC<InterviewFormProps> = ({ formData, onFormChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 기본 정보 */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
          제목 *
        </label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => onFormChange('title', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            fontSize: '14px',
            outline: 'none'
          }}
          placeholder="면접 제목을 입력하세요"
          required
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
          면접 유형 *
        </label>
        <select
          value={formData.type}
          onChange={(e) => onFormChange('type', parseInt(e.target.value))}
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
          <option value={Interview_Type.ONLINE}>온라인</option>
          <option value={Interview_Type.OFFLINE}>오프라인</option>
          <option value={Interview_Type.UNKNOWN}>알 수 없음</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            시작일
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
          placeholder="면접 관련 메모를 입력하세요"
        />
      </div>
    </div>
  );
};

export default InterviewForm;
