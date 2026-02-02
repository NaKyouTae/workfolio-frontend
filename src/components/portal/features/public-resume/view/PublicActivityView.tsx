import React from 'react';
import { Activity, Activity_ActivityType } from '@/generated/common';
import { DateUtil } from '@/utils/DateUtil';
import { normalizeEnumValue } from '@/utils/commonUtils';
import styles from './PublicView.module.css';

interface PublicActivityViewProps {
  activities: Activity[];
}

const PublicActivityView: React.FC<PublicActivityViewProps> = ({ activities }) => {
  const visibleActivities = activities.filter((a) => a.isVisible === true);

  const getActivityTypeLabel = (type?: Activity_ActivityType) => {
    const normalizedType = normalizeEnumValue(type, Activity_ActivityType);
    switch (normalizedType) {
      case Activity_ActivityType.EXTERNAL:
        return '대외활동';
      case Activity_ActivityType.EDUCATION:
        return '교육';
      case Activity_ActivityType.CERTIFICATION:
        return '자격증';
      case Activity_ActivityType.AWARD:
        return '수상';
      case Activity_ActivityType.COMPETITION:
        return '공모전';
      case Activity_ActivityType.ETC:
        return '기타';
      default:
        return '';
    }
  };

  return (
    <div className={styles.viewContainer}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>활동</h2>
      </div>

      <ul className={styles.itemList}>
        {visibleActivities.map((activity) => (
          <li key={activity.id} className={styles.item}>
            <div className={styles.itemHeader}>
              <div className={styles.itemTitleGroup}>
                {activity.name && <h3 className={styles.itemTitle}>{activity.name}</h3>}
                {activity.organization && <span className={styles.itemSubtitle}>{activity.organization}</span>}
              </div>
              <div className={styles.itemMeta}>
                {(activity.startedAt || activity.endedAt) && (
                  <span className={styles.itemPeriod}>
                    {activity.startedAt && DateUtil.formatTimestamp(activity.startedAt, 'YYYY. MM.')}
                    {activity.endedAt && ` - ${DateUtil.formatTimestamp(activity.endedAt, 'YYYY. MM.')}`}
                  </span>
                )}
                {activity.type && (
                  <span className={styles.itemTag}>{getActivityTypeLabel(activity.type)}</span>
                )}
              </div>
            </div>

            {activity.certificateNumber && (
              <div className={styles.itemDetails}>
                <span className={styles.itemDetail}>자격번호: {activity.certificateNumber}</span>
              </div>
            )}

            {activity.description && (
              <p className={styles.itemDescription}>{activity.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicActivityView;
