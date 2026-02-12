import React from 'react';
import { Education, Education_EducationStatus } from '@workfolio/shared/generated/common';
import { DateUtil } from '@workfolio/shared/utils/DateUtil';
import { normalizeEnumValue } from '@workfolio/shared/utils/commonUtils';
import styles from './PublicView.module.css';

interface PublicEducationViewProps {
  educations: Education[];
}

const PublicEducationView: React.FC<PublicEducationViewProps> = ({ educations }) => {
  const visibleEducations = educations.filter((e) => e.isVisible === true);

  const getStatusLabel = (status?: Education_EducationStatus) => {
    const normalizedStatus = normalizeEnumValue(status, Education_EducationStatus);
    switch (normalizedStatus) {
      case Education_EducationStatus.GRADUATED:
        return '졸업';
      case Education_EducationStatus.GRADUATING:
        return '졸업예정';
      case Education_EducationStatus.ENROLLED:
        return '재학';
      case Education_EducationStatus.DROPPED_OUT:
        return '중퇴';
      case Education_EducationStatus.COMPLETED:
        return '수료';
      case Education_EducationStatus.ON_LEAVE:
        return '휴학';
      default:
        return '';
    }
  };

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
                  <span className={styles.itemTag}>{getStatusLabel(education.status)}</span>
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
