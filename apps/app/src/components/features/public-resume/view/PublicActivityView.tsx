import React from 'react';
import { Activity } from '@workfolio/shared/generated/common';
import { DateUtil } from '@workfolio/shared/utils/DateUtil';
import { getActivityTypeLabel } from '../shared/formatters';
import styles from './PublicView.module.css';

interface PublicActivityViewProps {
  activities: Activity[];
}

const PublicActivityView: React.FC<PublicActivityViewProps> = ({ activities }) => {
  const visibleActivities = activities.filter((a) => a.isVisible === true);

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
