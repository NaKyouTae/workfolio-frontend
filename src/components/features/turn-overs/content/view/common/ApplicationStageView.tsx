import React from 'react';
import { ApplicationStage, ApplicationStage_ApplicationStageStatus } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';

interface ApplicationStageViewProps {
  applicationStages: ApplicationStage[];
  jobApplicationId: string;
}

const ApplicationStageView: React.FC<ApplicationStageViewProps> = ({ applicationStages, jobApplicationId }) => {
  const getStatusStyle = (status: ApplicationStage_ApplicationStageStatus) => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '13px',
      fontWeight: 600,
    };
    
    switch (status) {
      case ApplicationStage_ApplicationStageStatus.PASSED:
        return { ...baseStyle, background: '#d1fae5', color: '#065f46' };
      case ApplicationStage_ApplicationStageStatus.FAILED:
        return { ...baseStyle, background: '#fee2e2', color: '#991b1b' };
      case ApplicationStage_ApplicationStageStatus.PENDING:
        return { ...baseStyle, background: '#fef3c7', color: '#92400e' };
      case ApplicationStage_ApplicationStageStatus.SCHEDULED:
        return { ...baseStyle, background: '#dbeafe', color: '#1e40af' };
      case ApplicationStage_ApplicationStageStatus.CANCELLED:
        return { ...baseStyle, background: '#e5e7eb', color: '#4b5563' };
      default:
        return { ...baseStyle, background: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getStatusLabel = (status: ApplicationStage_ApplicationStageStatus) => {
    switch (status) {
      case ApplicationStage_ApplicationStageStatus.PASSED:
        return '합격';
      case ApplicationStage_ApplicationStageStatus.FAILED:
        return '불합격';
      case ApplicationStage_ApplicationStageStatus.PENDING:
        return '대기';
      case ApplicationStage_ApplicationStageStatus.SCHEDULED:
        return '예정';
      case ApplicationStage_ApplicationStageStatus.CANCELLED:
        return '취소';
      default:
        return '-';
    }
  };

  const getDotColor = (status: ApplicationStage_ApplicationStageStatus) => {
    switch (status) {
      case ApplicationStage_ApplicationStageStatus.PASSED:
        return '#10b981';
      case ApplicationStage_ApplicationStageStatus.FAILED:
        return '#ef4444';
      case ApplicationStage_ApplicationStageStatus.PENDING:
        return '#f59e0b';
      case ApplicationStage_ApplicationStageStatus.SCHEDULED:
        return '#3b82f6';
      case ApplicationStage_ApplicationStageStatus.CANCELLED:
        return '#6b7280';
      default:
        return '#9ca3af';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {applicationStages.map((stage, index) => (
        <div 
          key={stage.id || `stage-${jobApplicationId}-${index}`} 
          style={{ display: 'flex', gap: '12px', position: 'relative' }}
        >
          {/* Timeline node */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            position: 'relative',
            flexShrink: 0
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: getDotColor(stage.status),
              marginTop: '6px',
              zIndex: 1
            }} />
            {index < applicationStages.length - 1 && (
              <div style={{
                width: '2px',
                flex: 1,
                minHeight: '40px',
                background: '#e5e7eb',
                marginTop: '4px'
              }} />
            )}
          </div>

          {/* Timeline content */}
          <div style={{ flex: 1, paddingBottom: index < applicationStages.length - 1 ? '16px' : '0' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px' }}>
              {stage.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: stage.memo ? '8px' : '0' }}>
              <span style={getStatusStyle(stage.status)}>
                {getStatusLabel(stage.status)}
              </span>
              {stage.startedAt && (
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  {DateUtil.formatTimestamp(stage.startedAt, 'MM.DD')}
                </span>
              )}
            </div>
            {stage.memo && (
              <div style={{ 
                fontSize: '14px', 
                color: '#4b5563', 
                padding: '8px 12px',
                background: '#f9fafb',
                borderRadius: '4px',
                marginTop: '8px',
                lineHeight: 1.5
              }}>
                {stage.memo}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationStageView;

