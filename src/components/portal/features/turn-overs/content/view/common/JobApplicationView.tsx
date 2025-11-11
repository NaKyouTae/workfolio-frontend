import React from 'react';
import { JobApplication } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';
import ApplicationStageView from './ApplicationStageView';
import '@/styles/component-view.css';

interface JobApplicationViewProps {
  jobApplication: JobApplication;
}

const JobApplicationView: React.FC<JobApplicationViewProps> = ({ jobApplication }) => {
  return (
    <div className="view-item">
      <div className="view-item-content">
        {/* 카드 헤더 */}
        <div style={{ marginBottom: '16px' }}>
          <div>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#1a1a1a', 
              marginBottom: '8px' 
            }}>
              {jobApplication.name}
            </h3>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              flexWrap: 'wrap' 
            }}>
              <span style={{ 
                fontSize: '16px', 
                fontWeight: 600, 
                color: '#007bff' 
              }}>
                {jobApplication.position}
              </span>
              <button style={{
                padding: '4px 12px',
                background: 'transparent',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                fontSize: '13px',
                color: '#6b7280',
                cursor: 'pointer'
              }}>
                상세보기 ↗
              </button>
            </div>
          </div>
        </div>

        {/* 직무 정보 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '16px' 
        }}>
          <span style={{ 
            fontSize: '15px', 
            color: '#333' 
          }}>
            {jobApplication.jobPostingTitle}
          </span>
          {jobApplication.jobPostingUrl && (
            <a 
              href={jobApplication.jobPostingUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                fontSize: '16px',
                textDecoration: 'none'
              }}
            >
              🔗
            </a>
          )}
        </div>

        {/* 지원 단계 타임라인 */}
        {jobApplication.applicationStages && jobApplication.applicationStages.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <ApplicationStageView 
              applicationStages={jobApplication.applicationStages}
              jobApplicationId={jobApplication.id}
            />
          </div>
        )}

        {/* 추가 정보 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(jobApplication.startedAt || jobApplication.endedAt) && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>모집 기간</span>
              <span style={{ fontSize: '14px', color: '#1a1a1a' }}>
                {jobApplication.startedAt && DateUtil.formatTimestamp(jobApplication.startedAt, 'YY.MM.DD')}
                {jobApplication.startedAt && jobApplication.endedAt && ' - '}
                {jobApplication.endedAt && DateUtil.formatTimestamp(jobApplication.endedAt, 'YY.MM.DD')}
              </span>
            </div>
          )}
          {jobApplication.applicationSource && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>지원 경로</span>
              <span style={{ fontSize: '14px', color: '#1a1a1a' }}>{jobApplication.applicationSource}</span>
            </div>
          )}
          {jobApplication.memo && (
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', flexShrink: 0 }}>메모</span>
              <span style={{ fontSize: '14px', color: '#1a1a1a', textAlign: 'right', whiteSpace: 'pre-wrap' }}>
                {jobApplication.memo}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationView;

