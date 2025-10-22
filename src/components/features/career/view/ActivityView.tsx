import React from 'react';
import { ResumeUpdateRequest_ActivityRequest } from '@/generated/resume';
import { Activity_ActivityType } from '@/generated/common';
import { DateTime } from 'luxon';

interface ActivityViewProps {
  activities: ResumeUpdateRequest_ActivityRequest[];
}

/**
 * 활동 정보 읽기 전용 컴포넌트
 */
const ActivityView: React.FC<ActivityViewProps> = ({ activities }) => {
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '-';
    return DateTime.fromMillis(timestamp).toFormat('yyyy.MM');
  };

  const getActivityTypeLabel = (type?: Activity_ActivityType) => {
    const labels: Record<Activity_ActivityType, string> = {
      [Activity_ActivityType.UNKNOWN]: '미분류', // 미분류
      [Activity_ActivityType.INTERNSHIP]: '인턴', // 인턴
      [Activity_ActivityType.EXTERNAL]: '외부활동', // 외부활동
      [Activity_ActivityType.CERTIFICATION]: '자격증', // 자격증
      [Activity_ActivityType.AWARD]: '수상', // 수상
      [Activity_ActivityType.EDUCATION]: '교육', // 교육
      [Activity_ActivityType.ETC]: '기타', // 기타
      [Activity_ActivityType.UNRECOGNIZED]: '미인식', // 미인식
    };
    return labels[type || Activity_ActivityType.UNKNOWN];
  };

  const getActivityTypeBadgeColor = (type?: Activity_ActivityType) => {
    const colors: Record<Activity_ActivityType, string> = {
      [Activity_ActivityType.UNKNOWN]: '#999', // 미분류
      [Activity_ActivityType.INTERNSHIP]: '#2196f3', // 인턴
      [Activity_ActivityType.EXTERNAL]: '#00bcd4', // 외부활동
      [Activity_ActivityType.CERTIFICATION]: '#2196f3', // 자격증
      [Activity_ActivityType.AWARD]: '#ff9800', // 수상
      [Activity_ActivityType.EDUCATION]: '#00bcd4', // 교육
      [Activity_ActivityType.ETC]: '#607d8b', // 기타
      [Activity_ActivityType.UNRECOGNIZED]: '#999', // 미인식
    };
    return colors[type || Activity_ActivityType.UNKNOWN];
  };

  if (!activities || activities.length === 0) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#999'
      }}>
        등록된 활동이 없습니다.
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ 
        marginBottom: '16px', 
        fontSize: '20px', 
        fontWeight: '600', 
        color: '#333' 
      }}>
        활동
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activities.filter(a => a.isVisible !== false).map((activity) => (
          <div
            key={activity.id}
            style={{
              padding: '20px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  padding: '4px 8px',
                  backgroundColor: getActivityTypeBadgeColor(activity.type),
                  color: '#fff',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {getActivityTypeLabel(activity.type)}
                </span>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#333',
                  margin: 0
                }}>
                  {activity.name}
                </h4>
              </div>
              <span style={{
                fontSize: '13px',
                color: '#666',
                whiteSpace: 'nowrap',
                marginLeft: '16px'
              }}>
                {formatDate(activity.startedAt)} ~ {formatDate(activity.endedAt)}
              </span>
            </div>

            {activity.organization && (
              <div style={{ 
                marginBottom: '8px',
                fontSize: '14px',
                color: '#666'
              }}>
                <strong>발급/주최:</strong> {activity.organization}
              </div>
            )}

            {activity.certificateNumber && (
              <div style={{ 
                marginBottom: '8px',
                fontSize: '14px',
                color: '#666'
              }}>
                <strong>자격증 번호:</strong> {activity.certificateNumber}
              </div>
            )}

            {activity.description && (
              <div style={{ 
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                marginTop: '8px'
              }}>
                {activity.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityView;

