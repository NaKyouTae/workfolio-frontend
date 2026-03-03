import React from 'react';
import { Career, Salary } from '@workfolio/shared/generated/common';
import { DateUtil } from '@workfolio/shared/utils/DateUtil';
import {
  getEmploymentTypeLabel,
  formatCareerPeriod,
  calculateTotalCareerPeriod,
} from '../shared/formatters';
import styles from './PublicView.module.css';

interface PublicCareerViewProps {
  careers: Career[];
}

const PublicCareerView: React.FC<PublicCareerViewProps> = ({ careers }) => {
  const visibleCareers = careers.filter((c) => c.isVisible === true);
  const totalPeriod = calculateTotalCareerPeriod(visibleCareers);

  return (
    <div className={styles.viewContainer}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>경력</h2>
        {totalPeriod && <span className={styles.sectionBadge}>{totalPeriod}</span>}
      </div>

      <ul className={styles.itemList}>
        {visibleCareers.map((career) => {
          const visibleSalaries = (career.salaries || []).filter((s: Salary) => s.isVisible === true);
          return (
          <li key={career.id} className={styles.item}>
            <div className={styles.itemHeader}>
              <div className={styles.itemTitleGroup}>
                {career.name && <h3 className={styles.itemTitle}>{career.name}</h3>}
                {career.position && <span className={styles.itemSubtitle}>{career.position}</span>}
              </div>
              <div className={styles.itemMeta}>
                <span className={styles.itemPeriod}>
                  {formatCareerPeriod(career.startedAt, career.endedAt, career.isWorking)}
                </span>
                {career.employmentType && (
                  <span className={styles.itemTag}>{getEmploymentTypeLabel(career.employmentType)}</span>
                )}
              </div>
            </div>

            <div className={styles.itemDetails}>
              {career.department && (
                <span className={styles.itemDetail}>{career.department}</span>
              )}
              {career.jobTitle && (
                <span className={styles.itemDetail}>{career.jobTitle}</span>
              )}
            </div>

            {career.salary != null && career.salary > 0 && (
              <p className={styles.itemDescription}>
                연봉 {Number(career.salary).toLocaleString('ko-KR')}만 원
              </p>
            )}

            {visibleSalaries.length > 0 && (
              <ul className={styles.subList}>
                {visibleSalaries
                  .sort((a, b) => (b.negotiationDate || 0) - (a.negotiationDate || 0))
                  .map((salary) => (
                    <li key={salary.id} className={styles.subItem}>
                      <span className={styles.subItemName}>
                        {salary.amount != null && salary.amount > 0 && (
                          <>연봉 {Number(salary.amount).toLocaleString('ko-KR')}만 원</>
                        )}
                        {salary.memo && ` ${salary.memo}`}
                      </span>
                      {salary.negotiationDate && (
                        <span className={styles.subItemDate}>
                          {DateUtil.formatTimestamp(salary.negotiationDate, 'YYYY. MM. DD.')}
                        </span>
                      )}
                    </li>
                  ))}
              </ul>
            )}

            {career.description && (
              <p className={styles.itemDescription}>{career.description}</p>
            )}
          </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PublicCareerView;
