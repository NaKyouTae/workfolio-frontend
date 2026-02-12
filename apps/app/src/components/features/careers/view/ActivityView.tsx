import React from 'react';
import { ResumeUpdateRequest_ActivityRequest } from '@workfolio/shared/generated/resume';
import { Activity_ActivityType } from '@workfolio/shared/generated/common';
import DateUtil from '@workfolio/shared/utils/DateUtil';
import { normalizeEnumValue } from '@workfolio/shared/utils/commonUtils';
import EmptyState from '@workfolio/shared/ui/EmptyState';

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
        return '대외활동'; // 대외활동
      case Activity_ActivityType.CERTIFICATION:
        return '자격증'; // 자격증
      case Activity_ActivityType.AWARD:
        return '대회'; // 대회
      case Activity_ActivityType.EDUCATION:
        return '교육'; // 교육
      // case Activity_ActivityType.COMPETITION:
      //   return '대회';
      case Activity_ActivityType.ETC:
        return '기타'; // 기타
      case Activity_ActivityType.UNRECOGNIZED:
        return '미인식'; // 미인식
      default:
        return '';
    }
  };

  const getActivityTypeBgColor = (type?: Activity_ActivityType) => {
    const normalizedType = normalizeEnumValue(type, Activity_ActivityType);
    switch (normalizedType) {
      case Activity_ActivityType.EXTERNAL:
        return '#FDEAE9'; // 대외활동
      case Activity_ActivityType.CERTIFICATION:
        return '#ECFAEE'; // 자격증
      case Activity_ActivityType.AWARD:
        return '#E6F2FF'; // 대회
      case Activity_ActivityType.EDUCATION:
        return '#FFF5E9'; // 교육
      // case Activity_ActivityType.COMPETITION:
      //   return '#AF52DE'; //대회
      case Activity_ActivityType.ETC:
        return '#ECEDEF'; // 기타
      case Activity_ActivityType.UNRECOGNIZED:
        return '#ECEDEF'; // 미인식
      default:
        return '#ECEDEF'; // 미인식
    }
  };

  const getActivityTypeColor = (type?: Activity_ActivityType) => {
    const normalizedType = normalizeEnumValue(type, Activity_ActivityType);
    switch (normalizedType) {
      case Activity_ActivityType.EXTERNAL:
        return '#ff3b30'; // 대외활동
      case Activity_ActivityType.CERTIFICATION:
        return '#34c759'; // 자격증
      case Activity_ActivityType.AWARD:
        return '#007aff'; // 대회
      case Activity_ActivityType.EDUCATION:
        return '#ff9500'; // 교육
      // case Activity_ActivityType.COMPETITION:
      //   return '#AF52DE'; //대회
      case Activity_ActivityType.ETC:
        return '#515c66'; // 기타
      case Activity_ActivityType.UNRECOGNIZED:
        return '#515c66'; // 미인식
      default:
        return '#515c66'; // 미인식
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
                                <li className="font-black">{formatActivityPeriod(activity.startedAt, activity.endedAt)}</li>
                                )
                            }
                            {
                                activity.type && (
                                    <li>
                                        <span className="label" style={{
                                            backgroundColor: getActivityTypeBgColor(activity.type),
                                            color: getActivityTypeColor(activity.type),
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

