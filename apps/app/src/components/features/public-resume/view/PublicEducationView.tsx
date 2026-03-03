import React from 'react';
import { Education } from '@workfolio/shared/generated/common';
import { DateUtil } from '@workfolio/shared/utils/DateUtil';
import { getEducationStatusLabel } from '../shared/formatters';
import styles from './PublicView.module.css';

interface PublicEducationViewProps {
  educations: Education[];
}

const PublicEducationView: React.FC<PublicEducationViewProps> = ({ educations }) => {
  const visibleEducations = educations.filter((e) => e.isVisible === true);

  return (
    <div className={styles.viewContainer}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>학력</h2>
      </div>

      <ul className={styles.itemList}>
        {visibleEducations.map((education) => (
          <li key={education.id} className={styles.item}>
            <div className={styles.itemHeader}>
              <div className={styles.itemTitleGroup}>
                {education.name && <h3 className={styles.itemTitle}>{education.name}</h3>}
                {education.major && <span className={styles.itemSubtitle}>{education.major}</span>}
              </div>
              <div className={styles.itemMeta}>
                {(education.startedAt || education.endedAt) && (
                  <span className={styles.itemPeriod}>
                    {education.startedAt && DateUtil.formatTimestamp(education.startedAt, 'YYYY. MM.')}
                    {education.endedAt && ` - ${DateUtil.formatTimestamp(education.endedAt, 'YYYY. MM.')}`}
                  </span>
                )}
                {education.status && (
                  <span className={styles.itemTag}>{getEducationStatusLabel(education.status)}</span>
                )}
              </div>
            </div>

            {education.description && (
              <p className={styles.itemDescription}>{education.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicEducationView;
