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
        return '#FF3B30'; // 외부활동
      case Activity_ActivityType.CERTIFICATION:
        return '#FF9500'; // 자격증
      case Activity_ActivityType.AWARD:
        return '#30B0C7'; // 수상
      case Activity_ActivityType.EDUCATION:
        return '#007AFF'; // 교육
      case Activity_ActivityType.COMPETITION:
        return '#AF52DE'; // 대회
      case Activity_ActivityType.ETC:
        return '#B1B9C2'; // 기타
      case Activity_ActivityType.UNRECOGNIZED:
        return '#B1B9C2'; // 미인식
      default:
        return '#B1B9C2'; // 미인식
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
    <>
        <div className="cont-tit">
            <div>
                <h3>활동</h3>
            </div>
        </div>
        
        {(!activities || filteredActivities.length === 0) ? (
            <EmptyState text="등록된 활동 정보가 없습니다." />
        ) : (
        
        <ul className="view-list type1">
        {filteredActivities.map((activity) => (
            <li 
                key={activity.id}
            >
                <div className="info">
                    <div>
                        <div>
                            {
                            activity.type && (
                                <h4>{activity.name}</h4>
                            )
                            }
                            {
                            activity.organization && (
                                <p>{activity.organization}</p>
                            )
                            }
                        </div>
                        <ul>
                            {
                                activity.startedAt && activity.endedAt && (
                                <li className="font-bl">{formatActivityPeriod(activity.startedAt, activity.endedAt)}</li>
                                )
                            }
                            {
                                activity.type && (
                                    <li>
                                        <span className="label" style={{
                                            backgroundColor: getActivityTypeBadgeColor(activity.type),
                                        }}>
                                        {getActivityTypeLabel(activity.type)}
                                        </span>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div className="desc">
                    {
                    activity.certificateNumber && (
                        <p>{`취득번호 ${activity.certificateNumber}`}</p>
                    )
                    }
                    {
                    activity.description && (
                        <p>{activity.description}</p>
                    )
                    }
                </div>
            </li>
        ))}
        </ul>
        )}
    </>
  );
};

export default ActivityView;

