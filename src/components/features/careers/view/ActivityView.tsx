import React from 'react';
import { ResumeUpdateRequest_ActivityRequest } from '@/generated/resume';
import { Activity_ActivityType } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';
import { normalizeEnumValue } from '@/utils/commonUtils';
import EmptyState from '@/components/ui/EmptyState';

interface ActivityViewProps {
  activities: ResumeUpdateRequest_ActivityRequest[];
  showHidden?: boolean;
}

/**
 * 활동 정보 읽기 전용 컴포넌트
 */
const ActivityView: React.FC<ActivityViewProps> = ({ activities, showHidden = false }) => {
  const getActivityTypeLabel = (type?: Activity_ActivityType) => {
    const normalizedType = normalizeEnumValue(type, Activity_ActivityType);
    switch (normalizedType) {
      case Activity_ActivityType.EXTERNAL:
        return '외부활동'; // 외부활동
      case Activity_ActivityType.CERTIFICATION:
        return '자격증'; // 자격증
      case Activity_ActivityType.AWARD:
        return '수상'; // 수상
      case Activity_ActivityType.EDUCATION:
        return '교육'; // 교육
      case Activity_ActivityType.COMPETITION:
        return '대회'; // 대회
      case Activity_ActivityType.ETC:
        return '기타'; // 기타
      case Activity_ActivityType.UNRECOGNIZED:
        return '미인식'; // 미인식
      default:
        return '';
    }
  };

  const getActivityTypeBadgeColor = (type?: Activity_ActivityType) => {
    const normalizedType = normalizeEnumValue(type, Activity_ActivityType);
    switch (normalizedType) {
      case Activity_ActivityType.EXTERNAL:
        return '#00bcd4'; // 외부활동
      case Activity_ActivityType.CERTIFICATION:
        return '#2196f3'; // 자격증
      case Activity_ActivityType.AWARD:
        return '#ff9800'; // 수상
      case Activity_ActivityType.EDUCATION:
        return '#00bcd4'; // 교육
      case Activity_ActivityType.COMPETITION:
        return '#00bcd4'; // 대회
      case Activity_ActivityType.ETC:
        return '#607d8b'; // 기타
      case Activity_ActivityType.UNRECOGNIZED:
        return '#999'; // 미인식
      default:
        return '#999'; // 미인식
    }
  };

  // 활동 기간 표시
  const formatActivityPeriod = (startedAt?: number, endedAt?: number) => {
    const startDate = DateUtil.formatTimestamp(startedAt || 0, 'YYYY. MM. DD.');
    
    if (!endedAt) {
      return startDate;
    }
    
    const endDate = DateUtil.formatTimestamp(endedAt, 'YYYY. MM. DD.');
    return `${startDate} - ${endDate}`;
  };

  // 필터링된 활동 목록 (한 번만 필터링)
  const filteredActivities = activities.filter(a => showHidden ? true : a.isVisible !== false);

  return (
    <div>
      <h3 style={{ 
        fontSize: '16px', 
        fontWeight: '700', 
        color: '#000',
        marginBottom: '20px'
      }}>
        활동
      </h3>
      
      {(!activities || filteredActivities.length === 0) ? (
        <EmptyState text="등록된 활동 정보가 없습니다." />
      ) : (
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {filteredActivities.map((activity) => (
          <div 
            key={activity.id}
            style={{
              padding: '20px',
              border: '1px solid #e0e0e0',
              marginBottom: '16px'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'baseline',
              marginBottom: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '12px'
                }}>
                  {
                    activity.type && (
                      <h4 style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: '#333',
                        margin: 0
                      }}>
                        {activity.name}
                      </h4>
                    )
                  }
                  
                  {
                    activity.organization && (
                      <span style={{
                        fontSize: '13px',
                        color: activity.organization ? '#999' : '#ddd',
                        whiteSpace: 'nowrap'
                      }}>
                        {activity.organization}
                      </span>
                    )
                  }
                  
                </div>
              </div>
              <div>
                {
                  activity.startedAt && activity.endedAt && (
                    <span style={{
                      fontSize: '13px',
                      color: '#999',
                      whiteSpace: 'nowrap',
                      marginLeft: '16px'
                    }}>
                      {formatActivityPeriod(activity.startedAt, activity.endedAt)}
                    </span>
                  )
                }
                {
                  activity.type && (
                    <>  
                      <span style={{
                        fontSize: '13px',
                        color: '#999',
                        whiteSpace: 'nowrap',
                        marginLeft: '8px',
                        marginRight: '8px',
                      }}>|</span>
                      <span style={{
                        padding: '2px 8px',
                        backgroundColor: getActivityTypeBadgeColor(activity.type),
                        color: '#fff',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {getActivityTypeLabel(activity.type)}
                      </span>
                    </>
                  )
                }
              </div>
            </div>
            {
              activity.certificateNumber && (
                <div style={{ 
                  fontSize: '14px',
                  color: activity.certificateNumber ? '#666' : '#ddd',
                  marginBottom: '4px'
                }}>
                  {`취득번호 ${activity.certificateNumber}`}
                </div>
              )
            }
            {
              activity.description && (
                <div style={{ 
                  fontSize: '14px',
                  color: activity.description ? '#666' : '#ddd',
                  marginBottom: '4px'
                }}>
                  {activity.description}
                </div>
              )
            }
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default ActivityView;

